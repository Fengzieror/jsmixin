/*
 * add-banners.mjs — 给 tsc 产物（dist/cjs、dist/esm）顶部插入许可声明头。
 *
 * esbuild 产物（runtime/*、dist/boot）由 build-compat.mjs 的 banner 选项处理，
 * 不经过本脚本；这里用 `/*!` 前缀做幂等保护，重复构建不会叠加。
 * tsc 没有 banner 选项，所以走后置处理。
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BANNER = '/*! jsmixin v2.1.0 | MIT License | https://github.com/Fengzieror/jsmixin */\n';

function walk(dir) {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, f.name);
        if (f.isDirectory()) walk(p);
        else if (f.name.endsWith('.js')) {
            const src = readFileSync(p, 'utf8');
            if (!src.startsWith('/*!')) writeFileSync(p, BANNER + src);
        }
    }
}

walk('dist/cjs');
walk('dist/esm');
console.log('banners OK: dist/cjs, dist/esm');
