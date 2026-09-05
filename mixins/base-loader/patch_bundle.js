/*
 * patch_bundle.js — 阶段0 测试补丁（base-loader 的第一个 mixin）
 *
 * 由 C++ 在 mixinTransformer.js 之后、apploader.js 之前执行。
 * 只对 APK 自带 assets/scripts/mixin/ 生效，不加载外部 mod。
 *
 * 验证手段：
 *   1. 字符串替换（点击屏幕继续/秒后重试，logcat 可见替换计数）
 *   2. 加法注入：把 main.min.js 模块尾部（}()}})[625]();，文件内唯一）
 *      替换为"原语句 + 在 webpack 模块闭包内调用 __mixinBoot(Laya)"，
 *      向 Laya.stage 添加一个游戏里原本不存在的文本框。
 *      这是真正的"mixin 进去一个东西"，不依赖游戏自带文本。
 */
window.__mixinBoot = function (Laya) {
    var tries = 0;
    function addLabel() {
        tries++;
        try {
            if (!Laya || !Laya.stage || !Laya.stage.addChild) {
                if (tries < 120) setTimeout(addLabel, 500);
                return;
            }
            var lb = new Laya.Label('[mixin] mixin active');
            lb.color = '#00ff88';
            lb.fontSize = 30;
            lb.bold = true;
            lb.pos(30, Math.floor(Laya.stage.height * 0.35));
            lb.zOrder = 99999;
            Laya.stage.addChild(lb);
            console.log('[mixin] boot label added to stage');
        } catch (e) {
            console.log('[mixin] boot label error: ' + e);
        }
    }
    setTimeout(addLabel, 1000);
};

window.__mixin.register({
    modid: 'base-test',
    version: '0.0.2',
    mixins: [
        {
            // 游戏主脚本：由 apploader.js 经 window.downloadfile + window.eval 执行
            file: 'main.min.js',
            replaces: [
                // 模块尾部（全文件唯一）：在 webpack 模块函数内、引导 IIFE 执行完之后
                // 调用 boot（Laya 在该闭包内可见）
                ['}()}})[625]();', '}();window.__mixinBoot&&window.__mixinBoot(Laya)}})[625]();'],
                ['点击屏幕继续', '[mixin]点击屏幕继续'],
                ['秒后重试', '[mixin]秒后重试']
            ]
        }
    ]
});
