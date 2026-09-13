"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModLoader = exports.AST_VERSION = exports.internals = exports.setAcorn = exports.resolvePath = exports.applyAstPatches = exports.VERSION = exports.sourceHash = exports.createMixinEngine = void 0;
/*
 * index.ts — jsmixin 核心公共 API（npm 包入口）。
 *
 * 纯库用法（宿主自有加载管线）：
 *   import { createMixinEngine } from 'jsmixin';
 *   const engine = createMixinEngine({ acorn });
 *   engine.register(modDescription);
 *   const out = engine.transformFile(filename, source);
 *
 * 宿主适配：'jsmixin/node'（一行引入）；LayaNative 用 runtime/*.js 兼容产物。
 */
var engine_js_1 = require("./core/engine.js");
Object.defineProperty(exports, "createMixinEngine", { enumerable: true, get: function () { return engine_js_1.createMixinEngine; } });
Object.defineProperty(exports, "sourceHash", { enumerable: true, get: function () { return engine_js_1.sourceHash; } });
Object.defineProperty(exports, "VERSION", { enumerable: true, get: function () { return engine_js_1.VERSION; } });
var ast_js_1 = require("./core/ast.js");
Object.defineProperty(exports, "applyAstPatches", { enumerable: true, get: function () { return ast_js_1.applyAstPatches; } });
Object.defineProperty(exports, "resolvePath", { enumerable: true, get: function () { return ast_js_1.resolvePath; } });
Object.defineProperty(exports, "setAcorn", { enumerable: true, get: function () { return ast_js_1.setAcorn; } });
Object.defineProperty(exports, "internals", { enumerable: true, get: function () { return ast_js_1.internals; } });
Object.defineProperty(exports, "AST_VERSION", { enumerable: true, get: function () { return ast_js_1.VERSION; } });
var loader_js_1 = require("./loader/loader.js");
Object.defineProperty(exports, "createModLoader", { enumerable: true, get: function () { return loader_js_1.createModLoader; } });
/*
 * 注意：根入口零副作用——不激活任何宿主钩子。
 * Node 宿主（eval/Function/vm/require 钩子 + mod 装载）请用 'jsmixin/node'
 * （CJS 产物，ESM 可通过默认互操作导入；导入即激活，幂等）。
 */
