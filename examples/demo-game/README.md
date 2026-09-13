# demo-game — jsmixin 端到端演示项目

> 一个**零改动**的宿主"小游戏" + 3 个 mixin mod。
> 展示 jsmixin 作为通用模块被第三方使用的完整流程：接入（1 行）、mod 开发（mark 文件）、
> 构建（build 工具）、分发（mods/ 目录包）、运行（注册窗口 → 变换 → entry）。

## 快速开始

```bash
# 前置：jsmixin 已构建（在 jsmixin 根目录 npm run build）
npm install          # file:../.. 引入 jsmixin
npm run build:mods   # 用 build 工具把 3 个 mod 源工程构建进 mods/
npm start            # 跑游戏（mod 自动装载生效）
npm run verify       # 自检：19 项断言 + 磁盘零改动校验
```

English quick start: `npm install && npm run build:mods && npm start && npm run verify`
(requires `npm run build` in the jsmixin root first). The host game is never modified —
all transforms happen in memory before compilation.

## 项目结构

```
demo-game/
├── game/                    # 宿主"游戏"（假装是第三方作品，永远不被修改）
│   ├── main.js              #   入口：require('jsmixin/node') 一行接入
│   ├── player.js            #   形态①：ES6 class + CJS
│   ├── combat.js            #   形态②：普通函数群（调用点级 op 的目标）
│   ├── ui.js                #   形态③：命名空间对象（UI.Toast.show）
│   └── shop.js              #   形态④：IIFE 工厂 + 闭包状态（真实压缩包的样子）
├── mod-projects/            # mod 源工程（作者只写这些）
│   ├── log-mod/             #   build-config.json + marks/*.mark.ts (+ entry.js)
│   ├── balance-mod/
│   └── cheat-mod/
└── mods/                    # 构建产物 = 分发形态（mod 包跨宿主通用）
    ├── mods.json            #   装载列表（launcher 的 {"mods":[{id,enabled}]} 格式）
    ├── log-mod/             #   mixins.json + patches.js + entry.js
    ├── balance-mod/
    └── cheat-mod/
```

## 接入方式（宿主视角）

| 档位 | 做法 | 效果 |
|---|---|---|
| 一行引入（本 demo） | 业务入口第一行 `require('jsmixin/node')` | eval/Function/vm/require 四通道接管；`./mods` 自动装载。入口文件自身已编译完不被 patch，它 require 的模块都过管线 |
| CLI | `jsmixin run game/main.js --mods mods` | 激活先于加载，入口本身也可被 patch |
| 裸 JS 环境 | `dist/boot/mixin-boot.js` 最先执行 | 无 require 概念的运行时（LayaNative 等）走全局 `__mixin` 契约 |

## 三个 mod 演示了什么

**log-mod**（priority 10，最小样本）
- 点分命名空间寻址 `{name:'UI.Toast.show'}`
- `@Inject({at:'head'})` 观察入参；`@Modify` 精确文本替换
- `entry`：附加式代码，游戏启动后执行，跨 mod 读取 `__mixin_exports`

**balance-mod**（priority 50，类目标）
- `{class:'Player'}` 定位原生 ES6 class，op 级 `method` 参数一打多
- `@Inject({cancellable:true})`：大额伤害（≥40）head 注入内 return 即取消原方法
- `@ModifyReturnValue`：移速 +5；`@Overwrite`：改写战报文案

**cheat-mod**（priority 100，动作最大）
- 调用点级全套：`@Redirect`（骰子恒 20）、`@ModifyArg`（等级 ×3）、
  `@WrapOperation`（`$orig` 转发观察原始伤害）、`@ModifyArgs`（成员调用
  `player.takeDamage` 实参 -3）、`@ModifyExpressionValue`（商店半价）
- `@Share`/`@Local`：同函数两次注入共享词法变量（构建期校验）
- `@Export({writable:true})`：把 IIFE 闭包里的 `buy` 用 defineProperty get/set
  开出来——entry 里跨 mod 调用 `buyFn('elixir', 40)`，折价同样生效

## 数值推演（verify.js 断言依据）

- `computeDamage(3)`：骰子被 Redirect 成 20，加成 `bonusOf(3)` 实参 ×3 → 3×2×3=18 → **38**
- `combatTurn` 里 `@ModifyArgs` 先减 3 → 35 进 `takeDamage`；35 < 40 护盾阈值 → 不取消 → hp 65
- 第 2 回合同理 26→23 → hp 42；治疗 5 → 47
- `buy('potion', 20)`：`@ModifyExpressionValue` 半价 → cost 10 → gold 90

## mod 作者的工作流

1. 写 `marks/*.mark.ts`（纯 ES5 函数体 + 装饰器；`$value/$arg/$args/$orig` 是运行时注入的绑定）
2. `build-config.json` 里 `gameFiles` 指向目标文件（本 demo 用 `../../game/x.js` 直指宿主，多 mod 同管一份真源）
3. `npm run build:mods` → 预检（0/多候选即失败并列出）→ 产物进 `mods/<modid>/`
4. 增删 mod 只动 `mods/` 目录：`mods.json` 里 `enabled:false` 或删目录，重启生效，宿主永不重打包
