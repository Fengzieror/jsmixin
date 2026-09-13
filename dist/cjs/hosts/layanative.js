"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installAstGlobals = installAstGlobals;
exports.installTransformerGlobals = installTransformerGlobals;
/*
 * hosts/layanative.ts — LayaNative 宿主全局契约（v1 兼容层）。
 *
 * 两个 compat 入口（src/compat/*.ts）经 esbuild 打包成 runtime/mixinAst.js 与
 * runtime/mixinTransformer.js——这正是 tools/build_mixin_apk.py 拼接 bundle 用的
 * 两个路径，C++ 侧与既有 mod 零改动。
 *
 * 全局契约（v1 逐项保留）：
 *   __mixinAst.version / applyAstPatches / _internals
 *   __mixin.version / register / stats / sourceHash
 *   __mixinTransform(filename, source) → string（C++ __JSRun::Run 编译前调用点）
 *   window.eval 包装（游戏脚本经 apploader 的 window.eval 执行，唯一纯 JS 拦截点）
 */
const ast_js_1 = require("../core/ast.js");
const engine_js_1 = require("../core/engine.js");
function installAstGlobals(g = globalThis) {
    g.__mixinAst = {
        version: ast_js_1.VERSION,
        applyAstPatches: ast_js_1.applyAstPatches,
        _internals: ast_js_1.internals
    };
}
function installTransformerGlobals(g = globalThis) {
    // acorn 由 vendor/acorn.js 先行加载到 global（组装线顺序：acorn.js → mixinAst.js → mixinTransformer.js）
    const engine = (0, engine_js_1.createMixinEngine)({ acorn: g.acorn });
    function log(msg) {
        try {
            console.log('[mixin] ' + msg);
        }
        catch (e) { /* ignore */ }
    }
    g.__mixin = {
        version: engine_js_1.VERSION,
        register: function (mod) { engine.register(mod); },
        stats: function () {
            return { mods: engine.stats().mods, evalHooked: !!g.__mixinEvalHooked };
        },
        // 供补丁作者/测试计算期望哈希：__mixin.sourceHash(source) → 'fnv1a32:xxxx:len:nnn'
        sourceHash: engine.sourceHash
    };
    // C++ __JSRun::Run 编译前调用点。约定：始终返回字符串（可能未修改）。
    g.__mixinTransform = function (filename, source) {
        try {
            return engine.transformFile(filename || '(unknown)', source);
        }
        catch (e) {
            log('transform error on ' + filename + ': ' + e);
            return source;
        }
    };
    /*
     * 包装 eval。LayaNative 的 apploader.js 对所有游戏脚本（base64/vendor/wx/main.min.js）
     * 都是 downloadfile + window.eval(text)，文本末尾带 "//@ sourceURL=<src>"。
     * 这是游戏脚本在纯 JS 层面的唯一拦截点（引擎自身的脚本走 C++ 拦截点，见 BOOT-CHAIN.md）。
     */
    function installEvalHook() {
        if (g.__mixinEvalHooked)
            return;
        const origEval = g.eval;
        if (typeof origEval !== 'function') {
            log('WARN: eval 不可用，eval 钩子未安装');
            return;
        }
        g.eval = function (src) {
            if (typeof src === 'string' && src.length > 64) {
                const m = /\/\/@ sourceURL=(.+?)\s*$/.exec(src);
                try {
                    src = g.__mixinTransform(m ? m[1] : '(inline-eval)', src);
                }
                catch (e) {
                    log('eval transform error: ' + e);
                }
            }
            return origEval(src);
        };
        g.__mixinEvalHooked = true;
        log('eval hook installed (v' + engine_js_1.VERSION + ')');
    }
    installEvalHook();
    return engine;
}
