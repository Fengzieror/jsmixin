/*
 * mixinTransformer.js — LayaNative mixin 引擎 v0（阶段0：字符串级变换）
 *
 * 由 C++（JCScriptRuntime::onThInit）在 runtimeInit.js 之后、apploader.js 之前
 * 通过 JSP_RUN_SCRIPT 执行。职责：
 *   1. 建立 window.__mixin.register(mod) 注册接口（mod 描述见 mixins/*.js）
 *   2. 提供 window.__mixinTransform(filename, source) → string（C++ __JSRun::Run 兜底调用）
 *   3. 包装 window.eval：apploader.js 对所有游戏脚本（base64/vendor/wx/main.min.js）
 *      都是 downloadfile + window.eval(text)，这里是游戏脚本的唯一拦截点。
 *
 * 本文件必须保持 ES5 兼容写法（虽然 V8 13 支持 ES6，保持约束以防回归）。
 */
(function (global) {
    'use strict';

    var VERSION = '0.3.0';
    var mods = []; // 已注册的 mod 描述列表

    function log(msg) {
        try { console.log('[mixin] ' + msg); } catch (e) { /* ignore */ }
    }

    function baseName(f) {
        if (!f) return '';
        var i = f.lastIndexOf('/');
        if (i < 0) i = f.lastIndexOf('\\');
        var b = i < 0 ? f : f.slice(i + 1);
        // 剥离 ?ver=123 / #hash 之类的后缀
        var q = b.search(/[?#]/);
        if (q >= 0) b = b.slice(0, q);
        return b;
    }

    function fileMatches(pattern, base, full) {
        if (!pattern) return false;
        return base === pattern || full === pattern;
    }

    /*
     * FNV-1a 32 位 + 长度：结构寻址（fn 序号等）的版本锁。
     * 文件任何字节变化都会改变哈希 → mixin 整体跳过，杜绝序号指错。
     * 哈希针对"本轮变换的输入"；eval 传入文本尾部的 //@ sourceURL=...
     * 参与运行但不属于文件本体，先剥离再算。
     */
    function sourceHash(s) {
        var tail = s.match(/\s*\/\/@ sourceURL=[^\n]*\s*$/);
        var code = tail ? s.slice(0, tail.index) : s;
        var h = 0x811c9dc5;
        for (var i = 0; i < code.length; i++) {
            h ^= code.charCodeAt(i);
            h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
        }
        return 'fnv1a32:' + h.toString(16) + ':len:' + code.length;
    }

    /*
     * 对一段源码应用一个 mod 的全部变换。支持：
     *   replaces: [[from, to], ...] 纯字符串替换（全部出现处）
     *   patches:  [{ path, op, code, ... }] AST 锚点精确定位（需 __mixinAst + acorn）
     *   hash:     可选版本锁，不符则该 mixin 整体跳过（结构寻址必配）
     * 先跑 replaces（便宜），有 patches 再解析一次 AST（昂贵，仅按需）。
     * 未做任何修改时返回原字符串（引用相等），供上层判断。
     */
    function applyMod(mx, source, filename) {
        var out = source;
        if (mx.hash) {
            var actual = sourceHash(source);
            if (actual !== mx.hash) {
                log('WARN: ' + (mx.file || '?') + ' 哈希不符（期望 ' + mx.hash + '，实际 ' + actual + '），跳过该 mixin（fail-safe）');
                return source;
            }
        }
        var i, from, to, n;
        if (mx.replaces) {
            for (i = 0; i < mx.replaces.length; i++) {
                from = mx.replaces[i][0];
                to = mx.replaces[i][1];
                n = out.split(from).length - 1;
                if (n === 0) {
                    log('WARN: ' + (mx.file || '?') + ' 中找不到替换目标 "' + from + '"（可能游戏版本不符）');
                    continue;
                }
                out = out.split(from).join(to);
                log('replace "' + from + '" x' + n + ' in ' + filename);
            }
        }
        if (mx.patches && mx.patches.length) {
            if (global.__mixinAst) {
                var patched = global.__mixinAst.applyAstPatches(filename, out, mx.patches);
                if (patched !== out) out = patched;
            } else {
                log('WARN: __mixinAst 未加载，跳过 ' + (mx.file || '?') + ' 的 ' + mx.patches.length + ' 个 AST patch');
            }
        }
        return out;
    }

    function transform(filename, source) {
        if (typeof source !== 'string' || source.length === 0) return source;
        var base = baseName(filename);
        for (var mi = 0; mi < mods.length; mi++) {
            var mod = mods[mi];
            var mixins = mod.mixins || [];
            for (var i = 0; i < mixins.length; i++) {
                var mx = mixins[i];
                if (!fileMatches(mx.file, base, filename)) continue;
                var out = applyMod(mx, source, filename);
                if (out !== source) {
                    log('patched: ' + filename + ' (by ' + (mod.modid || '?') + ')');
                    source = out;
                }
            }
        }
        return source;
    }

    /*
     * C++ __JSRun::Run 编译前调用点。约定：始终返回字符串（可能未修改）。
     */
    global.__mixinTransform = function (filename, source) {
        try {
            return transform(filename || '(unknown)', source);
        } catch (e) {
            log('transform error on ' + filename + ': ' + e);
            return source;
        }
    };

    /*
     * 包装 window.eval。apploader.js 的 Document._downloadOk 用
     * window.eval(t._stext) 执行每个游戏脚本，文本末尾带 "//@ sourceURL=<src>"。
     */
    function installEvalHook() {
        if (global.__mixinEvalHooked) return;
        var origEval = global.eval;
        if (typeof origEval !== 'function') {
            log('WARN: eval 不可用，eval 钩子未安装');
            return;
        }
        global.eval = function (src) {
            if (typeof src === 'string' && src.length > 64) {
                var m = /\/\/@ sourceURL=(.+?)\s*$/.exec(src);
                try {
                    src = transform(m ? m[1] : '(inline-eval)', src);
                } catch (e) {
                    log('eval transform error: ' + e);
                }
            }
            return origEval(src);
        };
        global.__mixinEvalHooked = true;
        log('eval hook installed (v' + VERSION + ')');
    }

    global.__mixin = {
        version: VERSION,
        register: function (mod) {
            if (!mod || typeof mod !== 'object') return;
            mods.push(mod);
            log('registered mod "' + (mod.modid || '?') + '" v' + (mod.version || '?')
                + ' with ' + ((mod.mixins || []).length) + ' mixin(s)');
        },
        stats: function () {
            return { mods: mods.length, evalHooked: !!global.__mixinEvalHooked };
        },
        // 供补丁作者/测试计算期望哈希：__mixin.sourceHash(source) → 'fnv1a32:xxxx:len:nnn'
        sourceHash: sourceHash
    };

    installEvalHook();
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
