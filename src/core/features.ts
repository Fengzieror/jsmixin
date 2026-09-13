/*
 * features.ts — AST 遍历与特征提取（mixinAst v1 忠实移植 + ES6 class 扩展）
 *
 * 两个遍历：
 *   - directChildFns：只收集"最近外层函数为本节点的函数"（不深入子函数内部）。
 *     名字解析规则：FunctionDeclaration/具名函数表达式 → idName；var X = fn / X = fn /
 *     a.b.c = fn → asName 绑定名；var V = { m: fn } / V.m = { sub: fn } → 'V.m' 命名空间。
 *     IIFE 类工厂（babel ES5 输出）：var X = (function(t){...})(Base) → callee 拿到 asName='X'。
 *     v2 扩展：MethodDefinition（原生 class 方法/getter/setter/constructor）按 key 名绑定。
 *   - walkAll：整个子树（含嵌套函数内部），用于锚点/方法表/调用点扫描。
 */
import type { Anchor } from './types.js';

export function isFnNode(n: any): boolean {
    return !!n && (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');
}

export function isClassNode(n: any): boolean {
    return !!n && (n.type === 'ClassDeclaration' || n.type === 'ClassExpression');
}

export function hasBlockBody(fn: any): boolean {
    return fn.body && fn.body.type === 'BlockStatement';
}

export function logable(msg: string): void {
    try { console.log('[mixin-ast] ' + msg); } catch (e) { /* ignore */ }
}

// 成员表达式 → 点分名 'a.b.c'（仅 Identifier 链），否则 null
export function dottedName(n: any): string | null {
    const parts: string[] = [];
    while (n && n.type === 'MemberExpression' && !n.computed && n.property && n.property.type === 'Identifier') {
        parts.unshift(n.property.name);
        n = n.object;
    }
    if (n && n.type === 'Identifier') { parts.unshift(n.name); return parts.join('.'); }
    return null;
}

// callee 的可寻址名：标识符 / 点分成员 / this.x
export function calleeName(callee: any): string | null {
    if (!callee) return null;
    if (callee.type === 'Identifier') return callee.name;
    if (callee.type === 'MemberExpression' && !callee.computed) {
        if (callee.object && callee.object.type === 'ThisExpression' && callee.property.type === 'Identifier') {
            return 'this.' + callee.property.name;
        }
        return dottedName(callee);
    }
    return null;
}

// IIFE 类工厂：init 是 (function(t){...})(Base) 形态（callee 为函数的调用）。
// babel ES5 输出的绝大多数类都是这种形态——声明名在 declarator 上，函数体包在调用里。
export function isIifeFactory(n: any): boolean {
    if (!n || n.type !== 'CallExpression') return false;
    let c = n.callee;
    if (c && c.type === 'ParenthesizedExpression') c = c.expression;
    return !!(c && isFnNode(c));
}

/*
 * directChildFns —— 成对返回 [{ fn, asName, idName }]，不深入子函数内部（属于下一层）。
 */
export function directChildFns(node: any): { fn: any; asName: string | null; idName: string | null }[] {
    const out: { fn: any; asName: string | null; idName: string | null }[] = [];
    function visit(n: any, bind: string | null, prefix: string | null): void {
        if (!n || typeof n !== 'object') return;
        if (Array.isArray(n)) {
            for (let i = 0; i < n.length; i++) visit(n[i], null, null);
            return;
        }
        if (typeof n.type !== 'string') return;
        if (isFnNode(n) && n !== node) {
            const id = n.id ? n.id.name : null;
            out.push({ fn: n, asName: bind, idName: id });
            return;
        }
        let cBind: string | null = null, cPrefix: string | null = null;
        if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier') {
            if (isFnNode(n.init) || isIifeFactory(n.init) || (n.init && n.init.type === 'ClassExpression')) cBind = n.id.name;
            else if (n.init && n.init.type === 'ObjectExpression') cPrefix = n.id.name;
        } else if (n.type === 'AssignmentExpression') {
            const dn = dottedName(n.left);
            if (dn) {
                if (isFnNode(n.right) || isIifeFactory(n.right) || (n.right && n.right.type === 'ClassExpression')) cBind = dn;
                else if (n.right && n.right.type === 'ObjectExpression') cPrefix = dn;
            }
        } else if ((n.type === 'ObjectProperty' || n.type === 'Property') && prefix) {
            const kv = n.key && (n.key.type === 'Literal' ? n.key.value : n.key.name);
            if (typeof kv === 'string') {
                if (isFnNode(n.value) || isIifeFactory(n.value)) cBind = prefix + '.' + kv;
                else if (n.value && n.value.type === 'ObjectExpression') cPrefix = prefix + '.' + kv;
            }
        } else if (n.type === 'ObjectExpression') {
            cPrefix = prefix; // 命名空间前缀穿透对象字面量，传给属性
        } else if (n.type === 'CallExpression' && bind && isIifeFactory(n)) {
            // IIFE 工厂调用是中间节点：把上一层绑定的声明名透传给被调函数
            cBind = bind;
        } else if (n.type === 'MethodDefinition' && !n.computed && prefix !== undefined) {
            // 原生 class 方法：{name:'tick'} 可直达 MethodDefinition 的函数体。
            // 绑定名 = key 名（static 与实例同名 → 2 候选，用 index 消歧）。
            const kv = n.key && (n.key.type === 'Identifier' ? n.key.name : (n.key.type === 'Literal' ? String(n.key.value) : null));
            if (kv != null && isFnNode(n.value)) {
                out.push({ fn: n.value, asName: kv, idName: null });
                return;
            }
        }
        for (const k in n) {
            if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
            const v = (n as any)[k];
            if (Array.isArray(v)) { for (let j = 0; j < v.length; j++) visit(v[j], cBind, cPrefix); }
            else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v, cBind, cPrefix);
        }
    }
    visit(node, null, null);
    return out;
}

/*
 * walkAll —— 整个子树（含嵌套函数/类内部）。
 */
export function walkAll(root: any, cb: (n: any) => void): void {
    function visit(n: any): void {
        if (!n || typeof n !== 'object') return;
        if (Array.isArray(n)) {
            for (let i = 0; i < n.length; i++) visit(n[i]);
            return;
        }
        if (typeof n.type !== 'string') return;
        cb(n);
        for (const k in n) {
            if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
            const v = (n as any)[k];
            if (Array.isArray(v)) { for (let j = 0; j < v.length; j++) visit(v[j]); }
            else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v);
        }
    }
    visit(root);
}

/* ---------- 锚点特征提取与匹配 ---------- */

export function fnFeatures(fn: any): { strings: string[]; calls: string[]; params: number } {
    const strings: Record<string, number> = {};
    const calls: Record<string, number> = {};
    const params = fn.params ? fn.params.length : -1;
    walkAll(fn, function (n: any): void {
        if (n.type === 'Literal' && typeof n.value === 'string') strings[n.value] = 1;
        else if (n.type === 'TemplateLiteral' && n.quasis) {
            for (let i = 0; i < n.quasis.length; i++) {
                if (n.quasis[i].value && n.quasis[i].value.cooked) strings[n.quasis[i].value.cooked] = 1;
            }
        } else if (n.type === 'CallExpression') {
            const c = calleeName(n.callee);
            if (c) {
                // 调用名取末段（'a.b.c' → 'c'），与 v1 行为一致；'this.x' 取 'x'
                const last = c.indexOf('.') >= 0 ? c.slice(c.lastIndexOf('.') + 1) : c;
                calls[last] = 1;
            }
        }
    });
    return { strings: Object.keys(strings), calls: Object.keys(calls), params: params };
}

export function matchAnchor(fn: any, anchor: Anchor | undefined): boolean {
    if (!anchor) return true;
    const f = fnFeatures(fn);
    if (anchor.params != null && f.params !== anchor.params) return false;
    if (anchor.strings) {
        for (let i = 0; i < anchor.strings.length; i++) {
            if (f.strings.indexOf(anchor.strings[i]) < 0) return false;
        }
    }
    if (anchor.calls) {
        for (let i = 0; i < anchor.calls.length; i++) {
            if (f.calls.indexOf(anchor.calls[i]) < 0) return false;
        }
    }
    return true;
}

export function describeFn(fn: any, src: string): string {
    const s = fn.start, e = Math.min(fn.end, fn.start + 160);
    return fn.type + (fn.id ? ' ' + fn.id.name : '') + ' @' + s + '..' + fn.end +
        ' params=' + (fn.params ? fn.params.length : '?') +
        ' "' + src.slice(s, e).replace(/\s+/g, ' ') + (fn.end - s > 160 ? '...' : '') + '"';
}
