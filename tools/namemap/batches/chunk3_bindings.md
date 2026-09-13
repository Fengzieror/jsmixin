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

# 绑定块 3/6（152 个，已按证据分数降序）

### `Nk` @L188749 (parent=Rt.ElementBehaviour, score=30)
- methods: findAndFollowNextTargetPlayer, lateUpdate, onInit, reset, scheduleSwitchCameraTarget, setTargetToLocalPlayer, setTargetToPlayer, startEdit, startPlay, switchTargetToPlayer
- strings: "」的表演", "请看「", "value", "player", "context", "setTargetToPlayer", "key", "setTargetToLocalPlayer", "_nextSwitchTargetPlayerTime", "_camera", "findAndFollowNextTargetPlayer", "time", "timer", "length", "players"

### `Cw` @L206080 (parent=Rt.ElementModel, score=30)
- methods: getOpponentProfile, initOpponentsProfiles, reset, setDisconnected, setOpponentJoined, setOpponentLeft, setOriginMatchInfo, setRoomJoined, updateDouyinChannel, updateOpponentAvatar
- strings: "unicode_unescape", "value", "notify", "onShutdown", "_localProfile", "_opponentProfiles", "_lastShutdownReason", "key", "setDisconnected", "isDouyinGroupRoom", "douyinTaskRoomID", "_douyinChannelID", "_isOpponentsAllAI", "_matchData", "reset"

### `sb` @L214090 (parent=Rt.ElementComponent, score=30)
- methods: fetchInfo, getAlbumInfo, getBadgesInfoByIDs, getBadgesOwn, getInfo, handleFetched, needFetch, onInit, refreshClanInfo, tryAddAIDetailInfo
- strings: "value", "notify", "onBadgesInfoFetched", "getBadgesInfoByIDs", "_service", "length", "push", "indexOf", "needRefresh", "getBadgeByID", "forEach", "getInfo", "key", "onBadgesOwnFetched", "getBadgesOwn"

### `nS` @L224160 (parent=f.EmojiPanelUI, score=30)
- methods: disable, enable, onEarButtonClicked, onEmojiClicked, onMicButtonClicked, onVolPChatStateChanged, refresh, refreshEmojis, slideIn, slideOut
- strings: "听筒 关", "听筒 开", "连麦 关", "连麦中", "连麦 开", "ui/icon_ear_off.png", "ui/icon_ear_on.png", "ui/icon_mic_off.png", "ui/icon_mic.png", "ui/icon_mic_on.png", "value", "onVolPChatStateChanged", "bottom", "voiButtonGroup", "slidePanel"

### `OS` @L229749 (parent=(无), score=30)
- methods: disable, enable, joinRoom, onDisconnectedFromRoom, onFailToEnterPvpRoom, onGetStartMatchMsg, onKickOutReasonChange, onStartDropIn, rejoinRoom, updateAvatar
- strings: "room_kickout_matchfull", "room_kickout_matchnotexist", "toast_rejoingame", "toast_rejoingame_failed", "value", "startDropInBeforeGameCreated", "key", "onStartDropIn", "matchData", "_roomModel", "enterPvpGame", "clearFade", "cloudTransition", "player gets startMatch before game is created", "warn"

### `Xt` @L34277 (parent=(无), score=30)
- methods: handleLoadComplete, handleLoadProgress, handleTimeout, onComplete, onFail, reload, startLoad, startLoadWithBackupUrls, stop, stopAndClearAssets
- strings: "value", "stop", "_onProgress", "_onFailed", "_onComplete", "key", "onFail", "onComplete", "reload", "_currentTryIndex", "load assets timeout, retry", "warn", "timeout", "_maxRetryCount", "handleTimeout"

### `ni` @L41581 (parent=(无), score=29)
- methods: decodeResponse, decodeToObject, decodeToString, encodeObjectToString, encodeStringToString, encodeToQueryString, encodeToString, initialize, initialize_debug, setSecretKey
- strings: "decode failed.", "application/bcdata", "initialize_debug", "value", "debug", "data", "decodeToObject", "Content-Type", "header", "key", "decodeResponse", "get", "_secretKey", "secretKey", "_publicKey"

### `tC` @L190990 (parent=Rt.ElementStageView, score=29)
- methods: clear, onBackButtonClicked, onDisable, onEnable, onStart, refreshBackMode, refreshCurrency, refreshCurrencyMode, setRewardCurrency, showAnim
- strings: "value", "_backButtonAction", "key", "onBackButtonClicked", "showAnim", "currenchPanel", "_ui", "refreshCurrency", "visible", "setRewardCurrency", "centerY", "title", "editPopup", "playerInfo", "centerX"

### `Om` @L175530 (parent=Dm, score=29)
- methods: getHaveBoss, init, notAllowBottomToAttach, reset, rotateHinge1, startEdit, startPlay, update, updateSmallAsteroidPosition
- statics: angularVelocity
- strings: "value", "landmine", "type", "down", "dir", "key", "notAllowBottomToAttach", "updateSmallAsteroidPosition", "rotateHinge1", "initialY", "_hinge2", "initialX", "pos", "entity", "_hinge1"

### `s_` @L128075 (parent=(无), score=28)
- methods: changeState, customShare, deleteRecord, getRecordState, getVideoInfo, init, pause, recordClip, resume, start, stop
- strings: "value", "key", "deleteRecord", "notify", "onStateChanged", "_state", "] to [", "**change record state from [", "log", "changeState", "getRecordState", "customShare", "getVideoInfo", "recordClip", "recording"

### `_n` @L50190 (parent=f.GameLiveShopPanelUI, score=28)
- methods: disable, enable, initItems, onBuy, onBuyButtonClicked, onDailyItemsFetched, onEntryClicked, onEntryIconClicked, refreshEntry
- strings: "不足", "日内只可购买", "value", "id", "item", "getBuyCount", "_shopModel", "refresh", "forEach", "entries", "list", "key", "onBuy", "f", "e"

### `qn` @L54159 (parent=Rt.ElementModel, score=28)
- methods: encode, getItemByID, isEquipped, onInit, refreshBadges, refreshBasicInfo, refreshEquippedIDs, refreshOwnIDs, reset
- strings: "value", "key", "reset", "_basicInfoFetchState", "none", "_basicInfoFetchTS", "id", "set", "_items", "forEach", "badges", "_ownIDs", "_equippedIDs", "onInit", "notify"

### `oa` @L59925 (parent=Rt.ElementModel, score=28)
- methods: handleFetched, handleMailRead, onInit, onStart, reset, resetFetchState, resetRelationFetchSate, setClanApplyState, startFetch
- strings: "value", "clanID", "args", "event", "setClanApplyState", "_clanModel", "key", "handleFetchResult", "relationItem", "userID", "profile", "getInfo", "_userDetailController", "item", "_relationModel"

### `tr` @L76238 (parent=f.BattlePassLevelRewardEntryUI, score=28)
- methods: despawnPlayer, destroy, pointToReward, refresh, showStarGlow, spawnPlayer, startClaimAnim, stopClaimAnim, stopStaring
- strings: "/battlepass/icon_pass_reward.png", "value", "_player", "destroy", "key", "despawnPlayer", "scaleY", "entity", "scaleX", "visible", "headIcon", "personality", "dispatch", "currentMoveStateCmd", "model"

### `Ol` @L93637 (parent=(无), score=28)
- methods: destroy, disable, enable, onDailyChallengeFetched, onEntryClicked, onGroupRewardClaimed, onRewardPanelClicked, onTotalRewardClaimed, refresh
- strings: "完成全部挑战 可领取1枚印花", "已全部通关，点击领取印花", "已全部通关，印花已领取", "完成全部挑战可领取", "挑战解锁", "完成", "value", "refresh", "id", "count", "type", "showRewardToast", "ErrRewardClaimed", "key", "onTotalRewardClaimed"

### `rc` @L103519 (parent=sc, score=28)
- methods: agreeApplication, deleteFriend, denyApplication, fetchFriends, getFriendsIntimacy, searchFriend, sendApplication, sendFriendMessage, sendPvpInvitation
- strings: "friends/getintimacy", "friends/add", "friend_toast_max", "value", "handleIntimacySyncResult", "_controller", "friends", "data", "ids", "post", "request", "_context", "replace", "stringify", "length"

### `mc` @L105264 (parent=Rt.ElementStageView, score=28)
- methods: idle, onBuySucceeded, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onShow, setData
- strings: "/native/create_order_qrcode", "value", "onHide", "key", "onBuySucceeded", "onCloseButtonClicked", "idle", "id", "hidePopup", "popupController", "context", "onShow", "_ui", "destroy", "removeChild"

### `Pd` @L117839 (parent=Rt.ElementComponent, score=28)
- methods: checkEquippedSkinValid, equip, equipLocal, getRatings, onStart, refreshCharacterSkins, trialSkinLocal, unequipLocal, unlock
- strings: "」试用已到期", "value", "characterID", "equip", "title", "name", "concat", "showToast", "id", "type", "characterskin", "haveValidItemTrailBuff", "_inventoryModel", "haveSpecialSkinTrailBuff", "vipskin"

### `vp` @L125082 (parent=Rt.ElementComponent, score=28)
- methods: addView, backToPrevious, clear, isInStack, jumpToAppearanceView, jumpToCharacterView, jumpToShopView, onInit, showView
- strings: "稍后再说", "前往装扮", "是否前往装扮界面使用新的", "btn_cancel_later", "btn_confirm_ok", "modal_content_equip_appearance", "value", "success", "clearPopups", "popupController", "context", "itemcommon", "showView", "currentView", "backToPrevious"

### `__` @L129250 (parent=(无), score=28)
- methods: createDebugButtons, createQuadButton, destroy, disable, enable, refreshLeftButtonState, refreshRightButtonState, setDebugMode, update
- strings: "value", "addChild", "_inputTarget", "zOrder", "alpha", "height", "y", "width", "x", "pos", "toHex", "#ffffff", "createButton", "QuickDebugUI", "key"

### `H_` @L132962 (parent=Rt.ElementBehaviour, score=28)
- methods: fadeIn, fadeOut, getCanTeleportNow, getIsOutOfOfPortal, getShouldPlayAudio, getTeleportDelay, onInit, teleport, teleportFadeOut
- strings: "value", "y", "bounds", "collider", "_entity", "right", "contains", "bottom", "x", "outEntity", "key", "getIsOutOfOfPortal", "celebrate", "dead", "currentDisabledType"

### `Zg` @L171538 (parent=Yg, score=28)
- methods: destroy, handleNetworkEvent, init, onPlayerEnterTrigger, onPlayerExitTrigger, reset, startEdit, startPlay, update
- strings: ".png", "/electricity", "value", "error", "start", "rotation", "sprite", "_switchTrigger", "tweenProps", "disable", "_eletricity", "_tramOffElapsedSeconds", "_isTramOff", "handle switch trigger event", "warn"

### `bm` @L173719 (parent=(无), score=28)
- methods: getCanAttachTo, handleNetworkEvent, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, playAnim, stopAnim, triggerSpring, update
- strings: "value", "scaleY", "_springSprite", "stopAllTweensWithContext", "TweenMgr", "key", "stopAnim", "start", "setContext", "PingPong", "LoopType", "setLoops", "height", "sprite", "_boxCollider"

### `Pm` @L174825 (parent=Yg, score=28)
- methods: destroy, getHaveBoss, hideBoss, init, initBoss, startEdit, startPlay, tryInitBoss, update
- strings: "value", "f", "e", "enabled", "collider", "entity", "done", "n", "s", "boss", "getBoxColliders", "level", "key", "hideBoss", "attachBossColliders"

### `Dm` @L175252 (parent=Yg, score=28)
- methods: destroy, getHaveBoss, hideBoss, init, initBoss, startEdit, startPlay, tryInitBoss, update
- strings: "value", "f", "e", "enabled", "collider", "entity", "done", "n", "s", "push", "boss", "getBoxColliders", "getCircleColliders", "level", "key"

### `Vm` @L176172 (parent=Yg, score=28)
- methods: addSystemArea, getGoalAreaSize, getSpawnAreaSize, init, resetComponentPositions, resetPositionsByRound, startEdit, startPlay, update
- strings: "锁定区", "value", "_lockedArea2", "addInitialComponentToLevel", "cellVisualSize", "_currentMaxOffsetY2", "_currentStartY2", "_currentMaxOffsetX2", "_currentStartX2", "pos", "_lockedArea1", "_currentMaxOffsetY1", "_currentStartY1", "_currentMaxOffsetX1", "_currentStartX1"

### `yk` @L182843 (parent=(无), score=28)
- methods: checkLevelValidity, gatherUserElements, getGoalAreaDelta, initLevelElements, restoreSettings, setIfAutoConnectToPathNode, setPhysicsSettingForAutoMap, updateDestructibles, updateGoalAreaDelta
- strings: "value", "f", "e", "index", "add", "_destructables", "done", "n", "s", "attachedObjects", "onedirblock", "type", "crumbingblock", "componentAttachedTo", "landmine"

### `lC` @L192221 (parent=Rt.ElementStageView, score=28)
- methods: onBackButtonClicked, onDisable, onEnable, onInit, onShareButtonClicked, playInTween, showButton, showShareButton, updateWXRecordInfo
- strings: "点击发布闯关视频", "cost_seconds", "default.cost", "bg_recordershare_end_2.png", "value", "query", "&shareScene=video_ugcRecord", "id", "currentLevel", "_ugcModel", "concat", "&id=", "userID", "profile", "profileModel"

### `tw` @L204052 (parent=Rt.State, score=28)
- methods: delayToShowLoading, onEnter, onExit, onInit, onKeyDown, onObserveComplete, onUpdate, startMatch, tryEnterGame
- strings: "toast_wait_opponents", "value", "onObserveComplete", "SPACE", "Keyboard", "keyCode", "key", "onKeyDown", "title", "getLocalizationText", "showLoading", "delayToShowLoading", "startGame", "controller", "context"

### `Gb` @L220633 (parent=Rt.ElementStageView, score=28)
- methods: cancelMatchmaking, onCountdown, onDisable, onEnable, onInit, onMatchmakingSuccess, onOpponentsInit, playOutTween, updateInfo
- strings: "value", "updateText", "countdown", "_ui", "key", "updateInfo", "cancelMatchmaking", "_matchmaking", "matchmakingCountdownCmd", "_matchmakingModel", "concat", "onCountdown", "_spawnedPlayersCount", "changeToMatchmakingState", "_uiScene"

### `tS` @L223856 (parent=f.PlayerInfoBarUI, score=28)
- methods: disable, enable, fitSize, onClanHudClicked, onProfileUpdate, refresh, refreshClanHud, refreshLevel, refreshMode
- strings: ".png", "ui/icon_", "value", "_clanID", "show", "clan", "showView", "uiStackController", "_isHomeMode", "clanEnable", "config", "key", "onClanHudClicked", "fontSize", "_originFontSize"

### `mi` @L43571 (parent=Rt.ElementStageView, score=28)
- methods: idle, onDisable, onEnable, onHide, onOKButtonClicked, onShow, playInTween, playOutTween, setData
- strings: "value", "playOutTween", "key", "onOKButtonClicked", "_viewState", "idle", "id", "hidePopup", "popupController", "context", "onHide", "onShow", "backIn", "Ease", "create"

### `Gk` @L188866 (parent=Rt.ElementComponent, score=28)
- methods: changeToRoundState, doLocalPreCountdown, doServerPreCountdown, initRoundGame, onDestroy, onInit, onLocalPlayerPrepareRound, startRound, stopCountdownTimer
- strings: "value", "dispatch", "prepCountdownCmd", "_gameModel", "key", "doServerPreCountdown", "changeToRoundState", "edit", "isInState", "stateMachine", "context", "decrementPrepCountdown", "doLocalPreCountdown", "play", "changeState"

### `tm` @L171785 (parent=Df[=LevelComponentBase], score=27)
- methods: idle, loadOctopus, onAntennaLoad, onDestroy, onOcpopusLoad, onPlayerEnterTrigger, onPlayerExitTrigger, playerTriggerAnim
- statics: LimbHitSpeed
- strings: "/antenna.png", "/antenna.sk", "/octopus.png", "/octopus.sk", "value", "node", "mainCamera", "_level", "show", "addEntity", "_antennaSkeleton", "octopusantenna", "Entity", "play", "idleSpeed"

### `lc` @L103702 (parent=sc, score=26)
- methods: agreeApplication, deleteFriend, denyApplication, fetchFriends, getFriendsIntimacy, searchFriend, sendApplication, sendFriendMessage, sendPvpInvitation
- strings: "好友", "value", "key", "getFriendsIntimacy", "sendFriendMessage", "handlePvpInvitationSend", "_controller", "sendPvpInvitation", "handleFriendDelete", "deleteFriend", "handleApplication", "denyApplication", "agreeApplication", "handleApplicationSend", "sendApplication"

### `Tu` @L112339 (parent=Rt.ElementModel, score=26)
- methods: buy, equip, getTitleByID, getTitlesAvaliable, getTitlesOwn, onDestroy, onStart, refreshTitles, reset
- strings: "value", "_ownedTitleCount", "buy", "getTitleByID", "key", "forEach", "titles", "keys", "reset", "_titles", "refreshTitles", "get", "has", "destroy", "onDestroy"

### `X` @L25723 (parent=(无), score=26)
- methods: disable, enable, onActionButtonClicked, onCancelButtonClicked, playInTween, playOutTween, refreshActionGroup, setData
- strings: "line_gray.png", "value", "start", "setContext", "hideActionSheet", "_viewState", "idle", "setCompletionHandler", "alpha", "panel", "_ui", "tweenProps", "out", "key", "playOutTween"

### `mn` @L50776 (parent=f.GameLiveNewbiePanelUI, score=26)
- methods: disable, enable, onClaimButtonClicked, onLiveStateChanged, onRewardClaimed, onRewardInfoFetched, onTipsButtonClicked, refreshLivePanel
- strings: "/1 次", "本周已领取 ", "开播10分钟后才能领取", "gamelive/first_live_task.png", "value", "text", "claimed", "concat", "tips", "gray", "canClaim", "claimButton", "visible", "reward", "_gameLiveModel"

### `kn` @L50903 (parent=f.GameLiveWatchPanelUI, score=26)
- methods: disable, enable, onClaimButtonClicked, onLiveStateChanged, onRewardClaimed, onRewardInfoFetched, onTipsButtonClicked, refreshLivePanel
- strings: "/1 次", "今日已领取 ", "从直播间进入游戏才能领取", "gamelive/watch_live_task.png", "value", "text", "dailyClaimed", "concat", "tips", "gray", "dailyCanClaim", "claimButton", "visible", "claimed", "reward"

### `Bn` @L51557 (parent=(无), score=26)
- methods: getLevelByIndex, handleFetched, isLevelCompelted, isLevelUnlocked, refresh, reset, startFetch, unlock
- strings: ".png", "value", "_unlocked", "key", "reset", "unlock", "_progress", "_progressList", "length", "push", "progressv2", "_total", "isInOrder", "_claimed", "claimed"

### `nr` @L77049 (parent=f.BattlePassHudUI, score=26)
- methods: destroy, getUIData, onAnimCompleted, refresh, refreshPanel, refreshProgress, startAnim, update
- strings: "banner_small.png", "/battlepass/btn_claim2.png", "value", "uiData", "_currentData", "_event", "refreshPanel", "key", "onAnimCompleted", "update", "add", "timer", "_animVelocity", "_target", "target"

### `or` @L77251 (parent=f.BattlePassNextRewardPanelUI, score=26)
- methods: despawnPlayer, destroy, hide, playInTween, playOutTween, setItem, show, spawnPlayer
- strings: "级奖励：", "value", "_player", "destroy", "key", "despawnPlayer", "scaleY", "entity", "scaleX", "visible", "headIcon", "personality", "dispatch", "currentMoveStateCmd", "model"

### `yl` @L89791 (parent=fl, score=26)
- methods: disable, enable, onEntryClicked, onFetched, onMouseDown, onScrollEnd, onScrollStart, refreshEntry
- strings: "排行榜 周一零点清榜单", "操作力", "创造力", "本周", "value", "currentDan", "_leagueModel", "week", "getSelfScore", "_socialModel", "profile", "profileModel", "refresh", "rankEntry", "_parent"

### `Vl` @L94242 (parent=(无), score=26)
- methods: complete, getLevelDifficulty, getLevelReward, handleFetched, refresh, reset, startFetch, unlock
- strings: "value", "_unlocked", "key", "reset", "unlock", "_expInc", "_lastFinishTS", "now", "complete", "_currentState", "refresh", "_claimed", "totalClaimed", "_ts", "lastFinishTS"

### `vh` @L98279 (parent=Rt.ElementModel, score=26)
- methods: buy, equip, getBorderByID, getBordersAvaliable, getBordersOwn, onDestroy, onStart, refreshBorders, reset
- strings: "value", "buy", "getBorderByID", "key", "forEach", "keys", "reset", "_borders", "refreshBorders", "get", "has", "destroy", "_borderList", "onDestroy", "push"

### `Xf` @L139378 (parent=Gf, score=26)
- methods: createCloud, destroy, generateCloudsFromElements, generateRandomClouds, init, setAlpha, update, updateBounds
- strings: "ugctheme/", "/cloud", "unpack.json", "{\"sprite\":\"ugctheme/", "value", "push", "_clouds", "addToStage", "cloudspeed", "options", "addComponent", "entity", "createFromLevelElement", "key", "createCloud"

### `em` @L171922 (parent=Yg, score=26)
- methods: changePlayerToBackground, destroy, getCanAttachToBoat, init, onPlayerEnterTrigger, onPlayerExitTrigger, startPlay, update
- strings: "value", "_boat", "getCanAttachTo", "down", "dir", "key", "getCanAttachToBoat", "zOrder", "background", "root", "avatar", "headIcon", "changePlayerToBackground", "onPlayerExitTrigger", "_falldownTrigger"

### `vm` @L173198 (parent=(无), score=26)
- methods: handleTriggerNetworkEvent, onPlayerEnterTrigger, onPlayerExitTrigger, reset, resetShake, shake, triggerMe, update
- strings: "leveltemple/stoneface.png", "value", "_totalShakeOffset", "move", "_collider", "_shakeOffset", "_shakeIntensity", "abs", "_shakeDegredation", "key", "shake", "resetShake", "_inTriggerPlayers", "triggerMe", "disabled"

### `ym` @L173382 (parent=Yg, score=26)
- methods: destroy, init, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, startEdit, startPlay, update
- strings: "value", "key", "onPlayerExitCollider", "onPlayerStayCollider", "fallingTime", "model", "isGrounded", "entity", "_swingplatform", "collider", "onPlayerEnterCollider", "update", "_thwomp", "rotation", "sprite"

### `Im` @L174211 (parent=(无), score=26)
- methods: getCanAttachTo, getCanShootThroughOnewayCollider, getCanWalkThrough, isPointInsideMe, onPlayerEnterTrigger, onPlayerExitTrigger, onStartEdit, onStartPlay
- strings: "game/onewayarrow2.png", "game/onewayarrow1.png", "value", "collider", "entity", "_platform", "delete", "ignoredColliders", "characterController", "key", "onPlayerExitTrigger", "add", "end", "_unpenetrableLine", "begin"

### `qm` @L176944 (parent=Yg, score=26)
- methods: init, initSceneObjects, resize, updateBg, updateGrid, updateGround, updateRoof, updateWall
- strings: ".png", "templatetower/bg", "value", "wallleft", "_colliderWallLeft", "wallright", "_colliderWallRight", "roof", "_colliderRoof", "ground", "_colliderGroud", "tag", "options", "boxcollider", "type"

### `gk` @L183026 (parent=(无), score=26)
- methods: backToLastCheckpoint, checkIfPointKill, checkIfShouldDisableCurrentCheckpoint, clearCheckpoint, handlePlayerHitCheckpoint, resetQuickKillCount, setCurrentCheckpoint, tryLoadCheckpoint
- strings: "value", "_respawnFromCheckpointTS", "time", "timer", "enable", "entity", "player", "_context", "update", "_level", "updateElapsedTimeByCheckpoint", "model", "disable", "resumeRecord", "_ghostRecord"

### `zk` @L189162 (parent=Rt.ElementComponent, score=26)
- methods: addPlayer, forceLocalPlayersToSendFullSnapshot, getPlayerNetwork, onDestroy, onInit, onStart, syncPlayerState, syncPlayerStateRaw
- strings: "value", "onGetPlayerStateRawMsg", "getPlayerNetwork", "readUInt", "dataBuffer", "init", "isInState", "stateMachine", "context", "key", "syncPlayerStateRaw", "totalRoundCount", "matchData", "model", "_matchRoom"

### `zw` @L210815 (parent=Rt.ElementComponent, score=26)
- methods: anonymouslyEnterGame, authMockup, authNative, onGetKuaishouUserSetting, onGetUserInfo, onGetUserSetting, startAuth, startGetUserInfo
- strings: "正在同步用户资料", "正在查询用户设置", "scope.userInfo", "/avatar1.png", "value", "_arg", "onWechatAuth", "user", "getController", "data", "code", "fail", "key", "anonymouslyEnterGame", "hideToast"

### `Cb` @L216498 (parent=f.UGCLevelListHudUI, score=26)
- methods: disable, enable, onAlbumHudClicked, onEntryClicked, onListButtonClicked, onUGCLevelsFetched, setLevelIDs, startUGCChallenge
- strings: "个合集", "查看全部", "Ta的第一张自制图还在设计中...", "第一张自制图还在设计中...", "value", "startUGC", "controller", "currentGame", "mode", "ugcchallenge", "game", "changeState", "create", "Handler", "startFadeWithTask"

### `Pb` @L217815 (parent=f.MobileVerifyCodeGroupUI, score=26)
- methods: clear, disable, enable, getClipboardData, handleOnShow, onBlur, onFocus, onInput
- strings: "value", "complete", "mouseEnabled", "inputField", "fail", "success", "onInput", "changeText", "test", "_regExp", "trim", "data", "hideToast", "isOnWechat", "setClipboardData"

### `VS` @L230031 (parent=Rt.State, score=26)
- methods: enterHome, onEnter, onExit, onGetReplayInfo, onGetUGCInfo, onInit, onReplayDataFetched, onUnlockSucceeded
- strings: "」将为你出战", "history_toast_fetchreplay", "value", "args", "_nextStateInfo", "enterHome", "context", "playTweenToMatch", "characterinit", "getView", "key", "changeState", "id", "title", "concat"

### `Lo` @L56434 (parent=Rt.ElementComponent, score=26)
- methods: canUse, fetchItems, handleItemsFetched, handleUseFailed, handleUseSucceeded, onInit, refreshReddot, use
- strings: "value", "refreshReddot", "notify", "onFetched", "_inventoryModel", "handleFetched", "key", "handleItemsFetched", "onUseFailed", "handleUseFailed", "saveLocal", "characterModel", "context", "skin", "id"

### `Bg` @L169094 (parent=Rt.ElementStageView, score=26)
- methods: onDestroy, onDisable, onEnable, onInit, playBigExplode, playSparkle, playTinyExplode, stopAllEffects
- strings: "game/bigexplode.png", "game/tinyexplode.png", "value", "despawn", "_sparkePool", "COMPLETE", "Event", "on", "burstoflight", "play", "pos", "_root", "spawn", "key", "playSparkle"

### `Cg` @L168438 (parent=(无), score=25)
- methods: backtrace, getManhattenDistance, getPlayerPlatformNodes, getPlayerXOnCell, getPlayerYOnCell, isAdjcentGroundNode, isNodesWalkable, minF, removeNode
- strings: "value", "key", "getManhattenDistance", "reverse", "push", "isLandable", "parent", "backtrace", "y", "cellVisualSize", "entity", "getPlayerYOnCell", "x", "getPlayerXOnCell", "right"

### `uC` @L193210 (parent=f.LevelComponentEntryUI, score=25)
- methods: cloneTo, initDebugEntry, initEntry, refresh, refreshUnlockState, updateCountInLevel, updateIcon
- statics: itemHeight
- strings: "主题", "音乐", "背景", "ui/icon_music_white.png", "value", "skin", "_config", "_icon", "bgm", "type", "size", "icon", "level", "startsWith", "id"

### `Sa` @L61871 (parent=Rt.ElementModel, score=25)
- methods: consume, consumeDecals, getDecalsGainByCoin, getItemByID, getItemCount, give, onInit, refresh, reset
- strings: "value", "key", "reset", "set", "_decals", "decal", "init", "consumable", "available", "decals", "length", "keys", "onInit", "count", "getItemByID"

### `cw` @L205561 (parent=(无), score=25)
- methods: createCommand, destroy, executeCommand, getDelegate, receiveCommand, recycleCommand, registerCommand, sendCommand, unregisterCommand
- strings: "got invalid command.", "value", "despawn", "_pool", "recycle", "key", "recycleCommand", "createCommand", "delete", "_delegates", "has", "unregisterCommand", "set", "registerCommand", "get"

### `xg` @L168871 (parent=Rt.ElementBehaviour, score=24)
- methods: isCurrentSkin, onDestroy, onInit, setUGCBGM, setUGCSkinFromElement, setUGCSky, setUGCTheme, updateUGCSkinBounds
- strings: ".png", "/bgbluesky", "value", "notify", "onSkinChanged", "bgmID", "skin", "key", "setUGCBGM", "viewBounds", "context", "setSky", "loadSky", "concat", "assetBaseURL"

### `Uo` @L57267 (parent=Rt.ElementModel, score=24)
- methods: addHistory, addVideoPacks, giveVideoPack, handleHistoryFetchResult, onInit, popVideoPack, refreshVideoPacks, reset
- strings: "value", "_videoPackActiveTS", "activeTime", "config", "currentVideoPack", "now", "splice", "_videoPacks", "key", "popVideoPack", "push", "length", "videoPacks", "giveVideoPack", "ts"

### `N` @L25134 (parent=(无), score=24)
- methods: disable, enable, playInTween, playOutTween, refresh, refreshToast, setData
- strings: "loading/toast_icon.png", "value", "start", "setContext", "hideToast", "_viewState", "idle", "setCompletionHandler", "alpha", "panel", "_ui", "tweenProps", "out", "afterDelay", "ActionTask"

### `ft` @L28721 (parent=f.ButtonTextOnlyUI, score=24)
- methods: onLoaded, refreshIcon, updateBgSkin, updateFontSize, updateGray, updateIcon, updateText
- strings: "ui/icon_close_white.png", "ui/icon_share.png", "ui/icon_sharefriend.png", "ui/icon_videoAd.png", ".png", "ui/icon_", "_60.png", "ui/btn_", "_100.png", "value", "centerX", "width", "iconHud", "labelCenter", "visible"

### `Ce` @L36952 (parent=(无), score=24)
- methods: create, encodeGateData, getBuyGate, getGainDescription, getGateShortDescription, getSeasonDanRewardTarget, getSeasonRankRewardTarget
- strings: "[购买需求：", "dropdebris_skin", "value", "length", "danRewards", "danType", "getdanNameByType", "type", "forEach", "rewards", "relatedID", "leagueConfig", "key", "getSeasonDanRewardTarget", "rankRewards"

### `Me` @L37504 (parent=(无), score=24)
- methods: addExplodeTween, addOutputTween, flyDownAnim, outAnim, playNumberAnim, quickFadeAnim, start
- strings: "value", "addTween", "accelerate", "Ease", "setEaseType", "y", "integer", "random", "x", "tweenProps", "appendTween", "quintOut", "scaleY", "scaleX", "scale"

### `Li` @L45495 (parent=(无), score=24)
- methods: disable, enable, handleUpdateFetchResult, onCheckVersionButtonClicked, onInfoHudClicked, refresh, setClipboard
- strings: "更新", "发现有新版本，立即更新？", "提示", "当前已是最新版本", "复制成功", "设备与系统：", "ID: 未登录", "版本：", "ID: ", "value", "succeed", "success", "applyUpdate", "getUpdateManager", "confirm"

### `xn` @L51299 (parent=Rt.ElementComponent, score=24)
- methods: claimReward, fetchTrainingData, fetchTrainingLevels, handleChallengeLevelPassed, handleRewardClaimed, onInit, passChallengeLevel
- strings: "训练营通关", "value", "notify", "onLevelPassed", "_trainingModel", "handleUserMsg", "msgController", "context", "data", "key", "handleChallengeLevelPassed", "onRewardClaimed", "pack", "id", "reward"

### `Xa` @L65228 (parent=f.ClanChatEntryUI, score=24)
- methods: getUGCLevelInfo, refreshEmoji, refreshFriendlyPvp, refreshRoomState, refreshTeamPvp, refreshUGC, setItem
- strings: "·难度", "跪求小giegie小姐姐带我飞", "马上开赛，就差你了", "【比赛中】", "【已结束】", "点击和我一起闯关", "点击加入我的比赛房间", "快来和我一起组队！", ".jpg", "/share_battle_", "/share_story_team_", "value", "winRateStr", "concat", "name"

### `ms` @L71403 (parent=Rt.ElementModel, score=24)
- methods: getEventByType, isEventOpened, onInit, refresh, refreshEvent, reset, update
- strings: "value", "refreshState", "refreshConfig", "config", "type", "getEventByType", "key", "refreshEvent", "forEach", "_events", "refresh", "update", "start", "length", "push"

### `Ul` @L93923 (parent=Rt.ElementModel, score=24)
- methods: getItemByID, needTutorial, onInit, passTutorial, refresh, reset, updateSkippedCount
- strings: "dailychallenge_tutorial", "dailychallenge_id", "value", "challenge", "passTutorial", "completedLevelCount", "_max", "getItemByID", "unlock", "unlockedID", "id", "allLevelCompleted", "reset", "forEach", "items"

### `v_` @L129481 (parent=(无), score=24)
- methods: destroy, disable, enable, refreshTouchPanel, setDebugMode, setupRecognizers, update
- strings: "value", "_jumpRecognizer", "addGestureRecognizer", "_touchKit", "TKButtonRecognizer", "height", "stage", "width", "TKRect", "_arrowRecognizer", "TKAnyTouchRecognizer", "key", "setupRecognizers", "visible", "_rightDown"

### `lf` @L134972 (parent=Rt.State, score=24)
- methods: onEnter, onExit, onInit, onKeyUp, onReviveMouseUp, onUpdate, tryStartRun
- strings: "value", "run", "changeState", "_context", "revive", "isInState", "stateMachine", "context", "_isCloseEnoughToTarget", "_alreadyClicked", "key", "tryStartRun", "onReviveMouseUp", "SPACE", "Keyboard"

### `eg` @L164595 (parent=(无), score=24)
- methods: getMoreEditData, handleEditResult, reset, resetRotateMove, setProperties, setStartAngle, updateRotateMove
- strings: "摇摆", "旋转", "value", "push", "onUpdate", "_rotateType", "updatePanelOnChange", "currentIndex", "itemList", "type", "radio", "id", "rotateType", "_speedIndex", "swingSpeed"

### `vk` @L182627 (parent=(无), score=24)
- methods: getIsPvpServiceOn, initRoom, onGetMatchResult, onShutdown, refreshLocalPlayerInfo, stopRoom, tryReloadGame
- strings: "联赛", "好友赛", "联赛获胜", "pvp_result", "toast_opponent_leave", "value", "reloadGame", "none", "onKickOutReason", "_roomModel", "id", "home", "quitgame", "changeState", "afterDelay"

### `qC` @L202526 (parent=f.TeamEndRankGroupUI, score=24)
- methods: disable, enable, getTeamScore, onGetEmoji, onMoreButtonClicked, playInTween, refreshTeam
- strings: "反方", "反方胜", "正方", "正方胜", "value", "notify", "handleMoreButtonClicked", "key", "onMoreButtonClicked", "height", "length", "_entries", "CLICK", "Event", "on"

### `aw` @L204910 (parent=Rt.State, score=24)
- methods: onEnter, onExit, onInit, onMouseDown, onUpdate, restartPlay, reverseSnapshots
- strings: "value", "ts", "length", "unshift", "_indexMap", "y", "x", "horiInput", "state", "personality", "key", "reverseSnapshots", "startPlay", "_cameraController", "resumeRecord"

### `Uw` @L210465 (parent=f.AnnualChallengePanelUI, score=24)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, refreshLevel, show
- strings: "难度 ", "系统向我推荐这张地图！", "你永远可以相信我！", "是我挑战最多的关卡！", "谢谢你玩我的设计！", " 次", "挑战 ", "张地图", "border_76.png", "border_level.png", "hit.png", "right.png", "left.png", "value", "text"

### `Jb` @L223136 (parent=(无), score=24)
- methods: createTip, destroy, disable, enable, generateTip, onTipClicked, update
- strings: "ui/dialog_red.png", "ui/dialog_purple.png", "ui/dialog_cyan.png", "ui/dialog_blue.png", "value", "broadcast", "clanJoinModeInt", "args", "messageHud", "clanName", "clanID", "join", "clan", "getController", "messageID"

### `eS` @L223989 (parent=(无), score=24)
- methods: destroy, disable, enable, initBackground, update, updateScene, updateSceneUrl
- strings: ".png", "/loading/home_", "cdn/loading/home_", "ui/pattern_rabbit.png", "ui/pattern_red.png", "ui/pattern_yellow.png", "ui/pattern_blue.png", "/dark_cornor_blue.png", "value", "height", "stage", "_scene", "sizeGrid", "0,0,1,0", "skin"

### `xS` @L228216 (parent=Rt.State, score=24)
- methods: onAssetsLoaded, onEnter, onExit, onInit, onSessionInvalid, showSessionInvalidMsg, startLoadAssets
- strings: "很抱歉，您的登录状态已过期，请重新登录", "提示", "value", "showCancel", "content", "title", "showModal", "key", "showSessionInvalidMsg", "assets", "handleLoginFailed", "_antiAddictionInfo", "_sessionInvalid", "isLogined", "_model"

### `ae` @L36141 (parent=(无), score=24)
- methods: complete, destroy, hide, load, onError, onLoad, show, tryShow
- strings: "Object.values called on a non-object", "value", "_complete", "key", "complete", "catch", "then", "show", "_ad", "_isLoaded", "_needShow", "tryShow", "_isLoadError", "onError", "onLoad"

### `ra` @L60204 (parent=Rt.ElementComponent, score=24)
- methods: fetchMails, handleMailRead, handleMailsFetched, handleSyncMessage, onInit, readMail, resetBadgeRefreshTS
- strings: "邮件", "value", "ugcLevelFeatured", "resetBadgeRefreshTS", "badgeController", "context", "tag", "args", "event", "starTag", "mail", "type", "level", "badgeId", "badgeUnlocked"

### `jk` @L189283 (parent=Rt.ElementComponent, score=24)
- methods: onDestroy, onInit, onStart, removeComponent, shootComponent, speedUpTimer, triggerComponent
- strings: "value", "ts", "handleShootNetworkEvent", "projectileIndex", "destroyProjectile", "getShooter", "getIndexToComponent", "level", "context", "componentIndex", "key", "shootComponent", "enableComponentSpeedUp", "model", "speedUpTimer"

### `_c` @L104871 (parent=dc, score=24)
- methods: afterPay, beforePay, createAndroidOrder, createOrder, getRechargeInfo, pay, payOnKuaishou, payOnQQ, payOnToutiao
- strings: "value", "key", "createAndroidOrder", "payOnKuaishou", "payOnQQ", "payOnToutiao", "createOrder", "getRechargeInfo", "data", "code", "onPaySucceeded", "_controller", "vips", "effectTS", "ts"

### `mp` @L125273 (parent=Rt.ElementComponent, score=24)
- methods: add, clearRedDotByID, contains, getRedDotCountByID, getRedDotsByID, haveAnyRedDot, haveRedDot, onInit, remove
- strings: "value", "_idToRedDot", "key", "contains", "notify", "onChanged", "reddotKey", "set", "remove", "add", "clearRedDotByID", "length", "keys", "getRedDotCountByID", "getRedDotsByID"

### `Jf` @L140374 (parent=Df[=LevelComponentBase], score=24)
- methods: checkSpatialHashAndUpdate, getIsLandableForAI, getShouldRecycle, onDestroy, onDirectionChange, onPositionChange, updateViewBounds
- strings: "value", "checkSpatialHashAndUpdate", "_childComponents", "length", "key", "left", "cellVisualSize", "gridWidth", "_config", "setEntityLocalPosition", "entities", "right", "down", "up", "dir"

### `si` @L41871 (parent=(无), score=23)
- methods: destroy, load, loadSkin, loadTemplate, onTemplateAssetsLoad, onTemplateLoad, onTemplateLoadFail, unload
- strings: "value", "_onComplete", "loadTemplate", "_assetsUrl", "_template", "_skURL", "key", "onTemplateAssetsLoad", "loadAni", "onTemplateLoadFail", "ERROR", "Event", "on", "onTemplateLoad", "COMPLETE"

### `Gp` @L126622 (parent=(无), score=23)
- methods: getDes, getIcon, getName, getQuality, getVirtualDataByID, getVirtualItemByID, give
- strings: "小时试用时间", "使用后，获得", "场排位赛失败也不会掉星", "使用后，下", "场排位赛黄星经验+", "场排位赛金币+", "试用", ".png", "inventory/", "value", "inventoryConfig", "key", "getVirtualDataByID", "getItemById", "inventory"

### `Du` @L112743 (parent=Rt.ElementModel, score=23)
- methods: canAddFriends, canClaimBankCoin, canClaimFreeCoin, getBankCoins, onInit, refresh, refreshReddot, reset
- strings: "value", "friends", "push", "_friends", "forEach", "keys", "_bankCoinTimeStamp", "bankCoinTS", "_freeCoinTimeStamp", "freeCoinTS", "key", "refresh", "bankFriendOutput", "config", "isValid"

### `Wt` @L34008 (parent=zt, score=23)
- methods: buy, consume, equip, init, onGateClose, reset, unequip
- strings: "value", "notify", "onLockStateChanged", "_unlocked", "_own", "key", "onGateClose", "consume", "buy", "_equipped", "unequip", "equip", "emoji", "_type", "default"

### `Fn` @L52494 (parent=Rt.ElementModel, score=23)
- methods: getItemByID, handleFetched, handleTrainingLevelsFetched, onInit, refresh, reset, startFetch
- strings: "value", "unlock", "_challengeEvent", "_pvpTraining", "_skillTraining", "claimed", "_basicTraining", "completed", "challenge", "refresh", "pvp", "skill", "basic", "key", "reset"

### `Sc` @L106086 (parent=Rt.ElementModel, score=23)
- methods: getGiftByID, give, handleSyncResult, hasGiftByID, onDestroy, onStart, refreshGifts, reset
- strings: "value", "buy", "set", "_gifts", "push", "_giftList", "giftConfig", "gift", "init", "getGiftByID", "key", "give", "count", "forEach", "keys"

### `Og` @L169852 (parent=Ag, score=22)
- methods: completeEdit, disable, enable, initList, refreshEntry, refreshList, updateData
- strings: "get", "_ui", "key", "ui", "_data", "data", "value", "currentIndex", "tweenTo", "list", "selectedIndex", "array", "length", "itemList", "refreshList"

### `le` @L36378 (parent=(无), score=22)
- methods: destroy, init, onSelected, playSound, select, tryPlayCacheSound, unSelect
- strings: ".wav", "btn_click", "value", "playSound", "SoundManager", "concat", "getSoundsBaseURL", "haveCache", "instance", "fileName", "destroyed", "key", "tryPlayCacheSound", "load", "canCache"

### `Vt` @L33238 (parent=(无), score=22)
- methods: despawn, destroy, onAvatarLoaded, spawn, spawnItem, update
- strings: "value", "notify", "onLoad", "_loaded", "idle", "_animIndex", "showPersonality", "personality", "_state", "celebrate", "skeleton", "avatar", "player", "key", "onAvatarLoaded"

### `zt` @L33798 (parent=(无), score=22)
- methods: destroy, init, onGateClose, onGateOpen, reset, unlock
- strings: "value", "notify", "onLockStateChanged", "_unlocked", "key", "onGateClose", "unlock", "onGateOpen", "isOpened", "_gate", "_count", "reset", "destroy", "unregister", "open"

### `Ss` @L71862 (parent=Cs, score=22)
- methods: getResUrl, handleFetchResult, refresh, refreshConfig, reset, startFetch
- strings: "event/", "value", "onReddotChanged", "_fetchTS", "_fetchState", "none", "_maxClaimed", "_ticketUsed", "_tickets", "key", "reset", "ticketUsed", "ticket", "dispatch", "androidChannel"

### `Ns` @L74383 (parent=f.CheckinEntryUI, score=22)
- methods: destroy, refresh, refreshBasicInfo, refreshCard, showStarGlow, stopTween
- strings: "_edge.png", "ui/reward_item_", "/checkin/7th_card.png", ".png", "value", "visible", "glowGroup", "_isTweening", "stopAllTweensWithContext", "TweenMgr", "key", "stopTween", "start", "setContext", "PingPong"

### `Gs` @L74484 (parent=f.CheckinMaxRewardEntryUI, score=22)
- methods: destroy, refresh, shake, showStarGlow, stopShaking, stopStaring
- strings: "/checkin/final_card.png", "value", "rotation", "rewardEntry", "_isShaking", "stopAllTweensWithContext", "TweenMgr", "key", "stopShaking", "visible", "glowGroup", "_isStaring", "stopStaring", "start", "setContext"

### `jl` @L94726 (parent=zl, score=22)
- methods: claimGroupReward, claimLevelReward, claimTotalReward, fetchDailyChallenge, getNextDailyChallenge, skipDailyChallenge
- strings: "每日夺宝全通关", "每日夺宝跳过", "每日夺宝冷却", "每日夺宝单关", "ugclevel/claimchallengefinish3", "ugclevel/claimchallengetotal3", "ugclevel/skipchallenge3", "ugclevel/getchallenges3", "ugclevel/claimchallenge3", "value", "code", "data", "notify", "onTotalRewardClaimed", "_model"

### `Wl` @L94935 (parent=zl, score=22)
- methods: claimGroupReward, claimLevelReward, claimTotalReward, fetchDailyChallenge, getNextDailyChallenge, skipDailyChallenge
- strings: "每日夺宝全通关", "value", "count", "type", "printing", "notify", "onTotalRewardClaimed", "_model", "reason", "items", "handleGetItems", "handleUserMsg", "msgController", "context", "_controller"

### `Wc` @L107770 (parent=Rt.ElementStageView, score=22)
- methods: backToHome, onDisable, onEnable, onInit, playInTween, playTweenToHome
- strings: "tutorial_backhome", "ui-loc/title_great.png", "value", "start", "playTweenToHome", "setCompletionHandler", "setContext", "setDelay", "bounceOut", "Ease", "setEaseType", "scaleY", "scaleX", "_tip", "tweenProps"

### `pu` @L110361 (parent=du, score=22)
- methods: buy, claimFreeGem, claimFreeHorn, exchange, fetchDailyItems, fetchFreeGemInfo
- strings: "exchange/gem", "horn/claimfree", "dailyfreegem/claim", "dailyfreegem/getinfo", "shop/buy", "shop/buyrecommend", "shop/info", "value", "notify", "onExchange", "currencyModel", "context", "_controller", "data", "handleUserMsg"

### `_u` @L110508 (parent=du, score=22)
- methods: buy, claimFreeGem, claimFreeHorn, exchange, fetchDailyItems, fetchFreeGemInfo
- strings: "value", "notify", "onExchange", "currencyModel", "context", "_controller", "userrole", "handleUserMsg", "msgController", "gem", "getCountByType", "ratio", "concat", "gem2", "exchanges"

### `Eu` @L112644 (parent=f.BankEntryUI, score=22)
- methods: disable, enable, init, refresh, refreshDoubleState, reset
- strings: "下班时间 ", ".png", "ui/icon_", "value", "visible", "deactiveState", "activeState", "stopAllTweensWithContext", "TweenMgr", "_friend", "key", "reset", "text", "now", "bankFriendOutputTime"

### `Id` @L117304 (parent=Rt.ElementStageView, score=22)
- methods: onBackButtonClicked, onDisable, onEnable, onResize, onScroll, refreshEntry
- strings: "value", "currentDan", "leagueModel", "context", "indexOf", "danItems", "scrollTo", "list", "_ui", "key", "onResize", "backToPrevious", "uiStackController", "onBackButtonClicked", "setItem"

### `Yf` @L139754 (parent=Df[=LevelComponentBase], score=22)
- methods: getIsLandableForAI, getShouldSnapToGrid, initCells, onAddToLevel, onPlayerEnterTrigger, onPlayerExitTrigger
- strings: ".png", "value", "key", "onPlayerExitTrigger", "localPlayerKillByComponent", "match", "onPlayerEnterTrigger", "isTrigger", "collider", "_entities", "getIsLandableForAI", "getShouldSnapToGrid", "push", "_globalCells", "cellVisualSize"

### `$g` @L171693 (parent=(无), score=22)
- methods: destroy, onPlayerEnterTrigger, onPlayerExitTrigger, reset, swoop, update
- strings: "value", "start", "bind", "reset", "setCompletionHandler", "setContext", "PingPong", "LoopType", "setLoops", "y", "_startSharkY", "tweenProps", "x", "accelerate", "Ease"

### `Tm` @L174367 (parent=Yg, score=22)
- methods: destroy, init, repeatMovePlatform, startEdit, startPlay, update
- strings: "value", "move", "_movePlatform", "enabled", "collider", "entity", "_moveTop", "_startY", "_moveBottom", "_speed", "_startT", "repeat", "MathUtils", "key", "repeatMovePlatform"

### `Nm` @L176447 (parent=Yg, score=22)
- methods: init, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, startEdit, update
- strings: "spin_flag", "value", "key", "onPlayerExitCollider", "onPlayerStayCollider", "fallingTime", "model", "onPlayerEnterCollider", "y", "x", "pos", "_flag", "rotation", "_spriteToAttachFlag", "toParentPoint"

### `Vk` @L188597 (parent=Rt.ElementBehaviour, score=22)
- methods: checkDragOnBorders, onDisable, onDragEnd, onEnable, onInit, onPanStart
- strings: "value", "onStopCameraDrag", "currentEditComponent", "_editController", "key", "onDragEnd", "_cameraNode", "onStartCameraDrag", "startDragStage", "dragElasticDistance", "start", "_dragging", "y", "x", "addPoint"

### `YC` @L202687 (parent=f.TeamPlayerRankEntryUI, score=22)
- methods: disable, layout, refresh, refreshScoreBar, showEmoji, showScoreAnim
- strings: "game_dropoff_penalty", ".png", "ui/icon_", "value", "layout", "emoji", "right", "left", "moreButton", "align", "nickName", "clanBadge", "genderHud", "avatar", "scaleX"

### `Aw` @L210193 (parent=f.AnnualTotalPanelUI, score=22)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "我就不会输！", "&nbsp;的玩家", "我的等级<br/>超过了&nbsp;", "&nbsp;级小萌新", "&nbsp;天的<br/>", "<br/>一枚加入&nbsp;", "%</span>", "<span style='color:#5B6A99'>", "monkey_kill.png", "star.png", "rainbow.png", "leaf.png", "right.png", "left.png", "value"

### `Ow` @L210286 (parent=f.AnnualIntimacyPanelUI, score=22)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "战队号：", " 位与我关系密切", "独行独坐，独唱独酬还独卧", "这一年你们对我很珍贵", "star.png", "chicken.png", "monkey_love.png", "right.png", "left.png", "value", "key", "getView", "leftPanel", "getLeftPanel", "rightPanel"

### `Fw` @L210366 (parent=f.AnnualUGCCreatePanelUI, score=22)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "热度 ", "border_level.png", "rainbow.png", "monkey_high.png", "bear.png", "right.png", "left.png", "value", "key", "getView", "leftPanel", "getLeftPanel", "rightPanel", "getRightPanel", "stopTweens"

### `Nw` @L210651 (parent=f.AnnualAssetsPanelUI, score=22)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "&nbsp;的玩家", "土豪指数<br/>超过了&nbsp;", "%</span>", "<span style='color:#F5A623'>", "dog.png", "right.png", "left.png", "value", "key", "getView", "leftPanel", "getLeftPanel", "rightPanel", "getRightPanel", "visible"

### `Xb` @L222648 (parent=f.RoomMemberHudUI, score=22)
- methods: destroy, refresh, refreshMicHud, reset, showEmoji, updatePosition
- strings: "value", "visible", "micHud", "key", "refreshMicHud", "y", "_point", "x", "pos", "localToGlobal", "stage", "avatar", "colliderHeight", "entity", "updatePosition"

### `Dh` @L99434 (parent=Rt.ElementModel, score=22)
- methods: encode, getFriendRelation, getRelationsByID, hasRelations, onStart, refresh, refreshIntimacy, reset
- strings: "value", "encode", "_item", "key", "intimacy", "getFriendByID", "_friendModel", "userID", "profile", "profileModel", "context", "id", "forEach", "relations", "refreshIntimacy"

### `Vw` @L210576 (parent=f.AnnualFriendPanelUI, score=22)
- methods: getLeftPanel, getRightPanel, getView, hide, refresh, show
- strings: "专业团队", "正是在下", "tutorial_ai_name", "avatars/avatar_trainer_pig.jpg", "border_100.png", "mygod.png", "star.png", "right.png", "left.png", "value", "key", "getView", "leftPanel", "getLeftPanel", "rightPanel"

### `Et` @L32298 (parent=f.ItemCommonEntryUI, score=21)
- methods: init, refresh, refreshEmoji, refreshGainInfo, setEmptyBorder, setSocialAvatar
- strings: "ui/icon_preview_blue.png", "ui/icon_preview.png", "ui/icon_equipped_blue.png", "ui/icon_equipped.png", ".png", "ui/reward_item_", "value", "visible", "canGain", "_item", "unlocked", "own", "reddot", "key", "refreshGainInfo"

### `Xn` @L53994 (parent=(无), score=21)
- methods: getLevelDescription, getLevelIcon, getLevelName, refresh, reset, resetRefreshTS
- strings: ".png", "badges/", "get", "_currentLevel", "key", "_currentIndex", "value", "resetRefreshTS", "_progress", "reset", "_lastRefreshTS", "now", "level", "progress", "refresh"

### `Gg` @L170191 (parent=Ag, score=21)
- methods: completeEdit, disable, enable, onChange, onChanged, refresh, updateData
- strings: "get", "_ui", "key", "ui", "_data", "data", "value", "text", "toString", "_value", "state", "refresh", "slider", "round", "onChange"

### `rn` @L49495 (parent=Rt.ElementStageView, score=21)
- methods: idle, onCloseButtonClicked, onDisable, onEnable, onHide, onShow, onToggleButtonClicked
- strings: "/gamelive/intro.png", "value", "selected", "tipsToggle", "_ui", "key", "onToggleButtonClicked", "onHide", "onCloseButtonClicked", "idle", "id", "hidePopup", "popupController", "context", "cancelLive"

### `dt` @L28349 (parent=f.VideoAdButtonUI, score=21)
- methods: onLoaded, refreshIcon, updateBgSkin, updateIcon, updateIconText, updateText
- strings: "ui/icon_gem.png", "ui/icon_coin.png", "ui/icon_share.png", "ui/icon_videoAd.png", "ui/icon_close_white.png", "_128.png", "ui/btn_", "value", "centerX", "iconHud", "left", "iconLabel", "updateText", "iconText", "visible"

### `pa` @L61119 (parent=Rt.ElementModel, score=21)
- methods: computeScale, getScaleInfo, give, onInit, refresh, reset, updateExpTag
- strings: "value", "clamp", "MathUtils", "log2", "min", "key", "computeScale", "notify", "onUpdate", "expData", "_levelInfo", "updateExpTag", "avg", "refresh", "_averageExpData"

### `Fs` @L73868 (parent=Cs, score=21)
- methods: encode, getFillPrice, isChecked, refresh, refreshConfig, reset
- strings: "value", "_maxClaimed", "push", "_histories", "key", "reset", "claimed", "days", "refresh", "call", "refreshConfig", "prototype", "eventId", "id", "config"

### `hm` @L172410 (parent=(无), score=21)
- methods: handleShootHit, handleTriggerNetworkEvent, onPlayerEnterTrigger, onPlayerExitTrigger, reset, triggerMe, update
- strings: "value", "move", "_alarmclockCollider", "_currentState", "shootstill", "shooting", "shootDuration", "_triggerStartTime", "disabled", "_isTriggering", "key", "update", "triggerSpeedUp", "match", "_alarmclockTrigger"

### `$k` @L190865 (parent=(无), score=21)
- methods: destroy, play, playSound, setVolume, tryPlayCacheSound, tryPlaySubpackageSound
- strings: "sound: exception ", "components/", "cdn/", ".wav", "value", "_onComplete", "warn", "completeHandler", "_channel", "volume", "_volume", "_baseUrl", "_rate", "playSound", "SoundManager"

### `Mu` @L112447 (parent=Rt.ElementComponent, score=21)
- methods: claimBankCoin, claimFreeCoin, onInit, refresh, refreshReddot, startWork, updateBankInfo
- strings: "value", "bankcoin", "bank", "add", "reddotController", "context", "_reddotTS", "now", "isBeforeToday", "TimeUtils", "canClaimBankCoin", "_bankModel", "clearRedDotByID", "key", "refreshReddot"

### `xk` @L185920 (parent=Rt.ElementBehaviour, score=21)
- methods: canAddEditComponentToLevel, createEditComponent, createEditComponentByID, createEditComponentByIndex, onInit, snapEditComponentToGrid, tryAddEditComponentToLevel
- strings: "value", "currentEditComponent", "snapComponentToGrid", "_level", "key", "snapEditComponentToGrid", "node", "camera2D", "context", "createEditComponent", "configs", "length", "createEditComponentByIndex", "id", "findIndex"

### `ur` @L78135 (parent=cr, score=20)
- methods: createAlbum, deleteAlbum, fetchLocalAlbums, getAlbumByID, updateAlbum, updateAlbumsSort
- strings: "album/changeorder", "album/delete", "album/edit", "album/create", "album/get", "album/info", "value", "sortAlbum", "handleAction", "_controller", "changeIndexes", "changeIDs", "orders", "encodeChangedSort", "post"

### `rp` @L122322 (parent=Rt.ElementComponent, score=20)
- methods: addScore, addStats, createScore, getScoreByID, onInit, refreshStats, updateScore
- strings: "stats/add", "value", "ID", "set", "_idToScore", "key", "createScore", "shareVideoCount", "commonStats", "updateScore", "refreshStats", "data", "handleUserMsg", "msgController", "context"

### `li` @L42050 (parent=(无), score=20)
- methods: initAvatar, initUrl, load, loadAvatar, unload
- strings: ".png", "cdn/", ".sk", "get", "_url", "_urlBackup", "isLoadingFromBackup", "_assetsLoader", "_subpackageUrl", "_isSubpackage", "key", "assetsUrl", "value", "_retryCount", "notify"

### `sh` @L97547 (parent=ah, score=20)
- methods: fetchHistories, fetchHistory, fetchReplay, fetchTopPvpList, fetchTopPvpsByIDs
- strings: "topbattle/getlist", "topbattle/getinfo", "pvphistory/gethistory", "pvphistory/gethistories", "value", "handleTopPvpFetched", "_controller", "histories", "data", "ids", "post", "request", "context", "replace", "stringify"

### `qh` @L101356 (parent=f.FriendEntryUI, score=20)
- methods: init, refreshEditingState, refreshIntimacy, refreshOnlineState, setEmptyState
- strings: "亲密度未知", "亲密度", "ui/btn_invite_normal.png", "ui-loc/btn_invite.png", ".png", "ui/icon_", "value", "text", "addr", "concat", "city", "profile", "_friend", "province", "intimacyEnable"

### `tp` @L121535 (parent=(无), score=20)
- methods: destroy, exit, init, isEarMuted, isMicMuted, isSupported, join, updateMuteConfig
- strings: "value", "start", "afterDelay", "ActionTask", "key", "exit", "mockup", "_isEarMuted", "isEarMuted", "_isMicMuted", "isMicMuted", "getLocalSettings", "join", "updateMuteConfig", "isSupported"

### `R_` @L132214 (parent=Rt.ElementComponent, score=20)
- methods: addEditComponentToMatch, createEditComponent, destroyEditComponent, giveUpEdit, onDestroy, onInit, setCurrentEditComponent
- strings: "value", "onSelect", "currentEditComponent", "_model", "component", "dispatch", "currentEditComponentCmd", "onUnselect", "key", "setCurrentEditComponent", "id", "addMatchComponent", "addEditComponentToMatch", "destroyEditComponent", "giveUpEdit"

### `Hf` @L138782 (parent=Gf, score=20)
- methods: createAnimBackgrounds, createAnimBg, destroy, init, update, updateBounds
- strings: "/snowflake.png", "ugctheme/", "/mountain2.png", "/mountain1.png", "value", "sizeGrid", "0,0,0,0,1", "size", "height", "ceil", "width", "skin", "Image", "key", "createAnimBg"

### `py` @L154591 (parent=(无), score=20)
- methods: hide, pos, refreshContent, reset, show
- strings: "game/npcpopup.png", "value", "pivotY", "_sprite", "size", "_popupBg", "height", "_content", "max", "align", "center", "left", "fontSize", "x", "width"

### `cm` @L172487 (parent=Yg, score=20)
- methods: init, onDestroy, startEdit, startPlay, update
- strings: "/levelalice/pattern.png", "value", "fixedDeltaTime", "timer", "update", "_patternBackground", "isComponentSpeedUpEnabled", "model", "_alarmclock", "y", "_p", "x", "pos", "_flag", "rotation"

### `Xm` @L176864 (parent=Yg, score=20)
- methods: getCameraScale, init, startEdit, startPlay, update
- strings: "value", "update", "_ball", "key", "setRemoteBall", "reset", "startPlay", "setBigBall", "setNormalBall", "currentRound", "model", "startEdit", "_currentScale", "height", "viewBounds"

### `JC` @L203348 (parent=f.PlayerRankEntryUI, score=20)
- methods: disable, refresh, refreshScoreBar, showEmoji, showScoreAnim
- strings: "game_dropoff_penalty", "value", "start", "setContext", "setDelay", "alpha", "emoji", "tweenProps", "addTween", "elasticOut", "Ease", "setEaseType", "scaleY", "scaleX", "TweenFlow"

### `$C` @L203921 (parent=Rt.State, score=20)
- methods: addAssets, loadLevelAssests, loadLevelSubpackage, onEnter, onLevelAssetsLoaded
- strings: "toast_maploadfailed", "cdn/levels", ".png", ".atlas", ".json", "unpack.json", "value", "exitGame", "controller", "context", "title", "getLocalizationText", "showToast", "onLevelAssetsLoaded", "setTaskComplete"

### `iw` @L204309 (parent=Rt.State, score=20)
- methods: onEnter, onExit, onInit, onUpdate, tryStopBGM
- strings: "value", "f", "e", "stopBgm", "bgm", "getView", "getHasMusic", "done", "n", "s", "components", "level", "context", "isUGCMode", "model"

### `ow` @L204830 (parent=Rt.State, score=20)
- methods: onEnter, onExit, onGetUGCInfo, onInit, onUpdate
- strings: "value", "handleUGCQuery", "lifeCycleController", "id", "currentLevel", "_ugcModel", "key", "onGetUGCInfo", "updateGame", "controller", "context", "f", "e", "update", "done"

### `_S` @L226383 (parent=Rt.ElementStageView, score=20)
- methods: close, onDisable, onEnable, onFavMarked, showTips
- strings: "/fav_tips_bilibili.png", "value", "visible", "_ui", "start", "setContext", "PingPong", "LoopType", "setLoops", "bottom", "arrow", "tweenProps", "skin", "cdnURL", "concat"

### `vS` @L226662 (parent=f.ItemIconUI, score=20)
- methods: clear, destroy, init, initBadgeItem, scaleNormalIcon
- strings: "value", "stopTweens", "imageEmojiIcon", "skin", "normalIcon", "visible", "extra", "characterDebrisIcon", "titleIcon", "stampIcon", "avatarIcon", "borderIcon", "emojiIcon", "scale", "height"

### `ut` @L28248 (parent=(无), score=20)
- methods: changeText, disable, enable, getClipboardData, onBlur, onFocus
- strings: "value", "complete", "text", "_inputField", "mouseEnabled", "success", "#000000", "changeText", "trim", "data", "getClipboardData", "isOnAndroid", "isOnStandalone", "key", "notify"
