"""
build_mixin_apk.py — mixin 测试 APK 组装（含外部 mod 装载支持）

1. [一次性] 准备 modbase APK：apktool 解包 noads 基座 → manifest 合并
   （ModFsActivity 声明 + requestLegacyExternalStorage）→ 回打包。
   产物 WS/派对制造_noads_modbase.apk；存在则跳过（改 manifest 后删掉它重跑）。
2. 拼接 runtime bundle：vendor/acorn.js + runtime/mixinAst.js + runtime/mixinTransformer.js
   （C++ 端只认一个 scripts/mixin/mixinTransformer.js，拼接后无需重编 .so）
3. 注入 bundle + base-loader（patch_bundle.js + loader.js）+ 额外 mod patch
   到基座 APK 的 assets/scripts/mixin/；ModFs.dex 合并为 classes3.dex
   （外部 mod 存储授权的 Java 辅助类，见 android-modfs/）
4. 调用 pdzzapksworkspace/scripts/repack_with_engine.py 替换 liblayaair.so（arm64）
   并 zipalign + apksigner 签名

用法:
  python build_mixin_apk.py <liblayaair.so> [out.apk]
"""
import os, sys, zipfile, subprocess, shutil

JS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # jsmixin
WS = r'D:\Projects\battlecraft\pdzzapksworkspace'
REPACK = os.path.join(WS, 'scripts', 'repack_with_engine.py')
NOADS_APK = os.path.join(WS, '派对制造_noads.apk')
MODBASE_APK = os.path.join(WS, '派对制造_noads_modbase.apk')
APKTOOL_WORK = os.path.join(WS, '_ws_noads_apktool')
APKTOOL_JAR = os.path.join(JS, 'tools', 'bin', 'apktool.jar')
MODFS_DEX = os.path.join(JS, 'android-modfs', 'ModFs.dex')
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
LOADER = os.path.join(JS, 'mixins', 'base-loader', 'loader.js')
# 额外 mod 的 patch 产物（存在才合并，按序追加执行——都是独立的 register 调用）
EXTRA_PATCH_FILES = [
    r'D:\Projects\battlecraft\pdzzmoddeveloper\prism-mod\dist\patches.js',
]


def die(msg):
    print('FATAL:', msg); sys.exit(1)


def read(p):
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()


def write(p, s):
    with open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write(s)


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.stdout:
        print(r.stdout[-1500:])
    if r.stderr:
        print(r.stderr[-1500:])
    return r


# --- 0. [一次性] modbase：manifest 合并 ModFsActivity + legacy 存储标记 ---
def ensure_modbase():
    if os.path.exists(MODBASE_APK):
        print('[0] modbase 已存在，跳过 apktool 阶段:', MODBASE_APK)
        return
    if not os.path.exists(NOADS_APK):
        die('missing base apk: ' + NOADS_APK)
    if not os.path.exists(APKTOOL_JAR):
        die('missing apktool jar: ' + APKTOOL_JAR)
    if os.path.exists(APKTOOL_WORK):
        shutil.rmtree(APKTOOL_WORK)
    print('[0] apktool decode (no-res) ...')
    r = run(['java', '-jar', APKTOOL_JAR, 'd', '-f',
             '-o', APKTOOL_WORK, NOADS_APK])
    if r.returncode != 0:
        die('apktool decode failed')
    mf = os.path.join(APKTOOL_WORK, 'AndroidManifest.xml')
    t = read(mf)
    # a. application 加 requestLegacyExternalStorage（Android 11 设备兜住旧版模式）
    if 'requestLegacyExternalStorage' not in t:
        idx = t.index('<application ')
        end = t.index('>', idx)
        t = t[:end] + ' android:requestLegacyExternalStorage="true"' + t[end:]
        print('[0] manifest: requestLegacyExternalStorage=true')
    # b. </application> 前声明 ModFsActivity（透明授权对话框载体）
    if 'ModFsActivity' in t:
        die('ModFsActivity already declared')
    act = ('    <activity android:name="layaair.game.mod.ModFsActivity"\n'
           '        android:exported="false"\n'
           '        android:theme="@android:style/Theme.Translucent.NoTitleBar"/>\n')
    t = t.replace('</application>', act + '</application>', 1)
    write(mf, t)
    print('[0] manifest: ModFsActivity declared')
    print('[0] apktool build ...')
    r = run(['java', '-jar', APKTOOL_JAR, 'b', APKTOOL_WORK, '-o', MODBASE_APK])
    if r.returncode != 0 or not os.path.exists(MODBASE_APK):
        die('apktool build failed')
    print('[0] modbase ok:', MODBASE_APK, os.path.getsize(MODBASE_APK), 'bytes')


ensure_modbase()
BASE_APK = MODBASE_APK

for p in RUNTIME_PARTS + [PATCH_BUNDLE, LOADER, MODFS_DEX]:
    if not os.path.exists(p):
        die('missing: ' + p)
if not os.path.exists(NEW_SO):
    die('missing so: ' + NEW_SO)

# --- 1. 拼接 runtime bundle ---
bundle = b''
for p in RUNTIME_PARTS:
    part = open(p, 'rb').read()
    if not part.endswith(b'\n'):
        part += b'\n'
    bundle += part
    print('part:', os.path.relpath(p, JS), len(part), 'bytes')
print('runtime bundle total:', len(bundle), 'bytes')

# --- 2. 注入 mixin assets + dex（追加条目；重跑先删产物）---
if os.path.exists(STAGE):
    os.remove(STAGE)
shutil.copyfile(BASE_APK, STAGE)

patch_data = open(PATCH_BUNDLE, 'rb').read()
loader_part = open(LOADER, 'rb').read()
if not patch_data.endswith(b'\n'):
    patch_data += b'\n'
patch_data += loader_part
print('loader merged:', os.path.basename(LOADER), len(loader_part), 'bytes')
for extra in EXTRA_PATCH_FILES:
    if os.path.exists(extra):
        part = open(extra, 'rb').read()
        if not patch_data.endswith(b'\n'):
            patch_data += b'\n'
        patch_data += part
        print('patch merged:', os.path.basename(extra), len(part), 'bytes')
    else:
        print('patch skip (missing):', extra)

ASSETS = [
    ('assets/scripts/mixin/mixinTransformer.js', bundle),
    ('assets/scripts/mixin/patch_bundle.js', patch_data),
]
with zipfile.ZipFile(STAGE, 'a') as z:
    existing = set(z.namelist())
    for entry, data in ASSETS:
        zi = zipfile.ZipInfo(entry, date_time=(2026, 9, 6, 0, 0, 0))
        zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = 0o100644 << 16
        z.writestr(zi, data)
        print('injected:', entry, len(data), 'bytes')
    # --- 3. ModFs.dex → classes3.dex（外部 mod 存储授权 Java 辅助类）---
    dex_entry = 'classes3.dex'
    if dex_entry in existing:
        die('collision: ' + dex_entry + ' already in base apk')
    dex_data = open(MODFS_DEX, 'rb').read()
    zi = zipfile.ZipInfo(dex_entry, date_time=(2026, 9, 6, 0, 0, 0))
    zi.compress_type = zipfile.ZIP_DEFLATED
    zi.external_attr = 0o100644 << 16
    z.writestr(zi, dex_data)
    print('injected:', dex_entry, len(dex_data), 'bytes')
with zipfile.ZipFile(STAGE) as z:
    for entry, _ in ASSETS + [(dex_entry, None)]:
        assert z.getinfo(entry).file_size > 0

# --- 4. 换 so + 对齐 + 签名 ---
r = subprocess.run([sys.executable, REPACK, NEW_SO, OUT, STAGE])
sys.exit(r.returncode)
