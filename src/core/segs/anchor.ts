/*
 * segs/anchor.ts — 内容锚点段：strings/calls/params 特征 AND 匹配直接子函数。
 * "字符串是唯一压缩幸存者"——锚点是混淆代码定位的主力。
 */
import { directChildFns, matchAnchor } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';
import { pick } from './pick.js';

export function resolveAnchor(node: any, seg: PathSeg, src: string): ResolveResult {
    const kids = directChildFns(node);
    const candidates: any[] = [];
    for (let i = 0; i < kids.length; i++) {
        if (matchAnchor(kids[i].fn, seg.anchor)) candidates.push(kids[i].fn);
    }
    return pick(candidates, seg, src, 'anchor ' + JSON.stringify(seg.anchor));
}
