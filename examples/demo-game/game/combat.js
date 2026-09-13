'use strict';

// ── 宿主"游戏"代码：普通函数群（调用点级 op 的目标）─────────────────
// 骰子固定为 6，保证演示输出可复现、verify.js 可精确断言。

function rollDice() {
    return 6;
}

function bonusOf(level) {
    return level * 2;
}

function computeDamage(level) {
    return rollDice() + bonusOf(level);
}

function combatTurn(player, level) {
    var dmg = computeDamage(level);
    player.takeDamage(dmg);
    return dmg;
}

module.exports = {
    rollDice: rollDice,
    bonusOf: bonusOf,
    computeDamage: computeDamage,
    combatTurn: combatTurn
};
