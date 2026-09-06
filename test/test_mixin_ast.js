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

// ---- 命名空间点分名 / 具名函数表达式 / 回调段 ----
console.log('== 命名空间与回调 ==');
var nsSrc = '({1:function(){var ns={};ns.helper=function(){return "h";};var V={showToast:function(){return "t";},deep:{fn:function(){return "d";}}};var x = function foo(){return 1;}; ns.helper(); V.showToast(); jS.init(function(){return "cb";}); }})[1]();';
var astNS = acorn.parse(nsSrc, { ecmaVersion: 'latest' });
r = I.resolvePath(astNS, [{ module: '1' }, { name: 'ns.helper' }], nsSrc);
check('点分: 赋值命名空间 ns.helper', !r.error, r.error);
r = I.resolvePath(astNS, [{ module: '1' }, { name: 'V.showToast' }], nsSrc);
check('点分: 对象字面量 V.showToast', !r.error, r.error);
r = I.resolvePath(astNS, [{ module: '1' }, { name: 'V.deep.fn' }], nsSrc);
check('点分: 嵌套对象 V.deep.fn', !r.error, r.error);
r = I.resolvePath(astNS, [{ module: '1' }, { name: 'foo' }], nsSrc);
check('具名函数表达式: 自身 id 可指', !r.error, r.error);
r = I.resolvePath(astNS, [{ module: '1' }, { name: 'x' }], nsSrc);
check('具名函数表达式: 绑定名可指', !r.error, r.error);
r = I.resolvePath(astNS, [{ module: '1' }, { call: 'jS.init', arg: 0 }], nsSrc);
check('回调: jS.init 实参[0]', !r.error && nsSrc.slice(r.node.start, r.node.end).indexOf('"cb"') > 0, r.error);
var dupCall = '({1:function(){jS.init(function(){return 1;}); jS.init(function(){return 2;}); }})[1]();';
r = I.resolvePath(acorn.parse(dupCall, { ecmaVersion: 'latest' }), [{ module: '1' }, { call: 'jS.init', arg: 0 }], dupCall);
check('回调: 同名调用点多候选拒绝', !!r.error && /候选/.test(r.error), r.error);
var cb2 = '({1:function(){jS.init(function(){function inner(){return 7;} inner(); }); }})[1]();';
r = I.resolvePath(acorn.parse(cb2, { ecmaVersion: 'latest' }),
    [{ module: '1' }, { call: 'jS.init', arg: 0 }, { name: 'inner' }], cb2);
check('回调链: call→name 连走', !r.error, r.error);

// ---- 串行 mixin（Sponge 语义）：priority 定序，后者定位前者注入的代码 ----
console.log('== 串行 mixin（Sponge 语义） ==');
var pipeSrc = '({1:function(){function X(){return 1;} X(); }})[1]();';
global.__mixin.register({ modid: 'chain-a', priority: 0, mixins: [{ file: 'pipe.js',
    patches: [{ path: [{ module: '1' }], op: 'inject', at: 'head',
               code: 'var Hook=function(){return 9;}; Hook();' }] }] });
global.__mixin.register({ modid: 'chain-collide', priority: 50, mixins: [{ file: 'pipe.js',
    patches: [{ path: [{ module: '1' }], op: 'inject', at: 'head',
               code: 'function X(){return 8;}' }] }] });
global.__mixin.register({ modid: 'chain-b', priority: 100, mixins: [{ file: 'pipe.js',
    patches: [{ path: [{ module: '1' }, { name: 'Hook' }], op: 'log', message: 'b-hook' }] }] });
// 与原始 X 重名 → chain-c 必须大声失败（不静默指错）
global.__mixin.register({ modid: 'chain-c', priority: 300, mixins: [{ file: 'pipe.js',
    patches: [{ path: [{ module: '1' }, { name: 'X' }], op: 'log', message: 'c-x' }] }] });
var pipeOut = global.__mixinTransform('pipe.js', pipeSrc);
var hookPos = pipeOut.indexOf('var Hook=function(){');
check('串行: B 定位 A 注入的 Hook', hookPos > 0 &&
    pipeOut.slice(hookPos, pipeOut.indexOf('return 9;')).indexOf('b-hook') > 0, pipeOut.slice(0, 240));
check('串行: 重名冲突大声失败不指错', pipeOut.indexOf('"c-x"') < 0);
try { acorn.parse(pipeOut, { ecmaVersion: 'latest' }); check('串行: 输出语法完整', true); }
catch (e) { check('串行: 输出语法完整', false, e.message); }

// priority：小者先应用（用替换链验证顺序：AAA→BBB→CCC 才能走通）
global.__mixin.register({ modid: 'pri-low', priority: 100, mixins: [{ file: 'pri.js', replaces: [['BBB', 'CCC']] }] });
global.__mixin.register({ modid: 'pri-high', priority: 0, mixins: [{ file: 'pri.js', replaces: [['AAA', 'BBB']] }] });
var priOut = global.__mixinTransform('pri.js', 'var s = "AAA";');
check('priority: 小者先应用', priOut.indexOf('CCC') > 0 && priOut.indexOf('AAA') < 0, priOut);

// 串行 + 哈希：后者锁原始哈希而前者已改文件 → 后者安全跳过（不指错）
var h1 = global.__mixin.sourceHash(pipeSrc);
global.__mixin.register({ modid: 'chain-pre', priority: 0, mixins: [{ file: 'pipe2.js',
    patches: [{ path: [{ module: '1' }], op: 'log', message: 'chain-pre' }] }] });
global.__mixin.register({ modid: 'chain-h', priority: 100, mixins: [{ file: 'pipe2.js', hash: h1,
    patches: [{ path: [{ module: '1' }], op: 'log', message: 'chain-h' }] }] });
var pipe2Out = global.__mixinTransform('pipe2.js', pipeSrc);
check('串行+哈希: 前者改过文件则锁原哈希的跳过', pipe2Out.indexOf('chain-pre') > 0 && pipe2Out.indexOf('"chain-h"') < 0);

// ---- 方法链：具名类两种形态都可达 ----
console.log('== 方法链 ==');
// 形态1（babel IIFE 包装）：表在包装体内
var r1 = I.resolvePath(acorn.parse(dup, { ecmaVersion: 'latest' }),
    [{ module: '1' }, { fn: 0 }, { name: 't' }, { method: 'setData' }], dup);
check('方法链: IIFE 包装 name→method', !r1.error && dup.slice(r1.node.start, r1.node.end).indexOf('"A"') > 0, r1.error);
// 形态2（兄弟语句）：表是类声明的兄弟 —— 需要"上一层回退"
var sib = '({1:function(){function Ct(){this.x=1;} reg(Ct,[{key:"run",value:function(){return "run";}}]); Ct(); }})[1]();';
var r2 = I.resolvePath(acorn.parse(sib, { ecmaVersion: 'latest' }),
    [{ module: '1' }, { name: 'Ct' }, { method: 'run' }], sib);
check('方法链: 兄弟语句形态（上一层回退）', !r2.error && sib.slice(r2.node.start, r2.node.end).indexOf('"run"') > 0, r2.error);

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

// getter 访问器条目：{key:"...", get:fn} 也要能被 method 段命中（Of.creators/configs 场景）
var acc = '({1:function(){var Of=(function(){function Of(){}return r(Of,[{key:"creators",get:function(){return this._m||{};}},{key:"size",value:function(){return 7;}}]),Of;})(); Of; }})[1]();';
var r3 = I.resolvePath(acorn.parse(acc, { ecmaVersion: 'latest' }),
    [{ module: '1' }, { anchor: { strings: ['creators'] } }, { method: 'creators' }], acc);
check('方法链: getter 访问器条目命中', !r3.error && acc.slice(r3.node.start, r3.node.end).indexOf('this._m') > 0, r3.error);
var r4 = I.resolvePath(acorn.parse(acc, { ecmaVersion: 'latest' }),
    [{ module: '1' }, { anchor: { strings: ['creators'] } }, { method: 'size' }], acc);
check('方法链: value 条目不受影响', !r4.error && acc.slice(r4.node.start, r4.node.end).indexOf('return 7') > 0, r4.error);

// ASI 邻接防护：原末句无分号（靠 } 结束）时，tail 注入不得被解析成对原表达式的调用
// （真机踩坑：jS.init(...)(注入IIFE) → "TypeError: (intermediate value) is not a function"）
var asi = '({1:function(){jS.init((function(){return 42;}))}})[1]();';
var asiOut = __mixinAst.applyAstPatches('t.js', asi, [
    { name: 'tail-a', path: [{ module: '1' }], op: 'inject', at: 'tail', code: 'window.__ta = 1;' },
    { name: 'tail-b', path: [{ module: '1' }], op: 'inject', at: 'tail', code: 'window.__tb = 2;' }
]);
try { acorn.parse(asiOut, { ecmaVersion: 'latest' }); check('ASI: 注入后语法完整', true); }
catch (e) { check('ASI: 注入后语法完整', false, e.message); }
check('ASI: 末句与注入体已隔离（前导分号）', /jS\.init\(\(function\(\)\{return 42;\}\)\)\s*;\s*window\.__t/.test(asiOut), asiOut.slice(-120));
global.window = global.window || {};
try {
    new Function('window', 'jS', asiOut.replace('({1:', 'window.__m = ({1:'))(global.window, { init: function () {} });
    check('ASI: 双 tail 注入都可执行', global.window.__ta === 1 && global.window.__tb === 2,
        'ta=' + global.window.__ta + ' tb=' + global.window.__tb);
} catch (e) { check('ASI: 双 tail 注入都可执行', false, e.message); }

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
