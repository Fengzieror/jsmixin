"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
/*
 * hosts/cli.ts — `jsmixin` CLI（bin 入口）。
 *
 *   jsmixin run <entry.js> [--mods <dir>]
 *     激活 Node 宿主（eval/Function/vm/require 全钩子 + mod 装载）后 require 入口脚本。
 *     用于冒烟验证："被 patch 的程序"本身零改动地跑在 mixin 管线里。
 */
const node_js_1 = require("./node.js");
function main(argv) {
    if (argv.length < 2 || argv[0] !== 'run') {
        console.error('用法: jsmixin run <entry.js> [--mods <dir>]');
        return 2;
    }
    const entry = argv[1];
    let modsDir;
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--mods') {
            modsDir = argv[i + 1];
            i++;
        }
    }
    (0, node_js_1.activateNodeHost)(modsDir ? { modsDir } : undefined);
    // 装载 + 钩子就绪后加载入口
    require(require('path').resolve(entry));
    return 0;
}
if (require.main === module) {
    process.exit(main(process.argv.slice(2)));
}
