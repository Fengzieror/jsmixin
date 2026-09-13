# 游戏: 派对制造（UGC 派对闯关手游，LayaAir 1.8.4 + webpack 单模块，2.1.93）
# 目标: main.pretty.js 模块 625 闭包内的混淆绑定（每个绑定 = 一个类/命名空间/单例函数）
# 背景: 类名被混淆为短标识符，但方法名/属性名/字符串字面量全部明文。
# 既有命名后缀惯例: *StageView(全屏视图) *Panel(弹窗) *Service(Rt.ElementComponent 服务) *Model(Rt.ElementModel 数据) *State(Rt.State 状态机) *Behaviour(Rt.ElementBehaviour 行为) *Controller(对局控制) *Utils *Base
# 已确认命名（friendly=real，避免重名、可参考语境）:

    Platform1x1 = tv
    Pumpkin = hg
    Platform2x1 = tv
    Platform5x1 = tv
    Roundplatform2x2 = gv
    Girder = nv
    Tshape = ev
    Ishape = ov
    Lshape = nv
    Scaffold = av
    Redplatform = av
    Moveplatform1x1 = hv
    Moveplatform2x1 = hv
    Moveplatform3x1 = hv
    Crumblingblock = Sv
    Spike = cv
    Ice = pv
    Mud = _v
    Spikeball = uv
    Spikeblock = dv
    Spring = vv
    Spinningsaw = mv
    Spinningplatform = kv
    Linearsaw = wv
    Crawlhazard = bv
    Boxingglove = xv
    Triggerspikes = Iv
    Crossbow = Lv
    Trackplatform = Pv
    Platformsaw = Bv
    Score = Av
    Fortunecat = Ov
    Rotaryhazard = Fv
    Onewayplatform = Vv
    Onewayplatformstatic = Uv
    Squaredplatform = Nv
    Pushableplatform = Gv
    Treasurechest = Rv
    Flamethrower = zv
    Bomb = fv
    Bombsmall = fv
    Landmine = Hv
    Landminesmall = Hv
    Checkpoint = Yv
    Portal = jv
    Arrowstraight = Wv
    Arrowdiagonal = Wv
    Airjump = Kv
    Triggerspring = Qv
    Circlespring = fy
    Onewayblock = Jv
    Onoffswitch = sy
    Door = ly
    Rotarydoor = hy
    Swingsaw = cy
    Cannon = Zv
    Ballooncannon = iy
    Note = qv
    Npc = uy
    Text = dy
    Purpleplatform = vy
    Stomper = yy
    Onedirblock = Cy
    Superblock = by
    Triggerinvisible = xy
    Swingplatform = Iy
    Triggerhazard = Ty
    Movabledoor = By
    Movablesaw = Ay
    Decal = Oy
    Spawnpoint = Fy
    Altplatform = wy
    Altspike = wy
    Fan = Uy
    Treadmill = Hy
    Gas = zy
    Respawnpoint = jy
    Doublelift = Xy
    Nowallblock = iv
    Jellyfish = qy
    Pressureswitch = Yy
    Custompathnode = Ny
    Ferriswheel = Ky
    Rotatehinge = Zy
    Shootbarrel = Jy
    Saw = $y
    Pathconnector = tg
    Minirobot = ng
    Action = ag
    Orangeplatform = sg
    Shrinkplatform = rg
    Counterdoor = cg
    Gem = vg
    LaserShooter = Gy
    AttachableLevelComponent = $f
    LevelComponentBase = Df
    ComponentManager = kf
    Balloon = ey
    DynamicSpatialHash = gg
    ComponentFactory = Of
    GridUtils = Fk
    AppService = Oe
    TextKeys = WS
    RealNamePopup = ct
    LoginPanelView = bi
    RealNameInfoPopup = Fi
    AccountPopup = xi
    PhoneAuthModal = H
    ProfileModel = jw
    LobbySystem = it
    AccountServiceBase = nt
    AccountService = at
    AccountServiceWeapp = ot
    LifeCycleController = fp
    LoginState = IS
    PlayerDataModel = Er
    HomeStageView = Vb
    UgcLevelService = Mr
    LevelEditor = Ek
    MatchController = kk
    MatchRoomStageView = zb
    ShareService = dp
    GameEndStageView = yC
    AnnualReportStageView = Ew
    ReplayStageView = UC
    ClanService = ls
    PvpEndStageView = XC
    GameHudStageView = pC
    LoginStageView = wi
    BattlePassStageView = ir
    CheckinPanel = Vs
    FriendService = ac
    GameLiveService = Ji
    FriendModel = nc
    CharacterModel = Yd
    BuffModel = Do
    ReplayDataModel = th
    ItemUtils = wp
    AiPathBehaviour = P_
    SettingsStageView = aS
    LevelSpatialGrid = yg
    MatchmakingState = LS
    EmojiPanel = At
    Direction = w (枚举)
    PhysicsLayer = hf (枚举)
    ZOrder = VC (枚举)
    ComponentType = _f (枚举)
    RotateMode = Pf (枚举)
    EditableScope = Bf (枚举)
    ScreenId = ES (枚举)
    DialogType = S (枚举)
    InitStep = yt (枚举)
    ProfileTab = wt (枚举)
    ProfileItemType = Mt (枚举)
    ItemDuration = Dt (枚举)
    PreloadType = Kt (枚举)
    FeatureType = Qt (枚举)
    AdState = $t (枚举)
    AdErrorCode = te (枚举)
    ScreenEdge = Pe (枚举)
    FetchState = Ee (枚举)
    AccountType = Ve (枚举)
    SmsStep = Ge (枚举)
    LoginChannel = ze (枚举)
    MatchFlowEvent = Xe (枚举)
    CommentSort = gi (枚举)
    ChallengeCycle = qi (枚举)
    GameMode = Pn (枚举)
    MissionType = En (枚举)
    ReportReason = so (枚举)
    CardType = Mo (枚举)
    PushNoticeType = Oo (枚举)
    RankType = sa (枚举)
    AdFailReason = va (枚举)
    ClanOp = Va (枚举)
    ClanPage = Na (枚举)
    ClanRole = ps (枚举)
    ChatType = fs (枚举)
    ActivityType = gs (枚举)
    ActivityState = ks (枚举)
    AlbumOp = pr (枚举)
    PlayMode = Tr (枚举)
    LevelTag = Nr (枚举)
    LevelTab = qr (枚举)
    FriendAction = Ih (枚举)
    FriendTab = Ah (枚举)
    InviteType = Hh (枚举)
    Presence = Zh (枚举)
    PayChannel = ic (枚举)
    PayError = cc (枚举)
    RankTier = ud (枚举)
    ServerError = hp (枚举)
    Quality = gp (枚举)
    RecordState = bp (枚举)
    PlayerAnim = Sp (枚举)
    SurfaceType = Mp (枚举)
    DeathReason = u_ (枚举)
    MoveState = w_ (枚举)
    ControlSource = J_ (枚举)
    GameEvent = tf (枚举)
    CollisionRole = Nf (枚举)
    ProjectileType = ff (枚举)
    EnvType = Ef (枚举)
    BalloonColor = $v (枚举)
    BalloonShape = ty (枚举)
    LaserState = Cv (枚举)
    WidgetType = Ig (枚举)
    EditPropKey = Tg (枚举)
    SpectateMode = Km (枚举)
    RecordMode = AC (枚举)
    GamePhase = kC (枚举)
    AppState = DS (枚举)
    UILayer = RS (枚举)
    PlatformType = HS (枚举)
    RoomVisibility = vw (枚举)
    WinCondition = mw (枚举)
    TutorialStage = Nb (枚举)
    SocketState = lw (枚举)
    ShareState = Uk (枚举)
    FeatureFlag = ju (枚举)
    DisconnectReason = WC (枚举)
    Difficulty = Ln (枚举)

# 绑定块 2/6（152 个，已按证据分数降序）

### `Pw` @L208708 (parent=(无), score=42)
- methods: cancelMatchmaking, debugMatchmaking, destroy, fakeFriendEntryMatch, fakeMatchmakingSuccess, generateDouyinChannel, kickPlayerFromFriendlyMatch, sendEmoji, startEnterMatchmakingQueue, startFriendlyMatch, startFriendlyMatchmaking, startMatchmaking, startQQMatch, switchFriendlyMatch, update, updateFriendlyMatchBasicInfo
- strings: "127.0.0.1:10000", "value", "refreshFriendlyMatchState", "model", "_system", "ownerID", "userID", "profile", "profileModel", "context", "pvpMode", "party", "activityID", "levelID", "leveldrum"

### `Mb` @L217455 (parent=Rt.ElementStageView, score=42)
- methods: closeVerifyPanel, idle, login, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onOKButtonClicked, onReportButtonClicked, onShow, playInTween, playOutTween, refresh
- strings: "value", "visible", "inputMask", "_ui", "defaultInput", "key", "refresh", "text", "inputField", "onBlur", "onFocus", "report", "showPopup", "popupController", "context"

### `Eb` @L218088 (parent=Rt.ElementStageView, score=42)
- methods: closeVerifyPanel, idle, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, refresh, restore, setData
- strings: "ID: ", "value", "text", "nickName", "_profile", "getLimitCountText", "UIUtils", "_ui", "refresh", "avatar", "userShortId", "concat", "shortID", "visible", "inputMask"

### `Db` @L218276 (parent=Rt.ElementStageView, score=42)
- methods: idle, onBlur, onDisable, onEnable, onFemaleButtonClicked, onFocus, onHide, onInit, onMaleButtonClicked, onOKButtonClicked, onRandomButtonClicked, onShow, playInTween, playOutTween, refresh, refreshGenderInfo
- strings: "这个昵称太长了，重新起一个吧", "这个昵称不太好，重新起一个吧", "」已被占用，试试下面这个名字", "昵称「", "你好，", "value", "visible", "_gender", "selected", "getChildByName", "femaleButton", "_ui", "maleButton", "key", "refreshGenderInfo"

### `Hb` @L220803 (parent=Rt.ElementStageView, score=42)
- methods: getClipboardData, handleOnShow, idle, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onSearchButtonClicked, onShow, playInTween, playOutTween, refreshAutoPanel, refreshTips
- strings: "将5位房间号复制到剪贴板，系统将自动识别", "例如 ro001", "该房间不存在", "value", "complete", "mouseEnabled", "inputField", "_ui", "fail", "refreshAutoPanel", "success", "_autoID", "color", "#000000", "changeText"

### `bS` @L227832 (parent=Rt.ElementStageView, score=42)
- methods: cancelRevive, idle, onADButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onShow, onWatchVideoEnd, playInTween, playOutTween, refreshProgress, update
- strings: "/bubble.png", "value", "cancelRevive", "controller", "currentGame", "onHide", "key", "refreshProgress", "_reviveDuration", "_elapsed", "_reviveStartTime", "realTimeSinceStartUp", "timer", "clear", "graphics"

### `_i` @L42961 (parent=(无), score=41)
- methods: destroy, handleClick, handleMouseDown, handleMouseOut, handleMouseOver, handleMouseUp, handleMouseUpOut, onLoaded, onmoveout, onpress, onrelease, playPressTween, playReleaseTween, playSound, tryPlayCacheSound
- statics: State
- strings: ".wav", "btn_click", "btn_close", "get", "key", "target", "value", "start", "setContext", "scaleY", "scaleX", "tweenProps", "stopAllTweensWithContext", "TweenMgr", "_originalScale"

### `jS` @L231782 (parent=(无), score=41)
- methods: agreePrivacyInfo, canUGC, checkAppExist, getBannerID, getClipboardData, getMenuButtonRectMokcup, getVideoAd, hasBanner, hasVideoAd, init, onGetSystemInfoFailed, onGetSystemInfoSucceeded, openTapTapMoment, requestReview, setClipboardData
- statics: _platform
- strings: "去升级", "版本太低啦，升级了才能玩", "微信", "快手", "哔哩哔哩", "头条", "小程序环境", "立刻评分", "以后再说", "如果你喜欢「派对制造」，请评分鼓励一下吧~", "为\b「派对制造」评分", "暂不支持复制", "知道了", "派对制造", "生肖派对"

### `Ft` @L33005 (parent=xt, score=40)
- methods: hidePanel, initList, initViews, onActionClicked, onDestroy, onDisable, onEnable, onFetched, onFilterButtonClicked, onInit, onItemEntryClicked, onUse, refreshItemEntries, refreshItemEntry, refreshItemList
- strings: "全部道具", "value", "visible", "actionSheet", "_listPanel", "text", "label", "getChildByName", "_childs", "currentFilter", "refreshItemList", "_filterType", "key", "onActionClicked", "color"

### `Fo` @L57076 (parent=Rt.ElementStageView, score=40)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onUse, onUseButtonClicked, onUseFailed, playInTween, playOutTween, refreshRemainTime, setItem, update
- strings: "当前试用剩余时长 ", "使用出错", "使用成功", "您需要先解锁对应宠物", "该皮肤正在限免", "生效中", "value", "refreshRemainTime", "key", "update", "updateText", "remainTime", "_ui", "countdown", "concat"

### `Xo` @L57794 (parent=Rt.ElementStageView, score=40)
- methods: idle, onClaimButtonClicked, onClaimed, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onShow, onWatchVideoEnd, playInTween, playOutTween, setData
- strings: "金币", "打开后，可获得", "金币宝箱", "value", "playOutTween", "key", "onClaimed", "_videoAd", "onLoadVideoFailed", "id", "_currentPack", "claimVideoPack", "_packController", "onWatchVideoEnd", "showNoDailyVideoToast"

### `Aa` @L63525 (parent=Rt.ElementStageView, score=40)
- methods: initPanel, onAction, onCloseButtonClicked, onCreateButtonClicked, onDestroy, onDisable, onEnable, onInit, onIntroButtonClicked, onItemEntryClicked, onJoinButtonClicked, onRandomJoinButtonClicked, onRefreshButtonClicked, onSearchButtonClicked, refreshItemEntry
- strings: "请求过于频繁", "系统维护 暂不可创建", "不足", "每次兑换，可以额外获得20贵族经验（每日上限为1000", "说明", "/clan/banner.png", "value", "id", "item", "show", "key", "onItemEntryClicked", "setItem", "recommendClanList", "_clanModel"

### `Ya` @L65956 (parent=Rt.ElementStageView, score=40)
- methods: handleOnShow, idle, onAction, onCloseButtonClicked, onDestroy, onDisable, onEnable, onEntryClicked, onEntryJoinClicked, onHide, onInit, onSearchButtonClicked, onShow, playInTween, playOutTween
- strings: "战队不存在", "这是你自己的战队", "未检测到有效战队号", "请输入战队号", "搜索战队", "value", "refreshState", "searchedEntry", "_ui", "ErrClanJoinApprovel", "code", "join", "visible", "state", "joinButton"

### `Ls` @L72675 (parent=Ts, score=40)
- methods: buyBattlePass, buyBattlePassLevel, buyRankRushPass, checkin, claimBattlePassMaxReward, claimBattlePassReward, claimFullCheckedReward, fetchBattlePassInfo, fetchLeaderboard, fetchRankRushInfo, fillCheckin, getCheckinRewards, lotteryClaimMax, lotteryDraw, lotterySync
- strings: "玩家", "https://static.tuimotuimo.com/common/ui/avatar.png", "value", "reward", "push", "items", "pickOne", "random", "id", "packs", "pack", "type", "rewards", "checkinEvent", "eventModel"

### `Ou` @L113096 (parent=zs, score=40)
- methods: handleDoubleCoinResult, onBankCoinClaimed, onClaimButtonClicked, onDestroy, onDisable, onEnable, onFreeCoinButtonClicked, onFreeCoinClaimed, onInit, onLoadVideoFailed, onWatchVideoEnd, refreshBankPanel, refreshFreeCoinPanel, showRewardAnim, update
- strings: "bank_output_progress", "00:00:00", "bank_freecoin_progress", "bank_freecoin_claimtips", "bank_no_freecoin", "/bank_top.png", "value", "visible", "freeCoinButton", "_ui", "_haveFreeVideoAd", "_freeCoinVideoAd", "haveDailyVideoAdQuota", "dailyModel", "context"

### `nd` @L114895 (parent=Rt.ElementStageView, score=40)
- methods: idle, onBuyButtonClicked, onBuySucceeded, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onYearlyBuyButtonClicked, playInTween, playOutTween, refresh, setData, update
- strings: "有效期剩余：", "/年", "/vip/2.0/intro.png", "value", "text", "validTimeStr", "concat", "validTime", "_ui", "visible", "canRecharge", "tips", "validTimeHud", "_needUpdate", "hasBuy"

### `ok` @L179187 (parent=Rt.Element, score=40)
- methods: getCurrentTargetPlayer, getIsOutOfView, getIsTargetPlayerDisabled, lateUpdate, onDestroy, onInit, onStart, reset, setTargetToGhost, setTargetToPlayer, setTargetToPosition, startObservePlayer, startObservePosition, warpToScale, warpToTarget
- strings: "value", "dispatch", "onTargetPlayerChanged", "_currentTargetPlayer", "target", "_ghostEntity", "_cameraKit", "key", "setTargetToGhost", "onUpdate", "currentState", "_stateMachine", "lateUpdate", "entity", "id"

### `PC` @L197494 (parent=Rt.ElementStageView, score=40)
- methods: exitGame, getCanShareVideo, hideButtons, onChangeViewButtonClicked, onDisable, onEnable, onGameStateChanged, onInit, onNextButtonClicked, onScreenButtonClicked, onShareButtonClicked, onSpeedButtonClicked, refreshSpeedButton, setButtonVisible, showButtons
- strings: "value", "chromemockup", "stopped", "recordState", "_videoController", "hasValidVideo", "canShareVideo", "key", "getCanShareVideo", "start", "setContext", "accelerate", "Ease", "setEaseType", "alpha"

### `cb` @L214524 (parent=(无), score=40)
- methods: getBadgeByID, getExpRank, handleFetchResult, refreshAlbumIDs, refreshBadgeStats, refreshBadges, refreshBadgesOwn, refreshBasicInfo, refreshHonesty, refreshPvpInfo, refreshUGCInfo, resetFetchState, startFetch, startFetchAlbumInfo, tryAddBadge
- strings: "/icon_default_ugc.png", ".png", "value", "refresh", "id", "get", "_badges", "set", "badges", "has", "key", "tryAddBadge", "forEach", "refreshBadges", "_badgesOwn"

### `vb` @L215948 (parent=pb, score=40)
- methods: handleBadgeInfoChange, handleBasicInfoChange, handleProfileChanged, initStatsBar, layoutBasicStats, onDestroy, onDisable, onEnable, onInit, refresh, refreshBasicStatsInfo, refreshChart, refreshPvpInfo, refreshStatsBar, updateSelfName
- strings: "user_stats_others", "user_stats_self", "user_pvpcount", "user_no_commonstats", "social_notinrank", "user_ranking", ".png", "/badge_s_", "value", "key", "handleBadgeInfoChange", "other", "self", "refresh", "handleBasicInfoChange"

### `Ab` @L218803 (parent=Rt.ElementStageView, score=40)
- methods: idle, onCloseButtonClicked, onDestroy, onDisable, onEnable, onGenderButtonClicked, onHide, onInit, onNextButtonClicked, onPreviousButtonClicked, onShow, playInTween, playOutTween, refreshPanel, updateGender
- strings: "与当前性别相同", "请先选择一个性别", "更改性别", ".png", "ui/icon_", "value", "onHide", "_gender", "updateGender", "_userSystem", "key", "refreshPanel", "_step", "title", "showToast"

### `cS` @L225771 (parent=Rt.ElementStageView, score=40)
- methods: idle, onADButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onOKButtonClicked, onShow, onWatchVideoEnd, playInTween, playOutTween, setCompleted
- strings: "btn_doubleclaim", "recharge/item_gold_s.png", "value", "onHide", "_videoAd", "haveDailyVideoAdQuota", "dailyModel", "context", "key", "onLoadVideoFailed", "_withAd", "onWatchVideoEnd", "show", "idle", "_viewState"

### `we` @L37101 (parent=(无), score=39)
- methods: destroy, handleClick, handleMouseDown, handleMouseOut, handleMouseOver, handleMouseUp, handleMouseUpOut, onmoveout, onpress, onrelease, playPressTween, playReleaseTween, playSound, tryPlayCacheSound
- statics: State
- strings: ".wav", "btn_close", "btn_click", "value", "start", "setContext", "scaleY", "scaleX", "_target", "tweenProps", "stopAllTweensWithContext", "TweenMgr", "getOriginalScale", "key", "playReleaseTween"

### `Zn` @L54544 (parent=Rt.ElementModel, score=39)
- methods: addMessage, getMessageByID, getMessageToPopup, handleBroadcast, handleFetchFailed, handleGetMsg, handleMsgListFetched, insertMessage, onInit, refresh, removeInvalidMessages, removeNewMessage, reset, startFetch
- statics: countPerFetch
- strings: "分钟只能广播1次", "每人", "value", "notify", "onRemoved", "length", "splice", "_idsToBePopup", "indexOf", "_ids", "delete", "_messages", "forEach", "push", "broadcastKeepTime"

### `Ti` @L45151 (parent=Rt.ElementStageView, score=38)
- methods: bindAccount, idle, onAppleButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onTapTapButtonClicked, onWechatButtonClicked, playInTween, playOutTween, refresh
- strings: "登录", "已绑定", "Apple 登录", "已绑定 Apple 登录", "微信登录", "已绑定微信登录", "https://weixin.qq.com/", "com.tencent.mm", "value", "taptap", "isBinded", "updateText", "taptapButton", "_ui", "apple"

### `Ui` @L47189 (parent=Rt.ElementStageView, score=38)
- methods: closeVerifyPanel, idle, onBindPhoneNumber, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, updatePhoneNumber
- strings: "更换手机号成功", "value", "onHide", "title", "showToast", "key", "onBindPhoneNumber", "show", "_verifyPanel", "visible", "_ui", "_newPhoneNumber", "_oldPhoneNumber", "verifyPhoneNumber", "_userSystem"

### `Vi` @L47358 (parent=Rt.ElementStageView, score=38)
- methods: idle, joinQQGroup, onCloseButtonClicked, onDisable, onDouyinButtonClicked, onEnable, onHide, onQQButtonClicked, onShow, onTapTapButtonClicked, onWechatButtonClicked, playInTween, playOutTween, setClipboard
- strings: "复制成功", "派对制造手游", "坏兔子工作室", "value", "success", "title", "showToast", "isOnWechat", "data", "setClipboardData", "key", "setClipboard", "onDouyinButtonClicked", "openURL", "joinQQGroup"

### `Qo` @L58475 (parent=Rt.ElementStageView, score=38)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onHistoryButtonClicked, onInit, onIntroButtonClicked, onShow, playInTween, playOutTween, refreshDescription, refreshEntry, setData
- strings: "&nbsp;自制地图评论时可用", "规则说明", "您可以获得以下物品", "您可能获得其中之一", "ui/rect_radius4_2944C4.png", "value", "centerX", "description", "_ui", "addChild", "centerY", "height", "width", "Box", "innerHTML"

### `rs` @L68074 (parent=Rt.ElementStageView, score=38)
- methods: fetchClanMembers, idle, onAction, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onMembersInfoFetched, onShow, playInTween, playOutTween, refreshEntry
- strings: "转让", "暂时没有可以转让的部落成员~", "队长转让", "value", "transferRole", "onHide", "getClan", "fetchClanMembers", "key", "onAction", "_clanController", "id", "getMemberByID", "localClan", "_clanModel"

### `Ms` @L72358 (parent=Ts, score=38)
- methods: buyBattlePass, buyBattlePassLevel, buyRankRushPass, checkin, claimBattlePassMaxReward, claimBattlePassReward, claimFullCheckedReward, fetchBattlePassInfo, fetchLeaderboard, fetchRankRushInfo, fillCheckin, lotteryClaimMax, lotteryDraw, lotterySync
- strings: "lottery/draw", "lottery/claimmax", "lottery/sync", "shop/buy", "rankrush/getinfo", "battlepass/claimmaxreward", "battlepass/claimreward", "battlepass/unlocklevel", "battlepass/getinfo", "checkin/claimmaxone", "checkin/claimbyfill", "checkin/claimdaily", "ranklist/", "value", "data"

### `fr` @L78570 (parent=Rt.ElementModel, score=38)
- methods: addAlbums, addLocalAlbum, deleteLocalAlbum, getAlbumByID, handleFetchLocalAlbums, onInit, removeLevelFromAlbum, reset, sortAlbum, sortAlbumLevel, startFetchLocalAlbums, tryAddAlbum, updateAlbum, updateAlbumLevel
- strings: "value", "key", "reset", "_localIDs", "_albums", "onInit", "_localAlbumFetchState", "fetching", "startFetchLocalAlbums", "refresh", "id", "get", "set", "has", "tryAddAlbum"

### `ql` @L95369 (parent=el, score=38)
- methods: fetchUGCLevels, onDestroy, onDisable, onEnable, onEntryClicked, onInit, onMouseDown, onRankListFetched, onScroll, onScrollEnd, onScrollStart, onUGCLevelsFetched, refreshEntry, tryEnterUGC
- strings: "近期超难图、精选图破纪录集锦，不服请挑战！", "value", "_endIndex", "slice", "fetUGCLevelsByIDs", "_ugcController", "repeatY", "list", "_root", "length", "min", "_isFetching", "getReplayList", "_ugcModel", "key"

### `Yh` @L101455 (parent=Wh, score=38)
- methods: canInviteChannelFriend, disable, enable, onAgreeButtonClicked, onApplicationHandled, onDenyButtonClicked, onDetailButtonClicked, onEmptyEntryClicked, onFriendsFetched, onMouseDown, onScrollEnd, onScrollStart, refreshEntry, refreshList
- strings: "friend_toast_applicationhandled", "friend_toast_max", "btn_confirm_deny", "modal_content_denyapplication", "modal_title_denyapplication", "value", "canShare", "key", "canInviteChannelFriend", "array", "_list", "assign", "length", "applications", "_friendModel"

### `gc` @L105118 (parent=Rt.ElementStageView, score=38)
- methods: idle, onAliButtonClicked, onBuySucceeded, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onWechatButtonClicked, onWechatCodeButtonClicked, playInTween, playOutTween, setData
- strings: "value", "_item", "payOnAndroidAli", "_rechargeController", "idle", "_viewState", "key", "onAliButtonClicked", "payOnAndroidWechat", "onWechatButtonClicked", "paycode", "showPopup", "popupController", "context", "setData"

### `zc` @L107427 (parent=Rt.ElementStageView, score=38)
- methods: hideAll, onDisable, onEnable, onInit, showLeftFingerHoldTip, showLeftFingerTip, showLeftRing, showPointerRing, showRightFingerTip, showRightRing, showUITutorial, showUITutorialWithPopupHud, startBlinkRingAnim, startPressAnim
- strings: "value", "startPressAnim", "setCompletionHandler", "start", "sineIn", "Ease", "setEaseType", "alpha", "scaleY", "scaleX", "ring", "tweenProps", "appendTween", "decelerate", "setContext"

### `uu` @L110163 (parent=Rt.ElementComponent, score=38)
- methods: buy, claimFreeGem, claimFreeHorn, exchange, fetchDailyItems, fetchFreeGemInfo, handleBuyResult, handleDailyItemsFetched, handleFreeGemClaimResult, handleFreeHornClaimResult, handleNotEnoughCurrency, onInit, onStart, resetBadgeRefreshTS
- strings: "免费钻石", "购买出错", "value", "notify", "onBuy", "_shopModel", "rewards", "handleGetReward", "handleUserMsg", "msgController", "context", "count", "type", "isUserroleItem", "forEach"

### `vu` @L111248 (parent=Rt.ElementStageView, score=38)
- methods: idle, onAction, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, playInTween, playOutTween, refresh, setData, spawnPlayer
- strings: "使用期限 ", "试用", "value", "onHide", "buyBattlePass", "key", "onAction", "scaleY", "entity", "_player", "scaleX", "visible", "headIcon", "disabled", "changeState"

### `Fu` @L113326 (parent=Rt.ElementStageView, score=38)
- methods: idle, onADButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onFreeCoinClaimed, onHide, onInit, onLoadVideoFailed, onShow, onWatchVideoEnd, playInTween, playOutTween
- strings: " 次", "今日限额 ", "金币储备不足！<br/>现在观看广告可以免费补充", ".png", "item_gold_s", "item_gold_l", "recharge/", "&nbsp;<img src='ui/coin.png' style='width:34px;height:35px'></img>", "value", "onHide", "afterDelay", "ActionTask", "coin", "showRewardToast", "_viewState"

### `ad` @L115144 (parent=Rt.ElementStageView, score=38)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onUse, onUseButtonClicked, onUseFailed, playInTween, playOutTween, refresh, setInventoryType
- strings: "</span>&nbsp;次", "效果剩余&nbsp;<span style='color:#94F1DC'>", "使用出错", "使用成功", "%</span>", "&nbsp;<span style='color:#94F1DC'>+", "value", "innerHTML", "div", "getChildByName", "remainCount", "_ui", "concat", "count", "_type"

### `ip` @L121738 (parent=(无), score=38)
- methods: destroy, exit, handleInterrupted, handleJoinFailed, handleSpeakersChanged, init, isEarMuted, isMicMuted, isSupported, join, joinChannel, onDouyinChannelFromMatchmaking, onDouyinChannelFromPvp, updateMuteConfig
- strings: "开启", "关闭", "value", "complete", "_joinComplete", "fail", "_joinFail", "_joinSuccess", "success", "interval", "enableAudioVolumeIndication", "_rctEngine", "enableLocalAudio", "isEarMuted", "isMicMuted"

### `_p` @L124016 (parent=(无), score=38)
- methods: buildQueryString, canRetry, destroy, disableErrMsg, getSecretFilter, handleRequestFail, handleRequestSuccess, handleTimeout, onFail, retry, setRequestData, showErrMsg, start, stop
- strings: "请求错误 ", "请求超时", "application/x-www-form-urlencoded", "application/octet-stream", "login/weixin", "value", "_secretFilter", "Default", "random", "key", "getSecretFilter", "join", "map", "keys", "buildQueryString"

### `Mv` @L146543 (parent=(无), score=38)
- methods: clearAllProjectiles, createProjectile, despawnProjectle, destroyProjectileByIndex, destroyProjectlesToRemove, getDataForCheckpoint, getProjectileByIndex, handlePlayerHitbyProjectile, handleProjectileHit, loadDataFromCheckpoint, oneUpdateProjectile, reset, spawnProjectile, updateProjectile
- strings: "value", "despawn", "_pool", "hide", "entity", "reset", "index", "failed to find projectile with index", "warn", "splice", "_projectiles", "indexOf", "removeDynamicObject", "key", "despawnProjectle"

### `Dv` @L147825 (parent=Df[=LevelComponentBase], score=38)
- methods: attachPlayer, getCanAttachPathConnector, getDataForCheckpoint, getIsLandableForAI, handleNetworkEvent, loadDataFromCheckpoint, onDestroy, onPlayerEnterTrigger, onPlayerExitTrigger, onReset, onStartEdit, onStartPlay, playSound, update
- strings: ".png", "game/", "value", "_followSpeed", "floating", "random", "_offsetToPlayerY", "integer", "_offsetToPlayerX", "_playerAttachTo", "key", "attachPlayer", "score", "triggerComponentSound", "playSound"

### `MC` @L197194 (parent=Rt.ElementStageView, score=38)
- methods: clearCurrrentSelectedEntry, idle, onDisable, onEnable, onEntryClicked, onEntryMouseDown, onInit, onMouseUp, onMoveClickedEntry, onPartyComponentSelected, playInTween, playOutTween, refreshComponents, selectCurrentSelectedEntry
- strings: "value", "_currentSelectedEntry", "y", "_currentSelectedEntryStartY", "MOUSE_MOVE", "Event", "offAll", "_ui", "key", "clearCurrrentSelectedEntry", "index", "partyComponent", "selectPartyComponent", "_editController", "selectCurrentSelectedEntry"

### `nw` @L204475 (parent=Rt.State, score=38)
- methods: onEnter, onEnterRankListView, onExit, onGetDebrisHelpResult, onGetMatchInfo, onGetMatchResult, onGetReplayInfo, onGetTeamMatchInfo, onGetUGCInfo, onInit, onReplayDataFetched, reportMatchResultMockup, showTutorialEndView, tryShowMatchResult
- strings: "网络请求出错", "通关", "tutorial_end", "value", "getMatchResult", "model", "context", "players", "_context", "matchTeamMode", "matchData", "_roomModel", "matchEndType", "matchMode", "levelID"

### `oS` @L224463 (parent=f.PlayerInputSettingPanelUI, score=38)
- methods: changeInputType, disable, enable, getInputText, getValidX, getValidY, onDrag, onDragButtonPanel, onDragEnd, onDragJumpButton, onResetButtonClicked, onSaveButtonClicked, posButtons, refreshInputType
- strings: "摇杆模式下，操作区不可编辑", "按键贴近边缘时，某些机型可能操作失灵", "input_name_touch", "input_name_button", "settings_toast_inputchanged", "value", "pos", "jumpButton", "centerY", "jumpButtonView", "height", "centerX", "width", "y", "jumpButtonPos"

### `gS` @L226826 (parent=f.HomeSlidePanelUI, score=38)
- methods: disable, enable, haveDouyinSidebarVisitReward, haveDouyinVisitReward, haveQQStickyReward, needShowLiveButton, needShowTopPvpButton, onDouyinSidebarVisitRewardClaimed, onDouyinVisitRewardClaimed, onSlideButtonClicked, refreshPanel, refreshReddot, slideIn, slideOut
- strings: "value", "slideIn", "slideOut", "isIn", "idle", "_viewState", "key", "onSlideButtonClicked", "underReview", "needShowTopPvpButton", "isOnDouyin", "douyinVideoEnabled", "config", "chromemockup", "isOnWechat"

### `SS` @L228034 (parent=Rt.ElementStageView, score=38)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onInputChanged, onOKButtonClicked, onRedeem, onReportButtonClicked, onShow, playInTween, playOutTween, showErrMsg
- strings: "兑换出错 ", "请求过于频繁", "该兑换码已过期", "该兑换码不能在当前平台使用", "该兑换码无效", "该兑换码已被使用", "请输入6位兑换码", "value", "start", "centerX", "panel", "_ui", "setCompletionHandler", "setContext", "PingPong"

### `St` @L29995 (parent=Rt.ElementStageView, score=36)
- methods: idle, onCloseButtonClicked, onDefaultButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, setData
- strings: "写点儿什么吧", "您输入的内容太长了", "字以内）", "请输入（", "unicode_unescape", "value", "title", "showToast", "checkFunction", "_data", "onHide", "complete", "max", "isTextTooLong", "UIUtils"

### `Qe` @L41289 (parent=Rt.ElementBehaviour, score=36)
- methods: handleOnHide, handleOnShow, onAudioInterruptionBegin, onAudioInterruptionEnd, onDisable, onEnable, onStateChange, onWatchingVideoAd, playBGM, playCurrentBgm, playGameBGM, playSound, stopBgm
- strings: "bgm_home", ".mp3", "sounds/bgms", "cdn/", "sounds_bgm", "cdn/sounds", "value", "_lastBGM", "playBGM", "_isPlayingMusicOnHide", "_isAudioInterrupted", "key", "handleOnShow", "stopBgm", "_isPlaying"

### `Ri` @L46203 (parent=(无), score=36)
- methods: disable, enable, joinQQGroup, onDouyinButtonClicked, onEmailButtonClicked, onInfoHudClicked, onKuaishouButtonClicked, onQQButtonClicked, onTapTapButtonClicked, onWechatButtonClicked, onWechatQRCodeClicked, refresh, setClipboard
- strings: "复制成功", "保存失败", "保存成功", "派对问题反馈", "派对制造", "生肖派对", "知道啦", "」已复制✨", "」即可", "在微信里搜索公众号「", "坏兔子工作室", "设备与系统：", "ID: 未登录", "版本：", "https://static3.codeplaygames.com/battlecraft/report_qrcode.png"

### `ea` @L59731 (parent=Rt.ElementStageView, score=36)
- methods: idle, initList, onCloseButtonClicked, onDisable, onEnable, onGetHistory, onHide, onInit, onShow, playInTween, playOutTween, refreshEntry, setData
- strings: "最近30次开箱记录", "value", "bottom", "top", "spaceY", "repeatY", "onEntryClicked", "renderFunc", "bind", "refreshEntry", "itemRender", "init", "list", "_ui", "key"

### `is` @L67439 (parent=f.ClanTextChatPanelUI, score=36)
- methods: destroy, hide, idle, initList, onDisable, onEntryClicked, onHide, onSendButtonClicked, onShow, playInTween, playOutTween, refreshEntry, show
- strings: "个字符以内", "value", "id", "setEmojiMessage", "_clanController", "key", "onEntryClicked", "_emojis", "refresh", "refreshEntry", "length", "setArray", "emojiList", "onEnable", "ownedEmojis"

### `ml` @L90246 (parent=el, score=36)
- methods: fetchUGCLevels, onDestroy, onDisable, onEnable, onEntryClicked, onHistoryFetched, onInit, onMouseDown, onScroll, onScrollEnd, onScrollStart, onUGCLevelsFetched, refreshEntry
- strings: "最近通关的50张地图", "value", "_endIndex", "slice", "fetUGCLevelsByIDs", "_ugcController", "repeatY", "list", "_root", "length", "min", "_isFetching", "getHistoryIDs", "_ugcModel", "key"

### `kl` @L90426 (parent=Rt.ElementStageView, score=36)
- methods: idle, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, setComplete
- strings: "写一条走心的评论吧", "评论需要在20字以内", "value", "visible", "inputMask", "_ui", "defaultInput", "text", "inputField", "key", "onBlur", "onFocus", "title", "showToast", "id"

### `xh` @L98690 (parent=Rt.ElementModel, score=36)
- methods: buy, getEmojiByID, getEmojisAvaliable, getEquippedEmojiIDsByType, getEquippedEmojisByType, getRoomEmojiByID, isEmojiEquipped, onDestroy, onStart, refreshEmojiEquips, refreshEmojiEquipsByType, refreshEmojis, reset
- strings: "value", "buy", "getEmojiByID", "key", "push", "forEach", "get", "_equips", "set", "refreshEmojiEquipsByType", "normal", "coop", "length", "team", "_defaultIDs"

### `kc` @L105358 (parent=Rt.ElementStageView, score=36)
- methods: idle, onBuy, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onToggleClicked, playInTween, playOutTween, refreshBuyInfo
- strings: " 购买", "intro_newbiepack.png", "value", "selected", "checkbox", "_ui", "key", "onToggleClicked", "onHide", "onBuy", "price", "_item", "concat", "updateText", "buyButton"

### `yu` @L111463 (parent=Rt.ElementStageView, score=36)
- methods: idle, onCloseButtonClicked, onDestroy, onDisable, onEnable, onExchange, onExchangeButtonClicked, onHide, onInit, onShow, playInTween, playOutTween, setData
- strings: "&nbsp;付款？", "<br/>使用&nbsp;", " 个&nbsp;", "还差 ", "_small.png'></img>", "<img src='ui/icon_", "value", "onHide", "_complete", "key", "onExchange", "show", "title", "showToast", "_price"

### `Cd` @L116767 (parent=Rt.ElementComponent, score=36)
- methods: canStartPvp, canTimesLeagueCoinReward, canTimesLeagueReward, claimDoubleCoin, claimSeasonReward, defendDan, fetchLeagueInfo, getCoinTimesType, onInit, startPvp, startTeamPvp, tryStartPvp, tryStartTeamPvp
- strings: "league_toast_notstart", "league_toast_end", "get", "supportVideoAds", "haveDailyVideoAdQuota", "dailyModel", "key", "watchVideoAdsToDoubleCoin", "value", "title", "getLocalizationText", "showToast", "IsSeasonStart", "leagueModel", "context"

### `Kd` @L120881 (parent=Rt.ElementComponent, score=36)
- methods: checkEquippedCharacterValid, checkEquippedValid, claimDebrisByVideo, dropDebrisByVideo, equip, handleDebrisHelpResult, helpGiveDebris, onStart, refreshCharacterGates, refreshCharacters, refreshReddot, showUnlockToast, unlock
- strings: "卡！", "」收集了1张", "您帮「", "」试用已到期", "character_toast_unlocked", "value", "title", "name", "concat", "showToast", "id", "debrisConfig", "handleDebrisHelpResult", "_characterModel", "getNeedEnterTutorial"

### `o_` @L127661 (parent=(无), score=36)
- methods: changeState, clipRecord, customShare, deleteRecord, getDefaultShareConfig, getRecordState, getVideoInfo, init, pause, recordClip, resume, start, stop
- strings: "生肖派对", "派对制造", "alias_id", "hashtag_list", "5.9.0", "value", "_lastRecordedVideoPath", "key", "deleteRecord", "notify", "onStateChanged", "_state", "] to [", "**change record state from [", "warn"

### `q_` @L133533 (parent=Rt.ElementStageView, score=36)
- methods: load, loadAnim, onDestroy, onDisable, onEnable, onInit, onInvincibleChange, pause, playAnim, reset, resetZOrder, unpause, updateDirection
- strings: "value", "scaleX", "_animRoot", "key", "updateDirection", "play", "_anim", "spriteVisible", "entity", "context", "isFreezed", "model", "enable", "headIcon", "_headIconTeleported"

### `Y_` @L133721 (parent=Rt.ElementStageView, score=36)
- methods: onDestroy, onDisable, onEnable, onInit, reverse, setControllingPlayerMode, setEditMode, setNonAvatarMode, setPlayMode, startReverseCountdown, stopAnim, update, updateAvatar
- strings: "ui/icon_me.png", "value", "reverse", "start", "_reverseContext", "setContext", "PingPong", "LoopType", "setLoops", "alpha", "tweenProps", "addTween", "y", "_childs", "_ui"

### `uf` @L135140 (parent=Rt.Element, score=36)
- methods: getIsOutOfBounds, onAwake, onDestroy, onInit, pause, respawn, setAlpha, stopMoveSound, triggerComponentSound, triggerMoveSound, unpause, update, updatePlayerDynamicCells
- strings: "value", "destroy", "_entity", "key", "onDestroy", "hide", "changeState", "onAwake", "_audioController", "audioController", "revive", "registerState", "_stateMachine", "deadghost", "edit"

### `Xg` @L170924 (parent=Rt.ElementStageView, score=36)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onListenButtonClicked, onOKButtonClicked, onShow, playInTween, playOutTween, refreshEntry, setData
- strings: "value", "playBGM", "_bgmMgr", "bgm", "replace", "defaultUGCTBGM", "id", "config", "stopBgm", "idle", "_viewState", "key", "onListenButtonClicked", "playOutTween", "tryUpdateSkin"

### `ik` @L178903 (parent=Rt.State, score=36)
- methods: applyRunCamera, applyShootBarrelCamera, getHorizontalOffsetByFaceDir, lerpHorizontalOffsetByInput, lerpToHorizontalOffset, onEnter, onExit, onInit, onUpdate, setJustFollowNewTarget, setSmallCameraWindow, slowLerpToHorizontalOffset, updateTargetPlayer
- strings: "value", "horizontalOffset", "_cameraKit", "_isUGCMode", "_justFollowNewTarget", "getHorizontalOffsetByFaceDir", "height", "_cameraWindow", "width", "smallWindowHeight", "key", "setSmallCameraWindow", "reset", "setJustFollowNewTarget", "player"

### `rC` @L191990 (parent=f.MoreActionPopupUI, score=36)
- methods: disable, enable, hide, onAddButtonClicked, onApplicationSend, onDetailButtonClicked, onReportButtonClicked, onReported, refresh, report, show, tryHide, updateReported
- strings: "感谢维护游戏秩序", "举报已提交", "今日举报次数已达上限", "下一步", "合理举报倡议", "pvp_report", "get", "userID", "_profile", "indexOf", "_reported", "key", "canReport", "added", "canAdd"

### `xC` @L196751 (parent=f.GamePopupHudUI, score=36)
- methods: clear, clearAnnouncement, clearToastHud, disable, enable, internalShowHud, onDestroy, showAnnouncement, showCharacterHud, showHud, showTextHud, showTip, showToastHud
- strings: "ui/dialog_red.png", ".png", "ui-loc/title_", "value", "_displayDuration", "_currentHud", "visible", "afterDelay", "ActionTask", "start", "setContext", "decelerate", "Ease", "setEaseType", "alpha"

### `ob` @L213684 (parent=(无), score=36)
- methods: decodeFromFriendMsg, getCharacterAvatarInfo, getLimitedNickName, updateBattleState, updateCharacter, updateDan, updateIndex, updateLeagueResult, updateMatchScore, updateRank, updateSpawnIndex, updateTeam, updateVip
- strings: "unicode_unescape", "value", "_team", "length", "key", "updateTeam", "_isWin", "_isFinish", "updateBattleState", "_rank", "updateRank", "_finalScore", "_matchScore", "updateMatchScore", "_leagueScore"

### `TS` @L228478 (parent=Rt.State, score=36)
- methods: onEnter, onExit, onGetDebrisHelpResult, onGetMatchInfo, onGetReplayInfo, onGetTeamMatchInfo, onGetUGCInfo, onInit, onReplayDataFetched, onShow, reloadPvpGame, update, updateUIStack
- strings: "放弃", "继续", "是否继续之前未完成的比赛", "继续比赛", "value", "debrishelppopup", "showPopup", "popupController", "context", "key", "onGetDebrisHelpResult", "mode", "matchreplay", "game", "changeState"

### `xm` @L174075 (parent=(无), score=36)
- methods: checkOverlap, clearPortalAnim, handleShootHit, onPlayerEnterTrigger, onPlayerExitTrigger, onReset, onStartEdit, onStartPlay, scaleDown, scaleUp, teleportFrom, teleportTo, update
- strings: "value", "stopAllTweensWithContext", "TweenMgr", "key", "clearPortalAnim", "scaleUp", "scaleDown", "_teleporting", "onReset", "splice", "teleportalbe", "teleportTo", "connectedPortal", "ts", "fixedTime"

### `ww` @L206381 (parent=Rt.ElementComponent, score=36)
- methods: join, onDestroy, onInit, onKeyDown, onShutdown, registerCommand, registerRPC, reset, rpc, sendCommand, shutdown, unregisterCommand, unregisterRPC
- strings: "value", "shutdown", "Q", "Keyboard", "keyCode", "key", "onKeyDown", "clearRPC", "delegate", "_isShutingDown", "reset", "unregisterCommand", "registerCommand", "sendCommand", "unregisterRPC"

### `sf` @L134814 (parent=ef, score=35)
- methods: aiEnter, aiExit, aiUpdate, inputEnter, inputExit, inputUpdate, networkEnter, networkExit, networkUpdate, onEnter, onExit, onInit, onUpdate
- strings: "value", "disable", "_networkControl", "key", "networkExit", "update", "networkUpdate", "enable", "networkEnter", "_trigger", "_move", "aiExit", "aiUpdate", "aiEnter", "inputExit"

### `wo` @L55847 (parent=Rt.ElementModel, score=35)
- methods: canAction, getActionBanTime, getActionName, getActionResult, give, handleHistoriesFetched, isActionBan, onInit, refresh, refreshBanActions, reset, startFetchHistories
- statics: countPerFetch
- strings: "发布地图", "发布文字评论", "点评", "举报", "联赛", "好友对战", "发送表情", "人品值", "需要", "级不允许", "等级低于", "天不允许", "注册时间低于", "匿名账号不允许", "游客账号不允许"

### `He` @L40010 (parent=(无), score=34)
- methods: backToArea, backToXArea, backToYArea, checkArea, checkElastic, clear, clearTimer, loop, onStageMouseUp, start, stop, tweenMove
- strings: "value", "_tween", "recover", "tweenMove", "clear", "timer", "loop", "key", "clearTimer", "data", "dragend", "event", "_parent", "target", "checkElastic"

### `ki` @L43666 (parent=mt, score=34)
- methods: idle, onAgreementButtonClicked, onCancelButtonClicked, onDisable, onEnable, onHide, onOKButtonClicked, onPrivacyButtonClicked, onScroll, onShow, playInTween, playOutTween
- strings: "请阅读上方的完整内容后点击同意", "<br/><br/>点击下方链接查看：", "value", "gray", "okButton", "_ui", "max", "vScrollBar", "list", "key", "onScroll", "handleForceReadPrivacy", "instance", "onHide", "agreePrivacyInfo"

### `Oi` @L46938 (parent=Rt.ElementStageView, score=34)
- methods: idle, onChangeButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onReportButtonClicked, onShow, playInTween, playOutTween, refreshPhoneNumber
- strings: "当前绑定：", "value", "text", "phoneNumber", "profileModel", "context", "concat", "_ui", "key", "refreshPhoneNumber", "mobileupdate", "showPopup", "popupController", "idle", "_viewState"

### `un` @L49875 (parent=f.GameLiveMissionPanelUI, score=34)
- methods: disable, enable, onClaimButtonClicked, onEntryButtonClicked, onEntryIconClicked, onMissionFetched, onMissionUpdate, onRewardClaimed, refreshCumulativeEntry, refreshEntries, refreshEntry, showUnlockTips
- strings: "达到任务要求后才能领取", "累计开播可领取奖励，每月1日重置", "完成任务可领奖，每日0点重置", "value", "refreshEntries", "key", "onRewardClaimed", "reward", "currentLevelData", "item", "showItemDetailPopup", "onEntryIconClicked", "title", "showToast", "isLive"

### `jn` @L53548 (parent=Rt.ElementStageView, score=34)
- methods: onCloseButtonClicked, onDetailButtonClicked, onDisable, onEnable, onInit, onShareButtonClicked, playBadgeInfoTween, playInTween, refresh, setUnlockData, showButton, update
- strings: "ui/pattern_yellow.png", "value", "currentLevelData", "_item", "getLevelDescription", "updateText", "description", "_ui", "currentName", "badgeName", "skin", "currentIcon", "icon", "key", "refresh"

### `Ua` @L63849 (parent=Rt.ElementStageView, score=34)
- methods: initTab, onCloseButtonClicked, onDestroy, onDisable, onEnable, onInit, onIntroButtonClicked, onTabSelected, refreshReddot, selectTab, setEnterTab, update
- strings: "每次兑换，可以额外获得20贵族经验（每日上限为1000", "说明", "/clan/ribbon.png", "value", "textintro", "showPopup", "popupController", "context", "intro", "config", "clan", "setData", "getView", "key", "onIntroButtonClicked"

### `Hs` @L74583 (parent=Rt.ElementStageView, score=34)
- methods: handleOKAction, idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, setData
- strings: "value", "onHide", "_onOK", "key", "handleOKAction", "_price", "handleNotEnoughCurrency", "context", "haveCurrency", "currencyModel", "idle", "_viewState", "onOKButtonClicked", "playOutTween", "onCloseButtonClicked"

### `dl` @L89209 (parent=(无), score=34)
- methods: consume, destroy, haveHp, isInLive, isUnlimited, recover, refresh, refreshHpState, refreshUnlimitedHpTime, startGameLive, stopGameLive, update
- strings: "value", "full", "dispatch", "onStateChanged", "normal", "max", "hp", "empty", "key", "refreshHpState", "notify", "onRecoverTimeChanged", "isFull", "onHpChanged", "_recoverTimestamp"

### `vl` @L89644 (parent=Rt.ElementStageView, score=34)
- methods: idle, initTab, onBackButtonClicked, onDisable, onEnable, onHide, onInit, onShow, onTabSelected, playInTween, playOutTween, refreshButtonGruop
- strings: "value", "playOutTween", "idle", "_viewState", "key", "onBackButtonClicked", "refreshButtonGruop", "_needResetView", "_ui", "enable", "_currentPanel", "get", "_panels", "select", "_currentSelectedTab"

### `Hl` @L94567 (parent=Rt.ElementComponent, score=34)
- methods: claimGroupReward, claimLevelReward, claimTotalReward, encodeDailyChallengeMsg, fetchDailyChallenge, fetchDailyChallengeGroup, getNextDailyChallenge, handleDailyChallengeFetchFailed, handleDailyChallengeFetched, handleGroupRewardClaimed, onInit, skipDailyChallenge
- strings: "每日夺宝通关", "请求出错", "今天已经不能再跳过了", "value", "notify", "onGroupRewardClaimed", "_dailyChallengeModel", "handleGetItems", "pack", "onComplete", "noticeReview", "dailyModel", "context", "requestReview", "id"

### `vc` @L104942 (parent=Rt.ElementModel, score=34)
- methods: addRechargeHistory, canBuyVip, getAvailableItems, getRechargeByID, getRechargeByType, getRechargeHistory, getVipRechargeHistory, haveRechargeQuota, onInit, refresh, reset, setNewbiePopupTs
- strings: "gem_event", "value", "buyCount", "set", "_rechargeHistory", "forEach", "keys", "clear", "key", "refresh", "count", "relateTo", "id", "addRechargeHistory", "getRechargeByID"

### `Lc` @L106288 (parent=Rt.ElementComponent, score=34)
- methods: fetchRoomByIDs, fetchRoomList, getRandomRoom, getRoomByID, getRoomListItem, handleRoomListFetched, handleRoomsFetched, onInit, resetFetchState, tryAddRoom, updateRoomFullState, updateRoomState
- strings: "value", "refresh", "id", "get", "_rooms", "set", "has", "key", "tryAddRoom", "_roomList", "all", "length", "getRoomListItem", "getRoomByID", "updateFullState"

### `gu` @L111629 (parent=Rt.ElementStageView, score=34)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onShow, onToggleClicked, playInTween, playOutTween, setData
- strings: "&nbsp;个 &nbsp;", "确认使用&nbsp;", "_small.png'></img>", "<img src='ui/icon_", "value", "selected", "checkbox", "_ui", "key", "onToggleClicked", "onHide", "now", "_scene", "setGemUseTs", "currencyModel"

### `xd` @L117095 (parent=Rt.ElementStageView, score=34)
- methods: close, idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onSeasonRewardClaimed, onShow, playInTween, playOutTween
- strings: "modal_title_title_got", "league_newseason_msg", "league_season_result", "league_reward_claimtip", "social_notinrank", "social_ranking", "value", "title", "getLocalizationText", "jumpToAppearanceView", "uiStackController", "context", "type", "seasonRewards", "leagueModel"

### `n_` @L127464 (parent=(无), score=34)
- methods: changeState, customShare, deleteRecord, getDefaultShareConfig, getRecordState, getVideoInfo, init, pause, recordClip, resume, start, stop
- strings: "value", "_timeRange", "key", "deleteRecord", "notify", "onStateChanged", "_state", "] to [", "**change record state from [", "warn", "stopAllTweensWithContext", "TweenMgr", "stopped", "changeState", "getRecordState"

### `Um` @L175955 (parent=Yg, score=34)
- methods: clearAirJumpEffects, create, despawnEffect, destroy, handleNetworkEvent, init, playAnim, resetAnim, spawnEffect, startEdit, startPlay, update
- strings: "game/airjump.png", "laserlight_r", "laserlight_l", "value", "visible", "height", "width", "pos", "pivot", "loadImage", "Sprite", "key", "create", "_spacejumps", "f"

### `Dk` @L187538 (parent=(无), score=34)
- methods: createBtn, createCountdownHud, createIcon, layoutButtons, refreshDelete, refreshVideoIcon, setForbidMode, setNormalMode, updateAttachIcon, updateClockwiseIcon, updateCountdown, updateRotateAndEditButton
- strings: "ui/mirrow_button_yellow.png", "ui/rotate_button_yellow.png", "ui/icon_videoAd.png", "ui/arrow_clockwise.png", "ui/icon_rotate_dir.png", "ui/icon_attach.png", "game/forbid.png", "ui/btn_copy.png", "ui/btn_edit_shadow.png", "ui/close_button.png", "btn_confirm", "ui/ok_button.png", "ui/confirm_button.png", "value", "addChild"

### `mC` @L195924 (parent=Rt.ElementStageView, score=34)
- methods: onDisable, onEnable, onInit, onLeave, onShareButtonClicked, onShareCompleted, playButtonGroupTween, playDanInfoTween, playInTween, playUnlockInfoTween, refreshEntry, refreshUnlockInfo
- strings: "分享成绩", "炫耀神级操作", "tutorial_danup", "value", "unlocked", "currentDan", "_leagueModel", "length", "maps", "components", "setComponentData", "setMapData", "features", "setFeatureData", "key"

### `Kw` @L212147 (parent=(无), score=34)
- methods: addCharacterStats, addComponentStats, addFriendStats, addLadderStats, copyFrom, getCharacterStats, getComponentStats, refresh, refreshBasicStats, refreshCharacters, refreshComponents, updateLadderStats
- strings: "value", "used", "set", "_componentStats", "_commonComponent", "forEach", "keys", "clear", "key", "refreshComponents", "_characterStats", "_commonCharacter", "refreshCharacters", "_commonEmojiID", "emojiId"

### `Ub` @L219247 (parent=Rt.ElementStageView, score=34)
- methods: idle, onClaimButtonClicked, onCloseButtonClicked, onDisable, onDouyinSidebarVisitRewardClaimed, onEnable, onGoToButtonClicked, onHide, onInit, onShow, playInTween, playOutTween
- strings: "请从「侧边栏」访问本游戏后领奖。", "/intro_douyin_sidebar.png", "value", "onHide", "key", "onDouyinSidebarVisitRewardClaimed", "title", "showToast", "fail", "success", "scene", "sidebar", "navigateToScene", "supportDouyinNavigateScene", "idle"

### `fS` @L226466 (parent=Rt.ElementStageView, score=34)
- methods: getAvaliableInvationsCount, onDestroy, onDisable, onEnable, onGetPvpInvitation, onInit, onMatchmakingSuccess, onMessageButtonClicked, onPvpInvitationChanged, openTTSchema, refreshDouyinBanner, showMessage
- strings: "邀你闯关！", "邀你组队！", "friend_pvpinvite_notification", "sslocal://microapp?app_id=ttacffda4233d51d45&launch_from=shengxiaopaid…", "value", "start", "setContext", "setDelay", "accelerate", "Ease", "setEaseType", "alpha", "messageTip", "_ui", "tweenProps"

### `sw` @L205111 (parent=Rt.Element, score=33)
- methods: clearAssetsLoader, clearStageShake, clearTouchKit, getIsOutOfCamera, onDestroy, onInit, onStart, shakeStage, showRankView, showTopBar, update
- statics: debugNetwork
- strings: "value", "onUpdate", "currentState", "_stateMachine", "key", "update", "pos", "stopAllTweensWithContext", "TweenMgr", "game", "getStage", "clearStageShake", "setContext", "shake", "create"

### `I` @L24718 (parent=(无), score=32)
- methods: adaptElements, getFinishPoint, getLevelElement, getSecondaryFinishPoint, getSecondarySpawnPoint, getSpawnPoint, importData, isGettingEndingPoint, isInfinite, refreshBounds, resetLevel
- strings: "value", "key", "adaptElements", "length", "_currentLevelElements", "isGettingEndingPoint", "level has not secondary finish point", "secondaryFinishPoints", "_currentLevelData", "getSecondaryFinishPoint", "level has no secondary spawn point", "secondarySpawnPoints", "getSecondarySpawnPoint", "_finishpoint", "getFinishPoint"

### `_t` @L28576 (parent=f.CommonButtonHorizonalUI, score=32)
- methods: onLoaded, refreshBg, refreshIcon, refreshLabel, refreshLabelColor, refreshLabelSize, updateBgSkin, updateExpandAnim, updateIcon, updateLabelColor, updateLabelContent
- strings: ".png", "ui/icon_", "_60.png", "ui/btn_", "_100.png", "value", "refreshLabel", "left", "iconLeft", "icon", "width", "height", "iconHeight", "skin", "white"

### `It` @L30214 (parent=Rt.ElementStageView, score=32)
- methods: initTab, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onTabSelected, selectTab, setEnterItem, update
- strings: "value", "hidePanel", "_currentPanel", "none", "_currentSelectedType", "_needResetView", "_ui", "enable", "_enterItemID", "_enterTabID", "setEnterItem", "get", "_panels", "select", "_currentSelectedTab"

### `ne` @L35839 (parent=(无), score=32)
- methods: changeState, clearRequestTaskState, delayHandleWatchVideoEnd, destroy, load, onVideoAdClose, onVideoAdLoad, onVideoAdLoadFailed, show, showVideoAd, startRequestTask
- strings: "视频获取失败 ", "暂不支持视频广告", "视频初始化失败", "videoad_close", "success: ", "videoad_err", "videoad_show", "value", "notify", "onWatchVideoEnd", "_model", "afterDelay", "ActionTask", "isOnIOS", "isOnToutiao"

### `Ye` @L40654 (parent=(无), score=32)
- methods: generateUUID, getUUID, getWechatAdLogMessage, log, logKeyValue, logKeyValueToPlatform, logLoginSucceess, logToPlatform, logWechatAd, logWechatLive, setUserID
- strings: "gdt_vid", "battlecraft_kuaishou", "battlecraft_toutiao", "battlecraft_bilibili", "battlecraft_qq", "login_success", "value", "toString", "floor", "random", "replace", "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", "now", "function", "undefined"

### `Ii` @L45005 (parent=Rt.ElementStageView, score=32)
- methods: idle, onCloseButtonClicked, onDeleteButtonClicked, onDisable, onEnable, onHide, onReportButtonClicked, onShow, playInTween, playOutTween, sendDeleteAccountEmail
- strings: "）的账号", "（ID：", "我想要注销 ", "派对注销账号申请", "放弃", "注销", "账号注销后，会重启游戏。点击注销按钮开始执行。", "立即注销", "确认注销，点此执行", "联系客服，注销账号", "）的账号，请注意：", "您即将注销 ", "support@codeplaygames.com", "value", "userShortId"

### `js` @L74764 (parent=Rt.ElementStageView, score=32)
- methods: initTab, onCloseButtonClicked, onDestroy, onDisable, onEnable, onInit, onTabSelected, refreshReddot, selectTab, setEnterTab, update
- strings: "value", "visible", "canClaimBankCoin", "_bankModel", "bankReddot", "_ui", "text", "concat", "lotteryReddotCount", "lotteryReddot", "onReddotChanged", "lotteryEvent", "eventModel", "context", "key"

### `lr` @L77833 (parent=Rt.ElementStageView, score=32)
- methods: idle, onAction, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, refreshCurrentReward
- strings: ".png", "number/number_green_", "pack_battlepass.png", "value", "centerX", "currentCount", "_ui", "horizonalLayout", "UIUtils", "visible", "skin", "concat", "length", "_childs", "key"

### `Ll` @L92088 (parent=(无), score=32)
- methods: computeY, despawn, disable, enable, fetchComments, handleCommentResult, initBulletData, onFetched, setBulletConfig, showBulletScreen, spawn
- strings: "value", "computeY", "push", "_rowCount", "length", "x", "timestamp", "_sceneWidth", "floor", "width", "content", "textToSpit", "CharSegment", "text", "type"

### `pc` @L104615 (parent=dc, score=32)
- methods: afterPay, beforePay, createAndroidOrder, createKuaishouOrder, createOrder, createQQOrder, getRechargeInfo, pay, payOnKuaishou, payOnQQ, payOnToutiao
- strings: "/app/create_order", "good_num", "qq/create_order", "third_party_trade_no", "zone_id", "buy_quantity", "currency_type", "kuaishou/create_order", "bytedance/create_order", "recharge/info", "weixin/afterpay", "weixin/beforepay", "value", "code", "data"

### `Nc` @L107200 (parent=Rt.ElementComponent, score=32)
- methods: getNeedEnterTutorial, isInStage, onInit, passStage, report, setCurrentStage, setUGCLevelData, startPvpTutorial, startTutorial, startUGCTutorial, tryParseLevelData
- strings: "tutorstage/set", "training_control", "value", "_tutorialLevelMsg", "_tutorialLevelData", "data", "decompressFromEncodedURIComponent", "parse", "key", "tryParseLevelData", "mode", "ugcchallenge", "game", "changeState", "create"

### `Qc` @L108169 (parent=Kc, score=32)
- methods: destroy, disable, enable, getItems, onBuy, onDailyItemsFetched, onEntryClicked, refreshEntry, refreshItems, refreshTips, update
- strings: "您已经购买", "自制地图评论时可用", "已收集", "您可以在每日夺宝中获得印花", ".png", "ui/tab_", "value", "refreshItems", "character", "getRelatedItemType", "_shopModel", "getRelatedItem", "getShopDataByID", "refreshTips", "data"

### `$u` @L114536 (parent=Rt.ElementModel, score=32)
- methods: canActionAlbum, getVipItemByID, hasInspectorSkill, hasSkill, hasVipItem, onInit, refresh, reset, showDailyChallenge, showFreeComponent, updateVipInfo
- strings: "您没有权限", "room_free", "ugc_album", "value", "notify", "onVipUpdate", "push", "_items", "refresh", "forEach", "vips", "key", "f", "e", "hasItem"

### `a_` @L127903 (parent=(无), score=32)
- methods: changeState, customShare, deleteRecord, getRecordState, getVideoInfo, init, pause, recordClip, resume, start, stop
- strings: "value", "_timeRange", "key", "deleteRecord", "notify", "onStateChanged", "_state", "] to [", "**change record state from [", "warn", "stopAllTweensWithContext", "TweenMgr", "stopped", "changeState", "getRecordState"

### `r_` @L128159 (parent=(无), score=32)
- methods: changeState, customShare, deleteRecord, getRecordState, getVideoInfo, init, pause, recordClip, resume, start, stop
- strings: "派对制造", "录屏异常中断: ", "value", "_lastRecordedVideoPath", "key", "deleteRecord", "notify", "onStateChanged", "_state", "] to [", "**change record state from [", "warn", "stopAllTweensWithContext", "TweenMgr", "stopped"

### `l_` @L128305 (parent=(无), score=32)
- methods: changeState, customShare, deleteRecord, getRecordState, getVideoInfo, init, pause, recordClip, resume, start, stop
- strings: "value", "_lastRecordedVideoID", "key", "deleteRecord", "notify", "onStateChanged", "_state", "] to [", "**change record state from [", "warn", "stopAllTweensWithContext", "TweenMgr", "stopped", "changeState", "getRecordState"

### `b_` @L130832 (parent=Rt.ElementBehaviour, score=32)
- methods: handleHorizonalInput, isLeftTriggered, isRightTriggered, onDestroy, onDisable, onEnable, onInit, onInputTypeChanged, onKeyDown, onKeyUp, update
- strings: "value", "enable", "virtualControls", "disable", "_buttonControls", "_touchControls", "button", "inputType", "key", "onInputTypeChanged", "RIGHT", "Keyboard", "_rightArrowPressed", "LEFT", "_leftArrowPressed"

### `N_` @L132677 (parent=Rt.ElementBehaviour, score=32)
- methods: fastforward, getHasNextComponentEvent, getHasNextGameEvent, getHasNextScoreEvent, getHasNextSnapshot, loadGhostData, onEnable, onInit, reset, setToFirstState, update
- strings: "value", "updateFromSnapshot", "_model", "y", "x", "pos", "_entity", "_snapshots", "length", "key", "setToFirstState", "notify", "onComplete", "_ghostPlayCompleted", "_nextGameEventIndex"

### `K_` @L133984 (parent=Rt.ElementBehaviour, score=32)
- methods: getPhysicsSound, onDisable, onEnable, onGroundTypeChanged, onInit, onMoveStateChange, onPhysicsTypeChanged, onSlidingWallChanged, playRunSound, playSlidingSound, refreshCurrentGroundSound
- strings: "components/ice", "components/mud", "characters/", "value", "ice", "mud", "key", "getPhysicsSound", "_currentSlidingSoundID", "triggerMoveSound", "context", "physicsTypeCmd", "model", "playSlidingSound", "_currentRate"

### `Wy` @L161450 (parent=(无), score=32)
- methods: clearHits, getCanAddShootPressure, getEntity, getIsProjectile, getIsTeleportable, getShootVector, getShootableRelatedLevelComponent, getTriggerPlayer, onShoot, updateComponentsAttached, updateExtendedBounds
- strings: "value", "y", "bounds", "collider", "_entity", "x", "center", "_extendedBounds", "setTo", "_shootStart", "height", "bottom", "_shootVector", "abs", "width"

### `km` @L173562 (parent=(无), score=32)
- methods: hide, onPlayerEnterTrigger, onPlayerExitTrigger, playAnim, reset, resetAnim, setHitFace, setNormalFace, setType, show, update
- strings: "leveldrum2/drumface_hit.png", "leveldrum2/drumface.png", ".png", "leveldrum2/airdrum", "leveldrum2/airdrum1.png", "value", "visible", "_animSprite", "alpha", "scale", "stopAllTweensWithTarget", "TweenMgr", "setNormalFace", "key", "resetAnim"

### `Rk` @L187852 (parent=(无), score=32)
- methods: aiTryAddEditComponentToLevel, findGround, findSpace, onPartyComponentSelected, scanSpaceFromNode, searchCellForEditComponent, selectPartyComponent, setTargetCell, simulatePickComponent, stop, updateEdit
- strings: "value", "_edit", "tryAddEditComponentToLevel", "_gameEditAI", "currentEditComponent", "_aiPlayer", "sendAddComponent", "_gameEditNetwork", "getIsOnlinePvPMode", "controller", "_game", "stopAllTweensWithContext", "TweenMgr", "canAddEditComponentToLevel", "key"

### `qk` @L189854 (parent=Rt.ElementBehaviour, score=32)
- methods: injectCheckpoint, onEnable, onInit, onLevelComponentEvent, onPlayerMoveStateChange, recordSnapshot, resetRecord, restartRecord, resumeRecord, stopRecord, update
- strings: "value", "_lastY", "_lastX", "push", "snapshots", "_ghostData", "state", "currentEffectState", "model", "_player", "currentMoveStateCmd", "_lastHoriInput", "horiInput", "length", "y"

### `wC` @L196522 (parent=f.PlayerStateEntryUI, score=32)
- methods: disable, handleRankChanged, handleScoreAdd, handleSpeakingChanged, layout, refresh, showEmoji, showScoreAddAnim, updateAvatar, updateScore, updateState
- strings: "进球{{score}}", "game_score_coin", "game_score_hazard", "game_score_reachflag", "game_score_first", "value", "start", "_playingScoreAnim", "splice", "_scoreAdded", "showScoreAddAnim", "length", "setCompletionHandler", "score", "setContext"

### `BC` @L197718 (parent=Rt.ElementStageView, score=32)
- methods: disableRankGroup, enableRankGroup, onDisable, onEnable, onInit, playInTween, showButtonGroup, showRankGruop, startCountdown, stopCountdown, update
- strings: "秒后自动跳转", "value", "disable", "singleRankGroup", "_ui", "teamRankGroup", "_isTeamMode", "key", "disableRankGroup", "context", "enable", "enableRankGroup", "ceil", "concat", "updateText"

### `ub` @L214837 (parent=(无), score=32)
- methods: addr, copyFrom, encode, getDefaultAvatarByUserID, getLimitedNickName, isBinded, refresh, refreshBasicInfo, refreshClanInfo, updateBasicInfo, updateNameAndAvatar
- strings: "神秘玩家", "玩家", "未知空间", ".jpg", "/avataritems/avatar_", "/avatar_", "tapimg.com", "hdslb.com", "qlogo.cn", "avatar://", "http://", "https://", "value", "_clanID", "id"

### `Lb` @L217639 (parent=f.MobileVerifyPopupUI, score=32)
- methods: disable, enable, hide, onMobileVerifyFailed, onReportButtonClicked, onVerifyCodeSended, refresh, show, startCooldown, update, verify
- strings: "重发验证码（", "重发验证码", " 的手机账号已被绑定", "尾号为 ", "验证码有误，请仔细查看短信后重新输入", " 的手机已绑定其他账号", " 的手机账号不存在", "未知错误 ", " 的手机发送验证码短信", "已向尾号为 ", "value", "text", "_countdown", "concat", "resendText"

### `Bb` @L217948 (parent=Rt.ElementStageView, score=32)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onReportButtonClicked, onShow, playInTween, playOutTween
- strings: "请输入6位恢复代码", "将生成的6位数字填入下方，即可同步登录", "在弹出的窗口最底部点击「<span style='color:#4A90E2'>生成账号恢复代码</span>」<br/>", "&nbsp;按钮<br/>", "请登录小游戏，点击首页左下角的&nbsp;", "如果您在小游戏平台已有账号<br/>", "<img src='ui/icon_setting_small.png'></img>", "value", "report", "showPopup", "popupController", "context", "idle", "_viewState", "key"

### `Fb` @L219130 (parent=Rt.ElementStageView, score=32)
- methods: idle, onCloseButtonClicked, onDisable, onDouyinVisitRewardClaimed, onEnable, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween
- strings: "去回访", "将于今日24:00失效，请尽快领取", "每日回访宝箱", "/tips_visit_official_account.png", "value", "onHide", "key", "onDouyinVisitRewardClaimed", "openDouyinOfficialPage", "context", "idle", "_viewState", "onOKButtonClicked", "playOutTween", "onCloseButtonClicked"

### `sS` @L225209 (parent=Rt.ElementStageView, score=32)
- methods: onDestroy, onDisable, onEnable, onEntryClicked, onInTweenComplete, onInit, onOKButtonClicked, playInTween, playTweenToMatch, pointToNextCard, update
- strings: "在后续游玩中可以解锁更多的宠物", "sounds_component", "components/component_create", "ui/pointer_yellow.png", "value", "pointToNextCard", "_currentPointCardIndex", "length", "_entries", "setCompletionHandler", "y", "p", "_pointer", "x", "startPointToAnim"

### `dS` @L226195 (parent=f.CurrencyPanelUI, score=32)
- methods: disable, enable, onCoinHudClicked, onCurrencyAnimCompleted, onCurrencyChanged, onGemHudClicked, refreshCurrency, resetCurrency, setRewardCurrency, showAnim, showCurrencyAnim
- strings: "value", "resetCurrency", "key", "onCurrencyChanged", "showBankView", "visible", "addCoinButton", "onCoinHudClicked", "show", "addButton", "onGemHudClicked", "totalGem", "currencyModel", "gem", "refreshCurrency"

### `CS` @L227523 (parent=Rt.ElementStageView, score=32)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onRewardClaimed, onShow, playInTween, playOutTween
- strings: "/qq_fav_text_1.png", "character/icon_pig.png", "value", "onHide", "key", "onRewardClaimed", "claimQQStickyReward", "userdaily", "getController", "context", "idle", "_viewState", "onOKButtonClicked", "playOutTween", "onCloseButtonClicked"

### `wS` @L227641 (parent=Rt.ElementStageView, score=32)
- methods: cancelMatchmaking, onDisable, onEnable, onEnterRoster, onInit, onInviteButtonClicked, onRosterIDCmd, onRosterPlayerJoin, onShareInviteButtonClick, onStartMatchClicked, refreshBasicInfo
- strings: "放弃组队", "加入队伍", "unicode_escape", "modal_title_default", "unicode_unescape", "value", "refreshBasicInfo", "shareTeamMatchMessage", "shareController", "context", "canForceShare", "isRosterReady", "_matchmakingModel", "rosterID", "key"

### `_m` @L172993 (parent=(无), score=31)
- methods: dropDown, getCanAttachTo, getCanShootThroughOnewayPlatform, handleNetworkEvent, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, reset, startShake, stopAnim, triggerMe
- strings: "value", "stopAllTweensWithContext", "TweenMgr", "key", "stopAnim", "start", "setContext", "y", "initialY", "_rightGrass", "entity", "tweenProps", "addTween", "_leftGrass", "x"

### `Be` @L37914 (parent=(无), score=31)
- methods: addFadeAnim, addMoveAnim, addScaleAnim, clear, playFadeOutTween, playFadeScaleInTween, playFadeSpaceYInTween, playInTween, playLoopAnim, playOutTween, playSharedYAxisInTween
- strings: "value", "start", "setContext", "run", "setCompletionHandler", "accelerate", "Ease", "setEaseType", "bottom", "_target", "tweenProps", "addTween", "alpha", "TweenFlow", "height"

### `Wi` @L47661 (parent=Rt.ElementModel, score=31)
- methods: getRankID, getVideoIDsByType, getVideoInfoByID, handleVideoIDsFetchFailed, handleVideoIDsFetched, handleVideoInfosFetched, isFetchingVideoIDs, needFetchVideoIDs, onInit, reset, startFetchVideoIDs, tryAddVideoInfo
- strings: "value", "_videoInfos", "_fetchState", "_rankID", "_timeStamp", "_ids", "key", "onInit", "reset", "refresh", "videoId", "get", "set", "has", "tryAddVideoInfo"

### `zf` @L138906 (parent=Gf, score=30)
- methods: createAnimBackgrounds, createAnimBg, createBottomBg, createBottomBgs, destroy, getAnimBgSize, getBottomBgSize, init, update, updateBottomBgBounds, updateBounds
- strings: "/cloud.png", "/bottom.png", "value", "height", "width", "ceil", "key", "getBottomBgSize", "getAnimBgSize", "size", "scaleY", "scaleX", "sizeGrid", "0,0,0,0,1", "skin"

### `jf` @L139081 (parent=Gf, score=30)
- methods: createAnimBackgrounds, createAnimBg, createBottomBg, createBottomBgs, destroy, getAnimBgSize, getBottomBgSize, init, update, updateBottomBgBounds, updateBounds
- strings: "/star.png", "/bottom.png", "value", "height", "width", "ceil", "key", "getBottomBgSize", "getAnimBgSize", "size", "scaleY", "scaleX", "sizeGrid", "0,0,0,0,1", "skin"

### `dm` @L172906 (parent=(无), score=30)
- methods: getCanAttachTo, getCanShootThroughOnewayPlatform, handleNetworkEvent, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, playAnim, stopAnim, triggerSpring, update
- statics: shrunkScale
- strings: "value", "scaleY", "_springSprite", "stopAllTweensWithContext", "TweenMgr", "key", "stopAnim", "start", "setContext", "PingPong", "LoopType", "setLoops", "shrunkScale", "tweenProps", "playAnim"

### `pt` @L28447 (parent=f.CommonButtonVerticalUI, score=30)
- methods: onLoaded, refreshBg, refreshIcon, refreshLabel, refreshLabelColor, refreshLabelSize, updateBgSkin, updateIcon, updateIconText, updateLabelContent
- strings: ".png", "ui/icon_", "_60.png", "ui/btn_", "_100.png", "value", "visible", "iconHud", "centerY", "iconCenterY", "centerX", "fontSize", "iconLabelSize", "iconLabel", "left"

### `Zt` @L35446 (parent=(无), score=30)
- methods: clear, clearCaches, downloadFile, handleFailed, handleSucceeded, makeDir, onUnzipComplete, start, startUnzip, unzipBundle
- strings: ".zip", "assetscache: unzip bundle failed ", "assetscache: start unzip bundle", "assetscache: make bundle dir failed ", "assetscache: make bundle dir ", "/cdn/characters/", "assetscache: clear caches failed ", "/cdn/sounds/", "assetscache: download file failed ", "assetscache: download file success", "assetscache: start download file: ", "/res/atlas/", "res/atlas/", "failed: ", "cdn/sounds"

### `Si` @L44643 (parent=Rt.ElementStageView, score=30)
- methods: idle, onAccountButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onOKButtonClicked, onShow, playInTween, playOutTween
- strings: "你选择的进入方式无法保证<span style='color:#F5A623'>游戏进度不丢失</span>，建议使用<span style…", "value", "onHide", "idle", "_viewState", "key", "onAccountButtonClicked", "loginWithGuest", "lobby", "getController", "none", "setNativeLoginPlatform", "profileModel", "guest", "startLogin"

### `Mi` @L45332 (parent=mt, score=30)
- methods: clearCache, clearLocalStorage, onClearCacheButtonClicked, onClearLocalStorageButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onReportButtonClicked, showReloginConfirmModal
- strings: "暂不清理", "清理", "重登陆提醒", "清理发生错误", "清理数据后，需要重新登录游戏。请谨慎操作", "清理缓存后，需要重新登录游戏。请谨慎操作", "value", "onHide", "report", "showPopup", "instance", "key", "onReportButtonClicked", "success", "confirm"

### `$i` @L48661 (parent=Zi, score=30)
- methods: claimMissionReward, claimReward, fetchCurrentGameLives, fetchMissions, fetchRankList, fetchRewardInfo, reportGameLive, startGameLive, updatePvpMission, updateUGCMission
- strings: "gamelivemission/afterugc", "gamelivemission/afterpvp", "gamelivemission/claimreward", "gamelivemission/getinfo", "gamelive/claimreward", "gamelive/claimaudiencereward", "gamelive/getinfo", "gamelive/gettop", "gamelive/livelist", "gamelive/end", "gamelive/begin", "value", "updateMissions", "_missionModel", "missionsUpdated"

### `tn` @L48868 (parent=Zi, score=30)
- methods: claimMissionReward, claimReward, fetchCurrentGameLives, fetchMissions, fetchRankList, fetchRewardInfo, reportGameLive, startGameLive, updatePvpMission, updateUGCMission
- strings: "玩家", "value", "key", "updateUGCMission", "updatePvpMission", "data", "rewards", "mission", "progress", "target", "currentLevelData", "claimed", "level", "currentLevel", "id"

### `Wo` @L57610 (parent=f.VideoPackPanelUI, score=30)
- methods: canClaim, disable, enable, onClaimed, onClicked, onLoadVideoFailed, onWatchVideoEnd, refresh, shake, update
- strings: "在对战中可以获得的珍贵的宝箱。它们会放在这里解锁。", "金币宝箱", "剩余解锁时间: ", "value", "_videoAd", "key", "onLoadVideoFailed", "id", "_currentPack", "claimVideoPack", "_packController", "onWatchVideoEnd", "start", "setContext", "rotation"

### `Ca` @L61549 (parent=Rt.ElementStageView, score=30)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onQQGroupClicked, onShow, playInTween, playOutTween, setData
- strings: " 点击复制", "积分攻略，交流QQ群：", "积分攻略？发布视频@", "value", "handleQQGroupJump", "context", "key", "onQQGroupClicked", "playOutTween", "idle", "_viewState", "onCloseButtonClicked", "id", "hidePopup", "popupController"

### `ba` @L61718 (parent=Rt.ElementStageView, score=30)
- methods: onAnimCompleted, onDisable, onEnable, onInit, onScreenButtonClicked, playInTween, playLevelInfoTween, setData, showButton, showRewardHud
- strings: "icon_exp_big.png", "value", "start", "setContext", "_viewState", "idle", "setCompletionHandler", "setDelay", "alpha", "continueButton", "_ui", "tweenProps", "visible", "key", "showButton"

### `rr` @L77701 (parent=Rt.ElementStageView, score=30)
- methods: idle, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onShow, playInTween, playOutTween, setData
- strings: "value", "battlepassbuy", "showPopup", "popupController", "context", "onHide", "idle", "_viewState", "key", "onBuyButtonClicked", "playOutTween", "onCloseButtonClicked", "id", "hidePopup", "onShow"

### `hr` @L77965 (parent=Rt.ElementComponent, score=30)
- methods: createAlbum, deleteAlbum, fetchLocalAlbums, getAlbumByID, handleAction, handleAlbumQuery, handleError, onInit, updateAlbum, updateAlbumsSort
- strings: "您没有权限", "个字符", "长度不能少于", "长度不能超过", "包含非法字符", "取消", "确认", "确定要删除合集吗？", "提醒", "value", "title", "showToast", "errMsg", "ErrAlbumNoPermission", "ErrNickNameTooShort"

### `Lh` @L99100 (parent=Rt.ElementComponent, score=30)
- methods: agree, delete, handleAction, handleError, info, invite, onStart, refreshFriendsIntimacy, reject, setting
- strings: "你和对方处于冷却期", "已发送", "才可建立关系", "亲密度满", "亲密关系已经建立", "对方的图谱位置已满", "你的图谱位置已满", "对方不是你的好友", "value", "lastOnlineTime", "status", "refreshOnlineStatus", "intimacy", "encode", "basic"

### `yd` @L116514 (parent=Rt.ElementStageView, score=30)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, playInTween, playOutTween, refreshEntry
- strings: "value", "length", "rankRewards", "currentSeasonConfig", "leagueModel", "context", "danRewards", "initDanReward", "initRankReward", "key", "refreshEntry", "playOutTween", "idle", "_viewState", "onCloseButtonClicked"

### `Ld` @L117577 (parent=(无), score=30)
- methods: computeOffset, elasticOver, init, loop, onStageMouseUp2, onTargetMouseDown, onTargetMouseWheel, startElastic, stopScroll, tweenMove
- strings: "value", "x", "isVertical", "y", "rad2Deg", "MathUtils", "atan2", "normalize", "sub", "mouseY", "stage", "mouseX", "Vector", "_lastPoint", "key"

### `ep` @L121602 (parent=(无), score=30)
- methods: destroy, exit, handleInterrupted, handleSpeakersChanged, init, isEarMuted, isMicMuted, isSupported, join, updateMuteConfig
- strings: "get", "matchID", "_roomModel", "friendlyMatchID", "_matchmakingModel", "matchmaking", "isInState", "stateMachine", "key", "currentGroupID", "value", "notify", "onDisconnect", "handleInterrupted", "openIdList"

### `p_` @L129018 (parent=Rt.ElementModel, score=30)
- methods: addDeadData, addMatchComponent, addScore, attachComponent, detachComponent, onInit, reset, setFinishPointX, setKilledDir, updateCurrentRound
- strings: "value", "notify", "onComponentAttched", "splice", "_attachedComponents", "indexOf", "key", "detachComponent", "push", "attachComponent", "_killedDir", "setKilledDir", "_finishPointX", "setFinishPointX", "onAddLevelComponent"

### `Sm` @L173818 (parent=Yg, score=30)
- methods: clearNotes, create, despawnNote, destroy, handleNetworkEvent, init, spawnNote, startEdit, startPlay, update
- strings: "pole_r", "pole_l", "value", "_taikoCollider", "key", "create", "_notes", "f", "e", "despawn", "_pool", "hide", "done", "n", "s"
