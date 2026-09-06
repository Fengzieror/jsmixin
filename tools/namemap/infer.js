/* infer.js — 从 main.pretty.js 推断模块 625 闭包符号的语义身份
 *
 * 用法:
 *   node infer.js build            — 解析并产出 report.json（全量证据，按绑定组织）
 *   node infer.js find <子串>      — 反查: 哪些绑定/方法包含该字符串(方法key/字面量/枚举名)
 *   node infer.js show <名字>      — 打印某绑定的完整证据
 *
 * 证据类型: methods(createClass 方法表 key) / strings(子树字符串字面量) /
 *           enum(纯字面量对象成员) / parent(继承基类) / props(命名空间属性) /
 *           proto(prototype 赋值) / refs(引用的其他闭包符号)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const PRETTY = process.argv[2] && process.argv[2] !== 'build' && process.argv[2] !== 'find' && process.argv[2] !== 'show'
    ? process.argv[2] : '../../../pdzzapksworkspace/main.pretty.js';
const FILE = path.resolve(__dirname, PRETTY);
const OUT = path.join(__dirname, 'report.json');

const code = fs.readFileSync(FILE, 'utf8');
console.log('parsing', FILE, `(${(code.length / 1e6).toFixed(1)} MB) ...`);
const ast = parser.parse(code, { errorRecovery: true });
console.log('parsed.');

/* ── 定位 webpack 模块 625 的函数节点 ── */
let modFn = null;
traverse(ast, {
    ObjectExpression(p) {
        for (const prop of p.node.properties) {
            if (prop.type === 'ObjectProperty' && prop.key.type === 'NumericLiteral'
                && String(prop.key.value) === '625' && prop.value.type === 'FunctionExpression') {
                modFn = prop.value;
                p.stop();
                return;
            }
        }
    },
});
if (!modFn) { console.error('module 625 not found'); process.exit(1); }

/* 帮助函数: 从节点收集文本内的字面量与属性键（含嵌套） */
function collectStrings(fnNode, limit) {
    const out = new Set();
    const stack = [[fnNode, 0]];
    while (stack.length) {
        const [n, d] = stack.pop();
        if (!n || typeof n !== 'object' || d > 80) continue;
        if (n.type === 'StringLiteral') {
            const v = n.value;
            if (v.length >= 2 && v.length <= 120 && !v.includes('\n')) out.add(v);
            if (out.size > (limit || 5000)) break;
        } else if (n.type === 'ObjectProperty' && n.key && !n.computed) {
            out.add(n.key.name || n.key.value); // 属性键: lasershooter: Gy / movetrigger: 5
        } else if (n.type === 'MemberExpression' && n.property.type === 'Identifier' && !n.computed) {
            out.add(n.property.name); // 成员访问: VC.movetrigger
        } else if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression'
            && n.left.property.type === 'Identifier' && !n.left.computed) {
            out.add(n.left.property.name); // WS.component_name_xxx = ...
        }
        for (const k of Object.keys(n)) {
            if (k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments') continue;
            const v = n[k];
            if (Array.isArray(v)) { for (const x of v) if (x && x.type) stack.push([x, d + 1]); }
            else if (v && v.type) stack.push([v, d + 1]);
        }
    }
    return [...out];
}

/* 收集方法表 key: createClass 模式 —— 二参调用, 第一参是本函数内 Identifier, 第二参是数组,
 * 数组元素形如 {key:"...", value:function(){}} 或 {key, get/set} */
function collectClassFns(fnNode) {
    // 返回 Map<ctorIdentifierName, Set<methodKey>>（按绑定 identifier 名收集）
    const found = new Map(); // canonKey(start of ctor binding) -> {ctorName, methods:Set, statics:Set}
    const seen = new Set();
    const stack = [[fnNode, 0]];
    while (stack.length) {
        const [n, d] = stack.pop();
        if (!n || typeof n !== 'object' || seen.has(n) || d > 40) continue;
        seen.add(n);
        if (n.type === 'CallExpression'
            && (n.arguments.length === 2 || (n.arguments.length === 3 && (n.arguments[1].type === 'NullLiteral' || n.arguments[1].type === 'ObjectExpression')))
            && n.arguments[0].type === 'Identifier'
            && n.arguments[n.arguments.length - 1].type === 'ArrayExpression') {
            const ctor = n.arguments[0].name;
            const entry = found.get(ctor) || { ctor, methods: [], statics: [] };
            for (const el of n.arguments[n.arguments.length - 1].elements) {
                if (!el || el.type !== 'ObjectExpression') continue;
                let key = null, isFn = false, isStatic = false;
                for (const p of el.properties) {
                    const kn = p.key ? (p.key.name || p.key.value) : null;
                    if (kn === 'key' && p.value
                        && (p.value.type === 'StringLiteral' || p.value.type === 'NumericLiteral')) key = String(p.value.value);
                    if (kn === 'value' && p.value && /Function/.test(p.value.type)) isFn = true;
                    if (kn === 'static' && p.value && p.value.value) isStatic = true;
                }
                if (key != null && isFn) (isStatic ? entry.statics : entry.methods).push(key);
            }
            if (entry.methods.length || entry.statics.length) found.set(ctor, entry);
        }
        for (const k of Object.keys(n)) {
            if (k === 'loc' || k === 'start' || k === 'end') continue;
            const v = n[k];
            if (Array.isArray(v)) { for (const x of v) if (x && x.type) stack.push([x, d + 1]); }
            else if (v && v.type) stack.push([v, d + 1]);
        }
    }
    return found;
}

/* TS 编译枚举: (function(X){X[X["k"]=v]="k"})(X||(X={})) —— 双重赋值扫描 */
function asTsEnum(node) {
    if (!node || typeof node !== 'object') return null;
    const members = [];
    const seen = new Set();
    const stack = [[node, 0]];
    while (stack.length) {
        const [n, d] = stack.pop();
        if (!n || typeof n !== 'object' || seen.has(n) || d > 6) continue;
        seen.add(n);
        if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && n.left.computed) {
            // 形态1: X["k"] = v
            if (n.left.property.type === 'StringLiteral') {
                let v = n.right;
                if (v.type === 'UnaryExpression' && v.operator === '-') v = -v.argument.value;
                else if (v.type === 'NumericLiteral' || v.type === 'StringLiteral' || v.type === 'BooleanLiteral') v = v.value;
                else v = '?';
                members.push([n.left.property.value, v]);
            }
            // 形态2 (TS 编译): X[(X.k = v)] = "k"  或  X[X["k"] = v] = "k"
            if (n.left.property.type === 'AssignmentExpression'
                && n.left.property.left.type === 'MemberExpression'
                && n.left.property.left.property
                && (n.left.property.left.property.type === 'Identifier' || n.left.property.left.property.type === 'StringLiteral')) {
                let v = n.left.property.right;
                if (v.type === 'UnaryExpression' && v.operator === '-') v = -v.argument.value;
                else if (v.type === 'NumericLiteral' || v.type === 'StringLiteral' || v.type === 'BooleanLiteral') v = v.value;
                else v = '?';
                members.push([n.left.property.left.property.name || n.left.property.left.property.value, v]);
            }
        }
        for (const k of Object.keys(n)) {
            if (k === 'loc' || k === 'start' || k === 'end') continue;
            const v = n[k];
            if (Array.isArray(v)) { for (const x of v) if (x && x.type) stack.push([x, d + 1]); }
            else if (v && v.type) stack.push([v, d + 1]);
        }
    }
    return members.length ? members : null;
}

/* 枚举识别: 纯字面量对象（或 freeze 包裹） */
function asEnum(init) {
    let obj = init;
    if (obj && obj.type === 'CallExpression' && obj.arguments.length && obj.arguments[0].type === 'ObjectExpression') obj = obj.arguments[0];
    if (!obj || obj.type !== 'ObjectExpression') return null;
    const entries = [];
    for (const p of obj.properties) {
        if (p.type !== 'ObjectProperty' || !p.key) return null;
        const k = p.key.name || p.key.value;
        if (p.value.type === 'StringLiteral' || p.value.type === 'NumericLiteral' || p.value.type === 'BooleanLiteral') entries.push([k, p.value.value]);
        else if (p.value.type === 'UnaryExpression' && p.value.operator === '-' && p.value.argument.type === 'NumericLiteral') entries.push([k, -p.value.argument.value]);
        else return null;
    }
    return entries.length ? entries : null;
}

/* TS 枚举 IIFE 全局扫描: (function(X){X[X["k"]=v]="k"})(X||(X={})) —— 外层名 -> 成员 */
function scanTsEnums(rootFn) {
    const enums = {};
    const seen = new Set();
    const stack = [[rootFn, 0]];
    while (stack.length) {
        const [n, d] = stack.pop();
        if (!n || typeof n !== 'object' || seen.has(n) || d > 8) continue;
        seen.add(n);
        if (n.type === 'CallExpression' && n.arguments.length === 1
            && n.callee.type === 'FunctionExpression'
            && n.arguments[0].type === 'LogicalExpression' && n.arguments[0].operator === '||'
            && n.arguments[0].left.type === 'Identifier'
            && n.arguments[0].right.type === 'AssignmentExpression'
            && n.arguments[0].right.left.type === 'Identifier'
            && n.arguments[0].right.left.name === n.arguments[0].left.name) {
            const nm = n.arguments[0].left.name;
            if (!enums[nm]) {
                const members = asTsEnum(n.callee.body);
                if (members) enums[nm] = members;
            }
        }
        for (const k of Object.keys(n)) {
            if (k === 'loc' || k === 'start' || k === 'end') continue;
            const v = n[k];
            if (Array.isArray(v)) { for (const x of v) if (x && x.type) stack.push([x, d + 1]); }
            else if (v && v.type) stack.push([v, d + 1]);
        }
    }
    return enums;
}

/* ── 枚举模块 625 顶层绑定 ── */
const fnPath = [];
traverse(ast, { FunctionExpression(p) { if (p.node === modFn) { fnPath.push(p); p.stop(); } } });
const modPath = fnPath[0];
const scope = modPath.scope;
const bindings = scope.bindings;
const tsEnums = scanTsEnums(modFn); // 外层名 -> 成员（合并进 report）

const report = {};
const byString = Object.create(null);   // 字面量/键 -> [绑定名]
const byMethod = Object.create(null);   // 方法key -> [绑定名]

for (const name of Object.keys(bindings)) {
    const b = bindings[name];
    let node = b.path.node.init || null;
    let iifeParent = null; // IIFE 类工厂的继承实参: var X = (function(t){...})(Parent)
    // ① IIFE 类工厂: var X = (function(t){...}(Base)) —— 取被调函数体
    if (node && node.type === 'CallExpression') {
        if (node.arguments.length === 1 && node.arguments[0].type === 'Identifier') iifeParent = node.arguments[0].name;
        else if (node.arguments.length === 1 && node.arguments[0].type === 'MemberExpression') {
            iifeParent = code.slice(node.arguments[0].start, node.arguments[0].end);
        }
        if (node.callee.type === 'FunctionExpression') node = node.callee;
        else if (node.callee.type === 'ParenthesizedExpression' && node.callee.expression.type === 'FunctionExpression') node = node.callee.expression;
    }
    // ② 先声明后赋值: var X; ... 多个 violation 里挑信息量最大的（IIFE/函数/非空对象 > 空对象）
    if (!node) {
        let best = null, bestScore = -1;
        const cands = [];
        for (const v of b.constantViolations || []) {
            if (v.isAssignmentExpression()) cands.push(v.node.right);
        }
        if (b.path.node.type === 'VariableDeclarator' && b.path.node.init) cands.push(b.path.node.init);
        for (let r of cands) {
            let score = 0;
            if (r.type === 'CallExpression') {
                if (r.callee.type === 'FunctionExpression') { r = r.callee; score = 3; }
                else if (r.callee.type === 'ParenthesizedExpression' && r.callee.expression.type === 'FunctionExpression') { r = r.callee.expression; score = 3; }
                else score = 2; // 保留 CallExpression（可能是 TS 枚举 IIFE/工厂）
            } else if (r.type === 'FunctionExpression' || r.type === 'ArrowFunctionExpression') score = 3;
            else if (r.type === 'ObjectExpression') score = r.properties.length ? 3 : 1;
            if (score > bestScore) { best = r; bestScore = score; }
        }
        node = best;
    }
    const entry = { kind: b.kind, type: node ? node.type : b.path.node.type, line: b.path.node.loc ? b.path.node.loc.start.line : null };
    if (iifeParent) entry.parent = iifeParent;
    if (tsEnums[name]) entry.enum = tsEnums[name];
    if (node) {
        let en = asEnum(node);
        if (!en && (node.type === 'CallExpression' || node.type === 'FunctionExpression')) en = asTsEnum(node);
        if (en) entry.enum = en;
        if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression') {
            const cls = collectClassFns(node);
            for (const [ctor, e] of cls) {
                if (e.methods.length) entry.methods = [...new Set(e.methods)].sort();
                if (e.statics.length) entry.statics = [...new Set(e.statics)].sort();
            }
            entry.strings = collectStrings(node, 4000);
        } else if (node.type === 'ObjectExpression') {
            // 命名空间: 属性 -> 函数/对象
            const props = [];
            for (const p of node.properties) {
                if (p.type === 'ObjectProperty' && p.key) {
                    const k = p.key.name || p.key.value;
                    let sub = null;
                    if (p.value && /Function/.test(p.value.type)) {
                        const cls = collectClassFns(p.value);
                        let methods = [];
                        for (const [, e] of cls) methods = methods.concat(e.methods);
                        props.push([k, 'fn', methods.length ? [...new Set(methods)].sort() : null, p.value.loc ? p.value.loc.start.line : null]);
                    } else if (p.value && p.value.type === 'ObjectExpression') {
                        const en2 = asEnum(p.value);
                        props.push([k, en2 ? 'enum' : 'obj', en2, p.value.loc ? p.value.loc.start.line : null]);
                    } else if (p.value && p.value.type === 'Identifier') props.push([k, 'ref', p.value.name, null]);
                }
            }
            if (props.length) entry.props = props;
            entry.strings = collectStrings(node, 1000);
        }
        // prototype 赋值: X.prototype.y = fn —— 在整个模块作用域里找对该名字的赋值，另查
        const strs = entry.strings || [];
        for (const s of strs) (byString[s] || (byString[s] = [])).push(name);
        const ms = entry.methods || [];
        for (const m of ms) (byMethod[m] || (byMethod[m] = [])).push(name);
        if (entry.props) for (const [k] of entry.props) (byMethod[k] || (byMethod[k] = [])).push(name);
    }
    report[name] = entry;
}

/* prototype/静态赋值扫描: Name.prototype.meth = / Name.meth = （仅模块 625 顶层标识符） */
const proto = {};
const ids = new Set(Object.keys(report));
const assignStack = [[modFn, 0]];
while (assignStack.length) {
    const [n, d] = assignStack.pop();
    if (!n || typeof n !== 'object' || d > 3) continue; // 只扫顶层语句附近
    if (n.type === 'AssignmentExpression' && n.left.type === 'MemberExpression') {
        const L = n.left;
        if (L.object.type === 'MemberExpression' && L.object.object.type === 'Identifier' && ids.has(L.object.object.name)
            && L.object.property.type === 'Identifier' && L.object.property.name === 'prototype') {
            const cls = L.object.object.name;
            const meth = L.property.type === 'Identifier' ? L.property.name : (L.property.value || '?');
            (proto[cls] || (proto[cls] = { inst: [], stat: [] })).inst.push(meth);
        } else if (L.object.type === 'Identifier' && ids.has(L.object.name) && L.property.type === 'Identifier') {
            (proto[L.object.name] || (proto[L.object.name] = { inst: [], stat: [] })).stat.push(L.property.name);
        }
    }
    for (const k of Object.keys(n)) {
        if (k === 'loc' || k === 'start' || k === 'end') continue;
        const v = n[k];
        if (Array.isArray(v)) { for (const x of v) if (x && x.type) assignStack.push([x, d + 1]); }
        else if (v && v.type) assignStack.push([v, d + 1]);
    }
}
for (const k of Object.keys(proto)) {
    if (!report[k]) continue;
    report[k].protoInst = [...new Set(proto[k].inst)].sort();
    report[k].protoStat = [...new Set(proto[k].stat)].sort();
    for (const m of report[k].protoInst) (byMethod[m] || (byMethod[m] = [])).push(k);
}

fs.writeFileSync(OUT, JSON.stringify({ module: '625', bindingCount: Object.keys(report).length, bindings: report }, null, 1));
console.log('bindings:', Object.keys(report).length, '-> report.json');
module.exports = { report, byString, byMethod };

/* ── CLI 查询 ── */
function cmdFind(q) {
    const hits = [];
    for (const [s, names] of Object.entries(byString)) if (s.includes(q)) hits.push({ kind: 'string', v: s, names });
    for (const [m, names] of Object.entries(byMethod)) if (m.includes(q)) hits.push({ kind: 'method', v: m, names });
    for (const [name, e] of Object.entries(report)) {
        if (name.includes(q)) hits.push({ kind: 'binding', v: name + ' (' + e.type + ' @L' + e.line + ')', names: [name] });
        if (e.props) for (const [k, t, x] of e.props) if (String(k).includes(q)) hits.push({ kind: 'prop:' + name, v: k + ' [' + t + ']' + (Array.isArray(x) ? ' (' + x.length + ' items)' : x != null ? ' = ' + JSON.stringify(x) : ''), names: [name] });
    }
    hits.sort((a, b) => a.kind.localeCompare(b.kind));
    for (const h of hits) console.log(`[${h.kind}] ${h.v}  <- ${h.names.join(', ')}`);
    console.log(hits.length, 'hits');
}
function cmdShow(name) {
    const e = report[name];
    if (!e) { console.error('no binding', name); process.exit(1); }
    const copy = { ...e };
    if (copy.strings) { copy.strings = copy.strings.slice(0, 120); copy.stringsTotal = e.strings.length; }
    console.log(JSON.stringify(copy, null, 1));
}
if (process.argv[2] === 'find') cmdFind(process.argv[3] || '');
if (process.argv[2] === 'show') cmdShow(process.argv[3] || '');
