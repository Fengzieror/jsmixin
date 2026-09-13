/*
 * segs/pick.ts — 唯一性裁决（所有段共用）。
 * 候选 0 个 → 报错；多个且未写 index → 报错并列出候选；index 越界 → 报错。
 */
import type { PathSeg, ResolveResult } from '../types.js';
import { describeFn } from '../features.js';

export function pick(candidates: any[], seg: PathSeg, src: string, what: string): ResolveResult {
    const hasIndex = seg.index != null; // index:0 也是显式指向，不能当"没写"（falsy 陷阱）
    const idx = hasIndex ? (seg.index as number) : 0;
    if (candidates.length === 0) return { error: '0 个候选（' + what + '）' };
    if (candidates.length > 1 && !hasIndex) {
        const list = [];
        for (let i = 0; i < Math.min(candidates.length, 8); i++) list.push(describeFn(candidates[i], src));
        return { error: candidates.length + ' 个候选且未写 index（' + what + '）：' + list.join(' | ') };
    }
    if (idx >= candidates.length) return { error: 'index ' + idx + ' 越界，候选 ' + candidates.length + ' 个（' + what + '）' };
    return { node: candidates[idx] };
}
