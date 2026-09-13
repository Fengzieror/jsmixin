/*
 * patch_bundle.js — base-test mod v0.0.3（AST 精确定位版）
 *
 * 由 C++ 在 mixinTransformer.js 之后、apploader.js 之前执行。
 * 只对 APK 自带 assets/scripts/mixin/ 生效，不加载外部 mod。
 *
 * v0.0.3：boot 标签从 v0.0.2 的字符串尾部 hack（`}()}})[625]();` 全文替换）
 * 换成 AST inject-tail（定位 webpack 模块 625 函数体末尾），另加两个精准 log
 * 点验证锚点体系。所有 path 候选必须唯一，否则该 patch 跳过（fail-safe）。
 */
window.__mixinBoot = function (Laya) {
    var tries = 0;
    // main.min.js 模块尾已执行 → 外部 mod 注册窗口关闭（loader.js 据此停止重试）
    try { window.__mixinLoader && window.__mixinLoader.windowClosed && window.__mixinLoader.windowClosed(); } catch (e) {}
    function addLabel() {
        tries++;
        try {
            if (!Laya || !Laya.stage || !Laya.stage.addChild) {
                if (tries < 120) setTimeout(addLabel, 500);
                else window.__mixinLoader && window.__mixinLoader.runEntries && window.__mixinLoader.runEntries();
                return;
            }
            var lb = new Laya.Label('[mixin] mixin active (ast v1)');
            lb.color = '#00ff88';
            lb.fontSize = 30;
            lb.bold = true;
            lb.pos(30, Math.floor(Laya.stage.height * 0.35));
            lb.zOrder = 99999;
            Laya.stage.addChild(lb);
            console.log('[mixin] boot label added to stage');
            // 游戏已起来：执行外部 mod 的 entry（loader.js 队列）
            window.__mixinLoader && window.__mixinLoader.runEntries && window.__mixinLoader.runEntries();
        } catch (e) {
            console.log('[mixin] boot label error: ' + e);
        }
    }
    setTimeout(addLabel, 1000);
};

window.__mixin.register({
    modid: 'base-test',
    version: '0.0.3',
    priority: 0, // 基础加载器最先应用（DESIGN-layout.md §三纪律）
    mixins: [
        {
            // 游戏主脚本：由 apploader.js 经 window.downloadfile + window.eval 执行
            file: 'main.min.js',
            patches: [
                {
                    // webpack 模块 625 函数体尾部：Laya 等闭包内符号已就绪，拉起 boot 标签
                    name: 'module-tail-boot',
                    path: [{ module: '625' }],
                    op: 'inject',
                    at: 'tail',
                    code: 'window.__mixinBoot && window.__mixinBoot(Laya);'
                },
                {
                    // XS = 资源版本回调 → 游戏入口函数；进函数先打日志
                    name: 'xs-head-log',
                    path: [{ module: '625' }, { name: 'XS' }],
                    op: 'log',
                    message: '[mixin-ast] XS enter (resource-version callback)'
                },
                {
                    // 实名认证倒计时 toast 所在类：'秒后重试' 两层锚定（类包装 → 方法表 value）
                    name: 'retry-countdown-log',
                    path: [
                        { module: '625' },
                        { anchor: { strings: ['秒后重试'] } },
                        { anchor: { strings: ['秒后重试'], params: 0 } }
                    ],
                    op: 'log',
                    message: '[mixin-ast] retry-countdown method enter'
                }
            ]
        }
    ]
});
