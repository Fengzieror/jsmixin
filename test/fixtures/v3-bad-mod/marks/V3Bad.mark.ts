/*
 * V3BadMark — 负向夹具：构建必须失败
 *   ① @Local 声称不存在的局部变量
 *   ② target.method 与操作装饰器 method 同时出现（歧义防护）
 *   ③ @Share 名未被本注入体声明
 */

@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'counter2' }] } })
class BadLocalMark {
  @Inject({ at: 'tail', locals: ['nope'] })
  target() {
    console.log('x');
  }
}

@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }], cls: 'Cls', method: 'tick' } })
class ConflictMethodMark {
  @Inject({ at: 'head', method: 'dist' })
  target() {
    console.log('x');
  }
}

@MixinClass({ target: { file: 'sample-es6.js', path: [{ wrap: 'cjs' }, { name: 'counter' }] } })
class BadShareMark {
  @Inject({ at: 'head', share: ['ghost'] })
  target() {
    var other = 1;
  }
}
