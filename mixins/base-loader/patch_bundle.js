/*
 * patch_bundle.js — 阶段0 测试补丁（base-loader 的第一个 mixin）
 *
 * 由 C++ 在 mixinTransformer.js 之后、apploader.js 之前执行。
 * 只对 APK 自带 assets/scripts/mixin/ 生效，不加载外部 mod。
 *
 * 验收目标（DESIGN-layout.md 阶段0 L1）：
 *   启动游戏后，过场"点击屏幕继续"标签显示为 "[mixin]点击屏幕继续"，
 *   logcat 出现 [mixin] 相关日志。
 */
window.__mixin.register({
    modid: 'base-test',
    version: '0.0.1',
    mixins: [
        {
            // 游戏主脚本：由 apploader.js 经 window.downloadfile + window.eval 执行
            file: 'main.min.js',
            replaces: [
                ['赛季通行证', '[mixin]赛季通行证'],
                ['礼品兑换', '[mixin]礼品兑换'],
                ['点击屏幕继续', '[mixin]点击屏幕继续'],
                ['秒后重试', '[mixin]秒后重试']
            ]
        }
    ]
});
