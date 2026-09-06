"""
build_mixin_apk.py — mixin 测试 APK 组装

1. 拼接 runtime bundle：vendor/acorn.js + runtime/mixinAst.js + runtime/mixinTransformer.js
   （C++ 端只认一个 scripts/mixin/mixinTransformer.js，拼接后无需重编 .so）
2. 注入 bundle + mixins/base-loader/patch_bundle.js 到基座 APK 的 assets/scripts/mixin/
3. 调用 pdzzapksworkspace/scripts/repack_with_engine.py 替换 liblayaair.so（arm64）
   并 zipalign + apksigner 签名

用法:
  python build_mixin_apk.py <liblayaair.so> [out.apk]
"""
import os, sys, zipfile, subprocess

JS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # jsmixin
WS = r'D:\Projects\battlecraft\pdzzapksworkspace'
REPACK = os.path.join(WS, 'scripts', 'repack_with_engine.py')
BASE_APK = os.path.join(WS, '派对制造_noads.apk')
STAGE = os.path.join(WS, '_ws_mixin_base.apk')

sys.stdout.reconfigure(encoding='utf-8')

if len(sys.argv) < 2:
    sys.exit('usage: build_mixin_apk.py <liblayaair.so> [out.apk]')
NEW_SO = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(WS, '派对制造_mixin_test.apk')

RUNTIME_PARTS = [
    os.path.join(JS, 'vendor', 'acorn.js'),
    os.path.join(JS, 'runtime', 'mixinAst.js'),
    os.path.join(JS, 'runtime', 'mixinTransformer.js'),
]
PATCH_BUNDLE = os.path.join(JS, 'mixins', 'base-loader', 'patch_bundle.js')

for p in RUNTIME_PARTS + [PATCH_BUNDLE]:
    if not os.path.exists(p):
        sys.exit('missing: ' + p)
if not os.path.exists(NEW_SO):
    sys.exit('missing so: ' + NEW_SO)
if not os.path.exists(BASE_APK):
    sys.exit('missing base apk: ' + BASE_APK)

# --- 1. 拼接 runtime bundle ---
bundle = b''
for p in RUNTIME_PARTS:
    part = open(p, 'rb').read()
    if not part.endswith(b'\n'):
        part += b'\n'
    bundle += part
    print('part:', os.path.relpath(p, JS), len(part), 'bytes')
print('runtime bundle total:', len(bundle), 'bytes')

# --- 2. 注入 mixin assets（追加条目；重跑先删产物）---
if os.path.exists(STAGE):
    os.remove(STAGE)
import shutil
shutil.copyfile(BASE_APK, STAGE)
ASSETS = [
    ('assets/scripts/mixin/mixinTransformer.js', bundle),
    ('assets/scripts/mixin/patch_bundle.js', open(PATCH_BUNDLE, 'rb').read()),
]
with zipfile.ZipFile(STAGE, 'a') as z:
    for entry, data in ASSETS:
        zi = zipfile.ZipInfo(entry, date_time=(2026, 9, 6, 0, 0, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, data)
        print('injected:', entry, len(data), 'bytes')
with zipfile.ZipFile(STAGE) as z:
    for entry, _ in ASSETS:
        assert z.getinfo(entry).file_size > 0

# --- 3. 换 so + 对齐 + 签名 ---
r = subprocess.run([sys.executable, REPACK, NEW_SO, OUT, STAGE])
sys.exit(r.returncode)
