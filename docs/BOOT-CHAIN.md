# jsmixin 加载链路（BOOT-CHAIN）

> 本文回答四个问题：JS 代码是怎么进入运行时的、mixin 拦截哪些入口、变换后的代码怎么被执行、
> 换一个宿主要做什么。这是 v2 通用化改造的认知基座。

---

## 一、eval 是什么，代码怎么"进入"运行时

`eval` 是 **ECMAScript 语言规范内置函数**（与 `Math`、`JSON` 同级）：把一个字符串当作 JS
代码，立刻编译并执行。`window.eval` 只是"浏览器把 eval 挂在 window 对象上"的写法；
Node 里没有 window，但 `globalThis.eval` 存在；LayaNative 模拟浏览器环境所以也有 window。
**所有 JS 引擎（V8 / JavaScriptCore / SpiderMonkey）都有它。**

更深一层：V8 本身只是个 C++ 库，唯一的工作是"接收一段字符串 → 编译 → 执行"。
所有"JS 代码怎么进去"的问题，本质上都是"谁把字符串喂给了这个接口"：

```
代码文本从哪来？          谁搬运？              最终都到这：
─────────────────────────────────────────────────────────
HTML <script src>        浏览器下载    ─┐
磁盘文件                  Node fs       ─┼──→  一段字符串 ──→ V8 编译器 ──→ 执行
apk assets               引擎 C++       ─┤         ↑
网络 DCC                 apploader.js   ─┘    这里就是
                         ↓                    所有拦截点的位置
                    window.eval(text) ────────┘
```

常见的"喂"的方式：

| # | 方式 | 例子 |
|---|---|---|
| 1 | `<script>` 标签 | 浏览器下载后直接喂引擎 |
| 2 | `eval(str)` | **当前游戏走这条路**：apploader.js 逐个 `window.eval(游戏脚本)` |
| 3 | `new Function(body)` | 字符串变函数，很多加载器/沙箱用它 |
| 4 | Node `require()` | 宿主读磁盘 → 包装 → 编译 |
| 5 | 嵌入式宿主 C++ 直喂 | LayaNative：`__JSRun::Run(scriptText, filename)` |
| 6 | 动态 import / Worker / wasm | 换了 URL 形态，本质还是"文本→编译" |

## 二、mixin 能拦哪些（判定法则 + 硬清单）

**核心法则：mixin 能影响一切在它激活之后进入运行时的代码**，前提是满足二者之一：

- **A. 代码经过某个 JS 可见的函数**（我们包装它）；
- **B. 代码由我们自己加载**（fetch/读到源码 → 变换 → 再喂给引擎）。

### 必拦清单（语言层，任何引擎都存在）

| 函数 | 说明 |
|---|---|
| `eval`（globalThis.eval） | 直接/间接 eval（`(0,eval)(...)` 调用时才解析全局 eval，包装后同样走我们） |
| `Function` 构造器 | `new Function('body')`，语言规范里另一种"字符串→编译"入口 |

只要**先于一切目标代码**装好这两个包装，任何"JS 代码执行 JS 字符串"的行为都必然经过
我们——这两者是语言规范里仅有的两个"字符串→编译"语言入口。宿主层再按需加官方 hook：

| 宿主 | 加拦什么 | 方式 |
|---|---|---|
| Node | `require` / `import()` | 官方 require hook（`Module._extensions`）/ loader hooks |
| Node（加固） | `vm.Script` / `runInThisContext` 等 | 包装 vm 模块导出 |
| LayaNative | 引擎 C++ 直喂的脚本 | C++ `__JSRun::Run` 编译前回调（v1 已做） |
| 浏览器（暂缓） | `<script>` 标签 | **纯 JS 无解**，只能 loader 方案（fetch+eval 自己喂） |

### 唯一真正会"炸"的场景：抢跑

有人**抢在我们之前**把原始函数引用存走了（`const rawEval = window.eval`）→ 绕过包装。
防御就是铁律：**mixin 必须第一个加载**。我们先包装，之后所有代码拿到的都是包装后的引用。
C++ 编译前回调是终极保险——它是引擎原生层的漏斗，任何 JS 层花招都不可能绕过它。

### 判定流程（接新宿主时）

1. 枚举该宿主的"字符串→编译"漏斗有哪些；
2. JS 层的（eval/Function/宿主官方 hook）包装掉；原生层的（有源码时）在漏斗点加回调；
3. **验证**：让 mixin 对每个漏斗打 log，跑一遍程序，确认没有源码没被摸到
   （node 宿主可用 `test/test_node_host.js` 的四通道场景做模板）。

## 三、LayaNative 宿主的加载时间线（现状）

```
T0  C++ onThInit（游戏任何逻辑之前）：
      runtimeInit.js
      → mixin bundle（acorn + mixinAst + mixinTransformer：引擎就绪，window.__mixin 可用）
      → patch_bundle.js（注册 APK 内置 base-test mod，priority=0）
      → loader.js（同步读 /sdcard/.battlecraft/mods.json → 逐 mod eval patches.js → register）
T1  apploader.js 开始跑，逐个 eval 游戏脚本（base64/vendor/wx/main.min.js）
      → 每个脚本触发一次 __mixinTransform；main.min.js 的变换就发生在这里
T2  游戏起来：main.min.js 模块尾注入的 __mixinBoot 执行
      → 显示 boot 标签 → 执行 loader 队列里各 mod 的 entry(mod.js)；另有 10 秒 setTimeout 兜底
```

**注册窗口 = T0～T1**。所有 patch 必须在 T1 之前注册完——main.min.js 只在 T1 被变换一次，
之后注册的 mod 本会话无效（`windowClosed()` 打警告，下次启动重试）。

### 两个拦截点的关系：互补覆盖，同一份代码只被变换一次

| 脚本 | 谁执行它 | 走哪条路 | 被谁拦截 |
|---|---|---|---|
| runtimeInit / apploader / patch_bundle | C++ 引擎（JSP_RUN_SCRIPT 固定清单） | `__JSRun::Run` → V8 Script::Compile | C++ 拦截点（JSCProxyTLS.h:53） |
| 游戏脚本 base64/vendor/wx/main.min.js | apploader.js（它自己是 JS）用 `window.eval` | V8 内部 eval，**不回 C++** | eval 钩子（纯 JS） |

C++ 拦不到 V8 内部 eval；游戏脚本也从不会走引擎 Script::Compile 路径。两者集合不相交，
**不存在双重变换**。

C++ 改动点（我们自己造的接口，原版引擎没有任何 mod 接口）：
- `JCScriptRuntime.cpp:298-334`：onThInit 固定清单里追加执行 mixin bundle，并把全局
  `__mixinTransform` 存进 `__JSRun::mixinTransformer()`；
- `JSCProxyTLS.h:53-55`：`__JSRun::Run` 编译前调用 transformer，返回值替换源码。

## 四、变换后代码的执行路径（全程字符串级）

```
原源码字符串 → acorn 解析出 AST（只用来"找位置+算编辑"，用完即扔）
            → 对节点产出 {start,end,text} 编辑 → 拼接回一个【新源码字符串】
            → 交给原执行路径（origEval / V8 Script::Compile）
            → V8 对新字符串做一次全新的 parse+compile
```

- 不存在"把 AST 交给 V8 执行"这回事；V8 从头到尾只见源码字符串。
- 注入代码能访问闭包内部符号，是因为它**文本上就在 IIFE 里**，V8 编译时天然同作用域。
- fail-safe：解析/定位/校验任何一步失败都返回原字符串，V8 编译原版，程序照常跑。
- **硬盘上的文件永不修改**：一切变换在内存完成。

## 五、换宿主要做的三件事

1. **加载时机**：让 mixin（引擎+加载器）在所有目标代码之前执行
   （Node：入口第一行 `require('jsmixin/node')` 或 `node --require`；
   自研引擎：启动清单塞一项；浏览器（暂缓）：第一个 `<script>`）。
2. **拦截点**：按 §二 的清单包装 eval/Function + 宿主官方 hook；改不了的（script 标签）
   用 loader 方案。
3. **mod 注册**：在任何 transform 发生前完成 mod 装载（mods.json 或目录扫描）。

其余一切（路径定位、op、fail-safe、优先级排序）都是 core 的活，与宿主无关。

### 接入光谱（干预程度递增）

| 档位 | 作者拿到什么 | 需要什么前提 |
|---|---|---|
| 纯库 | npm 包（`createMixinEngine`） | 自己有加载管线（打包插件/台架） |
| 一行引入 | `require('jsmixin/node')` | Node 或可控页面 |
| JS 级魔改 | bundle 文件 + 接入文档 | 能重打包资源（改 runtimeInit.js，不换 so） |
| 引擎级魔改 | C++ 补丁模板 + so 产物 | 引擎源码（LayaNative 已完成） |

所有档位共享同一个 core 和同一份 mod 格式——**mod 写一次，各档位都能跑**。
