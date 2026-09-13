/*
 * segs/module.ts — webpack 模块段：Program → 模块函数。
 * 形态：顶层 ({625:function(){...}})[625]() / 链式调用 / 序列表达式，层层剥括号取 member object。
 */
import { isFnNode } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';
import { pick } from './pick.js';

export function resolveModule(ast: any, seg: PathSeg, src: string): ResolveResult {
    const candidates: any[] = [];
    for (let i = 0; i < ast.body.length; i++) {
        const st = ast.body[i];
        const expr = st.type === 'ExpressionStatement' ? st.expression : null;
        if (!expr) continue;
        // 层层剥括号/链式取 member object
        let cur = expr;
        while (cur) {
            let obj: any = null;
            if (cur.type === 'CallExpression' && cur.callee && cur.callee.type === 'MemberExpression') obj = cur.callee.object;
            else if (cur.type === 'MemberExpression') obj = cur.object;
            else if (cur.type === 'SequenceExpression' && cur.expressions) { cur = cur.expressions[cur.expressions.length - 1]; continue; }
            if (!obj) break;
            if (obj.type === 'ObjectExpression') {
                for (let p = 0; p < obj.properties.length; p++) {
                    const prop = obj.properties[p];
                    const kv = prop.key && (prop.key.type === 'Literal' ? prop.key.value : prop.key.name);
                    if (kv == seg.module && isFnNode(prop.value)) candidates.push(prop.value);
                }
                break;
            }
            cur = obj;
        }
    }
    return pick(candidates, seg, src, 'module ' + seg.module);
}
