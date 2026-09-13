import { createMixinEngine } from '../core/engine.js';
import { type ModLoader } from '../loader/loader.js';
export interface NodeHostOptions {
    /** mod 根目录（缺省 <cwd>/mods；存在 mods.json 按列表装载，否则扫描子目录） */
    modsDir?: string;
    /** acorn 实例（缺省 require('acorn')） */
    acorn?: any;
    /** 关闭 require hook（只用 eval/Function/vm 包装时） */
    noRequireHook?: boolean;
    /** 关闭 vm 包装 */
    noVmHook?: boolean;
    /** 跳过 mod 自动装载 */
    noMods?: boolean;
}
export interface NodeHost {
    engine: ReturnType<typeof createMixinEngine>;
    loader: ModLoader;
    modsDir: string;
}
export declare function activateNodeHost(options?: NodeHostOptions): NodeHost;
declare const host: NodeHost;
export default host;
export declare const engine: import("../core/engine.js").MixinEngine;
export declare const loader: ModLoader;
