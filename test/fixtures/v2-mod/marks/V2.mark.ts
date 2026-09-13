/*
 * V2Mark — v2 调用点级装饰器夹具（@Redirect / @WrapOperation / @ModifyArg）。
 * 三个方法各打不同函数，避免同文件调用点编辑重叠。
 */

@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'calc' }] } })
class RedirectMark {
  @Redirect({ call: 'helper' })
  redirectHelper() {
    return $args[0] * 10;
  }
}

@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'calc2' }] } })
class WrapMark {
  @WrapOperation({ call: 'helper' })
  wrapHelper() {
    return $orig($args[0] + 1);
  }
}

@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'calc3' }] } })
class ModifyArgMark {
  @ModifyArg({ call: 'helper', arg: 0 })
  modifyArgHelper() {
    return $arg + 100;
  }
}
