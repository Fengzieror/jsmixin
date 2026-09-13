"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * compat/transformer-compat.ts — runtime/mixinTransformer.js 的生成源。
 * 由 scripts/build-compat.mjs 用 esbuild 打包（IIFE、无外部依赖）。
 * C++ 在 runtimeInit.js 之后、apploader.js 之前执行本文件（经 JSP_RUN_SCRIPT）。
 */
const layanative_js_1 = require("../hosts/layanative.js");
(0, layanative_js_1.installTransformerGlobals)();
