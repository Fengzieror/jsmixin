/*
 * segs/pick.ts — 唯一性裁决（所有段共用）。
 * 候选 0 个 → 报错；多个且未写 index → 报错并列出候选；index 越界/非法 → 报错。
 * 返回选中序号（供调用方带出绑定名等附加信息，如 resolveName → method 段 cls 推断）。
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
    // 显式 index 必须是落在候选范围内的整数；负数此前会取 candidates[-1] = undefined，
    // 错误延迟到 applyOp 才以误导性的 TypeError 暴露（#14）
    if (!Number.isInteger(idx) || idx < 0 || idx >= candidates.length) {
        return { error: 'index ' + idx + ' 越界/非法，候选 ' + candidates.length + ' 个（' + what + '）' };
    }
    return { node: candidates[idx], index: idx };
}
