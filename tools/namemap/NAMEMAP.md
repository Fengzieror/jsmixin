# 混淆映射表（name-map）证据说明

> 生成: `jsmixin/tools/namemap/gen_map.js`（数据源 report.json + creators.json）
> 生成时间: 2026-09-06；目标: 派对制造 2.1.93 main.min.js 模块 625（1395 个闭包符号）
> 消费: build-tool 的 nameMap 配置；`classes` 用于 target.cls / @MixinClass，`aliases` 用于 path 段 name。

## 核心类与（枚举别名）

| 可读名 | 真实名 | 类别 | 证据（摘要） | pretty 行 |
|---|---|---|---|---|
| LaserShooter | `Gy` | 类 | 注册键 'lasershooter'、贴图 'game/lasershooter.png'、方法 update/setLaserDistance/updateDirs；父类 $f | 160545 |
| AttachableLevelComponent | `$f` | 类 | onAddToLevel/checkSpatialHashAndUpdate/setRed/getOverlayZorder/checkOnPlatform；Gy 的父类 | 140841 |
| LevelComponentBase | `Df` | 类 | ctor: collisionResult=Rt.CollisionResult()/dynamicCells/zOrderIndex；attachLevelComponent/componentAttachedTo/checkComponentSpaceTaken | 136465 |
| ComponentManager | `kf` | 类 | 静态方法 getPlayer/getLevelComponent/getTheLevelComponent | 135701 |
| Balloon | `ey` | 类 | destroyFromCollider/destroyBalloon/setWillDestroyBalloon/handleProjectileHit；父类 Rt.EntityComponent | 151811 |
| DynamicSpatialHash | `gg` | 类 | dynamicObjects/killables/removeDynamicObject/resetDynamicObject/_cellDict/cellAtPosition | 167915 |
| ComponentFactory | `Of` | 类 | creators 表（94 组件 id→类）+ 'unknown component id'；方法 create/createFromLevelElement/getConfig/recycleLevelComponent | 137960 |
| GridUtils | `Fk` | 类 | cellVisualSize/snapToGrid/getClosestGrid*/cellPosToGlobalPos/getUpperGridY | 188524 |
| AppService | `Oe` | 服务 | getComponentName/getLocalizationText/getAppConfig/getLevelBaseURL/getRemoteGameConfigUrl/getCdnFileUrl | 38247 |
| TextKeys | `WS` | 类 | 静态键表 WS.component_name_lasershooter = "component_name_lasershooter" 等 | 233008 |
| RealNamePopup | `ct` | 视图中介 | '身份证号应是18位数字或字母…' + 防沉迷'实名登记'文案 + startCooldown；引用 f.RealNamePopupUI | 27952 |
| LoginPanelView | `bi` | 视图中介 | guestPlayTimeMsg/haveNotEnoughPlayTime/forceOfflineTS/getAntiAddictionReason + accountButton/authButton | 44425 |
| RealNameInfoPopup | `Fi` | 视图中介 | '身份证号：' 展示；onShow/refresh | 47073 |
| AccountPopup | `xi` | 视图中介 | onBindPhoneNumber/onBindTelButtonClicked/onRealNameAuthButtonClicked/showRealNamePopup/onLogoutButtonClicked/onDeleteButtonClicked | 44751 |
| PhoneAuthModal | `H` | 视图中介 | initAuthButton/onAuth/registerAuthEvent/handleSuccesFunc | 25289 |
| ProfileModel | `jw` | 模型 | updateRealNameInfo/needRealNameAuth/updateUserProfile/updateSessionInfo；父类 Rt.ElementModel | 210987 |
| LobbySystem | `it` | 服务 | request/ping/onConnect/reConnect + authWithRealName/loginWithGuest/loginWithPhoneNumber 门面；父类 Rt.ElementComponent | 26631 |
| AccountServiceBase | `nt` | 服务 | LobbySystem._service 的基类; updateProfileData/updateUserInfo | 26888 |
| AccountService | `at` | 服务 | authWithRealName/bindAccount/deleteAccount/loginWith*/nativeLogin/restoreAccount；父类 nt | 27409 |
| AccountServiceWeapp | `ot` | 服务 | AccountService 微信小游戏变体（logInWithWeapp/handlNativeLogin）；父类 nt | 26972 |
| LifeCycleController | `fp` | 服务 | handleAntiAddiction/tryShowBindTipOnRealNameAuthed/canForceLogout/enterNextStateOnLogin/startAntiAddictionCountdown | 124357 |
| LoginState | `IS` | 状态机 | inLoginState/onLogin/endLogin/showRealNamePopup/showForcePopup(ES.realname)；父类 Rt.State | 228359 |
| Direction | `w` | 枚举 | 枚举成员 none=0/up=1/right=2/down=3/left=4 | 9966 |
| PhysicsLayer | `hf` | 枚举 | player=1/oneWayPlatform=2/platform=4/hazard=8/playerTriggerable=16/robot=4096/pvpNetworkPlayer=8192/balloon=16384/boxingglove=32768 | 135138 |
| ZOrder | `VC` | 枚举 | sky=0/grid=4/scene=5/platform=200/moveplatform=4000/trigger=6000/movetrigger=8000/player=10000/projectile=10010/foreground=20000/gizmo=30000 | 201852 |
| ComponentType | `_f` | 枚举 | onewayblock=24/nowallblock=34/gem=41/startArea=100/goalArea=101/boss=102/sky=200/bgm=203…（80+ 成员） | 135514 |
| RotateMode | `Pf` | 枚举 | none=0/rotate=1/flip=2 | 136462 |
| EditableScope | `Bf` | 枚举 | none=0/pvpOnly=1/challengeOnly=2/both=3 | 136463 |
| ScreenId | `ES` | 枚举 | realname/realnameinfo/antiaddiction/clan/album*/skintrial…（150+ 视图 id） | 229696 |

## Rt 命名空间（物理/ECS，点分引用 `Rt.Xxx`）

已确认成员（来自各类构造器与调用点）: `Rt.Entity`、`Rt.EntityComponent`、`Rt.ElementModel`、`Rt.ElementStageView`、`Rt.State`、`Rt.Physics`（linecast/raycastsStartInColliders）、`Rt.CollisionResult`、`Rt.MathUtils`（repeat）、`Rt.Vector`、`Rt.PolygonCollider`。

> 注意：Rt 命名空间由工厂函数动态构建（`t.ElementStageView = s` 式属性赋值后整体返回），
> `{name:"Rt.ElementStageView"}` 段目前解析不到（0 候选）。引用 Rt 成员时直接在注入体
> 内用点分名（运行时闭包变量真实存在），或用字符串锚点定位。

## 组件注册表（ComponentFactory.creators，94 项）

| 组件 id | 可读名（自动 PascalCase） | 类 | pretty 行 |
|---|---|---|---|
| platform1x1 | Platform1x1 | `tv` | 140909 |
| pumpkin | Pumpkin | `hg` | 166319 |
| platform2x1 | Platform2x1 | `tv` | 140909 |
| platform5x1 | Platform5x1 | `tv` | 140909 |
| roundplatform2x2 | Roundplatform2x2 | `gv` | 143706 |
| girder | Girder | `nv` | 141132 |
| tshape | Tshape | `ev` | 140972 |
| ishape | Ishape | `ov` | 141367 |
| lshape | Lshape | `nv` | 141132 |
| scaffold | Scaffold | `av` | 141519 |
| redplatform | Redplatform | `av` | 141519 |
| moveplatform1x1 | Moveplatform1x1 | `hv` | 142269 |
| moveplatform2x1 | Moveplatform2x1 | `hv` | 142269 |
| moveplatform3x1 | Moveplatform3x1 | `hv` | 142269 |
| crumblingblock | Crumblingblock | `Sv` | 145068 |
| spike | Spike | `cv` | 142726 |
| ice | Ice | `pv` | 142958 |
| mud | Mud | `_v` | 143096 |
| spikeball | Spikeball | `uv` | 142819 |
| spikeblock | Spikeblock | `dv` | 142873 |
| spring | Spring | `vv` | 143384 |
| spinningsaw | Spinningsaw | `mv` | 143787 |
| spinningplatform | Spinningplatform | `kv` | 144101 |
| linearsaw | Linearsaw | `wv` | 144431 |
| crawlhazard | Crawlhazard | `bv` | 144677 |
| boxingglove | Boxingglove | `xv` | 145281 |
| triggerspikes | Triggerspikes | `Iv` | 145769 |
| crossbow | Crossbow | `Lv` | 146863 |
| trackplatform | Trackplatform | `Pv` | 147234 |
| platformsaw | Platformsaw | `Bv` | 147581 |
| score | Score | `Av` | 148028 |
| fortunecat | Fortunecat | `Ov` | 148046 |
| rotaryhazard | Rotaryhazard | `Fv` | 148311 |
| onewayplatform | Onewayplatform | `Vv` | 148508 |
| onewayplatformstatic | Onewayplatformstatic | `Uv` | 148456 |
| squaredplatform | Squaredplatform | `Nv` | 148782 |
| pushableplatform | Pushableplatform | `Gv` | 148872 |
| treasurechest | Treasurechest | `Rv` | 148010 |
| flamethrower | Flamethrower | `zv` | 149767 |
| bomb | Bomb | `fv` | 143287 |
| bombsmall | Bombsmall | `fv` | 143287 |
| landmine | Landmine | `Hv` | 149355 |
| landminesmall | Landminesmall | `Hv` | 149355 |
| checkpoint | Checkpoint | `Yv` | 150527 |
| portal | Portal | `jv` | 149892 |
| arrowstraight | Arrowstraight | `Wv` | 150247 |
| arrowdiagonal | Arrowdiagonal | `Wv` | 150247 |
| airjump | Airjump | `Kv` | 150781 |
| triggerspring | Triggerspring | `Qv` | 150960 |
| circlespring | Circlespring | `fy` | 154741 |
| onewayblock | Onewayblock | `Jv` | 151161 |
| onoffswitch | Onoffswitch | `sy` | 152759 |
| door | Door | `ly` | 152992 |
| rotarydoor | Rotarydoor | `hy` | 153369 |
| swingsaw | Swingsaw | `cy` | 153699 |
| cannon | Cannon | `Zv` | 151474 |
| ballooncannon | Ballooncannon | `iy` | 151879 |
| note | Note | `qv` | 150415 |
| npc | Npc | `uy` | 153974 |
| text | Text | `dy` | 154336 |
| purpleplatform | Purpleplatform | `vy` | 154855 |
| stomper | Stomper | `yy` | 155354 |
| onedirblock | Onedirblock | `Cy` | 155862 |
| superblock | Superblock | `by` | 156541 |
| triggerinvisible | Triggerinvisible | `xy` | 157196 |
| swingplatform | Swingplatform | `Iy` | 157553 |
| triggerhazard | Triggerhazard | `Ty` | 158020 |
| movabledoor | Movabledoor | `By` | 158378 |
| movablesaw | Movablesaw | `Ay` | 158719 |
| decal | Decal | `Oy` | 159073 |
| spawnpoint | Spawnpoint | `Fy` | 159218 |
| altplatform | Altplatform | `wy` | 156257 |
| altspike | Altspike | `wy` | 156257 |
| fan | Fan | `Uy` | 159525 |
| lasershooter | Lasershooter | `Gy` | 160545 |
| treadmill | Treadmill | `Hy` | 160843 |
| gas | Gas | `zy` | 161113 |
| respawnpoint | Respawnpoint | `jy` | 161232 |
| doublelift | Doublelift | `Xy` | 161626 |
| nowallblock | Nowallblock | `iv` | 141045 |
| jellyfish | Jellyfish | `qy` | 162160 |
| pressureswitch | Pressureswitch | `Yy` | 162465 |
| custompathnode | Custompathnode | `Ny` | 160074 |
| ferriswheel | Ferriswheel | `Ky` | 162805 |
| rotatehinge | Rotatehinge | `Zy` | 163901 |
| shootbarrel | Shootbarrel | `Jy` | 163353 |
| saw | Saw | `$y` | 164355 |
| pathconnector | Pathconnector | `tg` | 164434 |
| minirobot | Minirobot | `ng` | 164782 |
| action | Action | `ag` | 165371 |
| orangeplatform | Orangeplatform | `sg` | 165580 |
| shrinkplatform | Shrinkplatform | `rg` | 165716 |
| counterdoor | Counterdoor | `cg` | 166686 |
| gem | Gem | `vg` | 167203 |

## 推断方法（可复现）

```
node infer.js build    # 解析 main.pretty.js → report.json（方法表/枚举/字符串/继承证据）
node infer.js find <串> # 按字符串/方法key/属性名反查绑定
node infer.js show <名> # 打印某绑定全部证据
node gen_map.js        # 生成 name-map.json + 本文档
```