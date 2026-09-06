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

    var VERSION = '1.0.0';

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

    // 返回 [{ fn, asName }]，asName 是函数被绑定的名字（FunctionDeclaration id /
    // var 声明名 / 赋值左侧属性名），匿名则为 null。不深入子函数内部。
    function directChildFns(node) {
        var out = [];
        function visit(n, inFnRoot) {
            if (!n || typeof n !== 'object') return;
            if (Array.isArray(n)) {
                for (var i = 0; i < n.length; i++) visit(n[i], false);
                return;
            }
            if (typeof n.type !== 'string') return;
            if (isFnNode(n) && n !== node) {
                // 函数自己的绑定名：声明 id 优先；否则取父链传来的 var/赋值/属性名
                var nm = null;
                if (n.type === 'FunctionDeclaration' && n.id) nm = n.id.name;
                else if (inFnRoot && inFnRoot.name) nm = inFnRoot.name;
                out.push({ fn: n, asName: nm });
                return; // 不进入子函数
            }
            // 记录“这个子树的根被绑了什么名字”，供 var X = function(){} / X.Y = function(){} / {y: function(){}} 识别
            var namedRoot = null;
            if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier' && isFnNode(n.init)) namedRoot = { name: n.id.name };
            else if (n.type === 'AssignmentExpression' && isFnNode(n.right)) {
                var l = n.left;
                if (l.type === 'Identifier') namedRoot = { name: l.name };
                else if (l.type === 'MemberExpression' && !l.computed && l.property.type === 'Identifier') namedRoot = { name: l.property.name };
            } else if ((n.type === 'ObjectProperty' || n.type === 'Property') && isFnNode(n.value)) {
                var kv = n.key && (n.key.type === 'Literal' ? n.key.value : n.key.name);
                if (typeof kv === 'string') namedRoot = { name: kv };
            }
            for (var k in n) {
                if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
                var v = n[k];
                if (Array.isArray(v)) { for (var j = 0; j < v.length; j++) visit(v[j], namedRoot); }
                else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v, namedRoot);
            }
        }
        visit(node, null);
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

    function resolveName(node, seg, src) {
        var kids = directChildFns(node);
        var candidates = [];
        for (var i = 0; i < kids.length; i++) {
            if (kids[i].asName === seg.name) candidates.push(kids[i].fn);
        }
        return pick(candidates, seg, src, 'name ' + seg.name);
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
    // 在当前节点整个子树里扫描双参调用；若给了 cls（或上一段解析出了绑定名）则校验第一参。
    function resolveMethod(node, seg, src, prevAsName) {
        var clsName = seg.cls || prevAsName || null;
        var candidates = [];
        walkAll(node, function (n) {
            if (n.type !== 'CallExpression') return;
            var args = n.arguments;
            if (!args || args.length !== 2) return;
            if (!args[0] || args[0].type !== 'Identifier') return;
            if (clsName && args[0].name !== clsName) return;
            if (!args[1] || args[1].type !== 'ArrayExpression') return;
            var props = args[1].elements;
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
                    else if (pn === 'value') valNode = pp.value;
                }
                if (keyVal === seg.method && isFnNode(valNode) && hasBlockBody(valNode)) candidates.push(valNode);
            }
        });
        return pick(candidates, seg, src, 'method ' + seg.method + (clsName ? ' of ' + clsName : ''));
    }

    function pick(candidates, seg, src, what) {
        var idx = seg.index || 0;
        if (candidates.length === 0) return { error: '0 个候选（' + what + '）' };
        if (candidates.length > 1 && !seg.index) {
            var list = [];
            for (var i = 0; i < Math.min(candidates.length, 8); i++) list.push(describeFn(candidates[i], src));
            return { error: candidates.length + ' 个候选且未写 index（' + what + '）：' + list.join(' | ') };
        }
        if (idx >= candidates.length) return { error: 'index ' + idx + ' 越界，候选 ' + candidates.length + ' 个（' + what + '）' };
        return { node: candidates[idx] };
    }

    function resolvePath(ast, path, src) {
        var node = ast; // Program
        var prevAsName = null;
        for (var i = 0; i < path.length; i++) {
            var seg = path[i];
            var r;
            if (seg.module != null) r = resolveModule(node, seg, src);
            else if (seg.name != null) r = resolveName(node, seg, src);
            else if (seg.method != null) r = resolveMethod(node, seg, src, prevAsName);
            else if (seg.anchor) r = resolveAnchor(node, seg, src);
            else return { error: 'path[' + i + '] 段类型无法识别（需 module/name/method/anchor）' };
            if (r.error) return { error: 'path[' + i + '] ' + r.error };
            node = r.node;
            prevAsName = r.asName || null;
            if (isFnNode(node) && !hasBlockBody(node)) {
                return { error: 'path[' + i + '] 目标函数体不是块（箭头函数表达式体），无法注入' };
            }
        }
        return { node: node };
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
            else if (at === 'tail') edits.push({ start: fn.body.end - 1, end: fn.body.end - 1, text: '\n' + code + '\n' });
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

    /*
     * applyAstPatches(filename, source, patches) → string
     * patches: [{ path: [...], op, code/at/message, name? }]
     * 单个 patch 失败 → 跳过该 patch 并打日志（文件其余 patch 照常）；
     * 解析（acorn.parse）失败 → 整体返回原 source。
     */
    function applyAstPatches(filename, source, patches) {
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
        var edits = [];
        var ok = 0;
        for (var i = 0; i < patches.length; i++) {
            var patch = patches[i];
            var label = patch.name || ('patch#' + i);
            try {
                var r = resolvePath(ast, patch.path, source);
                if (r.error) { log('SKIP ' + label + ': ' + r.error); continue; }
                var before = edits.length;
                applyOp(r.node, patch, source, edits);
                log('OK ' + label + ' (' + (edits.length - before) + ' 处编辑) → ' + describeFn(r.node, source));
                ok++;
            } catch (e) {
                log('SKIP ' + label + ': ' + e.message);
            }
        }
        if (ok === 0) {
            log('WARN: ' + filename + ' 没有 AST patch 生效（fail-safe 返回原文件）');
            return source;
        }
        var out = applyEdits(source, edits);
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
