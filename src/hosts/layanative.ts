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
import { applyAstPatches, internals, VERSION as AST_VERSION } from '../core/ast.js';
import { createMixinEngine, VERSION as ENGINE_VERSION } from '../core/engine.js';
import type { ModDescription } from '../core/types.js';

type G = any;

export function installAstGlobals(g: G = globalThis): void {
    g.__mixinAst = {
        version: AST_VERSION,
        applyAstPatches: applyAstPatches,
        _internals: internals
    };
}

export function installTransformerGlobals(g: G = globalThis): void {
    // acorn 由 vendor/acorn.js 先行加载到 global（组装线顺序：acorn.js → mixinAst.js → mixinTransformer.js）
    const engine = createMixinEngine({ acorn: g.acorn });

    function log(msg: string): void {
        try { console.log('[mixin] ' + msg); } catch (e) { /* ignore */ }
    }

    g.__mixin = {
        version: ENGINE_VERSION,
        register: function (mod: ModDescription): void { engine.register(mod); },
        stats: function (): { mods: number; evalHooked: boolean } {
            return { mods: engine.stats().mods, evalHooked: !!g.__mixinEvalHooked };
        },
        // 供补丁作者/测试计算期望哈希：__mixin.sourceHash(source) → 'fnv1a32:xxxx:len:nnn'
        sourceHash: engine.sourceHash
    };

    // C++ __JSRun::Run 编译前调用点。约定：始终返回字符串（可能未修改）。
    g.__mixinTransform = function (filename: string, source: string): string {
        try {
            return engine.transformFile(filename || '(unknown)', source);
        } catch (e: any) {
            log('transform error on ' + filename + ': ' + e);
            return source;
        }
    };

    /*
     * 包装 eval。LayaNative 的 apploader.js 对所有游戏脚本（base64/vendor/wx/main.min.js）
     * 都是 downloadfile + window.eval(text)，文本末尾带 "//@ sourceURL=<src>"。
     * 这是游戏脚本在纯 JS 层面的唯一拦截点（引擎自身的脚本走 C++ 拦截点，见 BOOT-CHAIN.md）。
     */
    function installEvalHook(): void {
        if (g.__mixinEvalHooked) return;
        const origEval = g.eval;
        if (typeof origEval !== 'function') {
            log('WARN: eval 不可用，eval 钩子未安装');
            return;
        }
        g.eval = function (src: string): any {
            if (typeof src === 'string' && src.length > 64) {
                const m = /\/\/@ sourceURL=(.+?)\s*$/.exec(src);
                try {
                    src = g.__mixinTransform(m ? m[1] : '(inline-eval)', src);
                } catch (e: any) {
                    log('eval transform error: ' + e);
                }
            }
            return origEval(src);
        };
        g.__mixinEvalHooked = true;
        log('eval hook installed (v' + ENGINE_VERSION + ')');
    }

    installEvalHook();
}
