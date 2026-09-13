"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = pick;
const features_js_1 = require("../features.js");
function pick(candidates, seg, src, what) {
    const hasIndex = seg.index != null; // index:0 也是显式指向，不能当"没写"（falsy 陷阱）
    const idx = hasIndex ? seg.index : 0;
    if (candidates.length === 0)
        return { error: '0 个候选（' + what + '）' };
    if (candidates.length > 1 && !hasIndex) {
        const list = [];
        for (let i = 0; i < Math.min(candidates.length, 8); i++)
            list.push((0, features_js_1.describeFn)(candidates[i], src));
        return { error: candidates.length + ' 个候选且未写 index（' + what + '）：' + list.join(' | ') };
    }
    if (idx >= candidates.length)
        return { error: 'index ' + idx + ' 越界，候选 ' + candidates.length + ' 个（' + what + '）' };
    return { node: candidates[idx] };
}
