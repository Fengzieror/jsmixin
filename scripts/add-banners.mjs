/*
 * add-banners.mjs — 给 tsc 产物（dist/cjs、dist/esm）顶部插入许可声明头。
 *
 * esbuild 产物（runtime/*、dist/boot）由 build-compat.mjs 的 banner 选项处理，
 * 不经过本脚本；这里用 `/*!` 前缀做幂等保护，重复构建不会叠加。
 * tsc 没有 banner 选项，所以走后置处理。
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 版本单一来源：package.json（#16，bump 只改一处）
const VERSION = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8')).version;
const BANNER = '/*! jsmixin v' + VERSION + ' | MIT License | https://github.com/Fengzieror/jsmixin */\n';

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

// dist/esm 在 build:cjs 阶段尚不存在（构建链 build:cjs → build:esm），
// 全新克隆 npm install 触发 prepare 时尤其如此——缺失即跳过，由下一轮补齐
const done = [];
if (existsSync('dist/cjs')) { walk('dist/cjs'); done.push('dist/cjs'); }
if (existsSync('dist/esm')) { walk('dist/esm'); done.push('dist/esm'); }
console.log('banners OK: ' + (done.join(', ') || '(no dist output yet)'));
