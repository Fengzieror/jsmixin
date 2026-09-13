# 错误处理策略：哪些错误跳过，哪些中止

> 适用范围：jssmixin 运行时（core/ast、core/engine、loader、hosts）与构建期（build-tool）。
> 总原则：**运行时永不因 mod 崩溃——"中止"的上限是把该文件/该 mod 打回原样继续跑；
> 构建期宁报错不出坏产物——所有校验失败都中止构建，但收集齐全一次报全。**

## 一、运行时（core / loader / hosts）

目标：宿主进程（游戏 / Node 应用）绝不因单个 mod、单个 patch、单个文件的问题而崩溃。
错误按影响面从大到小分四级，**一律不向宿主抛异常**：

### 1. 整文件回滚（该文件全部补丁失效，返回原文）

| 错误 | 处理 | 日志级别 |
|---|---|---|
| 目标文件 acorn 解析失败（script + module 两轮都失败） | 返回原文 | ERROR |
| 补丁产物最终 re-parse 失败（本次新增的自检，#5） | 丢弃该文件本轮全部已接受编辑，返回原文 | ERROR |

为什么回滚而不是跳过单个 patch：编辑基于原始坐标，产物语法损坏意味着已有错误编辑混入，
无法安全地"只撤一条"；整批回滚是唯一可靠的 fail-safe。

### 2. 跳过该 patch（其余 patch 照常）

| 错误 | 处理 |
|---|---|
| path 定位失败（0 个 / 多个候选、index 越界或非法） | SKIP + 列出候选 |
| op 前置校验失败（目标不是块体函数、wrap 遇 generator/块体箭头、modify 的 replace 与命中节点种类不匹配等） | SKIP + 明确原因 |
| 与已接受编辑重叠（跨 patch 坐标冲突） | SKIP |
| 同一 patch 内部编辑互相重叠（#2：`all:true` 命中嵌套同名调用等） | SKIP（新增；此前静默产出损坏代码） |
| 组装文本自身语法错误（调用点系 op 拼装校验） | SKIP |

跳过的 patch 计入 `stats.skipped`；引擎批量快路径只要有 skipped 即回退串行管线（语义保底）。

### 3. 跳过该 mod / 该 mixin（其余 mod 照常）

| 错误 | 处理 |
|---|---|
| mixins.json 缺失 / JSON 解析失败 | WARN + 跳过该 mod |
| 单个 mixin 文件不可读（#13） | WARN + **continue 装载其余 mixin 与 entry**（不连坐整个 mod） |
| patches.js 执行异常 | WARN + 跳过该 mod（独立 try/catch） |
| 哈希锁不符 | WARN + 跳过该 mod（fail-safe） |

### 4. 告警不阻断（变换继续）

| 情形 | 处理 |
|---|---|
| replaces 的 from 找不到 | WARN（可能游戏版本不符） |
| replaces 的 from 为空串（#14） | WARN + 跳过该条（防炸碎输出） |
| 没有任何 patch 生效 | WARN（fail-safe 返回原文件） |
| 目标代码疑似含直接 eval（#3） | WARN：eval 钩子只能拦截编译入口，直接 eval 会被变成间接 eval，
  词法作用域语义改变；无法在不改变语义的前提下拦截，只能告警 + 文档声明 |
| 重复激活宿主且 options 不一致（#14） | WARN + 沿用首次配置 |

### 5. 明确"应当中止"的运行时错误：无

运行时没有需要中止宿主进程的错误。"中止"的语义在此被定义为
"把受影响的文件/patch/mod 打回原样"，并由 `stats` / 日志把决策暴露给 mod 作者。

## 二、构建期（build-tool）

目标：坏产物绝不出厂。构建是 PC 上的离线工具，报错成本为零，
因此与运行时相反——**所有校验失败都中止**。

### 立即 fail（基础设施错误，报可读信息后退出）

- build-config.json 缺失 / 带 BOM 导致 JSON.parse 失败（#15：readText 去 BOM 后报错可读）
- marks 目录不存在 / 递归扫描后没有任何 `*.mark.ts`（#15：子目录也扫描）
- target.file 不在 gameFiles 里
- @Inject at/cancellable、@Wrap $orig、@Export as 等**装饰器参数形态错误**
  （当前实现为抛异常只报第一个，与 errors 收集纪律的统一见"已知不一致"）

### 收集进 errors，一次报全后中止构建

- path 预检失败（0 / 多候选）
- 注入体语法错误
- @Local 引用了目标函数不存在的局部变量（@Share 白名单**按 targetFile 分桶**，#12）
- @Share 声明未被本注入体声明（解析注入体失败也进 errors，不再裸抛 acorn 异常，#12）
- method 冲突 / op 级 method 与 target.method 歧义
- @Export 目标是顶层函数（父层是 Program，无处注入；死守卫 `length < 1` 修正为 `length < 2`，#15）
- 产物校验失败（打补丁后 re-parse 失败 / path 无法重定位 / 同 mixin 内 patch 未生效）

### 已知不一致（待后续统一）

装饰器参数形态错误目前走 fail()（只报第一个），其余走 errors 收集（一次报全）。
统一方向：全部改收集。本次不动，避免破坏既有测试对报错信息的断言。

## 三、宿主钩子（eval / Function / vm / require）

- 变换抛异常 → 捕获 + WARN + 用**原文**继续编译（fail-open）。
- require hook 读不到文件 → 回落原生 handler（由其抛出原生错误）。
- `jsmixin run` CLI：`process.exit` 改 `process.exitCode`，不再抢在 mod entry（setTimeout 0）之前退出（#8）；
  入口脚本若为常驻服务，进程随其事件循环存续，文档已说明。
