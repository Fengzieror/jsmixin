/* gen_tables.js — 从 report.json + creators.json + name-map.json 物化 mixin 作者辅助表
 *
 * 产出（均为可检索 JSON，供人查与 build-tool/工具消费）:
 *   enums.json        — 全部 TS 枚举/纯字面量常量对象（220 个），含 byMember 反查索引
 *   anchors.json      — 字符串锚点表（组件id/资源路径/文案键/UI文案），跨版本定位用
 *   member-index.json — 全部含方法表的绑定 → 成员索引（方法名明文，此表用于检索非翻译）
 *   rt-namespace.json — Rt.* / GS.* 等运行时命名空间成员清单（点分引用可达性）
 *   TABLES.md         — 各表说明与用法
 *
 * 用法: node gen_tables.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'report.json'), 'utf8')).bindings;
const creators = JSON.parse(fs.readFileSync(path.join(__dirname, 'creators.json'), 'utf8'));
const nameMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'name-map.json'), 'utf8'));

/* 绑定名 → 已确认可读名（classes + aliases 合并反查） */
const knownName = {};
for (const [f, r] of Object.entries(nameMap.classes)) knownName[r.split('.')[0]] = f;
for (const [f, r] of Object.entries(nameMap.aliases)) knownName[r.split('.')[0]] = f;

const prettyFile = path.resolve(__dirname, '../../../pdzzapksworkspace/main.pretty.js');
const prettyCode = fs.readFileSync(prettyFile, 'utf8');

/* ═══ ① 枚举/常量表 ═══ */
const autoNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'auto-names.json'), 'utf8'));
const curatedEnumNames = { w: 'Direction', hf: 'PhysicsLayer', VC: 'ZOrder', _f: 'ComponentType', Pf: 'RotateMode', Bf: 'EditableScope', ES: 'ScreenId' };
const curatedEnumConf = Object.fromEntries(Object.keys(curatedEnumNames).map(k => [k, 'curated']));
for (const [real, info] of Object.entries(autoNames.enums || {})) {
    if (!info) continue;
    curatedEnumNames[real] = info.name;
    curatedEnumConf[real] = info.conf;
}
const byBinding = Object.create(null);
const byMember = Object.create(null); // 成员名 -> [{binding, name}]
for (const [name, e] of Object.entries(report)) {
    if (!e.enum || !e.enum.length) continue;
    const members = {};
    for (const [k, v] of e.enum) members[k] = v;
    const display = curatedEnumNames[name] || knownName[name] || null;
    byBinding[name] = {
        name: display || 'Enum_' + name,
        named: display != null,
        conf: curatedEnumConf[name] || null,
        line: e.line,
        memberCount: e.enum.length,
        members,
    };
    for (const k of Object.keys(members)) {
        (byMember[k] || (byMember[k] = [])).push({ binding: name, name: byBinding[name].name });
    }
}
fs.writeFileSync(path.join(__dirname, 'enums.json'), JSON.stringify({
    note: 'TS 编译枚举/纯字面量对象。named=true 为已核对命名；其余用 byMember 反查（成员名是明文的）。build-tool 可将 name 作为 path 段别名。',
    count: Object.keys(byBinding).length,
    namedCount: Object.values(byBinding).filter(x => x.named).length,
    byBinding,
    byMember,
}, null, 1));
console.log('enums.json:', Object.keys(byBinding).length, '个枚举（已命名', Object.values(byBinding).filter(x => x.named).length, '）');

/* ═══ ② 字符串锚点表 ═══ */
const byString = Object.create(null); // string -> [{binding, line}]（无原型，防 __proto__ 等键）
for (const [name, e] of Object.entries(report)) {
    if (!e.strings) continue;
    for (const raw of e.strings) {
        const s = String(raw);
        if (s.length < 2 || s.length > 160) continue;
        const arr = byString[s] || (byString[s] = []);
        if (arr.length < 8) arr.push({ binding: name, line: e.line, named: knownName[name] || null });
    }
}
const CJK = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;
const RES_RE = /\.(png|jpe?g|webp|plist|mp3|wav|ogg|skel|atlas|fnt|part|bin|atf|ktx)$/i;
const KEY_RE = /^(component_name|tip|text|btn|title|desc|msg|label|guide|notice|popup|screen|view)[_a-z0-9]*$/i;
const anchors = { component_id: {}, resource_path: {}, text_key: {}, ui_text: {} };
for (const [id, cls] of Object.entries(creators)) {
    if (cls) anchors.component_id[id] = { binding: cls, named: knownName[cls] || null, line: report[cls] ? report[cls].line : null };
}
for (const [s, hits] of Object.entries(byString)) {
    if (RES_RE.test(s)) anchors.resource_path[s] = hits;
    else if (KEY_RE.test(s)) anchors.text_key[s] = hits;
    else if (CJK.test(s)) anchors.ui_text[s] = hits;
}
for (const k of Object.keys(anchors)) {
    const o = anchors[k];
    anchors[k] = Object.fromEntries(Object.entries(o).sort((a, b) => a[0].localeCompare(b[0])));
}
const counts = Object.fromEntries(Object.keys(anchors).map(k => [k, Object.keys(anchors[k]).length]));
fs.writeFileSync(path.join(__dirname, 'anchors.json'), JSON.stringify({
    note: "字符串锚点: 混淆符号随版本重排，但这些字符串是作者写的、跨版本稳定。mixin 定位优先用锚点（infer.js find / 本表），符号名作次级索引。",
    counts,
    ...anchors,
}, null, 1));
console.log('anchors.json:', JSON.stringify(counts));

/* ═══ ③ 成员索引 ═══ */
const memberIndex = Object.create(null);
for (const [name, e] of Object.entries(report)) {
    const methods = e.methods || e.protoInst || [];
    const statics = e.statics || e.protoStat || [];
    if (!methods.length && !statics.length && !e.props) continue;
    memberIndex[name] = {
        name: knownName[name] || null,
        line: e.line,
        type: e.type,
    };
    if (e.parent) memberIndex[name].parent = e.parent;
    if (methods.length) memberIndex[name].methods = methods;
    if (statics.length) memberIndex[name].statics = statics;
    if (e.enum) memberIndex[name].enumMemberCount = e.enum.length;
    if (e.strings) memberIndex[name].stringsCount = e.strings.length;
}
fs.writeFileSync(path.join(__dirname, 'member-index.json'), JSON.stringify({
    note: '绑定 → 成员索引。方法/属性名未被混淆，本表用于检索注入点（谁有哪些方法），不是名称翻译。',
    count: Object.keys(memberIndex).length,
    namedCount: Object.values(memberIndex).filter(x => x.name).length,
    byBinding: memberIndex,
}, null, 1));
console.log('member-index.json:', Object.keys(memberIndex).length, '个绑定（已命名', Object.values(memberIndex).filter(x => x.name).length, '）');

/* ═══ ④ Rt / GS 命名空间成员清单 ═══ */
function scanNamespace(varName) {
    const re = new RegExp('\\b' + varName + '\\.([A-Za-z_$][A-Za-z0-9_$]*)', 'g');
    const counts = {};
    let m;
    while ((m = re.exec(prettyCode))) counts[m[1]] = (counts[m[1]] || 0) + 1;
    const members = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, c]) => ({
        member: k,
        refs: c,
        binding: null,          // 若该成员恰好是某顶层绑定的别名, 填充
        kind: /^[A-Z]/.test(k) ? (/_/.test(k) || k === k.toUpperCase() ? 'constant' : 'class-like') : 'function-or-field',
    }));
    return { varName, memberCount: members.length, members };
}
const ns = { Rt: scanNamespace('Rt'), GS: scanNamespace('GS') };
/* Rt 成员若与顶层绑定同名, 关联其证据 */
for (const m of ns.Rt.members) {
    if (report[m.member]) {
        m.binding = m.member;
        m.line = report[m.member].line;
        m.methods = report[m.member].methods ? report[m.member].methods.slice(0, 12) : undefined;
    }
}
fs.writeFileSync(path.join(__dirname, 'rt-namespace.json'), JSON.stringify({
    note: 'Rt/GS 为运行时闭包内真实存在的命名空间变量, 成员名明文（点分引用可直接用于注入体）。kind=class-like 的成员多为 ECS/游戏框架类; refs=出现次数。',
    Rt: { memberCount: ns.Rt.memberCount, members: ns.Rt.members },
    GS: { memberCount: ns.GS.memberCount, members: ns.GS.members },
}, null, 1));
console.log('rt-namespace.json: Rt', ns.Rt.memberCount, '成员 / GS', ns.GS.memberCount, '成员');

/* ═══ ⑤ TABLES.md ═══ */
const M = [];
M.push('# 辅助表说明（gen_tables.js 产出）');
M.push('');
M.push('> 与 name-map.json 互补：name-map 是**编回用**的符号映射（classes/aliases），以下四张是**检索用**的作者辅助表。');
M.push('> 数据源: report.json（infer.js build 产物）+ creators.json + name-map.json + main.pretty.js 正则扫描。');
M.push('> 生成: `node gen_tables.js`；游戏更新后先重跑 `infer.js build`，再重跑本脚本。');
M.push('');
M.push('## enums.json — 枚举/常量表');
M.push('');
M.push('- `' + Object.keys(byBinding).length + '` 个 TS 枚举；已命名 ' + Object.values(byBinding).filter(x => x.named).length + ' 个（' + Object.entries(curatedEnumNames).map(([k, v]) => `${v}=${k}`).join('、') + '）');
M.push('- 未命名枚举用 `byMember` 反查：作者知道想要 `oneWayPlatform`，一查即得 `hf`。成员名是明文的，这是发现枚举的主路径。');
M.push('- 未命名的 `name` 字段是占位（`Enum_<混淆名>`），核对后应移入 curatedEnumNames 再生成。');
M.push('');
M.push('## anchors.json — 字符串锚点表');
M.push('');
M.push('- 分类: ' + JSON.stringify(anchors.counts));
M.push('- **组件 id**（94 项）: ComponentFactory.creators 的 id→类，最硬的锚点；');
M.push('- **资源路径**: `game/lasershooter.png` 式 CDN 路径，跟着类走；');
M.push('- **文案键**: `component_name_*` 等 TextKeys 静态键；');
M.push('- **UI 文案**: 中文界面字符串（' + counts.ui_text + ' 条），定位视图/弹窗最直接的证人。');
M.push('- 用法: mixin 里优先按锚点字符串定位（对版本更新健壮），符号名只作次级索引。');
M.push('');
M.push('## member-index.json — 成员索引');
M.push('');
M.push('- `' + Object.keys(memberIndex).length + '` 个绑定的方法/静态成员清单（方法名明文，此表是**检索**不是翻译）。');
M.push('- 已命名 ' + Object.values(memberIndex).filter(x => x.name).length + ' 个；`parent` 可与 name-map 交叉。');
M.push('- 用途: "谁有 handleProjectileHit"、"这个类能不能做注入点"。');
M.push('');
M.push('## rt-namespace.json — 运行时命名空间清单');
M.push('');
M.push('- `Rt.*`（' + ns.Rt.memberCount + ' 成员）: ECS/物理/相机框架类，点分名注入体直接可用（运行时闭包变量真实存在）；');
M.push('- `GS.*`（' + ns.GS.memberCount + ' 成员）: 全局游戏状态单例。');
M.push('- 注意: Rt 由工厂函数动态构建，`{name:"Rt.X"}` 段在 tool 里解析不到——引用成员直接写点分名，或按锚点定位。');
fs.writeFileSync(path.join(__dirname, 'TABLES.md'), M.join('\n'));
console.log('TABLES.md written');
