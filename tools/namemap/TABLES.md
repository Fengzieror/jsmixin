# 辅助表说明（gen_tables.js 产出）

> 与 name-map.json 互补：name-map 是**编回用**的符号映射（classes/aliases），以下四张是**检索用**的作者辅助表。
> 数据源: report.json（infer.js build 产物）+ creators.json + name-map.json + main.pretty.js 正则扫描。
> 生成: `node gen_tables.js`；游戏更新后先重跑 `infer.js build`，再重跑本脚本。

## enums.json — 枚举/常量表

- `220` 个 TS 枚举；已命名 173 个（Direction=w、PhysicsLayer=hf、ZOrder=VC、ComponentType=_f、RotateMode=Pf、EditableScope=Bf、ScreenId=ES、DialogType=S、InitStep=yt、ProfileTab=wt、ProfileItemType=Mt、ItemDuration=Dt、PreloadType=Kt、FeatureType=Qt、AdState=$t、AdErrorCode=te、ScreenEdge=Pe、FetchState=Ee、AccountType=Ve、SmsStep=Ge、LoginChannel=ze、MatchFlowEvent=Xe、CommentSort=gi、ChallengeCycle=qi、GameMode=Pn、MissionType=En、ReportReason=so、CardType=Mo、PushNoticeType=Oo、RankType=sa、AdFailReason=va、ClanOp=Va、ClanPage=Na、ClanRole=ps、ChatType=fs、ActivityType=gs、ActivityState=ks、AlbumOp=pr、PlayMode=Tr、LevelTag=Nr、LevelTab=qr、FriendAction=Ih、FriendTab=Ah、InviteType=Hh、Presence=Zh、PayChannel=ic、PayError=cc、RankTier=ud、ServerError=hp、Quality=gp、RecordState=bp、PlayerAnim=Sp、SurfaceType=Mp、DeathReason=u_、MoveState=w_、ControlSource=J_、GameEvent=tf、CollisionRole=Nf、ProjectileType=ff、EnvType=Ef、BalloonColor=$v、BalloonShape=ty、LaserState=Cv、WidgetType=Ig、EditPropKey=Tg、SpectateMode=Km、RecordMode=AC、GamePhase=kC、AppState=DS、UILayer=RS、PlatformType=HS、RoomVisibility=vw、WinCondition=mw、TutorialStage=Nb、SocketState=lw、ShareState=Uk、FeatureFlag=ju、HAlign=m、VAlign=k、VoiceCallState=K、ConnectResult=Q、FriendConnectCode=Z、AccountTipType=ht、SlideDirection=kt、ItemFilter=bt、ProfileFieldType=re、WebNavType=pe、EffectAnimType=be、LoginStepState=Ne、QuitReason=je、ChallengeState=Yi、TaskType=nn、LiveTaskType=cn、PageNav=Sn、LevelDetailTab=bo、ReportBehavior=ro、ClanStatus=Ga、ClanEditField=Ha、CheckinOp=Os、BattlePassOp=Ws、LevelAdminOp=Ar、AdminOp=Or、DifficultyFilter=Fr、BubbleType=Wr、ChallengeStep=Rl、TeamMode=Sh、GemProductType=fc、HudLayer=Vc、ProfileSection=Gc、LevelCategory=qc、LeagueMode=td、LeagueSchedule=ed、RedDotType=cp、PlayerState=Ip、SystemType=cf、ComponentCategory=pf、TutorialHud=ig、SpeedLevel=wm、TextDirection=Cm、RoomMode=nk、GameBanner=bC、PopupAnim=SC、MatchType=TC、PlatformKind=NC、GameViewId=GC、JoinMatchError=pw、RoomGameMode=gw、MatchKind=kw、RoomConfigField=xw、GuidePage=kS、SettingsEntry=pS、ChatEntry=MS、NoticeType=iS、RewardSource=dC、LevelBlockReason=nC、TutorialRobotState=rk、EditAddOp=uk、EntryMode=gb、PermResult=Yw、ColorPalette=sv、HalloweenHudMini=og、HalloweenHud=lg、LockReason=ug、SizeLevel=mm、GemColor=pm、Rarity=vd、RankListType=Gl、ChallengeEntry=Ml、RoomLoadState=rl、RoomState=yc、UserBlockState=Dr、DifficultyEx=Gr、RewardedAdError=ee、LevelSort=ji、LiveRewardCycle=hn、RestrictScope=oo、ReportScene=lo、LotteryOp=bs、RewardCenterTab=Us、EndReason=vr、CommentAdminOp=Rr、TutorialStep=c_、InputSource=k_、PlayState=z_、SettingGroup=$_、DynamicCategory=Mf、RotateDir=Jk、PaletteFilter=oC、GameSystem=zC、GameFlowState=jC、ProfileInfoTab=db、DisconnectReason=WC、Difficulty=Ln）
- 未命名枚举用 `byMember` 反查：作者知道想要 `oneWayPlatform`，一查即得 `hf`。成员名是明文的，这是发现枚举的主路径。
- 未命名的 `name` 字段是占位（`Enum_<混淆名>`），核对后应移入 curatedEnumNames 再生成。

## anchors.json — 字符串锚点表

- 分类: undefined
- **组件 id**（94 项）: ComponentFactory.creators 的 id→类，最硬的锚点；
- **资源路径**: `game/lasershooter.png` 式 CDN 路径，跟着类走；
- **文案键**: `component_name_*` 等 TextKeys 静态键；
- **UI 文案**: 中文界面字符串（1486 条），定位视图/弹窗最直接的证人。
- 用法: mixin 里优先按锚点字符串定位（对版本更新健壮），符号名只作次级索引。

## member-index.json — 成员索引

- `977` 个绑定的方法/静态成员清单（方法名明文，此表是**检索**不是翻译）。
- 已命名 122 个；`parent` 可与 name-map 交叉。
- 用途: "谁有 handleProjectileHit"、"这个类能不能做注入点"。

## rt-namespace.json — 运行时命名空间清单

- `Rt.*`（71 成员）: ECS/物理/相机框架类，点分名注入体直接可用（运行时闭包变量真实存在）；
- `GS.*`（15 成员）: 全局游戏状态单例。
- 注意: Rt 由工厂函数动态构建，`{name:"Rt.X"}` 段在 tool 里解析不到——引用成员直接写点分名，或按锚点定位。