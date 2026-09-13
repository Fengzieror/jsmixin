/*
 * compat/ast-compat.ts — runtime/mixinAst.js 的生成源。
 * 由 scripts/build-compat.mjs 用 esbuild 打包（IIFE、无外部依赖），
 * 头部带 generated 标记。加载顺序：vendor/acorn.js → 本文件 → mixinTransformer.js。
 */
import { installAstGlobals } from '../hosts/layanative.js';

installAstGlobals();
