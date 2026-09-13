import { VERSION as AST_VERSION } from './ast.js';
import type { ModDescription } from './types.js';
export declare const VERSION = "2.0.0";
export interface MixinLog {
    (msg: string): void;
}
export interface EngineOptions {
    /** acorn 实例（不传则回退 globalThis.acorn，兼容 vendor/acorn.js 先加载的组装线） */
    acorn?: any;
    /** 日志钩子（缺省 console.log，带 '[mixin] ' 前缀） */
    log?: MixinLog;
}
export interface MixinEngine {
    /** 注册一个 mod 描述（mixins 数组会打上 _modid 戳） */
    register(mod: ModDescription): void;
    /** 对 (filename, source) 应用全部已注册 patch，返回（可能未修改的）字符串 */
    transformFile(filename: string, source: string): string;
    /** 清空已注册 mod（测试/热重载用） */
    reset(): void;
    /** FNV-1a 32 位 + 长度：'fnv1a32:xxxx:len:nnn'（哈希锁用） */
    sourceHash(s: string): string;
    stats(): {
        mods: number;
        version: string;
    };
    readonly version: string;
}
export declare function sourceHash(s: string): string;
export declare function createMixinEngine(options?: EngineOptions): MixinEngine;
export { AST_VERSION };
