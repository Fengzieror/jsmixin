/*
 * segs/method.ts — 方法段，两种目标形态：
 *  1. 原生 ES6 class：当前节点是 ClassDeclaration/ClassExpression → 搜 ClassBody 的
 *     MethodDefinition（含 get/set/constructor/static；同名 → index 消歧）。
 *  2. babel 方法表：X(ClassName, [{key:"...", value:function(){...}}]) 形态（v1 兼容）。
 *     访问器条目 {key,get/set:fn} 同样支持；静态方法表是三参调用 X(Cls, null, [...])。
 *     在当前节点整个子树里扫描；若给了 cls（或上一段解析出了绑定名）则校验第一参。
 * 方法表命中的类名随 ResolveResult.asName 带出，供更上层继续推断（#6）。
 */
import { isClassNode, isFnNode, hasBlockBody, walkAll } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';
import { pick } from './pick.js';

function classMethodCandidates(clsNode: any, method: string): { fn: any; cls: string | null }[] {
    const candidates: { fn: any; cls: string | null }[] = [];
    const body = clsNode.body && clsNode.body.body ? clsNode.body.body : [];
    for (let i = 0; i < body.length; i++) {
        const md = body[i];
        if (!md || md.type !== 'MethodDefinition' || md.computed) continue;
        const kv = md.key && (md.key.type === 'Identifier' ? md.key.name : (md.key.type === 'Literal' ? md.key.value : null));
        if (kv === method && isFnNode(md.value) && hasBlockBody(md.value)) candidates.push({ fn: md.value, cls: null });
    }
    return candidates;
}

function methodTableCandidates(node: any, clsName: string | null, method: string): { fn: any; cls: string | null }[] {
    const candidates: { fn: any; cls: string | null }[] = [];
    walkAll(node, function (n: any): void {
        if (n.type !== 'CallExpression') return;
        const args = n.arguments;
        if (!args || (args.length !== 2 && args.length !== 3)) return;
        if (!args[0] || args[0].type !== 'Identifier') return;
        if (clsName && args[0].name !== clsName) return;
        let table: any = null;
        if (args.length === 2 && args[1] && args[1].type === 'ArrayExpression') table = args[1];
        else if (args.length === 3 && args[1] && args[1].type === 'Literal' && args[1].value === null
            && args[2] && args[2].type === 'ArrayExpression') table = args[2];
        if (!table) return;
        const props = table.elements;
        for (let i = 0; i < props.length; i++) {
            // 元素形如 { key: "createChildren", value: function(){...} }
            const el = props[i];
            if (!el || el.type !== 'ObjectExpression') continue;
            let keyVal: any, valNode: any;
            for (let j = 0; j < el.properties.length; j++) {
                const pp = el.properties[j];
                if (pp.type !== 'Property' && pp.type !== 'ObjectProperty') continue;
                const pn = pp.key && (pp.key.name || pp.key.value);
                if (pn === 'key') keyVal = pp.value && (pp.value.type === 'Literal' ? pp.value.value : pp.value.name);
                else if (pn === 'value' || pn === 'get' || pn === 'set') valNode = pp.value;
            }
            if (keyVal === method && isFnNode(valNode) && hasBlockBody(valNode)) candidates.push({ fn: valNode, cls: args[0].name });
        }
    });
    return candidates;
}

function pickFrom(candidates: { fn: any; cls: string | null }[], seg: PathSeg, src: string, what: string): ResolveResult {
    const r = pick(candidates.map(function (c) { return c.fn; }), seg, src, what);
    if (r.error) return r;
    const chosen = candidates[r.index || 0];
    return { node: chosen.fn, asName: chosen.cls };
}

export function resolveMethod(node: any, seg: PathSeg, src: string, prevAsName: string | null): ResolveResult {
    const method = seg.method as string;
    if (isClassNode(node)) {
        return pickFrom(classMethodCandidates(node, method), seg, src, 'method ' + method + ' of class');
    }
    const clsName = seg.cls || prevAsName || null;
    return pickFrom(methodTableCandidates(node, clsName, method), seg, src, 'method ' + method + (clsName ? ' of ' + clsName : ''));
}

// 上一层回退供 resolvePath 使用：非 IIFE 包装的类，方法表调用是类绑定语句的兄弟
export function resolveMethodAt(node: any, seg: PathSeg, src: string, prevAsName: string | null): ResolveResult {
    const method = seg.method as string;
    const clsName = seg.cls || prevAsName || null;
    return pickFrom(methodTableCandidates(node, clsName, method), seg, src, 'method ' + method + (clsName ? ' of ' + clsName : ''));
}
