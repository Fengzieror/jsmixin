// 由 jsmixin build-tool 生成，勿手改。数据源：name-map.json + 本 mod 的 @Export。
// tsconfig "include" 加入本文件即可获得 game.<可读类> / window.__mixin_exports 的类型提示。
declare namespace game {
}
interface Window {
  __mixin: {
    version: string;
    register(mod: any): void;
    stats(): any;
    sourceHash(src: string): string;
  };
  __mixin_exports: {
    [key: string]: any;
  };
  __mixinLoader?: any; // 阶段1 外部 mod 装载器（loader.js）
}
// 引擎 modFs 全局（Android 部署才有；双模式存储授权，见 android-modfs/）
declare function modFsStatus(): string;
declare function modFsEnsure(): boolean;
declare function modReadFileSync(path: string): string;
