"""
build_dex.py — 把 android-modfs/src 编译成 ModFs.dex（供 APK 组装线合并为 classes3.dex）

依赖：JDK(javac) + Android build-tools(d8) + platforms/android-34/android.jar
产物：android-modfs/ModFs.dex

用法：python build_dex.py
"""
import os, subprocess, sys, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'src')
OUT_CLS = os.path.join(HERE, 'build-classes')
OUT_DEX = os.path.join(HERE, 'ModFs.dex')
ANDROID_JAR = r'D:\Android\Sdk\platforms\android-34\android.jar'
D8 = r'D:\Android\Sdk\build-tools\34.0.0\d8.bat'

sys.stdout.reconfigure(encoding='utf-8')

for tool, p in [('android.jar', ANDROID_JAR), ('d8', D8)]:
    if not os.path.exists(p):
        sys.exit('missing %s: %s' % (tool, p))

if os.path.exists(OUT_CLS):
    shutil.rmtree(OUT_CLS)
os.makedirs(OUT_CLS)

print('[1] javac ...')
r = subprocess.run([
    'javac', '-source', '8', '-target', '8',
    '-bootclasspath', ANDROID_JAR,
    '-d', OUT_CLS,
    os.path.join(SRC, 'layaair', 'game', 'mod', 'ModFs.java'),
    os.path.join(SRC, 'layaair', 'game', 'mod', 'ModFsActivity.java'),
], capture_output=True, text=True, encoding="gbk", errors="replace")
if r.returncode != 0:
    print(r.stdout); print(r.stderr)
    sys.exit('javac failed')
for w in ('warning', '警告'):
    if w in (r.stderr or ''):
        print('[warn]', r.stderr.strip()[:500])

print('[2] d8 ...')
cls_files = []
for root, _, files in os.walk(OUT_CLS):
    for f in files:
        if f.endswith('.class'):
            cls_files.append(os.path.join(root, f))
r = subprocess.run([
    D8, '--release', '--lib', ANDROID_JAR,
    '--output', HERE,
] + cls_files, capture_output=True, text=True, encoding="gbk", errors="replace")
if r.returncode != 0:
    print(r.stdout); print(r.stderr)
    sys.exit('d8 failed')

os.replace(os.path.join(HERE, 'classes.dex'), OUT_DEX)
shutil.rmtree(OUT_CLS)
print('OK:', OUT_DEX, os.path.getsize(OUT_DEX), 'bytes')
