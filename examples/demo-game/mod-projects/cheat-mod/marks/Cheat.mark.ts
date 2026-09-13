// CheatMod — 动作最大的 mod：调用点级全套 op + Share/Local + 可写导出。
//   ① @Redirect：掷骰调用整体替换（恒 20）
//   ② @ModifyArg：改单个实参（等级 ×3 进加成）
//   ③ @WrapOperation：包装 computeDamage 调用（$orig 转发、this 保留）
//   ④ @ModifyArgs：改写成员调用 player.takeDamage 的实参数组
//   ⑤ @Share/@Local：同一函数内两次注入共享词法变量（构建期校验）
//   ⑥ @ModifyExpressionValue：表达式级改值（商店折价）
//   ⑦ @Export writable：把 IIFE 闭包里的 buy 开给其他 mod / entry

@MixinClass({ target: { file: 'combat.js', path: [{ name: 'computeDamage' }] } })
class CheatComputeMark {
  @Redirect({ call: 'rollDice' })
  fixedDice() {
    return 20;
  }

  @ModifyArg({ call: 'bonusOf', arg: 0 })
  tripleLevel() {
    return $arg * 3;
  }
}

@MixinClass({ target: { file: 'combat.js', path: [{ name: 'combatTurn' }] } })
class CheatTurnMark {
  @WrapOperation({ call: 'computeDamage' })
  spyDamage($orig) {
    var v = $orig();
    console.log('[cheat] 原始伤害=' + v);
    return v;
  }

  @ModifyArgs({ call: 'player.takeDamage' })
  soften() {
    return [Math.max(0, $args[0] - 3)];
  }

  @Inject({ at: 'head', share: ['turnNo'] })
  declareTurn() {
    var turnNo = 1;
  }

  @Inject({ at: 'tail', locals: ['dmg', 'turnNo'] })
  logTurn() {
    console.log('[cheat] 回合' + turnNo + '结束, 本回合伤害=' + dmg);
  }
}

@MixinClass({ target: { file: 'shop.js', path: [{ wrap: 'cjs' }, { name: 'buy' }] } })
class CheatShopMark {
  @ModifyExpressionValue({ call: 'applyDiscount' })
  halfPrice() {
    return $value * 0.5;
  }

  @Export({ as: 'buyFn', writable: true })
  target() {}
}
