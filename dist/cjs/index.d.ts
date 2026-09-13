export { createMixinEngine, sourceHash, VERSION } from './core/engine.js';
export { applyAstPatches, resolvePath, setAcorn, internals, VERSION as AST_VERSION } from './core/ast.js';
export { createModLoader } from './loader/loader.js';
export type { ModDescription, MixinEntry, Patch, PathSeg, Anchor, SourceEdit, PatchStats, ResolveResult } from './core/types.js';
