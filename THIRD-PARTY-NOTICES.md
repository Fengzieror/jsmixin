# Third-Party Notices

jsmixin 自身以 [MIT License](./LICENSE) 发布。本文件列出随包分发或构建期使用的第三方组件及其许可。

## 运行时分发（随产物分发）

### acorn 8.18.0

- 用途：JavaScript 解析器（AST 变换的前端）。
- 分发形态：npm 依赖（`dependencies.acorn`）；`vendor/acorn.js`（官方 UMD 构建副本，供裸 JS 环境先于 runtime 加载）；内联进 `dist/boot/mixin-boot.js`。
- 许可：MIT License
- 版权：Copyright (C) 2012-2020 by Marijn Haverbeke, Ingvar Stepanyan and contributors
- 主页：<https://github.com/acornjs/acorn>

## 仅构建期使用（不随产物分发代码）

### typescript

- 用途：核心源码编译（tsc）与构建工具解析 mark 文件（TS Compiler API）。
- 许可：Apache License 2.0
- 版权：Copyright (c) Microsoft Corporation.
- 主页：<https://github.com/microsoft/TypeScript>

### esbuild

- 用途：生成 `runtime/mixinAst.js`、`runtime/mixinTransformer.js`、`dist/boot/mixin-boot.js` 兼容产物。
- 许可：MIT License
- 版权：Copyright (c) 2020 Evan Wallace
- 主页：<https://github.com/evanw/esbuild>

### @types/node

- 用途：Node.js 类型声明（仅开发期）。
- 许可：MIT License
- 版权：Copyright (c) Microsoft Corporation. / Definitely Typed
- 主页：<https://github.com/DefinitelyTyped/DefinitelyTyped>

---

以上各组件的许可副本可在其官方仓库获取。依据 MIT/Apache-2.0 的再分发条款，本仓库在
`vendor/acorn.js` 与 esbuild 产物头部（`/*! Includes acorn ... */` banner）保留了对应的
版权与许可声明。
