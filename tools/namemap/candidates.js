/* candidates.js — 生成待命名候选清单（给人工/AI 推断用）
 * 按"证据丰富度"排序: 方法表+静态+props+字符串+父类
 * 产出: candidates.md（紧凑审阅版）
 */
'use strict';
const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'report.json'), 'utf8')).bindings;
const nameMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'name-map.json'), 'utf8'));

const known = new Set([
    ...Object.values(nameMap.classes).map(r => r.split('.')[0]),
    ...Object.values(nameMap.aliases).map(r => r.split('.')[0]),
]);

const L = [];
L.push('# 待命名候选（按证据丰富度排序）');
L.push('');
L.push('## A. 未命名枚举（全部 ' + Object.values(report).filter(e => e.enum && e.enum.length).length + ' 个中的未命名）');
L.push('');
for (const [name, e] of Object.entries(report)) {
    if (!e.enum || !e.enum.length || known.has(name)) continue;
    const members = e.enum.map(([k, v]) => k + '=' + v).join('/');
    L.push(`- \`${name}\` @L${e.line} (${e.enum.length}): ${members.slice(0, 300)}`);
}
L.push('');
L.push('## B. 未命名绑定（有方法表/props，按证据分排序，Top 160）');
L.push('');
const scored = [];
for (const [name, e] of Object.entries(report)) {
    if (known.has(name)) continue;
    if (e.enum) continue; // 枚举已在 A 节
    const methods = e.methods || e.protoInst || [];
    const statics = e.statics || e.protoStat || [];
    const props = (e.props || []).map(p => Array.isArray(p) ? p[0] : p);
    const score = methods.length * 2 + statics.length + props.length + Math.min((e.strings || []).length / 5, 10);
    if (score < 4) continue;
    scored.push({ name, e, methods, statics, props, score });
}
scored.sort((a, b) => b.score - a.score);
for (const c of scored.slice(0, 160)) {
    const e = c.e;
    L.push(`### \`${c.name}\` @L${e.line} (score ${c.score.toFixed(0)}, ${e.type}${e.parent ? ', parent=' + e.parent : ''}${known.has(e.parent) ? '[' + [...Object.entries(nameMap.classes), ...Object.entries(nameMap.aliases)].filter(([, r]) => r === e.parent).map(([f]) => f)[0] + ']' : ''})`);
    if (c.methods.length) L.push('- methods: ' + c.methods.slice(0, 18).join(', ') + (c.methods.length > 18 ? ` (+${c.methods.length - 18})` : ''));
    if (c.statics.length) L.push('- statics: ' + c.statics.slice(0, 10).join(', '));
    if (c.props.length) L.push('- props: ' + c.props.slice(0, 12).join(', '));
    if (e.strings && e.strings.length) {
        // 挑最有信息量的字符串: 中文 > 路径 > 长键
        const strs = [...e.strings].sort((a, b) => {
            const s = x => (/[^\x00-\x7f]/.test(x) ? 3 : /[\/.]/.test(x) ? 2 : 1);
            return s(b) - s(a);
        }).slice(0, 10);
        L.push('- strings: ' + strs.map(s => JSON.stringify(s.length > 60 ? s.slice(0, 60) + '…' : s)).join(', '));
    }
    L.push('');
}
fs.writeFileSync(path.join(__dirname, 'candidates.md'), L.join('\n'));
console.log('candidates.md:', 'A 枚举', Object.values(report).filter(e => e.enum && e.enum.length && !known.has(Object.values(nameMap.aliases) ? e : e)).length ? '见文件' : '', '| B 绑定', scored.length, '个（输出 Top 160）');
