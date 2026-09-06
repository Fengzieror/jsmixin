// @ts-nocheck
import { MixinClass, Inject } from '@mixin/core';

// webpack 模块 625 尾部：拉起 boot（对应 base-loader module-tail-boot）
@MixinClass({ target: { file: 'main.min.js', path: [{ module: '625' }] } })
export default class ModuleTailMark {
    @Inject({ at: 'tail' })
    target() {
        window.__mixinBoot && window.__mixinBoot(Laya);
    }
}

// 入口函数 XS 头部日志
@MixinClass({ target: { file: 'main.min.js', path: [{ module: '625' }, { name: 'XS' }] } })
export default class XsMark {
    @Inject({ at: 'head' })
    target() {
        console.log('[real-smoke] XS enter');
    }
}

// '秒后重试' 两层锚定
@MixinClass({
    target: {
        file: 'main.min.js',
        path: [
            { module: '625' },
            { anchor: { strings: ['秒后重试'] } },
            { anchor: { strings: ['秒后重试'], params: 0 } }
        ]
    }
})
export default class RetryMark {
    @Inject({ at: 'head' })
    target() {
        console.log('[real-smoke] retry-countdown enter');
    }
}
