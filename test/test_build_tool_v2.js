/*
 * test_build_tool_v2.js — build-tool v2 装饰器（@Redirect/@WrapOperation/@ModifyArg）
 * 全链路测试：build → 产物 → 注册进 runtime → 变换 → 沙箱执行验证语义。
 * 运行：node test/test_build_tool_v2.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

global.acorn = require('../vendor/acorn.js');
require('../runtime/mixinAst.js');
require('../runtime/mixinTransformer.js');

var build = require('../build-tool/build.js');

var failures = 0;
function check(name, cond, detail) {
    if (cond) console.log('  PASS ' + name);
    else { console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); failures++; }
}

console.log('== build-tool: v2-mod（@Redirect/@WrapOperation/@ModifyArg） ==');
var projDir = path.join(__dirname, 'fixtures/v2-mod');
var result = build.runBuild(projDir);
check('构建成功', result.ok, JSON.stringify(result).slice(0, 300));
check('生成 3 个 patch', result.ok && result.patchCount === 3, result.patchCount);

var patchesSrc = fs.readFileSync(path.join(projDir, 'dist/patches.js'), 'utf8');
check('产物含 redirect op', patchesSrc.indexOf('"op": "redirect"') > 0 || patchesSrc.indexOf('"op":"redirect"') > 0);
check('产物含 wrapCall op', patchesSrc.indexOf('"op": "wrapCall"') > 0 || patchesSrc.indexOf('"op":"wrapCall"') > 0);
check('产物含 modifyArg op', patchesSrc.indexOf('"op": "modifyArg"') > 0 || patchesSrc.indexOf('"op":"modifyArg"') > 0);

// 注册进 runtime 实际变换，然后沙箱执行验证语义
patchesSrc.replace('window.__mixin.register', 'globalThis.__mixin.register');
eval(patchesSrc.replace(/window\.__mixin\.register/g, 'globalThis.__mixin.register'));

var gameSrc = fs.readFileSync(path.join(projDir, 'game/sample-es6.js'), 'utf8');
var out = global.__mixinTransform('sample-es6.js', gameSrc);
check('变换生效（3 patch 全部应用）', out !== gameSrc);

var g = {};
var modObj = { exports: {} };
new Function('globalThis', 'module', 'exports', out)(g, modObj, modObj.exports);
g.module = modObj;
check('redirect 语义（helper(1) → 10，+10 = 20）', g.module.exports.calc() === 20, String(g.module.exports.calc()));
check('wrapCall 语义（helper(2+1)=4，+10 = 14）', g.module.exports.calc2() === 14, String(g.module.exports.calc2()));
check('modifyArg 语义（helper(3+100)=104，+10 = 114）', g.module.exports.calc3() === 114, String(g.module.exports.calc3()));
check('原 helper 未被破坏（+1）', g.module.exports.helper(5) === 6, String(g.module.exports.helper(5)));

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
