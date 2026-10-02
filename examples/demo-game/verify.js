'use strict';

// ── demo 自检：跑一遍游戏，断言 3 个 mod 的全部效果 + 磁盘零改动 ────
// 用法：node verify.js（或 npm run verify）。退出码 0 = 全部通过。

var spawnSync = require('child_process').spawnSync;
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var here = __dirname;
var gameFiles = ['game/player.js', 'game/combat.js', 'game/ui.js', 'game/shop.js', 'game/main.js'];

function md5(p) {
    return crypto.createHash('md5').update(fs.readFileSync(path.join(here, p))).digest('hex');
}

var before = {};
gameFiles.forEach(function (f) { before[f] = md5(f); });

var r = spawnSync(process.execPath, ['game/main.js'], { cwd: here, encoding: 'utf8' });
// 游戏进程崩溃时必须立刻报出来并展示 stderr，否则断言全挂在莫名的输出缺失上（#17）
if (r.error) { console.error('verify: 启动游戏进程失败: ' + r.error.message); process.exit(1); }
if (r.status !== 0) {
    console.error('verify: 游戏进程异常退出（status=' + r.status + '）');
    if (r.stderr) console.error('--- stderr ---\n' + r.stderr);
    process.exit(r.status == null ? 1 : r.status);
}
var out = r.stdout || '';

var failed = 0;
function check(name, cond, detail) {
    var ok = !!cond;
    if (!ok) failed++;
    console.log((ok ? '  PASS ' : '  FAIL ') + name + (ok || !detail ? '' : '\n         实际: ' + detail));
}

// 每一行都是"宿主原代码 + 某个 mod 的注入"共同作用的结果（数值推演见 README）
[
    // balance-mod：@Overwrite describe / @ModifyReturnValue getSpeed(+5)
    '[game] 出战: [balance] Hero (hp 100/100) speed=15',
    // cheat-mod：@WrapOperation computeDamage（观察原始伤害）
    '[cheat] 原始伤害=38',            // redirect 骰子 20 + modifyArg 加成 3*6=18
    '[cheat] 原始伤害=26',            // 20 + 6
    // balance-mod：@Inject cancellable（35/23 < 40 → 不取消，走原逻辑）
    '[balance] Hero 受到 35 点伤害',
    '[balance] Hero 受到 23 点伤害',
    // cheat-mod：@ModifyArgs soften(-3) 生效 → 35/23 进 takeDamage；@Share/@Local tail 日志
    '[cheat] 回合1结束, 本回合伤害=38',
    '[cheat] 回合1结束, 本回合伤害=26',
    '[game] 第1回合受到 38 伤害, 剩余 hp=65',
    '[game] 第2回合受到 26 伤害, 剩余 hp=42',
    '[game] 治疗5后 hp=47',
    // log-mod：@Inject head 观察 + @Modify 文案替换
    '[log] Toast.show: welcome',
    '[game] toast: [UI✦] welcome',
    '[game] UI.version=2.1.90',
    // cheat-mod：@ModifyExpressionValue 折价（20 → 10）
    '[game] 商店: bought potion for 10, gold=90',
    '[game] 余钱: 90',
    '[game] 结束状态: [balance] Hero (hp 47/100)',
    // log-mod entry：附加式代码，跨 mod 使用 cheat-mod 的可写导出
    '[log-mod] entry: 游戏启动完成',
    '[log-mod] entry: 可用导出 → buyFn',
    '[log-mod] entry: 通过导出的 buyFn 再买一件 → bought elixir for 20, gold=70'
].forEach(function (line) {
    check('输出行: ' + line, out.indexOf(line) >= 0);
});

// 磁盘零改动：mod 生效前后宿主文件逐字节一致
gameFiles.forEach(function (f) {
    check('磁盘零改动: ' + f, before[f] === md5(f));
});

console.log(failed ? '\n' + failed + ' 项未通过' : '\n全部通过（3 个 mod / 19 项断言 / 磁盘零改动）');
process.exit(failed ? 1 : 0);
