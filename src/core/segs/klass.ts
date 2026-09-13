/*
 * segs/klass.ts — class 段：原生 ES6 class 绑定定位。
 * 匹配：class 声明（id 名）/ var X = class{...} / 赋值（含点分）/ 命名空间对象属性。
 * 不深入函数与类内部（嵌套的属于下一层）。
 */
import { isFnNode, isClassNode, dottedName } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';
import { pick } from './pick.js';

export function resolveClass(node: any, seg: PathSeg, src: string): ResolveResult {
    const want = seg.class as string;
    const candidates: any[] = [];
    function visit(n: any, prefix: string | null): void {
        if (!n || typeof n !== 'object') return;
        if (Array.isArray(n)) { for (let i = 0; i < n.length; i++) visit(n[i], null); return; }
        if (typeof n.type !== 'string') return;
        // 先匹配当前节点，再剪枝（入口节点本身可能是函数，必须允许下钻）
        if (n.type === 'ClassDeclaration' && n.id && n.id.name === want) candidates.push(n);
        else if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier'
            && n.init && n.init.type === 'ClassExpression' && n.id.name === want) candidates.push(n.init);
        else if (n.type === 'AssignmentExpression' && n.right && n.right.type === 'ClassExpression') {
            if (dottedName(n.left) === want) candidates.push(n.right);
        } else if (n.type === 'ObjectProperty' && n.value && n.value.type === 'ClassExpression' && prefix) {
            const kv = n.key && (n.key.type === 'Literal' ? n.key.value : n.key.name);
            if (prefix + '.' + kv === want) candidates.push(n.value);
        }
        if (n !== node && (isFnNode(n) || isClassNode(n))) return; // 嵌套的函数/类属于下一层，不深入
        let cPrefix: string | null = null;
        if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier'
            && n.init && n.init.type === 'ObjectExpression') cPrefix = n.id.name;
        else if (n.type === 'AssignmentExpression' && n.right && n.right.type === 'ObjectExpression') cPrefix = dottedName(n.left);
        else if (n.type === 'ObjectExpression') cPrefix = prefix;
        for (const k in n) {
            if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
            const v = (n as any)[k];
            if (Array.isArray(v)) { for (let j = 0; j < v.length; j++) visit(v[j], cPrefix); }
            else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v, cPrefix);
        }
    }
    visit(node, null);
    return pick(candidates, seg, src, 'class ' + want);
}
