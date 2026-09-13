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

# 绑定块 5/6（152 个，已按证据分数降序）

### `Xw` @L211794 (parent=(无), score=14)
- methods: getAntiAddictionReason, getNotEnoughPlayTimeStr, refresh, reset
- strings: "value", "_enabled", "isTimeLimit", "maxOnlineHour", "onlineLimit", "forceOfflineTS", "unhealthTS", "age", "key", "refresh", "reset", "get", "enableAntiAddiction", "enabled", "underAge"

### `ec` @L102597 (parent=(无), score=13)
- methods: encode, refresh, refreshOnlineStatus
- strings: "friend_lastonline_day", "friend_lastonline_hour", "friend_lastonline_minute", "value", "_hideRelation", "hideRelation", "_intimacy", "intimacy", "lastActivedAt", "status", "refreshOnlineStatus", "refresh", "profile", "key", "lastOnlineTime"

### `ku` @L112110 (parent=f.ShopRechargeEntryUI, score=13)
- methods: initRecharge, refreshRecharge, updateBonus
- strings: "多送", "首冲多送", "value", "text", "bonusType", "concat", "bonusRate", "ceil", "100%", "count", "items", "_rechargeData", "key", "updateBonus", "id"

### `am` @L172158 (parent=(无), score=13)
- methods: init, update
- strings: ".png", "/smoke", "/spark", "value", "concat", "assetsID", "finiteLevel", "level", "loadImage", "sprite", "_smoke", "clear", "graphics", "fixedTime", "timer"

### `Kk` @L190171 (parent=Rt.ElementBehaviour, score=13)
- methods: onInit, reset, shrinkBottom, shrinkLeft
- strings: "value", "bounds", "_dynamicPlayerBounds", "move", "player", "context", "height", "_originalPlayerBounds", "stage", "max", "clone", "_dynamicCameraBounds", "regionController", "camera", "_originalCameraBounds"

### `Mh` @L99015 (parent=(无), score=13)
- methods: destroy, setItem, startTween, stopTweens
- strings: "value", "stopAllTweensWithContext", "TweenMgr", "key", "stopTweens", "sizeGrid", ",0,0", "_index", "_frameCount", "concat", "0,", "every", "ActionTask", "frameCount", "skin"

### `mf` @L135638 (parent=Rt.EntityComponent, score=13)
- methods: canFireEvent, onPlayerEnter, onPlayerExit, onPlayerStay
- strings: "value", "_ghostCollidable", "deadghost", "type", "canTriggerComponent", "model", "key", "canFireEvent", "onPlayerExitCollider", "_listener", "_isEntered", "onPlayerExit", "onPlayerStayCollider", "onPlayerStay", "onPlayerEnterCollider"

### `Ni` @L47494 (parent=Rt.ElementComponent, score=13)
- methods: fetchVideoIDS, fetchVideoInfosByIDs, onInit, reportVideoID
- strings: "value", "handleVideoInfosFetched", "_douyinVideoModel", "fetchVideoInfosByIDs", "_service", "getRankID", "length", "push", "getVideoInfoByID", "forEach", "key", "notify", "onVideoIDsFetched", "fetchVideoIDS", "startFetchVideoIDs"

### `po` @L54992 (parent=co, score=13)
- methods: broadcastClanInvite, broadcastUGCLevel, fetchBroadcastList
- strings: "汪汪汪", "测试", "战队", "value", "id", "10002", "args", "clanName", "clanID", "sender", "encode", "profile", "profileModel", "context", "_controller"

### `Pu` @L112525 (parent=Lu, score=13)
- methods: claimBankCoin, claimFreeCoin, startWork
- strings: "免费金币", "金矿", "」的金矿打工啦", "开始在「", "bank/claimfreecoin", "bank/claimbankcoin", "bank/startwork", "value", "coinInc", "data", "notify", "onFreeCoinClaimed", "_bankModel", "add", "handleUserMsg"

### `rf` @L134929 (parent=Rt.State, score=13)
- methods: onEnter, onExit, onInit, onUpdate
- strings: "value", "disable", "_move", "_input", "key", "onExit", "update", "setAlpha", "context", "onUpdate", "dead", "jump", "model", "_context", "enable"

### `gf` @L135570 (parent=Rt.EntityComponent, score=13)
- methods: onInit, onPlayerEnter, onPlayerExit
- strings: "value", "entity", "onPlayerExitTrigger", "_listener", "delete", "_entered", "has", "key", "onPlayerExit", "onPlayerEnterTrigger", "add", "componentAttachedTo", "getShouldIgnoreCheckpointRespawnEvent", "justRespawnFromCheckpoint", "model"

### `Cf` @L135732 (parent=(无), score=13)
- methods: reset, setMaxOffset, update
- strings: "value", "_currentOffsetY", "_startY", "_currentOffsetX", "_startX", "pos", "y", "_velocity", "ease", "_offsetY", "_pingpongSpeedY", "pingPong", "MathUtils", "x", "_offsetX"

### `Xv` @L150331 (parent=(无), score=13)
- methods: destroyEditView, play, setIndex, showEditView
- strings: "value", "_noteID", "soundList", "key", "setIndex", "concat", "note", "playSound", "SoundManager", "replace", "7s", "endsWith", "3s", "pickOne", "random"

### `Oc` @L106794 (parent=(无), score=13)
- methods: handleFetchFailed, handleFetched, resetFetchState, startFetch
- strings: "value", "_total", "_ids", "_fetchState", "none", "_timeStamp", "key", "resetFetchState", "now", "fetching", "startFetch", "failed", "handleFetchFailed", "succeed", "push"

### `Qg` @L171400 (parent=Yg, score=13)
- methods: init, update
- strings: ".png", "/grassh", "/grassm", "/grasss", "value", "rotation", "sineInOut", "Ease", "sprite", "_scarecrow", "pingPong", "MathUtils", "f", "e", "concat"

### `Ak` @L188112 (parent=xk, score=13)
- methods: onAddComponentFailed, onDisable, onEnable, onPartyComponentSelected
- strings: "value", "f", "e", "onPartyComponentSelected", "done", "n", "s", "_aiEdits", "key", "searchCellForEditComponent", "player", "onAddComponentFailed", "stop", "onDisable", "simulatePickComponent"

### `AS` @L229699 (parent=Rt.State, score=13)
- methods: onEnter, onExit, onInit
- strings: "value", "refreshNetworkState", "popupController", "key", "onExit", "init", "currentGame", "context", "enterGame", "_lobbySystem", "free", "initCurrentGame", "game mode needs to be passed in", "warn", "replaySpeed"

### `Da` @L63112 (parent=Ba, score=13)
- methods: addLiveHpCount, claimDouyinSidebarVisitReward, claimDouyinVisitReward, claimQQStickyReward
- strings: "value", "dailyData", "handleUserMsg", "msgController", "context", "_controller", "gameLiveHpCount", "encode", "dailyModel", "key", "addLiveHpCount", "notify", "onDouyinSidebarVisitRewardClaimed", "customServiceReward", "config"

### `Zl` @L96508 (parent=f.MatchHistoryEntryUI, score=13)
- methods: getTimestampStr, init
- strings: "history_time_day", "history_time_hour", "history_time_minute", "value", "concat", "{{time}}", "replace", "getLocalizationText", "floor", "now", "key", "getTimestampStr", "players", "init", "length"

### `Sd` @L117056 (parent=wd, score=13)
- methods: claimDoubleCoin, claimSeasonReward, defendDan, fetchLeagueInfo
- strings: "value", "key", "fetchLeagueInfo", "count", "type", "coin", "claimSeasonReward", "_leagueModel", "give", "notify", "onDoubleCoinClaimed", "addCoin", "currencyModel", "context", "_controller"

### `wb` @L216688 (parent=f.UGCLevelThumbEntryUI, score=13)
- methods: init, refresh, setDefault
- strings: "/icon_default_ugc.png", "value", "visible", "difficulty", "skin", "cdnURL", "concat", "icon", "pvpOnlyTag", "key", "setDefault", "width", "difficultyText", "max", "text"

### `Cn` @L51030 (parent=(无), score=12)
- methods: refresh, reset, resetRefreshTS
- strings: "value", "resetRefreshTS", "_claimed", "_currentLevel", "_progress", "key", "reset", "_lastRefreshTS", "now", "claimed", "level", "progress", "refresh", "get", "isBeforeToday"

### `Bc` @L106439 (parent=Pc, score=12)
- methods: fetchRoomByIDs, fetchRoomList, getRandomRoom
- strings: "没有合适的房间", "matchpvp/randjoin", "matchpvp/getroomlist", "matchpvp/getroomids", "value", "title", "showToast", "ErrNoMatchRooms", "ErrInvalidMatchRooms", "code", "data", "roomId", "post", "request", "context"

### `_g` @L167118 (parent=(无), score=12)
- methods: calculateTotalCount, getCurrrentValidCount, getIconUrl, getName
- strings: "星星", "game/score.png", "value", "key", "getIconUrl", "attachedStarCount", "matchModel", "forEach", "players", "currentGame", "getCurrrentValidCount", "f", "e", "scoreItem", "type"

### `Pg` @L169041 (parent=(无), score=12)
- methods: despawn, despawnAll, destroy, spawn
- strings: "get", "_pool", "_creator", "bind", "create", "getID", "Pool", "key", "pool", "value", "_effects", "length", "despawn", "despawnAll", "splice"

### `Kb` @L222953 (parent=(无), score=12)
- methods: createPattenrs, createPatternBackground, update
- strings: "value", "sizeGrid", "1,1,1,1,1", "x", "scale", "size", "skin", "Image", "key", "createPatternBackground", "_bg2", "addChild", "_bg1", "y", "_bgHeight"

### `gn` @L50707 (parent=f.GameLiveEntryUI, score=12)
- methods: init, setEmpty, setMore
- strings: "已开播 ", "value", "_item", "_isMore", "visible", "more", "content", "key", "setEmpty", "signed", "centerX", "moreAvatars", "profile", "refresh", "length"

### `bn` @L51201 (parent=(无), score=12)
- methods: addMission, handleFetched, startFetch
- strings: "value", "id", "set", "_missions", "key", "addMission", "refresh", "get", "forEach", "keys", "_fetchState", "succeed", "_ts", "failed", "handleFetched"

### `uo` @L54920 (parent=co, score=12)
- methods: broadcastClanInvite, broadcastUGCLevel, fetchBroadcastList
- strings: "chatroom/claninvite", "chatroom/sendugclevel", "chatroom/getugclevellist", "value", "handleBroadcastFailed", "_controller", "chatMsg", "data", "handleBroadcast", "handleUserMsg", "msgController", "context", "clanId", "post", "request"

### `ja` @L64600 (parent=f.ClanMemberEntryUI, score=12)
- methods: refresh, setItem
- strings: "Lv.", ".png", "ui/icon_", "value", "visible", "none", "blockState", "centerX", "clanName", "text", "name", "badge", "refresh", "clanBadge", "getMemberRoleStr"

### `qd` @L120379 (parent=Wt, score=12)
- methods: equipSkin, equipSkinLocal, init, reset
- strings: "value", "_currentSkin", "call", "reset", "prototype", "key", "_localSkin", "equipSkinLocal", "length", "equipSkin", "_score", "characterConfig", "character", "init", "get"

### `If` @L136032 (parent=Rt.EntityComponent, score=12)
- methods: onDisable, onEnable, reset, setSpeed, update
- strings: "value", "entity", "reset", "_autoSpin", "key", "update", "startRotation", "onDisable", "onEnable", "setSpeed", "call"

### `z` @L25520 (parent=(无), score=12)
- methods: destroy
- strings: "line_gray.png", "rect_gray_radius_8.png", "value", "view", "destroy", "key", "okIcon", "addChild", "okButton", "left", "centerY", "Image", "okText", "centerX", "height"

### `Ct` @L29729 (parent=(无), score=12)
- methods: destroy
- strings: "反馈", "修复", "账号", "TapTap 搜索「派对制造」，当面吐槽制作组", "抖音 @派对制造，当面吐槽制作组", "loading/btn_report.png", "loading/btn_fix.png", "loading/btn_account.png", "progress_bar_yellow.png", "progress_bar_bg_radius_4.png", "loading/ageTip.png", "cdn/loading/ageTip.png", "loading/logo.png", "value", "view"

### `xt` @L30160 (parent=Rt.SmartListener, score=12)
- methods: destroy, disable, enable, setEnterItem
- strings: "value", "_enterItemID", "_enterTabID", "key", "setEnterItem", "removeSmartListeners", "onDisable", "disable", "onEnable", "_needResetView", "_root", "enable", "onDestroy", "destroy", "get"

### `go` @L55667 (parent=Rt.ElementComponent, score=12)
- methods: fetchHistories, handleSyncMsg, onInit, reportPvp
- strings: "value", "reportPvp", "_service", "key", "notify", "onHistoriesFetched", "_honestyModel", "fetchHistories", "startFetchHistories", "needFetchHistories", "fetching", "historiesFetchState", "length", "refresh", "handleSyncMsg"

### `da` @L60964 (parent=f.MailEntryUI, score=12)
- methods: setItem
- strings: "加入", "申请", "同意", "value", "visible", "detailButton", "claimButton", "iconJump", "itemHud", "ugcPvpAvatars", "avatar", "defaultIcon", "clanRejected", "okButton", "clanBadge"

### `Kp` @L127072 (parent=Yp, score=12)
- methods: getIcon, getVirtualItemByID, give
- strings: ".png", "recharge/item_gem_", "recharge/item_gold_", "specialitems/", "value", "_type", "getItemByType", "currencyModel", "key", "getVirtualItemByID", "concat", "getIconUrl", "_gemIconArray", "_gemArray", "length"

### `M_` @L131126 (parent=S_, score=12)
- methods: checkOnGround, onEnter, onUpdate
- strings: "value", "nextBehavior", "context", "_behaviorStartTime", "time", "timer", "isGrounded", "_model", "key", "checkOnGround", "dispatch", "horizontalInputCmd", "updateHorizontaInputByNodeDx", "targetHoriInputTime", "_curJumpParams"

### `nm` @L172041 (parent=(无), score=12)
- methods: calculateResponseVelocity, update
- strings: "value", "scale", "sub", "_elasticity", "_glue", "sqrMagnitude", "_friction", "zero", "Vector", "dot", "normalize", "key", "calculateResponseVelocity", "rotation", "integer"

### `FC` @L201030 (parent=f.UGCCommentThumbEntryUI, score=12)
- methods: setCommentButton, setData, setEmpty
- strings: "第一个评价", "写点评", "value", "text", "commentButtonText", "fontSize", "refresh", "avatar", "visible", "textComment", "stamp", "_isCommentButton", "_isEmpty", "empty", "comment"

### `fe` @L36643 (parent=(无), score=12)
- methods: destroy, init, refreshProgress, register, unregister
- strings: "value", "open", "_gateItem", "key", "refreshProgress", "unregister", "register", "destroy", "init"

### `Di` @L46150 (parent=mt, score=12)
- methods: onCloseButtonClicked, onDisable, onEnable
- strings: "value", "report", "hidePopup", "instance", "create", "Handler", "playFadeOutTween", "_uiAnim", "key", "onCloseButtonClicked", "_popup", "destroy", "view", "removeChild", "_root"

### `Eo` @L56590 (parent=Po, score=12)
- methods: fetch, use
- strings: "value", "handleUseSucceeded", "_controller", "skin", "id", "characterID", "item", "config", "characterSkinConfig", "skinTrialCard", "type", "expire", "validMinute", "now", "count"

### `Go` @L57465 (parent=Rt.ElementComponent, score=12)
- methods: claimVideoPack, getHistory, onInit, showNoClaimQuotaToast
- strings: "今日已达上限", "value", "notify", "onGetHistory", "_packModel", "getHistory", "_service", "needFetchHistory", "key", "title", "showToast", "showNoClaimQuotaToast", "claimVideoPack", "pack", "getModel"

### `D_` @L132169 (parent=Rt.ElementBehaviour, score=12)
- methods: onEnable, onStart, onTriggerEnter, onTriggerExit
- strings: "value", "context", "onPlayerExit", "trigger", "getComponent", "entity", "key", "onTriggerExit", "onPlayerEnter", "onTriggerEnter", "onTriggerExitEvent", "_controller", "smartListen", "onTriggerEnterEvent", "onEnable"

### `Gt` @L33472 (parent=(无), score=12)
- methods: destroy, disableStarGlow, enableStarGlow
- strings: "value", "stopAllTweensWithContext", "TweenMgr", "key", "disableStarGlow", "start", "setContext", "PingPong", "LoopType", "setLoops", "scaleY", "scaleX", "tweenProps", "addTween", "_glows"

### `Fh` @L99944 (parent=f.RelationFriendEntryUI, score=12)
- methods: init, refreshIntimacy, refreshStatus
- strings: "亲密度：", "你的", "value", "text", "intimacy", "_item", "concat", "intmacy", "key", "refreshIntimacy", "name", "relationConfig", "relation", "visible", "addButton"

### `Jh` @L102164 (parent=f.FriendOnlineEntryUI, score=12)
- methods: init, refreshStatus
- strings: "Lv.", ".png", "ui/icon_", "value", "visible", "_invited", "invited", "inviteButton", "key", "refreshStatus", "centerX", "clanName", "text", "clanBadge", "refresh"

### `Dd` @L118056 (parent=Bd, score=12)
- methods: equip, getRatings, unlock
- strings: "value", "notify", "onGetRatings", "_characterSkinModel", "refreshCharacterSkinRatings", "score", "toFixed", "floating", "random", "id", "push", "forEach", "key", "getRatings", "saveLocal"

### `ef` @L134544 (parent=Rt.State, score=12)
- methods: defaultEnter, defaultExit, defaultUpdate, onInit
- strings: "value", "key", "defaultExit", "defaultUpdate", "defaultEnter", "_delegate", "onExit", "bind", "onUpdate", "onEnter", "Exit", "type", "context", "concat", "Update"

### `et` @L26580 (parent=Rt.ElementModel, score=11)
- methods: handleConnect, handleDisconnect, onInit, reset
- strings: "value", "notify", "onDisconnect", "_isConnected", "key", "handleDisconnect", "onConnect", "handleConnect", "reset", "onInit", "get", "isConnected", "onSessionInvalid", "Observable", "onLogin"

### `ya` @L61466 (parent=Rt.ElementComponent, score=11)
- methods: addVideoExp, onInit, onStart, resetBadgeRefreshTS
- strings: "value", "share", "anchor", "resetBadgeRefreshTS", "_badgeController", "ad", "adMadman", "key", "addVideoExp", "_service", "badge", "getController", "context", "onStart", "online"

### `Ds` @L73461 (parent=f.RankRushEventRankEntryUI, score=11)
- methods: setItem
- strings: ".png", "ui/icon_", "/badge_s_", "value", "skin", "genderStr", "profile", "concat", "gender", "visible", "rank", "_item", "other", "third", "second"

### `m_` @L130007 (parent=(无), score=11)
- methods: calculateJumpFactors, getACParams
- strings: "value", "wallJumpWidth", "_airHorizontalForce", "_wallJumpStartHorizontalSpeed", "_wallJumpStartVerticalSpeed", "_gravity", "wallJumpHeight", "sqrt", "_jumpStartVerticalSpeedFromMud", "gravity", "jumpheightFromMud", "jumpheight", "_jumpStartVerticalSpeed", "horiSpeed", "jumpwidth"

### `Gf` @L138767 (parent=(无), score=11)
- methods: destroy, init, setAlpha, update, updateBounds
- strings: "value", "key", "updateBounds", "setAlpha", "destroy", "update", "init"

### `Jg` @L171498 (parent=Rt.EntityComponent, score=11)
- methods: checkIsOnGroundedIce, onAddedToEntity, onPlayerEnterTrigger, onPlayerExitTrigger
- strings: "value", "exitIce", "model", "key", "onPlayerExitTrigger", "enterIce", "onPlayerEnterTrigger", "checkIsOnGroundedIce", "playerTriggerable", "addComponent", "entity", "trigger", "removeComponent", "onAddedToEntity", "id"

### `Qw` @L212363 (parent=(无), score=11)
- methods: add, copyFrom, refresh
- strings: "value", "Win", "Finish", "Total", "key", "add", "ReachFlagCount", "reachFlagCount", "ZeroScoreCount", "zeroScoreCount", "RoundCount", "roundCount", "HazardCount", "hazardCount", "FirstRankCount"

### `fn` @L50346 (parent=f.GameLiveShopEntryUI, score=11)
- methods: refresh, setItem
- strings: "无限购", "日内限购", "value", "alpha", "buyButtonBg", "price", "_item", "haveCurrency", "currencyModel", "text", "limitedProgress", "limited", "count", "limit", "concat"

### `Ia` @L62241 (parent=f.DecalEntryUI, score=11)
- methods: setEmpty, setItem, setSelected
- strings: "value", "visible", "selected", "key", "setSelected", "empty", "decal", "_isEmpty", "_item", "setEmpty", "id", "countHud", "width", "count", "max"

### `wl` @L90815 (parent=f.UGCStampEntryUI, score=11)
- methods: setEmpty, setItem, setSelected
- strings: "value", "visible", "selected", "key", "setSelected", "empty", "stamp", "_isEmpty", "_item", "setEmpty", "id", "width", "count", "max", "countHud"

### `xc` @L106177 (parent=Rt.ElementComponent, score=11)
- methods: give, info, onStart, refreshGifts
- strings: "value", "give", "_service", "key", "notify", "onSync", "_giftModel", "info", "needSync", "refreshGifts", "gift", "getModel", "context", "online", "onStart"

### `Wd` @L120301 (parent=f.CharacterUnlockEntryUI, score=11)
- methods: destroy, setItem
- strings: "级</span>&nbsp;|&nbsp;", "<span style='color:", "value", "visible", "number", "top", "description", "height", "text", "id", "type", "getItemDes", "innerHTML", "concat", "'>"

### `W_` @L133436 (parent=(无), score=11)
- methods: start, stop
- strings: ".png", "game/bone", "value", "visible", "_skeleton", "removeSelf", "stopAllTweensWithContext", "TweenMgr", "key", "stop", "_index", "concat", "loadImage", "_boneAnim", "clear"

### `wg` @L168544 (parent=(无), score=11)
- methods: getKey, nodeAtPosition, resetNodes
- strings: "value", "concat", "key", "getKey", "set", "_nodeDict", "get", "length", "nodeAtPosition", "spatialHash", "_level", "updateLandableInLevel", "updateThrouableInLevel", "setParent", "setIsOnOpenList"

### `pb` @L215259 (parent=Rt.SmartListener, score=11)
- methods: destroy, disable, enable
- strings: "get", "_localDetailInfo", "_isLocal", "key", "other", "_currentDetailInfo", "_id", "getInfo", "userDetailController", "context", "self", "value", "removeSmartListeners", "onDisable", "disable"

### `Qb` @L223035 (parent=(无), score=11)
- methods: setMessage, setTip
- strings: "ui/dialog_red.png", "value", "height", "width", "pivot", "visible", "_messageHud", "_txt", "_bg", "skin", "refresh", "length", "key", "setMessage", "clear"

### `yi` @L43319 (parent=Rt.ElementStageView, score=11)
- statics: content
- strings: "取消", "退出", "如果您不同意《用户协议》和《隐私政策》，将无法使用我们的游戏服务，请问要现在退出游戏吗？", "提示", "请阅读上方的完整内容后点击同意", "用户协议", "隐私政策", "<br/><br/>点击查看：", "请审慎阅读并确认同意《用户协议》和《隐私政策》，方可使用我们的服务。", "欢迎来到派对制造，请审慎阅读并确认同意《用户协议》和《隐私政策》，方可使用我们的服务。如您拒绝，将无法进入游戏。", "<br/><br/>点击下方链接查看：", "value", "privacy", "showPopup", "popupController"

### `Hi` @L47553 (parent=Gi, score=11)
- methods: fetchVideoIDS, fetchVideoInfosByIDs, reportVideoID
- strings: "toutiao/getvideorank_item", "toutiao/getvideorank_id", "toutiao/newvideo", "value", "handleVideoInfosFetched", "_model", "length", "videoItems", "data", "post", "request", "context", "_controller", "rankId", "videoIds"

### `Gh` @L100588 (parent=f.FriendSearchEntryUI, score=11)
- methods: init, refreshStatus
- strings: "friend_applied", "friend_added", ".png", "ui/icon_", "value", "text", "getLocalizationText", "status", "visible", "addButton", "_applied", "key", "refreshStatus", "fontSize", "addr"

### `cu` @L110092 (parent=(无), score=11)
- methods: handleFetchFailed, refresh, startFetch
- strings: "value", "_fetchState", "succeed", "_claimedCount", "claimedCount", "_claimTS", "ts", "_refreshTS", "now", "key", "refresh", "failed", "handleFetchFailed", "fetching", "startFetch"

### `Cu` @L112181 (parent=f.ShopRechargeEventEntryUI, score=11)
- methods: initRecharge, refresh
- strings: "value", "visible", "limitCount", "_rechargeData", "hasBuy", "priceHud", "key", "refresh", "#EC1436", "drawLine", "graphics", "discountLine", "height", "originalPrice", "width"

### `Bu` @L112606 (parent=Lu, score=11)
- methods: claimBankCoin, claimFreeCoin, startWork
- strings: "value", "freeCoinCount", "config", "notify", "onFreeCoinClaimed", "_bankModel", "addCoin", "currencyModel", "context", "_controller", "freeCoinTS", "now", "refresh", "key", "claimFreeCoin"

### `Ku` @L114426 (parent=Rt.ElementComponent, score=11)
- methods: handleOnShow, info, onDestroy, onInit
- strings: "value", "info", "key", "handleOnShow", "_service", "needRefresh", "vipModel", "context", "removeListener", "lifeCycleController", "onDestroy", "addListener", "online", "onInit", "apply"

### `Kf` @L139861 (parent=Df[=LevelComponentBase], score=11)
- statics: startAreaID
- strings: "map_goal_area", "map_start_area", "game/goalplatform.png", "game/startplatform.png", "value", "addComponentToLevel", "node", "mainCamera", "addToStage", "snapComponentToGrid", "createFromLevelElement", "position", "getSpawnPoint", "finiteLevel", "id"

### `ry` @L152945 (parent=(无), score=11)
- methods: hide, setParent, show
- statics: gizmoColor
- strings: "value", "removeSelf", "sprite", "key", "hide", "gizmoColor", "y", "x", "drawLine", "graphics", "clear", "setParent", "show", "addChild", "parent"

### `om` @L172110 (parent=(无), score=11)
- methods: update, updatePath
- strings: ".png", "/eagle", "value", "initialY", "_eagle", "integer", "random", "x", "entity", "setEndPoint", "_levelPath", "y", "setStartPoint", "right", "viewBounds"

### `Yk` @L189996 (parent=Rt.ElementComponent, score=11)
- statics: _dropInTimeBeforeGameCreated
- strings: "toast_syncgame_progress", "value", "_dropInTimeBeforeGameCreated", "key", "startDropInBeforeGameCreated", "get", "_matchRoom", "matchroom", "getController", "matchRoom", "bind", "execNextRPC", "afterDelay", "ActionTask", "length"

### `Qk` @L190266 (parent=Rt.ElementComponent, score=11)
- statics: _currentVolumeRate
- strings: "sounds_component", "components/", "set", "_currentVolumeRate", "get", "key", "currentVolumeRate", "value", "clear", "_matchChannels", "destroy", "forEach", "stopMatchSounds", "_playerChannels", "stopPlayerSounds"

### `mt` @L29686 (parent=(无), score=11)
- methods: disable, enable, onDisable, onEnable
- strings: "value", "key", "onDisable", "onEnable", "removeSelf", "_root", "displayedInStage", "disable", "addChild", "_stage", "enable", "get", "root", "Sprite"

### `xe` @L37328 (parent=(无), score=11)
- methods: destroy, getEventDispatcher, getOriginalScale
- strings: "value", "_originalScale", "scaleX", "centerY", "top", "bottom", "height", "centerX", "left", "right", "width", "computeNodeSize", "UIUtils", "key", "getOriginalScale"

### `zo` @L57509 (parent=Ho, score=11)
- methods: claimVideoPack, getHistory
- strings: "视频宝箱", "packdrop/gethistory", "videopack/claimreward", "value", "handleHistoryFetchResult", "_model", "packDropHistories", "data", "count", "start", "post", "request", "context", "_controller", "key"

### `wa` @L61665 (parent=f.ExpIntroEntryUI, score=11)
- methods: init, setExpInfo
- strings: "积累方法：观看视频，邀请好友", "贵族", "积累方法：联赛获胜", "对战", "积累方法：地图通关", "操作", "积累方法：设计地图、地图被赞…", "创造", "积累方法：每天登录、打联赛、挑战地图…", "活跃", ".png", "ui/bg_levelscore_", "value", "text", "expType"

### `fd` @L116416 (parent=(无), score=11)
- methods: getDanName, refresh
- strings: "value", "canClaim", "_unlocked", "_reward", "dan", "_config", "key", "refresh", "getdanName", "getDanName", "set", "get", "unlocked", "_features", "features"

### `Af` @L137895 (parent=(无), score=11)
- methods: despawn, destroyAll, spawn
- strings: "value", "clear", "_recycled", "f", "e", "destroy", "done", "n", "s", "entities", "get", "keys", "key", "destroyAll", "push"

### `yb` @L216114 (parent=f.StatsBarUI, score=11)
- methods: init, refresh, updateBarHeight
- strings: ".png", "ui/icon_stats_", "value", "bottom", "scaleY", "otherBar", "height", "other", "selfBar", "self", "max", "text", "floor", "concat", "key"

### `Ks` @L75594 (parent=f.BattlePassEntryUI, score=11)
- methods: refreshLevels, refreshMaxReward, refreshTitle
- strings: "/battlepass/icon_pass.png", "/battlepass/icon_free.png", "value", "refresh", "maxRewardEntry", "visible", "levelGroup", "titleEntry", "key", "refreshMaxReward", "top", "_childs", "height", "refreshLevels", "skin"

### `su` @L109524 (parent=f.ShopPackEntryUI, score=11)
- methods: init, refresh
- strings: "或更高品质", ".png", "ui/icon_", "value", "visible", "hasBuy", "currencyHud", "_data", "key", "refresh", "text", "count", "price", "concat", "skin"

### `L_` @L131174 (parent=S_, score=11)
- methods: checkOnGround, onEnter, onUpdate
- strings: "value", "nextBehavior", "context", "_behaviorStartTime", "time", "timer", "setJumpInput", "_model", "isGrounded", "key", "checkOnGround", "fallingTime", "updateHorizontaInputByNodeDx", "wallcling", "currentMoveStateCmd"

### `Sf` @L135946 (parent=Rt.EntityComponent, score=11)
- methods: onAddedToEntity, onDisable, onEnable, update
- strings: "value", "entity", "update", "_mover", "key", "onDisable", "onEnable", "onAddedToEntity", "get", "lastMotion", "id", "repeatmove", "call"

### `Tl` @L92037 (parent=f.UGCCommentResultPanelUI, score=10)
- methods: enable, refresh
- strings: "点了个评", "戳了个章", "发布前，您的评价将使用官方内容安全接口进行自动检查", "我的点评", ".png", "ui/icon_", "value", "text", "textComment", "concat", "nickName", "skin", "stamp", "getIcon", "getLimitedNickName"

### `pg` @L167081 (parent=(无), score=10)
- methods: calculateTotalCount, getCurrrentValidCount, getIconUrl, getName
- strings: "灯笼", "game/pumpkin2_lantern.png", "value", "key", "getIconUrl", "enlightedLanternCount", "lantern", "updateEnlightedCount", "getCurrrentValidCount", "calculatePumpkinCount", "calculateTotalCount", "getName"

### `pn` @L50135 (parent=f.GameLiveComulativeMissionEntryUI, score=10)
- methods: refresh, setItem
- strings: "天开播", "累计", "value", "visible", "claimed", "_item", "canClaim", "uncompleted", "claimButton", "text", "target", "currentLevelData", "concat", "progress", "min"

### `Fa` @L63795 (parent=Rt.SmartListener, score=10)
- methods: destroy, disable, enable
- strings: "value", "removeSmartListeners", "onDisable", "key", "disable", "onEnable", "_item", "_isTweening", "_needResetView", "_root", "enable", "onDestroy", "destroy", "get", "isTweening"

### `Kh` @L101691 (parent=f.FriendApplicationEntryUI, score=10)
- methods: init, setEmptyState
- strings: "ui/btn_invite_normal.png", "ui-loc/btn_invite.png", ".png", "ui/icon_", "value", "_isEmpty", "visible", "empty", "content", "skin", "isOnWechat", "inviteButtonImage", "key", "setEmptyState", "text"

### `dg` @L167047 (parent=(无), score=10)
- methods: calculateTotalCount, getCurrrentValidCount, getIconUrl, getName
- strings: "南瓜灯", "game/pumpkin2.png", "value", "key", "getIconUrl", "enlightedCount", "updateEnlightedCount", "getCurrrentValidCount", "calculatePumpkinCount", "calculateTotalCount", "getName"

### `fg` @L167169 (parent=(无), score=10)
- methods: calculateTotalCount, getCurrrentValidCount, getIconUrl, getName
- strings: "宝石", "game/gem.png", "value", "key", "getIconUrl", "pickedCount", "updatePickedCount", "getCurrrentValidCount", "calculateGemCount", "calculateTotalCount", "getName"

### `U` @L24909 (parent=(无), score=10)
- strings: ".png", "value", "_instance", "key", "getInstance", "visible", "modal", "isShown", "_mask", "mouseEnabled", "actionSheet", "_normalStage", "loading", "_needShowToastMask", "_toastStage"

### `gt` @L28921 (parent=(无), score=10)
- strings: "<span style='color:#FFCA00'>《用户协议》</span>", "<span style='color:#FFCA00'>《隐私政策》</span>", "我已详细阅读并同意", "适龄提示", " 游戏ID ", "泥巴和地刺的边缘都可以站立", "今天就要上王者", "如果长期无进度，请点击右上角重启游戏", "加载游戏资源", "加载玩家信息", "加载资源配置", "加载游戏配置", "加载版本信息", ".png", "cdn/loading/loading_"

### `Yt` @L34584 (parent=(无), score=10)
- strings: "检测到您的游戏缓存已满，即将开始自动清理优化。完成后会自动进入游戏。", "小提示", "正在清理...", "assetscache: laya cache size ", "assetscache: read cache dir failed ", "assetscache: all files in dir: ", "assetscache: start delete dir files ", "/data/", "/res/atlas", "/ui-json/", "assetscache: delete cache dir failed ", "assetscache: read catch dir files failed ", "assetscache: remove cache dir failed ", "assetscache: remove catch dir success", "assetscache: start remove cache dir "

### `Le` @L37744 (parent=(无), score=10)
- strings: ".png", "ui/icon_", "value", "push", "floor", "min", "key", "getAnimData", "_steps", "PI", "sin", "_circleYs", "cos", "_circleXs", "initCircles"

### `Ke` @L41123 (parent=Rt.ElementStageView, score=10)
- strings: "btn_confirm_gotit", "btn_cancel_default", "value", "alert", "showPopup", "popupController", "setData", "key", "show", "onHide", "fail", "_data", "idle", "_viewState", "onCancelButtonClicked"

### `zi` @L47621 (parent=Gi, score=10)
- methods: fetchVideoIDS, fetchVideoInfosByIDs, reportVideoID
- strings: "玩家", "/icon_default_ugc.png", "value", "handleVideoInfosFetched", "_model", "diggCount", "coverUrl", "cdnURL", "concat", "nickName", "videoId", "push", "length", "key", "fetchVideoInfosByIDs"

### `en` @L48979 (parent=Rt.ElementModel, score=10)
- strings: "分钟", "小时", "value", "concat", "00", "max", "floor", "key", "formatDuration", "set", "_selfScore", "setSelfScore", "_selfRank", "setSelfRank", "_missionModel"

### `ko` @L55717 (parent=mo, score=10)
- methods: fetchHistories, reportPvp
- strings: "今日举报次数已达上限", "honesty/reportpvp", "honesty/getlogs", "value", "title", "showToast", "data", "handleUserMsg", "msgController", "context", "_controller", "ErrReportMax", "code", "notify", "onPvpReported"

### `Yo` @L58008 (parent=Rt.ElementStageView, score=10)
- strings: "奖励已领取", "purchase_success", "_open.png", ".png", "ui/pattern_yellow.png", "value", "packreward", "showPopup", "popupController", "setData", "getView", "packmultireward", "length", "key", "showPackRewardView"

### `os` @L67671 (parent=Rt.ElementStageView, score=10)
- strings: "/clan/ribbon.png", "ui/pattern_blue.png", "value", "clandetail", "showPopup", "popupController", "id", "setData", "getView", "clanEnable", "config", "key", "show", "hidePopup", "context"

### `ds` @L69895 (parent=Rt.ElementModel, score=10)
- strings: "副队长", "队长", "成员", "不允许加入", "需审批", "自由加入", "你可以申请，审核通过后加入", "你已申请加入该战队", "你可以自由加入", "该战队不允许加入", "该战队人数已满", "你刚退出战队，不可加入", "你已有战队，不可加入", "你已加入该战队", "value"

### `_s` @L70582 (parent=(无), score=10)
- strings: "个字符", "长度不能少于", "长度不能超过", "只可以使用数字、字母、下划线或它们的组合", "不能以tid_开头", "战队号", "发送的文字", "战队介绍", "公告", "战队名称", "战队，我们的口号是：「", "欢迎来到", ".png", "/clan/badge", "value"

### `_r` @L78358 (parent=(无), score=10)
- strings: "个字符", "长度不能少于", "长度不能超过", "简介", "标题", "这个作者很懒，什么都没写", "/icon_default_ugc.png", ".png", "value", "title", "showToast", "concat", "checkTextScope", "UIUtils", "getTextTypeName"

### `mr` @L78873 (parent=Rt.ElementStageView, score=10)
- strings: "请输入合集标题", "修改", "确认创建", "创建确认", "创建", "保存", "创建合集", "合集信息", "value", "albumcreate", "showPopup", "popupController", "setData", "getView", "key"

### `kr` @L79172 (parent=Rt.ElementStageView, score=10)
- strings: "您没有权限", "个合集", "最多可创建", "已保存", "合集", "合集管理", "value", "albumlist", "showPopup", "popupController", "userID", "profile", "profileModel", "setData", "getView"

### `wr` @L79648 (parent=Rt.ElementStageView, score=10)
- strings: "信息已保存", "个关卡", " 热度 更新至第", "取消", "确定", "还未保存合集，是否退出？", "提醒", "ui/pattern_rabbit.png", "value", "canEdit", "id", "item", "show", "albumdetail", "getView"

### `br` @L80451 (parent=Rt.ElementStageView, score=10)
- strings: "·更新至第", "ui/rect_radius8_202339.png", "ui/rect_radius8_333333.png", "value", "albumlevellist", "showPopup", "popupController", "setData", "id", "tryAddAlbum", "getAlbumByID", "ugcalbum", "getModel", "getView", "key"

### `Xr` @L85001 (parent=(无), score=10)
- strings: " · ", "日发布", "ugc_toast_loaderror", "ugc_draft", "/icon_default_ugc.png", ".png", "ui/rect_radius4_purple.png", "ui/rect_radius4_red.png", "ui/rect_radius4_blue.png", "ui/rect_radius4_cyan.png", "<0.1%", "ugc_time_day", "ugc_time_hour", "ugc_time_minute", "ugc_uploadtime_day"

### `Qh` @L101741 (parent=Rt.ElementStageView, score=10)
- strings: "消息已发送", "登录后才能邀请好友", "分享邀请", "暂时没有好友，快去添加吧~", "邀请好友", "分享招募", "招募好友", "不凑巧，大家都不在", "在线好友", "friend_toast_invitefailed", "value", "onlinefriend", "showPopup", "popupController", "setData"

### `jc` @L107641 (parent=Rt.ElementStageView, score=10)
- strings: "点击屏幕继续", " 秒", "倒计时 ", "最佳操作姿势", ".png", "/tutorial/tutorial_", "value", "_onClick", "showPhoneFingerAnim", "id", "showPopup", "popupController", "tutorialpopup", "getView", "length"

### `Xc` @L107910 (parent=Rt.ElementStageView, score=10)
- strings: "modal_title_buy_succeeded", "value", "shopitembuy", "showPopup", "popupController", "setShopData", "getView", "battlepass", "battlepassbuy", "pack", "showPackBuyPopup", "item", "getItemType", "key", "showBuyPopup"

### `mu` @L111755 (parent=Rt.ElementStageView, score=10)
- strings: "每日限购", "冷却中", "钻石（还差", "余额：", "当前钻石不足", "钻石", "钻石商店", "充值", "立即充值", "value", "recharge", "showPopup", "popupController", "gemNeed", "getView"

### `qu` @L113903 (parent=Rt.ElementModel, score=10)
- strings: "value", "toString", "99999+", "key", "getRankText", "set", "get", "_selfScore", "has", "setSelfScore", "_selfRank", "setSelfRank", "_timeStamp", "setTimestamp", "notify"

### `Fd` @L118399 (parent=Rt.ElementStageView, score=10)
- strings: "开始试用", "次机会", "今日剩余", "皮肤的机会", "恭喜！您获得一次<span style='color:#6B401A'>免费</span>使用", "ui/pattern_yellow.png", "value", "skintrial", "showPopup", "popupController", "setData", "getView", "length", "key", "show"

### `Ud` @L118731 (parent=Rt.ElementStageView, score=10)
- strings: " 元", "原价 ", "ui/pattern_yellow.png", "value", "skinpackbuy", "showPopup", "popupController", "setData", "getView", "length", "key", "show", "clear", "_animIndex", "_moveStateIndex"

### `jd` @L119961 (parent=Rt.ElementStageView, score=10)
- strings: "继续游戏", "已为您自动切换为新", "恭喜解锁新", "试用", "_open.png", ".png", "ui/pattern_yellow.png", "value", "characterunlock", "showPopup", "popupController", "setData", "getView", "key", "show"

### `$d` @L121241 (parent=Rt.ElementComponent, score=10)
- strings: "开启", "关闭", "语音通话授权失败", "连麦中...", "voi_settings", "scope.record", "value", "isEarMuted", "true", "isMicMuted", "getStorageSync", "key", "getLocalSettings", "exit", "handleInterrupted"

### `pp` @L123760 (parent=Rt.ElementComponent, score=10)
- strings: "请求过于频繁", "application/json", "ugclevel/actionmark", "ugclevel/addmark", "ugclevel/delmark", "value", "json", "method", "data", "stringify", "Content-Type", "header", "url", "send", "concat"

### `i_` @L127259 (parent=Rt.ElementComponent, score=10)
- strings: "get", "supportReocrdOnKuaishou", "recordOnNativeEnabled", "supportReocrdOnBilibili", "supportReocrdOnWechat", "recordOnToutiaoEnabled", "key", "minDuration", "value", "notify", "onStateChanged", "_recordDuration", "_recordStartTime", "realTimeSinceStartUp", "timer"

### `Uf` @L138273 (parent=Df[=LevelComponentBase], score=10)
- strings: ".png", "value", "zOrder", "scene", "background", "foreground", "key", "setSceneObjectZOrder", "parallaxSpeed", "parallax", "y", "offset", "_initialY", "x", "_initialX"

### `Vf` @L138472 (parent=Df[=LevelComponentBase], score=10)
- strings: "加载主题失败，请检查网络", "加载背景失败，请检查网络", "/sounds/bgms", "/ugctheme", "ugctheme/", ".png", ".atlas", "unpack.json", "get", "cdnURL", "concat", "key", "soundBaseURL", "themeBaseURL", "value"

### `qf` @L139561 (parent=Df[=LevelComponentBase], score=10)
- strings: ".png", "value", "isTrigger", "collider", "up", "dir", "oneWayPlatform", "physicsLayer", "entity", "landmine", "type", "key", "getCanAttachTo", "onPlayerExitTrigger", "localPlayerKillByComponent"

### `Qf` @L140090 (parent=Kf, score=10)
- strings: "2.png", "game/flag", "1.png", ".png", "value", "addComponentToLevel", "node", "mainCamera", "addToStage", "snapComponentToGrid", "createFromLevelElement", "position", "getFinishPoint", "finiteLevel", "id"

### `lv` @L142000 (parent=Df[=LevelComponentBase], score=10)
- strings: "game/blueplatform3x1.png", "game/yellowplatform.png", "value", "localHingeY", "localHingeX", "localPlatformY", "localPlatformX", "cellVisualSize", "offsetY", "offsetX", "height", "width", "platformImage", "key", "createBluePlatform"

### `ny` @L152211 (parent=(无), score=10)
- strings: ".png", "game/sign", "game/signbase_", "game/signbase_gray.png", "game/gears.png", "game/sign1.png", "game/signbase.png", "value", "has", "count", "colorTypeToIndex", "f", "e", "add", "getTypeIndex"

### `ay` @L152376 (parent=Df[=LevelComponentBase], score=10)
- strings: "game/platform1x1.png", "switchbutton.png", "game/", "value", "length", "f", "e", "push", "_connectedSwitchables", "isDestroyed", "done", "n", "s", "components", "level"

### `Sy` @L157050 (parent=(无), score=10)
- strings: ".png", "game/sp_", "value", "_editIcons", "f", "e", "destroy", "removeSelf", "done", "n", "s", "key", "destroyIcons", "getDotColorURL", "loadImage"

### `Vy` @L159891 (parent=(无), score=10)
- strings: "game/pathLine.png", "game/pathNodeEnd.png", "get", "_linePool", "createLineSprite", "linePool", "Pool", "key", "_nodePool", "createNodeSprite", "nodePool", "value", "height", "width", "pivot"

### `bg` @L168609 (parent=(无), score=10)
- strings: "ERROR: Path could not be created. ", "Path created. ", "ERROR: Path could not be created. Start and/or Goal position is not wa…", "value", "_sprite", "addChild", "f", "e", "#ff0000", "cellVisualSize", "y", "x", "drawCircle", "graphics", "done"

### `Rg` @L169565 (parent=(无), score=10)
- strings: "value", "update", "_editView", "key", "updateEditView", "show", "showEditView", "hide", "hideEditView", "destroyEditView", "completeEditMore", "editTouch", "getController", "dataList", "_data"

### `zg` @L170359 (parent=(无), score=10)
- strings: "对话内容会经过审核 60字以内", "对话内容", "没有多余碎片", "value", "show", "_editView", "key", "showEditView", "destroy", "destroyEditView", "visible", "content", "_data", "emptyPanel", "_ui"

### `Wg` @L170757 (parent=Rt.ElementStageView, score=10)
- strings: "（已拥有", "不足，本地图将无法发布，请尽快集齐以下", "您的", "继续上传", "知道了", "重要提醒", "不足", "value", "npcalert", "showPopup", "popupController", "setData", "getView", "key", "show"

### `Fm` @L175736 (parent=(无), score=10)
- strings: "levelouterspace/laser.png", "value", "setShouldColliderScaleAndRotateWithTransform", "collider", "entity", "BoxCollider", "laserbullet", "Entity", "zOrder", "projectile", "height", "width", "pivot", "loadImage", "Sprite"

### `Ym` @L177243 (parent=Rt.Element, score=10)
- strings: "作者：", "地图：", ".png", "unpack.json", "value", "OldSkyComponentID", "componentID", "key", "isLevelSkinComponentID", "indexOf", "SystemLevelComponentIDs", "isSystemComponentID", "replace", "push", "concat"

### `Mk` @L186136 (parent=(无), score=10)
- methods: getUndoComponent, undo
- strings: "value", "addComponentToLevel", "level", "context", "onUndo", "extension", "_originalElement", "setElementExtension", "_isExtensionChanged", "connectComponent", "connectedTo", "getIndexToComponent", "_isConnectedChanged", "base", "y"

### `Iw` @L207393 (parent=Rt.ElementModel, score=10)
- strings: "unicode_unescape", "value", "key", "getCombinedPvpMode", "notify", "onFrinedlyMatchPlayerLeave", "splice", "_friendlyMatchPlayers", "indexOf", "removeFriendlyMatchPlayer", "onFrinedlyMatchPlayerJoin", "push", "addFriendlyMatchPlayer", "onFrinedlyMatchPlayerUpdate", "updateFriendlyMatchPlayer"

### `_b` @L215328 (parent=Rt.ElementStageView, score=10)
- strings: "无法获取个人主页信息", "复制成功", "修改资料", "user_id", "ui/pattern_blue.png", "value", "_previousData", "key", "clearPreviousData", "userdetailpopup", "showPopup", "popupController", "enterType", "setEnterTabType", "userDetailPopup"

### `xb` @L217173 (parent=f.RelationSlotEntryUI, score=10)
- methods: initEntry, refresh
- strings: "神秘人", "value", "visible", "content", "empty", "key", "initEntry", "right", "width", "intimacy", "iconIntimacy", "text", "concat", "title", "profile"

### `Ob` @L218986 (parent=Rt.ElementStageView, score=10)
- strings: "value", "commonalert", "addToBeShown", "popupController", "setData", "getView", "key", "showPopup", "show", "playOutTween", "_onOK", "idle", "_viewState", "onOKButtonClicked", "onCloseButtonClicked"

### `GS` @L230505 (parent=Rt.Element, score=10)
- strings: "知道了", "失败", "重试", "失败，请点击重试", "登录游戏服", "登录", "资源配置加载", "游戏配置加载", "游戏资源加载", "好的", "提示", "有新版本啦，请点击右上角重启游戏", "退出游戏", "重新加载", "另一台设备正在连接到这个游戏账号"

### `zs` @L74712 (parent=Rt.SmartListener, score=10)
- methods: destroy, disable, enable
- strings: "value", "removeSmartListeners", "onDisable", "key", "disable", "onEnable", "_isTweening", "_needResetView", "_root", "enable", "onDestroy", "destroy", "get", "isTweening", "_type"

### `Ev` @L147773 (parent=(无), score=10)
- methods: onPlayerEnterTrigger, onPlayerExitTrigger
- strings: "value", "key", "onPlayerExitTrigger", "_levelComponentEntity", "onPlayerEnterTrigger", "_triggerListener", "y", "lastHitNormal", "model", "bounds", "_levelComponent", "lastHitColliderPoint", "right", "x", "velocity"

### `jg` @L170703 (parent=f.LevelNPCMoreEditEntryUI, score=10)
- methods: init, reset
- strings: "无限", "无多余碎片", "当前", "value", "skin", "icon", "key", "reset", "visible", "config", "gainByDebirs", "character", "type", "lockMask", "color"

### `W` @L25679 (parent=(无), score=10)
- methods: destroy
- strings: "loadingring.png", "rect_black_radius_8.png", "value", "view", "destroy", "key", "icon", "addChild", "panel", "rotation", "anchorX", "anchorY", "centerX", "centerY", "skin"
