"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCall = resolveCall;
/*
 * segs/call.ts — 具名调用实参段：{ call:'jS.init', arg:0 } 定位"传给某个具名函数的回调"。
 * 一次性函数/闭包回调没有绑定名，但它们出现的调用点有名字；实参槽位是语义位置。
 * 同名调用点必须唯一（多个 → 报错列候选；写更长点分名消歧）。
 */
const features_js_1 = require("../features.js");
const pick_js_1 = require("./pick.js");
function resolveCall(node, seg, src) {
    const argIdx = seg.arg != null ? seg.arg : 0;
    const candidates = [];
    (0, features_js_1.walkAll)(node, function (n) {
        if (n.type !== 'CallExpression' || !n.arguments)
            return;
        const nm = (0, features_js_1.calleeName)(n.callee);
        if (nm !== seg.call)
            return;
        const a = n.arguments[argIdx];
        if (a && (0, features_js_1.isFnNode)(a) && (0, features_js_1.hasBlockBody)(a))
            candidates.push(a);
    });
    return (0, pick_js_1.pick)(candidates, seg, src, 'call ' + seg.call + ' 实参[' + argIdx + ']');
}
