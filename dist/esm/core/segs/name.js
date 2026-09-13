/*
 * segs/name.ts — 具名段：{name:'XS'} 单名（匹配绑定名或函数自身 id）；
 * {name:'V.showToast'} 点分命名空间（只匹配绑定名的完整点分路径）。
 * 依赖 directChildFns 的绑定名规则（含 v2 的 MethodDefinition key 绑定，原生 class 方法可直达）。
 */
import { directChildFns } from '../features.js';
import { pick } from './pick.js';
export function resolveName(node, seg, src) {
    const kids = directChildFns(node);
    const wantDot = seg.name.indexOf('.') >= 0;
    const candidates = [];
    for (let i = 0; i < kids.length; i++) {
        const k = kids[i];
        if (wantDot ? (k.asName === seg.name) : (k.asName === seg.name || k.idName === seg.name)) {
            candidates.push(k.fn);
        }
    }
    return pick(candidates, seg, src, 'name ' + seg.name);
}
