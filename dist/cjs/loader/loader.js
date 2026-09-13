"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModLoader = createModLoader;
function defaultExecute(code, sourceURL) {
    // indirect eval：在全局作用域执行（mod patches 期望挂 window.__mixin.register）
    (0, eval)(code + '\n//@ sourceURL=' + sourceURL);
}
function createModLoader(options) {
    const engine = options.engine;
    const readFile = options.readFile;
    const execute = options.execute || defaultExecute;
    const tag = options.tag || '[mixin-loader]';
    const log = options.log || (function (m) {
        try {
            console.log(tag + ' ' + m);
        }
        catch (e) { /* ignore */ }
    });
    const warn = function (m) {
        try {
            console.log(tag + ' WARN: ' + m);
        }
        catch (e) { /* ignore */ }
    };
    const entries = []; // mod 的 entry 队列（游戏启动后执行）
    let ranEntries = false;
    let loadedOk = false; // mods 已装载（或确定本会话无 mod）
    let lastRoot = null;
    function runEntries() {
        if (ranEntries)
            return;
        ranEntries = true;
        log('执行 ' + entries.length + ' 个 mod entry');
        for (let i = 0; i < entries.length; i++) {
            try {
                entries[i]();
            }
            catch (e) {
                warn('entry#' + i + ' 异常: ' + e);
            }
        }
    }
    function loadOne(root, id) {
        const dir = root + '/' + id;
        const mfTxt = readFile(dir + '/mixins.json');
        if (!mfTxt) {
            warn('mod "' + id + '" 缺 mixins.json，跳过');
            return;
        }
        let manifest;
        try {
            manifest = JSON.parse(mfTxt);
        }
        catch (e) {
            warn('mod "' + id + '" mixins.json 解析失败，跳过');
            return;
        }
        const mixinFiles = (manifest.mixins && manifest.mixins.length) ? manifest.mixins : ['patches.js'];
        for (let m = 0; m < mixinFiles.length; m++) {
            const code = readFile(dir + '/' + mixinFiles[m]);
            if (!code) {
                warn('mod "' + id + '" 的 ' + mixinFiles[m] + ' 不可读，跳过');
                return;
            }
            execute(code, id + '/' + mixinFiles[m]);
            log('mod "' + id + '" v' + (manifest.version || '?') + ' 注册: ' + mixinFiles[m]);
        }
        if (manifest.entry) {
            const entryTxt = readFile(dir + '/' + manifest.entry);
            if (entryTxt) {
                entries.push(function (code, mid) {
                    return function () {
                        execute(code, mid + '/entry.js');
                    };
                }(entryTxt, id));
            }
            else {
                warn('mod "' + id + '" entry ' + manifest.entry + ' 不可读');
            }
        }
    }
    function loadMods(root) {
        loadedOk = true;
        lastRoot = root;
        const listTxt = readFile(root + '/mods.json');
        let list = null;
        if (listTxt) {
            try {
                list = JSON.parse(listTxt);
            }
            catch (e) {
                warn('mods.json 解析失败: ' + e);
            }
        }
        if (!list)
            list = [];
        if (!list.length && list.mods)
            list = list.mods;
        if (!list.length) {
            log(root + '/mods.json 为空或不存在：无外部 mod');
            return { registered: 0, total: 0 };
        }
        let registered = 0;
        for (let i = 0; i < list.length; i++) {
            const ent = list[i];
            const id = typeof ent === 'string' ? ent : (ent && ent.id);
            if (!id)
                continue;
            if (ent && ent.enabled === false) {
                log('mod "' + id + '" 已禁用（enabled=false），跳过');
                continue;
            }
            try {
                loadOne(root, id);
                registered++;
            }
            catch (e) {
                warn('mod "' + id + '" 装载失败: ' + e);
            }
        }
        log('外部 mod 装载完成: ' + registered + '/' + list.length + '（entries: ' + entries.length + '）');
        return { registered: registered, total: list.length };
    }
    return {
        loadMods: loadMods,
        loadOne: function (root, id) {
            loadedOk = true;
            lastRoot = root;
            loadOne(root, id);
        },
        windowClosed: function () {
            if (!loadedOk)
                warn('注册窗口关闭时装载未完成，外部 mod 未生效（下次启动重试）');
        },
        runEntries: runEntries,
        entries: entries,
        reload: function () { if (lastRoot)
            loadMods(lastRoot); }
    };
}
