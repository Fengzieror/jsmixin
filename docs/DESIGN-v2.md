# jsmixin v2 设计（通用化改造）

> v1 的定位设计见 DESIGN-target.md（路径段/寻址/与 Sponge 的对照），文件布局见 DESIGN-layout.md。
> 本文只记录 v2 相对 v1 的变化与新增契约。加载链路与拦截原理见 docs/BOOT-CHAIN.md。

---

## 一、架构：通用 core + 宿主适配器

```
src/
  core/            # TypeScript，零宿主依赖
    engine.ts      # createMixinEngine({ acorn?, log? }) → { register, transformFile, reset, sourceHash, stats }
    ast.ts         # resolvePath / applyOp / applyAstPatches（v1 mixinAst.js 的 TS 移植 + v2 扩展）
    features.ts    # directChildFns / walkAll / 锚点特征（v1 忠实移植 + MethodDefinition 绑定）
    segs/          # 路径段解析器（module/name/call/fnIndex/anchor/method/klass/wrap + pick）
    types.ts       # ModDescription / Patch / PathSeg / SourceEdit 等公共类型
  loader/loader.ts # 泛化 mod 装载器（从 LayaNative loader.js 提炼，宿主只提供 readFile/execute 抽象）
  hosts/
    layanative.ts  # v1 全局契约安装器（window.__mixin / __mixinTransform / eval 钩子）
    node.ts        # require('jsmixin/node') 即启用：eval/Function/vm/require 四钩子 + mod 装载
    cli.ts         # jsmixin run <entry> CLI
  compat/          # runtime/*.js 兼容产物的生成源（esbuild IIFE bundle）
build-tool/        # marks(TS 装饰器) → patches.js 构建工具（v1 保持 + v2 新装饰器）
runtime/           # 【构建产物】mixinAst.js / mixinTransformer.js —— tools/build_mixin_apk.py
                   #   的固定拼接输入 + 全部既有测试的 require 目标，路径与全局契约不容改动
```

产物形态：npm 包双格式（`dist/cjs` require + `dist/esm` import），engines node>=18。
构建：`npm run build`（tsc ×2 + esbuild compat bundle）。

## 二、兼容红线（v1 → v2 不变的部分）

- 全局契约：`__mixin.register/stats/sourceHash/version`、`__mixinTransform`、
  `__mixinAst.applyAstPatches/_internals`（_internals 追加 findCallSites，向后兼容）。
- v1 全部路径段、op、错误信息、批量快路径、串行 Sponge 语义、哈希锁、重叠拒绝——逐行移植。
- `runtime/*.js` 路径、`tools/build_mixin_apk.py` 组装线、C++ 调用点：零改动。
- 回归：test/test_mixin_ast.js + test/test_build_tool.js 全绿。

## 三、v2 新增路径段

### {class:'Name'} — 原生 ES6 class

匹配（当前节点的直接子层，不深入函数/类内部）：
- `class Name {...}`（ClassDeclaration）
- `var Name = class {...}` / `Name = class {...}`（ClassExpression 绑定）
- 命名空间对象属性 `var V = { Name: class {...} }`

class 节点上的 `{method:'m'}` 解析 ClassBody 的 MethodDefinition：
实例方法 / `static` / `get` / `set` / `constructor`；static 与实例同名 → 2 候选需 index。
`{name:'m'}` 也直达 MethodDefinition（directChildFns 的 v2 绑定规则）。

### {wrap:'cjs'|'umd'|'iife'} — 打包器解包段

与 {module} 平级的入口段，进入"包装/工厂函数体"：
- `'iife'`：顶层 IIFE —— `(function(){})(…)`、`(()=>{})()`、`!function(){}()`、`var X=(function(){})()`
- `'cjs'`：`module.exports = (function(){…})()` 工厂
- `'umd'`：`(function(global,factory){…})(this, function(){…})` → 取 factory 实参函数

多个候选 → 未写 index 拒绝。ESM/CJS 顶层目标直接用现有 `{name}`/`{anchor}`；
`applyAstPatches` 对 import/export 源码自动按 `sourceType:'module'` 重试解析。

## 四、v2 新增 op（调用点级，对齐 @Redirect / @WrapOperation / @ModifyArg）

在 `path` 定位到的目标函数子树内，按 `patch.call`（callee 点分名，支持 `this.x`）
定位调用点；`params` 可选过滤实参个数；`nth`/`all` 消歧（多命中必须消歧，0 命中报错）。

| op | code 形式 | 语义 | 作用域 |
|---|---|---|---|
| `redirect` | 表达式或语句体 | 整体替换该调用 | `$args`（原实参数组）、`$this` 不可用 |
| `wrapCall` | 函数体（可 return） | 包装该调用 | `$orig(...)`（无参转发原实参/显式改参）、`$args`；成员调用保留原 this |
| `modifyArg` | 表达式或语句体 | 包装第 `arg` 槽位实参，调用本身保留 | `$arg`（原实参值） |

生成形态（编辑基于原始 source 切片，重叠拒绝纪律照旧）：

```js
// redirect:  f(a,b)  →  (function ($args) { CODE })([a, b])
// wrapCall:  obj.m(a) →  (function ($args) { var $orig = function(){ return (obj.m).apply(obj, arguments.length ? arguments : $args); }; CODE })([a])
// modifyArg: f(a)     →  f((function ($arg) { CODE })(a))
```

## 五、build-tool 新增装饰器

```ts
@MixinClass({ target: { file: 'sample.js', path: [{ wrap: 'cjs' }, { name: 'calc' }] } })
class MyMark {
  @Redirect({ call: 'helper' })              // { call, params?, nth?, all? }
  redirectHelper() { return $args[0] * 10; } // 方法体 = code（语句体形式）

  @WrapOperation({ call: 'obj.m' })
  wrapM() { return $orig($args[0] + 1); }

  @ModifyArg({ call: 'helper', arg: 0 })     // arg 槽位必填
  modArg() { return $arg + 100; }
}
```

构建期新增预检：调用点 0 个 / 多个未消歧 → 构建失败（运行期才暴露的问题提前到构建期）。

## 六、注入体语法（ES5/ES6 混用放开）

- v1 的"注入体一律 ES5"约束**取消**：注入体语法随宿主引擎能力（acorn 以
  `ecmaVersion:'latest'` 校验），引擎不做降级与 polyfill。
- 注入体在目标闭包内执行 → 可直接引用闭包内符号（与 v1 相同，这是文本级注入的天然能力）。
- build-tool 的 marks 方法体文本原样保留（TS 源码解析不影响注入体文本）。

## 七、mod 目录约定（泛化 loader）

```
<root>/mods.json            # 激活列表：["id-a"] 或 {"mods":[{id,enabled}]}；缺省时宿主可目录扫描
<root>/<id>/mixins.json     # {modid, version, mixins:["patches.js"], entry?}
<root>/<id>/patches.js      # register 产物（调用 __mixin.register(...)）
<root>/<id>/<entry>         # 可选：应用启动后执行的附加式代码
```

LayaNative 内置 loader.js（`/sdcard/.battlecraft/mods/<id>/` 布局）逻辑同构，继续作为
APK 内置实现；泛化版供 Node/未来宿主使用。**mod 写一次，跨宿主通用**（patches.js 都调
全局 `__mixin.register`）。

## 八、Sponge Mixin / MixinExtras 对照（v2.1 现状）

| Java 注解 | jsmixin v2.1 | 状态 |
|---|---|---|
| @Mixin | @MixinClass | v1 |
| @Inject(HEAD/TAIL) | @Inject({at}) | v1 |
| @Inject(cancellable) | @Inject({at:'head', cancellable:true})——head 注入体内 `return` 即取消原函数/替换返回值 | **v2.1** |
| @Overwrite | @Overwrite / op overwrite | v1 |
| @Redirect | @Redirect / op redirect | **v2** |
| @ModifyArg | @ModifyArg / op modifyArg | **v2** |
| @ModifyArgs | @ModifyArgs / op modifyArgs（$args 返回新实参数组） | **v2.1** |
| @ModifyVariable / @ModifyConstant | op modify（文本级）近似 | 部分 |
| @WrapOperation（MixinExtras） | @WrapOperation / op wrapCall | **v2** |
| @WrapMethod（MixinExtras） | @Wrap / op wrap | v1 |
| @ModifyExpressionValue | @ModifyExpressionValue / op wrapValue（call 或 find 定位，调用照常执行、结果经 $value 包装） | **v2.1** |
| @ModifyReturnValue | @ModifyReturnValue / op modifyReturn（$value = 已求值返回值） | **v2.1** |
| @Accessor / @Invoker | @Export（只读导出）；`@Export({as, writable:true})` 读写直达闭包绑定 | **v2.1** 强化 |
| @Share / @Local | `share: ['x']` / `locals: ['y']` 构建期校验 + 词法作用域天然共享（同函数内各注入点同一作用域，var 直接可见） | **v2.1**（构建期校验） |
| refmap（构建期名字映射） | name-map.json + 构建期预检（内嵌 patches.js） | v1 |
| priority | mixins.json priority | v1 |
| 方法归操作注解（@Inject method=...） | op 级 `method` 参数：一个 mark 类多方法各打各的目标；`target.method` 为全类共享目标的糖（与 op 级同用 → 构建报错） | **v2.1** |

## 八点一、通用 boot bundle（dist/boot/mixin-boot.js）

面向"裸 JS 引导环境"（无模块系统）的单文件产物：**内联 acorn + core + 全局适配器**。
引擎作者只需保证它最先执行，然后可选地：

```js
__mixinSetModSource({ readFile: (path) => text });  // 注入存储读取能力（缺省无 mod 可读）
__mixinLoadMods(root);                              // 装载 <root>/mods.json（或目录扫描）
__mixinRunEntries();                                // 游戏/应用启动后执行 entry 队列
__mixinWindowClosed();                              // 目标代码开始装载时通知注册窗口关闭
```

不含任何 LayaNative 存储假设；LayaNative 侧继续用 `runtime/*.js` + 内置 loader.js。

## 九、拦截完备性（node 宿主验收口径）

eval / new Function / vm.runInThisContext / require 四通道 + 磁盘零修改 +
mod 增删重启即生效 —— `test/test_node_host.js` 端到端覆盖。
