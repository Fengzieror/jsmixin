/*
 * hosts/cli.ts — `jsmixin` CLI（bin 入口）。
 *
 *   jsmixin run <entry.js> [--mods <dir>]
 *     激活 Node 宿主（eval/Function/vm/require 全钩子 + mod 装载）后 require 入口脚本。
 *     用于冒烟验证："被 patch 的程序"本身零改动地跑在 mixin 管线里。
 */
import { activateNodeHost } from './node.js';

function main(argv: string[]): number {
    if (argv.length < 2 || argv[0] !== 'run') {
        console.error('用法: jsmixin run <entry.js> [--mods <dir>]');
        return 2;
    }
    const entry = argv[1];
    let modsDir: string | undefined;
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--mods') { modsDir = argv[i + 1]; i++; }
    }
    activateNodeHost(modsDir ? { modsDir } : undefined);
    // 装载 + 钩子就绪后加载入口
    require(require('path').resolve(entry));
    return 0;
}

if (require.main === module) {
    // 不能 process.exit：Node 宿主的 mod entry 是 setTimeout(0) 调度的，exit 会丢弃
    // pending timer，带 entry 的 mod 在 CLI 冒烟模式下永不执行（#8）。
    // 改设 exitCode 让事件循环自然排空（entry 执行完毕后进程自然退出；
    // 入口脚本若是常驻服务，进程随其事件循环存续）。
    process.exitCode = main(process.argv.slice(2));
}

export { main };
