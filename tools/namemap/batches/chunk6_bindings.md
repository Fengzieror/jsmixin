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

# 绑定块 6/6（152 个，已按证据分数降序）

### `sl` @L87811 (parent=f.UGCTagEntryUI, score=10)
- methods: refresh, select, unselect
- strings: "value", "visible", "selected", "normal", "key", "unselect", "select", "text", "tag", "_id", "id", "#EC1436", "drawRoundRect", "UIUtils", "#000000"

### `Vh` @L100222 (parent=f.PvpFriendEntryUI, score=10)
- methods: init, refreshStatus
- strings: "本场得分：", "game_dropoff_penalty", "value", "visible", "added", "_profile", "addButton", "key", "refreshStatus", "text", "title", "basic", "getItemName", "finalScore", "concat"

### `wf` @L135836 (parent=(无), score=10)
- methods: reset, setOffset, update
- strings: "value", "_entity", "update", "_mover", "key", "reset", "setMaxOffset", "setOffset", "get", "maxOffsetY", "maxOffsetX", "velocity", "currentYPercent", "currentXPercent", "currentOffsetY"

### `uw` @L205641 (parent=(无), score=10)
- methods: adjustOwnerTime, onReceiveNewOwnerTime, reset
- strings: "set", "_lastTimeOwnerTimeWasSet", "time", "timer", "_lastUpdatedOwnerTime", "get", "key", "approximateNetworkTimeOnOwner", "value", "snapTimeThreshold", "numOfStatesToStartCorrection", "_receivedStatesCounter", "abs", "timeCorrectionSpeed", "_lastReceivedOwnerTime"

### `fi` @L43198 (parent=(无), score=9)
- methods: show
- strings: ".png", "/loading/loading_", "value", "view", "removeChild", "ui", "getStage", "instance", "afterDelay", "ActionTask", "start", "setContext", "setDelay", "PingPong", "LoopType"

### `dn` @L50092 (parent=f.GameLiveMissionEntryUI, score=9)
- methods: refresh, setItem
- strings: "value", "visible", "claimed", "_item", "alpha", "canClaim", "bg", "claimButton", "width", "floor", "progressBar", "text", "concat", "progress", "min"

### `_a` @L61215 (parent=(无), score=9)
- methods: encode, refresh, refreshLevel
- strings: "value", "exp", "refresh", "_expData", "_level", "level", "key", "playerLevels", "length", "expNeed", "total", "expData", "refreshLevel", "encode", "get"

### `el` @L86633 (parent=Rt.SmartListener, score=9)
- methods: destroy, disable, enable
- strings: "value", "removeSmartListeners", "onDisable", "key", "disable", "onEnable", "_needResetView", "_root", "enable", "onDestroy", "destroy", "get", "_type", "type", "onInit"

### `Kl` @L95913 (parent=f.UGCTemplateEntryUI, score=9)
- methods: setData
- strings: "级解锁", ".png", "ugctemplate/", ".jpg", "/icon_", "value", "visible", "current", "lock", "count", "price", "selectButton", "priceHud", "text", "concat"

### `Qi` @L48215 (parent=f.DouyinVideoEntryUI, score=9)
- methods: init, showCover
- strings: "❤ ", "value", "scale", "icon", "width", "content", "skin", "_cover", "getRes", "loader", "_id", "key", "showCover", "likes", "bigNumberStr"

### `On` @L52448 (parent=f.TrainingLevelEntryUI, score=9)
- methods: init, refresh
- strings: "value", "gray", "content", "visible", "skipButton", "completed", "key", "refresh", "updateCard", "card", "skin", "icon", "name", "getLimitCountText", "UIUtils"

### `Ro` @L56948 (parent=jt, score=9)
- methods: consume, init, refresh
- strings: "value", "count", "buy", "reset", "key", "refresh", "inventoryConfig", "inventory", "call", "init", "prototype", "consume", "get", "id", "config"

### `$s` @L76170 (parent=f.BattlePassLevelEntryUI, score=9)
- methods: refresh
- strings: ".png", "ui/battlepass_levelbg_", "value", "visible", "flagHud", "text", "concat", "flagNeed", "_index", "level", "other", "first", "skin", "bronze", "levelBg"

### `tc` @L102557 (parent=f.FriendPvpInvitationEntryUI, score=9)
- methods: init
- strings: "点击一起闯关！", "friend_pvpinvite_msg", ".png", "ui/icon_", "value", "visible", "rosterID", "_pvpInvitation", "rosterInfo", "text", "getLocalizationText", "isUGC", "roomDes", "isFriendlyMatch", "roomInfo"

### `Hc` @L107356 (parent=(无), score=9)
- methods: setFingerPos, show
- strings: "ui/icon_pointer_control.png", "ui/icon_pointer.png", "ui/ring.png", "value", "visible", "width", "_finger", "pivot", "height", "ui", "skin", "pos", "_fingerParent", "length", "key"

### `Rd` @L118103 (parent=Wt, score=9)
- methods: init, refreshRating
- strings: "value", "_score", "score", "key", "refreshRating", "characterSkinConfig", "characterskin", "call", "init", "prototype", "get", "haveSpecialSkinTrailBuff", "inventoryModel", "id", "vipskin"

### `G` @L25246 (parent=(无), score=9)
- methods: destroy
- strings: "loading/toast_bg_with_shadow.png", "value", "view", "destroy", "key", "icon", "addChild", "panel", "centerY", "left", "Image", "title", "wordWrap", "leading", "centerX"

### `qo` @L57967 (parent=f.BigRewardEntryUI, score=9)
- methods: refresh
- strings: "使用+", "value", "top", "extra", "icon", "init", "id", "type", "getItemName", "updateText", "count", "text", "getItemTypeName", "concat", "isLifetimeItem"

### `aa` @L60071 (parent=(无), score=9)
- strings: "time_hour_ago", "league_seasontime", "time_minute_ago", "get", "_seqNum", "key", "seqNum", "concat", "{{time}}", "replace", "getLocalizationText", "floor", "{{day}}", "{{month}}", "month_"

### `sd` @L115332 (parent=f.LeagueInventoryUseEntryUI, score=9)
- methods: init, refresh
- strings: "</span>&nbsp;次", "效果&nbsp;<span style='color:#94F1DC'>+", "value", "concat", "updateText", "count", "gray", "useButton", "_item", "key", "refresh", "effect", "getRichText", "UIUtils", "addChild"

### `Hd` @L119690 (parent=f.CharacterDebrisEntryUI, score=9)
- methods: init, refresh
- strings: "value", "visible", "rare", "type", "icon", "locked", "text", "concat", "progressText", "scaleX", "min", "progressBar", "key", "refresh", "skin"

### `xf` @L135979 (parent=(无), score=9)
- methods: reset, setSpeed, update
- strings: "value", "rotation", "_angularVelocity", "_speed", "repeat", "MathUtils", "_startRotation", "key", "update", "reset", "setSpeed", "get", "speed", "startRotation", "angularVelocity"

### `jt` @L33971 (parent=zt, score=9)
- methods: buy, consume, init
- strings: "value", "_count", "max", "key", "consume", "buy", "_category", "consumable", "call", "init", "prototype", "get", "own", "apply"

### `Se` @L37286 (parent=(无), score=9)
- methods: destroy, getEventDispatcher, getOriginalScale
- strings: "value", "_originalScale", "scaleX", "key", "getOriginalScale", "call", "destroy", "prototype", "delegate", "getEventDispatcher", "onPress", "Observable", "onClicked", "Box"

### `Ie` @L37380 (parent=(无), score=9)
- methods: destroy, getEventDispatcher, getOriginalScale
- strings: "value", "_originalScale", "scaleX", "key", "getOriginalScale", "call", "destroy", "prototype", "delegate", "getEventDispatcher", "onPress", "Observable", "onClicked", "Image"

### `Tc` @L106222 (parent=Ic, score=9)
- methods: give, info
- strings: "gift/give", "gift/info", "value", "notify", "onGive", "_giftModel", "intimacy", "data", "getFriendByID", "_friendModel", "gifts", "refreshGifts", "count", "giftId", "frdId"

### `Uu` @L113512 (parent=Rt.ElementComponent, score=9)
- methods: fetchLeaderboard, onInit
- strings: "value", "notify", "onLeaderboardFetched", "_model", "handleFetchFailed", "selfScore", "selfRank", "ranklist", "refreshLeaderboard", "fetchLeaderboard", "_service", "startFetch", "needFetch", "all", "length"

### `x_` @L131003 (parent=S_, score=9)
- methods: onEnter, onUpdate
- strings: "value", "nextBehavior", "context", "isGrounded", "_model", "_haltDuration", "_behaviorStartTime", "time", "timer", "setJumpInput", "dispatch", "horizontalInputCmd", "key", "onUpdate", "haltScale"

### `_y` @L154701 (parent=(无), score=9)
- methods: clear, despawnPopup, spawnPopup
- strings: "get", "_pool", "textpopup", "Pool", "key", "pool", "value", "clearBin", "clear", "despawn", "reset", "despawnPopup", "spawn", "spawnPopup"

### `io` @L54744 (parent=(无), score=9)
- methods: refresh
- strings: "{{time}}小时前广播", "{{time}}分钟前广播", "value", "_ts", "ts", "clanJoinModeInt", "clanJoinMode", "_args", "levelIntID", "levelID", "args", "_type", "type", "_content", "content"

### `Ao` @L56988 (parent=(无), score=9)
- methods: refresh, reset
- strings: "value", "_count", "count", "_ts", "expire", "reset", "key", "refresh", "get", "id", "_id", "encodeMsg", "LocalizeCountdown", "now", "countdown"

### `Jo` @L58679 (parent=f.PackItemEntryUI, score=9)
- methods: refresh
- strings: "value", "count", "concat", "id", "type", "getItemName", "updateText", "itemName", "isLifetimeItem", "visible", "common", "qualityHud", "width", "quality", "max"

### `Nl` @L94509 (parent=(无), score=9)
- methods: claim, complete, refresh
- strings: "value", "_claimed", "key", "claim", "_completed", "_difficulty", "complete", "difficulty", "finished", "claimed", "refresh", "get", "completed"

### `I_` @L131046 (parent=S_, score=9)
- methods: onUpdate, updateHorizontaInputByDistanceToTargetNode
- strings: "value", "dispatch", "horizontalInputCmd", "_model", "nextBehavior", "context", "isGrounded", "forceJump", "left", "collisionState", "_characterController", "isTargetOnRightSide", "right", "currentPlayerXOnTargetNode", "targetPlayerXOnTargetNode"

### `Bo` @L56536 (parent=Po, score=8)
- methods: fetch, use
- strings: "inventory/use", "inventory/info", "value", "handleUseFailed", "_controller", "equippedSkinMsg", "data", "buff", "item", "handleUseSucceeded", "count", "itemId", "post", "request", "context"

### `qs` @L75517 (parent=f.EventLotteryEntryUI, score=8)
- methods: init, refresh
- strings: ".png", "ui/reward_item_", "value", "visible", "selected", "_item", "key", "refresh", "skin", "id", "type", "getQuality", "concat", "card", "bottom"

### `gh` @L98518 (parent=f.ClanBadgeIconUI, score=8)
- methods: refresh, refreshByID, setDefault
- strings: "value", "skin", "bg", "frame", "icon", "key", "setDefault", "refresh", "decodeBadge", "refreshByID", "getBadgeSkin", "apply"

### `e_` @L127229 (parent=qp, score=8)
- methods: getVirtualDataByID, getVirtualItemByID, give
- strings: "value", "giftConfig", "key", "getVirtualDataByID", "getGiftByID", "gift", "getModel", "getVirtualItemByID", "count", "id", "give", "apply"

### `G_` @L132914 (parent=Rt.ElementComponent, score=8)
- methods: handleEvent, onInit
- strings: "value", "componentIndex", "failed to find level component with network index", "warn", "ts", "attributes", "context", "handleNetworkEvent", "getIndexToComponent", "level", "_game", "level component is not a shooter", "destroyProjectile", "killByShooty", "match"

### `vo` @L55561 (parent=f.BroadcastEntryUI, score=8)
- methods: setClanItem, setUGCItem
- strings: "value", "setDefault", "clanHud", "setItem", "visible", "ugcHud", "_id", "id", "key", "setClanItem", "text", "timestr", "nickName", "levelHud", "owner"

### `oc` @L103152 (parent=(无), score=8)
- methods: refresh
- strings: "value", "_timestamp", "now", "_isFriendlyMatch", "isFriendlyMatch", "_isTeamMatch", "isTeamMatch", "_memberCount", "memberCount", "_levelID", "levelId", "_rosterID", "rosterId", "_roomID", "roomId"

### `$c` @L108627 (parent=Qc, score=8)
- methods: getItems
- strings: "个性宠物", "value", "count", "price", "character", "type", "unlocked", "isNew", "own", "getRelatedItem", "_shopModel", "sort", "f", "e", "push"

### `Co` @L55775 (parent=mo, score=8)
- methods: fetchHistories, reportPvp
- strings: "pvp_disconnect", "value", "notify", "onPvpReported", "_model", "key", "reportPvp", "handleHistoriesFetched", "integer", "random", "ts", "now", "reasonId", "reasonType", "id"

### `$r` @L86353 (parent=f.UGCReplayEntryUI, score=8)
- methods: setItem
- strings: "value", "text", "bestRecord", "LocalizeRaceTime", "record", "width", "difficultyText", "max", "difficulty", "_item", "concat", "ugc_difficulty_", "getLocalizationText", "skin", "difficultyBg"

### `Hm` @L176817 (parent=Rt.EntityComponent, score=8)
- methods: handleNetworkEvent
- statics: tag
- strings: "value", "reachflag", "playMatchSound", "audio", "currentGame", "shakeStage", "key", "handleNetworkEvent", "get", "_boxCollider", "colliderComponent", "_team", "team", "bind", "addComponent"

### `Io` @L56373 (parent=f.HonestyEntryUI, score=8)
- methods: setData
- strings: "value", "text", "concat", "time", "getMinutes", "getHours", "day", "getDate", "getMonth", "getFullYear", "timestamp", "f", "e", "name", "reason"

### `ha` @L60304 (parent=la, score=8)
- methods: fetchMails, readMail
- strings: "mailbox/handle", "mailbox/getlist", "value", "handleMailRead", "_controller", "rewards", "data", "eventId", "id", "post", "request", "context", "key", "readMail", "handleMailsFetched"

### `Vg` @L170097 (parent=f.LevelComponentMoreEditEntryUI, score=8)
- methods: init, reset
- strings: "value", "removeChildren", "icon", "key", "reset", "addChild", "height", "width", "pos", "isSelected", "text", "title", "init", "set", "visible"

### `Ut` @L33202 (parent=f.InventoryEntryUI, score=8)
- methods: init, refresh
- strings: "value", "visible", "id", "_item", "inventory", "haveRedDot", "reddotController", "reddot", "count", "concat", "updateText", "refreshItemEntry", "key", "refresh", "init"

### `De` @L38131 (parent=(无), score=8)
- methods: reset, setProps
- strings: "value", "centerX", "centerY", "leftEdge", "left", "rightEdge", "right", "topEdge", "top", "bottomEdge", "bottom", "type", "originPos", "_isInverse", "targetPos"

### `yn` @L50674 (parent=f.GameLiveRankEntryUI, score=8)
- methods: init, setEmpty
- strings: "value", "visible", "content", "_item", "key", "setEmpty", "text", "chinese", "formatDuration", "duration", "score", "profile", "refresh", "avatar", "init"

### `jo` @L57586 (parent=Ho, score=8)
- methods: claimVideoPack, getHistory
- strings: "视频宝箱", "value", "key", "getHistory", "notify", "onClaimed", "_model", "popVideoPack", "id", "count", "type", "showRewardToast", "items", "reason", "handleGetItems"

### `gr` @L78835 (parent=f.UGCAlbumThumbEntryUI, score=8)
- methods: setAlbumMode, setEditMode
- strings: "创建合集", "合集管理", "value", "width", "albumName", "text", "name", "visible", "albumHud", "editHud", "_id", "id", "key", "setAlbumMode", "editText"

### `xr` @L81000 (parent=f.UGCAlbumLevelEntryUI, score=8)
- methods: setDefault, setItem
- strings: "value", "setDefault", "levelHud", "key", "visible", "otherAlbum", "removeButton", "addButton", "id", "indexOf", "albumID", "inAlbum", "refresh", "_item", "setItem"

### `wc` @L105794 (parent=f.GiftFriendEntryUI, score=8)
- methods: init, refresh
- strings: "亲密度：", "value", "text", "intimacy", "_item", "concat", "key", "refresh", "title", "profile", "getItemName", "getLimitedNickName", "nickname", "avatar", "init"

### `lp` @L122412 (parent=(无), score=8)
- methods: add, update
- strings: "value", "_value", "notify", "onScoreChanged", "key", "update", "add", "get", "_isCumulative", "isCumulative", "_id", "ID", "_dataID", "_extraID", "concat"

### `ia` @L59865 (parent=f.PackHistoryEntryUI, score=7)
- methods: refresh
- strings: "日 ", " · ", "十连抽", "单抽", "value", "text", "concat", "getDate", "getMonth", "getFullYear", "time", "getMinutes", "getHours", "ts", "packName"

### `Dg` @L169519 (parent=f.LevelMusicNoteSoundEntryUI, score=7)
- methods: init, refresh
- strings: "value", "text", "concat", "soundName", "_index", "key", "refresh", "isSelected", "visible", "pitch", "init", "get", "index", "set", "_isSelected"

### `Kg` @L171335 (parent=(无), score=7)
- methods: create
- strings: "value", "templatetower", "levelfootball", "levelspin", "levelaladin", "levelouterspacebattle", "levelouterspace", "levelskycastle", "levelatlantis", "levelsteampunk", "bgtall", "bgwide", "levelportal", "leveldrumbattle", "leveldrum"

### `Lk` @L186193 (parent=(无), score=7)
- methods: getUndoComponent, undo
- strings: "value", "f", "e", "context", "onUndo", "index", "getIndexToComponent", "level", "done", "n", "s", "_elements", "createFromElementsAndAdd", "key", "undo"

### `FS` @L229885 (parent=Rt.State, score=7)
- strings: "toast_syncgame", "value", "id", "reloadgame", "quitgame", "changeState", "create", "Handler", "startFadeWithTask", "cloudTransition", "title", "getLocalizationText", "showLoading", "key", "reloadGame"

### `Hn` @L53494 (parent=f.BadgeEntryUI, score=7)
- methods: refresh
- strings: "value", "width", "progressHud", "target", "nextLevelData", "progress", "floor", "currentProgress", "isMaxLevel", "visible", "maxLevel", "text", "currentName", "badgeName", "gray"

### `$a` @L67175 (parent=f.ClanUGCInviteEntryUI, score=7)
- methods: refreshState, setItem
- strings: "value", "visible", "invited", "inviteButton", "key", "refreshState", "content", "uploaded", "_item", "unUploaded", "refresh", "levelHud", "setItem", "get", "item"

### `Ys` @L75562 (parent=(无), score=7)
- methods: init, refresh
- strings: "value", "visible", "_highLight", "key", "refresh", "drawRoundRect", "UIUtils", "addChild", "height", "width", "size", "Sprite", "_normal", "init", "apply"

### `ch` @L98122 (parent=f.TopPvpPlayerEntryUI, score=7)
- methods: init
- strings: "ui/rank_bg_red.png", "ui/rank_1.png", "value", "skin", "win", "visible", "rank", "text", "concat", "isWin", "battleProfile", "lose", "bottom", "clanBadge", "avatar"

### `ou` @L108909 (parent=Qc, score=7)
- methods: getItems
- strings: "印花商店", "value", "count", "price", "unlocked", "isNew", "canBuy", "_shopModel", "isConsumable", "own", "getRelatedItem", "sort", "push", "available", "rankrush"

### `S_` @L130976 (parent=Rt.State, score=7)
- methods: onEnter, onInit
- strings: "value", "_behaviorStartTime", "time", "timer", "key", "onEnter", "_characterController", "characterController", "collider", "_player", "_model", "model", "context", "onInit", "apply"

### `Tk` @L186101 (parent=(无), score=7)
- methods: getUndoComponent, undo
- strings: "value", "_component", "destroyComponent", "level", "context", "f", "e", "isDestroyed", "done", "n", "s", "childComponents", "key", "undo", "getUndoComponent"

### `b` @L9967 (parent=(无), score=7)
- methods: acCheck, acChecksum
- strings: "value", "randomSeed", "key", "acChecksum", "god bless you", "onCheat", "_acValue", "acCheck", "set", "_value", "_setter", "get", "_getter", "length"

### `Je` @L41501 (parent=(无), score=7)
- methods: delete, set
- strings: "toast_setstoragefailed", "value", "onfail", "success", "key", "removeStorage", "delete", "fail", "title", "getLocalizationText", "showToast", "data", "setStorage", "set"

### `ss` @L68032 (parent=f.ClanApplicationEntryUI, score=7)
- methods: init
- strings: ".png", "ui/icon_", "Lv.", "value", "skin", "genderStr", "profile", "_item", "concat", "gender", "text", "level", "title", "getItemName", "getLimitedNickName"

### `ys` @L71292 (parent=(无), score=7)
- strings: "set", "_roomState", "get", "key", "roomState", "_levelID", "levelID", "_ugcLevel", "ugcLevel", "isTeamMatch", "_args", "_ts", "ts", "_content", "rosterID"

### `zr` @L84767 (parent=(无), score=7)
- methods: refresh
- strings: "value", "_sticky", "sticky", "_timestamp", "ts", "_status", "status", "_content", "content", "_type", "type", "player", "refresh", "_player", "_id"

### `Lg` @L169010 (parent=(无), score=7)
- methods: create, getID
- strings: ".png", "game/burst-of-light-00", "value", "interval", "index", "pivot", "getID", "loadImages", "Animation", "concat", "push", "key", "create", "burstoflight"

### `lm` @L172372 (parent=sm, score=7)
- methods: createMowers
- strings: "mowersaw_r", "mowersaw_l", "smoke_r", "spark_r", "tyre_r", "mowerhopper_r", "mowerspike_r", "mower_r", "smoke_l", "spark_l", "tyre_l", "mowerhopper_l", "mowerspike_l", "mower_l", "value"

### `$l` @L96594 (parent=f.MatchHistoryPlayerEntryUI, score=7)
- methods: init
- strings: "value", "text", "concat", "rank", "visible", "isWin", "battleProfile", "lose", "win", "bottom", "clanBadge", "avatar", "right", "danIcon", "left"

### `Nu` @L113569 (parent=Vu, score=7)
- methods: fetchLeaderboard
- strings: "ranklist/getleveltop", "ranklist/gettop", "value", "data", "rankId", "count", "name", "post", "_requestController", "skill", "creative", "friend", "id", "currentSeasonConfig", "leagueModel"

### `Sg` @L168795 (parent=(无), score=7)
- strings: "get", "_instance", "key", "instance", "value", "join", "y", "x", "getKey", "concat", "push", "passCells", "length", "getAIParamKey", "_aiConfigs"

### `Mg` @L168967 (parent=(无), score=7)
- methods: create, getID
- strings: "value", "_pivotYFactor", "height", "_pivotXFactor", "width", "pivot", "_skinUrl", "loadImage", "Sprite", "key", "create", "getID", "length"

### `NS` @L230159 (parent=(无), score=7)
- strings: "get", "_instance", "key", "instance", "value", "zOrder", "size", "_stages", "addChild", "stage", "set", "name", "height", "width", "Sprite"

### `Ue` @L39974 (parent=(无), score=6)
- methods: shiftNow, sync
- strings: "value", "toUTCString", "sync server time", "log", "_lastSyncedValue", "_lastSyncTime", "now", "key", "sync", "get", "getTime", "shiftNow"

### `Cr` @L79616 (parent=f.UGCAlbumEntryUI, score=6)
- methods: setItem
- strings: "value", "visible", "iconMove", "skin", "coverURL", "cover", "text", "join", "tags", "albumTag", "defaultInfo", "intro", "getLimitCountText", "UIUtils", "name"

### `Il` @L92010 (parent=f.UGCTotalCommentPanelUI, score=6)
- methods: enable, refresh
- strings: "value", "visible", "nextButton", "disliked", "liked", "key", "refresh", "#00D0FF", "drawRoundRect", "UIUtils", "enable", "apply"

### `Bl` @L92372 (parent=f.UGCCommentBulletUI, score=6)
- methods: refresh
- strings: "value", "width", "text", "top", "avatar", "left", "visible", "stamp", "textBg", "#ffffff", "drawRoundRect", "UIUtils", "clear", "graphics", "content"

### `eu` @L108756 (parent=Qc, score=6)
- methods: getItems
- strings: "头像框", "value", "count", "price", "unlocked", "isNew", "own", "getRelatedItem", "_shopModel", "sort", "push", "available", "config", "avaliable", "forEach"

### `rd` @L115375 (parent=f.DanUI, score=6)
- methods: refresh
- strings: ".png", "/badge_level_", "/badge_l_", "value", "skin", "level", "concat", "danBaseURL", "danLevel", "alpha", "type", "getDanColor", "danName", "color", "text"

### `Yp` @L127045 (parent=qp, score=6)
- methods: getIcon, getVirtualDataByID
- strings: ".png", "specialitems/", "value", "_type", "specialItems", "key", "getVirtualDataByID", "icon", "concat", "getIconUrl", "getIcon", "apply"

### `kg` @L168295 (parent=(无), score=6)
- strings: "value", "y", "cellVisualSize", "entity", "key", "getPlayerYOnCell", "_isOnClosedList", "setIsOnClosedList", "_isOnOpenList", "setIsOnOpenList", "_parent", "setParent", "_f", "_h", "_g"

### `Re` @L38198 (parent=(无), score=6)
- methods: reset, setProps
- strings: "value", "scaleY", "scaleX", "originScale", "targetScale", "alpha", "_withFade", "key", "setProps", "scale", "reset"

### `tu` @L108705 (parent=Qc, score=6)
- methods: getItems
- strings: "表情", "value", "index", "config", "unlocked", "isNew", "own", "getRelatedItem", "_shopModel", "sort", "push", "available", "avaliable", "forEach", "emoji"

### `Gu` @L113621 (parent=Vu, score=6)
- methods: fetchLeaderboard
- strings: "玩家", "https://static.tuimotuimo.com/common/ui/avatar.png", "value", "once", "timer", "level", "integer", "random", "dan", "score", "avatar", "name", "concat", "userid", "unpuzzle"

### `Xd` @L120343 (parent=(无), score=6)
- methods: resultIn
- strings: "value", "start", "setContext", "setCompletionHandler", "setDelay", "centerX", "tweenProps", "addTween", "scaleY", "scaleX", "alpha", "width", "stage", "scale", "TweenFlow"

### `nf` @L134578 (parent=Rt.State, score=6)
- methods: onEnter, onExit
- strings: "value", "key", "onExit", "sound", "hideView", "context", "headicon", "effects", "avatar", "onEnter", "apply"

### `nu` @L108858 (parent=Qc, score=6)
- methods: getItems
- strings: "图章", "value", "index", "config", "unlocked", "isNew", "own", "getRelatedItem", "_shopModel", "sort", "push", "avaliable", "forEach", "stamp", "getShopDataListByType"

### `gC` @L195891 (parent=f.MatchRewardEntryUI, score=6)
- methods: refresh
- strings: "value", "visible", "rare", "type", "id", "debrisConfig", "characterdebris", "text", "count", "concat", "getItemName", "rewardName", "init", "icon", "_reward"

### `hw` @L205467 (parent=(无), score=6)
- strings: "get", "_buffer", "endian", "LITTLE_ENDIAN", "Byte", "key", "buffer", "value", "length", "writeArrayBuffer", "_msgID", "writeUint16", "clear", "serialize", "Parse msg failed, invalid message id "

### `Hw` @L210788 (parent=f.AnnualFriendEntryUI, score=6)
- methods: refresh
- strings: "avatar_empty.png", "border_76.png", "value", "visible", "empty", "top", "avatarHud", "nickName", "text", "getLimitedNickName", "skin", "getResUrl", "avatarUrl", "avatar", "border"

### `iu` @L108807 (parent=Qc, score=6)
- methods: getItems
- strings: "称号", "value", "count", "price", "unlocked", "isNew", "own", "getRelatedItem", "_shopModel", "sort", "push", "avaliable", "forEach", "title", "getShopDataListByType"

### `Yr` @L85770 (parent=(无), score=6)
- methods: refresh
- strings: "value", "_record", "record", "players", "refresh", "_profiles", "length", "player", "key", "get", "_isPvpRank", "isPvpRank", "profiles", "profile", "LocalizeRaceTime"

### `Su` @L112281 (parent=bu, score=6)
- methods: equip
- strings: "title/equip", "value", "notify", "onItemEquipFailed", "userSystem", "context", "_controller", "onEquiped", "_titleModel", "data", "handleUserMsg", "msgController", "id", "post", "request"

### `f_` @L129443 (parent=f.PlayerInputUI, score=6)
- methods: init
- strings: "value", "pos", "jumpButton", "centerY", "jumpButtonView", "height", "y", "jumpButtonPos", "centerX", "width", "x", "buttonPanel", "arrowButtonView", "arrowButtonPos", "stage"

### `Ae` @L38225 (parent=(无), score=5)
- methods: reset, setProps
- strings: "value", "alpha", "originAlpha", "targetAlpha", "key", "setProps", "reset"

### `Ch` @L98608 (parent=kh, score=5)
- methods: equip
- strings: "emoji/equipv2", "value", "notify", "onItemEquipFailed", "_userSystem", "onEquiped", "_emojiModel", "refreshEmojiEquipsByType", "emojis", "type", "post", "request", "context", "_controller", "key"

### `Mc` @L106269 (parent=Ic, score=5)
- methods: give, info
- strings: "value", "key", "give", "handleSyncResult", "_giftModel", "info", "apply"

### `Xu` @L113818 (parent=(无), score=5)
- strings: "匿名玩家", "ui/defaultavatar.png", "get", "_rank", "key", "rank", "title", "_profile", "dan", "_isMe", "isMe", "_score", "score", "nickName", "name"

### `Pk` @L186228 (parent=(无), score=5)
- methods: getUndoComponent, undo
- strings: "value", "_moveY", "_moveX", "undoMapMove", "key", "undo", "getUndoComponent"

### `Bk` @L186250 (parent=(无), score=5)
- methods: getUndoComponent, undo
- strings: "value", "_moveY", "_moveX", "undoMapResize", "key", "undo", "getUndoComponent"

### `sr` @L77675 (parent=f.BattlePassRewardIntroEntryUI, score=5)
- methods: refresh
- strings: "value", "updateText", "rewardName", "count", "concat", "id", "type", "getItemName", "init", "icon", "updateCard", "card", "getQuality", "key", "refresh"

### `ld` @L115404 (parent=f.DanProgressBarUI, score=5)
- methods: refresh
- strings: "value", "text", "concat", "progressText", "scaleX", "progressBar", "scoreNeed", "config", "min", "dan", "getDan", "leagueModel", "maxDan", "key", "refresh"

### `rm` @L172346 (parent=sm, score=5)
- methods: createMowers
- strings: "mower_saw", "value", "smoke", "getSceneObjectByTag", "spark", "tyre", "getSceneObjectsByTag", "getSceneObject", "mowerhopper", "getBoxCollider", "mowerspike", "mowersaw", "mower", "key", "createMowers"

### `es` @L67410 (parent=f.ClanBadgeEntryUI, score=5)
- methods: refresh
- strings: "value", "alpha", "icon", "visible", "lock", "isBadgeUnlocked", "skin", "getBadgeTypeSkin", "selected", "_id", "key", "refresh", "get", "id", "apply"

### `md` @L116723 (parent=f.LeagueSeasonRewardEntryUI, score=5)
- methods: init
- strings: "recharge/item_gold_xs.png", "value", "icon", "localizeUIImage", "getIconUrl", "coin", "type", "count", "id", "getIcon", "concat", "updateText", "key", "init", "apply"

### `T_` @L131096 (parent=S_, score=5)
- methods: onUpdate
- strings: "value", "jump", "changeState", "context", "integer", "random", "canAccurateJump", "isNextPlatformDangerousToLand", "nextPlatform", "dispatch", "horizontalInputCmd", "_model", "key", "onUpdate", "apply"

### `oy` @L152336 (parent=(无), score=5)
- strings: "switchbutton.png", "game/", "game/platform1x1.png", "get", "_sign", "key", "sign", "sprite", "addChild", "getTypeIndex", "setTypeIndex", "pivotY", "pivotX", "pos", "height"

### `Xi` @L47767 (parent=(无), score=5)
- methods: refresh
- strings: "value", "_likes", "diggCount", "_nickName", "nickName", "_cover", "coverUrl", "key", "refresh", "get", "likes", "cover", "_id", "id"

### `ma` @L61511 (parent=ga, score=5)
- methods: addVideoExp
- strings: "stats/video", "value", "resetBadgeRefreshTS", "_controller", "data", "handleUserMsg", "msgController", "context", "action", "post", "request", "key", "addVideoExp", "apply"

### `ph` @L98224 (parent=dh, score=5)
- methods: equip
- strings: "border/equip", "value", "notify", "onItemEquipFailed", "userSystem", "context", "_controller", "equip", "_borderModel", "id", "post", "request", "key", "apply"

### `cd` @L115780 (parent=f.LeagueInventoryEntryUI, score=5)
- methods: init
- strings: ".png", "inventory/icon_", "value", "gray", "skin", "_type", "concat", "getIconUrl", "icon", "key", "init", "get", "type", "apply"

### `bf` @L135912 (parent=(无), score=5)
- methods: update
- strings: "value", "x", "_lastMotion", "right", "_bounds", "_speed", "scaleX", "spriteWidth", "fixedDeltaTime", "timer", "key", "update", "get", "lastMotion"

### `Ag` @L169817 (parent=(无), score=5)
- methods: handleUpdate
- strings: "value", "notify", "onUpdate", "updatePanelOnChange", "_data", "key", "handleUpdate", "get", "id", "title", "_ui", "view", "type", "Observable"

### `qg` @L171082 (parent=f.UGCBGMEntryUI, score=5)
- methods: init
- strings: "value", "visible", "current", "okButton", "text", "id", "getComponentName", "bgmName", "_config", "key", "init", "get", "config", "apply"

### `sk` @L179915 (parent=(无), score=5)
- methods: selelct
- strings: "value", "_playerIndex", "key", "selelct", "get", "_id", "getConfig", "config", "id", "_index", "index", "selected", "playerIndex", "componentID"

### `ei` @L41543 (parent=(无), score=5)
- methods: keyExchange
- strings: "generate dhkeys...", "get", "key", "publicKey", "privateKey", "value", "keyExchange", "publickey ok", "log", "privatekey ok", "nextInt", "p", "g"

### `ri` @L41984 (parent=(无), score=5)
- strings: "get", "_instance", "key", "instance", "value", "notify", "onLoad", "onLoadComplete", "clear", "_loaderMap", "unload", "removeListener", "onComplete", "forEach", "load"

### `kd` @L116746 (parent=f.RewardEntryUI, score=5)
- methods: init
- strings: "value", "title", "onlyThumb", "init", "icon", "count", "concat", "updateText", "id", "type", "getItemName", "key", "apply"

### `wk` @L184884 (parent=(无), score=5)
- methods: create
- strings: "value", "unknow game mode ", "football", "ugcmultiplayer", "ugcchallenge", "matchreplay", "matchaibattle", "tutorialmatch", "match", "free", "debugMode", "key", "create"

### `Jw` @L212454 (parent=(无), score=5)
- methods: refresh
- strings: "value", "HazardRate", "hazardRate", "ZeroScoreRate", "zeroScoreRate", "FirstRankRate", "firstRankRate", "ReachFlagRate", "reachFlagRate", "PlayerCount", "playerCount", "key", "refresh"

### `Tb` @L217429 (parent=f.BadgeUnlockedEntryUI, score=5)
- methods: refresh
- strings: "value", "text", "currentName", "badgeName", "skin", "currentIcon", "icon", "_item", "key", "refresh", "get", "item", "apply"

### `Ot` @L32979 (parent=f.ItemEmojiEntryUI, score=4)
- methods: init
- strings: "value", "visible", "selected", "emoji", "showAnim", "init", "icon", "_item", "key", "get", "item", "apply"

### `Ju` @L114472 (parent=Qu, score=4)
- methods: info
- strings: "/userrole/vips", "value", "handleUserMsg", "msgController", "context", "_controller", "data", "post", "request", "key", "info", "apply"

### `x` @L24698 (parent=(无), score=4)
- methods: setPosition
- strings: "value", "setTo", "position", "key", "setPosition", "index", "dir", "none", "zero", "Vector", "id"

### `an` @L49363 (parent=(无), score=4)
- methods: refresh
- strings: "value", "_startTS", "openTime", "avatar", "refresh", "_profile", "key", "get", "profile", "now", "duration"

### `er` @L76408 (parent=(无), score=4)
- methods: refreshRewardConfig
- strings: "value", "_rewardConfig", "key", "refreshRewardConfig", "get", "activeInterval", "flagNeed", "passReward", "freeReward", "_index", "index"

### `_d` @L116376 (parent=(无), score=4)
- methods: claim
- strings: "value", "_claimed", "key", "claim", "get", "_config", "config", "set", "_canClaim", "canClaim", "claimed"

### `on` @L49335 (parent=(无), score=4)
- methods: refresh
- strings: "value", "_score", "liveSecs", "avatar", "refresh", "_profile", "key", "get", "profile", "score"

### `na` @L59901 (parent=f.PackHistoryItemEntryUI, score=4)
- methods: setItem
- strings: "value", "init", "icon", "key", "setItem", "#FFF6E6", "itemBg", "drawRoundRect", "UIUtils", "call"

### `cr` @L78114 (parent=(无), score=4)
- methods: encodeChangedSort
- strings: "value", "length", "concat", "key", "encodeChangedSort", "_model", "ugcalbum", "getModel", "context", "_controller"

### `yS` @L226807 (parent=f.TitleIconUI, score=4)
- methods: init
- strings: "value", "text", "title", "getItemName", "titleName", "fontSize", "needLocalization", "key", "init", "apply"

### `zn` @L53528 (parent=f.BadgeEquipEntryUI, score=4)
- methods: refresh
- strings: "value", "skin", "currentIcon", "icon", "visible", "empty", "key", "refresh", "apply"

### `Rs` @L73525 (parent=f.RankRushScoreRewardEntryUI, score=4)
- methods: refresh
- strings: "value", "right", "locked", "claimed", "centerY", "visible", "key", "refresh", "apply"

### `qt` @L34522 (parent=(无), score=4)
- strings: "get", "_instance", "key", "instance", "value", "clearUnLoaded", "loader", "active", "_loaders", "length", "stopAndClearAssets", "forEach", "clearAll", "splice", "indexOf"

### `Jp` @L127157 (parent=Yp, score=4)
- methods: give
- strings: "value", "count", "addFlag", "battlePassEvent", "eventModel", "key", "give", "apply"

### `Zp` @L127175 (parent=Yp, score=4)
- methods: give
- strings: "value", "count", "givePvpScore", "league", "getModel", "key", "give", "apply"

### `Qp` @L127139 (parent=Yp, score=3)
- methods: getVirtualItemByID
- strings: "value", "battlePassItem", "battlePassEvent", "eventModel", "key", "getVirtualItemByID", "apply"

### `ih` @L97308 (parent=(无), score=3)
- strings: "get", "_battleProfile", "key", "battleProfile", "basic", "userProfile", "rank", "score", "updateMatchScore", "isWin", "updateBattleState", "updateRank", "isAI", "AI", "startsWith"

### `wh` @L98638 (parent=kh, score=3)
- methods: equip
- strings: "value", "refreshEmojiEquipsByType", "_emojiModel", "key", "equip", "apply"

### `$p` @L127193 (parent=Yp, score=3)
- methods: give
- strings: "value", "give", "userlevel", "getModel", "key", "apply"

### `t_` @L127211 (parent=Yp, score=3)
- methods: give
- strings: "value", "count", "give", "honestyModel", "key", "apply"

### `ai` @L41820 (parent=(无), score=3)
- strings: "get", "_instance", "key", "instance", "value", "despawn", "forEach", "push", "haveContext", "_skeletonLoaderPool", "clear", "destroy", "splice", "indexOf", "spawn"

### `So` @L56057 (parent=(无), score=3)
- strings: "get", "_reasonType", "key", "reasonType", "_reasonID", "reasonID", "_timestamp", "timestamp", "_score", "score", "value", "reasonId", "_id", "id", "ts"

### `_h` @L98253 (parent=dh, score=3)
- methods: equip
- strings: "value", "equip", "_borderModel", "key", "apply"

### `xu` @L112313 (parent=bu, score=3)
- methods: equip
- strings: "value", "equip", "_titleModel", "key", "apply"
