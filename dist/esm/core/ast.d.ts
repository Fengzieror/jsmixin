import type { Patch, PathSeg, PatchStats, ResolveResult, AstInternals } from './types.js';
export declare const VERSION = "2.0.0";
export declare function setAcorn(a: any): void;
export declare function resolvePath(ast: any, path: PathSeg[], src: string): ResolveResult;
export declare function applyAstPatches(filename: string, source: string, patches: Patch[], stats?: PatchStats): string;
export declare const internals: AstInternals;
