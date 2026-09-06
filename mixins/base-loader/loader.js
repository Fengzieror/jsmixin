/*
 * loader.js — 阶段1：外部 mod 装载器（DESIGN-layout.md 阶段1）
 *
 * 由 APK 组装线追加到 patch_bundle.js 一起执行（C++ 固定脚本列表，无需改 so 列表）。
 * 存储：/sdcard/.battlecraft/（pdzzlauncher/docs/MOD_STORAGE.md 定稿结构），固定读点
 * 为根 mods.json（launcher 选版本后拷贝到根）。真实路径由 native modFsStatus()
 * 提供（Java Environment 动态解析，禁止硬编码 /sdcard）。
 *
 * 双模式授权（见 android-modfs/）：
 *   - 旧版存储权限（Android 6-10 + 11 legacy）：真实路径 fopen 直读
 *   - SAF 文件夹授权（Android 11+）：ContentResolver 读（native modReadFileSync 兜底路由）
 *
 * 纪律（DESIGN-layout.md §三）：
 *   - 注册窗口：所有 patch 必须在 main.min.js 变换前注册完。本 loader 在
 *     patch_bundle 执行时【同步】尝试装载；只有"未授权"场景是异步的——
 *     此时也读不到任何 mod 文件，直接拉起授权并提示重启游戏生效。
 *   - 每个 mod 独立 try/catch，单个 mod 失败不影响其他 mod 与游戏本体。
 *   - required 块：哈希校验暂不要求，不校验（fail-open）。
 *
 * mods.json 格式（兼容两种，launcher 实际产出为后者）：
 *   ["mod-a","mod-b"]
 *   {"mods":[{"id":"mod-a","enabled":true},{"id":"mod-b","enabled":false}]}
 * 每个 mod 目录：mixins.json（manifest）+ patches.js（register 产物）+ 可选 entry
 */
(function (global) {
    'use strict';

    var TAG = '[mixin-loader]';

    function log(m) { try { console.log(TAG + ' ' + m); } catch (e) {} }
    function warn(m) { try { console.log(TAG + ' WARN: ' + m); } catch (e) {} }

    var entries = [];   // mod 的 entry 队列（游戏启动后执行）
    var ranEntries = false;
    var loadedOk = false; // mods 已装载（或确定本会话无 mod）

    function runEntries() {
        if (ranEntries) return;
        ranEntries = true;
        log('执行 ' + entries.length + ' 个 mod entry');
        for (var i = 0; i < entries.length; i++) {
            try { entries[i](); } catch (e) { warn('entry#' + i + ' 异常: ' + e); }
        }
    }

    global.__mixinLoader = {
        runEntries: runEntries,
        entries: entries,
        // main.min.js 模块尾已执行：注册窗口关闭。装载若还没成功，本会话来不及了
        windowClosed: function () {
            if (!loadedOk) warn('注册窗口关闭时装载未完成，外部 mod 未生效（下次启动重试）');
        },
        // 调试用：手动重试装载
        reload: function () { attempt(0); }
    };

    /* ---------- 存储访问层 ---------- */

    function storageStatus() {
        if (typeof global.modFsStatus !== 'function') return null; // .so 过旧
        try { return JSON.parse(global.modFsStatus()); } catch (e) { return null; }
    }

    function hasAccess(st) {
        // legacy: 0=未授权 1=已授权 2=不需要(API<23)；saf: 持久化 tree URI
        return !!st && (st.legacy === 1 || st.legacy === 2
            || (typeof st.saf === 'string' && st.saf.length > 0));
    }

    function readMod(p) {
        try { return global.modReadFileSync(p) || ''; } catch (e) { return ''; }
    }

    /* ---------- 装载 ---------- */

    /*
     * 装载是同步的：patch_bundle 执行阶段就是注册窗口（main.min.js 变换前），
     * 错过就只能下次启动。此阶段引擎极早期（conch 原生 runtime，Laya 未加载）：
     * 没有 setTimeout，console 也可能未接 logcat —— 异常会经
     * showAlertOnJsException 弹窗可见，fail-safe 不影响游戏本体。
     */
    function attempt() {
        var st = storageStatus();
        if (!st) {
            warn('引擎 modFs 接口不可用（JavaVM 未就绪或 .so 过旧），外部 mod 未装载');
            return;
        }
        if (!hasAccess(st)) {
            // 未授权：拉起授权流程（透明 Activity）；授权成功后重启游戏即生效
            loadedOk = true; // 本会话无 mod 可读，不必再试
            try { global.modFsEnsure && global.modFsEnsure(); } catch (e) {}
            log('无存储访问权限，已拉起授权流程；授权后重启游戏装载外部 mod（root=' + st.root + '）');
            return;
        }
        loadMods(st);
    }

    function loadMods(st) {
        loadedOk = true;
        var base = (st.root || '/storage/emulated/0') + '/.battlecraft';
        var listTxt = readMod(base + '/mods.json');
        if (!listTxt) { log(base + '/mods.json 不存在：无外部 mod'); return; }
        var list;
        try { list = JSON.parse(listTxt); } catch (e) { warn('mods.json 解析失败: ' + e); return; }
        if (!list) list = [];
        if (!list.length && list.mods) list = list.mods;
        if (!list.length) { log('mods.json 为空：无外部 mod'); return; }

        var registered = 0;
        for (var i = 0; i < list.length; i++) {
            var ent = list[i];
            var id = typeof ent === 'string' ? ent : (ent && ent.id);
            if (!id) continue;
            if (ent && ent.enabled === false) { log('mod "' + id + '" 已禁用（enabled=false），跳过'); continue; }
            try {
                loadOne(st, base, id);
                registered++;
            } catch (e) {
                warn('mod "' + id + '" 装载失败: ' + e);
            }
        }
        log('外部 mod 装载完成: ' + registered + '/' + list.length
            + '（entries: ' + entries.length + '）');
        // boot 标签兜底：游戏起来 10 秒后强制跑 entries（boot 挂点异常也不丢 entry）
        if (typeof setTimeout === 'function') setTimeout(runEntries, 10000);
    }

    function loadOne(st, base, id) {
        var dir = base + '/mods/' + id;
        var mfTxt = readMod(dir + '/mixins.json');
        if (!mfTxt) { warn('mod "' + id + '" 缺 mixins.json，跳过'); return; }
        var manifest;
        try { manifest = JSON.parse(mfTxt); } catch (e) { warn('mod "' + id + '" mixins.json 解析失败，跳过'); return; }
        var mixinFiles = (manifest.mixins && manifest.mixins.length) ? manifest.mixins : ['patches.js'];
        for (var m = 0; m < mixinFiles.length; m++) {
            var code = readMod(dir + '/' + mixinFiles[m]);
            if (!code) { warn('mod "' + id + '" 的 ' + mixinFiles[m] + ' 不可读，跳过'); return; }
            // 经 eval 钩子执行（transform 对非游戏文件是 no-op）；sourceURL 便于栈定位
            global.eval(code + '\n//@ sourceURL=' + id + '/' + mixinFiles[m]);
            log('mod "' + id + '" v' + (manifest.version || '?') + ' 注册: ' + mixinFiles[m]);
        }
        if (manifest.entry) {
            var entryTxt = readMod(dir + '/' + manifest.entry);
            if (entryTxt) {
                entries.push(function (code, mid) {
                    return function () {
                        global.eval(code + '\n//@ sourceURL=' + mid + '/entry.js');
                    };
                }(entryTxt, id));
            } else {
                warn('mod "' + id + '" entry ' + manifest.entry + ' 不可读');
            }
        }
    }

    // 同步装载（patch_bundle 执行阶段 = 注册窗口内）
    attempt();
})(typeof window !== 'undefined' ? window : this);
