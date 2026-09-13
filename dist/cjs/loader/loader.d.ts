import type { MixinEngine } from '../core/engine.js';
export interface ModLoaderOptions {
    engine: MixinEngine;
    readFile(path: string): string;
    /** 缺省：indirect eval（对 LayaNative/Node/浏览器都可用），尾部加 //@ sourceURL 便于栈定位 */
    execute?(code: string, sourceURL: string): void;
    log?(msg: string): void;
    /** 日志标签，缺省 '[mixin-loader]' */
    tag?: string;
}
export interface ModLoader {
    /** 读 <root>/mods.json 并装载列表中的 mod（同步）。返回 {registered, total} */
    loadMods(root: string): {
        registered: number;
        total: number;
    };
    /** 装载单个 mod 目录（不走 mods.json，宿主自行决定列表时用） */
    loadOne(root: string, id: string): void;
    /** 注册窗口已关闭（宿主在"目标代码开始装载"时调用；未装载成功则告警） */
    windowClosed(): void;
    /** 执行 entry 队列（宿主在游戏/应用启动后调用；v1 语义） */
    runEntries(): void;
    /** entry 队列（调试/宿主自管用） */
    entries: (() => void)[];
    /** 调试用：手动重试装载 */
    reload(): void;
}
export declare function createModLoader(options: ModLoaderOptions): ModLoader;
