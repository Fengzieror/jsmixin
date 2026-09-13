/** 内容锚点：目标函数必须包含这些字符串字面量 / 调用名 / 参数个数（AND 关系） */
export interface Anchor {
    strings?: string[];
    calls?: string[];
    params?: number;
}
/** path 段：六种寻址 + 两种打包器解包段 + index 消歧（最后手段） */
export interface PathSeg {
    /** webpack 模块表：顶层 ({625:function(){...}})[625]() 形态 */
    module?: string;
    /** 绑定名/函数 id；点分命名空间如 'V.showToast' */
    name?: string;
    /** 原生 ES6 class 绑定（class 声明 / var X = class{} / 赋值） */
    class?: string;
    /** 打包器解包段：进入工厂函数体（'cjs' | 'umd' | 'iife'） */
    wrap?: 'cjs' | 'umd' | 'iife' | string;
    /** 具名调用实参段：{ call:'jS.init', arg:0 } 定位匿名回调 */
    call?: string;
    arg?: number;
    /** 纯结构序号：当前节点第 n 个直接子函数（最后手段） */
    fn?: number;
    /** babel 方法表 key 或原生 class 的 MethodDefinition key */
    method?: string;
    /** method 段可选类名校验（缺省用上一层解析出的绑定名） */
    cls?: string;
    /** 内容锚点段 */
    anchor?: Anchor;
    /** 多候选时的显式序号（0 也是显式指向，不能当"没写"） */
    index?: number;
}
/** op 参数（按 op 取用） */
export interface Patch {
    name?: string;
    path: PathSeg[];
    op: string;
    /** inject: 'head' | 'tail'（缺省 head） */
    at?: string;
    /** inject: 可取消语义声明（仅 head 有意义；head 注入体内 return 即取消原函数） */
    cancellable?: boolean;
    /** inject/overwrite/wrap/redirect/wrapCall/modifyArg 的注入体 */
    code?: string;
    /** log op 的消息 */
    message?: string;
    /** modify: 节点源码精确文本 → 替换文本 */
    find?: string;
    replace?: string;
    /** 调用点级 op：目标调用的 callee 点分名（支持 'this.x'） */
    call?: string;
    /** 调用点级 op：可选参数个数过滤 */
    params?: number;
    /** modifyArg: 目标实参槽位（必填） */
    arg?: number;
    /** 多命中消歧：取第 n 个（0 起）/ 全部 */
    nth?: number;
    all?: boolean;
    /** 运行时由 register 盖章：所属 modid */
    _modid?: string;
}
/** register 的一个 mixin 条目：目标文件 + patches（+ 字符串级 replaces / 可选哈希锁） */
export interface MixinEntry {
    file: string;
    patches?: Patch[];
    replaces?: [string, string][];
    hash?: string;
    _modid?: string;
}
export interface ModDescription {
    modid: string;
    version?: string;
    /** 越小越先应用（Sponge 约定），缺省 1000 */
    priority?: number;
    mixins?: MixinEntry[];
    replaces?: [string, string][];
    hash?: string;
    [k: string]: unknown;
}
/** 一条基于原始 source 的编辑：替换 [start, end) 为 text */
export interface SourceEdit {
    start: number;
    end: number;
    text: string;
}
/** applyAstPatches 的可选统计输出 */
export interface PatchStats {
    applied: number;
    skipped: string[];
}
/** 段解析结果：命中节点 / 带出的绑定名（供 method 段 cls 推断）/ 错误 */
export interface ResolveResult {
    node?: any;
    asName?: string | null;
    error?: string;
}
export interface AstInternals {
    directChildFns: (node: any) => {
        fn: any;
        asName: string | null;
        idName: string | null;
    }[];
    fnFeatures: (fn: any) => {
        strings: string[];
        calls: string[];
        params: number;
    };
    matchAnchor: (fn: any, anchor: Anchor | undefined) => boolean;
    resolvePath: (ast: any, path: PathSeg[], src: string) => ResolveResult;
    applyEdits: (src: string, edits: SourceEdit[]) => string;
    /** v2：目标函数子树内按 patch.call（callee 点分名，含 params 过滤）定位调用点 */
    findCallSites?: (fn: any, patch: any, src: string) => any[];
    /** v2.1：子树遍历（@Local 构建期校验用） */
    walkAll?: (root: any, cb: (n: any) => void) => void;
}
