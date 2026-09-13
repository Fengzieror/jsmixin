/*
 * test_boot_bundle.js — 通用 boot bundle（dist/boot/mixin-boot.js）测试（子进程隔离）：
 *   全局挂载 / eval 钩子 / __mixinSetModSource + __mixinLoadMods 泛化装载 / entry 队列。
 * 运行：node test/test_boot_bundle.js
 */
'use strict';
var fs = require('fs');
var os = require('os');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var failures = 0;
function check(name, cond, detail) {
    if (cond) console.log('  PASS ' + name);
    else { console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); failures++; }
}

var BOOT = path.join(__dirname, '../dist/boot/mixin-boot.js');

function runChild(entrySrc) {
    var tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jsmixin-boot-'));
    var entry = path.join(tmp, 'entry.js');
    fs.writeFileSync(entry, entrySrc);
    var r = spawnSync(process.execPath, [entry], { encoding: 'utf8' });
    return { stdout: r.stdout || '', stderr: r.stderr || '', tmp: tmp };
}

console.log('== boot bundle：全局挂载 + eval 钩子 ==');
(function () {
    var r = runChild([
        "require(" + JSON.stringify(BOOT) + ");",
        "if (typeof globalThis.__mixin !== 'object') { console.log('FAIL:no __mixin'); process.exit(1); }",
        "if (typeof globalThis.__mixinTransform !== 'function') { console.log('FAIL:no __mixinTransform'); process.exit(1); }",
        "globalThis.__mixin.register({ modid: 'boot-mod', mixins: [{ file: 't.js',",
        "  patches: [{ name: 'p', path: [{ name: 'foo' }], op: 'log', message: 'boot-ok' }] }] });",
        "var out = globalThis.__mixinTransform('t.js', 'function foo(){ return 1; } foo();');",
        "console.log(out.indexOf('boot-ok') > 0 ? 'TRANSFORM:ok' : 'TRANSFORM:fail');",
        "// eval 钩子（带 sourceURL 的字符串）",
        "globalThis.__mixin.register({ modid: 'boot-mod2', mixins: [{ file: 'e.js',",
        "  patches: [{ name: 'p2', path: [{ name: 'bar' }], op: 'log', message: 'eval-ok' }] }] });",
        "(0, eval)('function bar(){ return 2; } bar();\\n//@ sourceURL=e.js');",
        "console.log('EVAL-DONE');"
    ].join('\n'));
    var so = r.stdout + r.stderr;
    check('全局挂载（__mixin / __mixinTransform）', so.indexOf('FAIL:') < 0, so.slice(0, 300));
    check('__mixinTransform 直调生效', /TRANSFORM:ok/.test(so), so.slice(0, 300));
    check('eval 钩子生效（sourceURL 文件名匹配）', /EVAL-DONE/.test(so) && so.indexOf('FAIL') < 0, so.slice(0, 300));
})();

console.log('== boot bundle：泛化 mod 装载（setModSource / loadMods / entries） ==');
(function () {
    var r = runChild([
        "require(" + JSON.stringify(BOOT) + ");",
        "var store = {",
        "  '/mods/mods.json': JSON.stringify({ mods: [{ id: 'mem-mod', enabled: true }] }),",
        "  '/mods/mem-mod/mixins.json': JSON.stringify({ modid: 'mem-mod', mixins: ['patches.js'], entry: 'mod.js' }),",
        "  '/mods/mem-mod/patches.js': \"globalThis.__mixin.register({ modid: 'mem-mod', mixins: [{ file: 'm.js', replaces: [['\\\"orig\\\"', '\\\"patched\\\"']] }] });\",",
        "  '/mods/mem-mod/mod.js': \"console.log('ENTRY-RAN');\"",
        "};",
        "globalThis.__mixinSetModSource({ readFile: function (p) { return store[p] || ''; } });",
        "var res = globalThis.__mixinLoadMods('/mods');",
        "console.log('LOADED:' + res.registered + '/' + res.total);",
        "globalThis.__mixinRunEntries();",
        "var out = globalThis.__mixinTransform('m.js', 'globalThis.__t = \\\"orig\\\";');",
        "(0, eval)(out + '\\n//@ sourceURL=m.js');",
        "console.log('RESULT:' + globalThis.__t);"
    ].join('\n'));
    var so = r.stdout + r.stderr;
    check('内存装载（mods.json + 目录约定）', /LOADED:1\/1/.test(so), so.slice(0, 300));
    check('entry 队列执行', /ENTRY-RAN/.test(so), so.slice(0, 300));
    check('mod patch 生效（replaces 落地）', /RESULT:patched/.test(so), so.slice(0, 400));
})();

console.log('== boot bundle：未配置 mod 来源时的缺省行为 ==');
(function () {
    var r = runChild([
        "require(" + JSON.stringify(BOOT) + ");",
        "var res = globalThis.__mixinLoadMods('/nowhere');",
        "console.log('DEFAULT:' + res.registered + '/' + res.total);"
    ].join('\n'));
    var so = r.stdout + r.stderr;
    check('缺省安全（0 装载 + 提示日志）', /DEFAULT:0\/0/.test(so) && /未配置 mod 来源/.test(so), so.slice(0, 300));
})();

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
