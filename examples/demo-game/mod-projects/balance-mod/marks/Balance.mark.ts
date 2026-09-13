// BalanceMod — 玩家数值平衡：演示类目标（{class:'Player'}）+ op 级 method 参数 + 可取消注入。
//   ① @Inject cancellable：大额伤害（≥40）直接抵消（head 注入体内 return 即取消原方法）
//   ② @ModifyReturnValue：移速 +5
//   ③ @Overwrite：整体改写战报文案

@MixinClass({ target: { file: 'player.js', path: [{ class: 'Player' }] } })
class BalanceMark {
  @Inject({ at: 'head', cancellable: true, method: 'takeDamage' })
  shield(n) {
    console.log('[balance] ' + this.name + ' 受到 ' + n + ' 点伤害');
    if (n >= 40) {
      console.log('[balance] 致命伤害被护盾抵消');
      return 0;
    }
  }

  @ModifyReturnValue({ method: 'getSpeed' })
  speedBoost() {
    return $value + 5;
  }

  @Overwrite({ method: 'describe' })
  describe() {
    return '[balance] ' + this.name + ' (hp ' + this.hp + '/' + this.maxHp + ')';
  }
}
