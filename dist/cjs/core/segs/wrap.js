"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWrap = resolveWrap;
/*
 * segs/wrap.ts — 打包器解包段：进入"包装/工厂函数体"，与 {module} 平级的入口段。
 *   'iife'：顶层 IIFE（(function(){})(…)、(()=>{})()、!function(){}()、var X=(function(){})()）
 *   'cjs' ：module.exports = (function(){…})() 工厂
 *   'umd' ：(function(global,factory){…})(this, function(){…}) → 取 factory 实参函数
 * 多个候选 → 未写 index 拒绝。
 */
const features_js_1 = require("../features.js");
const pick_js_1 = require("./pick.js");
// 顶层语句集合：Program 用 ast.body，函数用 body.body
function topStatements(node) {
    if (node.type === 'Program')
        return node.body || [];
    if (node.body && node.body.type === 'BlockStatement')
        return node.body.body || [];
    return [];
}
function unwrapParens(n) {
    while (n && n.type === 'ParenthesizedExpression')
        n = n.expression;
    return n;
}
function resolveWrap(node, seg, src) {
    const kind = seg.wrap;
    const stmts = topStatements(node);
    const candidates = [];
    const pushFactory = (call) => {
        const c = unwrapParens(call.callee);
        if (c && (0, features_js_1.isFnNode)(c) && (0, features_js_1.hasBlockBody)(c))
            candidates.push(c);
    };
    for (let i = 0; i < stmts.length; i++) {
        const st = stmts[i];
        if (st.type === 'ExpressionStatement') {
            const expr = unwrapParens(st.expression);
            if (!expr)
                continue;
            if (kind === 'iife' && expr.type === 'CallExpression')
                pushFactory(expr);
            else if (kind === 'iife' && expr.type === 'UnaryExpression' && expr.argument
                && expr.argument.type === 'CallExpression')
                pushFactory(expr.argument); // !function(){}()
            else if (kind === 'cjs' && expr.type === 'AssignmentExpression'
                && (0, features_js_1.dottedName)(expr.left) === 'module.exports' && expr.right.type === 'CallExpression')
                pushFactory(expr.right);
            else if (kind === 'umd' && expr.type === 'CallExpression') {
                const c = unwrapParens(expr.callee);
                if (c && (0, features_js_1.isFnNode)(c) && c.params && c.params.length >= 1) {
                    // UMD 包装的 factory = 最后一个函数实参
                    for (let a = expr.arguments.length - 1; a >= 0; a--) {
                        const arg = unwrapParens(expr.arguments[a]);
                        if (arg && (0, features_js_1.isFnNode)(arg) && (0, features_js_1.hasBlockBody)(arg)) {
                            candidates.push(arg);
                            break;
                        }
                    }
                }
            }
        }
        else if (st.type === 'VariableDeclaration') {
            for (let d = 0; d < st.declarations.length; d++) {
                const dec = st.declarations[d];
                if (kind === 'iife' && dec.init && dec.init.type === 'CallExpression')
                    pushFactory(dec.init);
            }
        }
    }
    return (0, pick_js_1.pick)(candidates, seg, src, 'wrap ' + kind);
}
