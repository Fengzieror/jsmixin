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

    var VERSION = '0.6.0'; // 0.6.0: 批量快路径（多 mod 同文件合并一次解析，黑屏优化；链式/replaces 自动回退串行）
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
     * 字符串级替换（一个 mixin 的 replaces）。
     */
    function applyReplaces(mx, source, filename) {
        var out = source;
        if (!mx.replaces) return out;
        for (var i = 0; i < mx.replaces.length; i++) {
            var from = mx.replaces[i][0];
            var to = mx.replaces[i][1];
            var n = out.split(from).length - 1;
            if (n === 0) {
                log('WARN: ' + (mx.file || '?') + ' 中找不到替换目标 "' + from + '"（可能游戏版本不符）');
                continue;
            }
            out = out.split(from).join(to);
            log('replace "' + from + '" x' + n + ' in ' + filename);
        }
        return out;
    }

    /*
     * 串行 mixin 管线（对齐 SpongePowered Mixin 语义）：
     *   - mod 按 priority 升序应用（小者先，Sponge mixins.json 约定；缺省 1000，
     *     同级按注册顺序，V8 sort 稳定）
     *   - 每个 mixin 依次处理：哈希锁（针对"本轮轮到它时的输入"）→ replaces →
     *     AST patches（单 mixin 内一次解析一次应用，自身 patch 互不干扰）
     *   - 后应用的 mixin 解析的是前面 mixin 改过的文本 —— 可以定位/继续修改
     *     前面 mixin 注入的代码（链式修改）；重名会因唯一性强制报错，因此
     *     注入名请像 Java 类名一样起唯一的名字
     *   - 稳定寻址靠名字链（含点分命名空间）而非裸序号；{fn:n}/index 仅作最后手段
     *
     * 批量快路径（黑屏优化，v0.6.0）：acorn 全量解析大文件约 1.5-4 秒/次，
     * 逐 mod 串行 = 黑屏随 mod 数线性增长。当同文件的各 mixin 都只有 AST
     * patches（无 replaces、无哈希锁）时，把所有 patch 合并对【原始文件】一次
     * 解析定位并整体应用；仅当有 patch 未生效（可能链式定位了前一个 mod 注入
     * 的代码，或锚点真的不符）时，回退到本函数的逐 mixin 串行管线——语义与
     * 旧版完全一致，最坏只多一次解析。
     */
    function transformSerial(filename, source) {
        var base = baseName(filename);
        var ordered = mods.slice().sort(function (a, b) {
            var pa = a.priority == null ? 1000 : a.priority;
            var pb = b.priority == null ? 1000 : b.priority;
            return pa - pb;
        });
        for (var mi = 0; mi < ordered.length; mi++) {
            var mod = ordered[mi];
            var mixins = mod.mixins || [];
            for (var i = 0; i < mixins.length; i++) {
                var mx = mixins[i];
                if (!fileMatches(mx.file, base, filename)) continue;
                if (mx.hash) {
                    var actual = sourceHash(source);
                    if (actual !== mx.hash) {
                        log('WARN: ' + (mx.file || '?') + ' 哈希不符（期望 ' + mx.hash + '，实际 ' + actual + '），跳过 mod "' + (mod.modid || '?') + '"（fail-safe）');
                        continue;
                    }
                }
                var out = source;
                if (mx.replaces) out = applyReplaces(mx, out, filename);
                if (mx.patches && mx.patches.length) {
                    if (global.__mixinAst) {
                        var patched = global.__mixinAst.applyAstPatches(filename, out, mx.patches);
                        if (patched !== out) out = patched;
                    } else {
                        log('WARN: __mixinAst 未加载，跳过 ' + mx.patches.length + ' 个 AST patch');
                    }
                }
                if (out !== source) {
                    log('patched: ' + filename + ' (by ' + (mod.modid || '?') + ')');
                    source = out;
                }
            }
        }
        return source;
    }

    function matchingMixins(filename) {
        var base = baseName(filename);
        var ordered = mods.slice().sort(function (a, b) {
            var pa = a.priority == null ? 1000 : a.priority;
            var pb = b.priority == null ? 1000 : b.priority;
            return pa - pb;
        });
        var out = [];
        for (var mi = 0; mi < ordered.length; mi++) {
            var mixins = ordered[mi].mixins || [];
            for (var i = 0; i < mixins.length; i++) {
                if (fileMatches(mixins[i].file, base, filename)) {
                    out.push({ mod: ordered[mi], mx: mixins[i] });
                }
            }
        }
        return out;
    }

    function transform(filename, source) {
        if (typeof source !== 'string' || source.length === 0) return source;
        var matched = matchingMixins(filename);
        if (matched.length <= 1 || !global.__mixinAst) return transformSerial(filename, source);

        // 批量快路径：任一 mixin 带 replaces / 哈希锁（语义绑定"本轮中间态"）→ 直接串行
        var batch = [];
        for (var i = 0; i < matched.length; i++) {
            var mx = matched[i].mx;
            if (mx.replaces || mx.hash) return transformSerial(filename, source);
            batch = batch.concat(mx.patches || []);
        }
        if (!batch.length) return source;
        var stats = {};
        var out = global.__mixinAst.applyAstPatches(filename, source, batch, stats);
        if (stats.skipped && stats.skipped.length) {
            log('批量快路径有 ' + stats.skipped.length + ' 个 patch 未生效，回退串行管线: ' + filename);
            return transformSerial(filename, source);
        }
        if (out !== source) log('patched (batch): ' + filename + ' (' + matched.length + ' 个 mixin 合并一次解析)');
        return out;
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
            var mixins = mod.mixins || [];
            for (var i = 0; i < mixins.length; i++) mixins[i]._modid = mod.modid || '?';
            mods.push(mod);
            log('registered mod "' + (mod.modid || '?') + '" v' + (mod.version || '?')
                + ' with ' + mixins.length + ' mixin(s)');
        },
        stats: function () {
            return { mods: mods.length, evalHooked: !!global.__mixinEvalHooked };
        },
        // 供补丁作者/测试计算期望哈希：__mixin.sourceHash(source) → 'fnv1a32:xxxx:len:nnn'
        sourceHash: sourceHash
    };

    installEvalHook();
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
