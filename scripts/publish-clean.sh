#!/bin/bash
# publish-clean.sh — 把当前开发分支的"干净子集"同步到 GitHub 公开 main 分支。
#
# 干净规则（公开树剔除以下路径）：
#   tools/                      namemap 逆向数据 + APK 组装线（游戏衍生，永不公开）
#   test/fixtures/real-mod      真实游戏目标夹具
#   mixins/                     base-loader 组装线（patch_bundle 内含游戏 patch）
#   docs/DESIGN-v1-layanative.md / DESIGN-layout.md / DESIGN-target.md  v1 内部文档
# 另：test/test_mixin_ast.js 第二节（可选真实样本回归）在公开树中替换为中性 stub。
#
# 用法：bash scripts/publish-clean.sh "提交说明"
# 行为：以 origin/main 当前提交为父提交，追加一个"当前 HEAD 干净树"的提交并推送。
#       首次（origin/main 为 v1 基线时）会 force 覆盖。
set -e
cd "$(dirname "$0")/.."
MSG="${1:-sync: dev branch -> public main}"
EXCLUDE="tools test/fixtures/real-mod docs/DESIGN-v1-layanative.md DESIGN-layout.md DESIGN-target.md mixins"

IDX=.git/publish-index
TMP=.git/publish-tmp.js
export GIT_INDEX_FILE=$IDX
trap 'rm -f $IDX $TMP; unset GIT_INDEX_FILE' EXIT
rm -f "$IDX" "$TMP"

git read-tree HEAD
git rm --cached -r -q --ignore-unmatch $EXCLUDE

# test_mixin_ast.js：第一节原样保留；第二节（从 "/* ---------- 2." 起）替换为中性 stub
L=$(grep -n '^/\* ---------- 2\.' test/test_mixin_ast.js | cut -d: -f1)
head -n $((L-1)) test/test_mixin_ast.js > "$TMP"
cat >> "$TMP" <<'EOF'
/* ---------- 2. 可选：本地真实目标样本（公开仓库不含样本文件，自动跳过） ---------- */
// 本地开发者如需大文件回归（module/name/anchor 定位、哈希锁、批量快路径），
// 自备样本并参照第 1 节的写法补充断言；本公开版本只保留跳过分支。
var realPath = process.env.JSMIXIN_REAL_SAMPLE || '';
if (realPath && fs.existsSync(realPath)) {
    console.log('== 大文件样本 ==（已提供样本：公开版不含针对样本的断言，跳过）');
} else {
    console.log('== 大文件样本 ==（跳过：未提供 JSMIXIN_REAL_SAMPLE）');
}

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
EOF
node --check "$TMP"
BLOB=$(git hash-object -w "$TMP")
git update-index --cacheinfo 100644,$BLOB,test/test_mixin_ast.js

TREE=$(git write-tree)

# 安全闸门：公开树里出现游戏衍生关键词则中止（排除本脚本——闸门模式本身含这些词）
if git grep -l -E "派对制造|pdzz|秒后重试|noads|keystore|apktool|pdzzapksworkspace" "$TREE" -- ':!scripts/publish-clean.sh' >/dev/null 2>&1; then
    echo "ABORT: 公开树命中敏感关键词，请检查：" >&2
    git grep -n -E "派对制造|pdzz|秒后重试|noads|keystore|apktool|pdzzapksworkspace" "$TREE" -- ':!scripts/publish-clean.sh' >&2
    exit 1
fi

PARENT=$(git rev-parse --verify -q refs/remotes/origin/main || true)
if [ -n "$PARENT" ]; then
    COMMIT=$(git commit-tree "$TREE" -p "$PARENT" -m "$MSG")
else
    COMMIT=$(git commit-tree "$TREE" -m "$MSG")
fi

git push -f origin "$COMMIT:refs/heads/main"
echo "pushed $COMMIT -> origin/main (parent: ${PARENT:-none})"
