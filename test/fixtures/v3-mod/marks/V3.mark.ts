/*
 * V3Mark — v2.1 新特性夹具：
 *   ① op 级 method（一个 mark 类多目标） ② 可取消注入 ③ @ModifyReturnValue
 *   ④ @ModifyExpressionValue（call/find 双形态） ⑤ @ModifyArgs
 *   ⑥ @Export writable ⑦ @Share/@Local（构建期校验 + 词法共享）
 */

// ① op 级 method：一个 mark 类两个方法各打各的目标（对齐 Java：method 归操作注解管）
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'Cls' }] } })
class MethodArgMark {
  @Inject({ at: 'head', method: 'tick' })
  logTick() {
    console.log('[v3] tick enter');
  }
  @Wrap({ method: 'dist' })
  wrapDist($orig) {
    return $orig() + 100;
  }
}

// ② 可取消注入：head 注入体内 return 即取消原函数
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'gate' }] } })
class GateMark {
  @Inject({ at: 'head', cancellable: true })
  target(open) {
    if (open === 'force') {
      console.log('[v3] gate cancelled');
      return 'cancelled';
    }
  }
}

// ③ @ModifyReturnValue：返回值 *2
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'counter' }] } })
class CounterMark {
  @ModifyReturnValue
  target() {
    return $value * 2;
  }
}

// ④ @ModifyExpressionValue：call 形态（nth:1 = 第二处 helper 调用，结果 *10）
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'caller' }] } })
class ExprCallMark {
  @ModifyExpressionValue({ call: 'helper', nth: 1 })
  target() {
    return $value * 10;
  }
}

// ④b find 形态 + ⑤ @ModifyArgs：caller2 的两处 helper 调用分别处理（无坐标重叠）
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'caller2' }] } })
class ExprFindAndArgsMark {
  @ModifyArgs({ call: 'helper', nth: 0 })
  retargetArgs() {
    return [$args[0] + 5];
  }
  @ModifyExpressionValue({ find: 'helper(2)' })
  wrapSecond() {
    return $value + 1000;
  }
}

// ⑦ @Share/@Local：counter2 的 head 注入声明共享变量，tail 注入读取（同一词法作用域）
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'counter2' }] } })
class ShareLocalMark {
  @Inject({ at: 'head', share: ['total'] })
  declareTotal() {
    var total = 42;
  }
  @Inject({ at: 'tail', locals: ['bonus', 'total'] })
  readAll() {
    console.log('[v3] counter2 tail: bonus=' + bonus + ' total=' + total);
  }
}

// ⑥ @Export writable：导出闭包绑定 step（get/set 直达绑定本身）
@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'step' }] } })
class ExportMark {
  @Export({ as: 'stepFn', writable: true })
  target() {}
}
