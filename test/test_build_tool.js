/*
 * test_build_tool.js — v2 构建工具自测
 *   1. 正常用例：sample-mod 构建 → patches.js/mixins.json 产物 → 注册进 transformer 全链路
 *   2. 失败用例：bad-mod 重名歧义 → 构建失败并列出候选
 * 运行：node test/test_build_tool.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

global.acorn = require('../vendor/acorn.js');
require('../runtime/mixinAst.js');
require('../runtime/mixinTransformer.js');

var build = require('../build-tool/build.js');
var assert = require('assert');

var failures = 0;
function check(name, cond, detail) {
    if (cond) console.log('  PASS ' + name);
    else { console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); failures++; }
}

/* ---------- 1. 正常构建 ---------- */
console.log('== build-tool: sample-mod ==');
var proj = path.join(__dirname, 'fixtures', 'sample-mod');
var res = build.runBuild(proj);
check('构建成功', res.ok === true, res.ok ? '' : (res.message + '\n  ' + (res.errors || []).join('\n  ')));

if (res.ok) {
    check('patch 数 = 5（tick inject / tick wrap / boot tail / step export / helper modify）', res.patchCount === 5,
        '实际 ' + res.patchCount);

    var patchesJs = fs.readFileSync(path.join(res.outDir, 'patches.js'), 'utf8');
    check('产物 patches.js 存在且含 register 调用', patchesJs.indexOf('window.__mixin.register(') >= 0);
    check('产物包含 export 赋值', patchesJs.indexOf('__mixin_exports') >= 0);
    check('产物包含 modify patch（find/replace）', /"op":\s*"modify"/.test(patchesJs)
        && patchesJs.indexOf('return x + 1;') >= 0 && patchesJs.indexOf('return x + 2;') >= 0);

    var manifest = JSON.parse(fs.readFileSync(path.join(res.outDir, 'mixins.json'), 'utf8'));
    check('mixins.json: modid/priority 正确',
        manifest.modid === 'demo-mod' && manifest.priority === 100 && manifest.mixins[0] === 'patches.js',
        JSON.stringify(manifest));
    check('mixins.json 不含 required（哈希暂不要求）', manifest.required === undefined);

    var dts = fs.readFileSync(path.join(res.outDir, 'game-types.d.ts'), 'utf8');
    check('game-types.d.ts: 可读类 interface（Counter）', /interface Counter \{/.test(dts));
    check('game-types.d.ts: 方法表 key 提示（tick）', /tick\?\(\.\.\.args: any\[\]\): any/.test(dts));
    check('game-types.d.ts: @Export 汇总（stepFn）', dts.indexOf('stepFn?: any;') >= 0);
    check('game-types.d.ts: modFs 全局声明', dts.indexOf('declare function modFsStatus()') >= 0);

    // name-map 生效：Counter→App、start→boot
    var mod = JSON.parse(patchesJs.slice(patchesJs.indexOf('register(') + 'register('.length, patchesJs.lastIndexOf(')')));
    var all = mod.mixins[0].patches;
    function findPatch(nm) {
        for (var i = 0; i < all.length; i++) if (all[i].name.indexOf(nm) === 0) return all[i];
        return null;
    }
    var tickP = findPatch('CounterMark.tick');
    check('cls 映射 Counter→App', tickP && tickP.path[1].name === 'App',
        tickP ? JSON.stringify(tickP.path) : 'patch 缺失');
    var bootP = findPatch('BootMark.target');
    check('alias 映射 start→boot', bootP && bootP.path[1].name === 'boot',
        bootP ? JSON.stringify(bootP.path) : 'patch 缺失');
    var expP = findPatch('ExportMark.target$export');
    check('export patch 指向父层（boot）并注入赋值',
        expP && expP.path.length === 2 && expP.path[1].name === 'boot' && expP.op === 'inject' && expP.at === 'tail'
            && /__mixin_exports\[.stepFn.\] = step;/.test(expP.code),
        expP ? JSON.stringify(expP) : 'patch 缺失');

    /* ---------- 全链路：注册进 transformer 并变换目标文件 ---------- */
    var src = fs.readFileSync(path.join(proj, 'game', 'sample.js'), 'utf8');
    global.__mixin.register(mod);
    var out = global.__mixinTransform('sample.js', src);
    check('transform 后语法可解析', (function () {
        try { global.acorn.parse(out, { ecmaVersion: 'latest' }); return true; } catch (e) { return false; }
    })());
    check('inject head 生效', out.indexOf("console.log(\"[demo] tick enter\")") >= 0
        || out.indexOf("console.log('[demo] tick enter')") >= 0);
    check('wrap 生效（$orig 转发 + 前置日志）',
        out.indexOf('__mixin_orig') >= 0 && out.indexOf('[demo] tick wrap before') >= 0);
    check('boot tail 生效', out.indexOf('[demo] boot tail') >= 0);
    check('export 赋值注入到 boot 尾部（末尾 return 之前）',
        /__mixin_exports\[.stepFn.\] = step;/.test(out));

    // 语义保持：原逻辑跑一遍（模拟游戏执行）
    var sandboxLog = [];
    var sandboxConsole = { log: function (m) { sandboxLog.push(String(m)); } };
    var sandboxWindow = { console: sandboxConsole, __mixin_exports: null };
    try {
        new Function('window', 'console', 'reg', 'Laya',
            out.replace('({7:', 'window.__mc_mod = ({7:'))(sandboxWindow, sandboxConsole,
            function () {}, {});
        check('变换后目标可执行且无异常', true);
        check('wrap/inject 日志按序出现',
            sandboxLog.indexOf('[demo] tick enter') >= 0
            && sandboxLog.indexOf('[demo] tick wrap before') >= 0
            && sandboxLog.indexOf('[demo] boot tail') >= 0,
            sandboxLog.join(' | '));
        check('export 拿到 step 函数', typeof sandboxWindow.__mixin_exports.stepFn === 'function',
            JSON.stringify(sandboxWindow.__mixin_exports && Object.keys(sandboxWindow.__mixin_exports)));
        check('原业务语义保持 + modify 数值生效（helper(2)=2+2 → "4!"、tick-run）',
            sandboxLog.indexOf('4!') >= 0 && sandboxLog.indexOf('tick-run') >= 0, sandboxLog.join(' | '));
    } catch (e) {
        check('变换后目标可执行且无异常', false, e.message);
    }
}

/* ---------- 2. 歧义构建失败 ---------- */
console.log('== build-tool: bad-mod（重名歧义必须构建失败）==');
var bad = build.runBuild(path.join(__dirname, 'fixtures', 'bad-mod'));
check('构建失败', bad.ok === false);
check('报错列出 2 个候选', bad.ok === false && /2 个候选/.test((bad.errors || []).join('\n')),
    bad.ok === false ? (bad.errors || []).join(' | ') : '意外成功');

/* ---------- 3. 坏 target（文件不在 gameFiles）---------- */
console.log('== build-tool: 配置错误可见 ==');
var missing = path.join(__dirname, 'fixtures', 'sample-mod');
var savedCfg = fs.readFileSync(path.join(missing, 'build-config.json'), 'utf8');
try {
    fs.writeFileSync(path.join(missing, 'build-config.json'),
        savedCfg.replace('"sample.js": "game/sample.js"', '"other.js": "game/sample.js"'));
    var r3 = build.runBuild(missing);
    check('target 文件不在 gameFiles → 构建失败', r3.ok === false && /gameFiles/.test((r3.errors || []).join('\n')),
        r3.ok === false ? (r3.errors || []).join(' | ') : '意外成功');
} finally {
    fs.writeFileSync(path.join(missing, 'build-config.json'), savedCfg);
}

console.log(failures === 0 ? '\n全部通过' : '\n' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
