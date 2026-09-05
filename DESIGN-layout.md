# 文件布局与装载约定（v2 草案 · 修订版）

> 定位修正：`assets/scripts/mixin/` 不是"所有 mod 的堆放处"，而是
> **APK 内置基础加载器（libmod-loader）这一个 mod 的 mixin 目录**。
> 用户 mod 全部放外部存储（`/sdcard/.battlecraft/mods/`，见 pdzzlauncher/docs/MOD_STORAGE.md），
> 由基础加载器在运行时装载。

---

## 一、两层 mod 结构

```
┌─ APK 内（引擎侧, 只读）──────────────────────┐
│  assets/scripts/                             │
│    ├── runtimeInit.js        # 引擎原有(改): 尾部引导 mixin 引擎
│    ├── apploader.js          # 引擎原有(生成)
│    └── mixin/                # ★ 基础加载器 mod 的 mixin 目录(一个mod的全部mixin)
│        ├── mixinTransformer.js   # mixin 运行时引擎(引擎侧公共设施, 不随mod分发)
│        ├── mixins.json           # 基础加载器自己的清单
│        ├── patches.js            # 基础加载器的patch(如: 调试钩子/启动埋点)
│        └── loader.js             # 基础加载器的入口(= entry): 装载外部mod
└──────────────────────────────────────────────┘
┌─ 外部存储（用户侧, 可写, 方案A全量授权）───────┐
│  /sdcard/.battlecraft/                       │
│    ├── mods.json                 # 固定读点(激活版本的mod列表, launcher维护)
│    ├── mods/                     # 全局mod仓库
│    │   ├── mod-a/                #   每个用户mod一个目录
│    │   │   ├── mixins.json       #   该mod的mixin清单
│    │   │   ├── patches.js        #   构建产物(规范路径+哈希+ES5注入体)
│    │   │   └── mod.js            #   可选: 附加式代码(entry)
│    │   └── mod-b.zip/...         #   zip形态待loader支持
│    └── versions/<name>/mods.json # 版本作用域(选版本时拷到根mods.json)
└──────────────────────────────────────────────┘
```

职责划分：

| 东西 | 谁提供 | 为什么 |
|---|---|---|
| `mixinTransformer.js` | APK（引擎侧） | 公共基础设施，所有 mod 共用一份；mod 只交数据（patches），不交引擎。transformer 坏 = 全局灾难，必须跟 APK 走版本 |
| 基础加载器的 mixins/patches | APK 内置 | 它是"第一个 mod"，负责把外部 mod 接进管线；也是无外部 mod 时 mixin 系统的存量用户（自举验证） |
| 用户 mod 的 mixins/patches/entry | 外部存储 | 可随时增删替换，不动 APK |

## 二、mixins.json（对齐 Sponge mixins.json）

APK 内的基础加载器和每个用户 mod 各带一份，格式相同：

```jsonc
{
  "schemaVersion": 1,
  "modid": "partytools",
  "name": "PartyTools",
  "version": "1.0.0",
  "priority": 100,                 // 越小越先应用; 基础加载器建议 0
  "required": {                    // 版本锁: 不满足→本mod整体跳过+console.warn
    "target": "main.min.js",
    "md5": "9976ea0e"
  },
  "mixins": ["patches.js"],        // patch 文件列表(编译产物, 不含TS源码)
  "entry": "mod.js"                // 可选: 附加式代码入口(游戏启动后执行)
}
```

Sponge 对照：`<modid>.mixins.json` ≈ 本清单；refmap.json（构建期名字映射）≈
我们嵌进 patches.js 的规范路径+特征哈希。TS 源码留在 mod 仓库，不进包。

## 三、装载时序（运行时）

```
C++ onThInit:
  ① JSP_RUN_SCRIPT("scripts/runtimeInit.js")
       └─ runtimeInit.js 追加的引导:
            a. 读执行 mixin/mixinTransformer.js  → window.__mixin 引擎就绪
            b. 读执行 mixin/mixins.json + patches.js
               → 注册基础加载器自己的 patch (priority=0)
            c. 执行 loader.js (基础加载器入口):
                 - 读 /sdcard/.battlecraft/mods.json (固定读点, 真实路径readFileSync)
                 - 逐 mod: 读 mixins.json
                     · required.md5 不符 → 跳过 + console.warn('[mixin] skip <modid>')
                     · 读 patches.js → window.__mixin.register(patches)  ← 统一入口注册
                     · entry 存在 → 排进启动队列
                 - 全部按 priority 排序合并
  ② C++ 从 global 取 __mixinTransform → 存 s_mixinTransformer   ← 注册完成
  ③ apploader.js → vendor.min.js → wx.js → main.min.js (照常)
       每个游戏JS编译前: __mixinTransform(filename, source)
         → 按合并后的 patch 列表(按target文件分组、按priority排序)
         → 逐patch: 哈希校验 → 应用 / 失败跳过+警告
  ④ 游戏启动完成(GS.enter 后, 具体挂点待定):
       依次执行各 mod 的 entry(mod.js)  ← 附加式mod从这里开始跑
```

三条纪律：

1. **注册窗口**：所有 patch 必须在 ② 之前注册完（即都在 runtimeInit 阶段同步完成）。
   外部 IO 只是 readFileSync 几个小文件，毫秒级，窗口够用；
2. **单一管线**：所有 mod 的 patch 进同一个全局列表、同一次 transform 调用按序应用，
   没有任何"mod 各自改源码"的旁路；
3. **基础加载器 priority=0**：它若有 patch，永远先应用；用户 mod 之间的顺序用 priority
   表达，同 priority 按 modid 字典序（确定性）。

## 四、PC 侧（构建期）

```
mod项目/
├── marks/*.mark.ts              # 用户写: ES5 JS + 装饰器
├── mixins.template.json         # modid/priority 作者填
├── name-map.json                # 逆向产出
└── build-config.json            # gameFiles 指向目标js

build 工具: TS Compiler API 读mark → 对目标js跑AST解析(mark target→规范路径+哈希)
  → 唯一性/冲突图检查(不过报错列候选) → 产出 patches.js
  → 产出 mixins.json(required.md5 自动填实际目标文件md5)
```

## 五、调试通道

1. **外部 mod 热迭代**（用户mod的福利）：直接 `adb push` 到 `/sdcard/.battlecraft/mods/<modid>/`
   重启游戏即生效——外部存储可写，不用重打 APK。这也是两层结构最大的工程红利；
2. **APK 内基础加载器迭代**：改 assets 需重打包（或调试期 adb push 覆盖 + 引擎外部资源路径）；
3. **PC 预演**：build 工具 `--dry-run` 对目标文件产出变换后 JS，`node --check` + 冒烟，
   不上手机验证正确性。

---

## 阶段0：测试期简化（当前执行，不建外部装载）

测试期约定：**不读外部存储、不用启动器 mod 仓库、无 loader.js**——直接在原版 APK
上修修补补，验证 mixin 闭环。`mixin/` 里只有引擎与一个测试 mod 的内容：

```
assets/scripts/mixin/
  ├── mixinTransformer.js     # 最小transformer(v0: 只做字符串替换; v1: AST)
  └── patch_bundle.js         # 硬编码的测试patch清单(无mod装载逻辑)
```

分四级验收，每级目标单一：

| 级 | 验证点 | 做法 |
|---|---|---|
| L0 | C++ 钩子通了 | transformer 只 `console.log('[mixin] ' + filename)`；启动后 logcat 应看到 runtimeInit/apploader/vendor/main 逐个出现 |
| L1 | 改动生效 | 硬编码字符串替换 patch：如把 toast 文案 `"秒后重试"` 换成 `"[mixin]秒后重试"`，真机弹窗肉眼可见 |
| L2 | 定位准 | 用规范路径定位 `f.AccountBindPopupUI.createChildren`，`at:'head'` 注入一行日志；触发对应 UI 看日志 |
| L3 | fail-safe | 故意写错哈希/版本号 → 确认 patch 被跳过、游戏正常、有警告日志 |

操作流程（全部用现有资产）：

1. 改 C++ 四文件（README §三）→ 编译 `liblayaair.so`（产物进 `pdzzlayanative/build-artifacts`）；
2. 写 `mixinTransformer.js`（v0 纯字符串级，README §九 v1 口径，不引 acorn）；
3. `pdzzapksworkspace` 用现有解包树 `_ws_noads_work` 塞入 `assets/scripts/mixin/`，
   `repack_with_engine.py`（换 so）+ 签名（keystore 都在）；
4. 安装 → logcat 过滤 LayaNative/console 标签验收 L0→L3。

外部 mod 装载（mods.json 扫描/loader.js）全部推迟到阶段1，届时只需把 loader.js
加回 mixin/ 目录——接口(`window.__mixin.register`)在 v1 transformer 里预留空实现。

