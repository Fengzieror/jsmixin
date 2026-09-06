# LayaNative Mixin 系统 — 设计方案

> 在 LayaNative 的 JS 代码编译前，通过 AST 变换注入/修改/导出代码，实现类似 SpongePowered Mixin 的源码级变换能力。

---

## 一、核心思想

### 1.1 问题背景

LayaNative 中运行的游戏 JS 代码（如《派对制造》）是：

- **ES5 格式**，最外层通常是 IIFE（立即执行函数表达式）闭包
- **经过混淆**，类名、方法名、变量名都是 `a`、`b`、`c` 这样的短名
- **闭包内部的东西默认不暴露**，外部无法访问

想要修改游戏行为（如无敌、修改数值、添加日志），需要一种机制：

1. 找到闭包内部的目标代码
2. 修改它（替换函数体、注入代码、修改数值）
3. 或者把它引出来（暴露给外部 mod 使用）

### 1.2 解决方案

**在 V8 编译之前拦截 JS 源码，做 AST 级别的变换。**

```
JS 源码字符串
    │
    ▼
acorn.parse(source)  ──→  AST (抽象语法树)
    │
    ▼
遍历 AST，找到目标节点
    │
    ▼
修改 AST（替换/注入/导出）
    │
    ▼
acorn.generate(ast)  ──→ 修改后的 JS 源码
    │
    ▼
V8 编译 + 执行（修改后的代码）
```

### 1.3 关键优势

- **不是 monkey-patch**：运行时不存在"先加载原函数再替换"的过程，V8 直接编译修改后的源码
- **可以访问闭包内部变量**：因为 transformer 是在编译前修改源码，注入的代码写在闭包内部，和原有代码在同一个作用域
- **不需要修改 V8 源码**：只改 LayaNative 的 `__JSRun::Run()` 封装层
- **不需要修改游戏原始 JS 文件**：变换在内存中完成，不写回文件

---

## 二、架构总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                        开发阶段 (构建工具)                            │
│                                                                     │
│  mods/                              build-tool/                     │
│  ├── marks/                         ├── build.js                   │
│  │   ├── PlayerMarks.js             ├── name-map.json              │
│  │   └── UIMarks.js                 ├── type-gen.js                │
│  ├── name-map.json (由逆向工具提供)  └── patch-bundler.js           │
│  └── tsconfig.json                       │                          │
│       │                                  │                          │
│       │ 用户用可读名写 Mark              │ 1. 解析 marks            │
│       │ 编辑器有类型提示                 │ 2. 映射表转换可读名→混淆名│
│       ▼                                  │ 3. 生成 .d.ts 声明文件   │
│  ┌────────────────────────────────────┐  │ 4. 生成 patch_bundle.js  │
│  │          build.js                  │  │                          │
│  │                                    │  │                          │
│  │  输出:                             │  │                          │
│  │  ├── patch_bundle.js              │  │                          │
│  │  └── generated/game-types.d.ts    │  │                          │
│  └──────────────┬─────────────────────┘  │                          │
│                 │                         │                          │
└─────────────────┼─────────────────────────┼──────────────────────────┘
                  │                         │
                  │ 部署到 APK assets/       │
                  ▼                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        运行阶段 (手机端)                              │
│                                                                     │
│  assets/scripts/                                                    │
│  ├── runtimeInit.js       (加载 mixinTransformer + patch_bundle)    │
│  ├── mixinTransformer.js  (含 acorn 精简版 + AST 变换引擎)           │
│  ├── patch_bundle.js      (构建产物，描述所有变换)                    │
│  └── apploader.js         (游戏入口)                                 │
│                                                                     │
│  liblayaair.so                                                      │
│  └── __JSRun::Run() 改造: 调用 __mixinTransform(filename, source)    │
│       │                                                             │
│       ▼                                                             │
│  mixinTransformer.js                                                │
│  ├── 1. 检查 filename 是否匹配 patch_bundle 中的目标                  │
│  ├── 2. acorn.parse(source) → AST                                   │
│  ├── 3. 遍历 AST，找到目标节点                                       │
│  ├── 4. 修改 AST (替换/注入/导出)                                    │
│  └── 5. acorn.generate(ast) → 修改后的源码                           │
│       │                                                             │
│       ▼                                                             │
│  V8 编译修改后的源码                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 三、拦截点 — `__JSRun::Run()` 改造

### 3.1 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `Conch/source/conch/JSWrapper/JSInterface/V8/JSCProxyTLS.h` | `__JSRun::Run()` 增加 filename 参数 + 调用 JS transformer |
| `Conch/source/conch/JSWrapper/JSInterface/JSInterface.h` | 修改 `JSP_RUN_SCRIPT` 宏，传递 filename |
| `Conch/source/conch/JCScriptRuntime.cpp` | `onThInit()` 中注册 transformer 函数到全局 persistent handle |
| `Conch/source/conch/JSWrapper/JSInterface/V8/JSEnv.h` | 给 `Javascript` 类或 `__JSRun` 加一个 static persistent function 用于存 transformer |

### 3.2 修改 `JSP_RUN_SCRIPT` 宏

**`JSInterface.h`** (V8 分支):

```cpp
// 原来
#define JSP_RUN_SCRIPT(script,fileName)   laya::__JSRun::Run(script);

// 改为
#define JSP_RUN_SCRIPT(script,fileName)   laya::__JSRun::Run(script, fileName);
```

### 3.3 修改 `__JSRun::Run()`

**`JSCProxyTLS.h`**:

```cpp
namespace laya {
    class __JSRun {
    public:
        // 存储 JS transformer 函数（在 onThInit 中注册）
        static v8::Persistent<v8::Function> s_mixinTransformer;
        
        // 增加 filename 参数
        static bool Run(const char* p_pszScript, 
                        const char* p_pszFilename = nullptr) {
            v8::Isolate* isolate = v8::Isolate::GetCurrent();
            v8::HandleScope handle_scope(isolate);
            v8::TryCatch try_catch(isolate);
            
            std::string strScript(p_pszScript ? p_pszScript : "");
            std::string strFilename(p_pszFilename ? p_pszFilename : "unknown");
            
            // ★★★ 调用 JS transformer（如果已注册）★★★
            if (!s_mixinTransformer.IsEmpty()) {
                v8::Local<v8::Function> transformer = 
                    s_mixinTransformer.Get(isolate);
                v8::Local<v8::Context> context = isolate->GetCurrentContext();
                
                v8::Local<v8::Value> argv[] = {
                    v8::String::NewFromUtf8(isolate, strFilename.c_str()).ToLocalChecked(),
                    v8::String::NewFromUtf8(isolate, strScript.c_str()).ToLocalChecked()
                };
                
                v8::MaybeLocal<v8::Value> result = transformer->Call(
                    context, v8::Undefined(isolate), 2, argv);
                
                if (!result.IsEmpty()) {
                    v8::String::Utf8Value utf8(isolate, result.ToLocalChecked());
                    if (*utf8 && utf8.length() > 0) {
                        strScript = *utf8;
                    }
                }
                // 如果 transformer 抛异常，try_catch 会捕获，不影响编译
            }
            
            // ★ 原有编译逻辑不变，用 strScript.c_str() ★
            v8::MaybeLocal<v8::String> source = 
                v8::String::NewFromUtf8(isolate, strScript.c_str());
            if (source.IsEmpty()) { return false; }
            
            v8::Local<v8::Script> script;
            if (!v8::Script::Compile(isolate->GetCurrentContext(), 
                    source.ToLocalChecked()).ToLocal(&script)) {
                ReportException(isolate, &try_catch);
                return false;
            }
            
            v8::Local<v8::Value> result;
            if (!script->Run(isolate->GetCurrentContext()).ToLocal(&result)) {
                ReportException(isolate, &try_catch);
                return false;
            }
            return true;
        }
    };
    
    // 静态成员定义（在 .cpp 文件中）
    v8::Persistent<v8::Function> __JSRun::s_mixinTransformer;
}
```

### 3.4 在 `onThInit()` 中注册 transformer

**`JCScriptRuntime.cpp`**，在 `onThInit()` 中，执行 `runtimeInit.js` 之后、`apploader.js` 之前：

```cpp
void JCScriptRuntime::onThInit(JCEventEmitter::evtPtr evt) {
    // ... 原有代码 ...
    
    // 执行 runtimeInit.js（原有的）
    if (m_pAssetsRes->loadFileContent("scripts/runtimeInit.js", sJSRuntime, nSize)) {
        JSP_RUN_SCRIPT(sJSRuntime, "scripts/runtimeInit.js");
        delete[] sJSRuntime;
    }
    
    // ★★★ 注册 __mixinTransform 函数 ★★★
    {
        v8::Isolate* isolate = v8::Isolate::GetCurrent();
        v8::HandleScope handle_scope(isolate);
        v8::Local<v8::Context> context = isolate->GetCurrentContext();
        
        v8::Local<v8::Value> transformerVal;
        if (context->Global()
                ->Get(context, v8::String::NewFromUtf8(isolate, "__mixinTransform").ToLocalChecked())
                .ToLocal(&transformerVal) 
            && transformerVal->IsFunction()) {
            
            __JSRun::s_mixinTransformer.Reset(
                isolate, transformerVal.As<v8::Function>());
            LOGI("Mixin transformer registered.");
        } else {
            LOGI("No mixin transformer found.");
        }
    }
    
    // ★ 继续执行 apploader.js（原有的）★
    // ...
}
```

### 3.5 不修改 V8 源码

所有修改都在 `Conch/source/conch/JSWrapper/JSInterface/V8/` 目录下，这是 **LayaNative 自己的代码**，不是 V8 的代码。V8 源码在 `v8/` 目录，不动。

---

## 四、运行时 Transformer（mixinTransformer.js）

### 4.1 功能

1. 加载 `patch_bundle.js` 获取所有变换描述
2. 对每个需要变换的文件，用 acorn 解析 AST
3. 根据变换描述定位目标节点
4. 修改 AST
5. 生成修改后的源码返回给 C++

### 4.2 核心逻辑

```javascript
// mixinTransformer.js（简化逻辑）
window.__mixinTransform = function(filename, source) {
    // 1. 检查是否匹配 patch 目标
    var patches = window.__mixinPatches || [];
    var matched = null;
    for (var i = 0; i < patches.length; i++) {
        var p = patches[i];
        if (filename.endsWith(p.target)) {
            matched = p;
            break;
        }
    }
    if (!matched) return source;  // 不匹配，原样返回
    
    // 2. 用 acorn 解析源码为 AST
    var ast = acorn.parse(source, {
        ecmaVersion: 5,
        sourceType: 'script'
    });
    
    // 3. 找到 IIFE 闭包体（如果是 IIFE 格式）
    var body = findIIFEBody(ast);
    if (!body) body = ast.body;  // 非 IIFE 则用顶层
    
    // 4. 应用变换
    // 4a. 处理 exports（导出内部变量）
    if (matched.exports) {
        applyExports(body, matched.exports);
    }
    
    // 4b. 处理 overwrites（替换函数）
    if (matched.overwrites) {
        applyOverwrites(body, matched.overwrites);
    }
    
    // 4c. 处理 injects（注入代码）
    if (matched.injects) {
        applyInjects(body, matched.injects);
    }
    
    // 5. 生成修改后的源码
    return acorn.generate(ast);
};
```

### 4.3 导出（Export）实现

**目标**：把闭包内部的变量赋值给 `window.__mixin_exports`。

```javascript
function applyExports(body, exports) {
    // 生成导出语句的 AST
    var exportCode = 'window.__mixin_exports = window.__mixin_exports || {};\n';
    exports.forEach(function(exp) {
        exportCode += 'window.__mixin_exports["' + exp.name + '"] = ' + exp.internalVar + ';\n';
    });
    
    var exportAST = acorn.parse(exportCode, { ecmaVersion: 5 }).body;
    
    // 注入到闭包体底部（最后一个语句之前，不破坏原有导出）
    body.splice(body.length - 1, 0, ...exportAST);
}
```

**效果**：

```javascript
(function() {
    var a = function() { this.b = 0; };
    a.prototype.c = function(d) { this.b -= d; };
    
    // ★ 注入的导出代码 ★
    window.__mixin_exports = window.__mixin_exports || {};
    window.__mixin_exports["Player"] = a;
    window.__mixin_exports["takeDamage"] = a.prototype.c;
    
    // 原有的导出
    window.player = new a();
})();
```

### 4.4 覆盖（Overwrite）实现

**目标**：找到目标函数，替换其函数体。

```javascript
function applyOverwrites(body, overwrites) {
    overwrites.forEach(function(ow) {
        // ow.target 是类似 ['a', 'prototype', 'c'] 的路径
        // ow.code 是替换后的函数体字符串
        
        // 在 IIFE 闭包体内找到目标赋值语句
        var target = findAssignment(body, ow.target);
        if (target) {
            // 替换函数体
            var newFn = acorn.parse('function(' + ow.params + ') { ' + ow.body + ' }', 
                { ecmaVersion: 5 }).body[0].expression;
            target.right = newFn;
        }
    });
}
```

### 4.5 注入（Inject）实现

**目标**：在函数体开头或末尾插入代码。

```javascript
function applyInjects(body, injects) {
    injects.forEach(function(inj) {
        // inj.target: 路径，如 ['a', 'prototype', 'f']
        // inj.at: 'head' 或 'tail'
        // inj.code: 注入的代码
        
        var targetFn = findFunctionAssignment(body, inj.target);
        if (targetFn) {
            var injectAST = acorn.parse(inj.code, { ecmaVersion: 5 }).body;
            if (inj.at === 'head') {
                targetFn.body.body = injectAST.concat(targetFn.body.body);
            } else {
                targetFn.body.body = targetFn.body.body.concat(injectAST);
            }
        }
    });
}
```

---

## 五、构建工具（build-tool）

### 5.1 功能

1. 读取 `mods/marks/*.js`（用户写的 Mark 文件）
2. 读取 `name-map.json`（混淆名映射表）
3. 把 Mark 中的可读名转换为混淆名
4. 生成 `patch_bundle.js`（运行时加载）
5. 生成 `generated/game-types.d.ts`（类型声明，消除编辑器红色波浪线）

### 5.2 映射表格式

```json
{
    "version": "1.0",
    "game": "派对制造",
    "classes": {
        "Player": "a",
        "GameConfig": "b",
        "UIManager": "c",
        "PhysicsEngine": "d"
    },
    "methods": {
        "Player.takeDamage": "a.prototype.c",
        "Player.update": "a.prototype.f",
        "Player.die": "a.prototype.e",
        "GameConfig.MAX_HEALTH": "b.a",
        "UIManager.update": "c.d",
        "PhysicsEngine.GRAVITY": "d.e"
    },
    "properties": {
        "Player.health": "b",
        "Player.speed": "g"
    }
}
```

### 5.3 构建流程

```
1. 读取 mods/marks/*.js
   ├── 解析 Mixin.export / Mixin.overwrite / Mixin.inject 等调用
   └── 提取可读名

2. 读取 name-map.json
   └── 构建 可读名 → 混淆名 映射

3. 转换 Mark 中的名字
   ├── Player → a
   ├── takeDamage → a.prototype.c
   └── health → b

4. 生成 patch_bundle.js
   └── 包含 AST 定位路径和变换描述

5. 生成 game-types.d.ts
   └── 从映射表反向生成 TypeScript 类型声明
```

### 5.4 构建产物格式

**`patch_bundle.js`**：

```javascript
window.__mixinPatches = [{
    // 目标文件（支持文件名后缀匹配）
    target: 'game.js',
    
    // 导出声明
    exports: [{
        name: 'Player',
        internalVar: 'a'
    }, {
        name: 'takeDamage',
        internalVar: 'a.prototype.c'
    }],
    
    // 覆盖声明
    overwrites: [{
        // AST 路径
        target: ['a', 'prototype', 'c'],
        params: ['amount'],
        body: 'console.log("modified"); return 0;'
    }],
    
    // 注入声明
    injects: [{
        target: ['a', 'prototype', 'f'],
        at: 'head',
        code: 'console.log("update called");'
    }]
}];
```

**`generated/game-types.d.ts`**：

```typescript
// 由构建工具自动生成，供编辑器提供类型提示
declare class Player {
    health: number;
    takeDamage(amount: number): number;
    update(): void;
    die(): void;
    // ...
}
```

---

## 六、变换类型

### 6.1 Export — 导出内部变量

把闭包内部的变量暴露到 `window.__mixin_exports`。

```javascript
Mixin.export('game.js', 'Player', 'a');
// → window.__mixin_exports["Player"] = a;
```

**用途**：让 mod 代码能访问闭包内的构造函数、对象等。

### 6.2 Overwrite — 覆盖函数

替换目标函数的整个函数体。

```javascript
Mixin.overwrite('game.js', 'takeDamage', function(amount) {
    console.log('damage:', amount);
    return 0;  // 无敌
});
```

**用途**：完全替换函数逻辑（如无敌、修改返回值）。

### 6.3 Inject — 注入代码

在函数体开头或末尾插入代码。

```javascript
Mixin.inject('game.js', 'update', 'head', function() {
    console.log('update called');
});

Mixin.inject('game.js', 'update', 'tail', function() {
    this.health = Math.min(this.health, 100);  // 限制血量上限
});
```

**用途**：添加日志、参数校验、后处理。

### 6.4 Modify — 修改数值（未来扩展）

修改函数中的特定字面量或表达式。

```javascript
Mixin.modify('game.js', 'takeDamage', function(amount) {
    amount = amount * 0.5;  // 伤害减半
});
```

**用途**：修改常量、调整数值平衡。

---

## 七、IIFE 闭包处理

### 7.1 典型结构

```javascript
(function() {
    // ... 内部代码 ...
    // 导出
    window.xxx = ...;
})();
```

### 7.2 注入位置

导出代码和覆盖代码注入到 **IIFE 闭包体底部，但在最后一条语句（导出语句）之前**。

```javascript
(function() {
    // 原始代码
    var a = function() { ... };
    a.prototype.c = function(d) { ... };
    
    // ★ 注入点：插入导出和覆盖代码 ★
    window.__mixin_exports["Player"] = a;
    a.prototype.c = function(amount) { return 0; };  // 覆盖
    
    // 原始导出（不变）
    window.player = new a();
})();
```

### 7.3 非 IIFE 情况

如果代码不是 IIFE 格式，直接在文件末尾追加导出代码。

---

## 八、模块化设计

### 8.1 核心模块（纯 JS，不依赖任何运行时）

```
mixin-system/
├── package.json
├── src/
│   ├── index.ts                  ← 主入口
│   ├── runtime/
│   │   ├── mixinTransformer.ts   ← 运行时 transformer（含 acorn 精简版）
│   │   └── patch-loader.ts       ← Patch 加载器
│   ├── build/
│   │   ├── build.ts              ← 构建脚本（Node.js）
│   │   ├── name-map.ts           ← 映射表处理
│   │   └── type-gen.ts           ← .d.ts 生成
│   └── adapters/
│       ├── layanative.ts         ← LayaNative 适配器
│       ├── node.ts               ← Node.js 适配器
│       └── browser.ts            ← 浏览器适配器
├── runtime/
│   └── mixinTransformer.js       ← 编译后的运行时文件
└── README.md
```

### 8.2 适配器模式

不同运行时只需提供"在 JS 编译前调用 transformer"的钩子：

| 运行时 | 适配器实现 |
|--------|-----------|
| **LayaNative** | 改 `__JSRun::Run()`，在 `v8::Script::Compile()` 前调用 |
| **Node.js** | Hook `Module._compile()` 或 ESM loader hooks |
| **浏览器** | Hook `window.eval()` 或 Service Worker 拦截 fetch |

### 8.3 作为 npm 包使用

```bash
npm install @your-org/mixin-system
```

```javascript
const { MixinSystem } = require('@your-org/mixin-system');

const system = new MixinSystem({
    nameMap: require('./name-map.json'),
    adapter: 'node'  // 或 'layanative' / 'browser'
});

system.loadMarks('./mods/marks/');
system.build();  // 生成 patch_bundle.js
system.apply();  // 注册到运行时
```

---

## 九、版本规划

### v1 — MVP（最小可行版本）

- [x] 改 `__JSRun::Run()` 加 filename 参数 + transformer 钩子
- [x] 改 `JSP_RUN_SCRIPT` 宏传递 filename
- [x] `onThInit()` 注册 transformer
- [x] `mixinTransformer.js` 实现字符串级别的替换（不用 acorn）
- [x] 支持 `Export`（导出内部变量）
- [x] 支持 `Overwrite`（简单字符串替换函数体）
- [x] 支持 `Inject`（在函数体头/尾插入字符串）
- [x] JSON 配置格式

### v2 — AST 变换（已完成，runtime v1.2 + mixinAst）

- [x] 集成 acorn 做 AST 解析（vendor/acorn.js，源码切片式编辑，不重新生成代码）
- [x] 支持嵌套函数/类的精确定位（module/name/call/fn/method/anchor 段，唯一性强制）
- [x] 支持 IIFE 闭包体分析（webpack 模块段 + 回调实参段 + 点分命名空间）
- [x] 支持 `Modify`（子树内表达式/语句精确文本替换，`{find, replace, nth?, all?}`；
      装饰器 `@Modify({find, replace, nth?, all?})`，find 按节点源码精确文本匹配）

### v3 — 构建工具（build-tool/build.js，已实现主体）

- [x] 构建工具 `build.js`（marks 解析 + 构建期预检 + 产物校验）
- [x] 映射表 `name-map.json`（classes/methods/aliases）
- [x] 从可读名自动转换为真实名
- [x] 生成 `patches.js`（原设计名 patch_bundle.js，window.__mixin.register 形态）
- [x] 生成 `game-types.d.ts` 类型声明（name-map 可读类 interface + 方法表 key 提示
      + @Export 汇总 + 引擎 modFs 全局声明；结构提示而非精确类型）
- [x] 用户用可读名写 Mark（`.mark.ts`，纯 ES5 + 装饰器）
- [x] mixins.json 清单（不生成 required 块——哈希校验暂不要求）

### v4 — 模块化发布

- [ ] 发布为 npm 包（package.json/metadata/LICENSE 已备好，`npm pack` 校验通过；
      发布需账号：`npm publish`）
- [x] Node.js 适配器
- [x] 浏览器适配器
- [x] API 稳定化

### v5 — 外部 mod 装载（DESIGN-layout.md 阶段1，已实现）

- [x] `mixins/base-loader/loader.js`：读 `/sdcard/.battlecraft/mods.json`（固定读点，
      launcher 选版本后拷到根）→ 逐 mod 注册 patches → entry 队列（boot 标签处执行）
- [x] mods.json 格式兼容：`["mod-a"]` / `{"mods":[{"id":"mod-a","enabled":true}]}`
      （后者是 pdzzlauncher 实际产出；enabled=false 跳过）
- [x] 双模式存储授权（android-modfs/）：
      - 模式A 旧版存储权限：Android 6-10（+11 legacy），运行时授权后真实路径直读
      - 模式B SAF 文件夹授权：Android 11+，ACTION_OPEN_DOCUMENT_TREE 授权
        .battlecraft 文件夹持久化，读取走 ContentResolver（native modReadFileSync 路由）
      - native：`modFsStatus()` / `modFsEnsure()` / `modReadFileSync(path)` 全局函数
        （gh-repo JSGlobalExportCFun.cpp，JNI → layaair.game.mod.ModFs）
      - Java 辅助类经 android-modfs/build_dex.py 编译为 ModFs.dex，
        APK 组装线合并为 classes3.dex；ModFsActivity 由 apktool 阶段合入 manifest
- [ ] ZIP 形态 mod 目录（当前仅支持解包目录）

---

## 十、与 SpongePowered Mixin 对照

| 特性 | SpongePowered Mixin (Java) | LayaNative Mixin (本方案) |
|------|---------------------------|--------------------------|
| **变换时机** | JVM 类加载时（class transformer） | V8 编译前（source transformer） |
| **变换对象** | Java 字节码（.class） | JavaScript 源码（字符串） |
| **目标定位** | 类名 + 方法名 + 描述符 | AST 路径（支持嵌套） |
| **注入类型** | `@Inject` `@Overwrite` `@ModifyArg` 等 | `export` `overwrite` `inject` `modify` |
| **配置方式** | `@Mixin` 注解 + `mixins.json` | Mark 文件 + 构建工具 |
| **精度** | 字节码指令级 | AST 节点级（acorn） |
| **混淆支持** | 需要映射表 | 需要映射表（name-map.json） |
| **闭包处理** | 不适用 | 注入代码到 IIFE 闭包内 |
| **运行时依赖** | 无（纯编译期） | 运行时需要 transformer（编译前执行） |
| **是否需要改 V8** | 不适用 | **不需要**，只改 LayaNative 封装层 |

---

## 十一、文件清单

### 需要修改的 LayaNative 文件

| 文件 | 修改内容 |
|------|----------|
| `Conch/source/conch/JSWrapper/JSInterface/V8/JSCProxyTLS.h` | `__JSRun::Run()` 加 filename 参数 + transformer 钩子 |
| `Conch/source/conch/JSWrapper/JSInterface/JSInterface.h` | `JSP_RUN_SCRIPT` 宏加 filename 参数 |
| `Conch/source/conch/JCScriptRuntime.cpp` | `onThInit()` 注册 transformer |
| `Conch/source/conch/JSWrapper/JSInterface/V8/JSEnv.h` | 声明静态 persistent handle |

### 新增的 JS 文件（部署到 APK assets）

| 文件 | 内容 |
|------|------|
| `assets/scripts/mixinTransformer.js` | 运行时 transformer（含 acorn 精简版） |
| `assets/scripts/patch_bundle.js` | 构建产物，所有变换描述 |
| `assets/scripts/runtimeInit.js` | 修改版，加载 mixinTransformer + patch_bundle |

### 新增的构建工具文件

| 文件 | 内容 |
|------|------|
| `build-tool/build.js` | 主构建脚本 |
| `build-tool/name-map.js` | 映射表处理 |
| `build-tool/type-gen.js` | .d.ts 生成 |
| `build-tool/patch-bundler.js` | patch_bundle.js 生成 |

### 用户编写的文件

| 文件 | 内容 |
|------|------|
| `mods/marks/*.js` | Mark 文件（用户写的变换描述） |
| `mods/name-map.json` | 映射表（由逆向工具提供） |
| `mods/tsconfig.json` | 引用生成的 .d.ts |
| `mods/generated/game-types.d.ts` | 自动生成，供编辑器使用 |

---

## 十二、关键技术决策

1. **不改 V8**：所有修改在 LayaNative 的封装层 `JSCProxyTLS.h`，V8 源码在 `v8/` 目录不动
2. **acorn 做 AST 变换**：纯 JS 实现，不依赖原生代码，支持全部 ES 语法
3. **IIFE 闭包注入**：注入代码到闭包体底部（最后一个语句之前），与原有代码同作用域
4. **`window.__mixin_exports` 作为接口**：导出的内部变量通过这个全局对象暴露给 mod
5. **构建工具处理映射表**：用户写可读名，构建时转换为混淆名
6. **自动生成 .d.ts**：消除编辑器红色波浪线，提供类型提示