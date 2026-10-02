/*
 * segs/name.ts — 具名段：{name:'XS'} 单名（匹配绑定名或函数自身 id）；
 * {name:'V.showToast'} 点分命名空间（只匹配绑定名的完整点分路径）。
 * 依赖 directChildFns 的绑定名规则（含 v2 的 MethodDefinition key 绑定，原生 class 方法可直达）。
 * 命中的绑定名随 ResolveResult.asName 带出，供后续 method 段做 cls 推断（#6）。
 */
import { directChildFns } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';
import { pick } from './pick.js';

export function resolveName(node: any, seg: PathSeg, src: string): ResolveResult {
    const kids = directChildFns(node);
    const wantDot = (seg.name as string).indexOf('.') >= 0;
    const matched: { fn: any; asName: string | null }[] = [];
    for (let i = 0; i < kids.length; i++) {
        const k = kids[i];
        if (wantDot ? (k.asName === seg.name) : (k.asName === seg.name || k.idName === seg.name)) {
            matched.push({ fn: k.fn, asName: k.asName });
        }
    }
    const r = pick(matched.map(function (m) { return m.fn; }), seg, src, 'name ' + seg.name);
    if (r.error) return r;
    const chosen = matched[r.index || 0];
    return { node: chosen.fn, asName: chosen.asName };
}
