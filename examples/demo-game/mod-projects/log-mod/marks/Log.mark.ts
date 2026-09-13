// LogMod — 附加观察层：最小的一个 mod，演示
//   ① 点分命名空间寻址（UI.Toast.show）
//   ② @Inject head 观察入参
//   ③ @Modify 精确文本替换（改返回值拼接的表达式）
//   ④ entry（mixins.json 里声明 entry.js，游戏启动后执行附加式代码）

@MixinClass({ target: { file: 'ui.js', path: [{ name: 'UI.Toast.show' }] } })
class LogMark {
  @Inject({ at: 'head' })
  spy(msg) {
    console.log('[log] Toast.show: ' + msg);
  }

  @Modify({ find: "'[UI] ' + msg", replace: "'[UI✦] ' + msg" })
  rebrand() {}
}
