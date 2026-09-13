/* 由 jsmixin build-tool 生成，勿手改。源: Balance.mark.ts */
(typeof window !== 'undefined' ? window : globalThis).__mixin.register({
  "modid": "balance-mod",
  "version": "1.0.0",
  "mixins": [
    {
      "file": "player.js",
      "patches": [
        {
          "name": "BalanceMark.shield",
          "path": [
            {
              "class": "Player"
            },
            {
              "method": "takeDamage"
            }
          ],
          "op": "inject",
          "at": "head",
          "cancellable": true,
          "code": "console.log('[balance] ' + this.name + ' 受到 ' + n + ' 点伤害');\n    if (n >= 40) {\n      console.log('[balance] 致命伤害被护盾抵消');\n      return 0;\n    }"
        },
        {
          "name": "BalanceMark.speedBoost",
          "path": [
            {
              "class": "Player"
            },
            {
              "method": "getSpeed"
            }
          ],
          "op": "modifyReturn",
          "code": "return $value + 5;"
        },
        {
          "name": "BalanceMark.describe",
          "path": [
            {
              "class": "Player"
            },
            {
              "method": "describe"
            }
          ],
          "op": "overwrite",
          "code": "return '[balance] ' + this.name + ' (hp ' + this.hp + '/' + this.maxHp + ')';"
        }
      ]
    }
  ],
  "name": "BalanceMod",
  "priority": 50
});
