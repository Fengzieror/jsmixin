/*
 * mixinAst.js — mixin AST 精确定位引擎 v1
 *
 * 依赖全局 acorn（由 vendor/acorn.js 提供，加载顺序：acorn.js → mixinAst.js → mixinTransformer.js）。
 * 设计见 DESIGN-target.md：
 *   - 路径逐段解析，每段候选必须唯一（除非显式写 index），0 个或多个 → 整个 patch 拒绝并列出候选。
 *   - 编辑全部基于原始 source 切片（start/end/text），不重新生成代码，目标节点之外字节原样保留。
 *   - 任何失败 fail-safe：调用方拿到原字符串，游戏照常运行。
 *
 * 本文件保持 ES5 写法。
 */
(function (global) {
    'use strict';

    var VERSION = '1.1.0'; // 1.1.0: inject tail 对齐 @At("TAIL")（末尾 return 前插入）；applyAstPatches 可选 stats

    function log(msg) {
        try { console.log('[mixin-ast] ' + msg); } catch (e) { /* ignore */ }
    }

    function isFnNode(n) {
        return n && (n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression');
    }

    function hasBlockBody(fn) {
        return fn.body && fn.body.type === 'BlockStatement';
    }

    /* ---------- 遍历：收集“直接子函数”（最近外层函数为本节点的函数） ---------- */

    // 成员表达式 → 点分名 'a.b.c'（仅 Identifier 链），否则 null
    function dottedName(n) {
        var parts = [];
        while (n && n.type === 'MemberExpression' && !n.computed && n.property && n.property.type === 'Identifier') {
            parts.unshift(n.property.name);
            n = n.object;
        }
        if (n && n.type === 'Identifier') { parts.unshift(n.name); return parts.join('.'); }
        return null;
    }

    // 返回 [{ fn, asName, idName }]。名字解析规则：
    //   - FunctionDeclaration / 具名函数表达式：idName = 自身 id
    //   - var X = fn / X = fn / a.b.c = fn：asName = 绑定名（赋值取完整点分名）
    //   - var V = { m: fn } / V.m = { sub: fn }（命名空间对象）：asName = 'V.m' / 'V.m.sub'
    // 不深入子函数内部（它们属于下一层）。
    function directChildFns(node) {
        var out = [];
        function visit(n, bind, prefix) {
            if (!n || typeof n !== 'object') return;
            if (Array.isArray(n)) {
                for (var i = 0; i < n.length; i++) visit(n[i], null, null);
                return;
            }
            if (typeof n.type !== 'string') return;
            if (isFnNode(n) && n !== node) {
                var id = n.id ? n.id.name : null;
                out.push({ fn: n, asName: bind, idName: id });
                return;
            }
            var cBind = null, cPrefix = null;
            if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier') {
                if (isFnNode(n.init)) cBind = n.id.name;
                else if (n.init && n.init.type === 'ObjectExpression') cPrefix = n.id.name;
            } else if (n.type === 'AssignmentExpression') {
                var dn = dottedName(n.left);
                if (dn) {
                    if (isFnNode(n.right)) cBind = dn;
                    else if (n.right && n.right.type === 'ObjectExpression') cPrefix = dn;
                }
            } else if ((n.type === 'ObjectProperty' || n.type === 'Property') && prefix) {
                var kv = n.key && (n.key.type === 'Literal' ? n.key.value : n.key.name);
                if (typeof kv === 'string') {
                    if (isFnNode(n.value)) cBind = prefix + '.' + kv;
                    else if (n.value && n.value.type === 'ObjectExpression') cPrefix = prefix + '.' + kv;
                }
            } else if (n.type === 'ObjectExpression') {
                cPrefix = prefix; // 命名空间前缀穿透对象字面量，传给属性
            }
            for (var k in n) {
                if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
                var v = n[k];
                if (Array.isArray(v)) { for (var j = 0; j < v.length; j++) visit(v[j], cBind, cPrefix); }
                else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v, cBind, cPrefix);
            }
        }
        visit(node, null, null);
        return out;
    }

    /* ---------- 遍历：整个子树（含嵌套函数内部），用于锚点/方法表扫描 ---------- */

    function walkAll(root, cb) {
        function visit(n) {
            if (!n || typeof n !== 'object') return;
            if (Array.isArray(n)) {
                for (var i = 0; i < n.length; i++) visit(n[i]);
                return;
            }
            if (typeof n.type !== 'string') return;
            cb(n);
            for (var k in n) {
                if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
                var v = n[k];
                if (Array.isArray(v)) { for (var j = 0; j < v.length; j++) visit(v[j]); }
                else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v);
            }
        }
        visit(root);
    }

    /* ---------- 锚点特征提取与匹配 ---------- */

    function fnFeatures(fn) {
        var strings = {};
        var calls = {};
        var params = fn.params ? fn.params.length : -1;
        walkAll(fn, function (n) {
            if (n.type === 'Literal' && typeof n.value === 'string') strings[n.value] = 1;
            else if (n.type === 'TemplateLiteral' && n.quasis) {
                for (var i = 0; i < n.quasis.length; i++) {
                    if (n.quasis[i].value && n.quasis[i].value.cooked) strings[n.quasis[i].value.cooked] = 1;
                }
            } else if (n.type === 'CallExpression') {
                var c = n.callee;
                if (c.type === 'Identifier') calls[c.name] = 1;
                else if (c.type === 'MemberExpression' && !c.computed && c.property.type === 'Identifier') calls[c.property.name] = 1;
            }
        });
        return { strings: Object.keys(strings), calls: Object.keys(calls), params: params };
    }

    function matchAnchor(fn, anchor) {
        if (!anchor) return true;
        var f = fnFeatures(fn);
        var i;
        if (anchor.params != null && f.params !== anchor.params) return false;
        if (anchor.strings) {
            for (i = 0; i < anchor.strings.length; i++) {
                if (f.strings.indexOf(anchor.strings[i]) < 0) return false;
            }
        }
        if (anchor.calls) {
            for (i = 0; i < anchor.calls.length; i++) {
                if (f.calls.indexOf(anchor.calls[i]) < 0) return false;
            }
        }
        return true;
    }

    function describeFn(fn, src) {
        var s = fn.start, e = Math.min(fn.end, fn.start + 160);
        return fn.type + (fn.id ? ' ' + fn.id.name : '') + ' @' + s + '..' + fn.end +
            ' params=' + (fn.params ? fn.params.length : '?') +
            ' "' + src.slice(s, e).replace(/\s+/g, ' ') + (fn.end - s > 160 ? '...' : '') + '"';
    }

    /* ---------- 段解析 ---------- */

    // Program → webpack 模块函数：顶层 ({625:function(){...}})[625]() 形态
    function resolveModule(ast, seg, src) {
        var candidates = [];
        for (var i = 0; i < ast.body.length; i++) {
            var st = ast.body[i];
            var expr = st.type === 'ExpressionStatement' ? st.expression : null;
            if (!expr) continue;
            // 层层剥括号/链式取 member object
            var cur = expr;
            while (cur) {
                var obj = null;
                if (cur.type === 'CallExpression' && cur.callee && cur.callee.type === 'MemberExpression') obj = cur.callee.object;
                else if (cur.type === 'MemberExpression') obj = cur.object;
                else if (cur.type === 'SequenceExpression' && cur.expressions) { cur = cur.expressions[cur.expressions.length - 1]; continue; }
                if (!obj) break;
                if (obj.type === 'ObjectExpression') {
                    for (var p = 0; p < obj.properties.length; p++) {
                        var prop = obj.properties[p];
                        var kv = prop.key && (prop.key.type === 'Literal' ? prop.key.value : prop.key.name);
                        if (kv == seg.module && isFnNode(prop.value)) candidates.push(prop.value);
                    }
                    break;
                }
                cur = obj;
            }
        }
        return pick(candidates, seg, src, 'module ' + seg.module);
    }

    // 具名段：{name:'XS'} 单名（匹配绑定名或函数自身 id）；{name:'V.showToast'}
    // 点分命名空间（只匹配绑定名的完整点分路径，如 a.b.c = fn / V = { m: fn }）
    function resolveName(node, seg, src) {
        var kids = directChildFns(node);
        var wantDot = seg.name.indexOf('.') >= 0;
        var candidates = [];
        for (var i = 0; i < kids.length; i++) {
            var k = kids[i];
            if (wantDot ? (k.asName === seg.name) : (k.asName === seg.name || k.idName === seg.name)) {
                candidates.push(k.fn);
            }
        }
        return pick(candidates, seg, src, 'name ' + seg.name);
    }

    // 具名调用实参段：{ call:'jS.init', arg:0 } —— 定位"传给某个具名函数的回调"。
    // 一次性函数/闭包回调没有绑定名，但它们出现的调用点有名字；
    // 实参槽位是语义位置（回调参数），不是"第几个函数"式的裸序号。
    // 同名调用点必须唯一（多个 → 报错列候选；写更长点分名消歧）。
    function resolveCall(node, seg, src) {
        var argIdx = seg.arg != null ? seg.arg : 0;
        var candidates = [];
        walkAll(node, function (n) {
            if (n.type !== 'CallExpression' || !n.arguments) return;
            var nm = n.callee.type === 'Identifier' ? n.callee.name : dottedName(n.callee);
            if (nm !== seg.call) return;
            var a = n.arguments[argIdx];
            if (a && isFnNode(a) && hasBlockBody(a)) candidates.push(a);
        });
        return pick(candidates, seg, src, 'call ' + seg.call + ' 实参[' + argIdx + ']');
    }

    // 纯结构序号：当前节点的第 n 个直接子函数（AST 源码顺序，确定性）。
    // 零特征寻址的基础段：不使用名字、不使用内容特征。
    function resolveFnIndex(node, seg, src) {
        var kids = directChildFns(node);
        var n = seg.fn;
        if (typeof n !== 'number' || n < 0) return { error: 'fn 必须是非负数字序号' };
        if (n >= kids.length) return { error: 'fn ' + n + ' 越界：该层直接子函数共 ' + kids.length + ' 个' };
        return { node: kids[n].fn, asName: kids[n].asName };
    }

    function resolveAnchor(node, seg, src) {
        var kids = directChildFns(node);
        var candidates = [];
        for (var i = 0; i < kids.length; i++) {
            if (matchAnchor(kids[i].fn, seg.anchor)) candidates.push(kids[i].fn);
        }
        return pick(candidates, seg, src, 'anchor ' + JSON.stringify(seg.anchor));
    }

    // babel 类方法表：X(ClassName, [{key:"...", value:function(){}}]) 形态。
    // 访问器条目 {key:"...", get:fn}（getter/setter）同样支持——取其 get/set 函数。
    // 静态方法表是三参调用 X(Cls, null, [...])（babel _createClass(Cls, null, staticProps)）。
    // 在当前节点整个子树里扫描；若给了 cls（或上一段解析出了绑定名）则校验第一参。
    function resolveMethod(node, seg, src, prevAsName) {
        var clsName = seg.cls || prevAsName || null;
        var candidates = [];
        walkAll(node, function (n) {
            if (n.type !== 'CallExpression') return;
            var args = n.arguments;
            if (!args || (args.length !== 2 && args.length !== 3)) return;
            if (!args[0] || args[0].type !== 'Identifier') return;
            if (clsName && args[0].name !== clsName) return;
            var table = null;
            if (args.length === 2 && args[1] && args[1].type === 'ArrayExpression') table = args[1];
            else if (args.length === 3 && args[1] && args[1].type === 'Literal' && args[1].value === null
                && args[2] && args[2].type === 'ArrayExpression') table = args[2];
            if (!table) return;
            var props = table.elements;
            for (var i = 0; i < props.length; i++) {
                // 元素形如 { key: "createChildren", value: function(){...} }
                var el = props[i];
                if (!el || el.type !== 'ObjectExpression') continue;
                var keyVal, valNode;
                for (var j = 0; j < el.properties.length; j++) {
                    var pp = el.properties[j];
                    if (pp.type !== 'Property' && pp.type !== 'ObjectProperty') continue;
                    var pn = pp.key && (pp.key.name || pp.key.value);
                    if (pn === 'key') keyVal = pp.value && (pp.value.type === 'Literal' ? pp.value.value : pp.value.name);
                    else if (pn === 'value' || pn === 'get' || pn === 'set') valNode = pp.value;
                }
                if (keyVal === seg.method && isFnNode(valNode) && hasBlockBody(valNode)) candidates.push(valNode);
            }
        });
        return pick(candidates, seg, src, 'method ' + seg.method + (clsName ? ' of ' + clsName : ''));
    }

    function pick(candidates, seg, src, what) {
        var hasIndex = seg.index != null; // index:0 也是显式指向，不能当"没写"（falsy 陷阱）
        var idx = hasIndex ? seg.index : 0;
        if (candidates.length === 0) return { error: '0 个候选（' + what + '）' };
        if (candidates.length > 1 && !hasIndex) {
            var list = [];
            for (var i = 0; i < Math.min(candidates.length, 8); i++) list.push(describeFn(candidates[i], src));
            return { error: candidates.length + ' 个候选且未写 index（' + what + '）：' + list.join(' | ') };
        }
        if (idx >= candidates.length) return { error: 'index ' + idx + ' 越界，候选 ' + candidates.length + ' 个（' + what + '）' };
        return { node: candidates[idx] };
    }

    function resolvePath(ast, path, src) {
        var chain = [ast]; // 已解析节点链，末位 = 当前节点
        var prevAsName = null;
        for (var i = 0; i < path.length; i++) {
            var seg = path[i];
            var node = chain[chain.length - 1];
            var r;
            if (seg.module != null) r = resolveModule(node, seg, src);
            else if (seg.name != null) r = resolveName(node, seg, src);
            else if (seg.call != null) r = resolveCall(node, seg, src);
            else if (seg.fn != null) r = resolveFnIndex(node, seg, src);
            else if (seg.method != null) {
                r = resolveMethod(node, seg, src, prevAsName);
                if (r.error && chain.length > 1 && /0 个候选/.test(r.error)) {
                    // 非 IIFE 包装的类：方法表调用是类绑定语句的兄弟（不在类函数体内）。
                    // 回退到上一层的子树里找 —— cls 名字过滤仍然保证身份，唯一性仍然强制。
                    var up = resolveMethod(chain[chain.length - 2], seg, src, prevAsName);
                    if (!up.error) r = up;
                }
            }
            else if (seg.anchor) r = resolveAnchor(node, seg, src);
            else return { error: 'path[' + i + '] 段类型无法识别（需 module/name/fn/method/anchor）' };
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

    // 注入体是“函数体语句”（可含 return），包一层函数做语法校验
    function validateCode(code, where) {
        var acorn = global.acorn;
        if (!acorn) throw new Error('acorn 未加载');
        try { acorn.parse('(function(){' + code + '})', { ecmaVersion: 'latest' }); } catch (e) {
            throw new Error(where + ' 注入体语法错误: ' + e.message);
        }
    }

    function applyOp(fn, patch, src, edits) {
        var op = patch.op;
        var code = patch.code;
        if (!isFnNode(fn) || !hasBlockBody(fn)) {
            throw new Error('op 目标不是块体函数：' + describeFn(fn, src));
        }
        if (op === 'inject') {
            var at = patch.at || 'head';
            validateCode(code, 'inject-' + at);
            if (at === 'head') edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: '\n' + code });
            else if (at === 'tail') {
                // 对齐 Java Mixin @At("TAIL")：函数最后一条语句是 return 时，注入到它之前
                // （落在 return 之后是死代码）；否则注入到函数体末尾。
                // 前导 ';' 防御 ASI 邻接：原末句可能无分号（靠 } 结束），
                // 直接拼接会被解析成对原表达式返回值的调用（真机踩过：jS.init(...)(注入IIFE) → TypeError）。
                var pos = fn.body.end - 1;
                var stmts = fn.body.body;
                if (stmts.length && stmts[stmts.length - 1].type === 'ReturnStatement') pos = stmts[stmts.length - 1].start;
                edits.push({ start: pos, end: pos, text: '\n;' + code + '\n' });
            }
            else throw new Error('inject at 仅支持 head/tail，收到 ' + at);
        } else if (op === 'overwrite') {
            validateCode(code, 'overwrite');
            edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: '\n' + code + '\n' });
        } else if (op === 'wrap') {
            validateCode(code, 'wrap');
            var paramText = fn.params.length ? src.slice(fn.params[0].start, fn.params[fn.params.length - 1].end) : '';
            var origBody = src.slice(fn.body.start + 1, fn.body.end - 1);
            var n = '_' + fn.start;
            // $orig() 无参 = 转发原始实参；$orig(a, b) 显式改参
            var newBody =
                '\nfunction __mixin_orig' + n + '(' + paramText + ') {' + origBody + '}\n' +
                'var __mixin_args' + n + ' = arguments;\n' +
                'return (function ($orig) {\n' + code + '\n})(function () {' +
                'return __mixin_orig' + n + '.apply(this, arguments.length ? arguments : __mixin_args' + n + '); });\n';
            edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: newBody });
        } else if (op === 'log') {
            // 便捷 op：等价 inject + console.log
            edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: '\nconsole.log(' + JSON.stringify(String(patch.message || '[mixin] hit')) + ');\n' });
        } else {
            throw new Error('未知 op: ' + op);
        }
    }

    function applyEdits(src, edits) {
        edits.sort(function (a, b) { return b.start - a.start || b.end - a.end; });
        var out = src;
        for (var i = 0; i < edits.length; i++) {
            var e = edits[i];
            out = out.slice(0, e.start) + e.text + out.slice(e.end);
        }
        return out;
    }

    /* ---------- 对外入口 ---------- */

    // 两个编辑区间是否重叠（零长度插入只与其内部插入冲突；边界相接不算）
    function editsOverlap(a, b) {
        return a.start < b.end && b.start < a.end;
    }

    function findOverlap(accepted, incoming) {
        for (var i = 0; i < accepted.length; i++) {
            for (var j = 0; j < incoming.length; j++) {
                if (editsOverlap(accepted[i], incoming[j])) {
                    return '新编辑 @' + incoming[j].start + '..' + incoming[j].end +
                        ' 与已接受编辑 @' + accepted[i].start + '..' + accepted[i].end + ' 重叠';
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
    function applyAstPatches(filename, source, patches, stats) {
        var acorn = global.acorn;
        if (!acorn) { log('acorn 未加载，跳过 AST patch: ' + filename); return source; }
        var t0 = Date.now();
        var ast;
        try {
            ast = acorn.parse(source, { ecmaVersion: 'latest' });
        } catch (e) {
            log('ERROR: ' + filename + ' 解析失败，跳过全部 AST patch: ' + e.message);
            return source;
        }
        log('parsed ' + filename + ' in ' + (Date.now() - t0) + 'ms');
        var accepted = [];
        var ok = 0;
        var skipped = [];
        for (var i = 0; i < patches.length; i++) {
            var patch = patches[i];
            var label = patch.name || ('patch#' + i);
            try {
                var r = resolvePath(ast, patch.path, source);
                if (r.error) { log('SKIP ' + label + ': ' + r.error); skipped.push(label + ': ' + r.error); continue; }
                var patchEdits = [];
                applyOp(r.node, patch, source, patchEdits);
                var conflict = findOverlap(accepted, patchEdits);
                if (conflict) { log('SKIP ' + label + ': ' + conflict + '（坐标基于原文件，重叠会静默损坏，拒绝该 patch）'); skipped.push(label + ': ' + conflict); continue; }
                accepted = accepted.concat(patchEdits);
                log('OK ' + label + ' (' + patchEdits.length + ' 处编辑) → ' + describeFn(r.node, source));
                ok++;
            } catch (e) {
                log('SKIP ' + label + ': ' + e.message);
                skipped.push(label + ': ' + e.message);
            }
        }
        if (stats) { stats.applied = ok; stats.skipped = skipped; }
        if (ok === 0) {
            log('WARN: ' + filename + ' 没有 AST patch 生效（fail-safe 返回原文件）');
            return source;
        }
        var out = applyEdits(source, accepted);
        log('applied ' + ok + '/' + patches.length + ' AST patches to ' + filename);
        return out;
    }

    global.__mixinAst = {
        version: VERSION,
        applyAstPatches: applyAstPatches,
        // 暴露内部工具供自测
        _internals: {
            directChildFns: directChildFns,
            fnFeatures: fnFeatures,
            matchAnchor: matchAnchor,
            resolvePath: resolvePath,
            applyEdits: applyEdits
        }
    };
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
