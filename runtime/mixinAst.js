/* 由 jsmixin v2 构建生成（源: src/compat/ast-compat.ts），勿手改。 */
(() => {
  // src/core/features.ts
  function isFnNode(n) {
    return !!n && (n.type === "FunctionDeclaration" || n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression");
  }
  function isClassNode(n) {
    return !!n && (n.type === "ClassDeclaration" || n.type === "ClassExpression");
  }
  function hasBlockBody(fn) {
    return fn.body && fn.body.type === "BlockStatement";
  }
  function logable(msg) {
    try {
      console.log("[mixin-ast] " + msg);
    } catch (e) {
    }
  }
  function dottedName(n) {
    const parts = [];
    while (n && n.type === "MemberExpression" && !n.computed && n.property && n.property.type === "Identifier") {
      parts.unshift(n.property.name);
      n = n.object;
    }
    if (n && n.type === "Identifier") {
      parts.unshift(n.name);
      return parts.join(".");
    }
    return null;
  }
  function calleeName(callee) {
    if (!callee) return null;
    if (callee.type === "Identifier") return callee.name;
    if (callee.type === "MemberExpression" && !callee.computed) {
      if (callee.object && callee.object.type === "ThisExpression" && callee.property.type === "Identifier") {
        return "this." + callee.property.name;
      }
      return dottedName(callee);
    }
    return null;
  }
  function isIifeFactory(n) {
    if (!n || n.type !== "CallExpression") return false;
    let c = n.callee;
    if (c && c.type === "ParenthesizedExpression") c = c.expression;
    return !!(c && isFnNode(c));
  }
  function directChildFns(node) {
    const out = [];
    function visit(n, bind, prefix) {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) {
        for (let i = 0; i < n.length; i++) visit(n[i], null, null);
        return;
      }
      if (typeof n.type !== "string") return;
      if (isFnNode(n) && n !== node) {
        const id = n.id ? n.id.name : null;
        out.push({ fn: n, asName: bind, idName: id });
        return;
      }
      let cBind = null, cPrefix = null;
      if (n.type === "VariableDeclarator" && n.id && n.id.type === "Identifier") {
        if (isFnNode(n.init) || isIifeFactory(n.init) || n.init && n.init.type === "ClassExpression") cBind = n.id.name;
        else if (n.init && n.init.type === "ObjectExpression") cPrefix = n.id.name;
      } else if (n.type === "AssignmentExpression") {
        const dn = dottedName(n.left);
        if (dn) {
          if (isFnNode(n.right) || isIifeFactory(n.right) || n.right && n.right.type === "ClassExpression") cBind = dn;
          else if (n.right && n.right.type === "ObjectExpression") cPrefix = dn;
        }
      } else if ((n.type === "ObjectProperty" || n.type === "Property") && prefix) {
        const kv = n.key && (n.key.type === "Literal" ? n.key.value : n.key.name);
        if (typeof kv === "string") {
          if (isFnNode(n.value) || isIifeFactory(n.value)) cBind = prefix + "." + kv;
          else if (n.value && n.value.type === "ObjectExpression") cPrefix = prefix + "." + kv;
        }
      } else if (n.type === "ObjectExpression") {
        cPrefix = prefix;
      } else if (n.type === "CallExpression" && bind && isIifeFactory(n)) {
        cBind = bind;
      } else if (n.type === "MethodDefinition" && !n.computed && prefix !== void 0) {
        const kv = n.key && (n.key.type === "Identifier" ? n.key.name : n.key.type === "Literal" ? String(n.key.value) : null);
        if (kv != null && isFnNode(n.value)) {
          out.push({ fn: n.value, asName: kv, idName: null });
          return;
        }
      }
      for (const k in n) {
        if (k === "start" || k === "end" || k === "loc" || k === "range") continue;
        const v = n[k];
        if (Array.isArray(v)) {
          for (let j = 0; j < v.length; j++) visit(v[j], cBind, cPrefix);
        } else if (v && typeof v === "object" && typeof v.type === "string") visit(v, cBind, cPrefix);
      }
    }
    visit(node, null, null);
    return out;
  }
  function walkAll(root, cb) {
    function visit(n) {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) {
        for (let i = 0; i < n.length; i++) visit(n[i]);
        return;
      }
      if (typeof n.type !== "string") return;
      cb(n);
      for (const k in n) {
        if (k === "start" || k === "end" || k === "loc" || k === "range") continue;
        const v = n[k];
        if (Array.isArray(v)) {
          for (let j = 0; j < v.length; j++) visit(v[j]);
        } else if (v && typeof v === "object" && typeof v.type === "string") visit(v);
      }
    }
    visit(root);
  }
  function fnFeatures(fn) {
    const strings = {};
    const calls = {};
    const params = fn.params ? fn.params.length : -1;
    walkAll(fn, function(n) {
      if (n.type === "Literal" && typeof n.value === "string") strings[n.value] = 1;
      else if (n.type === "TemplateLiteral" && n.quasis) {
        for (let i = 0; i < n.quasis.length; i++) {
          if (n.quasis[i].value && n.quasis[i].value.cooked) strings[n.quasis[i].value.cooked] = 1;
        }
      } else if (n.type === "CallExpression") {
        const c = calleeName(n.callee);
        if (c) {
          const last = c.indexOf(".") >= 0 ? c.slice(c.lastIndexOf(".") + 1) : c;
          calls[last] = 1;
        }
      }
    });
    return { strings: Object.keys(strings), calls: Object.keys(calls), params };
  }
  function matchAnchor(fn, anchor) {
    if (!anchor) return true;
    const f = fnFeatures(fn);
    if (anchor.params != null && f.params !== anchor.params) return false;
    if (anchor.strings) {
      for (let i = 0; i < anchor.strings.length; i++) {
        if (f.strings.indexOf(anchor.strings[i]) < 0) return false;
      }
    }
    if (anchor.calls) {
      for (let i = 0; i < anchor.calls.length; i++) {
        if (f.calls.indexOf(anchor.calls[i]) < 0) return false;
      }
    }
    return true;
  }
  function describeFn(fn, src) {
    const s = fn.start, e = Math.min(fn.end, fn.start + 160);
    return fn.type + (fn.id ? " " + fn.id.name : "") + " @" + s + ".." + fn.end + " params=" + (fn.params ? fn.params.length : "?") + ' "' + src.slice(s, e).replace(/\s+/g, " ") + (fn.end - s > 160 ? "..." : "") + '"';
  }

  // src/core/segs/pick.ts
  function pick(candidates, seg, src, what) {
    const hasIndex = seg.index != null;
    const idx = hasIndex ? seg.index : 0;
    if (candidates.length === 0) return { error: "0 \u4E2A\u5019\u9009\uFF08" + what + "\uFF09" };
    if (candidates.length > 1 && !hasIndex) {
      const list = [];
      for (let i = 0; i < Math.min(candidates.length, 8); i++) list.push(describeFn(candidates[i], src));
      return { error: candidates.length + " \u4E2A\u5019\u9009\u4E14\u672A\u5199 index\uFF08" + what + "\uFF09\uFF1A" + list.join(" | ") };
    }
    if (idx >= candidates.length) return { error: "index " + idx + " \u8D8A\u754C\uFF0C\u5019\u9009 " + candidates.length + " \u4E2A\uFF08" + what + "\uFF09" };
    return { node: candidates[idx] };
  }

  // src/core/segs/module.ts
  function resolveModule(ast, seg, src) {
    const candidates = [];
    for (let i = 0; i < ast.body.length; i++) {
      const st = ast.body[i];
      const expr = st.type === "ExpressionStatement" ? st.expression : null;
      if (!expr) continue;
      let cur = expr;
      while (cur) {
        let obj = null;
        if (cur.type === "CallExpression" && cur.callee && cur.callee.type === "MemberExpression") obj = cur.callee.object;
        else if (cur.type === "MemberExpression") obj = cur.object;
        else if (cur.type === "SequenceExpression" && cur.expressions) {
          cur = cur.expressions[cur.expressions.length - 1];
          continue;
        }
        if (!obj) break;
        if (obj.type === "ObjectExpression") {
          for (let p = 0; p < obj.properties.length; p++) {
            const prop = obj.properties[p];
            const kv = prop.key && (prop.key.type === "Literal" ? prop.key.value : prop.key.name);
            if (kv == seg.module && isFnNode(prop.value)) candidates.push(prop.value);
          }
          break;
        }
        cur = obj;
      }
    }
    return pick(candidates, seg, src, "module " + seg.module);
  }

  // src/core/segs/name.ts
  function resolveName(node, seg, src) {
    const kids = directChildFns(node);
    const wantDot = seg.name.indexOf(".") >= 0;
    const candidates = [];
    for (let i = 0; i < kids.length; i++) {
      const k = kids[i];
      if (wantDot ? k.asName === seg.name : k.asName === seg.name || k.idName === seg.name) {
        candidates.push(k.fn);
      }
    }
    return pick(candidates, seg, src, "name " + seg.name);
  }

  // src/core/segs/call.ts
  function resolveCall(node, seg, src) {
    const argIdx = seg.arg != null ? seg.arg : 0;
    const candidates = [];
    walkAll(node, function(n) {
      if (n.type !== "CallExpression" || !n.arguments) return;
      const nm = calleeName(n.callee);
      if (nm !== seg.call) return;
      const a = n.arguments[argIdx];
      if (a && isFnNode(a) && hasBlockBody(a)) candidates.push(a);
    });
    return pick(candidates, seg, src, "call " + seg.call + " \u5B9E\u53C2[" + argIdx + "]");
  }

  // src/core/segs/fnIndex.ts
  function resolveFnIndex(node, seg, src) {
    const kids = directChildFns(node);
    const n = seg.fn;
    if (typeof n !== "number" || n < 0) return { error: "fn \u5FC5\u987B\u662F\u975E\u8D1F\u6570\u5B57\u5E8F\u53F7" };
    if (n >= kids.length) return { error: "fn " + n + " \u8D8A\u754C\uFF1A\u8BE5\u5C42\u76F4\u63A5\u5B50\u51FD\u6570\u5171 " + kids.length + " \u4E2A" };
    return { node: kids[n].fn, asName: kids[n].asName };
  }

  // src/core/segs/anchor.ts
  function resolveAnchor(node, seg, src) {
    const kids = directChildFns(node);
    const candidates = [];
    for (let i = 0; i < kids.length; i++) {
      if (matchAnchor(kids[i].fn, seg.anchor)) candidates.push(kids[i].fn);
    }
    return pick(candidates, seg, src, "anchor " + JSON.stringify(seg.anchor));
  }

  // src/core/segs/method.ts
  function classMethodCandidates(clsNode, method) {
    const candidates = [];
    const body = clsNode.body && clsNode.body.body ? clsNode.body.body : [];
    for (let i = 0; i < body.length; i++) {
      const md = body[i];
      if (!md || md.type !== "MethodDefinition" || md.computed) continue;
      const kv = md.key && (md.key.type === "Identifier" ? md.key.name : md.key.type === "Literal" ? md.key.value : null);
      if (kv === method && isFnNode(md.value) && hasBlockBody(md.value)) candidates.push(md.value);
    }
    return candidates;
  }
  function methodTableCandidates(node, clsName, method) {
    const candidates = [];
    walkAll(node, function(n) {
      if (n.type !== "CallExpression") return;
      const args = n.arguments;
      if (!args || args.length !== 2 && args.length !== 3) return;
      if (!args[0] || args[0].type !== "Identifier") return;
      if (clsName && args[0].name !== clsName) return;
      let table = null;
      if (args.length === 2 && args[1] && args[1].type === "ArrayExpression") table = args[1];
      else if (args.length === 3 && args[1] && args[1].type === "Literal" && args[1].value === null && args[2] && args[2].type === "ArrayExpression") table = args[2];
      if (!table) return;
      const props = table.elements;
      for (let i = 0; i < props.length; i++) {
        const el = props[i];
        if (!el || el.type !== "ObjectExpression") continue;
        let keyVal, valNode;
        for (let j = 0; j < el.properties.length; j++) {
          const pp = el.properties[j];
          if (pp.type !== "Property" && pp.type !== "ObjectProperty") continue;
          const pn = pp.key && (pp.key.name || pp.key.value);
          if (pn === "key") keyVal = pp.value && (pp.value.type === "Literal" ? pp.value.value : pp.value.name);
          else if (pn === "value" || pn === "get" || pn === "set") valNode = pp.value;
        }
        if (keyVal === method && isFnNode(valNode) && hasBlockBody(valNode)) candidates.push(valNode);
      }
    });
    return candidates;
  }
  function resolveMethod(node, seg, src, prevAsName) {
    const method = seg.method;
    if (isClassNode(node)) {
      return pick(classMethodCandidates(node, method), seg, src, "method " + method + " of class");
    }
    const clsName = seg.cls || prevAsName || null;
    return pick(methodTableCandidates(node, clsName, method), seg, src, "method " + method + (clsName ? " of " + clsName : ""));
  }
  function resolveMethodAt(node, seg, src, prevAsName) {
    const method = seg.method;
    const clsName = seg.cls || prevAsName || null;
    return pick(methodTableCandidates(node, clsName, method), seg, src, "method " + method + (clsName ? " of " + clsName : ""));
  }

  // src/core/segs/klass.ts
  function resolveClass(node, seg, src) {
    const want = seg.class;
    const candidates = [];
    function visit(n, prefix) {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) {
        for (let i = 0; i < n.length; i++) visit(n[i], null);
        return;
      }
      if (typeof n.type !== "string") return;
      if (n.type === "ClassDeclaration" && n.id && n.id.name === want) candidates.push(n);
      else if (n.type === "VariableDeclarator" && n.id && n.id.type === "Identifier" && n.init && n.init.type === "ClassExpression" && n.id.name === want) candidates.push(n.init);
      else if (n.type === "AssignmentExpression" && n.right && n.right.type === "ClassExpression") {
        if (dottedName(n.left) === want) candidates.push(n.right);
      } else if (n.type === "ObjectProperty" && n.value && n.value.type === "ClassExpression" && prefix) {
        const kv = n.key && (n.key.type === "Literal" ? n.key.value : n.key.name);
        if (prefix + "." + kv === want) candidates.push(n.value);
      }
      if (n !== node && (isFnNode(n) || isClassNode(n))) return;
      let cPrefix = null;
      if (n.type === "VariableDeclarator" && n.id && n.id.type === "Identifier" && n.init && n.init.type === "ObjectExpression") cPrefix = n.id.name;
      else if (n.type === "AssignmentExpression" && n.right && n.right.type === "ObjectExpression") cPrefix = dottedName(n.left);
      else if (n.type === "ObjectExpression") cPrefix = prefix;
      for (const k in n) {
        if (k === "start" || k === "end" || k === "loc" || k === "range") continue;
        const v = n[k];
        if (Array.isArray(v)) {
          for (let j = 0; j < v.length; j++) visit(v[j], cPrefix);
        } else if (v && typeof v === "object" && typeof v.type === "string") visit(v, cPrefix);
      }
    }
    visit(node, null);
    return pick(candidates, seg, src, "class " + want);
  }

  // src/core/segs/wrap.ts
  function topStatements(node) {
    if (node.type === "Program") return node.body || [];
    if (node.body && node.body.type === "BlockStatement") return node.body.body || [];
    return [];
  }
  function unwrapParens(n) {
    while (n && n.type === "ParenthesizedExpression") n = n.expression;
    return n;
  }
  function resolveWrap(node, seg, src) {
    const kind = seg.wrap;
    const stmts = topStatements(node);
    const candidates = [];
    const pushFactory = (call) => {
      const c = unwrapParens(call.callee);
      if (c && isFnNode(c) && hasBlockBody(c)) candidates.push(c);
    };
    for (let i = 0; i < stmts.length; i++) {
      const st = stmts[i];
      if (st.type === "ExpressionStatement") {
        const expr = unwrapParens(st.expression);
        if (!expr) continue;
        if (kind === "iife" && expr.type === "CallExpression") pushFactory(expr);
        else if (kind === "iife" && expr.type === "UnaryExpression" && expr.argument && expr.argument.type === "CallExpression") pushFactory(expr.argument);
        else if (kind === "cjs" && expr.type === "AssignmentExpression" && dottedName(expr.left) === "module.exports" && expr.right.type === "CallExpression") pushFactory(expr.right);
        else if (kind === "umd" && expr.type === "CallExpression") {
          const c = unwrapParens(expr.callee);
          if (c && isFnNode(c) && c.params && c.params.length >= 1) {
            for (let a = expr.arguments.length - 1; a >= 0; a--) {
              const arg = unwrapParens(expr.arguments[a]);
              if (arg && isFnNode(arg) && hasBlockBody(arg)) {
                candidates.push(arg);
                break;
              }
            }
          }
        }
      } else if (st.type === "VariableDeclaration") {
        for (let d = 0; d < st.declarations.length; d++) {
          const dec = st.declarations[d];
          if (kind === "iife" && dec.init && dec.init.type === "CallExpression") pushFactory(dec.init);
        }
      }
    }
    return pick(candidates, seg, src, "wrap " + kind);
  }

  // src/core/ast.ts
  var VERSION = "2.0.0";
  var _acorn = null;
  function getAcorn() {
    if (_acorn) return _acorn;
    return globalThis.acorn || null;
  }
  function resolvePath(ast, path, src) {
    const chain = [ast];
    let prevAsName = null;
    for (let i = 0; i < path.length; i++) {
      const seg = path[i];
      let node = chain[chain.length - 1];
      let r;
      if (seg.module != null) r = resolveModule(node, seg, src);
      else if (seg.name != null) r = resolveName(node, seg, src);
      else if (seg.call != null) r = resolveCall(node, seg, src);
      else if (seg.fn != null) r = resolveFnIndex(node, seg, src);
      else if (seg.method != null) {
        r = resolveMethod(node, seg, src, prevAsName);
        if (r.error && chain.length > 1 && /0 个候选/.test(r.error)) {
          const up = resolveMethodAt(chain[chain.length - 2], seg, src, prevAsName);
          if (!up.error) r = up;
        }
      } else if (seg.class != null) r = resolveClass(node, seg, src);
      else if (seg.wrap != null) r = resolveWrap(node, seg, src);
      else if (seg.anchor) r = resolveAnchor(node, seg, src);
      else return { error: "path[" + i + "] \u6BB5\u7C7B\u578B\u65E0\u6CD5\u8BC6\u522B\uFF08\u9700 module/name/call/fn/method/anchor/class/wrap\uFF09" };
      if (r.error) return { error: "path[" + i + "] " + r.error };
      node = r.node;
      chain.push(node);
      prevAsName = r.asName || null;
      if (isFnNode(node) && !hasBlockBody(node)) {
        return { error: "path[" + i + "] \u76EE\u6807\u51FD\u6570\u4F53\u4E0D\u662F\u5757\uFF08\u7BAD\u5934\u51FD\u6570\u8868\u8FBE\u5F0F\u4F53\uFF09\uFF0C\u65E0\u6CD5\u6CE8\u5165" };
      }
    }
    return { node: chain[chain.length - 1] };
  }
  function validateBodyCode(code, where) {
    const acorn = getAcorn();
    if (!acorn) throw new Error("acorn \u672A\u52A0\u8F7D");
    try {
      acorn.parse("(function(){" + code + "})", { ecmaVersion: "latest" });
    } catch (e) {
      throw new Error(where + " \u6CE8\u5165\u4F53\u8BED\u6CD5\u9519\u8BEF: " + e.message);
    }
  }
  function validateExprOrBody(code, where) {
    const acorn = getAcorn();
    if (!acorn) throw new Error("acorn \u672A\u52A0\u8F7D");
    try {
      acorn.parse("(" + code + ")", { ecmaVersion: "latest" });
      return "expr";
    } catch (e) {
    }
    try {
      acorn.parse("(function(){" + code + "})", { ecmaVersion: "latest" });
      return "body";
    } catch (e) {
      throw new Error(where + " \u6CE8\u5165\u4F53\u4E0D\u662F\u5408\u6CD5\u8868\u8FBE\u5F0F/\u8BED\u53E5\u4F53: " + e.message);
    }
  }
  function findCallSites(fn, patch, src) {
    const sites = [];
    walkAll(fn, function(n) {
      if (n === fn) return;
      if (n.type !== "CallExpression") return;
      const nm = calleeName(n.callee);
      if (nm !== patch.call) return;
      if (patch.params != null && n.arguments.length !== patch.params) return;
      sites.push(n);
    });
    return sites;
  }
  function disambiguateSites(sites, patch, op) {
    if (!sites.length) throw new Error(op + ': \u76EE\u6807\u51FD\u6570\u5185 0 \u5904\u547D\u4E2D\u8C03\u7528 "' + patch.call + '"');
    if (sites.length > 1 && patch.all !== true && patch.nth == null) {
      throw new Error(op + ": " + sites.length + ' \u5904\u547D\u4E2D\u8C03\u7528 "' + patch.call + '"\uFF0C\u9700\u5199 nth \u6216 all:true');
    }
    if (patch.all !== true) {
      const nth = patch.nth == null ? 0 : patch.nth;
      if (nth < 0 || nth >= sites.length) {
        throw new Error(op + ": nth " + nth + " \u8D8A\u754C\uFF08\u547D\u4E2D " + sites.length + " \u5904\uFF09");
      }
      return [sites[nth]];
    }
    return sites;
  }
  function argsSource(callNode, src) {
    return callNode.arguments.map(function(a) {
      return src.slice(a.start, a.end);
    }).join(", ");
  }
  function applyOp(fn, patch, src, edits) {
    const op = patch.op;
    const code = patch.code;
    if (op === "redirect" || op === "wrapCall" || op === "modifyArg") {
      if (!isFnNode(fn)) throw new Error("op \u76EE\u6807\u4E0D\u662F\u51FD\u6570\uFF1A" + describeFn(fn, src));
      if (!patch.call) throw new Error(op + " \u9700\u8981 call\uFF08\u76EE\u6807\u8C03\u7528\u7684 callee \u70B9\u5206\u540D\uFF0C\u652F\u6301 this.x\uFF09");
      if (code == null || typeof code !== "string") throw new Error(op + " \u9700\u8981 code");
      const sites = disambiguateSites(findCallSites(fn, patch, src), patch, op);
      for (let i = 0; i < sites.length; i++) {
        const callNode = sites[i];
        const argsSrc = argsSource(callNode, src);
        let text;
        let editStart = callNode.start, editEnd = callNode.end;
        if (op === "redirect") {
          const kind = validateExprOrBody(code, "redirect");
          text = kind === "expr" ? "(function ($args) { return (" + code + "); })([" + argsSrc + "])" : "(function ($args) {\n" + code + "\n})([" + argsSrc + "])";
        } else if (op === "wrapCall") {
          validateBodyCode(code, "wrapCall");
          const callee = callNode.callee;
          const calleeSrc = src.slice(callee.start, callee.end);
          const fwdThis = callee.type === "MemberExpression" && callee.object ? src.slice(callee.object.start, callee.object.end) : "this";
          text = "(function ($args) {\nvar $orig = function () { return (" + calleeSrc + ").apply(" + fwdThis + ", arguments.length ? arguments : $args); };\n" + code + "\n})([" + argsSrc + "])";
        } else {
          const kind = validateExprOrBody(code, "modifyArg");
          const argIdx = patch.arg;
          if (argIdx == null || typeof argIdx !== "number" || argIdx < 0) {
            throw new Error("modifyArg \u9700\u8981 arg\uFF08\u5B9E\u53C2\u69FD\u4F4D\u5E8F\u53F7\uFF09");
          }
          if (argIdx >= callNode.arguments.length) {
            throw new Error("modifyArg: arg " + argIdx + " \u8D8A\u754C\uFF08\u8BE5\u8C03\u7528\u5171 " + callNode.arguments.length + " \u4E2A\u5B9E\u53C2\uFF09");
          }
          const argNode = callNode.arguments[argIdx];
          if (argNode.type === "SpreadElement") {
            throw new Error("modifyArg: \u5B9E\u53C2 " + argIdx + " \u662F\u5C55\u5F00\u8BED\u6CD5\uFF08...\uFF09\uFF0C\u65E0\u6CD5\u5355\u72EC\u5305\u88C5");
          }
          editStart = argNode.start;
          editEnd = argNode.end;
          const argSrc = src.slice(argNode.start, argNode.end);
          text = kind === "expr" ? "(function ($arg) { return (" + code + "); })(" + argSrc + ")" : "(function ($arg) {\n" + code + "\n})(" + argSrc + ")";
        }
        const acorn = getAcorn();
        try {
          acorn.parse("(" + text + ")", { ecmaVersion: "latest" });
        } catch (e) {
          throw new Error(op + " \u7EC4\u88C5\u6587\u672C\u8BED\u6CD5\u9519\u8BEF: " + e.message);
        }
        edits.push({ start: editStart, end: editEnd, text });
      }
      return;
    }
    if (!isFnNode(fn) || !hasBlockBody(fn)) {
      throw new Error("op \u76EE\u6807\u4E0D\u662F\u5757\u4F53\u51FD\u6570\uFF1A" + describeFn(fn, src));
    }
    if (op === "inject") {
      const at = patch.at || "head";
      validateBodyCode(code, "inject-" + at);
      if (at === "head") edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: "\n" + code });
      else if (at === "tail") {
        let pos = fn.body.end - 1;
        const stmts = fn.body.body;
        if (stmts.length && stmts[stmts.length - 1].type === "ReturnStatement") pos = stmts[stmts.length - 1].start;
        edits.push({ start: pos, end: pos, text: "\n;" + code + "\n" });
      } else throw new Error("inject at \u4EC5\u652F\u6301 head/tail\uFF0C\u6536\u5230 " + at);
    } else if (op === "overwrite") {
      validateBodyCode(code, "overwrite");
      edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: "\n" + code + "\n" });
    } else if (op === "wrap") {
      validateBodyCode(code, "wrap");
      const paramText = fn.params.length ? src.slice(fn.params[0].start, fn.params[fn.params.length - 1].end) : "";
      const origBody = src.slice(fn.body.start + 1, fn.body.end - 1);
      const n = "_" + fn.start;
      const newBody = "\nfunction __mixin_orig" + n + "(" + paramText + ") {" + origBody + "}\nvar __mixin_args" + n + " = arguments;\nreturn (function ($orig, __mixin_args) {\n" + code + "\n})(function () {return __mixin_orig" + n + ".apply(this, arguments.length ? arguments : __mixin_args" + n + "); }, __mixin_args" + n + ");\n";
      edits.push({ start: fn.body.start + 1, end: fn.body.end - 1, text: newBody });
    } else if (op === "modify") {
      let modParseKind = function(text, what) {
        let eMsg = null;
        try {
          const ast = getAcorn().parse(text, { ecmaVersion: "latest" });
          const first = ast.body[0];
          return ast.body.length === 1 && first && first.type === "ExpressionStatement" ? "expr" : "stmt";
        } catch (e0) {
          eMsg = e0.message;
        }
        try {
          const f = getAcorn().parse("(function(){" + text + "})", { ecmaVersion: "latest" });
          const body = f.body[0].expression.body.body;
          if (body.length === 1) return "stmt";
        } catch (e1) {
        }
        throw new Error("modify." + what + " \u4E0D\u662F\u5408\u6CD5\u8868\u8FBE\u5F0F/\u8BED\u53E5: " + eMsg);
      };
      if (!patch.find || typeof patch.find !== "string") throw new Error("modify \u9700\u8981 find\uFF08\u8282\u70B9\u6E90\u7801\u7CBE\u786E\u6587\u672C\uFF09");
      if (patch.replace == null || typeof patch.replace !== "string") throw new Error("modify \u9700\u8981 replace\uFF08\u66FF\u6362\u8868\u8FBE\u5F0F\u6587\u672C\uFF09");
      modParseKind(patch.find, "find");
      modParseKind(patch.replace, "replace");
      const matches = [];
      walkAll(fn, function(n) {
        if (n === fn) return;
        if (src.slice(n.start, n.end) === patch.find) matches.push(n);
      });
      if (!matches.length) throw new Error('modify: \u76EE\u6807\u51FD\u6570\u5185 0 \u5904\u547D\u4E2D "' + patch.find + '"');
      const kept = matches.filter(function(n) {
        return !matches.some(function(m) {
          return m !== n && m.start <= n.start && m.end >= n.end;
        });
      });
      if (kept.length > 1 && patch.all !== true && patch.nth == null) {
        throw new Error("modify: " + kept.length + ' \u5904\u547D\u4E2D "' + patch.find + '"\uFF0C\u9700\u5199 nth \u6216 all:true');
      }
      let targets = kept;
      if (patch.all !== true) {
        const nth = patch.nth == null ? 0 : patch.nth;
        if (nth < 0 || nth >= kept.length) throw new Error("modify: nth " + nth + " \u8D8A\u754C\uFF08\u547D\u4E2D " + kept.length + " \u5904\uFF09");
        targets = [kept[nth]];
      }
      for (let ti = 0; ti < targets.length; ti++) {
        const isStmt = /Statement$|Declaration$/.test(targets[ti].type);
        edits.push({
          start: targets[ti].start,
          end: targets[ti].end,
          text: isStmt ? patch.replace : "(" + patch.replace + ")"
        });
      }
    } else if (op === "log") {
      edits.push({ start: fn.body.start + 1, end: fn.body.start + 1, text: "\nconsole.log(" + JSON.stringify(String(patch.message || "[mixin] hit")) + ");\n" });
    } else {
      throw new Error("\u672A\u77E5 op: " + op);
    }
  }
  function applyEdits(src, edits) {
    edits.sort(function(a, b) {
      return b.start - a.start || b.end - a.end;
    });
    let out = src;
    for (let i = 0; i < edits.length; i++) {
      const e = edits[i];
      out = out.slice(0, e.start) + e.text + out.slice(e.end);
    }
    return out;
  }
  function editsOverlap(a, b) {
    return a.start < b.end && b.start < a.end;
  }
  function findOverlap(accepted, incoming) {
    for (let i = 0; i < accepted.length; i++) {
      for (let j = 0; j < incoming.length; j++) {
        if (editsOverlap(accepted[i], incoming[j])) {
          return "\u65B0\u7F16\u8F91 @" + incoming[j].start + ".." + incoming[j].end + " \u4E0E\u5DF2\u63A5\u53D7\u7F16\u8F91 @" + accepted[i].start + ".." + accepted[i].end + " \u91CD\u53E0";
        }
      }
    }
    return null;
  }
  function applyAstPatches(filename, source, patches, stats) {
    const acorn = getAcorn();
    if (!acorn) {
      logable("acorn \u672A\u52A0\u8F7D\uFF0C\u8DF3\u8FC7 AST patch: " + filename);
      return source;
    }
    const t0 = Date.now();
    let ast;
    let parseErr = null;
    try {
      ast = acorn.parse(source, { ecmaVersion: "latest" });
    } catch (e1) {
      parseErr = e1;
      try {
        ast = acorn.parse(source, { ecmaVersion: "latest", sourceType: "module" });
      } catch (e2) {
        logable("ERROR: " + filename + " \u89E3\u6790\u5931\u8D25\uFF0C\u8DF3\u8FC7\u5168\u90E8 AST patch: " + parseErr.message);
        return source;
      }
    }
    logable("parsed " + filename + " in " + (Date.now() - t0) + "ms");
    let accepted = [];
    let ok = 0;
    const skipped = [];
    for (let i = 0; i < patches.length; i++) {
      const patch = patches[i];
      const label = patch.name || "patch#" + i;
      try {
        const r = resolvePath(ast, patch.path, source);
        if (r.error) {
          logable("SKIP " + label + ": " + r.error);
          skipped.push(label + ": " + r.error);
          continue;
        }
        const patchEdits = [];
        applyOp(r.node, patch, source, patchEdits);
        const conflict = findOverlap(accepted, patchEdits);
        if (conflict) {
          logable("SKIP " + label + ": " + conflict + "\uFF08\u5750\u6807\u57FA\u4E8E\u539F\u6587\u4EF6\uFF0C\u91CD\u53E0\u4F1A\u9759\u9ED8\u635F\u574F\uFF0C\u62D2\u7EDD\u8BE5 patch\uFF09");
          skipped.push(label + ": " + conflict);
          continue;
        }
        accepted = accepted.concat(patchEdits);
        logable("OK " + label + " (" + patchEdits.length + " \u5904\u7F16\u8F91) \u2192 " + describeFn(r.node, source));
        ok++;
      } catch (e) {
        logable("SKIP " + label + ": " + e.message);
        skipped.push(label + ": " + e.message);
      }
    }
    if (stats) {
      stats.applied = ok;
      stats.skipped = skipped;
    }
    if (ok === 0) {
      logable("WARN: " + filename + " \u6CA1\u6709 AST patch \u751F\u6548\uFF08fail-safe \u8FD4\u56DE\u539F\u6587\u4EF6\uFF09");
      return source;
    }
    const out = applyEdits(source, accepted);
    logable("applied " + ok + "/" + patches.length + " AST patches to " + filename);
    return out;
  }
  var internals = {
    directChildFns: (node) => directChildFns(node),
    fnFeatures: (fn) => fnFeatures(fn),
    matchAnchor: (fn, anchor) => matchAnchor(fn, anchor),
    resolvePath: (ast, path, src) => resolvePath(ast, path, src),
    applyEdits: (src, edits) => applyEdits(src, edits),
    // v2：调用点定位暴露给构建工具做构建期预检（findCallSites(fn, patch, src)）
    findCallSites: (fn, patch, src) => findCallSites(fn, patch, src)
  };

  // src/hosts/layanative.ts
  function installAstGlobals(g = globalThis) {
    g.__mixinAst = {
      version: VERSION,
      applyAstPatches,
      _internals: internals
    };
  }

  // src/compat/ast-compat.ts
  installAstGlobals();
})();
