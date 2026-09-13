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
export { createMixinEngine, sourceHash, VERSION } from './core/engine.js';
export { applyAstPatches, resolvePath, setAcorn, internals, VERSION as AST_VERSION } from './core/ast.js';
export { createModLoader } from './loader/loader.js';
/*
 * 注意：根入口零副作用——不激活任何宿主钩子。
 * Node 宿主（eval/Function/vm/require 钩子 + mod 装载）请用 'jsmixin/node'
 * （CJS 产物，ESM 可通过默认互操作导入；导入即激活，幂等）。
 */
