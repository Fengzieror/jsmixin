# jsmixin

**[English](#english) | [中文](#中文)**

A SpongePowered-Mixin-style source transform for JavaScript: inject, overwrite, wrap,
redirect and export code at AST precision **before** the target JS is compiled.
Runtime-agnostic core, LayaNative and Node adapters. Target files on disk are never
modified — everything happens in memory, and mods are standalone folders loaded at startup.

<a name="english"></a>

## English

### Install

> Not published to npm yet (planned). Use from a git clone / local path:
> `npm install file:../jsmixin` or `npm link`.

### Quick start — Node ("one-line integration")

```js
// entry.js — first line of your program, before everything else
require('jsmixin/node');
// ... the rest of your app loads untouched; every required module passes
// through the mixin pipeline, and mods are loaded from ./mods/
```

Mods live in a plain folder (nothing gets packed into your app):

```
mods/
  mods.json                     # optional: ["my-mod"] or {"mods":[{id,enabled}]}
  my-mod/
    mixins.json                 # {"modid":"my-mod","version":"1.0.0","mixins":["patches.js"]}
    patches.js                  # globalThis.__mixin.register({ ... })
```

Delete a folder, restart, done — no repackaging, zero bytes changed on disk.

### Quick start — library usage (you own the loading pipeline)

```js
import { createMixinEngine } from 'jsmixin';
const engine = createMixinEngine({ acorn });
engine.register({
  modid: 'demo',
  mixins: [{
    file: 'game.js',
    patches: [{
      name: 'Demo.tick',
      path: [{ module: '7' }, { name: 'App' }, { method: 'tick' }],
      op: 'inject', at: 'head',
      code: 'console.log("tick!");'
    }]
  }]
});
const out = engine.transformFile('game.js', source); // transform before compiling
```

### What targets can be mixed into?

Anything that enters the runtime after mixin is active: scripts via `eval`,
`new Function`, Node `require`, `vm`, bundled IIFE/CJS/UMD factories, native ES6
classes and ESM modules. The only thing a plain JS module cannot intercept is the
browser `<script src>` tag (browser support is deferred; a loader-based approach is planned).

Path segments: `{module}` (webpack) · `{name}` (bindings, dotted namespaces) ·
`{class}` (native ES6 classes) · `{method}` (babel method tables & class methods) ·
`{anchor}` (string/call signatures) · `{call,arg}` (anonymous callbacks) ·
`{wrap}` (CJS/UMD/IIFE unwrapping) · `{fn}` (structural, last resort).

Ops: `inject` (head/tail) · `overwrite` · `wrap` ($orig) · `redirect` · `wrapCall` ·
`modifyArg` · `modify` · `log` — all with fail-safe semantics (a failed patch is
skipped, the program runs unchanged).

### Documentation

- [docs/BOOT-CHAIN.md](docs/BOOT-CHAIN.md) — how JS enters a runtime, what mixin
  intercepts and why (the interception checklist), the LayaNative boot timeline.
- [docs/DESIGN-v2.md](docs/DESIGN-v2.md) — full segments/ops reference and the
  Sponge Mixin / MixinExtras mapping.
- [docs/DESIGN-v1-layanative.md](docs/DESIGN-v1-layanative.md) — v1 design archive (Chinese).

### Testing

```
npm install
npm test          # builds (tsc CJS+ESM, esbuild compat bundles) and runs 4 suites
```

---

<a name="中文"></a>

## 中文

SpongePowered Mixin 风格的 JS 源码变换系统：在目标 JS **编译之前**，以 AST 精度注入、
覆写、包装、重定向、导出代码。核心与运行时无关，提供 LayaNative 与 Node 适配器。
**硬盘上的目标文件永不修改**——一切变换在内存完成，mod 是启动时装载的独立目录。

### 设计原则（v2）

1. **mod 是独立交付物**：走 mixin 自己的加载通道（mixins.json + patches.js），永不进宿主
   本体分发物；mod 增删改零重打包，重启即生效。
2. **接入一次性、最小化**：mixin（引擎+加载器）先于一切目标代码加载即可。宿主不需要
   预留接口、不需要把 eval 换成 mixin.eval、业务代码零改写。
3. **硬盘 JS 永不修改**：目标代码用原本的传入方式运行，mixin 在"字符串进编译器之前"透明拦截。
4. **接口开放靠变换实现**：export/wrap/inject 把闭包内符号暴露出来就是 mod 的 API；
   原作预留接口是加分项，不是前提。

### LayaNative 宿主（v1 兼容，零改动）

`runtime/mixinAst.js` + `runtime/mixinTransformer.js`（构建产物）继续对接
`tools/build_mixin_apk.py` 组装线与 C++ 调用点；`window.__mixin.register` 等全局契约
不变；既有 mod（prism-mod 等）行为不变。引擎源码 TS 化后由 esbuild 生成这两个文件。

### mod 作者（快速）

mod 目录结构与 patch 写法在 [docs/DESIGN-v2.md](docs/DESIGN-v2.md) §七；
调用点级操作示例：

```jsonc
{
  "name": "MyRedirect",
  "path": [{ "module": "625" }, { "name": "calc" }],
  "op": "redirect",          // 或 wrapCall / modifyArg
  "call": "helper",          // 目标函数内按 callee 点分名找调用点（支持 this.x）
  "code": "$args[0] * 10"    // 多命中需写 nth 或 all:true
}
```

### 构建工具（marks → patches.js）

```powershell
node build-tool/build.js <mod项目目录>
```

装饰器全集：`@MixinClass` `@Inject` `@Overwrite` `@Wrap` `@Export` `@Modify`
`@Redirect` `@WrapOperation` `@ModifyArg`（构建期唯一性预检 + 产物双重校验）。

### 内部设计文档（中文）

- [docs/BOOT-CHAIN.md](docs/BOOT-CHAIN.md) — 加载链路：eval 是什么、代码怎么进入运行时、
  拦截清单、两个拦截点的关系、变换后代码的执行路径、换宿主要做什么。
- [docs/DESIGN-v2.md](docs/DESIGN-v2.md) — v2 架构、新段/新 op 全集、Sponge 对照表、
  注入体 ES5/ES6 放开说明。
- [docs/DESIGN-v1-layanative.md](docs/DESIGN-v1-layanative.md) — v1 设计存档。
- [DESIGN-target.md](DESIGN-target.md) / [DESIGN-layout.md](DESIGN-layout.md) — v1 寻址设计与文件布局。

## License

MIT
