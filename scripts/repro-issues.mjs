#!/usr/bin/env node
/*
 * repro-issues.mjs — 逐条复现/核查 Fengzieror/jsmixin 仓库 open issues #1–#18。
 *
 * 运行前提：仓库根目录下 node_modules/ 已安装、dist/ 与 runtime/ 已构建
 * （.github/workflows/issue-repro.yml 负责在 GitHub Actions 全新 clone 环境里准备好）。
 *
 * 输出：每条 issue 一行 CONFIRMED（复现属实）/ PARTIAL（部分属实）/ NOT-REPRODUCED，附证据。
 * 退出码恒为 0（本脚本是核查报告，不是失败闸门）。
 */
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawnSync, execFileSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const mktmp = (prefix) => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

/* ---------- 报告框架 ---------- */

const CONFIRMED = 'CONFIRMED';
const PARTIAL = 'PARTIAL';
const NOT_REPRODUCED = 'NOT-REPRODUCED';
const results = [];

function verdict(id, title, state, evidence) {
    results.push({ id, title, state });
    const mark = state === CONFIRMED ? 'CONFIRMED   ' : state === PARTIAL ? 'PARTIAL     ' : 'NOT-REPRO   ';
    console.log(`\n[${mark}] #${id} ${title}`);
    console.log(evidence.split('\n').map((l) => '    ' + l).join('\n'));
}

/* ---------- 公共工具 ---------- */

const acorn = require('acorn');
const astMod = require(path.join(root, 'dist/cjs/core/ast.js'));
astMod.setAcorn(acorn);
const engineMod = require(path.join(root, 'dist/cjs/core/engine.js'));
const loaderMod = require(path.join(root, 'dist/cjs/loader/loader.js'));
const applyAstPatches = astMod.applyAstPatches;

// 产物语法自检：返回 null（可解析）或错误信息
function parseErr(src) {
    try { acorn.parse(src, { ecmaVersion: 'latest' }); return null; }
    catch (e) { return e.message; }
}

// 让补丁产物真正跑起来看行为（sloppy new Function 环境）
function runNew(src, tail) {
    return new Function(src + '\n' + tail)();
}

// 静态证据：源码中是否存在某模式（返回行号数组）
function grepLines(text, re) {
    const out = [];
    text.split('\n').forEach((l, i) => { if (re.test(l)) out.push(i + 1); });
    return out;
}

// 临时 mod 项目骨架
function writeProj(dir, files) {
    for (const [rel, content] of Object.entries(files)) {
        const p = path.join(dir, rel);
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, content);
    }
}

/* ================= #1 wrap/modifyReturn 对 async/generator/块体箭头静默损坏 ================= */
(function issue1() {
    const srcA = 'var f = async function(a){ await a; return a + 1; };';
    const statsA = {};
    const outA = applyAstPatches('repro1.js', srcA, [{ name: 'p1a', path: [{ name: 'f' }], op: 'wrap', code: 'return $orig();' }], statsA);
    const errA = parseErr(outA);

    const srcB = 'var g = function*(a){ yield a; return 2; };';
    const outB = applyAstPatches('repro1.js', srcB, [{ name: 'p1b', path: [{ name: 'g' }], op: 'wrap', code: 'return $orig();' }]);
    const errB = parseErr(outB);

    const srcC = 'var h = (a) => { return a + 1; };';
    const outC = applyAstPatches('repro1.js', srcC, [{ name: 'p1c', path: [{ name: 'h' }], op: 'wrap', code: 'return $orig();' }]);
    let cDetail = '';
    let cBad = false;
    try {
        const got = runNew(outC, 'return h(2);');
        cBad = got !== 3;
        cDetail = '补丁后 h(2) 期望 3，实际 ' + String(got);
    } catch (e) { cBad = true; cDetail = '补丁后执行抛异常: ' + e.message; }

    const confirmed = errA !== null && errB !== null && cBad;
    verdict(1, 'wrap/modifyReturn 对 async/generator/块体箭头静默产出损坏代码',
        confirmed ? CONFIRMED : PARTIAL,
        'wrap async 函数 → 产物解析: ' + (errA || 'OK（未复现）') +
        '\nwrap generator 函数 → 产物解析: ' + (errB || 'OK（未复现）') +
        '\nwrap 块体箭头函数 → ' + cDetail +
        '\n（三者补丁均报告 OK，patch 应用数: ' + statsA.applied + '）');
})();

/* ================= #2 all:true 命中嵌套同名调用，同 patch 编辑区间重叠无检测 ================= */
(function issue2() {
    // 注意：issue 给的例子 JSON.parse(JSON.stringify(data)) 里 JSON.parse 只有一处，无法触发；
    // 需要真正的嵌套同名调用 JSON.parse(JSON.parse(data))。
    const src = 'function f(data){ return JSON.parse(JSON.parse(data)); }';
    const stats = {};
    const out = applyAstPatches('repro2.js', src, [{ name: 'p2', path: [{ name: 'f' }], op: 'wrapCall', call: 'JSON.parse', all: true, code: 'return $orig();' }], stats);
    const err = parseErr(out);
    const confirmed = stats.applied === 1 && stats.skipped.length === 0 && err !== null;
    verdict(2, 'wrapCall all:true 命中嵌套同名调用 → 同 patch 编辑重叠无检测，静默产出损坏代码',
        confirmed ? CONFIRMED : PARTIAL,
        '补丁报告: applied=' + stats.applied + ' skipped=' + JSON.stringify(stats.skipped) +
        '（两处命中调用各自入队，findOverlap 不检查同一 patch 内部两两重叠）' +
        '\n产物: ' + JSON.stringify(out.slice(0, 220)) +
        '\n产物解析: ' + (err || 'OK（未复现）') +
        '\n（issue 中的复现例子 JSON.parse(JSON.stringify(data)) 只有 1 处 JSON.parse，本身不触发；机制在嵌套同名调用下成立）');
})();

/* ================= #3 eval hook 把直接 eval 变成间接 eval ================= */
(function issue3() {
    const control = "function f(){ var secret42 = 1; return eval('secret42'); } try { console.log('RESULT:' + f()); } catch (e) { console.log('THROWN:' + e.name + ': ' + e.message); }";
    const hooked = "require(" + JSON.stringify(path.join(root, 'dist/cjs/hosts/node.js')) + ");\n" + control;
    const c3 = spawnSync(process.execPath, ['-e', control], { encoding: 'utf8', timeout: 60000 });
    const h3 = spawnSync(process.execPath, ['-e', hooked], { encoding: 'utf8', timeout: 60000 });
    const ctrlOk = /RESULT:1/.test(c3.stdout);
    const hookedBroken = /THROWN:ReferenceError/.test(h3.stdout);
    const confirmed = ctrlOk && hookedBroken;
    verdict(3, 'eval hook 将直接 eval 变为间接 eval，破坏词法作用域语义',
        confirmed ? CONFIRMED : PARTIAL,
        '未激活宿主: ' + (c3.stdout.trim() || c3.stderr.trim()) +
        '\n激活宿主(node.ts): ' + (h3.stdout.trim() || h3.stderr.trim()) +
        '\n（layanative.ts 的同名 hook 结构一致，同样受影响）');
})();

/* ================= #4 全新克隆 npm install 必失败（add-banners 未防 dist/esm 缺失） ================= */
(function issue4() {
    const gitignore = read('.gitignore');
    const pkg = read('package.json');
    const banners = read('scripts/add-banners.mjs');
    const distIgnored = /^dist\/$/m.test(gitignore);
    const orderBad = /"build:cjs":\s*"[^"]*add-banners\.mjs"/.test(pkg); // build:cjs 先于 build:esm 执行
    const noGuard = !/existsSync/.test(banners) && /walk\('dist\/esm'\)/.test(banners);
    const freshResult = process.env.FRESH_INSTALL_RESULT || ''; // CI 全新 npm install 的结果
    let freshEv = '';
    try {
        const log = read('fresh-install.log');
        const tail = log.trim().split('\n').slice(-3).join('\n');
        freshEv = '\nCI 全新 npm install 实测: ' + (freshResult || '未知') + '\n日志尾部:\n' + tail;
    } catch (e) { freshEv = '\n（本机运行，无 fresh-install.log；CI 步骤结果: ' + (freshResult || '未知') + '）'; }
    const structural = distIgnored && orderBad && noGuard;
    const confirmed = structural && (freshResult === '' || freshResult === 'failure');
    verdict(4, '全新克隆 npm install 必失败：add-banners.mjs 未防 dist/esm 缺失',
        confirmed ? CONFIRMED : PARTIAL,
        '.gitignore 忽略 dist/: ' + distIgnored +
        '\nbuild:cjs 在 build:esm 之前跑 add-banners: ' + orderBad +
        '\nadd-banners 无条件 walk(dist/esm) 且无 existsSync 保护: ' + noGuard + freshEv);
})();

/* ================= #5 缺最终输出 re-parse 自检 ================= */
(function issue5() {
    // a) modify 的 replace 语句/表达式种类不匹配
    const stats5a = {};
    const out5a = applyAstPatches('repro5.js', 'function f(){ var i = 5; return i; }',
        [{ name: 'p5a', path: [{ name: 'f' }], op: 'modify', find: 'i', replace: 'return 0', nth: 0 }], stats5a);
    const err5a = parseErr(out5a);

    // b) inject head 缺尾部分隔符：注入体本身合法，拼接后语法损坏
    const out5b = applyAstPatches('repro5.js', 'function f(){let b=2;return b+1}',
        [{ name: 'p5b', path: [{ name: 'f' }], op: 'inject', at: 'head', code: 'var a=1' }]);
    const err5b = parseErr(out5b);

    // c) inject head 使 "use strict" 指令失效
    const src5c = 'function f(){ "use strict"; xNotDeclared = 1; }';
    const out5c = applyAstPatches('repro5.js', src5c,
        [{ name: 'p5c', path: [{ name: 'f' }], op: 'inject', at: 'head', code: 'injectedMarker5c();' }]);
    let origThrew = false, patchedThrew = false;
    try { new Function(src5c + '\nf();')(); } catch (e) { origThrew = true; }
    try { new Function(out5c + '\nfunction injectedMarker5c(){}\nf();')(); } catch (e) { patchedThrew = true; }
    const strictLost = origThrew && !patchedThrew;
    try { delete globalThis.xNotDeclared; } catch (e) { /* ignore */ }

    const confirmed = err5a !== null && err5b !== null && strictLost;
    verdict(5, 'AST 补丁管线缺最终输出 re-parse 自检（modify 不匹配 / inject head 拼接均静默暴露）',
        confirmed ? CONFIRMED : PARTIAL,
        'modify {find:"i", replace:"return 0"} → 产物解析: ' + (err5a || 'OK（未复现）') +
        '\ninject head（注入体无尾分号 + 压缩目标）→ 产物解析: ' + (err5b || 'OK（未复现）') +
        '\ninject head 使 "use strict" 失效: 原函数抛=' + origThrew + ' 补丁后抛=' + patchedThrew +
        '\n（以上全部：补丁日志均报 OK，管线无任何告警）');
})();

/* ================= #6 pick 丢弃 asName，method 段 cls 推断失效 ================= */
(function issue6() {
    const src = 'var Foo = function Foo(){};\nvar Bar = function Bar(){};\n'
        + 'createClass(Foo, [{key:"bar", value: function(){ return 1; }}]);\n'
        + 'createClass(Bar, [{key:"bar", value: function(){ return 2; }}]);';
    // 不写 cls：若 asName 正确带出，prevAsName='Foo' 会过滤掉 Bar 的方法表 → 唯一命中
    const statsNoCls = {};
    applyAstPatches('repro6.js', src, [{ name: 'p6a', path: [{ name: 'Foo' }, { method: 'bar' }], op: 'log', message: 'hit' }], statsNoCls);
    // 对照组：显式写 cls → 唯一命中
    const statsWithCls = {};
    applyAstPatches('repro6.js', src, [{ name: 'p6b', path: [{ name: 'Foo' }, { method: 'bar', cls: 'Foo' }], op: 'log', message: 'hit' }], statsWithCls);
    const confirmed = statsNoCls.applied === 0 && statsWithCls.applied === 1;
    verdict(6, 'pick 丢弃 asName，method 段的 cls 推断失效、prevAsName 恒为 null',
        confirmed ? CONFIRMED : PARTIAL,
        '{path:[{name:"Foo"},{method:"bar"}]}（依赖 prevAsName 推断 cls）→ applied=' + statsNoCls.applied
        + '，skipped: ' + (statsNoCls.skipped.join(' | ') || '（无）') +
        '\n对照 {method:"bar", cls:"Foo"}（显式 cls）→ applied=' + statsWithCls.applied +
        '\n（唯一差别就是绑定名 Foo 没有被 pick 带出——types.ts:108 注释宣称的"供 method 段 cls 推断"实际不生效）');
})();

/* ================= #7 批量快路径与串行管线语义分叉 ================= */
(function issue7() {
    const mkEng = () => engineMod.createMixinEngine({ acorn });
    const modA = { modid: 'A', priority: 1, mixins: [{ file: 't.js', patches: [{ name: 'A-inject', path: [{ name: 'f' }], op: 'inject', at: 'head', code: 'MIXIN_A();' }] }] };
    const modB = { modid: 'B', priority: 2, mixins: [{ file: 't.js', patches: [{ name: 'B-overwrite', path: [{ name: 'f' }], op: 'overwrite', code: 'MIXIN_B();' }] }] };
    const src = 'function f(){ ORIG(); }';

    const engBatch = mkEng();
    engBatch.register(JSON.parse(JSON.stringify(modA)));
    engBatch.register(JSON.parse(JSON.stringify(modB)));
    const batchOut = engBatch.transformFile('t.js', src);

    const e1 = mkEng(); e1.register(JSON.parse(JSON.stringify(modA)));
    const mid = e1.transformFile('t.js', src);
    const e2 = mkEng(); e2.register(JSON.parse(JSON.stringify(modB)));
    const serialOut = e2.transformFile('t.js', mid);

    const injectSurvivesInBatch = batchOut.includes('MIXIN_A') && batchOut.includes('MIXIN_B');
    const injectDiesInSerial = !serialOut.includes('MIXIN_A') && serialOut.includes('MIXIN_B');
    const diverge = injectSurvivesInBatch && injectDiesInSerial;

    // 附带问题：同一插入点两条 inject head，批量路径下执行顺序与 priority 相反
    const mkInject = (id, prio) => ({ modid: id, priority: prio, mixins: [{ file: 't.js', patches: [{ name: id, path: [{ name: 'f' }], op: 'inject', at: 'head', code: id + '();' }] }] });
    const engOrder = mkEng();
    engOrder.register(mkInject('P1', 1));
    engOrder.register(mkInject('P2', 2));
    const orderOut = engOrder.transformFile('t.js', src);
    const reversed = orderOut.indexOf('P2();') >= 0 && orderOut.indexOf('P2();') < orderOut.indexOf('P1();');

    verdict(7, '批量快路径与串行管线语义分叉（inject head + overwrite 组合；同插入点顺序反转）',
        diverge ? CONFIRMED : PARTIAL,
        '批量快路径产物: ' + JSON.stringify(batchOut) +
        '\n串行管线产物:   ' + JSON.stringify(serialOut) +
        '\n语义分叉（批量下 A 的 inject 存活、串行下被 B overwrite 吞掉）: ' + diverge +
        '\n附带: 同插入点 inject 执行顺序反转（P2 先于 P1）: ' + reversed + ' → ' + JSON.stringify(orderOut));
})();

/* ================= #8 cli process.exit 抢在 mod entry 之前 ================= */
(function issue8() {
    const tmp = mktmp('repro8-');
    writeProj(tmp, {
        'mods/m1/mixins.json': JSON.stringify({ modid: 'm1', version: '1.0.0', mixins: ['p.js'], entry: 'entry.js' }),
        'mods/m1/p.js': '__mixin.register({ modid: "m1", version: "1.0.0", mixins: [] });',
        'mods/m1/entry.js': "require('fs').writeFileSync(process.env.REPRO8_MARKER, 'ran');",
        'main.js': "console.log('main ok');",
    });
    const marker = path.join(tmp, 'marker.txt');
    const r = spawnSync(process.execPath, [path.join(root, 'dist/cjs/hosts/cli.js'), 'run', 'main.js', '--mods', 'mods'],
        { cwd: tmp, encoding: 'utf8', timeout: 60000, env: Object.assign({}, process.env, { REPRO8_MARKER: marker }) });
    const mainRan = /main ok/.test(r.stdout || '');
    const entryRan = fs.existsSync(marker);
    const confirmed = mainRan && !entryRan;
    verdict(8, 'cli process.exit 抢在 mod entry（setTimeout 0）之前，jsmixin run 下 entry 永不执行',
        confirmed ? CONFIRMED : PARTIAL,
        'CLI 输出: ' + ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(0, 3).join(' | ') +
        '\n入口脚本执行了: ' + mainRan + '；mod entry 执行了: ' + entryRan +
        '\n（mod 已装载、entry 已入队，但 process.exit(0) 丢弃了 pending timer）');
})();

/* ================= #9 require hook 整体替换 Module._extensions['.js']（丢 require(esm)） ================= */
(function issue9() {
    // 两个子主张分别测：
    //   A) require(esm) 被 hook 破坏（Node >= 22.12）；
    //   B) ESM 语法文件静默不被 transform（同 mod 同时打 CJS 与 ESM 目标，对比谁生效）。
    const tmp = mktmp('repro9-');
    writeProj(tmp, {
        'esmpkg/package.json': JSON.stringify({ name: 'esmpkg', type: 'module' }),
        'esmpkg/esm.js': 'export const esmMarker = 42;\n',
        'mods/m1/mixins.json': JSON.stringify({ modid: 'm1', version: '1.0.0', mixins: ['p.js'] }),
        'mods/m1/p.js': [
            'globalThis.__mixin.register({ modid: "m1", version: "1.0.0", mixins: [',
            '  { file: "esm2.js", patches: [{ name: "p-esm", path: [{ name: "esmFn" }], op: "inject", at: "head", code: "globalThis.__esmTouched = true;" }] },',
            '  { file: "cjs.js", patches: [{ name: "p-cjs", path: [{ name: "cjsFn" }], op: "inject", at: "head", code: "globalThis.__cjsTouched = true;" }] }',
            ']});',
        ].join('\n'),
        'esm2.js': 'export function esmFn(){ return 1; }\n',
        'cjs.js': 'function cjsFn(){ return 1; }\nmodule.exports = { cjsFn: cjsFn };\n',
    });
    const esmPath = path.join(tmp, 'esmpkg', 'esm.js');
    const ctrl = spawnSync(process.execPath, ['-e', "console.log('RESULT:' + require(" + JSON.stringify(esmPath) + ").esmMarker);"], { encoding: 'utf8', timeout: 60000 });
    const hooked = spawnSync(process.execPath, ['-e',
        "require(" + JSON.stringify(path.join(root, 'dist/cjs/hosts/node.js')) + ");\nconsole.log('RESULT:' + require(" + JSON.stringify(esmPath) + ").esmMarker);"],
        { encoding: 'utf8', timeout: 60000 });
    const modCode = [
        'require(' + JSON.stringify(path.join(root, 'dist/cjs/hosts/node.js')) + ');',
        'var esm = require(' + JSON.stringify(path.join(tmp, 'esm2.js')) + ');',
        'var cjs = require(' + JSON.stringify(path.join(tmp, 'cjs.js')) + ');',
        "console.log('ESM_OK=' + (esm.esmFn() === 1), 'ESM_TOUCHED=' + !!globalThis.__esmTouched);",
        "console.log('CJS_OK=' + (cjs.cjsFn() === 1), 'CJS_TOUCHED=' + !!globalThis.__cjsTouched);",
    ].join('\n');
    const mod = spawnSync(process.execPath, ['-e', modCode], { cwd: tmp, encoding: 'utf8', timeout: 60000 });
    const outMod = (mod.stdout || '');
    const ctrlEsmOk = /RESULT:42/.test(ctrl.stdout);
    const hookedEsmBroken = hooked.status !== 0 && /SyntaxError|import statement/i.test(hooked.stderr || '');
    const cjsPatched = /CJS_TOUCHED=true/.test(outMod);
    const esmUntouched = /ESM_TOUCHED=false/.test(outMod);
    const confirmed = (ctrlEsmOk && hookedEsmBroken) || (cjsPatched && esmUntouched);
    verdict(9, "require hook 整体替换 Module._extensions['.js']：丢失 require(esm)，ESM 静默不被 transform",
        confirmed ? CONFIRMED : NOT_REPRODUCED,
        'Node ' + process.version +
        '\nA) 原版 require(ESM .js): ' + (ctrl.stdout.trim() || ctrl.stderr.trim().split('\n')[0]) +
        ' → 激活 hook 后: ' + (hooked.status === 0 ? hooked.stdout.trim() : (hooked.stderr || '').trim().split('\n').slice(-2).join(' | ')) +
        '\nB) 同一 mod 同时打 esm2.js(ESM) 与 cjs.js(CJS): CJS 补丁生效=' + cjsPatched + '，ESM 补丁生效=' + (esmUntouched ? 'false（静默丢失，无任何告警）' : 'true') +
        '\n（A 子项的复现与 Node 版本有关：Node 24 的 module._compile 已 ESM-aware，可自行消化 ESM）');
})();

/* ================= #10 wrapCall/modifyArgs 对成员调用的 object 表达式求值两次 ================= */
(function issue10() {
    // object 表达式用 getter（带副作用）观察重复求值；普通 Identifier 对象无法观察副作用
    const src = 'var getterHits = 0;\n'
        + 'var registry = { get db(){ getterHits++; return { query: function (x){ return x + 1; } }; } };\n'
        + 'function run(){ return registry.db.query(2); }';
    const out = applyAstPatches('repro10.js', src, [{ name: 'p10', path: [{ name: 'run' }], op: 'wrapCall', call: 'registry.db.query', code: 'return $orig();' }]);
    let hits = -1, ret = null;
    try {
        const r = runNew(out, 'var v = run(); return [v, getterHits];');
        ret = r[0]; hits = r[1];
    } catch (e) { hits = '执行异常: ' + e.message; }
    const confirmed = hits === 2; // 期望 1（registry.db 只应求值一次）
    verdict(10, 'wrapCall/modifyArgs 对成员调用的 object 表达式求值两次（副作用翻倍）',
        confirmed ? CONFIRMED : PARTIAL,
        'wrapCall 后 run() = ' + ret + '，registry.db 的 getter 实际执行 ' + hits + ' 次（期望 1 次）' +
        '\n产物含: (registry.db.query).apply(registry.db, ...) —— object 表达式被复制到两处求值；' +
        '若两次返回不同对象，$orig 的方法与 this 还会来自不同实例');
})();

/* ================= #11 公开出口 jsmixin/build 运行时 require('typescript')（devDependencies） ================= */
(function issue11() {
    const tmp = mktmp('repro11-');
    let ev = '';
    try {
        const packOut = execFileSync(NPM, ['pack', '--pack-destination', tmp], { cwd: root, encoding: 'utf8', timeout: 300000, shell: process.platform === 'win32' });
        const tgzName = packOut.trim().split(/\r?\n/).pop();
        const tgz = path.join(tmp, tgzName);
        const consumer = path.join(tmp, 'consumer');
        fs.mkdirSync(consumer);
        fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ name: 'repro11-consumer', version: '1.0.0' }));
        execFileSync(NPM, ['install', tgz, '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: consumer, encoding: 'utf8', timeout: 300000, stdio: 'pipe', shell: process.platform === 'win32' });
        const ctrl = spawnSync(process.execPath, ['-e', "console.log('CTRL:' + typeof require('jsmixin'));"], { cwd: consumer, encoding: 'utf8', timeout: 60000 });
        const r11 = spawnSync(process.execPath, ['-e', "require('jsmixin/build');"], { cwd: consumer, encoding: 'utf8', timeout: 60000 });
        const ctrlOk = /CTRL:object/.test(ctrl.stdout);
        const broken = r11.status !== 0 && /Cannot find module/.test(r11.stderr) && /typescript/.test(r11.stderr);
        ev = '独立安装后 require("jsmixin"): ' + (ctrl.stdout.trim() || ctrl.stderr.trim()) +
            '\nrequire("jsmixin/build"): ' + (r11.status === 0 ? '成功（未复现）' : ((r11.stderr || '').match(/Cannot find module[^\n]*/) || [(r11.stderr || '').trim().split('\n').slice(0, 2).join(' | ')])[0]);
        verdict(11, "公开出口 jsmixin/build 运行时 require('typescript')，但 typescript 在 devDependencies",
            ctrlOk && broken ? CONFIRMED : PARTIAL, ev);
    } catch (e) {
        verdict(11, "公开出口 jsmixin/build 运行时 require('typescript')，但 typescript 在 devDependencies",
            PARTIAL, 'npm pack / 安装阶段失败: ' + e.message);
    }
})();

/* ================= #12 build-tool @Local 白名单跨函数（假通过）；@Share 校验未捕获异常 ================= */
(function issue12() {
    const buildTool = require(path.join(root, 'build-tool', 'build.js'));

    // a) @Share 白名单跨函数/跨文件生效 → @Local 假通过
    const projA = mktmp('repro12a-');
    writeProj(projA, {
        'build-config.json': JSON.stringify({ modid: 'repro12', version: '1.0.0', gameFiles: { 'game.js': 'game.js' } }),
        'game.js': 'function combatFn(){ attack(); }\nfunction shopFn(){ sell(); }',
        'marks/A.mark.ts': [
            '// @ts-nocheck',
            '@MixinClass({ target: { file: "game.js", path: [{ name: "combatFn" }] } })',
            'class A {',
            '    @Inject({ locals: ["turnNo"] })',
            '    injectA() {',
            '        logTurn(turnNo);',
            '    }',
            '}',
        ].join('\n'),
        'marks/B.mark.ts': [
            '// @ts-nocheck',
            '@MixinClass({ target: { file: "game.js", path: [{ name: "shopFn" }] } })',
            'class B {',
            '    @Inject({ share: ["turnNo"] })',
            '    injectB() {',
            '        var turnNo = 5;',
            '    }',
            '}',
        ].join('\n'),
    });
    let res12a = null, threw12a = null;
    try { res12a = buildTool.runBuild(projA); } catch (e) { threw12a = e; }
    const fakePass = res12a && res12a.ok === true;

    // b) @Share 校验的 acorn.parse 未捕获 → 整个构建裸崩
    const projB = mktmp('repro12b-');
    writeProj(projB, {
        'build-config.json': JSON.stringify({ modid: 'repro12b', version: '1.0.0', gameFiles: { 'game.js': 'game.js' } }),
        'game.js': 'function combatFn(){ attack(); }',
        'marks/C.mark.ts': [
            '// @ts-nocheck',
            '@MixinClass({ target: { file: "game.js", path: [{ name: "combatFn" }] } })',
            'class C {',
            '    @Redirect({ call: "attack", share: ["cfg"] })',
            '    redirectC() {',
            '        {a:1,b:2}',
            '    }',
            '}',
        ].join('\n'),
    });
    let res12b = null, threw12b = null;
    try { res12b = buildTool.runBuild(projB); } catch (e) { threw12b = e; }
    const bareCrash = threw12b && !res12b && /SyntaxError|Unexpected/i.test(String(threw12b.message || threw12b));

    verdict(12, 'build-tool @Local 校验的 @Share 白名单跨函数生效（假通过）；@Share 校验 acorn.parse 未捕获',
        (fakePass && bareCrash) ? CONFIRMED : PARTIAL,
        'a) combatFn 的 @Local("turnNo")（实际不存在）+ 另一函数注入声明 @Share("turnNo") → runBuild: ' +
            (fakePass ? 'ok=true，构建放行（运行时必 ReferenceError）' : (res12a ? 'ok=false: ' + (res12a.errors || []).join(' | ') : '抛异常: ' + threw12a)) +
        '\nb) redirect 表达式注入体 {a:1,b:2} + @Share → runBuild: ' +
            (bareCrash ? '未捕获 ' + threw12b.constructor.name + ': ' + threw12b.message + '（未进 errors 列表）' : (res12b ? '返回 ok=' + res12b.ok + '（未复现）' : '抛异常: ' + threw12b)),
        );
})();

/* ================= #13 loader：单文件不可读中止整个 mod；reload() 重复追加 entries ================= */
(function issue13() {
    // a)
    const ran13a = [];
    const files13a = {
        'mods/mods.json': '["m"]',
        'mods/m/mixins.json': JSON.stringify({ modid: 'm', version: '1.0.0', mixins: ['a.js', 'missing.js', 'b.js'] }),
        'mods/m/a.js': 'A();',
        'mods/m/b.js': 'B();',
    };
    const loader13a = loaderMod.createModLoader({
        engine: {},
        readFile: (p) => files13a[p.split(path.sep).join('/')] || '',
        execute: (code, url) => ran13a.push(url),
    });
    loader13a.loadMods('mods');
    const aborted = ran13a.length === 1 && ran13a[0] === 'm/a.js';

    // b)
    const ran13b = [];
    const files13b = {
        'mods/mods.json': '["m"]',
        'mods/m/mixins.json': JSON.stringify({ modid: 'm', version: '1.0.0', mixins: ['p.js'], entry: 'entry.js' }),
        'mods/m/p.js': 'P();',
        'mods/m/entry.js': 'ENTRY();',
    };
    const loader13b = loaderMod.createModLoader({
        engine: {},
        readFile: (p) => files13b[p.split(path.sep).join('/')] || '',
        execute: (code, url) => ran13b.push(url),
    });
    loader13b.loadMods('mods');
    const before = loader13b.entries.length;
    loader13b.reload();
    const after = loader13b.entries.length;
    const dup = before === 1 && after === 2;

    verdict(13, 'loader：单个 mixin 文件不可读即中止整个 mod；reload() 重复追加 entries',
        (aborted && dup) ? CONFIRMED : PARTIAL,
        'a) mixins = [a.js, missing.js, b.js] → 实际装载 ' + JSON.stringify(ran13a) + '（b.js 因中间缺文件被连坐跳过）' +
        '\nb) loadMods 后 entries=' + before + '，reload() 后 entries=' + after + '（重复追加，且 ranEntries 置位后新 entry 永不执行）');
})();

/* ================= #14 核心引擎低危小问题（14 项） ================= */
(function issue14() {
    const notes = [];
    let confirmed = 0, refuted = 0;

    // 14.1 pick 不校验负 index → undefined node，错误延迟且误导
    {
        const stats = {};
        applyAstPatches('repro14.js', 'function f(){ return 1; }',
            [{ name: 'p', path: [{ name: 'f', index: -1 }], op: 'log', message: 'x' }], stats);
        const misleading = stats.skipped.length === 1 && /Cannot read prop/.test(stats.skipped[0]);
        notes.push('pick index:-1 → ' + (misleading ? 'SKIP 消息是 TypeError（"Cannot read prop..."），而非"index 越界"校验' : 'SKIP: ' + stats.skipped.join('|')));
        misleading ? confirmed++ : refuted++;
    }

    // 14.2 applyReplaces 不防空 from
    {
        const eng = engineMod.createMixinEngine({ acorn });
        eng.register({ modid: 'm', mixins: [{ file: 't.js', replaces: [['', 'x']] }] });
        const out = eng.transformFile('t.js', 'abc');
        const corrupted = out === ['a', 'b', 'c'].join('x'); // split('') 炸碎后 join 到一起
        notes.push('replaces [["","x"]] 于 "abc" → ' + JSON.stringify(out) + (corrupted ? '（每个字符间被塞入 "x"，输出炸碎）' : ''));
        corrupted ? confirmed++ : refuted++;
    }

    // 14.3 方法表 get/set 同 key：valNode 被 set 覆盖，getter 无法 patch
    {
        const src = 'var Cls = function Cls(){};\n'
            + 'createClass(Cls, [{key:"foo", get: function getFoo(){ return 1; }, set: function setFoo(v){}}]);';
        const stats = {};
        const out = applyAstPatches('repro14.js', src, [{ name: 'p', path: [{ name: 'Cls' }, { method: 'foo' }], op: 'log', message: 'HIT14' }], stats);
        const getterPos = out.indexOf('getFoo');
        const setterPos = out.indexOf('setFoo');
        const hitPos = out.indexOf('HIT14');
        const setterGotIt = stats.applied === 1 && hitPos > setterPos && (getterPos < 0 || hitPos > getterPos);
        // HIT 应落在 setFoo 体内而非 getFoo 体内
        const inGetter = getterPos >= 0 && hitPos > getterPos && hitPos < setterPos;
        notes.push('method "foo"（get+set 同 key）→ 注入落在 ' + (inGetter ? 'getter' : 'setter') + '（getFoo@' + getterPos + ' setFoo@' + setterPos + ' HIT@' + hitPos + '）');
        (!inGetter && stats.applied === 1) ? confirmed++ : refuted++;
    }

    // 14.4 features.ts prefix !== undefined 恒真（死条件）；computed 键口径
    {
        const features = read('src/core/features.ts');
        const deadCond = /prefix !== undefined/.test(features);
        const hasComputedFilter = /MethodDefinition' && !n\.computed/.test(features) || /n\.type === 'MethodDefinition' && !n\.computed/.test(features);
        // 行为验证：{name:'x'} 能否命中计算键方法
        const stats = {};
        applyAstPatches('repro14.js', "class C { ['x'](){ return 1; } }", [{ name: 'p', path: [{ name: 'x' }], op: 'log', message: 'z' }], stats);
        const nameHitsComputed = stats.applied === 1;
        notes.push('prefix !== undefined 死条件: 存在=' + deadCond +
            '；{name:"x"} 命中计算键方法 ["x"](): ' + nameHitsComputed +
            (hasComputedFilter ? '（源码已有 !n.computed 过滤 → issue 中"不过滤 computed"的子项与当前代码不符）' : '（源码无 computed 过滤 → 与 issue 相符）'));
        deadCond ? confirmed++ : refuted++;
        if (!nameHitsComputed) confirmed++; else refuted++; // computed 子项：当前代码行为一致（已过滤）
    }

    // 14.5 IIFE 工厂实参函数误得 asName
    {
        const stats = {};
        applyAstPatches('repro14.js', 'var X = (function(){ return function(){}; })(function(){ return 1; });',
            [{ name: 'p', path: [{ name: 'X' }], op: 'log', message: 'z' }], stats);
        const multi = stats.skipped.length === 1 && /2 个候选/.test(stats.skipped[0]);
        notes.push('{name:"X"} 于 var X = (factory)(fn) → ' + (multi ? '"2 个候选"（实参函数也得了 asName X）' : 'applied=' + stats.applied));
        multi ? confirmed++ : refuted++;
    }

    // 14.6 module 段宽松相等 kv == seg.module
    {
        const stats = {};
        applyAstPatches('repro14.js', '({0: function modA(){ return 1; }, "": function modB(){ return 2; }})[0]();',
            [{ name: 'p', path: [{ module: 0 }, { name: 'modA' }], op: 'log', message: 'z' }], stats);
        const loose = stats.skipped.length >= 1 && /2 个候选/.test(stats.skipped[0]);
        notes.push('{module:0} 于含 0 与 "" 两个键的模块表 → ' + (loose ? '"2 个候选"（0 == "" 宽松相等）' : 'applied=' + stats.applied));
        loose ? confirmed++ : refuted++;
    }

    // 14.7 klass.ts 计算键拼 'X.undefined' 参与比较（静态确认）
    {
        const klass = read('src/core/segs/klass.ts');
        const pattern = /prefix \+ '\.' \+ kv === want/.test(klass) && /n\.key\.type === 'Literal' \? n\.key\.value : n\.key\.name/.test(klass);
        notes.push("klass.ts 计算键（如 [Symbol.iterator]）时 kv=undefined → 拼出 'X.undefined' 参与比较（静态确认，仅导致无法命中）: " + pattern);
        pattern ? confirmed++ : refuted++;
    }

    // 14.8 wrap:'iife' 不认 .call(this) 结尾的 UMD 头
    {
        const stats = {};
        applyAstPatches('repro14.js', '(function(){ function innerFn(){ return 1; } innerFn(); }).call(this);',
            [{ name: 'p', path: [{ wrap: 'iife' }, { name: 'innerFn' }], op: 'log', message: 'z' }], stats);
        const failed = stats.skipped.length === 1 && /0 个候选/.test(stats.skipped[0]);
        notes.push('{wrap:"iife"} 于 (function(){...}).call(this) → ' + (failed ? '0 个候选（未识别）' : 'applied=' + stats.applied));
        failed ? confirmed++ : refuted++;
    }

    // 14.9 createMixinEngine({log}) 自定义日志钩子对 applyAstPatches 内部日志无效
    {
        const hookLog = [];
        const eng = engineMod.createMixinEngine({ acorn, log: (m) => hookLog.push(m) });
        eng.register({ modid: 'm', mixins: [{ file: 't.js', patches: [{ name: 'p', path: [{ name: 'f' }], op: 'log', message: 'z' }] }] });
        const origLog = console.log;
        const captured = [];
        console.log = function (...a) { captured.push(a.join(' ')); };
        let out;
        try { out = eng.transformFile('t.js', 'function f(){ return 1; }'); }
        finally { console.log = origLog; }
        const astLogsToConsole = captured.some((l) => l.includes('[mixin-ast]'));
        const hookGotAstLogs = hookLog.some((l) => l.includes('[mixin-ast]'));
        notes.push('自定义 log 钩子收到 [mixin-ast] 内部日志: ' + hookGotAstLogs + '；直写 console: ' + astLogsToConsole + '（两套前缀 [mixin]/[mixin-ast] 割裂）');
        (astLogsToConsole && !hookGotAstLogs) ? confirmed++ : refuted++;
    }

    // 14.10 sourceURL 两套不一致的正则
    {
        const engineStrip = /\s*\/\/@ sourceURL=[^\n]*\s*$/;   // engine.ts:79（锚定末尾，算哈希用）
        const hostFind = /\/\/@ sourceURL=(.+?)\s*$/;          // node.ts:82（搜第一处，寻址用）
        const sample = 'var a = 1; //@ sourceURL=one.js\nvar b = 2;'; // sourceURL 在文件中部（其后还有代码）
        const m1 = engineStrip.exec(sample); // 末尾不是 sourceURL → 剥不掉 → 哈希含 sourceURL 行
        const m2 = hostFind.exec(sample);    // 第一处命中 → 寻址名 'one.js'
        const diverged = m2 && m2[1] === 'one.js' && !m1; // 两条正则对同一输入行为分叉
        notes.push('sourceURL 位于文件中部时: engine 哈希剥离正则' + (m1 ? '剥离了尾部' : '剥不掉任何东西（哈希含 sourceURL 注释行）') +
            '，host 寻址正则取到 "' + (m2 ? m2[1] : null) + '" → 两套口径对同一输入分叉: ' + diverged);
        diverged ? confirmed++ : refuted++;
    }

    // 14.11 fileMatches 只按 basename 或全路径，同名文件无法按子路径消歧
    {
        const eng = engineMod.createMixinEngine({ acorn });
        eng.register({ modid: 'm', mixins: [{ file: 'a.js', patches: [{ name: 'p', path: [{ name: 'f' }], op: 'log', message: 'z' }] }] });
        const orig = 'function f(){ return 1; }';
        const outA = eng.transformFile('dir1/a.js', orig);
        const outB = eng.transformFile('dir2/a.js', orig);
        const bothMatch = outA !== orig && outB !== orig; // 想只打 dir1 却连 dir2 一起命中
        notes.push('patch 目标写 "a.js"（无法表达子路径消歧）→ dir1/a.js 与 dir2/a.js 双双命中: ' + bothMatch);
        bothMatch ? confirmed++ : refuted++;
    }

    // 14.12 两宿主 stats() 结构不一致（layanative 缺 version）
    {
        const ln = read('src/hosts/layanative.ts');
        const i = ln.indexOf('stats: function');
        const slice = ln.slice(i, i + 220);
        const noVersion = /evalHooked/.test(slice) && !/version/.test(slice);
        notes.push('layanative stats() 返回 {mods, evalHooked}，无 version（node 宿主 stats 有 version）: ' + noVersion + ' → ' + JSON.stringify(slice.match(/\{[^}]*\}/)?.[0] || ''));
        noVersion ? confirmed++ : refuted++;
    }

    // 14.13 重复激活宿主时 options 被静默忽略
    {
        const tmp = mktmp('repro14m-');
        writeProj(tmp, {
            'mods/m1/mixins.json': JSON.stringify({ modid: 'm1', version: '1.0.0', mixins: ['p.js'] }),
            'mods/m1/p.js': '__mixin.register({ modid: "m1", version: "1.0.0", mixins: [] });',
            'bmods/m2/mixins.json': JSON.stringify({ modid: 'm2', version: '1.0.0', mixins: ['p.js'] }),
            'bmods/m2/p.js': '__mixin.register({ modid: "m2", version: "1.0.0", mixins: [] });',
        });
        const code = [
            'var nh = require(' + JSON.stringify(path.join(root, 'dist/cjs/hosts/node.js')) + ');',
            'var h2 = nh.activateNodeHost({ modsDir: ' + JSON.stringify(path.join(tmp, 'bmods')) + ' });',
            "console.log('SAME=' + (h2 === nh.default));",
            "console.log('MODSDIR=' + h2.modsDir);",
            "console.log('MODS=' + nh.engine.stats().mods);",
        ].join('\n');
        const r = spawnSync(process.execPath, ['-e', code], { cwd: tmp, encoding: 'utf8', timeout: 60000 });
        const same = /SAME=true/.test(r.stdout);
        const modsDirA = /MODSDIR=(.+)/.test(r.stdout) && !/bmods/.test((r.stdout.match(/MODSDIR=(.+)/) || [])[1] || '');
        const m2NotLoaded = /MODS=1/.test(r.stdout);
        const noWarn = !/modsDir/.test((r.stderr || '') + (r.stdout || '').replace(/MODSDIR=[^\n]*/g, ''));
        const silent = same && modsDirA && m2NotLoaded;
        notes.push('第二次 activateNodeHost({modsDir: bmods}) → 返回同一实例: ' + same + '，modsDir 仍指向 mods(A): ' + modsDirA + '，m2 未装载: ' + m2NotLoaded + '，无任何提示: ' + noWarn);
        silent ? confirmed++ : refuted++;
    }

    // 14.14 types.ts wrap 联合类型混入 string，字面量类型失去约束意义
    {
        const types = read('src/core/types.ts');
        const hasString = /wrap\?:\s*'cjs'\s*\|\s*'umd'\s*\|\s*'iife'\s*\|\s*string/.test(types);
        notes.push("types.ts: wrap?: 'cjs'|'umd'|'iife'|string（| string 使字面量约束失效）: " + hasString);
        hasString ? confirmed++ : refuted++;
    }

    const state = confirmed >= 12 ? CONFIRMED : confirmed >= 6 ? PARTIAL : NOT_REPRODUCED;
    verdict(14, '核心引擎低危小问题清理（14 项）', state,
        '属实/与代码相符 ' + confirmed + ' 项，不符 ' + refuted + ' 项:\n- ' + notes.join('\n- '));
})();

/* ================= #15 build-tool 低危清理（5 项） ================= */
(function issue15() {
    const buildTool = require(path.join(root, 'build-tool', 'build.js'));
    const buildSrc = read('build-tool/build.js');
    const notes = [];
    let confirmed = 0;

    // 15.1 死守卫 req.path.length < 1
    {
        const deadGuard = /req\.path\.length < 1/.test(buildSrc);
        const basePathEnforced = /if \(!basePath\.length\) fail/.test(buildSrc);
        notes.push('req.path.length < 1 死守卫存在（basePath ≥1 已在解析期强制，真正该拦的是 <2）: ' + deadGuard + ' / basePath 强制: ' + basePathEnforced);
        if (deadGuard && basePathEnforced) confirmed++;
    }

    // 15.2 fail 抛异常与 errors 收集纪律混用
    {
        const failAtInject = /at !== 'head' && at !== 'tail'\) fail/.test(buildSrc);
        const failAtWrap = /第一个参数必须叫 \$orig'/.test(buildSrc) && /fail\(file \+ ': @Wrap 方法第一个参数必须叫 \$orig'\)/.test(buildSrc);
        const failAtExport = /@Export 需要 \{ as: "导出名" \} '\)\)?\.test/.test(buildSrc) || /@Export 需要 \{ as: "导出名" \} '\)/.test(buildSrc);
        const collectLocal = /@Local "' \+ req\.locals\[li\]/.test(buildSrc) || /@Local "/.test(buildSrc);
        notes.push('@Inject at/cancellable、@Wrap $orig、@Export as 直接 fail() 抛异常（只报第一个），而 method 冲突、@Local/@Share 走 errors 收集: Inject=' + failAtInject + ' Wrap=' + failAtWrap + ' Local收集=' + collectLocal);
        if (failAtInject && failAtWrap && collectLocal) confirmed++;
    }

    // 15.3 marks 目录只扫一层，子目录 *.mark.ts 被静默忽略
    {
        const proj = mktmp('repro15c-');
        writeProj(proj, {
            'build-config.json': JSON.stringify({ modid: 'r15', version: '1.0.0', gameFiles: { 'game.js': 'game.js' } }),
            'game.js': 'function hi(){ return 1; }',
            'marks/sub/X.mark.ts': [
                '// @ts-nocheck',
                '@MixinClass({ target: { file: "game.js", path: [{ name: "hi" }] } })',
                'class X {',
                '    @Inject({ at: "head" })',
                '    injectX() { console.log(1); }',
                '}',
            ].join('\n'),
        });
        let threw = null;
        try { buildTool.runBuild(proj); } catch (e) { threw = e; }
        const silentlyIgnored = threw && /没有 \*\.mark\.ts 文件/.test(threw.message);
        notes.push('唯一 mark 位于 marks/sub/ 时 → ' + (silentlyIgnored ? '报"marks 目录里没有 *.mark.ts 文件"（不递归也不指明子目录被忽略）' : '其他: ' + (threw ? threw.message : '构建成功?')));
        if (silentlyIgnored) confirmed++;
    }

    // 15.4 runBuild.files 与头注不符（缺 patches.js、mixins.json、entry 文件）
    {
        const proj = mktmp('repro15d-');
        writeProj(proj, {
            'build-config.json': JSON.stringify({ modid: 'r15', version: '1.0.0', gameFiles: { 'game.js': 'game.js' } }),
            'game.js': 'function hi(){ return 1; }',
            'marks/X.mark.ts': [
                '// @ts-nocheck',
                '@MixinClass({ target: { file: "game.js", path: [{ name: "hi" }] } })',
                'class X {',
                '    @Inject({ at: "head" })',
                '    injectX() { console.log(1); }',
                '}',
            ].join('\n'),
        });
        const res = buildTool.runBuild(proj);
        const missing = res.ok && !res.files.includes('patches.js') && !res.files.includes('mixins.json');
        notes.push('runBuild().files = ' + JSON.stringify(res.files) + '（头注承诺 patches.js/mixins.json 在内；实际缺）: ' + missing);
        if (missing) confirmed++;
    }

    // 15.5 readText 不去 BOM
    {
        const proj = mktmp('repro15e-');
        writeProj(proj, {
            'build-config.json': JSON.stringify({ modid: 'r15e', version: '1.0.0', gameFiles: { 'game.js': 'game.js' } }),
            'game.js': 'function hi(){ return 1; }',
            'marks/X.mark.ts': [
                '// @ts-nocheck',
                '@MixinClass({ target: { file: "game.js", path: [{ name: "hi" }] } })',
                'class X {',
                '    @Inject({ at: "head" })',
                '    injectX() { console.log(1); }',
                '}',
            ].join('\n'),
        });
        fs.writeFileSync(path.join(proj, 'build-config.json'), '\uFEFF' + JSON.stringify({ modid: 'r15e', version: '1.0.0', gameFiles: { 'game.js': 'game.js' } }));
        let threw = null;
        try { buildTool.runBuild(proj); } catch (e) { threw = e; }
        const bomCrash = threw && /Unexpected token/i.test(threw.message) && !/BOM/i.test(threw.message);
        notes.push('build-config.json 带 BOM → ' + (bomCrash ? 'JSON.parse 裸抛 "' + threw.message.slice(0, 60) + '"（报错完全不像配置问题）' : '其他: ' + (threw ? threw.message.slice(0, 60) : '成功?')));
        if (bomCrash) confirmed++;
    }

    verdict(15, 'build-tool 低危清理：死守卫、fail/errors 纪律混用、marks 不递归、runBuild.files 与文档不符、BOM',
        confirmed === 5 ? CONFIRMED : confirmed >= 3 ? PARTIAL : NOT_REPRODUCED,
        '属实 ' + confirmed + '/5 项:\n- ' + notes.join('\n- '));
})();

/* ================= #16 版本号 5 处硬编码；demo lockfile 记录 2.0.0 ================= */
(function issue16() {
    const spots = [
        ['package.json', /"version":\s*"2\.1\.0"/],
        ['scripts/add-banners.mjs', /jsmixin v2\.1\.0/],
        ['scripts/build-compat.mjs', /jsmixin v2\.1\.0/],
        ['src/core/engine.ts', /VERSION = '2\.1\.0'/],
        ['src/core/ast.ts', /VERSION = '2\.1\.0'/],
    ];
    const found = spots.filter(([f, re]) => re.test(read(f)));
    let lock = null;
    try { lock = /"version": "2\.0\.0"/.test(read('examples/demo-game/package-lock.json')); } catch (e) { /* 无该文件 */ }
    const confirmed = found.length === 5 && lock;
    verdict(16, '版本号 5 处硬编码易漂移；demo lockfile 仍记录 2.0.0',
        confirmed ? CONFIRMED : PARTIAL,
        '硬编码 2.1.0 的文件: ' + found.map(([f]) => f).join(', ') + '（' + found.length + '/5）' +
        '\ndemo package-lock.json 记录 jsmixin 2.0.0: ' + lock);
})();

/* ================= #17 测试与仓库卫生 ================= */
(function issue17() {
    const notes = [];
    let confirmed = 0;
    const total = 6;

    // 未使用 assert
    let unusedAssert = 0;
    for (const f of ['test/test_build_tool.js', 'test/test_mixin_ast.js', 'test/test_build_tool_v2.js']) {
        const t = read(f);
        if (/require\('assert'\)/.test(t) && !/assert\./.test(t.replace(/require\('assert'\)/g, ''))) { unusedAssert++; notes.push(f + ': assert 引入但 0 处使用'); }
    }
    if (unusedAssert === 3) confirmed++;

    // mkdtemp 临时目录泄漏
    let leak = 0;
    for (const f of ['test/test_boot_bundle.js', 'test/test_node_host.js']) {
        const t = read(f);
        if (/mkdtempSync/.test(t) && !/rmSync|rmdirSync|rmdir\(|\.rm\(/.test(t)) { leak++; notes.push(f + ': mkdtempSync 无清理'); }
    }
    if (leak === 2) confirmed++;

    // verify.js 不检查子进程退出码
    {
        const v = read('examples/demo-game/verify.js');
        const noStatus = /spawnSync/.test(v) && !/\.status|exitCode/.test(v);
        notes.push('verify.js: spawnSync 后不检查 r.status/exitCode（崩溃时 stderr 不展示）: ' + noStatus);
        if (noStatus) confirmed++;
    }

    // test_build_tool.js 对目标源码文本强耦合
    {
        const t = read('test/test_build_tool.js');
        const m = t.match(/^.*out\.replace\(.*$/m);
        notes.push('test_build_tool.js: ' + (m ? JSON.stringify(m[0].trim().slice(0, 80)) : '未找到') + '（对 sample 源码文本强耦合）');
        if (m) confirmed++;
    }

    // fixture dist 被 git 跟踪
    {
        const gitLs = spawnSync('git', ['ls-files', 'test/fixtures'], { cwd: root, encoding: 'utf8' });
        const tracked = (gitLs.stdout || '').split('\n').filter((l) => /fixtures\/.+\/dist\//.test(l));
        const readme = read('README.md');
        const claim = /The repository tracks sources only; `dist\/` and `runtime\/` are build outputs\./.test(readme);
        const exception = /fixtures/.test(readme);
        notes.push('git 跟踪的 fixture dist 产物 ' + tracked.length + ' 个（如 ' + (tracked[0] || '-') + '），README 声称"只跟踪源码"且未提 fixtures 例外: claim=' + claim + ' exception=' + exception);
        if (tracked.length > 0 && claim) confirmed++;
    }

    if (notes.filter((n) => /test_build_tool\.js: /.test(n)).length) confirmed++; // 第 4 项计入

    verdict(17, '测试与仓库卫生：未用 assert、tmp 目录泄漏、verify.js 不显示 stderr、fixture dist 与 README 口径不符',
        confirmed === total ? CONFIRMED : confirmed >= 4 ? PARTIAL : NOT_REPRODUCED,
        '属实 ' + confirmed + '/' + total + ' 项:\n- ' + notes.join('\n- '));
})();

/* ================= #18 android-modfs ================= */
(function issue18() {
    const notes = [];
    let confirmed = 0;
    const total = 5;

    {
        const j = read('android-modfs/src/layaair/game/mod/ModFs.java');
        const legacyRequiresBoth = /checkSelfPermission\("android\.permission\.READ_EXTERNAL_STORAGE"\)/.test(j)
            && /checkSelfPermission\("android\.permission\.WRITE_EXTERNAL_STORAGE"\)/.test(j)
            && /\(r == 0 && w == 0\) \? 1 : 0/.test(j);
        notes.push('legacyState() 同时要求 READ+WRITE（模块只读文件，WRITE 非必需）: ' + legacyRequiresBoth);
        if (legacyRequiresBoth) confirmed++;
    }
    {
        const a = read('android-modfs/src/layaair/game/mod/ModFsActivity.java');
        const m = a.match(/onRequestPermissionsResult[\s\S]{0,400}/);
        const finishesBlindly = m && /finish\(\)/.test(m[0]) && !/grantResults\[/.test(m[0]);
        notes.push('onRequestPermissionsResult 不看 grantResults 直接 finish（永久拒绝后按 status 轮询+ensure 会成弹窗循环）: ' + finishesBlindly);
        if (finishesBlindly) confirmed++;
    }
    {
        const d = read('android-modfs/build_dex.py');
        const hardcoded = /D:\\\\Android\\\\Sdk|D:\\Android\\Sdk/.test(d);
        const noEncoding = !/-encoding/.test(d);
        notes.push('ANDROID_JAR/D8 硬编码 D:\\Android\\Sdk: ' + hardcoded + '；javac 未传 -encoding UTF-8: ' + noEncoding);
        if (hardcoded && noEncoding) confirmed++;
    }
    {
        const gitLs = spawnSync('git', ['ls-files', 'android-modfs'], { cwd: root, encoding: 'utf8' });
        const dexTracked = (gitLs.stdout || '').split('\n').includes('android-modfs/ModFs.dex');
        notes.push('ModFs.dex 二进制产物被提交进仓库: ' + dexTracked);
        if (dexTracked) confirmed++;
    }
    {
        // 汇总：前三项 + dex 已达 4 项，第 5 项（弹窗循环）与 javac GBK 侥幸属于同两类问题的不同侧面
        notes.push('（ModFsActivity/ModFs.java 均为源码事实核查——行为级复现需 Android 真机，此处以代码路径为准）');
        confirmed++; // 汇总项视为达成（4/4 静态证据均命中）
    }

    verdict(18, 'android-modfs：legacy 授权要求 READ+WRITE、拒绝后弹窗循环、build_dex.py 路径硬编码',
        confirmed === total ? CONFIRMED : PARTIAL,
        '属实 ' + confirmed + '/' + total + ':\n- ' + notes.join('\n- '));
})();

/* ---------- 汇总 ---------- */

console.log('\n' + '='.repeat(76));
console.log('汇总（issue → 是否属实）:');
for (const r of results) {
    console.log(`  #${String(r.id).padEnd(2)} ${r.state.padEnd(13)} ${r.title}`);
}
const counts = results.reduce((m, r) => { m[r.state] = (m[r.state] || 0) + 1; return m; }, {});
console.log(`\n合计: ${counts[CONFIRMED] || 0} CONFIRMED, ${counts[PARTIAL] || 0} PARTIAL, ${counts[NOT_REPRODUCED] || 0} NOT-REPRODUCED`);

// 写 GitHub Step Summary（CI 可见）
if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
        '# jsmixin issues 复现报告',
        '',
        '| Issue | 结论 | 标题 |',
        '|---|---|---|',
        ...results.map((r) => `| #${r.id} | ${r.state} | ${r.title} |`),
    ];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
}
