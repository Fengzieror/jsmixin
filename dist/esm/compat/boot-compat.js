/*
 * compat/boot-compat.ts — 通用 boot bundle 的生成源（dist/boot/mixin-boot.js）。
 *
 * 单文件 IIFE、内联 acorn，专为"裸 JS 引导环境"（无模块系统）设计：
 *   1. 挂 v1 兼容全局（__mixin / __mixinTransform / __mixinAst）+ 包装 eval / Function
 *   2. 泛化 mod 装载：__mixinSetModSource({ readFile }) 注入宿主存储读取能力，
 *      __mixinLoadMods(root) 按 <root>/mods.json（或目录扫描）装载
 * 不含任何 LayaNative 存储假设。引擎作者只需保证本文件【最先执行】；
 * 没有模块系统时由构建/拼接流程把本文件放进启动序列（见 docs/BOOT-CHAIN.md §五）。
 */
import * as acorn from 'acorn';
import { setAcorn } from '../core/ast.js';
import { installAstGlobals, installTransformerGlobals } from '../hosts/layanative.js';
import { createModLoader } from '../loader/loader.js';
// 内联 acorn：boot bundle 面向的裸环境没有依赖解析，直接打进包里
setAcorn(acorn);
installAstGlobals();
const engine = installTransformerGlobals();
const g = globalThis;
const TAG = '[mixin-boot]';
/* ---- 泛化 mod 装载：宿主通过 setModSource 提供读取能力；缺省无 mod 可读 ---- */
let readFile = function () {
    if (!g.__mixinModSourceWarned) {
        g.__mixinModSourceWarned = true;
        try {
            console.log(TAG + ' 未配置 mod 来源：调用 __mixinSetModSource({ readFile }) 后再 __mixinLoadMods(root)');
        }
        catch (e) { /* ignore */ }
    }
    return '';
};
const loader = createModLoader({
    engine: engine,
    readFile: function (p) { return readFile(p); },
    tag: TAG
});
// 宿主注入存储读取能力（同步 readFileSync 语义：路径 → 文本；读不到返回 ''）
g.__mixinSetModSource = function (opts) {
    if (opts && typeof opts.readFile === 'function')
        readFile = opts.readFile;
};
// 装载 <root>/mods.json 列表（两种格式兼容）并注册 patches；entry 进队列
g.__mixinLoadMods = function (root) {
    return loader.loadMods(root);
};
// 装载单个 mod 目录（宿主自管列表时用）
g.__mixinLoadOne = function (root, id) { loader.loadOne(root, id); };
// entry 队列：游戏/应用启动后由宿主在合适的挂点调用（v1 语义）
g.__mixinRunEntries = function () { loader.runEntries(); };
// 注册窗口关闭通知（目标代码开始装载时调用；未装载成功则告警）
g.__mixinWindowClosed = function () { loader.windowClosed(); };
