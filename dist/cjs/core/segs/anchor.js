"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAnchor = resolveAnchor;
/*
 * segs/anchor.ts — 内容锚点段：strings/calls/params 特征 AND 匹配直接子函数。
 * "字符串是唯一压缩幸存者"——锚点是混淆代码定位的主力。
 */
const features_js_1 = require("../features.js");
const pick_js_1 = require("./pick.js");
function resolveAnchor(node, seg, src) {
    const kids = (0, features_js_1.directChildFns)(node);
    const candidates = [];
    for (let i = 0; i < kids.length; i++) {
        if ((0, features_js_1.matchAnchor)(kids[i].fn, seg.anchor))
            candidates.push(kids[i].fn);
    }
    return (0, pick_js_1.pick)(candidates, seg, src, 'anchor ' + JSON.stringify(seg.anchor));
}
