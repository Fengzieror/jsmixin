/*
 * build-compat.mjs — 生成 LayaNative 兼容产物 runtime/mixinAst.js + runtime/mixinTransformer.js
 *
 * 这两个路径是 tools/build_mixin_apk.py 的固定拼接输入（+ vendor/acorn.js），
 * 与 test/test_*.js、build-tool/build.js 的 require 目标——路径与全局契约不容改动。
 * 产物头部带 generated 标记；IIFE、零外部依赖、不打包 acorn（vendor/acorn.js 先行加载）。
 */
import * as esbuild from 'esbuild';
import fs from 'fs';

const banner = (src) => ({ js: '/* 由 jsmixin v2 构建生成（源: ' + src + '），勿手改。 */' });

const common = {
    bundle: true,
    format: 'iife',
    platform: 'neutral',
    target: 'es2020',
    minify: false,
    legalComments: 'inline'
};

await esbuild.build({
    ...common,
    entryPoints: ['src/compat/ast-compat.ts'],
    outfile: 'runtime/mixinAst.js',
    banner: banner('src/compat/ast-compat.ts')
});

await esbuild.build({
    ...common,
    entryPoints: ['src/compat/transformer-compat.ts'],
    outfile: 'runtime/mixinTransformer.js',
    banner: banner('src/compat/transformer-compat.ts')
});

// 防御性检查：产物必须挂上 v1 全局契约符号
const astJs = fs.readFileSync('runtime/mixinAst.js', 'utf8');
const trJs = fs.readFileSync('runtime/mixinTransformer.js', 'utf8');
for (const sym of ['__mixinAst', 'applyAstPatches', '_internals']) {
    if (!astJs.includes(sym)) { console.error('FATAL: runtime/mixinAst.js 缺少全局符号 ' + sym); process.exit(1); }
}
for (const sym of ['__mixin', '__mixinTransform', '__mixinEvalHooked', 'sourceHash']) {
    if (!trJs.includes(sym)) { console.error('FATAL: runtime/mixinTransformer.js 缺少全局符号 ' + sym); process.exit(1); }
}
console.log('compat bundles OK: runtime/mixinAst.js, runtime/mixinTransformer.js');
