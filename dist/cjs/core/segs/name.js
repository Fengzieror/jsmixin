"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveName = resolveName;
/*
 * segs/name.ts — 具名段：{name:'XS'} 单名（匹配绑定名或函数自身 id）；
 * {name:'V.showToast'} 点分命名空间（只匹配绑定名的完整点分路径）。
 * 依赖 directChildFns 的绑定名规则（含 v2 的 MethodDefinition key 绑定，原生 class 方法可直达）。
 */
const features_js_1 = require("../features.js");
const pick_js_1 = require("./pick.js");
function resolveName(node, seg, src) {
    const kids = (0, features_js_1.directChildFns)(node);
    const wantDot = seg.name.indexOf('.') >= 0;
    const candidates = [];
    for (let i = 0; i < kids.length; i++) {
        const k = kids[i];
        if (wantDot ? (k.asName === seg.name) : (k.asName === seg.name || k.idName === seg.name)) {
            candidates.push(k.fn);
        }
    }
    return (0, pick_js_1.pick)(candidates, seg, src, 'name ' + seg.name);
}
