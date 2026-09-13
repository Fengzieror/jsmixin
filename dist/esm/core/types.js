/*
 * types.ts — jsmixin core 公共类型
 *
 * 设计文档：docs/DESIGN-v2.md（segs/op 全集与 Sponge Mixin/MixinExtras 对照）
 *
 * 一个 mod 描述（register 的参数）：
 *   { modid, version?, priority?, mixins: [{ file, patches: [...], replaces?, hash? }], ... }
 * 一个 patch：
 *   { name?, path: PathSeg[], op, ...op 参数 }
 * path 段（PathSeg）每段解析出下一层节点，候选必须唯一（除非显式 index）。
 * 编辑全部基于原始 source 切片（start/end/text），目标节点之外字节原样保留。
 */
export {};
