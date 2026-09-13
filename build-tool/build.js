/*
 * build.js — jsmixin v2 构建工具（PC 侧，Node）
 *
 * 输入（mod 项目目录）：
 *   build-config.json   { modid, name, version, priority?,
 *                          gameFiles: { "<目标文件名>": "<相对项目目录的路径>" },
 *                          marks?: "marks", nameMap?: "name-map.json", outDir?: "dist" }
 *   marks/*.mark.ts     用户写的 Mark 文件：纯 ES5 JS + 装饰器（见 DESIGN-target.md §三/§四）
 *   name-map.json       可选。{ classes:{可读类名:真实点分名}, methods:{"类.方法":方法表key},
 *                                aliases:{可读名:真实名} }
 *
 * 输出（<项目>/dist/）：
 *   patches.js          __mixin.register({...}) 形态（window/globalThis 跨宿主），与 runtime 对接
 *   mixins.json         mod 清单（哈希校验暂不要求，不生成 required 块）
 *
 * 管线（DESIGN-target.md §五，按当前口径裁剪）：
 *   1. TS Compiler API 读 marks → 装饰器 + 函数体
 *   2. name-map 把可读名换成真实名（未命中则原样使用，视为已写真名）
 *   3. 对目标文件跑 acorn 解析，复用 runtime/mixinAst 的 _internals 做构建期预检：
 *      任何 path 段 0 个或多个候选 → 构建失败并列出候选（不生成产物）
 *   4. 注入体用 acorn 做语法校验（与运行时 validateCode 同规则）
 *   5. 产出 patches.js / mixins.json
 *   6. 产物校验：对打完补丁的目标文件再解析 + 重解析各 path → 双重确认
 *
 * 用法：node build.js <mod项目目录>
 * 编程调用：require('build.js').runBuild(projDir) → { ok, outDir, patchCount, files }
 */
'use strict';

var fs = require('fs');
var path = require('path');

// 复用运行时解析器：与游戏内完全同一套定位代码（构建期解析 = 运行期验证的前提）
global.acorn = require('../vendor/acorn.js');
require('../runtime/mixinAst.js');
var AST = global.__mixinAst._internals;
var AST_ALL = global.__mixinAst;
var acorn = global.acorn;
var ts = require('typescript');

/* ---------- 小工具 ---------- */

function fail(msg) { throw new Error('[build] ' + msg); }

function readText(p) {
    if (!fs.existsSync(p)) fail('文件不存在: ' + p);
    return fs.readFileSync(p, 'utf8');
}

// 装饰器实参/路径段都是受信的本地字面量，直接求值
function evalLiteral(text, where) {
    try { return new Function('return (' + text + ')')(); }
    catch (e) { fail(where + ' 字面量求值失败: ' + e.message); }
}

// 错误信息里的 @offset 换成 行:列，报告可读
function withLineInfo(errText, src) {
    return String(errText).replace(/@(\d+)/g, function (m, off) {
        var line = 1, col = 1;
        for (var i = 0; i < Math.min(+off, src.length); i++) {
            if (src.charCodeAt(i) === 10) { line++; col = 1; } else col++;
        }
        return '@' + line + ':' + col;
    });
}

/* ---------- name-map ---------- */

function makeMapper(nameMap) {
    var classes = (nameMap && nameMap.classes) || {};
    var methods = (nameMap && nameMap.methods) || {};
    var aliases = (nameMap && nameMap.aliases) || {};
    return {
        // 类可读名 → 真实点分名（'AccountBindPopupUI' → 'f.AccountBindPopupUI'）
        cls: function (n) { return classes[n] || n; },
        // 方法可读名 → 方法表 key。兼容 "a.prototype.c" 式旧值：取末段。
        // 方法表 key 是字符串字面量，多数情况未被混淆，未命中则原样使用。
        method: function (clsName, m) {
            var hit = methods[clsName + '.' + m];
            if (hit == null) return m;
            if (typeof hit !== 'string') fail('name-map.methods["' + clsName + '.' + m + '"] 必须是字符串');
            var last = hit.split('.').pop();
            if (last !== hit) process.stderr.write('[build] WARN: method 映射 "' + hit + '" 取末段 "' + last + '"\n');
            return last;
        },
        // 路径段里的名字（函数/命名空间/被调函数）
        name: function (n) { return aliases[n] || n; }
    };
}

/* ---------- marks 解析（TS Compiler API） ---------- */

function decoratorName(dec, sf) {
    var e = dec.expression;
    if (e && e.kind === ts.SyntaxKind.CallExpression) e = e.expression;
    if (e && e.kind === ts.SyntaxKind.Identifier) return e.text;
    return null;
}

function decoratorArg(dec, sf) {
    if (dec.expression && dec.expression.kind === ts.SyntaxKind.CallExpression) {
        var args = dec.expression.arguments;
        if (!args || args.length === 0) return {};
        return evalLiteral(args[0].getText(sf), '装饰器实参');
    }
    return {};
}

// 方法体文本：剥掉大括号并去掉首尾空白行（注入体是“函数体语句”，与 runtime op 约定一致）
function bodyText(method, sf) {
    var b = method.body;
    if (!b) fail('方法 ' + method.name.getText(sf) + ' 没有函数体');
    return b.getText(sf).slice(1, -1).trim();
}

function eachNode(root, cb) {
    function visit(n) {
        if (!n || typeof n.kind !== 'number') return;
        cb(n);
        ts.forEachChild(n, visit);
    }
    visit(root);
}

function parseMarkFile(file, map) {
    var text = readText(file);
    var sf = ts.createSourceFile(path.basename(file), text, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS);
    var groups = []; // 每个 @MixinClass 类一组

    eachNode(sf, function (n) {
        if (n.kind !== ts.SyntaxKind.ClassDeclaration) return;
        var decs = ts.canHaveDecorators(n) ? ts.getDecorators(n) : n.decorators;
        var mixinDec = null;
        if (decs) {
            for (var i = 0; i < decs.length; i++) {
                if (decoratorName(decs[i], sf) === 'MixinClass') mixinDec = decs[i];
            }
        }
        if (!mixinDec) return;
        var arg = decoratorArg(mixinDec, sf);
        var target = arg.target || {};
        if (!target.file) fail(file + ': @MixinClass target.file 必填');

        var clsReadable = target.cls || null;
        var basePath = [];
        // webpack 模块前缀：真实目标文件的类/函数都挂在模块函数内，mark 需显式锚定
        // （如 { module:'625' }）。target.module 与 target.path 开头的 module 段等价。
        if (target.module != null) basePath.push({ module: target.module });
        if (clsReadable) basePath.push({ name: map.cls(clsReadable) });
        if (target.method) basePath.push({ method: map.method(clsReadable || '', target.method) });
        if (target.path) {
            if (!(target.path instanceof Array)) fail(file + ': target.path 必须是数组');
            for (var p = 0; p < target.path.length; p++) {
                var seg = target.path[p];
                if (!seg || typeof seg !== 'object') fail(file + ': target.path[' + p + '] 必须是对象段');
                var s2 = {};
                for (var k in seg) {
                    if (k === 'name' || k === 'call') s2[k] = map.name(seg[k]);
                    else if (k === 'method') s2[k] = map.method(clsReadable || '', seg[k]);
                    else s2[k] = seg[k];
                }
                basePath.push(s2);
            }
        }
        if (!basePath.length) fail(file + ': target 需要 cls/method/path 至少一项（path 补丁无法指向 Program 层）');

        var ops = []; // { markMethod, patches:[...] }
        var members = n.members;
        for (var m = 0; m < members.length; m++) {
            var md = members[m];
            if (md.kind !== ts.SyntaxKind.MethodDeclaration) continue;
            var mDecs = ts.canHaveDecorators(md) ? ts.getDecorators(md) : md.decorators;
            if (!mDecs || !mDecs.length) continue;
            var markMethodName = md.name.getText(sf);
            var code = bodyText(md, sf);
            var made = [];
            for (var d = 0; d < mDecs.length; d++) {
                var dn = decoratorName(mDecs[d], sf);
                var da = decoratorArg(mDecs[d], sf);
                // op 级 method（Java 形态）：操作注解自己指定目标方法，一个 mark 类可多方法各打各的。
                // 与 target.method 同用 = 歧义，构建报错（宁可报错不静默选一个）——走 errors 收集而非抛异常。
                var opMethod = da.method;
                var methodErr = null;
                if (opMethod != null && target.method) {
                    methodErr = 'method 与 target.method 同时存在（"' + target.method + '"）——二选一';
                }
                if (dn === 'Inject') {
                    var at = da.at || 'head';
                    if (at !== 'head' && at !== 'tail') fail(file + ': @Inject at 仅支持 head/tail，收到 ' + at);
                    if (da.cancellable != null && da.cancellable !== true && da.cancellable !== false) {
                        fail(file + ': @Inject cancellable 只能是 true/false');
                    }
                    if (da.cancellable === true && at !== 'head') {
                        fail(file + ': @Inject cancellable 仅支持 at:"head"（tail 注入的取消是死代码）');
                    }
                    made.push({ op: 'inject', at: at, cancellable: da.cancellable === true ? true : undefined, code: code });
                } else if (dn === 'Overwrite') {
                    made.push({ op: 'overwrite', code: code });
                } else if (dn === 'Wrap') {
                    var params = md.parameters;
                    if (!params.length || params[0].name.getText(sf) !== '$orig') {
                        fail(file + ': @Wrap 方法第一个参数必须叫 $orig');
                    }
                    made.push({ op: 'wrap', code: code });
                } else if (dn === 'Export') {
                    if (!da.as) fail(file + ': @Export 需要 { as: "导出名" }');
                    made.push({ op: 'export', as: da.as, writable: da.writable === true ? true : undefined });
                } else if (dn === 'Modify') {
                    if (!da.find || typeof da.find !== 'string') fail(file + ': @Modify 需要 { find: "节点源码精确文本" }');
                    if (da.replace == null || typeof da.replace !== 'string') fail(file + ': @Modify 需要 { replace: "替换表达式文本" }');
                    made.push({ op: 'modify', find: da.find, replace: da.replace, nth: da.nth, all: da.all === true ? true : undefined });
                } else if (dn === 'Redirect') {
                    if (!da.call) fail(file + ': @Redirect 需要 { call: "callee 点分名（支持 this.x）" }');
                    made.push({ op: 'redirect', call: da.call, params: da.params, nth: da.nth, all: da.all === true ? true : undefined, code: code });
                } else if (dn === 'WrapOperation') {
                    if (!da.call) fail(file + ': @WrapOperation 需要 { call: "callee 点分名（支持 this.x）" }');
                    made.push({ op: 'wrapCall', call: da.call, params: da.params, nth: da.nth, all: da.all === true ? true : undefined, code: code });
                } else if (dn === 'ModifyArg') {
                    if (!da.call) fail(file + ': @ModifyArg 需要 { call: "callee 点分名（支持 this.x）" }');
                    if (da.arg == null || typeof da.arg !== 'number') fail(file + ': @ModifyArg 需要 { arg: 实参槽位序号 }');
                    made.push({ op: 'modifyArg', call: da.call, arg: da.arg, params: da.params, nth: da.nth, all: da.all === true ? true : undefined, code: code });
                } else if (dn === 'ModifyReturnValue') {
                    made.push({ op: 'modifyReturn', code: code });
                } else if (dn === 'ModifyExpressionValue') {
                    if (!da.call && !da.find) fail(file + ': @ModifyExpressionValue 需要 { call: "调用点分名" } 或 { find: "表达式精确文本" }');
                    made.push({ op: 'wrapValue', call: da.call, find: da.find, params: da.params, nth: da.nth, all: da.all === true ? true : undefined, code: code });
                } else if (dn === 'ModifyArgs') {
                    if (!da.call) fail(file + ': @ModifyArgs 需要 { call: "callee 点分名（支持 this.x）" }');
                    made.push({ op: 'modifyArgs', call: da.call, params: da.params, nth: da.nth, all: da.all === true ? true : undefined, code: code });
                } else {
                    fail(file + ': 方法 ' + markMethodName + ' 上有未支持的装饰器 @' + dn
                        + '（支持 Inject/Overwrite/Wrap/Export/Modify/Redirect/WrapOperation/ModifyArg'
                        + '/ModifyReturnValue/ModifyExpressionValue/ModifyArgs）');
                }
                // op 级 method 附着（Export 目标是绑定名，不支持 method）
                if (opMethod != null) {
                    if (dn === 'Export') {
                        made[made.length - 1].methodErr = '@Export 不支持 method（导出目标是绑定名/函数本身）';
                    } else {
                        made[made.length - 1].method = opMethod;
                        made[made.length - 1].methodErr = methodErr;
                    }
                }
                // @Share/@Local 装饰器参数（构建期校验用，见 runBuild）
                var arrFields = { locals: da.locals, share: da.share };
                for (var af in arrFields) {
                    var arr = arrFields[af];
                    if (arr != null) {
                        if (!(arr instanceof Array) || !arr.every(function (s) { return typeof s === 'string'; })) {
                            fail(file + ': @' + dn + ' 的 ' + af + ' 必须是字符串数组');
                        }
                        made[made.length - 1][af] = arr;
                    }
                }
            }
            if (made.length) ops.push({ markMethod: markMethodName, patches: made });
        }
        groups.push({
            file: file, className: n.name ? n.name.text : 'Mark' + groups.length,
            targetFile: target.file, clsReadable: clsReadable,
            targetMethodExplicit: !!target.method, hasPath: !!target.path,
            basePath: basePath, ops: ops
        });
    });
    return groups;
}

/* ---------- 路径合成 + 预检 + 导出展开 ---------- */

// 每个标了装饰器的 mark 方法 → 一个待预检的 patch 请求
function expandGroups(groups) {
    var reqs = [];
    for (var g = 0; g < groups.length; g++) {
        var grp = groups[g];
        for (var o = 0; o < grp.ops.length; o++) {
            var op = grp.ops[o];
            for (var p = 0; p < op.patches.length; p++) {
                var pk = op.patches[p];
                // 路径按 patch 逐个合成：op 级 method 覆盖/追加末段（Java 形态，一个 mark 类多目标）
                var fullPath = grp.basePath.slice(0);
                if (grp.clsReadable && !grp.targetMethodExplicit && !grp.hasPath) {
                    // cls-only：目标方法 = op 级 method（若有，覆盖推断）否则 mark 方法名推断
                    fullPath.push({ method: grp.map.method(grp.clsReadable, pk.method || op.markMethod) });
                } else if (pk.method && !pk.methodErr) {
                    fullPath.push({ method: grp.map.method(grp.clsReadable || '', pk.method) });
                }
                reqs.push({
                    name: grp.className + '.' + op.markMethod + (op.patches.length > 1 ? '#' + p : ''),
                    targetFile: grp.targetFile,
                    path: fullPath,
                    methodErr: pk.methodErr,
                    op: pk.op,
                    at: pk.at,
                    code: pk.code,
                    as: pk.as,
                    writable: pk.writable,
                    find: pk.find,
                    replace: pk.replace,
                    nth: pk.nth,
                    all: pk.all,
                    call: pk.call,
                    arg: pk.arg,
                    params: pk.params,
                    cancellable: pk.cancellable,
                    locals: pk.locals,
                    share: pk.share,
                    from: grp.file
                });
            }
        }
    }
    return reqs;
}

// 把 @Export 请求翻译成 inject-tail patch：在父层函数尾注入 __mixin_exports 赋值（跨宿主）。
// 需要目标在父作用域里有名字（绑定名或自身 id）；匿名目标请改用 Wrap。
function expandExport(req, astCache) {
    var c = astCache[req.targetFile];
    var full = AST.resolvePath(c.ast, req.path, c.src);
    if (full.error) return withLineInfo(full.error, c.src);
    if (req.path.length < 1) return '@Export 目标不能是顶层（无法注入 Program 层）';
    var parentPath = req.path.slice(0, -1);
    var pr = AST.resolvePath(c.ast, parentPath, c.src);
    if (pr.error) return withLineInfo(pr.error, c.src);
    var kids = AST.directChildFns(pr.node);
    var nm = null;
    for (var i = 0; i < kids.length; i++) {
        if (kids[i].fn === full.node) { nm = kids[i].asName || kids[i].idName; break; }
    }
    if (!nm) return '@Export 目标没有可用的绑定名/自身 id（匿名函数请改用 Wrap）';
    // 导出赋值注入到父层函数尾（runtime 的 tail 会在末尾 return 之前插入，不会成为死代码）。
    // writable: true → getter/setter 形式（@Accessor/@Invoker 强化）：外部读写直达闭包绑定本身
    // 而非快照拷贝——set 里的赋值在注入文本内执行，真正改写闭包变量。
    // 导出容器跨宿主：注入体内不假设全局别名（Node 无 window）
    var G = "(typeof window !== 'undefined' ? window : globalThis)";
    req.path = parentPath;
    req.op = 'inject';
    req.at = 'tail';
    if (req.writable) {
        req.code = '\n' + G + '.__mixin_exports = ' + G + '.__mixin_exports || {};\n'
            + 'Object.defineProperty(' + G + '.__mixin_exports, ' + JSON.stringify(req.as) + ', {'
            + ' get: function () { return ' + nm + '; },'
            + ' set: function (v) { ' + nm + ' = v; },'
            + ' enumerable: !0, configurable: !0 });';
    } else {
        req.code = '\n' + G + '.__mixin_exports = ' + G + '.__mixin_exports || {};\n' + G + '.__mixin_exports['
            + JSON.stringify(req.as) + '] = ' + nm + ';';
    }
    req.name = req.name + '$export';
    return null;
}

/* ---------- 主流程 ---------- */

function runBuild(projDir) {
    projDir = path.resolve(projDir || '.');
    var cfg = JSON.parse(readText(path.join(projDir, 'build-config.json')));
    var marksDir = path.join(projDir, cfg.marks || 'marks');
    var outDir = path.join(projDir, cfg.outDir || 'dist');
    var nameMapPath = path.join(projDir, cfg.nameMap || 'name-map.json');
    var nameMapJson = fs.existsSync(nameMapPath) ? JSON.parse(readText(nameMapPath)) : null;
    var map = makeMapper(nameMapJson);

    if (!cfg.gameFiles || typeof cfg.gameFiles !== 'object') fail('build-config.json 缺少 gameFiles');
    var markFiles = fs.readdirSync(marksDir).filter(function (f) { return /\.mark\.ts$/.test(f); })
        .sort().map(function (f) { return path.join(marksDir, f); });
    if (!markFiles.length) fail('marks 目录里没有 *.mark.ts 文件');

    // 1. 解析 marks
    var groups = [];
    for (var i = 0; i < markFiles.length; i++) {
        var parsed = parseMarkFile(markFiles[i], map);
        for (var j = 0; j < parsed.length; j++) parsed[j].map = map;
        groups = groups.concat(parsed);
    }

    // 2. 展开 patch 请求
    var reqs = expandGroups(groups);

    // 3. 预检 + 语法校验 + 导出展开 → 生成最终 patch 列表
    var astCache = {};
    function getAst(targetFile) {
        if (!astCache[targetFile]) {
            var gp = cfg.gameFiles[targetFile];
            if (!gp) fail('target.file "' + targetFile + '" 不在 build-config.gameFiles 里');
            var src = readText(path.join(projDir, gp));
            var ast;
            try {
                ast = acorn.parse(src, { ecmaVersion: 'latest' });
            } catch (e1) {
                // ESM（import/export）目标：script 失败后按 module 模式重试（与 runtime 同规则）
                try {
                    ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
                } catch (e2) {
                    throw e1;
                }
            }
            astCache[targetFile] = { src: src, ast: ast };
        }
        return astCache[targetFile];
    }

    var errors = [];
    var patchesByFile = {}; // targetFile → [patch]
    var exportNames = [];   // @Export 汇总（game-types.d.ts 用）
    // @Share 全集：本 mod 声明的共享名对同目标的其他注入可见（词法作用域），@Local 校验需计入
    var allShareNames = {};
    for (var r0 = 0; r0 < reqs.length; r0++) {
        var sh = reqs[r0].share;
        if (sh) for (var s0 = 0; s0 < sh.length; s0++) allShareNames[sh[s0]] = 1;
    }
    for (var r = 0; r < reqs.length; r++) {
        var req = reqs[r];
        if (req.methodErr) { errors.push(req.name + ': ' + req.methodErr); continue; }
        var c;
        try { c = getAst(req.targetFile); } catch (e) { errors.push(req.name + ': ' + e.message); continue; }

        if (req.op === 'export') {
            exportNames.push(req.as);
            var ee = expandExport(req, astCache);
            if (ee) { errors.push(req.name + ' (@Export ' + req.as + '): ' + ee); continue; }
        }

        // 注入体语法校验（与 runtime validateCode 同规则；调用点级 op 的 code 收表达式或语句体）
        if (req.code != null) {
            var ok1 = null, err1 = null;
            if (req.op === 'redirect' || req.op === 'modifyArg') {
                try { acorn.parse('(' + req.code + ')', { ecmaVersion: 'latest' }); ok1 = 'expr'; } catch (e) { err1 = e; }
                if (!ok1) {
                    try { acorn.parse('(function(){' + req.code + '})', { ecmaVersion: 'latest' }); ok1 = 'body'; } catch (e2) { err1 = e2; }
                }
                if (!ok1) { errors.push(req.name + ': 注入体语法错误: ' + err1.message); continue; }
            } else {
                try { acorn.parse('(function(){' + req.code + '})', { ecmaVersion: 'latest' }); }
                catch (e) { errors.push(req.name + ': 注入体语法错误: ' + e.message); continue; }
            }
        }

        // 构建期唯一性预检：0 个或多于 1 个候选 → 构建失败
        var pr = AST.resolvePath(c.ast, req.path, c.src);
        if (pr.error) { errors.push(req.name + ': ' + withLineInfo(pr.error, c.src)); continue; }

        // 调用点级 op 的构建期预检：目标函数内调用点 0 个 / 多个未消歧 → 构建失败
        if (req.op === 'redirect' || req.op === 'wrapCall' || req.op === 'modifyArg'
            || req.op === 'modifyArgs' || (req.op === 'wrapValue' && req.call)) {
            var sites = AST.findCallSites(pr.node, req, c.src);
            if (!sites.length) { errors.push(req.name + ': 目标函数内 0 处命中调用 "' + req.call + '"'); continue; }
            if (sites.length > 1 && req.all !== true && req.nth == null) {
                errors.push(req.name + ': ' + sites.length + ' 处命中调用 "' + req.call + '"，需写 nth 或 all:true');
                continue;
            }
        }

        // @Local 构建期校验：声称捕获的局部变量必须在目标函数里真实存在（参数或 var 声明）
        if (req.locals && req.locals.length) {
            var declared = {};
            (pr.node.params || []).forEach(function (p) {
                if (p && p.type === 'Identifier') declared[p.name] = 1;
            });
            AST.walkAll(pr.node, function (n) {
                if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier') declared[n.id.name] = 1;
            });
            for (var li = 0; li < req.locals.length; li++) {
                if (!declared[req.locals[li]] && !allShareNames[req.locals[li]]) {
                    errors.push(req.name + ': @Local "' + req.locals[li] + '" 在目标函数内不存在（参数、变量声明或其他注入的 @Share）');
                }
            }
        }
        // @Share 构建期校验：共享名必须由本注入体自己声明（同函数内注入共享同一词法作用域）
        if (req.share && req.share.length) {
            var shared = {};
            var codeAst = acorn.parse('(function(){' + req.code + '})', { ecmaVersion: 'latest' });
            (function w(n) {
                if (!n || typeof n !== 'object') return;
                if (Array.isArray(n)) { n.forEach(w); return; }
                if (typeof n.type !== 'string') return;
                if (n.type === 'VariableDeclarator' && n.id && n.id.type === 'Identifier') shared[n.id.name] = 1;
                else if (n.type === 'AssignmentExpression' && n.left && n.left.type === 'Identifier') shared[n.left.name] = 1;
                for (var k in n) {
                    if (k === 'start' || k === 'end' || k === 'loc' || k === 'range') continue;
                    var v = n[k];
                    if (Array.isArray(v)) v.forEach(w);
                    else if (v && typeof v === 'object' && typeof v.type === 'string') w(v);
                }
            })(codeAst);
            for (var si = 0; si < req.share.length; si++) {
                if (!shared[req.share[si]]) {
                    errors.push(req.name + ': @Share "' + req.share[si] + '" 未被本注入体声明（var 赋值后同函数内各注入点天然可见）');
                }
            }
        }

        var patch = { name: req.name, path: req.path, op: req.op };
        if (req.op === 'inject') patch.at = req.at || 'head';
        if (req.cancellable === true) patch.cancellable = true;
        if (req.code != null) patch.code = req.code;
        if (req.op === 'modify') {
            patch.find = req.find;
            patch.replace = req.replace;
            if (req.nth != null) patch.nth = req.nth;
            if (req.all === true) patch.all = true;
        }
        if (req.op === 'redirect' || req.op === 'wrapCall' || req.op === 'modifyArg'
            || req.op === 'modifyArgs') {
            patch.call = req.call;
            if (req.params != null) patch.params = req.params;
            if (req.op === 'modifyArg') patch.arg = req.arg;
            if (req.nth != null) patch.nth = req.nth;
            if (req.all === true) patch.all = true;
        }
        if (req.op === 'wrapValue') {
            if (req.call) patch.call = req.call;
            else patch.find = req.find;
            if (req.params != null) patch.params = req.params;
            if (req.nth != null) patch.nth = req.nth;
            if (req.all === true) patch.all = true;
        }
        if (!patchesByFile[req.targetFile]) patchesByFile[req.targetFile] = [];
        patchesByFile[req.targetFile].push(patch);
    }

    if (errors.length) {
        return {
            ok: false,
            errors: errors,
            message: errors.length + ' 个 patch 未通过构建期预检'
        };
    }

    // 4. 产物校验：整体打补丁（要求每个 patch 都生效）→ 再解析 → 重解析各 path
    var postErrors = [];
    for (var tf in patchesByFile) {
        var cc = astCache[tf];
        var st = {};
        var patched = AST_ALL.applyAstPatches(tf, cc.src, patchesByFile[tf], st);
        for (var s = 0; s < st.skipped.length; s++) {
            postErrors.push(tf + ' patch "' + st.skipped[s].split(':')[0] + '": 同 mixin 内未生效（' + st.skipped[s] + '）');
        }
        var patchedAst;
        try { patchedAst = acorn.parse(patched, { ecmaVersion: 'latest' }); }
        catch (e) { postErrors.push(tf + ': 打补丁后语法解析失败: ' + e.message); continue; }
        for (var q = 0; q < patchesByFile[tf].length; q++) {
            var rp = AST.resolvePath(patchedAst, patchesByFile[tf][q].path, patched);
            if (rp.error) postErrors.push(tf + ' patch "' + patchesByFile[tf][q].name + '": 打补丁后路径无法重定位: ' + withLineInfo(rp.error, patched));
        }
    }
    if (postErrors.length) {
        return { ok: false, errors: postErrors, message: '产物校验失败' };
    }

    // 5. 写产物
    var mixinEntries = [];
    var total = 0;
    for (var f in patchesByFile) {
        mixinEntries.push({ file: f, patches: patchesByFile[f] });
        total += patchesByFile[f].length;
    }
    var mod = {
        modid: cfg.modid || 'unnamed-mod',
        version: cfg.version || '0.0.0',
        mixins: mixinEntries
    };
    if (cfg.name) mod.name = cfg.name;
    if (cfg.priority != null) mod.priority = cfg.priority;

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    // 注册行跨宿主：LayaNative/浏览器走 window，Node 走 globalThis（mod 包跨运行时通用）
    var patchesJs = '/* 由 jsmixin build-tool 生成，勿手改。源: ' + markFiles.map(function (p) { return path.basename(p); }).join(', ') + ' */\n'
        + '(typeof window !== \'undefined\' ? window : globalThis).__mixin.register('
        + JSON.stringify(mod, null, 2) + ');\n';
    fs.writeFileSync(path.join(outDir, 'patches.js'), patchesJs);
    var manifest = {
        schemaVersion: 1,
        modid: mod.modid,
        name: cfg.name || mod.modid,
        version: mod.version,
        mixins: ['patches.js']
    };
    if (cfg.priority != null) manifest.priority = cfg.priority;
    // entry（附加式代码）：cfg.entry 声明则随产物复制并写进清单（loader 在游戏启动后执行）
    if (cfg.entry) {
        var entrySrc = path.join(projDir, cfg.entry);
        if (!fs.existsSync(entrySrc)) fail('cfg.entry 指向的文件不存在: ' + cfg.entry);
        fs.writeFileSync(path.join(outDir, path.basename(cfg.entry)), fs.readFileSync(entrySrc));
        manifest.entry = path.basename(cfg.entry);
    }
    // 哈希校验暂不要求：不生成 required 块
    fs.writeFileSync(path.join(outDir, 'mixins.json'), JSON.stringify(manifest, null, 2) + '\n');

    // game-types.d.ts：name-map 可读类 + 方法表 key + @Export 汇总（编辑器类型提示）
    fs.writeFileSync(path.join(outDir, 'game-types.d.ts'), genTypesDts(nameMapJson, exportNames));

    return {
        ok: true,
        outDir: outDir,
        patchCount: total,
        files: Object.keys(patchesByFile).concat(['game-types.d.ts']),
        patchesByFile: patchesByFile
    };
}

/*
 * 生成 game-types.d.ts。数据源（无类型信息的现实约束下做"结构提示"而非精确类型）：
 *   - name-map.classes：可读类名 → interface（全部成员 any，索引签名兜底）
 *   - name-map.methods："类.方法" key → 该 interface 的可选方法
 *   - 本 mod 的 @Export as 名 → window.__mixin_exports 的具名条目
 *   - 引擎 modFs 全局（Android 部署才存在，声明成函数供 mod 作者引用）
 * mark 文件本身是纯 ES5（@ts-nocheck），本文件服务阶段二（TS 注入体）与补丁作者。
 */
function genTypesDts(nameMapJson, exportNames) {
    var lines = [];
    lines.push('// 由 jsmixin build-tool 生成，勿手改。数据源：name-map.json + 本 mod 的 @Export。');
    lines.push('// tsconfig "include" 加入本文件即可获得 game.<可读类> / window.__mixin_exports 的类型提示。');
    lines.push('declare namespace game {');
    var classes = (nameMapJson && nameMapJson.classes) || {};
    var methods = (nameMapJson && nameMapJson.methods) || {};
    var byCls = {};
    Object.keys(methods).forEach(function (k) {
        var dot = k.indexOf('.');
        if (dot <= 0) return;
        var cls = k.slice(0, dot);
        (byCls[cls] = byCls[cls] || []).push(k.slice(dot + 1));
    });
    Object.keys(classes).forEach(function (readable) {
        lines.push('  /** 真实内部名: ' + classes[readable] + ' */');
        lines.push('  interface ' + readable + ' {');
        (byCls[readable] || []).forEach(function (m) {
            lines.push('    ' + m + '?(...args: any[]): any; // 方法表 key "' + m + '"');
        });
        lines.push('    [key: string]: any;');
        lines.push('  }');
    });
    lines.push('}');
    lines.push('interface Window {');
    lines.push('  __mixin: {');
    lines.push('    version: string;');
    lines.push('    register(mod: any): void;');
    lines.push('    stats(): any;');
    lines.push('    sourceHash(src: string): string;');
    lines.push('  };');
    lines.push('  __mixin_exports: {');
    exportNames.forEach(function (n) {
        lines.push('    ' + n + '?: any; // @Export');
    });
    lines.push('    [key: string]: any;');
    lines.push('  };');
    lines.push('  __mixinLoader?: any; // 阶段1 外部 mod 装载器（loader.js）');
    lines.push('}');
    // 引擎 modFs 全局（android-modfs + native，仅 Android 部署存在）
    lines.push('// 引擎 modFs 全局（Android 部署才有；双模式存储授权，见 android-modfs/）');
    lines.push('declare function modFsStatus(): string;');
    lines.push('declare function modFsEnsure(): boolean;');
    lines.push('declare function modReadFileSync(path: string): string;');
    return lines.join('\n') + '\n';
}

module.exports = { runBuild: runBuild, makeMapper: makeMapper };

if (require.main === module) {
    try {
        var res = runBuild(process.argv[2]);
        if (res.ok) {
            console.log('[build] OK: ' + res.patchCount + ' patch(es) → ' + res.outDir
                + ' (files: ' + res.files.join(', ') + ')');
        } else {
            console.error('[build] ' + res.message);
            for (var i = 0; i < res.errors.length; i++) console.error('  - ' + res.errors[i]);
            process.exit(1);
        }
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
