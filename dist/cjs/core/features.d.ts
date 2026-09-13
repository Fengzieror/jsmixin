import type { Anchor } from './types.js';
export declare function isFnNode(n: any): boolean;
export declare function isClassNode(n: any): boolean;
export declare function hasBlockBody(fn: any): boolean;
export declare function logable(msg: string): void;
export declare function dottedName(n: any): string | null;
export declare function calleeName(callee: any): string | null;
export declare function isIifeFactory(n: any): boolean;
export declare function directChildFns(node: any): {
    fn: any;
    asName: string | null;
    idName: string | null;
}[];
export declare function walkAll(root: any, cb: (n: any) => void): void;
export declare function fnFeatures(fn: any): {
    strings: string[];
    calls: string[];
    params: number;
};
export declare function matchAnchor(fn: any, anchor: Anchor | undefined): boolean;
export declare function describeFn(fn: any, src: string): string;
