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

# 绑定块 4/6（152 个，已按证据分数降序）

### `Th` @L98921 (parent=f.EmojiGroupUI, score=20)
- methods: destroy, layout, refresh, setMaskVisible, startTweens, stopTweens
- strings: "value", "centerX", "imageEmojiVip", "abs", "wordEmojiVip", "left", "imageEmojiIcon", "right", "scaleX", "imageEmojiMask", "imageEmoji", "wordEmojiIcon", "wordEmojiMask", "wordEmoji", "imageEmojiHud"

### `Jd` @L121063 (parent=Qd, score=20)
- methods: claimDebrisByVideo, dropDebrisByVideo, equip, helpGiveDebris, unlock
- strings: "已经帮他收集过了哦", "character/dropdebrisbyvideo", "character/claimdebrisbyvideo", "character/helpgivedebris", "character/equip", "character/buy", "value", "dropDebrisID", "data", "notify", "onDropDebris", "characterModel", "context", "_controller", "handleUserMsg"

### `Bp` @L126031 (parent=(无), score=20)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "emoji/", "value", "emojiConfig", "key", "getVirtualDataByID", "getEmojiByID", "emoji", "getModel", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes"

### `Ff` @L138187 (parent=Df[=LevelComponentBase], score=20)
- methods: onAddToLevel, onRemoveFromLevel, update, updateOffset, updateViewBounds
- strings: "value", "y", "x", "setTo", "_offset", "toParentPoint", "node", "mainCamera", "_initialY", "_initialX", "TEMP", "Point", "key", "updateOffset", "level"

### `Wf` @L139258 (parent=Gf, score=20)
- methods: createAnimBackgrounds, createAnimBg, destroy, init, update, updateBounds
- strings: "/rain.png", "/bottom1.png", "ugctheme/", "/bottom2.png", "value", "sizeGrid", "0,0,0,0,1", "size", "height", "ceil", "width", "skin", "Image", "key", "createAnimBg"

### `Te` @L37422 (parent=(无), score=20)
- methods: destroy, getEventDispatcher, getOriginalScale, onDisplay, onUndisplay, playExpandTween
- strings: "value", "stopAllTweensWithContext", "TweenMgr", "key", "onUndisplay", "playExpandTween", "onDisplay", "start", "setContext", "RestartFromBeginning", "LoopType", "setLoops", "alpha", "scaleY", "getOriginalScale"

### `Cs` @L71608 (parent=(无), score=20)
- methods: getResUrl, refreshConfig, refreshScore, refreshState, update
- strings: "日-", "时-", "event/", "value", "notify", "onEventTimeChanged", "active", "state", "refreshState", "key", "update", "_score", "refreshScore", "_leaderboard", "toLocaleLowerCase"

### `Ep` @L126097 (parent=(无), score=20)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "套卡片之一，集齐全套卡片可以解锁", "宠物的", ".png", "characterdebris/", "value", "debrisConfig", "key", "getVirtualDataByID", "getDebrisByID", "characterModel", "getVirtualItemByID", "characterID", "character", "getQuality", "name"

### `gm` @L173472 (parent=Df[=LevelComponentBase], score=20)
- methods: loadSkeleton, onDestroy, onSkeletonLoad, playBeatAnim, playIdleAnim
- strings: "/leveldrum2/bell.png", "/leveldrum2/bell.sk", "value", "addInitialComponentToLevel", "_level", "node", "mainCamera", "addToStage", "height", "bounds", "collider", "entity", "_taiko", "y", "center"

### `oi` @L41703 (parent=(无), score=19)
- methods: load, onTemplateLoad, onTemplateLoadFail, startLoad, unload
- strings: "value", "startLoad", "unload", "load template failed", "error", "key", "onTemplateLoadFail", "_onComplete", "_skeleton", "buildArmature", "_template", "onTemplateLoad", "_retryCount", "_skURL", "_skURLBackup"

### `wn` @L51127 (parent=Rt.ElementModel, score=19)
- methods: getItemsByCatetory, getMissionGroupByCatetory, getUnclaimedCount, handleFetched, onInit, reset, updateMissions
- strings: "value", "unclaimeCount", "get", "_missions", "has", "key", "getUnclaimedCount", "notify", "onMissionUpdate", "refresh", "id", "missions", "forEach", "updateMissions", "handleFetched"

### `gd` @L116654 (parent=f.LeagueRewardIntroEntryUI, score=19)
- methods: disable, enable, initDanReward, initRankReward, refreshEntry, refreshRewards
- strings: "league_rankreward_single", "league_rankreward_range", "value", "_rewards", "init", "key", "refreshEntry", "array", "length", "rewardGroup", "mouseEnabled", "width", "scrollBar", "refreshRewards", "rewards"

### `ns` @L67589 (parent=f.ClanChatEmojiEntryUI, score=19)
- methods: destroy, layout, refresh, setMaskVisible, startTweens, stopTweens
- strings: "value", "left", "imageEmojiIcon", "right", "scaleX", "imageEmojiMask", "imageEmoji", "wordEmojiIcon", "wordEmojiMask", "wordEmoji", "centerX", "imageEmojiHud", "key", "layout", "visible"

### `Ir` @L81038 (parent=(无), score=19)
- methods: activate, cache, encodeCheckpointData, loadCache, removeCache, reset
- strings: "value", "componentEvents", "snapshots", "componentData", "elements", "delaySecond", "ts", "checkpoint", "set", "forEach", "keys", "cacheData", "_data", "key", "encodeCheckpointData"

### `Ik` @L186000 (parent=(无), score=19)
- methods: clear, endSession, endSessionWithAllMap, endSessionWithDeletion, endSessionWithResizeMap, start, startMoveMap
- strings: "value", "_originalElements", "_justCreated", "_currentEditComponent", "key", "clear", "endSessionWithResizeMap", "endSessionWithAllMap", "base", "endSessionWithDeletion", "end GameEditSession without start", "error", "endSession", "startMoveMap", "getElement"

### `QC` @L203246 (parent=f.SingleEndRankGroupUI, score=19)
- methods: disable, enable, onGetEmoji, onMoreButtonClicked, playInTween
- strings: "value", "notify", "handleMoreButtonClicked", "key", "onMoreButtonClicked", "showEmoji", "userID", "forEach", "_entries", "onGetEmoji", "start", "setContext", "setCompletionHandler", "length", "showScoreAnim"

### `Fp` @L126401 (parent=(无), score=19)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "stamp/", "value", "stamps", "key", "getVirtualDataByID", "getStampByID", "ugc", "getModel", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes"

### `Fg` @L169942 (parent=Ag, score=19)
- methods: completeEdit, disable, enable, onClicked, refresh, updateData
- strings: "get", "_ui", "key", "ui", "_data", "data", "value", "text", "_currentIndex", "itemList", "state", "refresh", "handleUpdate", "length", "success"

### `ho` @L54858 (parent=Rt.ElementComponent, score=19)
- methods: broadcastClanInvite, broadcastUGCLevel, fetchBroadcastList, handleBroadcast, handleBroadcastFailed, handleGetMsg, onInit
- strings: "当前广播消息太多，请稍后再试", "value", "handleGetMsg", "chatModel", "context", "key", "title", "showToast", "ErrChatRoomChannelRateLimited", "code", "data", "handleBroadcastFailed", "handleBroadcast", "broadcastClanInvite", "_service"

### `dr` @L78262 (parent=cr, score=19)
- methods: createAlbum, deleteAlbum, fetchLocalAlbums, getAlbumByID, updateAlbum, updateAlbumsSort
- strings: "啦啦啦", "地图合集", "value", "changeIndexes", "changeIDs", "data", "sortAlbum", "handleAction", "_controller", "key", "updateAlbumsSort", "id", "delete", "deleteAlbum", "ids"

### `Rh` @L99523 (parent=(无), score=19)
- methods: encode, getFriendRelation, getRelationsByID, handleFetchResult, hasRelations, refresh
- strings: "value", "relations", "hidden", "_hidden", "id", "friends", "encode", "push", "forEach", "get", "_relations", "has", "relationConfig", "keys", "key"

### `Rp` @L126221 (parent=(无), score=19)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "characterskin/icon_", "value", "characterSkinConfig", "key", "getVirtualDataByID", "getCharacterSkinByID", "characterskin", "getModel", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes"

### `Op` @L126345 (parent=(无), score=19)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "border/", "value", "borderConfig", "key", "getVirtualDataByID", "getBorderByID", "border", "getModel", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes"

### `zp` @L126775 (parent=(无), score=19)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "decal/", "value", "decals", "key", "getVirtualDataByID", "getItemByID", "decal", "getModel", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes"

### `Ap` @L126279 (parent=(无), score=19)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "碎片", "value", "skinDebrisConfig", "key", "getVirtualDataByID", "getDebrisByID", "characterskin", "getModel", "getVirtualItemByID", "common", "skinID", "getQuality", "quality", "description", "characterSkinConfig"

### `Up` @L126459 (parent=(无), score=19)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "pack/", "value", "key", "getVirtualDataByID", "getVirtualItemByID", "common", "getQuality", "description", "videoPacks", "getDes", "name", "getName", "icon", "concat"

### `pi` @L42868 (parent=f.CommonButtonUI, score=18)
- methods: onLoaded, refreshIcon, refreshLayout, updateIcon, updateText
- strings: "icon_login_apple", "icon_login_tel", "icon_login_wechat", ".png", "/common/", "_80.png", "/common/btn_", "loading/btn_blue_80.png", "value", "centerX", "buttonInfo", "label", "left", "_iconWidth", "width"

### `Yn` @L54312 (parent=Rt.ElementComponent, score=18)
- methods: equip, getBadgesInfoByIDs, getBasicInfo, onInit, resetBadgeRefreshTS, unequip
- strings: "value", "uneqiup", "_service", "key", "unequip", "equip", "notify", "onBadgesInfoFetched", "_badgeModel", "getBadgesInfoByIDs", "length", "push", "indexOf", "needRefresh", "getItemByID"

### `Dp` @L126164 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "character/icon_", "value", "characterConfig", "key", "getVirtualDataByID", "getCharacterByID", "characterModel", "getVirtualItemByID", "common", "getQuality", "description", "getDes", "name", "getName"

### `Np` @L126565 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".jpg", "avataritems/", "value", "avatarItems", "key", "getVirtualDataByID", "getAvatarItemByID", "profileModel", "getVirtualItemByID", "common", "getQuality", "description", "getDes", "name", "getName"

### `qb` @L222768 (parent=(无), score=18)
- methods: setTo, startDragAnim, startPointToAnim, startRotateToAnim, stopAnim
- strings: "ui/icon_pointer_control.png", "ui/icon_pointer.png", "value", "start", "RestartFromBeginning", "LoopType", "setLoops", "decelerate", "Ease", "setEaseType", "y", "x", "tweenProps", "pos", "length"

### `ui` @L42756 (parent=(无), score=18)
- methods: clear, handleCreateTaskRoomResult, handleEnterGroupRoom, retryCreateTaskRoom, tryCreateRoomWithTask
- statics: _retryInterval
- strings: "value", "_pvpMode", "_roomType", "_levelID", "startFriendlyMatchmaking", "private", "defaultLevel", "config", "setTaskRoomID", "matchmakingModel", "matchmaking", "getController", "removeRequestCount", "request", "handleCreateTaskRoomResult"

### `jp` @L126833 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "recharge/", "value", "key", "getVirtualDataByID", "getVirtualItemByID", "common", "quality", "getRechargeByID", "recharge", "getModel", "getQuality", "description", "getDes", "name"

### `Qs` @L75651 (parent=f.BattlePassMaxRewardEntryUI, score=18)
- methods: destroy, refresh, refreshCurrentReward, refreshIntro
- strings: "<br/>在赛季结束时用通行证可打开金库，领取全部金币", "<br/>本赛季结束后可打开金库，领取全部金币", "</span>金币", "</span>支旗子，金库中将放入<span style='color:#FAD347'>", "完成全部等级后每获得<span style='color:#FAD347'>", "</span>支旗子，你的金库中将放入<span style='color:#FAD347'>", "每获得<span style='color:#FAD347'>", "上限：", ".png", "number/number_green_", "/battlepass/maxreward_title.png", "/battlepass/icon_maxreward.png", "/battlepass/maxreward_effect.png", "value", "centerX"

### `Eh` @L99391 (parent=Ph, score=18)
- methods: agree, delete, info, invite, reject, setting
- strings: "一二三四五六七就是", "value", "key", "delete", "reject", "agree", "invite", "setting", "userID", "item", "data", "relation", "relations", "info", "handleAction"

### `Zc` @L108452 (parent=(无), score=18)
- methods: init, refresh, refreshExtraInfo, refreshRatings
- strings: "暂无印象", "动态", "shop_hot", "</span>&nbsp;|&nbsp;", "<span style='color:", ".png", "ui/icon_", "value", "text", "extraText", "_currentEntry", "#50E3C2", "extraBg", "drawRoundRect", "UIUtils"

### `bd` @L116931 (parent=wd, score=18)
- methods: claimDoubleCoin, claimSeasonReward, defendDan, fetchLeagueInfo
- strings: "赛季奖励", "联赛获胜", "段位保护", "league/info", "league/claimseasonreward", "league/claimdoublecoin", "league/defenddan", "value", "notify", "onLeagueInfoFetched", "_leagueModel", "data", "handleUserMsg", "msgController", "context"

### `Hp` @L126715 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "value", "getVirtualDataByID", "getInventoryExtraItem", "key", "getVirtualItemByID", "common", "id", "type", "getQuality", "getItemDes", "getDes", "getItemName", "getName", "getIcon", "inventory"

### `y_` @L129624 (parent=(无), score=18)
- methods: checkForExitedColliders, clear, onCollisionEnter, onCollisionExit, onCollisionStay, update
- strings: "value", "_target", "onPlayerStay", "collision", "getComponent", "entity", "collider", "key", "onCollisionStay", "onPlayerExit", "onCollisionExit", "onPlayerEnter", "onCollisionEnter", "clear", "_activeCollisions"

### `mg` @L168211 (parent=(无), score=18)
- methods: getNearestLandableCells, getPlayerGroundCell, isEmptyCell, isLandableAt, isLandableAtCell, isPlatformCell, isThrouableAt
- strings: "value", "left", "y", "getCell", "x", "isLandableAtCell", "right", "getPlayerGroundCell", "key", "getNearestLandableCells", "isEmptyCell", "isPlatformCell", "isLandableAt", "isThrouableAt", "areaType"

### `sm` @L172245 (parent=Yg, score=18)
- methods: init, startEdit, startPlay, update
- strings: "value", "update", "_ball", "_eagle", "rotation", "sineInOut", "Ease", "sprite", "fixedTime", "timer", "pingPong", "MathUtils", "scaleX", "entity", "_withSwingAnims"

### `eC` @L191105 (parent=f.MapSizePanelUI, score=18)
- methods: disable, enable, onDirectionButtonClicked, onOKButtonClicked, refreshCurrentSize
- strings: "面积：", "当前：", "value", "visible", "max", "#ffffff", "#FAD347", "updateColor", "currentSize", "maxCount", "concat", "updateText", "currentGridCount", "cellVisualSize", "height"

### `IC` @L197062 (parent=(无), score=18)
- methods: destroy, hide, refresh, show
- strings: "ui/tip_bg_with_frame.png", "value", "ui", "destroy", "stopAllTweensWithContext", "TweenMgr", "key", "visible", "hide", "duration", "afterDelay", "ActionTask", "start", "setContext", "alpha"

### `ew` @L204223 (parent=Rt.State, score=18)
- methods: onEnter, onExit, onInit, onUpdate
- strings: "value", "updateGame", "controller", "context", "f", "e", "update", "done", "n", "s", "players", "_level", "key", "onUpdate", "editNetwork"

### `Bw` @L208865 (parent=(无), score=18)
- methods: handleFetchCompleted, refresh, refreshReportData, startFetch
- strings: "完美", "优秀", "及格", "不及格", "<br/><span style='color:#F48300'>我将胜率牢牢锁在</span>", "&nbsp;场", "<br/>友谊赛&nbsp;", "<br/>联赛&nbsp;", "&nbsp;收工", "&nbsp;上号", "对战间里<br/>你永远邀请不到<br/><span style='color:#F48300'>假装在忙的我</span><br/>坚持非…", "value", "_finalTitle", "remarks", "stats7"

### `US` @L229953 (parent=Rt.State, score=18)
- methods: onEnter, onExit, onInit, onShutdown
- strings: "value", "args", "_nextStateInfo", "changeState", "context", "game", "reloadgame", "matchmaking", "enterHome", "home", "id", "destroyCurrentGame", "reset", "model", "_room"

### `Pi` @L45875 (parent=mt, score=18)
- methods: onCloseButtonClicked, onDisable, onEnable, onHide, setData
- strings: "value", "onHide", "create", "Handler", "playFadeOutTween", "_uiAnim", "key", "onCloseButtonClicked", "tip", "hidePopup", "instance", "_popup", "destroy", "view", "removeChild"

### `Qn` @L54388 (parent=Kn, score=18)
- methods: equip, getBadgesInfoByIDs, getBasicInfo, syncEquippedIDs, uneqiup
- strings: "badge/equip", "badge/getowned", "badge/getprogress", "value", "refreshEquippedIDs", "_badgeModel", "badges", "postWithLimit", "request", "context", "_controller", "key", "syncEquippedIDs", "splice", "indexOf"

### `Pp` @L125976 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "ui-loc/item_title.png", "value", "titleConfig", "key", "getVirtualDataByID", "getTitleByID", "titleModel", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes", "name", "getName"

### `Vp` @L126514 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "pack/", "value", "packs", "key", "getVirtualDataByID", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes", "name", "getName", "icon"

### `Wp` @L126886 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "vip/", "value", "key", "getVirtualDataByID", "getVirtualItemByID", "common", "quality", "vips", "getQuality", "description", "getDes", "name", "getName", "icon"

### `Ug` @L170027 (parent=Ag, score=18)
- methods: completeEdit, disable, enable, onClicked, refresh, updateData
- strings: "关闭", "打开", "get", "_ui", "key", "ui", "_data", "data", "value", "text", "_selected", "state", "refresh", "handleUpdate", "onClicked"

### `fm` @L173130 (parent=Yg, score=18)
- methods: destroy, init, startEdit, startPlay, update
- strings: "crack_r", "crack_l", "value", "x", "_startFlagX", "_flag", "update", "_goalRainbow", "_pingpongSpeedX", "pingPong", "MathUtils", "_rainbow2", "_rainbow1", "key", "reset"

### `hb` @L214453 (parent=rb, score=18)
- methods: fetchInfo, getAlbumInfo, getBadgesInfoByIDs, getBadgesOwn
- strings: "好友", "value", "key", "getAlbumInfo", "getBadgesInfoByIDs", "getBadgesOwn", "handleFetched", "_controller", "userlevel", "exp", "vip", "active", "pvp", "skill", "creative"

### `rS` @L225437 (parent=f.InitialCharacterEntryUI, score=18)
- methods: destroy, init, select, spawnPlayer, unselect
- strings: "value", "scale", "entity", "_player", "visible", "headIcon", "disabled", "changeState", "stage", "spawnPoint", "init", "ui", "character", "updateDan", "id"

### `vt` @L28838 (parent=f.ItemCardUI, score=18)
- methods: onLoaded, refreshExtraInfo, refreshSkin, updateCard, updateExtraInfo
- strings: "_edge.png", "ui/reward_item_", ".png", "value", "text", "_extraInfo", "extraText", "#50E3C2", "extraBg", "drawRoundRect", "UIUtils", "clear", "graphics", "height", "width"

### `Un` @L52627 (parent=(无), score=18)
- methods: getItemByID, getPreviousItem, refresh, reset, unlock
- strings: "暂无", "大师", "高级", "初级", "value", "_unlocked", "key", "reset", "unlock", "_sortedItems", "completed", "length", "refresh", "id", "get"

### `ol` @L87388 (parent=f.UGCLevelEntryUI, score=18)
- methods: setDefault, setEditMode, setItem, setTipsMode
- strings: "ugc_edit_tip", "ui/icon_like.png", "ui/icon_liked.png", "value", "visible", "tipsHud", "text", "defaultUGCEditSlot", "config", "concat", "{{count}}", "replace", "getLocalizationText", "tips", "slotHud"

### `Bh` @L99264 (parent=Ph, score=18)
- methods: agree, delete, info, invite, reject, setting
- strings: "relation/del", "relation/reject", "relation/add", "relation/invite", "relation/setting", "relation/info", "value", "userID", "delete", "handleAction", "_controller", "relationId", "frdId", "post", "request"

### `qp` @L126990 (parent=(无), score=18)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: ".png", "value", "key", "getVirtualDataByID", "getVirtualItemByID", "common", "quality", "getQuality", "description", "getDes", "name", "getName", "icon", "concat", "_type"

### `ws` @L71764 (parent=(无), score=17)
- methods: handleFetchFailed, refresh, resetFetchSetate, setSelfRank, setSelfScore, startFetch
- strings: "value", "_selfScore", "_selfRank", "_list", "isMe", "userID", "profile", "profileModel", "userid", "rank", "map", "key", "refresh", "setSelfScore", "setSelfRank"

### `uh` @L98157 (parent=Rt.ElementComponent, score=17)
- methods: checkEquippedBorderValid, equip, onStart, refreshBorders, refreshGates
- strings: "」试用已到期", "value", "equip", "title", "name", "concat", "showToast", "id", "type", "border", "haveValidItemTrailBuff", "_inventoryModel", "vipborder", "hasVipItem", "vipModel"

### `rv` @L141931 (parent=Df[=LevelComponentBase], score=17)
- methods: disable, enable, onReset, onStartEdit, onStartPlay, update
- strings: "value", "_y", "_x", "reset", "_pingpong", "key", "onReset", "currentOffsetY", "currentOffsetX", "move", "update", "_entities", "onStartEdit", "onStartPlay", "_enabled"

### `tk` @L178798 (parent=Rt.State, score=17)
- methods: onEnter, onExit, onInit, onUpdate, setTarget
- strings: "value", "y", "ghostEntity", "context", "x", "setTargetToPosition", "_targetY", "betterLerp", "MathUtils", "_targetX", "scale", "_targetScale", "_camera", "fixedDeltaTime", "timer"

### `Wk` @L189398 (parent=Rt.ElementComponent, score=17)
- methods: getPathNodesWithMaxSpace, onInit, onStartPlay, pathFind, pathFindFromCell
- strings: "value", "y", "abs", "x", "length", "key", "getPathNodesWithMaxSpace", "spawnCell", "level", "context", "pathFindFromCell", "pathFind", "node", "camera2D", "drawPath"

### `Gw` @L210735 (parent=f.AnnualEndPanelUI, score=17)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "reward.png", "stamps.png", "right.png", "left.png", "value", "key", "getView", "leftPanel", "getLeftPanel", "rightPanel", "getRightPanel", "visible", "hide", "show", "text"

### `Fe` @L39893 (parent=(无), score=17)
- methods: init, initRecordSetting, save, togglaBroadcast, toggleInput, toggleRecord
- strings: "value", "_curSetting", "key", "set", "log", "save", "recordV2", "toggleRecord", "broadcast", "togglaBroadcast", "notify", "onInputTypeChanged", "input", "button", "touch"

### `id` @L114763 (parent=(无), score=17)
- methods: getItemIDByType, hasItem, hasSkill, needRefreshTimeStamp, refresh
- strings: "value", "getDate", "getMonth", "getFullYear", "now", "key", "needRefreshTimeStamp", "f", "e", "id", "type", "done", "n", "s", "items"

### `sn` @L49394 (parent=(无), score=17)
- methods: claim, handleFetched, needFetch, refresh, startFetch
- strings: "value", "_dailyTS", "now", "_dailyClaimed", "claimedAudience", "_ts", "_claimed", "claimed", "rewardFlag", "_canClaim", "canClaim", "_fetchState", "succeed", "key", "refresh"

### `Pa` @L62936 (parent=Rt.ElementComponent, score=17)
- methods: addLiveHpCount, claimDouyinSidebarVisitReward, claimDouyinVisitReward, claimQQStickyReward, onInit, showNoDailyVideoToast
- strings: "暂时没有合适广告，请稍后再试", "请从「我的小程序」进入游戏", "toast_novideoquota", "value", "addLiveHpCount", "_service", "key", "title", "getLocalizationText", "showToast", "noSuitableAd", "noVideoAdReason", "dailyVideoData", "dailyModel", "context"

### `Yb` @L222864 (parent=(无), score=17)
- methods: holdLeftPress, startBasicAnim, startLeftPressAnim, startRightPressAnim, stopAllAnim
- strings: "/tutorial/tutorial_phone.png", "value", "_pointer2", "setContext", "startRotateToAnim", "stopAllTweensWithContext", "TweenMgr", "key", "startRightPressAnim", "_pointer1", "startLeftPressAnim", "rotation", "holdLeftPress", "startBasicAnim", "stopAllTweensWithTarget"

### `Pt` @L31454 (parent=f.ItemCommonEntryUI, score=17)
- methods: init, refresh, refreshGainInfo, refreshProgressHud
- strings: ".png", "ui/reward_item_", "value", "visible", "canGain", "_item", "canEquip", "progressHud", "scaleX", "min", "progressBar", "debrisNeed", "config", "totalDebrisCountNeed", "gainByDebirs"

### `_e` @L36565 (parent=(无), score=17)
- methods: close, destroy, open, refreshProgress, register, unregister
- strings: "value", "notify", "onClose", "_isOpened", "key", "close", "onOpen", "open", "_currentProgress", "refreshProgress", "unregister", "_delegate", "register", "destroy", "get"

### `ge` @L36783 (parent=(无), score=17)
- methods: destroy, init, onScoreChanged, refreshProgress, register, unregister
- strings: "value", "close", "_gateItem", "open", "target", "data", "currentProgress", "min", "refreshProgress", "max", "isCumulative", "_scoreItem", "key", "onScoreChanged", "removeListener"

### `Ei` @L46078 (parent=Rt.ElementStageView, score=17)
- methods: onCloseButtonClicked, onDestroy, onDisable, onEnable, onInit
- strings: "value", "report", "hidePopup", "popupController", "context", "create", "Handler", "playFadeOutTween", "_anim", "hide", "_contactButton", "key", "onCloseButtonClicked", "_popup", "destroy"

### `fa` @L61283 (parent=(无), score=17)
- methods: encode, getExpByType, give, refresh, updateTag
- strings: "佛系", "贵族系", "活跃系", "对战系", "操作系", "创造系", "value", "_tag", "vip", "active", "pvp", "skill", "creative", "get", "forEach"

### `yr` @L78756 (parent=f.UGCAlbumThumbListUI, score=17)
- methods: destroy, disable, enable, onEntryClicked
- strings: "请先发布地图再创建合集", "value", "title", "showToast", "show", "uploadedLevelCount", "_ugcModel", "length", "localIDs", "_model", "canActionAlbum", "vipModel", "id", "key", "onEntryClicked"

### `Xp` @L126937 (parent=(无), score=17)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "value", "getVirtualDataByID", "getTrialRelatedItem", "key", "getVirtualItemByID", "id", "type", "getQuality", "getItemDes", "getDes", "getItemName", "getName", "getIcon", "give"

### `X_` @L133503 (parent=(无), score=17)
- methods: destroy, getSprite, load, play, reset, setContext, unload
- strings: "value", "key", "getSprite", "play", "destroy", "unload", "length", "textureUrls", "load", "setContext", "reset", "addChild", "call", "Sprite"

### `Jm` @L178541 (parent=Rt.AbstractCameraBehavior, score=17)
- methods: debugDraw, enableDebug, getDesiredPositionDelta, reset
- strings: "value", "#212121", "height", "width", "y", "x", "drawRect", "graphics", "clear", "_debugCollider", "key", "debugDraw", "addChild", "node", "camera"

### `$m` @L178731 (parent=Rt.State, score=17)
- methods: onEnter, onExit, onInit, onUpdate, setTarget
- strings: "value", "player", "setTargetToPlayer", "context", "_targetScale", "scale", "key", "setTarget", "clampCameraPosition", "_regionController", "lateUpdate", "_cameraKit", "betterLerp", "MathUtils", "_camera"

### `Ma` @L62823 (parent=(无), score=17)
- methods: addCount, addFailCount, haveQuota, refreshCount, update
- strings: "value", "lastFailTimestamp", "_lastFailTimestamp", "failCount", "_failCount", "count", "_count", "timestamp", "_timestamp", "dailyVideoAd", "set", "key", "update", "now", "isBeforeToday"

### `Ps` @L72983 (parent=Cs, score=17)
- methods: handleFetchResult, refresh, refreshConfig, reset, startFetch
- strings: "value", "reset", "_passItem", "key", "buy", "rankrush", "refresh", "_fetchState", "none", "call", "refreshConfig", "prototype", "fetch", "notify", "onAction"

### `B_` @L131733 (parent=(无), score=17)
- methods: decode, decodePlayerMoveState, decodeTimestamp, encode, encodeTimestamp
- strings: "get", "_tsCompression", "maxTS", "IntCompression", "key", "tsCompression", "_posCompression", "maxPosValue", "posCompression", "value", "bitCount", "ts", "clamp", "MathUtils", "compressAndWrite"

### `dw` @L205710 (parent=(无), score=17)
- methods: onPongReceived, reset, sendPingCommand, update
- strings: "value", "_averageRtt", "length", "_rtts", "f", "e", "done", "n", "s", "push", "splice", "maxRttCount", "_lastSentPingTime", "_lastReceivePongTime", "now"

### `Rw` @L210141 (parent=f.AnnualCoverPanelUI, score=17)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "cover.png", "value", "key", "getView", "getLeftPanel", "getRightPanel", "visible", "hide", "show", "text", "getLimitedNickName", "nickName", "skin", "avatarUrl", "avatar"

### `j` @L25623 (parent=(无), score=16)
- methods: disable, enable, refresh, refreshLoading, setData
- strings: "value", "text", "title", "_ui", "width", "max", "panel", "_data", "key", "refreshLoading", "refresh", "destroy", "view", "removeChild", "_parent"

### `Nd` @L119303 (parent=f.CharacterScreenShotUI, score=16)
- methods: getCanvas, init, spawn, spawnItem, updatePlayerAnim
- strings: "Lv.", "value", "idle", "showPersonality", "personality", "celebrate", "skeleton", "avatar", "player", "key", "updatePlayerAnim", "characterscreenshot", "spawnItem", "spawnPoint", "length"

### `yv` @L143631 (parent=(无), score=16)
- methods: onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, setAngularVelocity
- strings: "value", "key", "onPlayerExitCollider", "_linearVelocity", "addExtraMotion", "model", "y", "fixedDeltaTime", "timer", "x", "normal", "horizontalInputCmd", "up", "Vector", "unsignedAngle"

### `rh` @L97675 (parent=ah, score=16)
- methods: fetchHistories, fetchHistory, fetchReplay, fetchTopPvpList, fetchTopPvpsByIDs
- strings: "ui/defaultavatar.png", "value", "key", "fetchTopPvpsByIDs", "fetchTopPvpList", "fetchReplay", "fetchHistory", "handleHistoriesFetched", "_controller", "push", "players", "characterID", "0001", "isWin", "rank"

### `yh` @L98390 (parent=f.AvatarUI, score=16)
- methods: refresh, refreshAvatarInfo, refreshDanInfo, setEmpty
- strings: "ui/defaultavatar.png", ".png", "/avatar_frame_", "/badge_s_", "value", "visible", "clanBadge", "danIcon", "scale", "avatar", "height", "width", "size", "skin", "type"

### `Rc` @L106660 (parent=(无), score=16)
- methods: refresh, resetFetchState, updateFullState, updateState
- strings: "value", "_timeStamp", "now", "_isTeamMode", "team", "pvpMode", "floor", "_matchEndType", "_matchMode", "_memberCount", "memberCount", "_state", "state", "owner", "refresh"

### `Rm` @L175388 (parent=Pm, score=16)
- methods: getHaveBoss, init, startEdit, startPlay, update
- strings: "value", "move", "_hoistPlatform", "call", "update", "prototype", "key", "startEdit", "_forceRobotSpeed", "setOverrideSpeed", "_boss", "startPlay", "getParent", "tryInitBoss", "attachLevelComponent"

### `tt` @L26501 (parent=(无), score=16)
- methods: handleResponse, handleTimeout, start, stop
- strings: "value", "OverTime", "handleResponse", "_isTimeout", "key", "handleTimeout", "result", "code", "_fail", "_success", "Success", "removeRequestCount", "request", "_disableInput", "notify"

### `ye` @L36730 (parent=(无), score=16)
- methods: destroy, init, onUpdate, refreshProgress, register, unregister
- strings: "value", "open", "_gateItem", "target", "data", "currentProgress", "refreshProgress", "level", "levelInfo", "_userLevelModel", "key", "onUpdate", "removeListener", "unregister", "addListener"

### `Bi` @L45942 (parent=(无), score=16)
- methods: createCommonButton, createLabel, destroy
- strings: "确定", ".png", "/common/", "_80.png", "/common/btn_", "loading/vscroll_common.png", "/common/rect_gray_radius_0.png", "/common/rect_white_radius_16.png", "value", "centerX", "left", "width", "addChild", "bottom", "top"

### `Nn` @L53114 (parent=f.TrainingEntryUI, score=16)
- methods: destroy, init, refresh
- strings: "奖励", "点击领取", "已领取", "training_icon.png", "value", "call", "destroy", "prototype", "stopAllTweensWithContext", "TweenMgr", "key", "refresh", "updateCard", "lockedMask", "card"

### `Jr` @L86188 (parent=f.UGCEntryUI, score=16)
- methods: refreshRank, setDefault, setEmpty, setItem
- strings: "ui/icon_like.png", "ui/icon_liked.png", "value", "visible", "rank", "other", "third", "second", "first", "text", "concat", "key", "refreshRank", "empty", "content"

### `Dl` @L92786 (parent=f.DailyChallengeProgressHudUI, score=16)
- methods: destroy, refresh, shake
- strings: "有新关卡", "宝箱 ", "完成 ", "待领取", "value", "start", "setContext", "rotation", "icon", "setCompletionHandler", "PingPong", "LoopType", "setLoops", "setFrom", "tweenProps"

### `Fl` @L93809 (parent=f.DailyChallengeEntryUI, score=16)
- methods: getDifficultyBg, refresh, setItem
- strings: "关 点击挑战", "已完成 宝箱已领取", "进行中 ", "点击领奖", "挑战解锁", "完成", "ui/rect_radius4_purple.png", "ui/rect_radius4_red.png", "ui/rect_radius4_blue.png", "ui/rect_radius4_cyan.png", "_h180.png", "ui/task_", "value", "insane", "hard"

### `ru` @L109571 (parent=f.ShopFeatureEntryUI, score=16)
- methods: init, refresh, refreshExtraInfo
- strings: "送试用", "动态", "外观", "</span>&nbsp;|&nbsp;", "<span style='color:", ".png", "ui/icon_", "value", "text", "extraText", "#50E3C2", "extraBg", "drawRoundRect", "UIUtils", "clear"

### `Zd` @L121198 (parent=Qd, score=16)
- methods: claimDebrisByVideo, dropDebrisByVideo, equip, helpGiveDebris, unlock
- strings: "测试", "value", "key", "dropDebrisByVideo", "claimDebrisByVideo", "debrishelppopup", "showPopup", "popupController", "context", "_controller", "count", "type", "characterdebris", "id", "handleDebrisHelpResult"

### `Lp` @L125929 (parent=(无), score=16)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "value", "key", "getVirtualDataByID", "getVirtualItemByID", "common", "getQuality", "getDes", "getName", "getIcon", "give"

### `LC` @L197402 (parent=f.PartyComponentEntryUI, score=16)
- methods: init, refreshBasicInfo, refreshSelectState
- strings: "value", "gray", "selected", "_partyComponent", "_icon", "visible", "bgSelected", "componentName", "selectedMask", "special", "category", "_config", "bgBomb", "hazards", "bgHazards"

### `Nt` @L33397 (parent=(无), score=16)
- methods: destroy, init, showEffect, tryCreateEffect
- strings: "Confetti.part", "value", "stop", "_effect", "afterDelay", "ActionTask", "addChild", "Particle2D", "getRes", "loader", "type", "JSON", "Loader", "url", "startLoad"

### `Jt` @L35363 (parent=(无), score=16)
- methods: clear, handleLoadFailed, handleLoadSuccess, nextTask, start, startCurrentTask
- strings: "value", "_fail", "_success", "key", "handleLoadSuccess", "handleLoadFailed", "startCurrentTask", "length", "_dataGroup", "_currentIndex", "_update", "nextTask", "can not cache", "start", "_currentTask"

### `Jn` @L54480 (parent=Kn, score=16)
- methods: equip, getBadgesInfoByIDs, getBasicInfo, uneqiup
- strings: "value", "refreshEquippedIDs", "_badgeModel", "splice", "indexOf", "slice", "equippedIDs", "key", "uneqiup", "equip", "notify", "onGetBasicInfo", "badgesEquipped", "badgesOwned", "refreshBasicInfo"

### `Am` @L175449 (parent=Yg, score=16)
- methods: init, startEdit, startPlay, update
- strings: "value", "y", "_startFlagY", "_flag", "move", "_fallbase2", "_fallbase1", "falldownSpeed", "key", "update", "startEdit", "startPlay", "flag", "getGoalArea", "attachLevelComponent"

### `ve` @L36673 (parent=(无), score=16)
- methods: destroy, init, onFromMpChanged, refreshProgress, register, unregister
- strings: "value", "open", "_gateItem", "target", "data", "currentProgress", "refreshProgress", "key", "onFromMpChanged", "fromMp", "lifeCycleController", "getInstance", "removeListener", "unregister", "addListener"

### `me` @L36850 (parent=(无), score=16)
- methods: destroy, init, onUpdate, refreshProgress, register, unregister
- strings: "value", "open", "_gateItem", "target", "data", "currentProgress", "refreshProgress", "own", "itemID", "getCharacterByID", "characterModel", "key", "onUpdate", "addListener", "unregister"

### `Mn` @L51480 (parent=In, score=16)
- methods: claimReward, fetchTrainingData, fetchTrainingLevels, passChallengeLevel
- strings: "value", "key", "passChallengeLevel", "data", "rewards", "training", "skill", "basic", "handleRewardClaimed", "_controller", "slice", "items", "pickOne", "random", "push"

### `Zk` @L190740 (parent=(无), score=16)
- methods: activate, destroy, lerpVolume, playSound, updateVolume
- strings: "value", "_soundChannel", "destroy", "_currentVolume", "_targetVolume", "_activeFrame", "key", "_activeTime", "now", "activate", "play", "setVolume", "active", "length", "playSound"

### `ke` @L36903 (parent=(无), score=15)
- methods: destroy, init, onVipChanged, refreshProgress, register, unregister
- strings: "value", "open", "_gateItem", "target", "data", "currentProgress", "refreshProgress", "vip", "localClan", "clanModel", "key", "onVipChanged", "addListener", "unregister", "register"

### `Md` @L117498 (parent=f.DanUnlockEntryUI, score=15)
- methods: setComponentData, setFeatureData, setMapData
- strings: "特殊能力", "5局", "组件旋转", ".png", "ui/dan_feature_", ".jpg", "/icon_", "value", "visible", "bgBomb", "bgHazards", "bgPlatform", "changeText", "componentSize", "fontSize"

### `lb` @L214358 (parent=rb, score=15)
- methods: fetchInfo, getAlbumInfo, getBadgesInfoByIDs, getBadgesOwn
- strings: "userrole/albuminfo", "userrole/badgeprogress", "userrole/badgeowned", "userrole/detailinfo", "value", "refreshAlbumIDs", "getInfo", "_controller", "notify", "onAlbumFetched", "addAlbums", "_albumModel", "albums", "data", "userId"

### `Tf` @L136075 (parent=(无), score=15)
- methods: reset, setMaxRotation, setSpeed, setSpeedBy360, update
- strings: "value", "rotation", "_currentRotation", "_angularVelocity", "_swingDir", "ease", "_maxRotation", "_pingpongSpeed", "pingPong", "MathUtils", "key", "update", "reset", "setMaxRotation", "_speed"

### `Ng` @L170135 (parent=Ag, score=15)
- methods: completeEdit, disable, enable, onClicked, updateData
- strings: "get", "_ui", "key", "ui", "_data", "data", "value", "action", "onClicked", "completeEdit", "destroy", "CLICK", "Event", "off", "button"

### `Wb` @L222569 (parent=f.MapEntryUI, score=15)
- methods: initEntry, refresh, select, unselect
- strings: "随机地图", ".jpg", "/icon/", "value", "visible", "_price", "_unlocked", "freeTag", "concat", "updateText", "price", "priceHud", "config", "getMapPrice", "key"

### `se` @L36255 (parent=Rt.ElementStageView, score=15)
- methods: onDestroy, onDisable, onEnable, onInit
- strings: "value", "_ad", "destroy", "hide", "_isLoaded", "key", "onDisable", "onError", "show", "top", "height", "windowHeight", "systemInfo", "style", "left"

### `lu` @L109670 (parent=f.FreeGemShopItemEntryUI, score=15)
- methods: init, refresh, update
- strings: "今日可领 ", "value", "scaleX", "max", "progressBar", "freeGemClaimCD", "config", "now", "text", "LocalizeFormatTime", "concat", "countdown", "visible", "countdownHud", "adButton"

### `iC` @L191227 (parent=f.MapMovePanelUI, score=15)
- methods: disable, enable, onDirectionButtonClicked, onOKButtonClicked, show
- strings: "value", "stopMoveMap", "_editTouch", "key", "onOKButtonClicked", "moveMap", "right", "left", "down", "up", "onDirectionButtonClicked", "CLICK", "Event", "off", "okButton"

### `cl` @L88610 (parent=f.HpHudUI, score=15)
- methods: disable, enable, onHpChanged, refresh
- strings: "直播中 体力无限", "生效中", "value", "text", "max", "hpProfile", "_ugcModel", "concat", "hp", "hpProgressText", "width", "hpProgress", "min", "key", "onHpChanged"

### `yo` @L55604 (parent=f.BroadcastMsgUI, score=15)
- methods: clear, refresh, refreshClanInviteMsg, refreshUGCMsg
- strings: "战队招人了", "邀请人：", " 邀请你玩 ", "ui/icon_broadcast_white.png", "value", "text", "clanName", "args", "concat", "levelName", "msg", "nickName", "sender", "getLimitCountText", "UIUtils"

### `af` @L134765 (parent=ef, score=15)
- methods: onEnter, onExit, onInit, onUpdate
- strings: "value", "editingVisible", "_headIcon", "visible", "key", "onExit", "update", "top", "x", "center", "pos", "entity", "context", "viewBounds", "currentEditComponent"

### `Sb` @L217098 (parent=f.RelationEntryUI, score=15)
- methods: canViewDetail, initEntry, refresh
- strings: "_semi.png", "ui/rect_radius4_", "value", "slotGroup", "horizonalLayout", "UIUtils", "push", "_entries", "width", "left", "centerY", "addChild", "right", "slotCount", "intimacyHud"

### `Ed` @L117969 (parent=Bd, score=14)
- methods: equip, getRatings, unlock
- strings: "characterskin/getratings", "characterskin/equip", "characterskin/buy", "value", "notify", "onGetRatings", "_characterSkinModel", "skinRatings", "data", "refreshCharacterSkinRatings", "ids", "post", "request", "context", "_controller"

### `Tn` @L51399 (parent=In, score=14)
- methods: claimReward, fetchTrainingData, fetchTrainingLevels, passChallengeLevel
- strings: "training/passchallengelevel", "training/claimreward", "training/getskilldata", "training/info", "value", "handleChallengeLevelPassed", "_controller", "ugcLvId", "useSecondPrice", "post", "request", "context", "key", "passChallengeLevel", "handleRewardClaimed"

### `mh` @L98555 (parent=Rt.ElementComponent, score=14)
- methods: equip, onStart, refreshEmojiEquips, refreshEmojis, refreshGates
- strings: "value", "equip", "_service", "key", "refreshEmojiEquips", "_emojiModel", "refreshEmojis", "refreshProgress", "delegate", "gate", "forEach", "emojiList", "refreshGates", "emoji", "getModel"

### `wu` @L112233 (parent=Rt.ElementComponent, score=14)
- methods: equip, onStart, refreshGates, refreshReddot, refreshTitles
- strings: "value", "equip", "_service", "key", "refreshTitles", "_titleModel", "refreshProgress", "delegate", "gate", "forEach", "titleList", "refreshGates", "refreshReddot", "title", "getModel"

### `Zm` @L178652 (parent=Rt.ElementBehaviour, score=14)
- methods: clampCameraPosition, onInit, reset, updateDragRegion
- strings: "value", "_currentDragRegion", "Rectangle", "height", "stage", "width", "scaleY", "_camera", "bottom", "y", "scaleX", "right", "x", "_bounds", "key"

### `Ci` @L43840 (parent=(无), score=14)
- methods: createCommonButton, createLabel
- strings: "同意", "不同意", "请阅读完全部内容后点击接受", "隐私政策", "用户协议", "用户协议及隐私保护指引", ".png", "/common/", "_80.png", "/common/btn_", "loading/vscroll_common.png", "/common/rect_gray_radius_0.png", "/common/rect_white_radius_16.png", "value", "centerX"

### `Ko` @L58406 (parent=f.ItemEntryUI, score=14)
- methods: refresh, tryUpdateDebrisProgress
- strings: "ui/rect_radius4_D0021B.png", "ui/rect_radius4_7ED321.png", "value", "visible", "tagNew", "progressHud", "progressFull", "text", "concat", "progressText", "scaleX", "min", "progressBar", "skin", "skindebris"

### `ca` @L60349 (parent=la, score=14)
- methods: fetchMails, readMail
- strings: "服务器故障补偿", "官方奖励", "哇哇哇", "value", "rewards", "handleMailRead", "_controller", "key", "readMail", "handleMailsFetched", "seqNum", "ts", "now", "status", "event"

### `Ea` @L62996 (parent=Ba, score=14)
- methods: addLiveHpCount, claimDouyinSidebarVisitReward, claimDouyinVisitReward, claimQQStickyReward
- strings: "奖励已领取", "hp/addgamelivehpcount", "douyin/claimsidebarreward", "douyin/claimvisitreward", "qq/claimstickyrewardv2", "value", "data", "handleUserMsg", "msgController", "context", "_controller", "post", "request", "key", "addLiveHpCount"

### `Oa` @L63726 (parent=f.ClanEntryUI, score=14)
- methods: refreshState, setDefault, setItem
- strings: "已满员", "已申请", "申请", "加入", "value", "gray", "_item", "canJoin", "clanModel", "joinButton", "text", "state", "applied", "visible", "capacity"

### `jr` @L84904 (parent=(无), score=14)
- methods: adaptVersion, checkDuplicatedIndex, saveToLocal
- strings: "value", "index", "reassign duplicated index", "warn", "length", "f", "e", "set", "push", "has", "max", "done", "n", "s", "key"

### `Zr` @L86272 (parent=f.UGCLevelHudUI, score=14)
- methods: refresh, setDefault
- strings: " · ", "ui/icon_unknown.png", "ugc_stats_winrate", "ugc_stats_heat", "ui/ugc_tagicon.png", "ui/icon_likecomment_white.png", "ui/rect_radius4_yellow.png", "ui/rect_radius4_DD6073.png", ".png", "ui/icon_", "value", "visible", "starLevel", "text", "levelInfo"

### `Sl` @L91498 (parent=f.UGCCommentEntryUI, score=14)
- methods: refresh, setData
- strings: "已举报", "\b已屏蔽", "点评", "戳了个章", ".png", "ui/icon_", "value", "text", "blocked", "_data", "hiddenText", "visible", "hiddenState", "right", "stickyState"

### `eh` @L97136 (parent=(无), score=14)
- methods: getPlayerDataByID, updateState
- strings: "value", "_hasReplay", "pvpHistoryValidDay", "config", "_timestamp", "now", "key", "updateState", "f", "e", "userID", "userProfile", "done", "n", "s"

### `hh` @L98026 (parent=f.TopPvpEntryUI, score=14)
- methods: getTimestampStr, init
- strings: " · ", "联赛", "建房赛", "血战到底", "传统5局", "自由血战", "单人赛", "组队赛", "history_time_day", "history_time_hour", "history_time_minute", "value", "concat", "{{time}}", "replace"

### `Dc` @L106574 (parent=f.RoomEntryUI, score=14)
- methods: refresh, setItem
- strings: "双人闯关", "血战到底", "传统5局", "自由血战", "已结束", "游戏中", "等待玩家加入...", "已满员", " 的房间", ".jpg", "/icon/", "value", "visible", "isTeamMode", "_item"

### `Jc` @L108351 (parent=(无), score=14)
- methods: init, refresh
- strings: "今日已购买", "今日已领取", ".png", "ui/icon_", "value", "price", "_data", "buyWithAD", "updateText", "hasBuyText", "_currentEntry", "visible", "hasBuy", "locked", "centerX"

### `Hu` @L113651 (parent=f.SocialEntryUI, score=14)
- methods: init, setEmptyState
- strings: "ui/btn_invite_normal.png", "ui-loc/btn_invite.png", ".png", "ui/icon_", "/badge_s_", "value", "_isEmpty", "visible", "empty", "content", "skin", "isOnWechat", "inviteButtonImage", "key", "setEmptyState"

### `zu` @L113742 (parent=f.MeEntryUI, score=14)
- methods: refresh, refreshRankInfo
- strings: "本周操作排名 {{rank}}", "操作排名 {{rank}}", "本周创造排名 {{rank}}", "创造排名 {{rank}}", "联赛排名 {{rank}}", "social_notinrank", "social_friend_ranking", ".png", "ui/icon_", "/badge_s_", "value", "text", "getLocalizationText", "rank", "getRankText"

### `Td` @L117408 (parent=f.DanIntroEntryUI, score=14)
- methods: refreshEntry, setItem
- strings: "value", "unlocked", "_item", "length", "maps", "components", "setComponentData", "setMapData", "features", "setFeatureData", "key", "refreshEntry", "width", "fontSize", "danDefendScore"

### `hC` @L192367 (parent=Rt.ElementStageView, score=14)
- methods: onDisable, onEnable, onInit, refresh
- strings: "game/grid.png", "value", "_image", "removeChildren", "_root", "key", "onDisable", "zOrder", "grid", "cacheAsBitmap", "addChild", "y", "x", "height", "width"

### `nb` @L213484 (parent=Rt.ElementComponent, score=14)
- methods: handleUserMsg, onStart
- strings: "value", "refreshFromLocal", "characterModel", "context", "clan", "setBasicInfo", "localClan", "clanModel", "id", "initClanInfo", "training", "refresh", "getModel", "flagData", "refreshFlags"

### `Tt` @L30385 (parent=f.ItemCommonTabUI, score=14)
- methods: refresh, setAppearanceItem, setCharacterItem, setUnown
- strings: "未解锁", "ui/rect_radius4_152C56.png", "ui/rect_radius4_white.png", "value", "visible", "reddot", "selected", "bg", "icon", "centerX", "label", "left", "alpha", "text", "_tabID"

### `ab` @L213963 (parent=(无), score=14)
- methods: refresh, resetPvpStore, timesReward
- strings: "value", "count", "id", "pvpscore", "type", "push", "_rewards", "oldRatings", "floor", "ratings", "length", "videopack", "packs", "packRewards", "expTotalInc"

### `Ec` @L106515 (parent=Pc, score=14)
- methods: fetchRoomByIDs, fetchRoomList, getRandomRoom
- strings: "ugc_1", "avatar://000", "value", "12345", "key", "getRandomRoom", "handleRoomListFetched", "_controller", "concat", "push", "fetchRoomList", "handleRoomsFetched", "pvpMode", "levelId", "id"

### `od` @L115094 (parent=f.VIPBuyButtonUI, score=14)
- methods: disable, enable, onClicked, refresh
- strings: "ui/icon_vip_deactive.png", "ui/icon_vip_active.png", "value", "vipbuy", "showPopup", "popupController", "_from", "setData", "getView", "key", "onClicked", "_handleClicked", "refresh", "removeListener", "onVipUpdate"

### `OC` @L200950 (parent=f.UGCTopRankEntryUI, score=14)
- methods: refresh, refreshPvpAvatars, refreshSingleAvatar
- strings: "value", "setEmpty", "avatar", "fontSize", "nickName", "width", "profile", "_player", "getLimitCountText", "UIUtils", "updateText", "refresh", "valid", "key", "refreshSingleAvatar"
