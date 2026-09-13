/* dump_chunks.js — 把全部未命名绑定/枚举按证据分块导出，供并行子代理推断命名
 * 产出: batches/chunkN_*.md + batches/manifest.json
 */
'use strict';
const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'report.json'), 'utf8')).bindings;
const nameMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'name-map.json'), 'utf8'));

const knownReal = {}; // real -> friendly
for (const [f, r] of Object.entries(nameMap.classes)) knownReal[r.split('.')[0]] = f;
for (const [f, r] of Object.entries(nameMap.aliases)) knownReal[r.split('.')[0]] = f;
const knownFriendly = new Set(Object.keys(nameMap.classes).concat(Object.keys(nameMap.aliases)));

const dir = path.join(__dirname, 'batches');
fs.mkdirSync(dir, { recursive: true });

const HEADER = [
    '# 游戏: 派对制造（UGC 派对闯关手游，LayaAir 1.8.4 + webpack 单模块，2.1.93）',
    '# 目标: main.pretty.js 模块 625 闭包内的混淆绑定（每个绑定 = 一个类/命名空间/单例函数）',
    '# 背景: 类名被混淆为短标识符，但方法名/属性名/字符串字面量全部明文。',
    '# 既有命名后缀惯例: *StageView(全屏视图) *Panel(弹窗) *Service(Rt.ElementComponent 服务) *Model(Rt.ElementModel 数据) *State(Rt.State 状态机) *Behaviour(Rt.ElementBehaviour 行为) *Controller(对局控制) *Utils *Base',
    '# 已确认命名（friendly=real，避免重名、可参考语境）:',
    '',
    ...Object.entries(nameMap.classes).map(([f, r]) => `    ${f} = ${r}`),
    ...Object.entries(nameMap.aliases).map(([f, r]) => `    ${f} = ${r} (枚举)`),
    '',
].join('\n');

function fmtEntry(name, e) {
    const methods = (e.methods || e.protoInst || []);
    const statics = (e.statics || e.protoStat || []);
    const props = (e.props || []).map(p => Array.isArray(p) ? p[0] : p);
    const parent = e.parent ? (e.parent + (knownReal[e.parent] ? `[=${knownReal[e.parent]}]` : '')) : '(无)';
    const score = methods.length * 2 + statics.length + props.length + Math.min((e.strings || []).length / 5, 10);
    const L = [];
    L.push(`### \`${name}\` @L${e.line} (parent=${parent}, score=${score.toFixed(0)})`);
    if (methods.length) L.push('- methods: ' + methods.slice(0, 30).join(', ') + (methods.length > 30 ? ` (+${methods.length - 30})` : ''));
    if (statics.length) L.push('- statics: ' + statics.slice(0, 14).join(', '));
    if (props.length) L.push('- props: ' + props.slice(0, 14).join(', '));
    if (e.strings && e.strings.length) {
        const strs = [...e.strings].sort((a, b) => {
            const s = x => (/[^\x00-\x7f]/.test(x) ? 3 : /^[a-z]+(_[a-z0-9]+)+$/.test(x) ? 2 : /[\/.:]/.test(x) ? 2 : 1);
            return s(b) - s(a);
        }).slice(0, 15);
        L.push('- strings: ' + strs.map(s => JSON.stringify(s.length > 70 ? s.slice(0, 70) + '…' : s)).join(', '));
    }
    L.push('');
    return L.join('\n');
}

/* ── 绑定分块: 全部未命名且有成员证据的绑定, 按分数降序均分为 6 块 ── */
const cands = [];
for (const [name, e] of Object.entries(report)) {
    if (knownReal[name]) continue;
    if (e.enum) continue;
    const methods = (e.methods || e.protoInst || []);
    const statics = (e.statics || e.protoStat || []);
    const props = (e.props || []).length;
    const score = methods.length * 2 + statics.length + props + Math.min((e.strings || []).length / 5, 10);
    if (score < 3) continue;
    cands.push({ name, e, score });
}
cands.sort((a, b) => b.score - a.score);
const N_CHUNKS = 6;
const per = Math.ceil(cands.length / N_CHUNKS);
const manifest = [];
for (let i = 0; i < N_CHUNKS; i++) {
    const slice = cands.slice(i * per, (i + 1) * per);
    if (!slice.length) continue;
    const file = `chunk${i + 1}_bindings.md`;
    fs.writeFileSync(path.join(dir, file), HEADER + '\n# 绑定块 ' + (i + 1) + '/' + N_CHUNKS + '（' + slice.length + ' 个，已按证据分数降序）\n\n'
        + slice.map(c => fmtEntry(c.name, c.e)).join('\n'));
    manifest.push({ file, kind: 'bindings', count: slice.length, range: [slice[0].name, slice[slice.length - 1].name] });
}

/* ── 枚举块 ── */
const enumEntries = [];
for (const [name, e] of Object.entries(report)) {
    if (!e.enum || !e.enum.length || knownReal[name]) continue;
    if (knownFriendly.has('Enum_' + name)) continue;
    enumEntries.push(`- \`${name}\` @L${e.line} (${e.enum.length}): ${e.enum.map(([k, v]) => k + '=' + v).join('/').slice(0, 400)}`);
}
if (enumEntries.length) {
    const file = 'chunk7_enums.md';
    fs.writeFileSync(path.join(dir, file), HEADER + '\n# 枚举块（' + enumEntries.length + ' 个 TS 枚举/常量对象，成员名全部明文）\n\n' + enumEntries.join('\n'));
    manifest.push({ file, kind: 'enums', count: enumEntries.length });
}

fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log('chunks:', manifest.map(m => `${m.file}(${m.count})`).join(' '));
console.log('total bindings:', cands.length, '| enums:', enumEntries.length);
