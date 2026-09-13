/*
 * segs/fnIndex.ts — 纯结构序号段：当前节点的第 n 个直接子函数（AST 源码顺序，确定性）。
 * 零特征寻址的基础段：不使用名字、不使用内容特征。最后手段。
 */
import { directChildFns } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';

export function resolveFnIndex(node: any, seg: PathSeg, src: string): ResolveResult {
    const kids = directChildFns(node);
    const n = seg.fn as number;
    if (typeof n !== 'number' || n < 0) return { error: 'fn 必须是非负数字序号' };
    if (n >= kids.length) return { error: 'fn ' + n + ' 越界：该层直接子函数共 ' + kids.length + ' 个' };
    return { node: kids[n].fn, asName: kids[n].asName };
}
