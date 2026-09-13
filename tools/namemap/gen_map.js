/* gen_map.js — 从 report.json + creators.json + 人工核对的语义命名
 * 生成 name-map.json（build-tool 可直接消费）与 NAMEMAP.md（证据文档）。
 *
 * 用法: node gen_map.js
 * 校验: 每个真实名必须在模块 625 闭包绑定中存在；可读名不得冲突指向不同真实名。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'report.json'), 'utf8')).bindings;
const creators = JSON.parse(fs.readFileSync(path.join(__dirname, 'creators.json'), 'utf8'));

/* ── 1. 核心类/服务/枚举（人工依据证据命名，见 NAMEMAP.md） ── */
const core = {
    classes: {
        // 棱镜/激光链
        LaserShooter: 'Gy',                 // 'game/lasershooter.png'、注册键 'lasershooter'、update/setLaserDistance
        AttachableLevelComponent: '$f',     // Gy 的父类；onAddToLevel/checkSpatialHashAndUpdate/setRed/getOverlayZorder
        LevelComponentBase: 'Df',           // $f 的父类；collisionResult/dynamicCells/attachLevelComponent/componentAttachedTo
        ComponentManager: 'kf',             // 静态 getPlayer/getLevelComponent/getTheLevelComponent
        Balloon: 'ey',                      // destroyFromCollider/destroyBalloon/setWillDestroyBalloon, parent=Rt.EntityComponent
        DynamicSpatialHash: 'gg',           // dynamicObjects/killables/removeDynamicObject/resetDynamicObject/_cellDict
        ComponentFactory: 'Of',             // creators 表 + 'unknown component id' + create/getConfig/recycleLevelComponent
        GridUtils: 'Fk',                    // cellVisualSize/snapToGrid/getClosestGridX/cellPosToGlobalPos
        // 应用/文案
        AppService: 'Oe',                   // getComponentName/getLocalizationText/getAppConfig/各 CDN URL getter
        TextKeys: 'WS',                     // WS.component_name_* 静态文案键表
        // 实名验证/账号/防沉迷链
        RealNamePopup: 'ct',                // 身份证18位校验文案 + '实名登记' 文案 + startCooldown, 引用 f.RealNamePopupUI
        LoginPanelView: 'bi',               // guestPlayTimeMsg/haveNotEnoughPlayTime/forceOfflineTS + 实名按钮
        RealNameInfoPopup: 'Fi',            // '身份证号：' 展示
        AccountPopup: 'xi',                 // onBindPhoneNumber/onRealNameAuthButtonClicked/showRealNamePopup/onLogoutButtonClicked
        PhoneAuthModal: 'H',                // initAuthButton/onAuth/registerAuthEvent（一键授权弹窗）
        ProfileModel: 'jw',                 // updateRealNameInfo/needRealNameAuth/updateUserProfile, parent=Rt.ElementModel
        LobbySystem: 'it',                  // request/ping/onConnect + authWithRealName/loginWith* 门面, parent=Rt.ElementComponent
        AccountServiceBase: 'nt',           // ot/at 的父类; updateProfileData/updateUserInfo
        AccountService: 'at',               // nt 子类; authWithRealName/loginWith*/nativeLogin/restoreAccount
        AccountServiceWeapp: 'ot',          // at 变体; logInWithWeapp
        LifeCycleController: 'fp',          // handleAntiAddiction/tryShowBindTipOnRealNameAuthed/canForceLogout/enterNextStateOnLogin
        LoginState: 'IS',                   // inLoginState/onLogin/endLogin/showRealNamePopup, parent=Rt.State
    },
    aliases: {
        // 枚举与命名空间（path 段 name 可用可读名）
        Direction: 'w',                     // none/up/right/down/left
        PhysicsLayer: 'hf',                 // player=1/oneWayPlatform=2/platform=4/hazard=8/robot=4096/balloon=16384...
        ZOrder: 'VC',                       // platform=200/movetrigger=8000/player=10000/projectile=10010...
        ComponentType: '_f',                // onewayblock=24/nowallblock=34/gem=41/startArea=100...
        RotateMode: 'Pf',                   // none=0/rotate=1/flip=2
        EditableScope: 'Bf',                // none=0/pvpOnly=1/challengeOnly=2/both=3
        ScreenId: 'ES',                     // realname/realnameinfo/antiaddiction/clan/album... 150+ 视图 id
        // Rt 命名空间成员走 'Rt.Xxx' 点分名（tool 里 Rt 是命名空间对象, 成员见 NAMEMAP.md）
    },
    methods: {},
};

/* ── 1.5 自动推断命名批次（auto-names.json；仅 conf=high 进入 build-tool 消费） ── */
const autoNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'auto-names.json'), 'utf8'));
const autoInfo = {}; // friendly -> {conf, ev}（供 NAMEMAP.md 证据列回退）
const usedReals = new Set(Object.values(core.classes));
for (const [f, info] of Object.entries(autoNames.classes || {})) {
    autoInfo[f] = { conf: info.conf, ev: info.ev };
    if (info.conf !== 'high' || usedReals.has(info.real)) continue;
    core.classes[f] = info.real;
    usedReals.add(info.real);
}
const aliasReals = new Set(Object.values(core.aliases));
for (const [real, info] of Object.entries(autoNames.enums || {})) {
    if (!info) continue;
    if (info.conf !== 'high' || usedReals.has(real) || aliasReals.has(real)) continue;
    core.aliases[info.name] = real;
    aliasReals.add(real);
    autoInfo[info.name] = { conf: info.conf, ev: info.ev };
}

/* ── 2. 组件注册表: Of.creators 的 id → 类（id 即语义名, PascalCase 化） ── */
const pascal = (s) => s.split(/[^a-zA-Z0-9]+/).filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const components = {};
for (const [id, cls] of Object.entries(creators)) {
    if (!cls) continue;
    components[pascal(id)] = cls;
}
// 注册表派生名与核心表指向同一真实名时去掉派生名（如 lasershooter→Lasershooter 与 LaserShooter）
const coreReals = new Set(Object.values(core.classes));
for (const [f, r] of Object.entries(components)) {
    if (coreReals.has(r)) delete components[f];
}
// 注册表类与核心表冲突时, 核心表优先（如 LaserShooter 已在 core）
const classes = { ...components, ...core.classes };

/* ── 3. 校验 ── */
let fail = 0;
const reverse = {};
for (const [friendly, real] of Object.entries(classes)) {
    const base = real.split('.')[0];
    if (!report[base]) { console.error('FAIL: 真实名不存在于模块 625:', friendly, '->', real); fail++; }
    if (reverse[real] && reverse[real] !== friendly) console.log('note: 多个可读名指向', real, ':', reverse[real], ',', friendly);
    reverse[real] = friendly;
}
for (const [friendly, real] of Object.entries(core.aliases)) {
    if (!report[real]) { console.error('FAIL: 别名真实名不存在:', friendly, '->', real); fail++; }
}
if (fail) process.exit(1);

/* ── 4. 产出 ── */
const nameMap = { classes, aliases: core.aliases, methods: core.methods };
fs.writeFileSync(path.join(__dirname, 'name-map.json'), JSON.stringify(nameMap, null, 2));

/* NAMEMAP.md 证据文档 */
const L = [];
L.push('# 混淆映射表（name-map）证据说明');
L.push('');
L.push('> 生成: `jsmixin/tools/namemap/gen_map.js`（数据源 report.json + creators.json）');
L.push('> 生成时间: ' + new Date().toISOString().slice(0, 10) + '；目标: 派对制造 2.1.93 main.min.js 模块 625（1395 个闭包符号）');
L.push('> 消费: build-tool 的 nameMap 配置；`classes` 用于 target.cls / @MixinClass，`aliases` 用于 path 段 name。');
L.push('');
L.push('## 核心类与（枚举别名）');
L.push('');
L.push('| 可读名 | 真实名 | 类别 | 证据（摘要） | pretty 行 |');
L.push('|---|---|---|---|---|');
const kinds = { LaserShooter: '类', AttachableLevelComponent: '类', LevelComponentBase: '类', ComponentManager: '类', Balloon: '类', DynamicSpatialHash: '类', ComponentFactory: '类', GridUtils: '类', AppService: '服务', TextKeys: '类', RealNamePopup: '视图中介', LoginPanelView: '视图中介', RealNameInfoPopup: '视图中介', AccountPopup: '视图中介', PhoneAuthModal: '视图中介', ProfileModel: '模型', LobbySystem: '服务', AccountServiceBase: '服务', AccountService: '服务', AccountServiceWeapp: '服务', LifeCycleController: '服务', LoginState: '状态机', Direction: '枚举', PhysicsLayer: '枚举', ZOrder: '枚举', ComponentType: '枚举', RotateMode: '枚举', EditableScope: '枚举', ScreenId: '枚举' };
const evidence = {
    LaserShooter: "注册键 'lasershooter'、贴图 'game/lasershooter.png'、方法 update/setLaserDistance/updateDirs；父类 $f",
    AttachableLevelComponent: 'onAddToLevel/checkSpatialHashAndUpdate/setRed/getOverlayZorder/checkOnPlatform；Gy 的父类',
    LevelComponentBase: 'ctor: collisionResult=Rt.CollisionResult()/dynamicCells/zOrderIndex；attachLevelComponent/componentAttachedTo/checkComponentSpaceTaken',
    ComponentManager: '静态方法 getPlayer/getLevelComponent/getTheLevelComponent',
    Balloon: 'destroyFromCollider/destroyBalloon/setWillDestroyBalloon/handleProjectileHit；父类 Rt.EntityComponent',
    DynamicSpatialHash: 'dynamicObjects/killables/removeDynamicObject/resetDynamicObject/_cellDict/cellAtPosition',
    ComponentFactory: "creators 表（94 组件 id→类）+ 'unknown component id'；方法 create/createFromLevelElement/getConfig/recycleLevelComponent",
    GridUtils: 'cellVisualSize/snapToGrid/getClosestGrid*/cellPosToGlobalPos/getUpperGridY',
    AppService: 'getComponentName/getLocalizationText/getAppConfig/getLevelBaseURL/getRemoteGameConfigUrl/getCdnFileUrl',
    TextKeys: '静态键表 WS.component_name_lasershooter = "component_name_lasershooter" 等',
    RealNamePopup: "'身份证号应是18位数字或字母…' + 防沉迷'实名登记'文案 + startCooldown；引用 f.RealNamePopupUI",
    LoginPanelView: 'guestPlayTimeMsg/haveNotEnoughPlayTime/forceOfflineTS/getAntiAddictionReason + accountButton/authButton',
    RealNameInfoPopup: "'身份证号：' 展示；onShow/refresh",
    AccountPopup: 'onBindPhoneNumber/onBindTelButtonClicked/onRealNameAuthButtonClicked/showRealNamePopup/onLogoutButtonClicked/onDeleteButtonClicked',
    PhoneAuthModal: 'initAuthButton/onAuth/registerAuthEvent/handleSuccesFunc',
    ProfileModel: 'updateRealNameInfo/needRealNameAuth/updateUserProfile/updateSessionInfo；父类 Rt.ElementModel',
    LobbySystem: 'request/ping/onConnect/reConnect + authWithRealName/loginWithGuest/loginWithPhoneNumber 门面；父类 Rt.ElementComponent',
    AccountServiceBase: 'LobbySystem._service 的基类; updateProfileData/updateUserInfo',
    AccountService: 'authWithRealName/bindAccount/deleteAccount/loginWith*/nativeLogin/restoreAccount；父类 nt',
    AccountServiceWeapp: 'AccountService 微信小游戏变体（logInWithWeapp/handlNativeLogin）；父类 nt',
    LifeCycleController: 'handleAntiAddiction/tryShowBindTipOnRealNameAuthed/canForceLogout/enterNextStateOnLogin/startAntiAddictionCountdown',
    LoginState: 'inLoginState/onLogin/endLogin/showRealNamePopup/showForcePopup(ES.realname)；父类 Rt.State',
    Direction: '枚举成员 none=0/up=1/right=2/down=3/left=4',
    PhysicsLayer: 'player=1/oneWayPlatform=2/platform=4/hazard=8/playerTriggerable=16/robot=4096/pvpNetworkPlayer=8192/balloon=16384/boxingglove=32768',
    ZOrder: 'sky=0/grid=4/scene=5/platform=200/moveplatform=4000/trigger=6000/movetrigger=8000/player=10000/projectile=10010/foreground=20000/gizmo=30000',
    ComponentType: 'onewayblock=24/nowallblock=34/gem=41/startArea=100/goalArea=101/boss=102/sky=200/bgm=203…（80+ 成员）',
    RotateMode: 'none=0/rotate=1/flip=2',
    EditableScope: 'none=0/pvpOnly=1/challengeOnly=2/both=3',
    ScreenId: 'realname/realnameinfo/antiaddiction/clan/album*/skintrial…（150+ 视图 id）',
};
for (const [f, r] of Object.entries(core.classes)) {
    const ai = autoInfo[f];
    L.push(`| ${f} | \`${r}\` | ${kinds[f] || (ai ? '类/推断(' + ai.conf + ')' : '')} | ${evidence[f] || (ai ? ai.ev : '')} | ${report[r.split('.')[0]] ? report[r.split('.')[0]].line : '?'} |`);
}
for (const [f, r] of Object.entries(core.aliases)) {
    const ai = autoInfo[f];
    L.push(`| ${f} | \`${r}\` | ${kinds[f] || (ai ? '枚举/推断(' + ai.conf + ')' : '枚举')} | ${evidence[f] || (ai ? ai.ev : '')} | ${report[r].line} |`);
}
L.push('');
L.push('## Rt 命名空间（物理/ECS，点分引用 `Rt.Xxx`）');
L.push('');
L.push('已确认成员（来自各类构造器与调用点）: `Rt.Entity`、`Rt.EntityComponent`、`Rt.ElementModel`、`Rt.ElementStageView`、`Rt.State`、`Rt.Physics`（linecast/raycastsStartInColliders）、`Rt.CollisionResult`、`Rt.MathUtils`（repeat）、`Rt.Vector`、`Rt.PolygonCollider`。');
L.push('');
L.push('> 注意：Rt 命名空间由工厂函数动态构建（`t.ElementStageView = s` 式属性赋值后整体返回），');
L.push('> `{name:"Rt.ElementStageView"}` 段目前解析不到（0 候选）。引用 Rt 成员时直接在注入体');
L.push('> 内用点分名（运行时闭包变量真实存在），或用字符串锚点定位。');
L.push('');
L.push('## 组件注册表（ComponentFactory.creators，94 项）');
L.push('');
L.push('| 组件 id | 可读名（自动 PascalCase） | 类 | pretty 行 |');
L.push('|---|---|---|---|');
const lineOf = {};
(function () {
    // 类行号查 report
    for (const [id, cls] of Object.entries(creators)) {
        if (cls && report[cls]) lineOf[cls] = report[cls].line;
    }
})();
for (const [id, cls] of Object.entries(creators)) {
    L.push(`| ${id} | ${pascal(id)} | \`${cls}\` | ${lineOf[cls] || '?'} |`);
}
L.push('');
L.push('## 推断方法（可复现）');
L.push('');
L.push('```');
L.push('node infer.js build    # 解析 main.pretty.js → report.json（方法表/枚举/字符串/继承证据）');
L.push('node infer.js find <串> # 按字符串/方法key/属性名反查绑定');
L.push('node infer.js show <名> # 打印某绑定全部证据');
L.push('node gen_map.js        # 生成 name-map.json + 本文档');
L.push('```');
fs.writeFileSync(path.join(__dirname, 'NAMEMAP.md'), L.join('\n'));
console.log('OK: name-map.json (' + Object.keys(classes).length + ' classes + ' + Object.keys(core.aliases).length + ' aliases) + NAMEMAP.md');
