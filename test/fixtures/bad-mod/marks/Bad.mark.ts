// @ts-nocheck
import { MixinClass, Inject } from '@mixin/core';

@MixinClass({ target: { file: 'sample2.js', path: [{ module: '8' }, { name: 'dup' }] } })
export default class BadMark {
    @Inject({ at: 'head' })
    target() {
        console.log('[bad] should never build');
    }
}
