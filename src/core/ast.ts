/*
 * ast.ts — AST 精确定位引擎（mixinAst v1.2.1 的 TypeScript 移植 + v2 扩展）
 *
 * 设计（DESIGN-target.md / docs/DESIGN-v2.md）：
 *   - 路径逐段解析，每段候选必须唯一（除非显式写 index），0 个或多个 → 整个 patch 拒绝并列出候选。
 *   - 编辑全部基于原始 source 切片（start/end/text），不重新生成代码，目标节点之外字节原样保留。
 *   - 任何失败 fail-safe：调用方拿到原字符串，程序照常运行。
 *
 * v2 扩展（相对 v1.2.1）：
 *   - 新段 {class:'Name'}（原生 ES6 class）与 {wrap:'cjs'|'umd'|'iife'}（打包器解包段）。
 *   - 新 op redirect / wrapCall / modifyArg：在目标函数子树内按 callee 点分名定位调用点
 *     （对齐 Sponge @Redirect 与 MixinExtras @WrapOperation / @ModifyArg 语义）。
 *
 * acorn 由调用方注入（setAcorn / createMixinEngine({acorn})）；保持与 v1 相同的
 * 全局回退（globalThis.acorn），兼容 vendor/acorn.js 先加载的 LayaNative 组装线。
 */
import { isFnNode, hasBlockBody, dottedName, calleeName, walkAll, describeFn, logable, directChildFns, fnFeatures, matchAnchor } from './features.js';
import { resolveModule } from './segs/module.js';
import { resolveName } from './segs/name.js';
import { resolveCall } from './segs/call.js';
import { resolveFnIndex } from './segs/fnIndex.js';
import { resolveAnchor } from './segs/anchor.js';
import { resolveMethod, resolveMethodAt } from './segs/method.js';
import { resolveClass } from './segs/klass.js';
import { resolveWrap } from './segs/wrap.js';
import type { Anchor, Patch, PathSeg, PatchStats, ResolveResult, SourceEdit, AstInternals } from './types.js';

export const VERSION = '2.1.0';

/* ---------- acorn 注入 ---------- */

let _acorn: any = null;

export function setAcorn(a: any): void { _acorn = a; }

function getAcorn(): any {
    if (_acorn) return _acorn;
    return (globalThis as any).acorn || null;
}

/* ---------- 路径段解析 ---------- */

export function resolvePath(ast: any, path: PathSeg[], src: string): ResolveResult {
    const chain: any[] = [ast]; // 已解析节点链，末位 = 当前节点
    let prevAsName: string | null = null;
    for (let i = 0; i < path.length; i++) {
        const seg = path[i];
        let node = chain[chain.length - 1];
        let r: ResolveResult;
        if (seg.module != null) r = resolveModule(node, seg, src);
        else if (seg.name != null) r = resolveName(node, seg, src);
        else if (seg.call != null) r = resolveCall(node, seg, src);
        else if (seg.fn != null) r = resolveFnIndex(node, seg, src);
        else if (seg.method != null) {
            r = resolveMethod(node, seg, src, prevAsName);
            if (r.error && chain.length > 1 && /0 个候选/.test(r.error)) {
                // 非 IIFE 包装的类：方法表调用是类绑定语句的兄弟（不在类函数体内）。
                // 回退到上一层的子树里找 —— cls 名字过滤仍然保证身份，唯一性仍然强制。
                const up = resolveMethodAt(chain[chain.length - 2], seg, src, prevAsName);
                if (!up.error) r = up;
            }
        }
        else if (seg.class != null) r = resolveClass(node, seg, src);
        else if (seg.wrap != null) r = resolveWrap(node, seg, src);
        else if (seg.anchor) r = resolveAnchor(node, seg, src);
        else return { error: 'path[' + i + '] 段类型无法识别（需 module/name/call/fn/method/anchor/class/wrap）' };
        if (r.error) return { error: 'path[' + i + '] ' + r.error };
        node = r.node;
        chain.push(node);
        prevAsName = r.asName || null;
        if (isFnNode(node) && !hasBlockBody(node)) {
            return { error: 'path[' + i + '] 目标函数体不是块（箭头函数表达式体），无法注入' };
        }
    }
    return { node: chain[chain.length - 1] };
}

/* ---------- op 应用：产出 {start,end,text} 编辑，基于原 source ---------- */

// 注入体是"函数体语句"（可含 return），包一层函数做语法校验
function validateBodyCode(code: string, where: string): void {
    const acorn = getAcorn();
    if (!acorn) throw new Error('acorn 未加载');
    try { acorn.parse('(function(){' + code + '})', { ecmaVersion: 'latest' }); } catch (e: any) {
        throw new Error(where + ' 注入体语法错误: ' + e.message);
    }
}

// 注入体是"表达式"
function validateExprCode(code: string, where: string): void {
    const acorn = getAcorn();
    if (!acorn) throw new Error('acorn 未加载');
    try { acorn.parse('(' + code + ')', { ecmaVersion: 'latest' }); } catch (e: any) {
        throw new Error(where + ' 注入体不是合法表达式: ' + e.message);
    }
}

// 注入体收"表达式"或"函数体语句"两种形式（redirect/modifyArg 用）：
// 表达式 → 内联求值；语句体（可含 return）→ 包 IIFE。
// 返回 'expr' | 'body'，都不合法时抛错。
function validateExprOrBody(code: string, where: string): 'expr' | 'body' {
    const acorn = getAcorn();
    if (!acorn) throw new Error('acorn 未加载');
    try { acorn.parse('(' + code + ')', { ecmaVersion: 'latest' }); return 'expr'; } catch (e) { /* 试语句体 */ }
    try { acorn.parse('(function(){' + code + '})', { ecmaVersion: 'latest' }); return 'body'; } catch (e: any) {
        throw new Error(where + ' 注入体不是合法表达式/语句体: ' + e.message);
    }
}

/* ---------- 调用点定位（redirect / wrapCall / modifyArg 共用） ---------- */

// 目标函数子树内匹配 patch.call 的调用点（源码顺序，确定性）；params 可选过滤
function findCallSites(fn: any, patch: Patch, src: string): any[] {
    const sites: any[] = [];
    walkAll(fn, function (n: any): void {
        if (n === fn) return;
        if (n.type !== 'CallExpression') return;
        const nm = calleeName(n.callee);
        if (nm !== patch.call) return;
        if (patch.params != null && n.arguments.length !== patch.params) return;
        sites.push(n);
    });
    return sites;
}

// 与 modify op 相同的消歧纪律：多命中需 nth/all，0 命中报错
function disambiguateSites(sites: any[], patch: Patch, op: string): any[] {
    if (!sites.length) throw new Error(op + ': 目标函数内 0 处命中调用 "' + patch.call + '"');
    if (sites.length > 1 && patch.all !== true && patch.nth == null) {
        throw new Error(op + ': ' + sites.length + ' 处命中调用 "' + patch.call + '"，需写 nth 或 all:true');
    }
    if (patch.all !== true) {
        const nth = patch.nth == null ? 0 : patch.nth;
        if (nth < 0 || nth >= sites.length) {
            throw new Error(op + ': nth ' + nth + ' 越界（命中 ' + sites.length + ' 处）');
        }
        return [sites[nth]];
    }
    return sites;
}

// 实参列表的源码文本（逗号连接；展开实参原样保留）
function argsSource(callNode: any, src: string): string {
    return callNode.arguments.map(function (a: any) { return src.slice(a.start, a.end); }).join(', ');
}

function applyOp(fn: any, patch: Patch, src: string, edits: SourceEdit[]): void {
    const op = patch.op;
    const code = patch.code as string;

    /* —— wrapValue 的 find 形态（@ModifyExpressionValue 按表达式文本定位）——
     * 表达式照常求值，结果经 $value 包装：EXPR → (function ($value){ CODE })(EXPR) */
    if (op === 'wrapValue' && patch.call == null) {
        if (!isFnNode(fn) || !hasBlockBody(fn)) {
            throw new Error('op 目标不是块体函数：' + describeFn(fn, src));
        }
        if (!patch.find || typeof patch.find !== 'string') throw new Error('wrapValue 需要 find（表达式精确文本）或 call（调用点分名）');
        validateBodyCode(code, 'wrapValue');
        try { getAcorn().parse('(' + patch.find + ')', { ecmaVersion: 'latest' }); } catch (e: any) {
            throw new Error('wrapValue.find 不是合法表达式: ' + e.message);
        }
        const matches: any[] = [];
        walkAll(fn, function (n: any): void {
            if (n === fn) return;
            if (src.slice(n.start, n.end) === patch.find) matches.push(n);
        });
        if (!matches.length) throw new Error('wrapValue: 目标函数内 0 处命中 "' + patch.find + '"');
        // 去内层：嵌套同文本只保留最外层（坐标嵌套 = 重叠损坏）
        const kept = matches.filter(function (n: any): boolean {
            return !matches.some(function (m: any): boolean { return m !== n && m.start <= n.start && m.end >= n.end; });
        });
        if (kept.length > 1 && patch.all !== true && patch.nth == null) {
            throw new Error('wrapValue: ' + kept.length + ' 处命中 "' + patch.find + '"，需写 nth 或 all:true');
        }
        let targets = kept;
        if (patch.all !== true) {
            const nth = patch.nth == null ? 0 : patch.nth;
            if (nth < 0 || nth >= kept.length) throw new Error('wrapValue: nth ' + nth + ' 越界（命中 ' + kept.length + ' 处）');
            targets = [kept[nth]];
        }
        for (let ti = 0; ti < targets.length; ti++) {
            const t = targets[ti];
            edits.push({ start: t.start, end: t.end,
                text: '(function ($value) {\n' + code + '\n})(' + src.slice(t.start, t.end) + ')' });
        }
        return;
    }

    /* —— 调用点级 op：目标函数子树内的某个调用（v2 新增）—— */
    if (op === 'redirect' || op === 'wrapCall' || op === 'modifyArg'
        || op === 'wrapValue' || op === 'modifyArgs') {
        if (!isFnNode(fn)) throw new Error('op 目标不是函数：' + describeFn(fn, src));
        if (!patch.call) throw new Error(op + ' 需要 call（目标调用的 callee 点分名，支持 this.x）');
        if (op === 'wrapValue' && patch.find) throw new Error('wrapValue 的 call 与 find 只能二选一');
        if (code == null || typeof code !== 'string') throw new Error(op + ' 需要 code');
        const sites = disambiguateSites(findCallSites(fn, patch, src), patch, op);
        for (let i = 0; i < sites.length; i++) {
            const callNode = sites[i];
            const argsSrc = argsSource(callNode, src);
            let text: string;
            let editStart = callNode.start, editEnd = callNode.end;
            if (op === 'redirect') {
                // 整体替换调用：实参按原位置求值一次进 $args；this 不保留（需要 this 用 wrapCall）。
                // code 是表达式 → 内联；是语句体（可 return）→ 包 IIFE。
                const kind = validateExprOrBody(code, 'redirect');
                text = kind === 'expr'
                    ? '(function ($args) { return (' + code + '); })([' + argsSrc + '])'
                    : '(function ($args) {\n' + code + '\n})([' + argsSrc + '])';
            } else if (op === 'wrapCall') {
                // 包装调用：$orig() 无参转发原实参；$orig(a,b) 显式改参；$args 原实参数组。
                // 成员调用保留原 this（apply 对象取 callee.object 源码，闭包内求值）。
                validateBodyCode(code, 'wrapCall');
                const callee = callNode.callee;
                const calleeSrc = src.slice(callee.start, callee.end);
                const fwdThis = (callee.type === 'MemberExpression' && callee.object)
                    ? src.slice(callee.object.start, callee.object.end) : 'this';
                text = '(function ($args) {\n'
                    + 'var $orig = function () { return (' + calleeSrc + ').apply(' + fwdThis
                    + ', arguments.length ? arguments : $args); };\n'
                    + code + '\n})([' + argsSrc + '])';
            } else if (op === 'wrapValue') {
                // @ModifyExpressionValue：调用照常执行，其结果经 $value 包装
                validateBodyCode(code, 'wrapValue');
                text = '(function ($value) {\n' + code + '\n})(' + src.slice(callNode.start, callNode.end) + ')';
            } else if (op === 'modifyArgs') {
                // @ModifyArgs：code($args) 返回新实参数组，整体重组调用。
                // 成员调用保留原 this（apply 对象取 callee.object 源码）；
                // 普通调用 this 用 undefined（与原 plain call 的 sloppy 语义一致，不能借用目标函数的 this）。
                validateBodyCode(code, 'modifyArgs');
                const callee = callNode.callee;
                const calleeSrc = src.slice(callee.start, callee.end);
                const fwdThis = (callee.type === 'MemberExpression' && callee.object)
                    ? src.slice(callee.object.start, callee.object.end) : 'undefined';
                text = '(' + calleeSrc + ').apply(' + fwdThis
                    + ', (function ($args) {\n' + code + '\n})([' + argsSrc + ']))';
            } else { // modifyArg
                // 包装单个实参：$arg 原实参值，code 表达式（或语句体）求值结果替换该实参。
                // 只替换目标实参表达式，调用本身保留（helper(包装($arg)) 语义）。
                const kind = validateExprOrBody(code, 'modifyArg');
                const argIdx = patch.arg;
                if (argIdx == null || typeof argIdx !== 'number' || argIdx < 0) {
                    throw new Error('modifyArg 需要 arg（实参槽位序号）');
                }
                if (argIdx >= callNode.arguments.length) {
                    throw new Error('modifyArg: arg ' + argIdx + ' 越界（该调用共 ' + callNode.arguments.length + ' 个实参）');
                }
                const argNode = callNode.arguments[argIdx];
                if (argNode.type === 'SpreadElement') {
                    throw new Error('modifyArg: 实参 ' + argIdx + ' 是展开语法（...），无法单独包装');
                }
                editStart = argNode.start; editEnd = argNode.end;
                const argSrc = src.slice(argNode.start, argNode.end);
                text = kind === 'expr'
                    ? '(function ($arg) { return (' + code + '); })(' + argSrc + ')'
                    : '(function ($arg) {\n' + code + '\n})(' + argSrc + ')';
            }
            // 组装文本必须自身可解析（fail-fast，防止拼出坏代码静默入库）
            const acorn = getAcorn();
            try { acorn.parse('(' + text + ')', { ecmaVersion: 'latest' }); } catch (e: any) {
                throw new Error(op + ' 组装文本语法错误: ' + e.message);
            }
            edits.push({ start: editStart, end: editEnd, text: text });
        }
        return;
    }

    if (!isFnNode(fn) || !hasBlockBody(fn)) {
        throw new Error('op 目标不是块体函数：' + describeFn(fn, src));
    }
    if (op === 'inject') {
        const at = patch.at || 'head';
        validateBodyCode(code, 'inject-' + at);
        if (at === 'head') edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: '\n' + code });
        else if (at === 'tail') {
            // 对齐 Java Mixin @At("TAIL")：函数最后一条语句是 return 时，注入到它之前
            // （落在 return 之后是死代码）；否则注入到函数体末尾。
            // 前导 ';' 防御 ASI 邻接：原末句可能无分号（靠 } 结束），
            // 直接拼接会被解析成对原表达式返回值的调用（真机踩过：jS.init(...)(注入IIFE) → TypeError）。
            let pos = fn.body.end - 1;
            const stmts = fn.body.body;
            if (stmts.length && stmts[stmts.length - 1].type === 'ReturnStatement') pos = stmts[stmts.length - 1].start;
            edits.push({ start: pos, end: pos, text: '\n;' + code + '\n' });
        }
        else throw new Error('inject at 仅支持 head/tail，收到 ' + at);
    } else if (op === 'overwrite') {
        validateBodyCode(code, 'overwrite');
        edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: '\n' + code + '\n' });
    } else if (op === 'wrap') {
        validateBodyCode(code, 'wrap');
        const paramText = fn.params.length ? src.slice(fn.params[0].start, fn.params[fn.params.length - 1].end) : '';
        const origBody = src.slice(fn.body.start + 1, fn.body.end - 1);
        const n = '_' + fn.start;
        // $orig() 无参 = 转发原始实参；$orig(a, b) 显式改参。
        // 原始实参经 __mixin_args（第二包装参数）暴露给注入体——不要用 arguments：
        // 包装函数自身的 arguments[0] 是转发函数（真机踩坑：getComponentName 拿 arguments[0]
        // 当 id → 所有组件名变成 "component_name_" + 函数源码）。
        const newBody =
            '\nfunction __mixin_orig' + n + '(' + paramText + ') {' + origBody + '}\n' +
            'var __mixin_args' + n + ' = arguments;\n' +
            'return (function ($orig, __mixin_args) {\n' + code + '\n})(function () {' +
            'return __mixin_orig' + n + '.apply(this, arguments.length ? arguments : __mixin_args' + n + '); }, __mixin_args' + n + ');\n';
        edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: newBody });
    } else if (op === 'modifyReturn') {
        // @ModifyReturnValue：原函数体保真内移为 __mixin_origN，返回值经 $value 包装。
        // 与 wrap 的区别：注入体拿到的是【已求值的返回值】（$value），不是可再调用的 $orig。
        // code 必须返回新返回值；this 与实参经 call/arguments 原样转发。
        validateBodyCode(code, 'modifyReturn');
        const mrParams = fn.params.length ? src.slice(fn.params[0].start, fn.params[fn.params.length - 1].end) : '';
        const mrBody = src.slice(fn.body.start + 1, fn.body.end - 1);
        const mn = '_' + fn.start;
        const mrBodyNew =
            '\nfunction __mixin_orig' + mn + '(' + mrParams + ') {' + mrBody + '}\n' +
            'return (function ($value) {\n' + code + '\n})(__mixin_orig' + mn + '.apply(this, arguments));\n';
        edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: mrBodyNew });
    } else if (op === 'modify') {
        // 修改目标函数子树内表达式节点的源码文本（README v2：修改数值字面量；
        // 泛化为任意表达式精确文本替换）。
        //   find    必填。节点源码文本的精确匹配（按 trim 后逐节点比对）
        //   replace 必填。替换文本（须为合法表达式）
        //   nth     可选。命中多个时取第 n 个（0 起）；未写且命中>1 → 拒绝
        //   all     可选。替换全部命中（嵌套同文本时保留最外层，其余丢弃——
        //           坐标嵌套=重叠=静默损坏，交给统一的 overlap 拒绝逻辑前先去内层）
        if (!patch.find || typeof patch.find !== 'string') throw new Error('modify 需要 find（节点源码精确文本）');
        if (patch.replace == null || typeof patch.replace !== 'string') throw new Error('modify 需要 replace（替换表达式文本）');
        // find/replace 可以是表达式，也可以是完整语句（如 "return x"）——
        // 单语句 Program 都能解析即合法；插入形态按被替换节点种类决定
        function modParseKind(text: string, what: string): string {
            let eMsg: string | null = null;
            try {
                const ast = getAcorn().parse(text, { ecmaVersion: 'latest' });
                const first = ast.body[0];
                return (ast.body.length === 1 && first && first.type === 'ExpressionStatement') ? 'expr' : 'stmt';
            } catch (e0: any) { eMsg = e0.message; }
            try {
                // Program 层非法的语句（return/break/...）放进函数体再验
                const f = getAcorn().parse('(function(){' + text + '})', { ecmaVersion: 'latest' });
                const body = f.body[0].expression.body.body;
                if (body.length === 1) return 'stmt';
            } catch (e1: any) { /* 落到统一报错 */ }
            throw new Error('modify.' + what + ' 不是合法表达式/语句: ' + eMsg);
        }
        modParseKind(patch.find, 'find');
        modParseKind(patch.replace, 'replace');
        const matches: any[] = [];
        walkAll(fn, function (n: any): void {
            if (n === fn) return;
            if (src.slice(n.start, n.end) === patch.find) matches.push(n);
        });
        if (!matches.length) throw new Error('modify: 目标函数内 0 处命中 "' + patch.find + '"');
        // 去内层：文本相同的嵌套节点只保留最外层（文本一致，外层替换结果相同且坐标安全）
        const kept = matches.filter(function (n: any): boolean {
            return !matches.some(function (m: any): boolean { return m !== n && m.start <= n.start && m.end >= n.end; });
        });
        if (kept.length > 1 && patch.all !== true && patch.nth == null) {
            throw new Error('modify: ' + kept.length + ' 处命中 "' + patch.find + '"，需写 nth 或 all:true');
        }
        let targets = kept;
        if (patch.all !== true) {
            const nth = patch.nth == null ? 0 : patch.nth;
            if (nth < 0 || nth >= kept.length) throw new Error('modify: nth ' + nth + ' 越界（命中 ' + kept.length + ' 处）');
            targets = [kept[nth]];
        }
        for (let ti = 0; ti < targets.length; ti++) {
            const isStmt = /Statement$|Declaration$/.test(targets[ti].type);
            edits.push({ start: targets[ti].start, end: targets[ti].end,
                text: isStmt ? patch.replace : '(' + patch.replace + ')' });
        }
    } else if (op === 'log') {
        // 便捷 op：等价 inject + console.log
        edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: '\nconsole.log(' + JSON.stringify(String(patch.message || '[mixin] hit')) + ');\n' });
    } else {
        throw new Error('未知 op: ' + op);
    }
}

function applyEdits(src: string, edits: SourceEdit[]): string {
    // 同点零长插入按接受顺序的逆序应用（后应用者出现在文本更前），
    // 使先接受的（priority 更高）最终排在文本前面——与串行管线一致（#7）
    edits.sort(function (a, b) { return b.start - a.start || b.end - a.end || (b.seq || 0) - (a.seq || 0); });
    let out = src;
    for (let i = 0; i < edits.length; i++) {
        const e = edits[i];
        out = out.slice(0, e.start) + e.text + out.slice(e.end);
    }
    return out;
}

/* ---------- 对外入口 ---------- */

/*
 * 两个编辑区间是否重叠（边界相接不算）。两类一律判冲突：
 *   1. 区间相交（含零长插入落在另一编辑区间内部）；
 *   2. 零长插入压在另一编辑的起点上（#7）：应用顺序决定插入落在替换文本之前还是之后，
 *      批量快路径与串行管线对此会产出不同结果——语义歧义，必须拒绝。
 */
function editsOverlap(a: SourceEdit, b: SourceEdit): boolean {
    if (a.start < b.end && b.start < a.end) return true;
    const zeroA = a.start === a.end, zeroB = b.start === b.end;
    if (zeroA !== zeroB && a.start === b.start) return true;
    return false;
}

function findOverlap(accepted: SourceEdit[], incoming: SourceEdit[]): string | null {
    for (let i = 0; i < accepted.length; i++) {
        for (let j = 0; j < incoming.length; j++) {
            if (editsOverlap(accepted[i], incoming[j])) {
                return '新编辑 @' + incoming[j].start + '..' + incoming[j].end +
                    ' 与已接受编辑 @' + accepted[i].start + '..' + accepted[i].end + ' 重叠';
            }
        }
    }
    return null;
}

// 同一 patch 产出的多条编辑两两互检（#2）：findOverlap 只查"已接受 vs 新来"，
// 查不到同 patch 内部重叠（如 all:true 命中嵌套同名调用），此前会静默产出损坏代码
function findSelfOverlap(edits: SourceEdit[]): string | null {
    for (let i = 0; i < edits.length; i++) {
        for (let j = i + 1; j < edits.length; j++) {
            if (editsOverlap(edits[i], edits[j])) {
                return 'patch 内部第 ' + i + ' 条编辑 @' + edits[i].start + '..' + edits[i].end +
                    ' 与第 ' + j + ' 条 @' + edits[j].start + '..' + edits[j].end + ' 重叠' +
                    '（嵌套同名调用点等）';
            }
        }
    }
    return null;
}

/*
 * applyAstPatches(filename, source, patches [, stats]) → string
 * patches: [{ path: [...], op, code/at/message, name? }]
 * 单个 patch 失败（定位失败/重叠冲突）→ 跳过该 patch 并打日志，其余照常；
 * 解析（acorn.parse）失败 → 整体返回原 source。
 * 编辑坐标全部基于原始 source，因此重叠 = 坐标错位 = 静默损坏，必须拒绝。
 * 传入 stats 对象（可选，构建工具产物校验用）→ 得到 { applied, skipped:[label] }。
 */
export function applyAstPatches(filename: string, source: string, patches: Patch[], stats?: PatchStats): string {
    const acorn = getAcorn();
    if (!acorn) { logable('acorn 未加载，跳过 AST patch: ' + filename); return source; }
    const t0 = Date.now();
    let ast: any;
    let parseErr: any = null;
    let parseMode: any = { ecmaVersion: 'latest' };
    try {
        ast = acorn.parse(source, parseMode);
    } catch (e1: any) {
        // ESM（import/export）需要 sourceType:'module'：script 失败后自动重试 module 模式。
        // 普通脚本目标不受影响（首轮已成功）；两种模式都失败才放弃（fail-safe 返回原文）。
        parseErr = e1;
        parseMode = { ecmaVersion: 'latest', sourceType: 'module' };
        try {
            ast = acorn.parse(source, parseMode);
        } catch (e2: any) {
            logable('ERROR: ' + filename + ' 解析失败，跳过全部 AST patch: ' + parseErr.message);
            return source;
        }
    }
    logable('parsed ' + filename + ' in ' + (Date.now() - t0) + 'ms');
    let accepted: SourceEdit[] = [];
    let ok = 0;
    const skipped: string[] = [];
    for (let i = 0; i < patches.length; i++) {
        const patch = patches[i];
        const label = patch.name || ('patch#' + i);
        try {
            const r = resolvePath(ast, patch.path, source);
            if (r.error) { logable('SKIP ' + label + ': ' + r.error); skipped.push(label + ': ' + r.error); continue; }
            const patchEdits: SourceEdit[] = [];
            applyOp(r.node, patch, source, patchEdits);
            const conflict = findOverlap(accepted, patchEdits) || findSelfOverlap(patchEdits);
            if (conflict) { logable('SKIP ' + label + ': ' + conflict + '（坐标基于原文件，重叠会静默损坏，拒绝该 patch）'); skipped.push(label + ': ' + conflict); continue; }
            accepted = accepted.concat(patchEdits);
            logable('OK ' + label + ' (' + patchEdits.length + ' 处编辑) → ' + describeFn(r.node, source));
            ok++;
        } catch (e: any) {
            logable('SKIP ' + label + ': ' + e.message);
            skipped.push(label + ': ' + e.message);
        }
    }
    if (stats) { stats.applied = ok; stats.skipped = skipped; }
    if (ok === 0) {
        logable('WARN: ' + filename + ' 没有 AST patch 生效（fail-safe 返回原文件）');
        return source;
    }
    for (let i = 0; i < accepted.length; i++) accepted[i].seq = i;
    const out = applyEdits(source, accepted);
    // 最终产物 re-parse 自检（#5）：局部拼接错误绝不允许静默入库。
    // 失败 → 整文件回滚返回原文（见 docs/error-policy.md：运行时"中止"的上限就是打回原样）。
    let reparseOk = false;
    let reparseErr: any = null;
    try { acorn.parse(out, parseMode); reparseOk = true; } catch (e3: any) { reparseErr = e3; }
    if (!reparseOk && parseMode.sourceType === 'module') {
        try { acorn.parse(out, { ecmaVersion: 'latest' }); reparseOk = true; } catch (e4: any) { reparseErr = e4; }
    }
    if (!reparseOk) {
        logable('ERROR: ' + filename + ' 补丁产物语法校验失败，整体回滚（fail-safe 返回原文件）: ' + reparseErr.message);
        if (stats) { stats.applied = 0; stats.skipped = skipped.concat(['(产物回滚): ' + reparseErr.message]); }
        return source;
    }
    logable('applied ' + ok + '/' + patches.length + ' AST patches to ' + filename);
    return out;
}

/* ---------- 兼容出口（__mixinAst._internals） ---------- */

export const internals: AstInternals = {
    directChildFns: (node: any) => directChildFns(node),
    fnFeatures: (fn: any) => fnFeatures(fn),
    matchAnchor: (fn: any, anchor?: Anchor) => matchAnchor(fn, anchor),
    resolvePath: (ast: any, path: PathSeg[], src: string) => resolvePath(ast, path, src),
    applyEdits: (src: string, edits: SourceEdit[]) => applyEdits(src, edits),
    // v2：调用点定位暴露给构建工具做构建期预检（findCallSites(fn, patch, src)）
    findCallSites: (fn: any, patch: any, src: string) => findCallSites(fn, patch, src),
    // v2.1：子树遍历暴露给构建工具做 @Local 存在性校验
    walkAll: (root: any, cb: (n: any) => void) => walkAll(root, cb)
};
