/* 由 jsmixin build-tool 生成，勿手改。源: Cheat.mark.ts */
(typeof window !== 'undefined' ? window : globalThis).__mixin.register({
  "modid": "cheat-mod",
  "version": "1.0.0",
  "mixins": [
    {
      "file": "combat.js",
      "patches": [
        {
          "name": "CheatComputeMark.fixedDice",
          "path": [
            {
              "name": "computeDamage"
            }
          ],
          "op": "redirect",
          "code": "return 20;",
          "call": "rollDice"
        },
        {
          "name": "CheatComputeMark.tripleLevel",
          "path": [
            {
              "name": "computeDamage"
            }
          ],
          "op": "modifyArg",
          "code": "return $arg * 3;",
          "call": "bonusOf",
          "arg": 0
        },
        {
          "name": "CheatTurnMark.spyDamage",
          "path": [
            {
              "name": "combatTurn"
            }
          ],
          "op": "wrapCall",
          "code": "var v = $orig();\n    console.log('[cheat] 原始伤害=' + v);\n    return v;",
          "call": "computeDamage"
        },
        {
          "name": "CheatTurnMark.soften",
          "path": [
            {
              "name": "combatTurn"
            }
          ],
          "op": "modifyArgs",
          "code": "return [Math.max(0, $args[0] - 3)];",
          "call": "player.takeDamage"
        },
        {
          "name": "CheatTurnMark.declareTurn",
          "path": [
            {
              "name": "combatTurn"
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "var turnNo = 1;"
        },
        {
          "name": "CheatTurnMark.logTurn",
          "path": [
            {
              "name": "combatTurn"
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "console.log('[cheat] 回合' + turnNo + '结束, 本回合伤害=' + dmg);"
        }
      ]
    },
    {
      "file": "shop.js",
      "patches": [
        {
          "name": "CheatShopMark.halfPrice",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "buy"
            }
          ],
          "op": "wrapValue",
          "code": "return $value * 0.5;",
          "call": "applyDiscount"
        },
        {
          "name": "CheatShopMark.target$export",
          "path": [
            {
              "wrap": "cjs"
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "\n(typeof window !== 'undefined' ? window : globalThis).__mixin_exports = (typeof window !== 'undefined' ? window : globalThis).__mixin_exports || {};\nObject.defineProperty((typeof window !== 'undefined' ? window : globalThis).__mixin_exports, \"buyFn\", { get: function () { return buy; }, set: function (v) { buy = v; }, enumerable: !0, configurable: !0 });"
        }
      ]
    }
  ],
  "name": "CheatMod",
  "priority": 100
});
