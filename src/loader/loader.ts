/*
 * loader/loader.ts — 泛化的外部 mod 装载器（从 LayaNative mixins/base-loader/loader.js 提炼）。
 *
 * mod 目录约定（泛化 loader；mod 包跨宿主通用，目录名即 modid）：
 *   <root>/mods.json            # 激活列表：["id-a","id-b"] 或 {"mods":[{id,enabled}]}；缺省时宿主可目录扫描
 *   <root>/<id>/mixins.json     # 清单 {modid, version, mixins:["patches.js"], entry?}
 *   <root>/<id>/patches.js      # register 产物（调用 __mixin.register(...)）
 *   <root>/<id>/<entry>         # 可选：游戏/应用启动后执行的附加式代码
 * （LayaNative 内置 loader.js 用 /sdcard/.battlecraft/mods/<id>/ 布局，逻辑同构。）
 *
 * 宿主只需提供两个抽象：
 *   readFile(path) → string        # fs / LayaNative native modReadFileSync / 同步 fetch 代理
 *   execute(code, sourceURL)       # 在当前运行时执行 mod patch 代码（缺省 (0,eval)）
 *
 * 纪律（继承 v1）：
 *   - 注册窗口：所有 patch 必须在目标代码装载/变换前注册完。装载是同步的；
 *     错过窗口本会话不生效（下次启动重试），windowClosed() 供宿主在窗口关闭时调用。
 *   - 每个 mod 独立 try/catch，单个 mod 失败不影响其他 mod 与宿主本体。
 *   - required 块：哈希校验暂不要求（fail-open），与 v1 一致。
 */
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
    loadMods(root: string): { registered: number; total: number };
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

function defaultExecute(code: string, sourceURL: string): void {
    // indirect eval：在全局作用域执行（mod patches 期望挂 window.__mixin.register）
    (0, eval)(code + '\n//@ sourceURL=' + sourceURL);
}

export function createModLoader(options: ModLoaderOptions): ModLoader {
    const engine = options.engine;
    const readFile = options.readFile;
    const execute = options.execute || defaultExecute;
    const tag = options.tag || '[mixin-loader]';
    const log = options.log || (function (m: string): void {
        try { console.log(tag + ' ' + m); } catch (e) { /* ignore */ }
    });
    const warn = function (m: string): void {
        try { console.log(tag + ' WARN: ' + m); } catch (e) { /* ignore */ }
    };

    const entries: (() => void)[] = [];  // mod 的 entry 队列（游戏启动后执行）
    let ranEntries = false;
    let loadedOk = false; // mods 已装载（或确定本会话无 mod）
    let lastRoot: string | null = null;

    function runEntries(): void {
        if (ranEntries) return;
        ranEntries = true;
        log('执行 ' + entries.length + ' 个 mod entry');
        for (let i = 0; i < entries.length; i++) {
            try { entries[i](); } catch (e: any) { warn('entry#' + i + ' 异常: ' + e); }
        }
    }

    function loadOne(root: string, id: string): void {
        const dir = root + '/' + id;
        const mfTxt = readFile(dir + '/mixins.json');
        if (!mfTxt) { warn('mod "' + id + '" 缺 mixins.json，跳过'); return; }
        let manifest: any;
        try { manifest = JSON.parse(mfTxt); } catch (e: any) { warn('mod "' + id + '" mixins.json 解析失败，跳过'); return; }
        const mixinFiles = (manifest.mixins && manifest.mixins.length) ? manifest.mixins : ['patches.js'];
        for (let m = 0; m < mixinFiles.length; m++) {
            const code = readFile(dir + '/' + mixinFiles[m]);
            if (!code) { warn('mod "' + id + '" 的 ' + mixinFiles[m] + ' 不可读，跳过'); return; }
            execute(code, id + '/' + mixinFiles[m]);
            log('mod "' + id + '" v' + (manifest.version || '?') + ' 注册: ' + mixinFiles[m]);
        }
        if (manifest.entry) {
            const entryTxt = readFile(dir + '/' + manifest.entry);
            if (entryTxt) {
                entries.push(function (code: string, mid: string): () => void {
                    return function (): void {
                        execute(code, mid + '/entry.js');
                    };
                }(entryTxt, id));
            } else {
                warn('mod "' + id + '" entry ' + manifest.entry + ' 不可读');
            }
        }
    }

    function loadMods(root: string): { registered: number; total: number } {
        loadedOk = true;
        lastRoot = root;
        const listTxt = readFile(root + '/mods.json');
        let list: any = null;
        if (listTxt) {
            try { list = JSON.parse(listTxt); } catch (e: any) { warn('mods.json 解析失败: ' + e); }
        }
        if (!list) list = [];
        if (!list.length && list.mods) list = list.mods;
        if (!list.length) { log(root + '/mods.json 为空或不存在：无外部 mod'); return { registered: 0, total: 0 }; }

        let registered = 0;
        for (let i = 0; i < list.length; i++) {
            const ent = list[i];
            const id = typeof ent === 'string' ? ent : (ent && ent.id);
            if (!id) continue;
            if (ent && ent.enabled === false) { log('mod "' + id + '" 已禁用（enabled=false），跳过'); continue; }
            try {
                loadOne(root, id);
                registered++;
            } catch (e: any) {
                warn('mod "' + id + '" 装载失败: ' + e);
            }
        }
        log('外部 mod 装载完成: ' + registered + '/' + list.length + '（entries: ' + entries.length + '）');
        return { registered: registered, total: list.length };
    }

    return {
        loadMods: loadMods,
        loadOne: function (root: string, id: string): void {
            loadedOk = true;
            lastRoot = root;
            loadOne(root, id);
        },
        windowClosed: function (): void {
            if (!loadedOk) warn('注册窗口关闭时装载未完成，外部 mod 未生效（下次启动重试）');
        },
        runEntries: runEntries,
        entries: entries,
        reload: function (): void { if (lastRoot) loadMods(lastRoot); }
    };
}
