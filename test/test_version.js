/*
 * test_version.js — 版本号一致性测试（#16）：package.json 是唯一版本来源，
 * tsc 产物的 banner（add-banners 注入）、compat 产物 banner（build-compat 注入）
 * 与运行时 VERSION 常数不得漂移。
 * 运行：node test/test_version.js（npm test 已先完成构建）
 */
'use strict';
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;

var failures = 0;
function check(name, cond, detail) {
    if (cond) console.log('  PASS ' + name);
    else { console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); failures++; }
}

var bannerRe = /^\/\*! jsmixin v(\S+) \| MIT License/;

check('package.json version 存在', !!pkg, String(pkg));
check('ast.VERSION 与 package.json 一致', require('../dist/cjs/core/ast.js').VERSION === pkg,
    'ast=' + require('../dist/cjs/core/ast.js').VERSION + ' pkg=' + pkg);
check('engine.VERSION 与 package.json 一致', require('../dist/cjs/core/engine.js').VERSION === pkg,
    'engine=' + require('../dist/cjs/core/engine.js').VERSION + ' pkg=' + pkg);

var cjsBanner = fs.readFileSync(path.join(root, 'dist/cjs/index.js'), 'utf8').match(bannerRe);
check('dist/cjs banner 与 package.json 一致', !!cjsBanner && cjsBanner[1] === pkg, cjsBanner && cjsBanner[1]);
var esmBanner = fs.readFileSync(path.join(root, 'dist/esm/index.js'), 'utf8').match(bannerRe);
check('dist/esm banner 与 package.json 一致', !!esmBanner && esmBanner[1] === pkg, esmBanner && esmBanner[1]);
var runtimeBanner = fs.readFileSync(path.join(root, 'runtime/mixinTransformer.js'), 'utf8').match(bannerRe);
check('runtime banner 与 package.json 一致', !!runtimeBanner && runtimeBanner[1] === pkg, runtimeBanner && runtimeBanner[1]);

if (failures) { console.log('版本一致性: ' + failures + ' 项失败'); process.exit(1); }
console.log('版本一致性 OK（' + pkg + '）');
