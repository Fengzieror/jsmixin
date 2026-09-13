'use strict';

// ── 宿主入口：mixin 接入只有这一行 ──────────────────────────────────
// 引入即生效：eval/Function/vm/require 四通道全部被接管，
// mods 目录（./mods）里的 mod 自动装载，随后 require 的模块都过 mixin 管线。
// 注意：main.js 自身在这行执行前已编译完，不会被 patch；
// 若连入口也要可 patch，用 `jsmixin run game/main.js`（激活先于加载）。
require('jsmixin/node');

var Player = require('./player.js').Player;
var combat = require('./combat.js');
var UI = require('./ui.js');
var shop = require('./shop.js');

var hero = new Player('Hero', 100, 10);

console.log('[game] 出战: ' + hero.describe() + ' speed=' + hero.getSpeed());

var d1 = combat.combatTurn(hero, 3);
console.log('[game] 第1回合受到 ' + d1 + ' 伤害, 剩余 hp=' + hero.hp);

var d2 = combat.combatTurn(hero, 1);
console.log('[game] 第2回合受到 ' + d2 + ' 伤害, 剩余 hp=' + hero.hp);

hero.heal(5);
console.log('[game] 治疗5后 hp=' + hero.hp);

console.log('[game] toast: ' + UI.Toast.show('welcome'));
console.log('[game] UI.version=' + UI.version);

console.log('[game] 商店: ' + shop.buy('potion', 20));
console.log('[game] 余钱: ' + shop.goldLeft());

console.log('[game] 结束状态: ' + hero.describe());
