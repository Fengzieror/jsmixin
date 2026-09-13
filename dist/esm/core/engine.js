/*
 * engine.ts — mixin 变换引擎（mixinTransformer.js v0.6.0 的 TypeScript 移植）
 *
 * 与宿主解耦：引擎只负责"注册 mod → 对 (filename, source) 产出变换后的 source"。
 * 宿主适配（eval 包装 / require hook / C++ 编译前回调 / mod 装载）见 src/hosts/。
 *
 * 管线语义（对齐 SpongePowered Mixin）：
 *   - mod 按 priority 升序应用（小者先，Sponge mixins.json 约定；缺省 1000，
 *     同级按注册顺序，V8 sort 稳定）
 *   - 每个 mixin 依次处理：哈希锁（针对"本轮轮到它时的输入"）→ replaces →
 *     AST patches（单 mixin 内一次解析一次应用，自身 patch 互不干扰）
 *   - 后应用的 mixin 解析的是前面 mixin 改过的文本 —— 可以定位/继续修改
 *     前面 mixin 注入的代码（链式修改）；重名会因唯一性强制报错，因此
 *     注入名请像 Java 类名一样起唯一的名字
 *   - 稳定寻址靠名字链（含点分命名空间）而非裸序号；{fn:n}/index 仅作最后手段
 *
 * 批量快路径（黑屏优化）：acorn 全量解析大文件约 1.5-4 秒/次，逐 mod 串行 =
 * 黑屏随 mod 数线性增长。当同文件的各 mixin 都只有 AST patches（无 replaces、
 * 无哈希锁）时，把所有 patch 合并对【原始文件】一次解析定位并整体应用；仅当
 * 有 patch 未生效（可能链式定位了前一个 mod 注入的代码，或锚点真的不符）时，
 * 回退到串行管线——语义与串行版完全一致，最坏只多一次解析。
 */
import { applyAstPatches, setAcorn, VERSION as AST_VERSION } from './ast.js';
export const VERSION = '2.0.0';
function defaultLog(msg) {
    try {
        console.log('[mixin] ' + msg);
    }
    catch (e) { /* ignore */ }
}
function baseName(f) {
    if (!f)
        return '';
    let i = f.lastIndexOf('/');
    if (i < 0)
        i = f.lastIndexOf('\\');
    let b = i < 0 ? f : f.slice(i + 1);
    // 剥离 ?ver=123 / #hash 之类的后缀
    const q = b.search(/[?#]/);
    if (q >= 0)
        b = b.slice(0, q);
    return b;
}
function fileMatches(pattern, base, full) {
    if (!pattern)
        return false;
    return base === pattern || full === pattern;
}
/*
 * FNV-1a 32 位 + 长度：结构寻址（fn 序号等）的版本锁。
 * 文件任何字节变化都会改变哈希 → mixin 整体跳过，杜绝序号指错。
 * 哈希针对"本轮变换的输入"；eval 传入文本尾部的 //@ sourceURL=...
 * 参与运行但不属于文件本体，先剥离再算。
 */
export function sourceHash(s) {
    const tail = s.match(/\s*\/\/@ sourceURL=[^\n]*\s*$/);
    const code = tail ? s.slice(0, tail.index) : s;
    let h = 0x811c9dc5;
    for (let i = 0; i < code.length; i++) {
        h ^= code.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return 'fnv1a32:' + h.toString(16) + ':len:' + code.length;
}
/*
 * 字符串级替换（一个 mixin 的 replaces）。
 */
function applyReplaces(mx, source, filename, log) {
    let out = source;
    if (!mx.replaces)
        return out;
    for (let i = 0; i < mx.replaces.length; i++) {
        const from = mx.replaces[i][0];
        const to = mx.replaces[i][1];
        const n = out.split(from).length - 1;
        if (n === 0) {
            log('WARN: ' + (mx.file || '?') + ' 中找不到替换目标 "' + from + '"（可能游戏版本不符）');
            continue;
        }
        out = out.split(from).join(to);
        log('replace "' + from + '" x' + n + ' in ' + filename);
    }
    return out;
}
function byPriority(a, b) {
    const pa = a.priority == null ? 1000 : a.priority;
    const pb = b.priority == null ? 1000 : b.priority;
    return pa - pb;
}
export function createMixinEngine(options) {
    const log = (options && options.log) || defaultLog;
    if (options && options.acorn)
        setAcorn(options.acorn);
    const mods = []; // 已注册的 mod 描述列表
    function transformSerial(filename, source) {
        const base = baseName(filename);
        const ordered = mods.slice().sort(byPriority);
        for (let mi = 0; mi < ordered.length; mi++) {
            const mod = ordered[mi];
            const mixins = mod.mixins || [];
            for (let i = 0; i < mixins.length; i++) {
                const mx = mixins[i];
                if (!fileMatches(mx.file, base, filename))
                    continue;
                if (mx.hash) {
                    const actual = sourceHash(source);
                    if (actual !== mx.hash) {
                        log('WARN: ' + (mx.file || '?') + ' 哈希不符（期望 ' + mx.hash + '，实际 ' + actual + '），跳过 mod "' + (mod.modid || '?') + '"（fail-safe）');
                        continue;
                    }
                }
                let out = source;
                if (mx.replaces)
                    out = applyReplaces(mx, out, filename, log);
                if (mx.patches && mx.patches.length) {
                    const patched = applyAstPatches(filename, out, mx.patches);
                    if (patched !== out)
                        out = patched;
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
        const base = baseName(filename);
        const ordered = mods.slice().sort(byPriority);
        const out = [];
        for (let mi = 0; mi < ordered.length; mi++) {
            const mixins = ordered[mi].mixins || [];
            for (let i = 0; i < mixins.length; i++) {
                if (fileMatches(mixins[i].file, base, filename)) {
                    out.push({ mod: ordered[mi], mx: mixins[i] });
                }
            }
        }
        return out;
    }
    function transform(filename, source) {
        if (typeof source !== 'string' || source.length === 0)
            return source;
        const matched = matchingMixins(filename);
        if (matched.length <= 1)
            return transformSerial(filename, source);
        // 批量快路径：任一 mixin 带 replaces / 哈希锁（语义绑定"本轮中间态"）→ 直接串行
        let batch = [];
        for (let i = 0; i < matched.length; i++) {
            const mx = matched[i].mx;
            if (mx.replaces || mx.hash)
                return transformSerial(filename, source);
            batch = batch.concat(mx.patches || []);
        }
        if (!batch.length)
            return source;
        const stats = { applied: 0, skipped: [] };
        const out = applyAstPatches(filename, source, batch, stats);
        if (stats.skipped.length) {
            log('批量快路径有 ' + stats.skipped.length + ' 个 patch 未生效，回退串行管线: ' + filename);
            return transformSerial(filename, source);
        }
        if (out !== source)
            log('patched (batch): ' + filename + ' (' + matched.length + ' 个 mixin 合并一次解析)');
        return out;
    }
    return {
        register: function (mod) {
            if (!mod || typeof mod !== 'object')
                return;
            const mixins = mod.mixins || [];
            for (let i = 0; i < mixins.length; i++)
                mixins[i]._modid = mod.modid || '?';
            mods.push(mod);
            log('registered mod "' + (mod.modid || '?') + '" v' + (mod.version || '?')
                + ' with ' + mixins.length + ' mixin(s)');
        },
        transformFile: function (filename, source) {
            try {
                return transform(filename || '(unknown)', source);
            }
            catch (e) {
                log('transform error on ' + filename + ': ' + e);
                return source;
            }
        },
        reset: function () { mods.length = 0; },
        sourceHash: sourceHash,
        stats: function () { return { mods: mods.length, version: VERSION }; },
        version: VERSION
    };
}
export { AST_VERSION };
