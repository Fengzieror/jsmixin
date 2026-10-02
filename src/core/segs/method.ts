/*
 * segs/method.ts — 方法段，两种目标形态：
 *  1. 原生 ES6 class：当前节点是 ClassDeclaration/ClassExpression → 搜 ClassBody 的
 *     MethodDefinition（含 get/set/constructor/static；同名 → index 消歧）。
 *  2. babel 方法表：X(ClassName, [{key:"...", value:function(){...}}]) 形态（v1 兼容）。
 *     访问器条目 {key,get/set:fn} 同样支持。实测各构建器产出的表调用形态：
 *       - 两参：X(Cls, [proto])                              —— babel _createClass 常规
 *       - 三参：X(Cls, null, [static])                        —— 静态方法表
 *       - 三参：X(Cls, [proto], [static])                     —— 部分构建把两张表一起传
 *     三参形态对两个数组都扫描（proto 在前、static 在后，key 命中哪张算哪张）。
 *     在当前节点整个子树里扫描；身份校验分两档（v2.2 链式指位）：
 *       - seg.cls 显式给出 → 严格按第一参名过滤（用户明确指定类名）；
 *       - clsName 来自链上段（{name:'Xr'} → {method:...}）→ 放宽为【位置身份】：
 *         工厂 IIFE 内 babel 会把类重命名成 t/a 等（外名 Xr 根本不出现），
 *         名字过滤必然落空；而扫描范围本身就是上一段解析出的节点子树，
 *         "调用落在链上节点内"这一位置关系即为身份证明。
 */
import { isClassNode, isFnNode, hasBlockBody, walkAll } from '../features.js';
import type { PathSeg, ResolveResult } from '../types.js';
import { pick } from './pick.js';

function classMethodCandidates(clsNode: any, method: string): { fn: any; cls: string | null }[] {
    const candidates: { fn: any; cls: string | null }[] = [];
    const body = clsNode.body && clsNode.body.body ? clsNode.body.body : [];
    for (let i = 0; i < body.length; i++) {
        const md = body[i];
        if (!md || md.type !== 'MethodDefinition' || md.computed) continue;
        const kv = md.key && (md.key.type === 'Identifier' ? md.key.name : (md.key.type === 'Literal' ? md.key.value : null));
        if (kv === method && isFnNode(md.value) && hasBlockBody(md.value)) candidates.push({ fn: md.value, cls: null });
    }
    return candidates;
}

function methodTableCandidates(node: any, clsName: string | null, method: string, relaxIdentity: boolean): { fn: any; cls: string | null }[] {
    const candidates: { fn: any; cls: string | null }[] = [];
    walkAll(node, function (n: any): void {
        if (n.type !== 'CallExpression') return;
        const args = n.arguments;
        if (!args || (args.length !== 2 && args.length !== 3)) return;
        if (!args[0] || args[0].type !== 'Identifier') return;
        // 身份过滤：显式 cls 严格；链上带出的名字在链式子树里放宽为位置身份（见文件头注释）
        if (clsName && args[0].name !== clsName && !relaxIdentity) return;
        // 三参形态两张表都收集：proto 表与 static 表（旧约定 args[1]===null 表示仅 static）
        let tables: any[] = [];
        if (args[1] && args[1].type === 'ArrayExpression') tables.push(args[1]);
        if (args.length === 3 && args[2] && args[2].type === 'ArrayExpression') tables.push(args[2]);
        for (let ti = 0; ti < tables.length; ti++) {
            const props = tables[ti].elements;
            for (let i = 0; i < props.length; i++) {
                // 元素形如 { key: "createChildren", value: function(){...} }
                const el = props[i];
                if (!el || el.type !== 'ObjectExpression') continue;
                let keyVal: any, valNode: any;
                for (let j = 0; j < el.properties.length; j++) {
                    const pp = el.properties[j];
                    if (pp.type !== 'Property' && pp.type !== 'ObjectProperty') continue;
                    const pn = pp.key && (pp.key.name || pp.key.value);
                    if (pn === 'key') keyVal = pp.value && (pp.value.type === 'Literal' ? pp.value.value : pp.value.name);
                    else if (pn === 'value' || pn === 'get' || pn === 'set') valNode = pp.value;
                }
                if (keyVal === method && isFnNode(valNode) && hasBlockBody(valNode)) candidates.push({ fn: valNode, cls: args[0].name });
            }
        }
    });
    return candidates;
}

function pickFrom(candidates: { fn: any; cls: string | null }[], seg: PathSeg, src: string, what: string): ResolveResult {
    const r = pick(candidates.map(function (c) { return c.fn; }), seg, src, what);
    if (r.error) return r;
    const chosen = candidates[r.index || 0];
    return { node: chosen.fn, asName: chosen.cls };
}

export function resolveMethod(node: any, seg: PathSeg, src: string, prevAsName: string | null): ResolveResult {
    const method = seg.method as string;
    if (isClassNode(node)) {
        return pickFrom(classMethodCandidates(node, method), seg, src, 'method ' + method + ' of class');
    }
    const explicit = !!seg.cls;
    const clsName = seg.cls || prevAsName || null;
    // 链式子树扫描：node 即上一段解析结果，位置身份成立 → 放宽名字过滤
    return pickFrom(methodTableCandidates(node, clsName, method, !explicit),
        seg, src, 'method ' + method + (clsName ? ' of ' + clsName : ''));
}

// 上一层回退供 resolvePath 使用：非 IIFE 包装的类，方法表调用是类绑定语句的兄弟。
// 扫描范围是父节点（包含全模块），位置身份无意义 → 保留严格名字过滤。
export function resolveMethodAt(node: any, seg: PathSeg, src: string, prevAsName: string | null): ResolveResult {
    const method = seg.method as string;
    const clsName = seg.cls || prevAsName || null;
    return pickFrom(methodTableCandidates(node, clsName, method, !!seg.cls),
        seg, src, 'method ' + method + (clsName ? ' of ' + clsName : ''));
}
