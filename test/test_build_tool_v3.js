/*
 * test_build_tool_v3.js — v2.1 全特性全链路测试：
 *   op 级 method / 可取消注入 / @ModifyReturnValue / @ModifyExpressionValue(call+find)
 *   / @ModifyArgs / @Export writable / @Share+@Local（构建期校验）
 * 运行：node test/test_build_tool_v3.js
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

console.log('== build-tool: v3-mod（method 参数 + A1~A4 新语义） ==');
var projDir = path.join(__dirname, 'fixtures/v3-mod');
var result = build.runBuild(projDir);
check('构建成功', result.ok, JSON.stringify(result).slice(0, 600));
check('生成 10 个 patch', result.ok && result.patchCount === 10, result.patchCount);

var patchesSrc = fs.readFileSync(path.join(projDir, 'dist/patches.js'), 'utf8');
['"op": "inject"', '"op": "wrap"', '"op": "modifyReturn"', '"op": "wrapValue"', '"op": "modifyArgs"', '"cancellable": true']
    .forEach(function (sym) {
        check('产物含 ' + sym, patchesSrc.indexOf(sym) > 0);
    });
check('产物含可写导出 defineProperty', patchesSrc.indexOf('Object.defineProperty') > 0);

// 注册进 runtime → 变换 → 沙箱执行
eval(patchesSrc.replace(/window\.__mixin\.register/g, 'globalThis.__mixin.register'));

var gameSrc = fs.readFileSync(path.join(projDir, 'game/sample-es6.js'), 'utf8');
var out = global.__mixinTransform('sample-es6.js', gameSrc);
check('变换生效', out !== gameSrc);

var modObj = { exports: {} };
var winObj = {}; // 可写导出落在 window.__mixin_exports（模拟 LayaNative/浏览器全局）
var logs = [];
new Function('globalThis', 'console', 'module', 'exports', 'window', out)(
    {}, { log: function () { logs.push(Array.prototype.join.call(arguments, ' ')); } }, modObj, modObj.exports, winObj);
var m = modObj.exports;

/* ① op 级 method */
var tickRes = new m.Cls().tick();
check('① @Inject({method:"tick"}) 命中', logs.join('|').indexOf('[v3] tick enter') >= 0, logs.join('|'));
check('① 原语义保留', tickRes === 'tick-run', String(tickRes));
check('① @Wrap({method:"dist"}) 命中（2*2+100）', new m.Cls().dist(2) === 104, String(new m.Cls().dist(2)));

/* ② 可取消注入 */
var gateForce = m.gate('force');
check('② cancellable：命中取消分支', gateForce === 'cancelled', String(gateForce));
check('② cancellable：未取消走原逻辑', m.gate(1) === 'opened:1', String(m.gate(1)));

/* ③ ModifyReturnValue */
check('③ 返回值包装（11*2=22）', m.counter() === 22, String(m.counter()));

/* ④ ModifyExpressionValue */
check('④ call 形态（helper(2)=3 → 30；helper(1)=2 原样 → 32）', m.caller() === 32, String(m.caller()));
check('④ find 形态 + ⑤ ModifyArgs（helper(1)→helper(6)=7；helper(2)=3+1000 → 1010）',
    m.caller2() === 1010, String(m.caller2()));

/* ⑦ Share/Local */
var c2First = m.counter2(); // 首次执行触发 tail 注入日志（声明 total / 读取 bonus、total）
check('⑦ share/local：tail 注入读到 head 注入与原函数的变量',
    logs.join('|').indexOf('counter2 tail: bonus=5 total=42') >= 0, logs.join('|'));
check('⑦ 原语义保留', c2First === 7 && m.counter2() === 7, String(c2First));

/* ⑥ Export writable */
var exported = winObj.__mixin_exports || {};
check('⑥ 初始导出为原 step 函数', exported.stepFn && exported.stepFn() === 'step-run', String(exported.stepFn));
exported.stepFn = function () { return 'replaced'; };
check('⑥ 可写导出：写回闭包绑定（echoStep 调到新函数）', m.echoStep() === 'replaced', String(m.echoStep()));

console.log('== build-tool: v3-bad-mod（负向：构建必须失败且报错可见） ==');
var bad = build.runBuild(path.join(__dirname, 'fixtures/v3-bad-mod'));
check('构建失败', bad.ok === false);
var allErr = (bad.errors || []).join('\n');
check('报错含 @Local 不存在', /@Local "nope" 在目标函数内不存在/.test(allErr), allErr.slice(0, 300));
check('报错含 method 冲突', /method 与 target\.method 同时存在/.test(allErr), allErr.slice(0, 300));
check('报错含 @Share 未声明', /@Share "ghost" 未被本注入体声明/.test(allErr), allErr.slice(0, 300));

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
