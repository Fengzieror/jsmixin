/*
 * test_node_host.js — Node 宿主端到端测试（子进程隔离，require/eval/Function/vm 四通道
 * 拦截完备性 + mod 目录装载/禁用/扫描 + 磁盘零修改）。
 * 运行：node test/test_node_host.js（经 npm test 自动在 build 之后执行）
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

var HOST = path.join(__dirname, '../dist/cjs/hosts/node.js');

/*
 * 场景搭建：files = { 相对路径: 内容 }；entry 相对 tmp 根，cwd = tmp 根。
 * mod 布局：mods/mods.json（可选）+ mods/<id>/{mixins.json,patches.js}
 */
var tmpDirs = [];
process.on('exit', function () {
    // 临时目录用完即清（#17）：此前每跑一次测试泄漏一个 tmp 目录
    tmpDirs.forEach(function (t) { try { fs.rmSync(t, { recursive: true, force: true }); } catch (e) { /* ignore */ } });
});

function runScene(files) {
    var tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jsmixin-node-'));
    tmpDirs.push(tmp);
    for (var rel in files) {
        var p = path.join(tmp, rel);
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, files[rel]);
    }
    var r = spawnSync(process.execPath, [path.join(tmp, 'entry.js')], { encoding: 'utf8', cwd: tmp });
    return { stdout: r.stdout || '', stderr: r.stderr || '', status: r.status, tmp: tmp };
}

function modFiles(id, patches, modsJson) {
    var files = {};
    files['mods/' + id + '/mixins.json'] = JSON.stringify({ schemaVersion: 1, modid: id, version: '0.0.1', mixins: ['patches.js'] });
    files['mods/' + id + '/patches.js'] = patches;
    if (modsJson) files['mods/mods.json'] = modsJson;
    return files;
}

// 通用目标模块（require 通道被 patch：replaces 改 tag）
var TARGET_JS = [
    'function base(x) { return x + 1; }',
    'module.exports.base = base;',
    'module.exports.tag = "original";'
].join('\n');

var MOD_PATCH = [
    "globalThis.__mixin.register({",
    "  modid: 'test-mod', version: '0.0.1',",
    "  mixins: [{ file: 'target_module.js', replaces: [['module.exports.tag = \\\"original\\\";', 'module.exports.tag = \\\"mixin-tag\\\";']] }]",
    "});"
].join('\n');

var ENTRY_REQUIRE = [
    "require(" + JSON.stringify(HOST) + ");",
    "var t = require('./target_module.js');",
    "console.log('RESULT:' + t.tag);"
].join('\n');

/* ---------- 1. require 通道 + mods.json 装载 + replaces ---------- */
console.log('== require 通道 ==');
(function () {
    var files = modFiles('test-mod', MOD_PATCH, JSON.stringify({ mods: [{ id: 'test-mod', enabled: true }] }));
    files['target_module.js'] = TARGET_JS;
    files['entry.js'] = ENTRY_REQUIRE;
    var r = runScene(files);
    check('require: mod 装载且目标模块被变换', /RESULT:mixin-tag/.test(r.stdout), (r.stdout + r.stderr).slice(0, 300));
    check('require: 日志报告装载完成', /装载完成: 1\/1/.test(r.stdout), r.stdout.slice(0, 400));
})();

/* ---------- 2. mods.json 禁用（enabled=false）与目录扫描 ---------- */
console.log('== mod 启用管理 ==');
(function () {
    var files = modFiles('test-mod', MOD_PATCH, JSON.stringify({ mods: [{ id: 'test-mod', enabled: false }] }));
    files['target_module.js'] = TARGET_JS;
    files['entry.js'] = ENTRY_REQUIRE;
    var r = runScene(files);
    check('禁用: enabled=false 的 mod 跳过（原文运行）', /RESULT:original/.test(r.stdout), (r.stdout + r.stderr).slice(0, 300));
    check('禁用: 日志报告跳过', /已禁用/.test(r.stdout), r.stdout.slice(0, 400));

    // 去掉 mods.json → 目录扫描模式应装载同一 mod
    delete files['mods/mods.json'];
    var r2 = runScene(files);
    check('扫描: 无 mods.json 时目录扫描装载', /RESULT:mixin-tag/.test(r2.stdout), (r2.stdout + r2.stderr).slice(0, 300));
})();

/* ---------- 3. 四通道拦截完备性 ---------- */
console.log('== 拦截完备性（eval / new Function / require / vm） ==');
(function () {
    var EVAL_SRC = [
        'function base(x) { return x + 1; }',
        'globalThis.__out = base(1);',
        'globalThis.__tag = "eval-original";'
    ].join('\n');
    var EVAL_PATCH = [
        "globalThis.__mixin.register({",
        "  modid: 'eval-mod', version: '0.0.1',",
        "  mixins: [",
        "    { file: 'eval-target.js', replaces: [['\\\"eval-original\\\"', '\\\"eval-patched\\\"']] },",
        "    { file: 'req_target.js', replaces: [['\\\"eval-original\\\"', '\\\"eval-patched\\\"']] }",
        "  ]",
        "});"
    ].join('\n');
    var files = modFiles('eval-mod', EVAL_PATCH);
    files['eval-target.js'] = EVAL_SRC; // 磁盘占位（本测试不改它，通道以字符串/require 两种方式进入）
    files['req_target.js'] = EVAL_SRC;
    // eval-target 的绝对路径经环境变量传入（避免占位替换的脆弱性）
    files['entry.js'] = [
        "require(" + JSON.stringify(HOST) + ");",
        "var fs = require('fs');",
        "var src = fs.readFileSync(process.env.EVAL_TARGET, 'utf8');",
        "var code = src + '\\n//@ sourceURL=eval-target.js';",
        "// 通道1: eval（indirect，全局作用域）",
        "(0, eval)(code);",
        "console.log('EVAL:' + globalThis.__tag + ':' + globalThis.__out);",
        "// 通道2: new Function",
        "globalThis.__tag = 'not-run';",
        "new Function(code)();",
        "console.log('FUNC:' + globalThis.__tag);",
        "// 通道3: vm.runInThisContext",
        "var vm = require('vm');",
        "globalThis.__tag = 'not-run';",
        "vm.runInThisContext(code);",
        "console.log('VM:' + globalThis.__tag);",
        "// 通道4: require（同源码以磁盘模块身份进入）",
        "require('./req_target.js');",
        "console.log('REQ:' + globalThis.__tag);"
    ].join('\n');
    var r = runScene(files);
    var r2 = spawnSync(process.execPath, [path.join(r.tmp, 'entry.js')], {
        encoding: 'utf8', cwd: r.tmp,
        env: Object.assign({}, process.env, { EVAL_TARGET: path.join(r.tmp, 'eval-target.js') })
    });
    var so = r2.stdout, se = r2.stderr;
    var out = so + se;
    check('eval 通道被拦截', /EVAL:eval-patched:2/.test(so), out.slice(0, 400));
    check('new Function 通道被拦截', /FUNC:eval-patched/.test(so), out.slice(0, 400));
    check('vm.runInThisContext 通道被拦截', /VM:eval-patched/.test(so), out.slice(0, 400));
    check('require 通道被拦截', /REQ:eval-patched/.test(so), out.slice(0, 500));
})();

/* ---------- 4. 磁盘文件不被修改 ---------- */
console.log('== 磁盘零修改 ==');
(function () {
    var files = modFiles('test-mod', MOD_PATCH, JSON.stringify({ mods: [{ id: 'test-mod', enabled: true }] }));
    files['target_module.js'] = TARGET_JS;
    files['entry.js'] = ENTRY_REQUIRE;
    var r = runScene(files);
    var after = fs.readFileSync(path.join(r.tmp, 'target_module.js'), 'utf8');
    check('require 通道变换生效', /RESULT:mixin-tag/.test(r.stdout), r.stdout.slice(0, 200));
    check('目标文件磁盘字节不变', after === TARGET_JS);
})();

console.log(failures === 0 ? '\n全部通过' : '\n有 ' + failures + ' 项失败');
process.exit(failures === 0 ? 0 : 1);
