/*
 * test_mixin_ast.js — Node 自测
 *   1. 小样例单元测试：module/name/anchor/method 段 + inject/overwrite/wrap op
 *   2. 真实 main.min.js：定位模块 625、XS、'秒后重试' 函数，验证唯一性与编辑
 * 运行：node test/test_mixin_ast.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

// 模拟游戏环境：无 module/exports，acorn 挂 global
global.acorn = require('../vendor/acorn.js');
require('../runtime/mixinAst.js');
require('../runtime/mixinTransformer.js');

var __mixinAst = global.__mixinAst;
var assert = require('assert');

var failures = 0;
function check(name, cond, detail) {
    if (cond) console.log('  PASS ' + name);
    else { console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); failures++; }
}

/* ---------- 1. 单元测试 ---------- */
console.log('== 单元测试 ==');
var sample = [
    '({42:function(){',
    '  function helper(x) { return x + 1; }',
    '  var boot = function () {',
    '    var msg = "hello-inner";',
    '    function inner(a, b) { return helper(a) + b; }',
    '    return inner(1, 2);',
    '  };',
    '  function Cls() { this.x = 1; }',
    '  reg(Cls, [{ key: "createChildren", value: function () { return "createChildren-run"; } }]);',
    '  boot();',
    '}})[42]();'
].join('\n');

var I = __mixinAst._internals;

// module 段
var r = I.resolvePath(require('../vendor/acorn.js').parse(sample, { ecmaVersion: 'latest' }), [{ module: '42' }], sample);
check('resolve module 42', !r.error, r.error);

// name 段：boot
r = I.resolvePath(require('../vendor/acorn.js').parse(sample, { ecmaVersion: 'latest' }), [{ module: '42' }, { name: 'boot' }], sample);
check('resolve name boot', !r.error && r.node.params.length === 0, r.error);

// anchor 段：调用锚点定位 inner（其外层是 boot，inner 调用了 helper）
r = I.resolvePath(require('../vendor/acorn.js').parse(sample, { ecmaVersion: 'latest' }),
    [{ module: '42' }, { name: 'boot' }, { anchor: { calls: ['helper'], params: 2 } }], sample);
check('resolve anchor calls', !r.error, r.error);

// anchor 歧义必须报错：模块层直接子函数有多个
r = I.resolvePath(require('../vendor/acorn.js').parse(sample, { ecmaVersion: 'latest' }),
    [{ module: '42' }, { anchor: {} }], sample);
check('模块层多候选拒绝', !!r.error && /候选/.test(r.error), r.error);

// method 段：babel 方法表
r = I.resolvePath(require('../vendor/acorn.js').parse(sample, { ecmaVersion: 'latest' }),
    [{ module: '42' }, { method: 'createChildren', cls: 'Cls' }], sample);
check('resolve method createChildren', !r.error, r.error);

// module 级 ast patch 全流程
var out = __mixinAst.applyAstPatches('test.js', sample, [
    { name: 'tail-inject', path: [{ module: '42' }], op: 'inject', at: 'tail', code: 'console.log("tail-ok");' },
    { name: 'helper-log', path: [{ module: '42' }, { name: 'helper' }], op: 'inject', at: 'head', code: 'console.log("helper-hit", x);' },
    { name: 'inner-wrap', path: [{ module: '42' }, { name: 'boot' }, { anchor: { calls: ['helper'], params: 2 } }], op: 'wrap', code: 'console.log("inner-wrapped"); return $orig();' },
    { name: 'method-overwrite', path: [{ module: '42' }, { method: 'createChildren', cls: 'Cls' }], op: 'overwrite', code: 'return "patched-cc";' },
    { name: 'bad-target（应跳过）', path: [{ module: '42' }, { name: 'not-exist' }], op: 'log', message: 'never' }
]);
check('tail 注入生效', out.indexOf('tail-ok') >= 0);
check('helper 头注入生效', out.indexOf('helper-hit') >= 0);
check('wrap 改写生效', out.indexOf('inner-wrapped') >= 0 && out.indexOf('__mixin_orig_') >= 0);
check('overwrite 生效', out.indexOf('patched-cc') >= 0);
check('原 helper 体保留', out.indexOf('return x + 1;') >= 0);

// 打完补丁必须还能 parse（语法完整）
var acorn = require('../vendor/acorn.js');
var reparsed = null;
try { reparsed = acorn.parse(out, { ecmaVersion: 'latest' }); } catch (e) { reparsed = null; }
check('补丁后语法完整', !!reparsed, reparsed ? '' : 'parse 失败');

// 执行语义验证：跑 patched sample
var sandboxLog = [];
var fakeConsole = { log: function () { sandboxLog.push(Array.prototype.join.call(arguments, ' ')); } };
try {
    var fn = new Function('console', 'reg', 'window', out);
    fn(fakeConsole, function () {}, {});
} catch (e) { sandboxLog.push('RUN-ERROR: ' + e.message); }
var joined = sandboxLog.join('|');
check('运行: tail-ok', /tail-ok/.test(joined), joined);
check('运行: helper-hit', /helper-hit 1/.test(joined), joined); // helper(1) 记录 x=1
check('运行: inner-wrapped', /inner-wrapped/.test(joined), joined);
console.log('    [运行输出] ' + joined);

/* ---------- 1.5 零特征结构寻址 / 同名 index 消歧 / 哈希锁 / 重叠拒绝 ---------- */
console.log('== 结构寻址与安全 ==');
var dup = '({1:function(){' +
    'var a=(function(){function t(){};reg(t,[{key:"setData",value:function(){return "A";}}]);return t;})();' +
    'var b=(function(){function t(){};reg(t,[{key:"setData",value:function(){return "B";}}]);return t;})();' +
    '}})[1]();';

// 同名消歧（同层重名）：index 直接取序号，无特征
var dupName = '({1:function(){function X(){return 1;} var Y=X; var X2=X; var X=function(){return 2;}; return X();}})[1]();';
var astD = acorn.parse(dupName, { ecmaVersion: 'latest' });
r = I.resolvePath(astD, [{ module: '1' }, { name: 'X', index: 0 }], dupName);
check('同名 index:0 命中声明', !r.error && r.node.type === 'FunctionDeclaration', r.error);
r = I.resolvePath(astD, [{ module: '1' }, { name: 'X', index: 1 }], dupName);
check('同名 index:1 命中第二个绑定', !r.error && r.node.type === 'FunctionExpression', r.error);

// 跨作用域同名不可见（设计行为）：t 存在于 IIFE 内层，从模块层找 → 0 候选
r = I.resolvePath(acorn.parse(dup, { ecmaVersion: 'latest' }), [{ module: '1' }, { name: 't' }], dup);
check('跨作用域同名 0 候选', !!r.error && /0 个候选/.test(r.error), r.error);
r = I.resolvePath(acorn.parse(dup, { ecmaVersion: 'latest' }), [{ module: '1' }, { method: 'setData', cls: 't', index: 1 }], dup);
check('method 同名 index:1', !r.error && dup.slice(r.node.start, r.node.end).indexOf('"B"') > 0, r.error);

// {fn:n} 纯序号段：匿名函数也能指（零名字零特征）
r = I.resolvePath(astD, [{ module: '1' }, { fn: 0 }], dup);
check('fn:0 = 第一个直接子函数', !r.error && r.node.start < dup.indexOf('"A"'), r.error);
r = I.resolvePath(astD, [{ module: '1' }, { fn: 99 }], dup);
check('fn 越界拒绝并报总数', !!r.error && /共 \d+ 个/.test(r.error), r.error);

// 纯结构链打补丁：module → fn 序号，全程无特征
var structural = __mixinAst.applyAstPatches('t.js', dup, [
    { name: 'struct', path: [{ module: '1' }, { fn: 1 }, { fn: 1 }], op: 'log', message: 'struct-hit' }
]);
check('纯结构链注入生效', structural.indexOf('struct-hit') > 0);
try { acorn.parse(structural, { ecmaVersion: 'latest' }); check('结构补丁后语法完整', true); }
catch (e) { check('结构补丁后语法完整', false, e.message); }

// 重叠拒绝：overwrite 模块 + log 内层函数（历史静默损坏场景）
var ovl = '({1:function(){function helper(x){return x+1;} console.log(helper(1)); }})[1]();';
var ovlOut = __mixinAst.applyAstPatches('t.js', ovl, [
    { name: 'ow-module', path: [{ module: '1' }], op: 'overwrite', code: 'function helper(x){return x+2;} console.log(helper(1));' },
    { name: 'in-helper', path: [{ module: '1' }, { name: 'helper' }], op: 'log', message: 'hit' }
]);
check('重叠: overwrite 生效', ovlOut.indexOf('x+2') > 0);
check('重叠: 内层 patch 被拒绝而非损坏', ovlOut.split('ole.log(helper(1))').length - 1 === 1 && ovlOut.indexOf('"hit"') < 0);
try { acorn.parse(ovlOut, { ecmaVersion: 'latest' }); check('重叠: 输出语法完整', true); }
catch (e) { check('重叠: 输出语法完整', false, e.message); }

/* ---------- 2. 真实 main.min.js ---------- */
console.log('== main.min.js ==');
var realSrc = fs.readFileSync(path.join(__dirname, '../../pdzzapksworkspace/main.min.js'), 'utf8');

// 定位测试（不产出补丁）
var ast0 = acorn.parse(realSrc, { ecmaVersion: 'latest' });
var t0 = Date.now();
r = I.resolvePath(ast0, [{ module: '625' }], realSrc);
check('main.min.js: module 625 唯一定位', !r.error, r.error);
if (!r.error) console.log('    module fn @' + r.node.start + '..' + r.node.end + ' 顶层语句 ' + r.node.body.body.length + ' 条');

r = I.resolvePath(ast0, [{ module: '625' }, { name: 'XS' }], realSrc);
check('main.min.js: XS 定位', !r.error, r.error);
if (!r.error) console.log('    XS @' + r.node.start + '..' + r.node.end);

r = I.resolvePath(ast0, [{ module: '625' }, { name: 'qS' }], realSrc);
check('main.min.js: qS 定位', !r.error, r.error);

r = I.resolvePath(ast0, [{ module: '625' }, { anchor: { strings: ['秒后重试'] } }], realSrc);
check("main.min.js: '秒后重试' 类包装唯一", !r.error, r.error);
if (!r.error) console.log('    类包装 @' + r.node.start + '..' + r.node.end);
// 第二层：包装内直接子函数（babel 方法表 value）里 0 参且含该字符串的
r = I.resolvePath(ast0, [{ module: '625' }, { anchor: { strings: ['秒后重试'] } }, { anchor: { strings: ['秒后重试'], params: 0 } }], realSrc);
check("main.min.js: '秒后重试' 内层方法唯一", !r.error, r.error);
if (!r.error) console.log('    内层方法 @' + r.node.start + '..' + r.node.end);

// 纯结构定位对照：fn 序号应与特征/名字定位同点（确定性验证）
r = I.resolvePath(ast0, [{ module: '625' }, { fn: 0 }], realSrc);
check('main.min.js: fn:0 = 模块第一个直接子函数(t)', !r.error && realSrc.slice(r.node.start, r.node.end).indexOf('function t(') === 0, r.error);

// 哈希锁：transformer 级
var goodHash = global.__mixin.sourceHash(realSrc);
global.__mixin.register({ modid: 'hash-test', mixins: [{ file: 'main.min.js', hash: goodHash, patches: [{ path: [{ module: '625' }], op: 'log', message: 'hash-ok-mixin' }] }] });
global.__mixin.register({ modid: 'hash-bad', mixins: [{ file: 'main.min.js', hash: 'fnv1a32:dead:len:1', patches: [{ path: [{ module: '625' }], op: 'log', message: 'never-mixin-xyz' }] }] });
var withHash = global.__mixinTransform('main.min.js', realSrc);
check('哈希相符 → patch 生效', withHash.indexOf('hash-ok-mixin') > 0);
check('哈希不符 → 整个 mixin 跳过', withHash.indexOf('never-mixin-xyz') < 0);
// eval 形态（带 sourceURL 尾巴）哈希应一致
var evaled = global.__mixinTransform('main.min.js', realSrc + '\n//@ sourceURL=https://cdn/main.min.js');
check('sourceURL 尾巴不破坏哈希判定', evaled.indexOf('never-mixin-xyz') < 0 && evaled.indexOf('hash-ok-mixin') > 0);

// 全量补丁流（含一个坏 patch 验证 skip 不影响其他）
var t1 = Date.now();
var patched = __mixinAst.applyAstPatches('main.min.js', realSrc, [
    { name: 'module-tail-boot', path: [{ module: '625' }], op: 'inject', at: 'tail',
      code: 'try{console.log("[mixin-ast] module625 tail runs, Laya="+(typeof Laya))}catch(e){}' },
    { name: 'xs-head-log', path: [{ module: '625' }, { name: 'XS' }], op: 'log', message: '[mixin-ast] XS (resource-version callback) enter' },
    { name: 'retry-fn-log', path: [{ module: '625' }, { anchor: { strings: ['秒后重试'] } }, { anchor: { strings: ['秒后重试'], params: 0 } }], op: 'log', message: '[mixin-ast] retry-countdown fn enter' },
    { name: 'missing-fn（应跳过）', path: [{ module: '625' }, { name: 'ZZZ_no_such' }], op: 'log', message: 'never' }
]);
console.log('    applyAstPatches 耗时 ' + (Date.now() - t1) + 'ms');
check('main.min.js 补丁生效', patched !== realSrc);
check('坏 patch 被跳过但其余生效', patched.indexOf('mixin-ast] module625 tail') >= 0);
try { acorn.parse(patched, { ecmaVersion: 'latest' }); check('main.min.js 补丁后语法完整', true); }
catch (e) { check('main.min.js 补丁后语法完整', false, e.message); }
var diffLines = patched.length - realSrc.length;
console.log('    长度差 +' + diffLines + ' 字节（其余字节应与原文件一致）');

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
