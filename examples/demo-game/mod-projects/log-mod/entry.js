// LogMod 附加式代码：mixin 清单里 entry: "entry.js" 声明。
// 游戏启动完成后由装载器执行（Node 宿主是下一轮事件循环），
// 与 patch 的区别：不改任何目标文件，纯粹"游戏起来之后跑一段我自己的代码"。
// 通过 indirect eval 执行，处于全局作用域——没有 require，只用全局。

console.log('[log-mod] entry: 游戏启动完成');

var G = (typeof window !== 'undefined' ? window : globalThis);
var exps = G.__mixin_exports || {};
console.log('[log-mod] entry: 可用导出 → ' + Object.keys(exps).join(', '));

if (exps.buyFn) {
    // cheat-mod 用 @Export({writable:true}) 把 IIFE 闭包里的 buy 开了出来，
    // 这里跨 mod 调用它（走的是被 patch 过的 buy，折价同样生效）
    console.log('[log-mod] entry: 通过导出的 buyFn 再买一件 → ' + exps.buyFn('elixir', 40));
}
