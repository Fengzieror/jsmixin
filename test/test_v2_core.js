/*
 * test_v2_core.js — v2 新特性自测：原生 ES6 class / ESM / CJS / UMD 目标形态 +
 * 调用点级 op（redirect / wrapCall / modifyArg）。
 * 运行：node test/test_v2_core.js（经 npm test 自动在 build 之后执行）
 */
'use strict';

global.acorn = require('../vendor/acorn.js');
require('../runtime/mixinAst.js');
require('../runtime/mixinTransformer.js');

var __mixinAst = global.__mixinAst;
var acorn = require('../vendor/acorn.js');

var failures = 0;
function check(name, cond, detail) {
    if (cond) console.log('  PASS ' + name);
    else { console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); failures++; }
}
function parse(src) { return acorn.parse(src, { ecmaVersion: 'latest' }); }
function patched(src, patches, stats) { return __mixinAst.applyAstPatches('v2.js', src, patches, stats); }
// 执行：注入 console 收集器与 globalThis 替身；返回 { log: [..], g: globalThis替身 }
function run(src) {
    var log = [];
    var g = {};
    try {
        new Function('globalThis', 'console', src)(g, { log: function () { log.push(Array.prototype.join.call(arguments, ' ')); } });
    } catch (e) { log.push('RUN-ERROR: ' + e.message); }
    return { log: log, g: g };
}
function syntaxOk(src) {
    try { parse(src); return true; } catch (e) { /* script 模式失败，试 module */ }
    try { acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' }); return true; } catch (e) { return false; }
}

/* ---------- 1. 原生 ES6 class ---------- */
console.log('== 原生 ES6 class ==');
var es6 = [
    '({7: function () {',
    '  class Animal {',
    '    constructor(name) { this.name = name; }',
    '    speak() { return this.name + " makes a noise."; }',
    '    get desc() { return "animal:" + this.name; }',
    '    static kind() { return "Animal"; }',
    '  }',
    '  var Dog = class extends Animal {',
    '    speak() { return this.name + " barks."; }',
    '  };',
    '  globalThis.__animal = new Animal("Rex");',
    '  globalThis.__dog = new Dog("Rex");',
    '  globalThis.__s1 = globalThis.__animal.speak();',
    '  globalThis.__k = Animal.kind();',
    '  globalThis.__s2 = globalThis.__dog.speak();',
    '}})[7]();'
].join('\n');
var out6 = patched(es6, [
    { name: 'speak-log', path: [{ module: '7' }, { class: 'Animal' }, { method: 'speak' }], op: 'inject', at: 'head', code: 'console.log("speak-enter", this.name);' },
    { name: 'desc-overwrite', path: [{ module: '7' }, { class: 'Animal' }, { method: 'desc' }], op: 'overwrite', code: 'return "patched:" + this.name;' },
    { name: 'static-kind-log', path: [{ module: '7' }, { class: 'Animal' }, { method: 'kind' }], op: 'log', message: 'kind-enter' },
    { name: 'dog-speak-wrap', path: [{ module: '7' }, { class: 'Dog' }, { method: 'speak' }], op: 'inject', at: 'head', code: 'console.log("dog-speak-enter");' }
]);
check('class: 四个 patch 全部生效', out6.indexOf('speak-enter') > 0 && out6.indexOf('patched:') > 0
    && out6.indexOf('"kind-enter"') > 0 && out6.indexOf('dog-speak-enter') > 0);
check('class: 补丁后语法完整', syntaxOk(out6));
var r6 = run(out6);
check('class: speak 头注入运行命中', r6.log.join('|').indexOf('speak-enter Rex') >= 0, r6.log.join('|'));
check('class: getter 覆写生效', r6.g.__animal.desc === 'patched:Rex', r6.g.__animal.desc);
check('class: 静态方法 log 命中', r6.log.join('|').indexOf('kind-enter') >= 0, r6.log.join('|'));
check('class: 派生类方法命中且原语义保留', r6.log.join('|').indexOf('dog-speak-enter') >= 0 && r6.g.__dog.speak() === 'Rex barks.', r6.g.__dog.speak());
check('class: 原方法体保留', out6.indexOf('makes a noise.') > 0);

// name 段直达 MethodDefinition（directChildFns 绑定）
var r = __mixinAst._internals.resolvePath(parse(es6), [{ module: '7' }, { class: 'Animal' }, { name: 'desc' }], es6);
check('class: {name} 直达 getter', !r.error, r.error);
// 歧义：static/实例同名需 index
var dupCls = '({7: function () { class C { m() { return 1; } static m() { return 2; } } globalThis.__c = C; }})[7]();';
var rd = __mixinAst._internals.resolvePath(parse(dupCls), [{ module: '7' }, { class: 'C' }, { method: 'm' }], dupCls);
check('class: static/实例同名拒绝', !!rd.error && /候选/.test(rd.error), rd.error);
var rd2 = __mixinAst._internals.resolvePath(parse(dupCls), [{ module: '7' }, { class: 'C' }, { method: 'm', index: 1 }], dupCls);
check('class: index:1 命中 static', !rd2.error, rd2.error);

/* ---------- 2. ESM 顶层 ---------- */
console.log('== ESM 顶层 ==');
var esm = [
    'import { base } from "./dep.js";',
    'export function greet(name) { return "hi " + name + base; }',
    'export class Greeter {',
    '  hello() { return "greeted"; }',
    '}',
    'export const VERSION = 1;'
].join('\n');
var outEsm = patched(esm, [
    { name: 'greet-log', path: [{ name: 'greet' }], op: 'inject', at: 'head', code: 'console.log("greet-enter", name);' },
    { name: 'greeter-log', path: [{ class: 'Greeter' }, { method: 'hello' }], op: 'log', message: 'hello-enter' }
]);
check('ESM: 顶层函数与 class 都命中', outEsm.indexOf('greet-enter') > 0 && outEsm.indexOf('"hello-enter"') > 0, outEsm.slice(0, 120));
check('ESM: 补丁后语法完整', syntaxOk(outEsm));

/* ---------- 3. CJS / UMD / IIFE 解包段 ---------- */
console.log('== 打包器解包段 ==');
var cjsSrc = [
    'module.exports = (function () {',
    '  function inner() { return "inner-run"; }',
    '  return { inner: inner };',
    '})();'
].join('\n');
var outCjs = patched(cjsSrc, [
    { name: 'cjs-log', path: [{ wrap: 'cjs' }, { name: 'inner' }], op: 'log', message: 'cjs-inner-enter' }
]);
check('CJS: wrap:cjs + name 命中', outCjs.indexOf('"cjs-inner-enter"') > 0, outCjs.slice(0, 120));

var umdSrc = [
    '(function (root, factory) {',
    '  root.lib = factory();',
    '})(globalThis, function () {',
    '  function api() { return "api-run"; }',
    '  return { api: api };',
    '});'
].join('\n');
var outUmd = patched(umdSrc, [
    { name: 'umd-log', path: [{ wrap: 'umd' }, { name: 'api' }], op: 'log', message: 'umd-api-enter' }
]);
check('UMD: wrap:umd 取 factory 命中', outUmd.indexOf('"umd-api-enter"') > 0, outUmd.slice(0, 120));

var iifeSrc = '!function () { function baz() { return "baz-run"; } globalThis.__bz = baz(); }();';
var outIife = patched(iifeSrc, [
    { name: 'iife-log', path: [{ wrap: 'iife' }, { name: 'baz' }], op: 'log', message: 'iife-baz-enter' }
]);
check('IIFE: !function 形态命中', outIife.indexOf('"iife-baz-enter"') > 0, outIife.slice(0, 120));

/* ---------- 4. redirect ---------- */
console.log('== redirect ==');
var rsrc = 'function helper(x){return x+1;} function calc(){ return helper(2); } globalThis.__rv = calc();';
var outR = patched(rsrc, [
    { name: 'redirect-one', path: [{ name: 'calc' }], op: 'redirect', call: 'helper', code: '$args[0] * 10' }
]);
check('redirect: 输出语法完整', syntaxOk(outR));
var rr = run(outR);
check('redirect: 语义生效（helper(2) → 20）', rr.g.__rv === 20, String(rr.g.__rv) + ' | ' + rr.log.join('|'));
check('redirect: 原调用文本被替换', outR.indexOf('helper(2)') < 0, outR.slice(0, 160));

// 多命中消歧
var rmulti = 'function helper(x){return x+1;} function calc(){ var a = helper(1); var b = helper(2); return a + b; } globalThis.__rv = calc();';
var st = {};
__mixinAst.applyAstPatches('a.js', rmulti, [
    { name: 'r-amb', path: [{ name: 'calc' }], op: 'redirect', call: 'helper', code: '0' }
], st);
check('redirect: 多命中未消歧被拒绝', st.skipped.length === 1 && /需写 nth 或 all/.test(st.skipped[0]), st.skipped.join('|'));
var rNth = patched(rmulti, [
    { name: 'r-nth', path: [{ name: 'calc' }], op: 'redirect', call: 'helper', code: '$args[0] * 10', nth: 1 }
]);
check('redirect: nth:1 只替换第二处', (rNth.match(/\$args\[0\] \* 10/g) || []).length === 1, rNth);
check('redirect: nth 版语法完整', syntaxOk(rNth));
var rAll = patched(rmulti, [
    { name: 'r-all', path: [{ name: 'calc' }], op: 'redirect', call: 'helper', code: '$args[0] * 10', all: true }
]);
check('redirect: all 替换全部', (rAll.match(/\$args\[0\] \* 10/g) || []).length === 2, rAll);
var rNthRun = run(rNth);
check('redirect: nth 语义（1+1 + 2*10 = 22）', rNthRun.g.__rv === 22, String(rNthRun.g.__rv));

/* ---------- 5. wrapCall ---------- */
console.log('== wrapCall ==');
var wsrc = 'function helper(x){return x+1;} function calc(){ return helper(1) + 10; } globalThis.__wv = calc();';
var outW = patched(wsrc, [
    { name: 'wrapCall-one', path: [{ name: 'calc' }], op: 'wrapCall', call: 'helper', code: 'console.log("wrapCall-hit", $args[0]); return $orig($args[0] + 5);' }
]);
check('wrapCall: 输出语法完整', syntaxOk(outW));
var rw = run(outW);
check('wrapCall: $orig 改参生效（helper(6)=7 → 17）', rw.g.__wv === 17, String(rw.g.__wv) + ' | ' + rw.log.join('|'));
check('wrapCall: $args 可用', rw.log.join('|').indexOf('wrapCall-hit 1') >= 0, rw.log.join('|'));

// this 保留：成员调用的 $orig 经 apply(对象) 转发
var thisSrc = 'var obj = { v: 9, get() { return this.v; } }; function caller(){ return obj.get(); } globalThis.__tv = caller();';
var outT = patched(thisSrc, [
    { name: 'wrapCall-this', path: [{ name: 'caller' }], op: 'wrapCall', call: 'obj.get', code: 'return $orig();' }
]);
var rt = run(outT);
check('wrapCall: 成员调用 this 保留', rt.g.__tv === 9, String(rt.g.__tv) + ' | ' + rt.log.join('|'));

/* ---------- 6. modifyArg ---------- */
console.log('== modifyArg ==');
var msrc2 = 'function helper(x){return x+1;} function calc(){ return helper(1) + 10; } globalThis.__mv = calc();';
var outM = patched(msrc2, [
    { name: 'modifyArg-one', path: [{ name: 'calc' }], op: 'modifyArg', call: 'helper', arg: 0, code: '$arg + 3' }
]);
check('modifyArg: 输出语法完整', syntaxOk(outM));
var rm = run(outM);
check('modifyArg: 实参包装生效（helper(1+3)=5 → 15）', rm.g.__mv === 15, String(rm.g.__mv) + ' | ' + rm.log.join('|'));
// arg 越界
var stM = {};
patched(msrc2, [
    { name: 'modifyArg-oob', path: [{ name: 'calc' }], op: 'modifyArg', call: 'helper', arg: 5, code: '$arg' }
], stM);
check('modifyArg: 槽位越界被拒绝', stM.skipped.length === 1 && /越界/.test(stM.skipped[0]), stM.skipped.join('|'));
// 多命中需消歧
var stM2 = {};
patched('function calc(){ helper(1); helper(2); }', [
    { name: 'modifyArg-amb', path: [{ name: 'calc' }], op: 'modifyArg', call: 'helper', arg: 0, code: '$arg' }
], stM2);
check('modifyArg: 多命中未消歧被拒绝', stM2.skipped.length === 1 && /需写 nth 或 all/.test(stM2.skipped[0]), stM2.skipped.join('|'));

/* ---------- 7. 调用点匹配纪律 ---------- */
console.log('== 调用点匹配纪律 ==');
var stZ = {};
patched('function calc(){ other(1); }', [
    { name: 'zero', path: [{ name: 'calc' }], op: 'redirect', call: 'helper', code: '0' }
], stZ);
check('调用点: 0 命中被拒绝', stZ.skipped.length === 1 && /0 处命中/.test(stZ.skipped[0]), stZ.skipped.join('|'));
// this.x 调用名 + redirect（赋值绑定的完整点分名寻址 go）
var tc = 'function C(){} C.prototype.m = function(){ return 7; }; C.prototype.go = function(){ return this.m(); }; globalThis.__cv = new C().go();';
var tcPatched = patched(tc, [
    { name: 'redirect-this', path: [{ name: 'C.prototype.go' }], op: 'redirect', call: 'this.m', code: '101' }
]);
var rc = run(tcPatched);
check('调用点: this.m 重定向生效', rc.g.__cv === 101, String(rc.g.__cv) + ' | ' + rc.log.join('|'));

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
