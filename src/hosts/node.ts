/*
 * hosts/node.ts — Node.js 宿主适配器（"一行引入"档位）。
 *
 * 用法：在一切业务代码之前 `require('jsmixin/node')`（或 node --require jsmixin/node）。
 * 引入即生效：
 *   1. 包装 globalThis.eval 与 Function 构造器（ECMAScript 规范层仅有的两个
 *      "字符串→编译"入口，先加载防原始引用抢跑）；
 *   2. 包装 vm.Script / runInThisContext / runInNewContext / runInContext（可选加固）；
 *   3. hook require（Module._extensions['.js']）；
 *   4. 装载 mod 目录（缺省 <cwd>/mods：mods.json 或目录扫描）；
 *   5. 暴露全局 __mixin（与 LayaNative 相同契约，mod 包跨宿主通用）；
 *   6. entry 队列在装载完成后下一轮事件循环执行。
 *
 * mod 目录约定见 src/loader/loader.ts 头注。
 */
import * as fs from 'fs';
import * as path from 'path';
import { createMixinEngine, sourceHash as engineSourceHash, VERSION } from '../core/engine.js';
import { createModLoader, type ModLoader } from '../loader/loader.js';
import type { ModDescription } from '../core/types.js';

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

type G = any;

function discoverScanDirs(root: string): string[] {
    // 目录扫描：root/<id>/mixins.json（mod 目录与 mods.json 并排）
    try {
        return fs.readdirSync(root, { withFileTypes: true })
            .filter((d: any) => d.isDirectory())
            .map((d: any) => path.join(root, d.name))
            .filter((p: string) => fs.existsSync(path.join(p, 'mixins.json')));
    } catch (e) {
        return [];
    }
}

export function activateNodeHost(options?: NodeHostOptions): NodeHost {
    const g = globalThis as G;
    const existing = g.__jsmixinNodeHost as NodeHost | undefined;
    if (existing) {
        // 重复激活：幂等返回旧实例，但 options 不一致时必须出声（#14），静默吞掉会误导排障
        if (options && options.modsDir && options.modsDir !== existing.modsDir) {
            console.log('[jsmixin] WARN: 宿主已激活（modsDir=' + existing.modsDir + '），本次 modsDir=' + options.modsDir + ' 被忽略');
        }
        return existing;
    }

    let acornInst = options && options.acorn;
    if (!acornInst) {
        try { acornInst = require('acorn'); } catch (e) { acornInst = undefined; }
    }
    const engine = createMixinEngine({ acorn: acornInst });

    function log(msg: string): void {
        try { console.log('[jsmixin] ' + msg); } catch (e) { /* ignore */ }
    }

    // 全局 __mixin：与 LayaNative 完全相同契约 → mod 的 patches.js 跨宿主通用
    g.__mixin = {
        version: VERSION,
        register: function (mod: ModDescription): void { engine.register(mod); },
        stats: function (): any { return engine.stats(); },
        sourceHash: engineSourceHash
    };

    /* ---- 语言层拦截：eval + Function（先加载防抢跑） ---- */

    // "字符串→编译"的统一变换入口：优先用文本尾部的 //@ sourceURL= 作为文件名
    // （与 LayaNative eval 钩子同规则），没有则用通道回退名。
    function transformAuto(src: string, fallbackName: string): string {
        const m = /\/\/@ sourceURL=(.+?)\s*$/.exec(src);
        return engine.transformFile(m ? m[1] : fallbackName, src);
    }

    const origEval = g.eval;
    if (typeof origEval === 'function') {
        g.eval = function (src: string): any {
            if (typeof src === 'string' && src.length > 64) {
                try {
                    const t = transformAuto(src, '(inline-eval)');
                    if (t !== src && /(^|[^\w$.])eval\s*\(/.test(src)) {
                        // 语义边界告警（#3）：包装后 eval 内部对原始 eval 的调用是【间接 eval】，
                        // 目标代码里的直接 eval 会失去词法作用域语义（ReferenceError / 全局泄漏）。
                        // 这无法在保持语义的前提下拦截，只能告警 + 文档声明（docs/error-policy.md）。
                        log('WARN: 目标代码疑似含直接 eval，eval 钩子会将其变为间接 eval（词法作用域语义改变），相关代码可能报 ReferenceError');
                    }
                    src = t;
                } catch (e: any) {
                    log('eval transform error: ' + e);
                }
            }
            return origEval(src);
        };
    } else {
        log('WARN: eval 不可用，eval 钩子未安装');
    }

    const OriginalFunction = g.Function;
    const WrappedFunction = function (this: any, ...args: any[]): any {
        const body = args[args.length - 1];
        if (typeof body === 'string' && body.length > 64) {
            try {
                const t = transformAuto(body, '(new Function)');
                if (t !== body) {
                    args = args.slice();
                    args[args.length - 1] = t;
                }
            } catch (e: any) {
                log('Function transform error: ' + e);
            }
        }
        return new OriginalFunction(...args);
    } as any;
    WrappedFunction.prototype = OriginalFunction.prototype;
    g.Function = WrappedFunction;

    /* ---- vm 加固（可选）：vm.Script / runInThisContext / runInNewContext / runInContext ---- */

    if (!(options && options.noVmHook)) {
        try {
            const vm = require('vm');
            if (vm && !vm.__jsmixinPatched) {
                const OrigScript = vm.Script;
                const WrappedScript = function (...args: any[]): any {
                    const code = args[0];
                    if (typeof code === 'string' && code.length > 64) {
                        try {
                            const t = transformAuto(code, '(vm.Script)');
                            if (t !== code) { args = args.slice(); args[0] = t; }
                        } catch (e: any) { log('vm.Script transform error: ' + e); }
                    }
                    return new OrigScript(...args);
                };
                WrappedScript.prototype = OrigScript.prototype;
                vm.Script = WrappedScript;
                const wrapRun = (name: string): void => {
                    const orig = vm[name];
                    if (typeof orig !== 'function') return;
                    vm[name] = function (...args: any[]): any {
                        const code = args[0];
                        if (typeof code === 'string' && code.length > 64) {
                            try {
                                const t = transformAuto(code, '(vm.' + name + ')');
                                if (t !== code) { args = args.slice(); args[0] = t; }
                            } catch (e: any) { log('vm.' + name + ' transform error: ' + e); }
                        }
                        return orig.apply(vm, args);
                    };
                };
                wrapRun('runInThisContext');
                wrapRun('runInNewContext');
                wrapRun('runInContext');
                vm.__jsmixinPatched = true;
            }
        } catch (e) {
            log('vm 钩子未安装: ' + e);
        }
    }

    /* ---- require hook（Module._extensions['.js']） ---- */

    if (!(options && options.noRequireHook)) {
        const Module = require('module');
        const origJs = Module._extensions['.js'];
        Module._extensions['.js'] = function (module: any, filename: string): void {
            let src: string;
            try {
                src = fs.readFileSync(filename, 'utf8');
            } catch (e) {
                return origJs.call(this, module, filename); // 读不到按原逻辑（会抛出原生错误）
            }
            const out = engine.transformFile(filename, src);
            module._compile(out, filename);
        };
    }

    /* ---- mod 装载（mods.json 优先，否则目录扫描） ---- */

    const loader = createModLoader({
        engine: engine,
        readFile: function (p: string): string {
            try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; }
        }
    });

    const modsDir = (options && options.modsDir) || path.join(process.cwd(), 'mods');
    if (!(options && options.noMods) && fs.existsSync(modsDir)) {
        if (fs.existsSync(path.join(modsDir, 'mods.json'))) {
            loader.loadMods(modsDir);
        } else {
            const dirs = discoverScanDirs(modsDir);
            if (dirs.length) {
                for (let i = 0; i < dirs.length; i++) {
                    try { loader.loadOne(modsDir, path.basename(dirs[i])); } catch (e: any) { log('mod 装载失败: ' + e); }
                }
                log('外部 mod 装载完成（目录扫描 ' + dirs.length + ' 个，entries: ' + loader.entries.length + '）');
            }
        }
        // entry 队列：装载完成后下一轮事件循环执行（Node 无"游戏启动"挂点）
        if (typeof setTimeout === 'function') setTimeout(function (): void { loader.runEntries(); }, 0);
    }

    const host: NodeHost = { engine: engine, loader: loader, modsDir: modsDir };
    g.__jsmixinNodeHost = host;
    return host;
}

// require('jsmixin/node') 即激活（幂等）
const host = activateNodeHost();
export default host;
export const engine = host.engine;
export const loader = host.loader;
