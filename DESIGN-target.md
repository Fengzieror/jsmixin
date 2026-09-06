# Mixin 目标描述体系设计（v2 草案）

> 取代 README 中"特征+单个函数名"的临时方案。
> 核心目标：**健壮、无歧义、失败可见**——宁可拒绝打补丁，绝不打错位置。

---

## 一、设计原则

1. **锚点分层，逐层收窄**：文件 → 命名空间 → 类 → 方法 → 内层函数。
   每一层至少一个独立锚点，越深的位置锚点越多（因为越深名字越不可信）。
2. **字符串是唯一的压缩幸存者**：方法表 key（`"createChildren"`）、UI 注册名
   （`"CommonButton"`）、业务文案（`"秒后重试"`）、协议字段名，全部是字符串，
   压缩器不敢碰。锚点优先用字符串，函数名只当辅助。
3. **构建期解析，运行期验证**：build 工具在本地对目标文件跑一遍 AST 解析，
   把用户描述解析成**规范路径**写进 patches.js；
   运行时 transformer 按路径走 AST，任一段不符 → 整个 patch 拒绝执行并打日志。
   （逐段特征哈希设计**暂缓**：当前版本不生成、不强制校验哈希，避免误伤；运行时
   仍支持 mixin 级 `hash` 字段，仅当显式提供时才校验。）
4. **永远精确到要改的那个函数本身**：上层闭包/类只是定位锚点，不是修改目标。
   （对应 Java 里"mixin 外层类、修改内层方法"——ES5 里我们不给 transformer 做
   推断，用户必须显式写全路径，歧义时必须写序号。）
5. **fail-safe**：0 个匹配或多于 1 个匹配，构建直接报错并列出所有候选；
   运行时哈希不符则跳过该 patch，游戏照常运行（未打补丁状态）。

---

## 二、目标描述语法（Target Grammar）

```
Target := {
  file: string                      // 必填。目标文件名(后缀匹配)
  hash: string                      // 可选。__mixin.sourceHash(source) = 'fnv1a32:xxxx:len:nnn'。
                                    // 【暂不要求】当前构建工具不生成，运行时仅显式提供时校验
  priority: number                  // mod 级(Sponge mixins.json 约定)。小者先应用，
                                    // 后应用者可定位前者注入的代码（串行链式修改）
  cls?:  string                     // 类的真名(来自 name-map, 如 'f.AccountBindPopupUI'
                                    // 或 'Rt.ElementStageView')
  method?: string                   // 方法表 key 字符串(如 'createChildren')
  path?: PathSeg[]                  // 逐层收窄的链，每段标一层名字（见下）
}

PathSeg := 
  | string                          // 具名段: 类真名或方法key
  | {
      module: string|number         // webpack 模块表 key (仅 Program 层)
      name: string                  // 名字段。单名匹配绑定名或函数自身id；点分名
                                    // ('ns.helper'/'V.deep.fn'/'f.AccountBindPopupUI')
                                    // 精确匹配命名空间绑定: a.b.c=fn / V={m:fn} / 嵌套对象
      call: string, arg: number     // 具名调用实参段: 定位"传给某个具名函数的回调"
                                    // (一次性函数/闭包没有绑定名，但调用点有名字)。
                                    // 实参槽位是语义位置；同名调用点必须唯一
      fn: number                    // [最后手段] 第n个直接子函数(裸序号，非常不建议)
      method: string                // babel 方法表 key: X(Cls,[{key,value:fn}])
                                    // 当前子树0候选时自动回退上一层查找
      anchor: {                     // [辅助] 内容锚点(AND): 直接子函数的子树必须包含
        strings?: string[],         // 这些字符串字面量
        calls?: string[],           // 出现这些被调用的名字
        params?: number             // 形参数量
      },
      index?: number                // [最后手段] 歧义序号(非常不建议；优先用更长的
                                    // 点分名/更深的链消歧)。未写且候选>1 → 报错
    }
```

寻址优先级（按健壮性）：**名字链（含点分命名空间）> {call,arg} 回调段 > anchor 内容锚点 > fn/index 裸序号**。
裸序号只能锁死在特定文件哈希上（必须配 hash），任何注入/版本变化都会失效。

**解析语义**：`cls + method` 定位到方法表成员；`path` 从方法（或 cls 的构造函数）
出发继续向内。`path` 每一段的锚点在该层的**直接子作用域**里求值——即"函数里的函数"
由父函数的字符串/调用特征锚定，这与 Java 中"类锚点 + 方法名"的哲学一致，
只是把"方法名"换成了更抗压缩的"内容锚点"。

### 为什么这样是健壮的（对照反例）

| 旧方案 | 问题 | v2 方案 |
|---|---|---|
| `target: 'a'`（函数名） | 全文件几万个 a/t | 名字只在"真名表"里出现, 且必须挂在 cls/method 之后 |
| 特征+单个函数名 | 特征误匹配 | 锚点集合是 **AND 关系**且分层验证, 单层误匹配会被下一层哈希拦住 |
| 无验证 | patch 打错位置静默生效 | 构建期唯一性检查 + 运行期逐段哈希, 双闸 |

---

## 三、标记集（SpongePowered 对齐）

用户在 mark 文件里用装饰器声明"怎么改"，语义与 Java Mixin 对齐：

| 装饰器 | 作用 | Java 对应 | ES5 实现方式（AST 变换） |
|---|---|---|---|
| `@MixinClass({target})` | 声明本组 patch 的公共目标（文件/类） | `@Mixin(类)` | 仅元数据 |
| `@Inject({at})` | 在目标函数的指定位置插入代码 | `@Inject @At("HEAD"/"TAIL"/"INVOKE")` | `at:'head'/'tail'` 直接插函数体首尾；`at:{invoke:'xx', nth:1}` 在第 n 次调用 `xx(...)` 的语句前/后插入 |
| `@Inject({at:'before'/'after', of:...})` | 在某条语句前后插入 | `@At("INVOKE")` shift | 同上，定位到语句 |
| `@Overwrite` | 整体替换目标函数体 | `@Overwrite` | 替换 FunctionExpression 的 body（**保留函数外壳**，prototype/可new性不变） |
| `@Wrap` | 包裹：拿到 `(...args, $orig)`，可前置/后置/改参/改返回值 | `@Inject`+`@ModifyReturnValue` 合体 | 函数体改写为临时函数 + 调用原体（编译前完成，非运行时 monkey-patch） |
| `@ModifyArg({argIndex, at?})` | 修改某次调用的第 n 个实参 | `@ModifyArg` | 定位 CallExpression 替换对应 argument |
| `@Export` | 把闭包内目标导出到 `window.__mixin_exports` | 无（Accessor 类似） | 闭包尾注入赋值语句 |
| `@Accessor({prop})` | 读写实例的闭包私有字段（经 getter/setter 函数） | `@Accessor` | 注入访问函数（需目标在可 new 的类上） |

MVP 只要求：`@MixinClass / @Inject(head,tail) / @Overwrite / @Wrap / @Export`。
`invoke/before/after/ModifyArg` 为第二阶段。

---

## 四、用户侧写法（阶段一：TS 文件里写 JS）

> 写法约定（build 工具已实现）：
> - mark 文件内容是**纯 ES5 JS**，装饰器只做标记；方法体 = 注入体。
> - 真实目标文件里类/函数都挂在 webpack 模块内，target 需显式锚定模块
>   （`target.module: '625'`，或 path 首段 `{ module: '625' }`）。
> - cls-only 目标：mark 方法名 = 目标类方法表的 key；给了 `target.method` 或
>   `target.path` 时，所有装饰方法作用于同一解析结果（方法名随意，惯例叫 `target`）。
> - `@Wrap` 方法第一个参数必须叫 `$orig`。

用户只写 `.mark.ts` 文件，**文件内容是纯 ES5 JS**（不使用 TS 类型语法），
用 TS 装饰器做标记。构建工具用 TypeScript Compiler API 直接读 **TS 源码的 AST**
提取装饰器与函数体，再以 `target: ES5` 编译出注入体——因此：
"用户在 TS 里写 JS" 天然支持；"用户在 TS 里写 TS" 是阶段二
（需要先把用户类型标注剥离，注入体只取 emit 后的 JS）。

```ts
// marks/AccountBindPopup.mark.ts
// 目标: f.AccountBindPopupUI (UI壳类) 的 createChildren 方法
// @ts-nocheck
// @ts-expect-error 装饰器由 mixin build 工具消费, 不参与 tsc 编译

import { MixinClass, Inject, Overwrite, Wrap, Export } from '@mixin/core';

@MixinClass({
  target: {
    file: 'main.min.js',
    version: '9976ea0e',              // main.min.js md5 前8位
    cls: 'f.AccountBindPopupUI',
  },
})
export default class AccountBindPopupUIMark {

  // ── 头部注入: 进函数先打日志 ──
  @Inject({ at: 'head' })
  createChildren() {
    console.log('[mark] AccountBindPopupUI.createChildren enter');
  }

  // ── 覆写: 整个函数体替换(保留外壳) ──
  @Overwrite
  loadUI() {
    this.loadUI$orig('AccountBindPopup');   // Overwrite 内没有 $orig; 此写法仅示意 Wrap
  }

  // ── 包裹: 前置校验 + 放行/拦截 ──
  @Wrap
  onEnable($orig: any) {                    // 阶段一不写类型, 此处仅文档示意
    if (window.__mark_disable__) return;    // 直接返回 = 吞掉原函数
    return $orig();
  }
}
```

**函数中的函数**（目标没有名字，锚点用内容）：

```ts
@MixinClass({
  target: {
    file: 'main.min.js',
    version: '9976ea0e',
    cls: 'V',                      // UI管理器(经 name-map: V = U.getInstance 所在类)
    method: 'showToast',
    path: [                        // 从 showToast 出发再向内
      {
        // 内层匿名函数: 体内含这些字符串字面量(AND)
        anchor: { strings: ['F5A623', '实名登记'], params: 0 },
        // index 省略: 候选必须唯一, 否则构建报错并列出候选
      },
    ],
  },
})
export default class RealnameToastMark {
  @Inject({ at: 'head' })
  target() {                       // path 定位到的最内层函数, 统一叫 target
    console.log('[mark] 实名弹窗 toast 将要弹出');
  }
}
```

**纯函数目标**（不挂类上的一次性函数/入口函数）：

```ts
@MixinClass({
  target: {
    file: 'main.min.js',
    version: '9976ea0e',
    // 无 cls/method: 从文件顶层出发
    path: [
      'XS',                        // 具名段: name-map 里的入口函数真名
      { anchor: { calls: ['Laya.init'] } },  // 其内的匿名函数
    ],
  },
})
export default class BootMark {
  @Inject({ at: 'tail' })
  target() {
    console.log('[mark] 引擎初始化完毕');
  }
}
```

---

## 五、构建期管线（build-tool/build.js，已实现）

```
输入: build-config.json + marks/*.mark.ts + name-map.json(可选) + gameFiles 指向目标 js
1. 读 marks/*.mark.ts ──(TS Compiler API)──> 装饰器 + 函数体(ES5 字符串)
2. name-map.json 换名: classes→cls 点分名, methods→方法表 key, aliases→name/call 段
   （未命中则原样使用，视为已写真名）
3. 装饰器展开:
   - cls-only 目标: mark 方法名 = 目标类方法表 key
   - target.method / target.path: 所有装饰方法作用于同一解析结果
   - @Export: 解析出目标函数的绑定名, 翻译成"父层函数尾注入 window.__mixin_exports 赋值"
4. 构建期预检: 复用 runtime/mixinAst 的 _internals 对目标文件 resolvePath，
   任何一段 0 个或多于 1 个候选 → 构建失败并列出候选（行:列 + 摘要）
5. 注入体 acorn 语法校验（与运行时 validateCode 同规则）
6. 产出 dist/patches.js（window.__mixin.register 形态）+ dist/mixins.json（无 required 块）
7. 产物校验: applyAstPatches 整体打补丁（stats 要求 0 跳过）→ 再解析 → 各 path 重定位
```

注意：真实目标文件的类/函数都挂在 webpack 模块函数内，mark 必须显式锚定模块段
（`target.module: '625'` 或 path 首段 `{ module: '625' }`），构建期同样强制预检。

## 六、运行期管线（mixinTransformer.js）

```
__mixinTransform(filename, source):
  1. 后缀匹配 patch.target; md5(原source) 与 patch.version 比对, 不符→跳过+log
  2. acorn.parse(source, { ecmaVersion: 'latest' })     // 支持未来ES6注入
  3. 沿规范路径走 AST, 每段先验 anchorHash:
       不符 → log('mixin target mismatch @seg', i) → 返回原 source(fail-safe)
  4. 到达目标函数节点, 按 patch.op 执行:
       inject-head/tail: body.body.splice(...)
       overwrite:        fn.body = parse(注入体)
       wrap:             改写为 内部临时函数+调用体
       export:           闭包尾插入 window.__mixin_exports[...] = ...
  5. generate → 返回新 source
```

---

## 七、健壮性清单（Review 用）

- [ ] 每个目标 ≥2 个独立锚点（名字类 + 结构/字符串类）
- [x] 构建期唯一性失败 → 报错并列出候选（不许"取第一个"）
- [x] 运行期逐 patch 校验，任一失败 → 跳过该 patch + console.warn，不做静默丢弃
- [ ] version(md5)/逐段哈希强校验 —— **暂缓**（当前版本不生成不校验，见 §一.3）
- [x] overwrite/wrap 不改变函数外壳：可 new 性、prototype、参数个数
- [x] 注入体一律为 ES5（构建工具以 ES5 目标读取 marks 并做语法校验）
- [x] inject tail 对齐 @At("TAIL")：函数以 return 结尾时注入到末尾 return 之前

## 八、与 Java Mixin 的语义对照（简）

| Java | 本方案 | 说明 |
|---|---|---|
| `@Mixin(Target.class)` | `@MixinClass({target:{file,cls}})` | 类锚点 → 文件+命名空间+类真名 |
| `@Inject(method="x", at=@At("HEAD"))` | `@Inject({at:'head'})` + 方法名 | 方法名 = 方法表 key 字符串，压缩不灭 |
| 目标是嵌套类 | `path` 锚点链 | Java 用 `Outer$Inner` 类名；ES5 无类名，用内容锚点 |
| 匿名类（禁区） | `path` 内容锚点 | Java 编译器改名不可靠；ES5 里结构稳定反而可靠 |
| 反射/Accessor | `@Export` / `@Accessor` | JS 无访问控制，导出即用 |
