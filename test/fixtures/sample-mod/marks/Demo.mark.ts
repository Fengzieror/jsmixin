// marks/Demo.mark.ts — v2 构建工具测试样例（内容是纯 ES5 JS + 装饰器）
// @ts-nocheck
import { MixinClass, Inject, Overwrite, Wrap, Export } from '@mixin/core';

// cls-only 目标：mark 方法名 = 目标类方法表的 key（经 name-map 映射）
@MixinClass({ target: { file: 'sample.js', module: '7', cls: 'Counter' } })
export default class CounterMark {
    @Inject({ at: 'head' })
    tick() {
        console.log('[demo] tick enter');
    }
}

// cls + method 显式目标：所有装饰方法作用于同一个解析结果
@MixinClass({ target: { file: 'sample.js', module: '7', cls: 'Counter', method: 'tick' } })
export default class TickWrapMark {
    @Wrap
    target($orig) {
        console.log('[demo] tick wrap before');
        return $orig();
    }
}

// path 目标：alias 映射 + anchor 段（var step = function 形式的匿名函数）
@MixinClass({
    target: {
        file: 'sample.js',
        path: [{ module: '7' }, { name: 'start' }, { anchor: { calls: ['helper'], params: 1 } }]
    }
})
export default class BootMark {
    @Inject({ at: 'tail' })
    target() {
        console.log('[demo] boot tail');
    }
}

// 导出：把 boot 内的 step 导出到 window.__mixin_exports
@MixinClass({ target: { file: 'sample.js', path: [{ module: '7' }, { name: 'start' }, { name: 'step' }] } })
export default class ExportMark {
    @Export({ as: 'stepFn' })
    target() {}
}
