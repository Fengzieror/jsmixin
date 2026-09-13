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

# 绑定块 1/6（152 个，已按证据分数降序）

### `RC` @L198803 (parent=Rt.ElementStageView, score=208)
- methods: actionMark, canChallengeGhost, canClaimWithVideo, canForcePvp, deleteLevel, enterChallenge, execReplayDataFetchedFunc, exitChallenge, fetchReplayData, gotoDouyinOfficialPage, handleFetchReplayData, handleStarLevelAction, handleVipRankEntryClicked, hideReplayButtons, initTab, onActionMarkLevel, onAlbumButtonClicked, onAnnualReportButtonClicked, onBroadcastButtonClicked, onChallengeButtonClicked, onChallengeHistoryAdd, onChallengeInReplayButtonClicked, onCommentButtonClicked, onCommentSuccess, onComponentAttched, onCopyButtonClicked, onCurrentLevelChanged, onDeleteButtonClicked, onDestroy, onDisable (+69)
- strings: "录制出现错误", "留在这", "好的", "前往首页查看效果？", "广播已发布", "知道了", "地图需要有人通关才能上首页", "提示", "下载全景图失败", "闯关模式", "作者设置了本地图为单人闯关而设计。", "作者设置了本地图为单人闯关而设计。如需体验双人闯关，可以点击右侧按钮", "作者设置了本地图专门为双人闯关而设计", "保存图片失败", "已保存到相册"

### `bk` @L184919 (parent=Rt.ElementBehaviour, score=120)
- methods: backToStandbyState, canReachFlag, cancelRevive, captureUGCLevel, changeReplaySpeed, confirmRevive, enterFakeRoom, enterFriendlyMatch, enterQQMatch, enterReplayMatch, enterRoster, exitGame, followNextTarget, getCanEditLevelComponent, getCanRotateLevelComponent, getChallengeModeDelegate, getDiffComponents, getFreeModeDelegate, getIsDoubleScoreRound, getIsOnlinePvPMode, getLevelID, getRoundCount, getUGCMultiplayerModeDelegate, giveUpThisRound, giveupUGCChange, handleUnlimitedHpAdded, haveUndefinedComponent, hidePlayers, onBeforeLoadAssets, onEndRoundPlay (+25)
- strings: "段位解锁组队赛", "达到", "组队赛入口已关闭", "btn_confirm_giveupround", "modal_content_giveupround", "modal_title_giveupround", "cannot find level data with id:", "/cloud", ".json", "value", "notify", "onGetEmoji", "model", "context", "key"

### `Lt` @L30471 (parent=xt, score=104)
- methods: getSkinRatings, haveItemCanGain, hidePanel, initList, isItemEquipped, isItemSelected, onActionClicked, onAnimButtonClicked, onAvatarLoaded, onBuy, onBuyButtonClicked, onCharacterUnlockSucceeded, onDebrisesUpdate, onDestroy, onDetailButtonClicked, onDisable, onEmojiButtonClicked, onEnable, onEquipped, onFilterButtonClicked, onGainButtonClicked, onGetRatings, onInit, onItemEntryClicked, onItemEquipFailed, onLockStateChanged, onRatingButtonClicked, onShareButtonClicked, onShopButtonClicked, onSkinTabClicked (+17)
- strings: "评分来自于资深玩家评审团", "解锁原始皮肤后才能使用", "前往商城", "试用中 (", "限免中", "生效中", "[解锁原始皮肤后才能使用]", "暂无", "级</span>&nbsp;|&nbsp;", "家族", "切换完毕", ".png", "ui/info_bg_", "<span style='color:", "get"

### `mk` @L183220 (parent=(无), score=102)
- methods: backToLastCheckpoint, backToStandbyState, canReachFlag, checkLevelValidity, clearTweens, createGhostPlayer, delayAfterPlayerDead, destroyGhostPlayer, followNextTarget, getCanEditLevelComponent, getCanRotateLevelComponent, getDiffComponents, getGoalAreaDelta, getIsDoubleScoreRound, getIsOnlinePvpMode, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, getSpawnDistanceBetweenPlayer, handlePlayerHitCheckpoint, haveUndefinedComponent, initGame, isTeamMode, onBeforeLoadAssets, onEndRoundPlay, onFlagOutOfBounds, onGhostStageChanged (+16)
- strings: "确定", "是否从起点重新开始?", "是否回退到上一个记忆点?", "你被困在了当前记忆点", "终点飞出了边界，无法胜利", "加载出错", "tutorial_start", "value", "alpha", "player", "_context", "_ghostPlayer", "needReplay", "_ugcModel", "canReachFlag"

### `ck` @L180735 (parent=(无), score=100)
- methods: addCellInPosToParams, addPlayerCellsToParams, addSuccessParam, completeRecord, createAIPlayer, createTargetBox, followNextTarget, getCanEditLevelComponent, getCanRotateLevelComponent, getDiffComponents, getIsDoubleScoreRound, getIsOnlinePvpMode, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, getSpawnDistanceBetweenPlayer, handlePlayerHitCheckpoint, initGame, isTeamMode, loadLocalData, nextHoriInputDealyParam, nextJumpParam, nextParam, nextRecord, onBeforeLoadAssets, onEndRoundPlay, onFlagOutOfBounds (+15)
- strings: "testplayer_jk", "value", "push", "_successParams", "key", "findIndex", "getAIParamKey", "instance", "x", "y", "sort", "passCells", "Vector", "map", "_params"

### `hk` @L180161 (parent=(无), score=98)
- methods: IncComponentCacheCount, adaptLevelData, checkDefaultElementsAndCreate, clearEvents, followNextTarget, getCached, getCanEditLevelComponent, getCanRotateLevelComponent, getCurrentMaxCountInLevel, getDiffComponents, getIsDoubleScoreRound, getIsOnlinePvpMode, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, getSpawnDistanceBetweenPlayer, handlePlayerHitCheckpoint, initGame, initLevelElements, isTeamMode, loadFromLocalStorage, loadUGCLevelData, onBeforeLoadAssets, onEndRoundPlay, onFlagOutOfBounds, onLocalPlayerDead, onLocalPlayerReachFlag (+14)
- strings: "的仓库容量已达上限", "value", "f", "e", "count", "playerLevel", "level", "levelInfo", "userLevelModel", "done", "n", "s", "unlockCountConfig", "maxCountInLevel", "key"

### `Bt` @L31525 (parent=xt, score=92)
- methods: equip, getEquippedID, getItemList, getOwnItemList, hidePanel, initList, initViews, isItemEquipped, isItemSelected, onActionClicked, onAuthButtonClicked, onBuy, onBuyButtonClicked, onDestroy, onDisable, onEditButtonClicked, onEditGenderButtonClicked, onEditNameButtonClicked, onEnable, onEquipped, onFilterButtonClicked, onInit, onItemEntryClicked, onItemEquipFailed, onProfileUpdate, onShopButtonClicked, onStageClicked, onTabClicked, refreshDetailPanel, refreshGainInfo (+11)
- strings: "今日无法修改性别", "前往商城", "试用中 (", "生效中", "全部", "avatar://", ".png", "ui/info_bg_", "ui/icon_", "ui/icon_skin_white.png", "value", "avatar", "notify", "onItemEquipFailed", "_userSystem"

### `za` @L64050 (parent=Fa, score=80)
- methods: canActionClan, fetchClanMembers, initPanel, isBlocked, onAction, onApplicationChanged, onApplicationClicked, onBlockButtonClicked, onBlockChanged, onCaptainInviteButtonClicked, onCopyButtonClicked, onDestroy, onDetailButtonClicked, onDisable, onEditButtonClicked, onEnable, onEntryDetailButtonClicked, onExitButtonClicked, onInit, onInviteButtonClicked, onJoinButtonClicked, onKickButtonClicked, onMemberLeave, onMembersInfoFetched, onMoreButtonClicked, onSearchButtonClicked, onSetViceCaptainButtonClicked, onStageClicked, refreshApplicationInfo, refreshBasciInfo (+5)
- strings: "取消", "退出", "注意：退出战队后第二天才能加入新的战队", "提醒", "转让队长", "只剩一个成员，无法退出", "复制成功", "战队号 ", "成立日 ", "条申请）", "成员 ", "申请", "加入", "无等级要求", "等级要求："

### `Wa` @L64652 (parent=Fa, score=80)
- methods: canEditUser, canSendMessage, checkNoticeLocal, enterUGC, fetchMessages, handleScroll, handleScrollStart, hideTextChatPanel, initPanel, onAction, onBlockButtonClicked, onBlockChanged, onDestroy, onDisable, onEmojiButtonClicked, onEnable, onGetMessage, onInit, onItemEntryClicked, onMessageListFetched, onMessagesFetched, onMoreButtonClicked, onNoticeButtonClicked, onPvpButtonClicked, onSendMessage, onStageClicked, onStageMouseDown, onTextButtonClicked, onUGCButtonClicked, playTween (+5)
- strings: "暂无公告", "请输入新的公告", "与当前公告内容相同", "系统维护 暂不可修改", "使用推荐公告", "队内公告", "请稍后再发送", "您已被禁言", "value", "start", "notice", "_ui", "setContext", "playTween", "setCompletionHandler"

### `cC` @L192438 (parent=Rt.ElementStageView, score=80)
- methods: canAddEditComponent, changeExpandedState, clearCurrrentSelectedEntry, createComponentAtCenter, getComponentLockType, getCurrentMaxCountInLevel, getLevelComponentsByType, getShouldAddComponent, idle, initList, initTab, initTabs, mapComponentCategoryToTabType, onDisable, onEditAnctionChanged, onEditComponentChange, onEnable, onEntryClicked, onEntryMouseDown, onGameStageMouseMove, onInit, onLevelModeChanged, onMouseUp, onMoveClickedEntry, onSkinChanged, onTabSelected, onVipComponentsInfoChanged, playInTween, playOutTween, refreshEntry (+5)
- strings: "该组件仅限「双人重生模式」", "该组件仅限「单人地图」", "级解锁", "玩家等级达到", "解封", "系统维护 暂不可用", "默认", ".png", "value", "get", "_levelComponentConfigMap", "set", "has", "key", "getLevelComponentsByType"

### `DC` @L198188 (parent=Rt.ElementStageView, score=80)
- methods: doSaveLevel, handleExit, handleSaveLevel, haveLevelDataToUpload, onBuySucceeded, onDisable, onEditAnctionChanged, onEnable, onExitButtonClicked, onInit, onLevelSave, onMapSizeButtonClicked, onMoveMapButtonClicked, onMovingMapValueCmd, onRecordStateChanged, onResizingMapValueCmd, onSaveButtonClicked, onSaveFailed, onSettingButtonClicked, onShareButtonClicked, onShareEnd, onShareRecordButtonClicked, onStartRecordButtonClicked, onStateChange, onStopRecordButtonClicked, onUndoButtonClicked, refreshUndoButton, saveLevel, startEdit, startPlay (+5)
- strings: "去修改", "上传失败", "关卡中有部分文字内容不符合平台规范", "录屏中 ", "录制出现错误", "录制时间要大于2秒", "录制时间要大于1秒", "录制时间要大于5秒", "录屏中 0s", "删除录屏", "分享", "分享录屏", "请先完成编辑", "先退出", "上传"

### `jb` @L221982 (parent=(无), score=80)
- methods: changeMatchMode, changeToCreativeMode, changeToFixedRoundEndType, changeToTargetScoreEndType, disable, enable, handleNotEnoughCoin, initList, initMapList, onBasicInfoChanged, onCloseButtonClicked, onMapEntryClicked, onMouseDown, onOKButtonClicked, onScrollEnd, onScrollStart, onSingleMapEntryClicked, onTeamMapEntryClicked, playInTween, playOutTween, refresh, refreshCurrentLevel, refreshCurrentMode, refreshEntries, refreshEntry, refreshList, refreshMapEntries, refreshMapList, refreshSingleEntry, refreshTeamEntry (+5)
- strings: "联赛升级到「", "随机地图", "当前选定：", "map_toast_unlockgate", "room_free", "value", "handleNotEnoughCoin", "_context", "key", "changeMatchMode", "_haveRoomFreeSkill", "haveCoin", "currencyModel", "getMapPrice", "_currentLevelID"

### `ul` @L88695 (parent=Rt.ElementStageView, score=78)
- methods: addHp, canClaimBy, cancelAddUnlimitedHp, idle, onAdButtonClicked, onBuyButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLiveButtonClicked, onLiveStateChanged, onLoadVideoFailed, onPopupClear, onRecordStateChanged, onShareButtonClicked, onShareCompleted, onShow, onStateChanged, onUnlimitedChanged, onUnlimitedTimeAdd, onVideoShareButtonClicked, onVipButonClicked, onWatchVideoEnd, playInTween, playOutTween, refresh, refreshClaimTypes, refreshCountdownProgress (+4)
- strings: "求助好友，才能生命无限哦", "发布视频，才能生命无限哦", "钻石不足", "次机会", "今天还有", "直播期间无限生命", "发起直播失败", "等待开播中", "今日求助次数已达上限", "分钟无限生命", "toast_norewardquota", "hp_toast_unlimited", "value", "refresh", "hasValidVideo"

### `dk` @L181196 (parent=lk, score=76)
- methods: canEnableGhost, checkIfFirstPvp, followNextTarget, getCanEditLevelComponent, getCanRotateLevelComponent, getIsOnlinePvpMode, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, initGame, isTeamMode, onDropIn, onFetchLevelSnapshot, onGetLevelSnapshotFromOtherPlayer, onLocalPlayerDead, onLocalPlayerReachFlag, onOpponentAvatarUpdate, onOpponentJoin, onOpponentLeave, onPartyComponentSelected, onPlayerEditLevelComponent, onPlayerWeakConnected, onProjectileTriggerComponent, onStartEdit, onStartPlay, pointerHandTip, shouldShowMoreRoundsToast (+3)
- strings: "遇见高手 开启5局模式", "只剩1个对手，不能切换了", "pvp_start", "value", "parse level snapshot failed", "error", "player", "_context", "loadDataFromCheckpoint", "getIndexToComponent", "level", "forEach", "keys", "decompressFromBase64", "parse"

### `qa` @L65396 (parent=Rt.ElementStageView, score=74)
- methods: checkClanIntroLocal, checkClanNameLocal, handleDisableInput, idle, initPanel, needUpdateClan, onAction, onBadgeListButtonClicked, onChangeIDButtonClicked, onChangeModeButtonClicked, onChangeNameButtonClicked, onCheckNameButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onIntroChanged, onLevelChanged, onNameChanged, onOKButtonClicked, onPopupHide, onShow, onTransferButtonClicked, playInTween, playOutTween, refreshIntroInfo, refreshJoinMode, refreshLevelInfo (+2)
- strings: "战队号修改成功", "战队名称修改成功", "战队名称可以使用", "请输入战队名称", "系统维护 暂不可修改", "不足", "修改", "确认创建", "创建确认", "的数字", "请输入0-", "下一步", "保存", "建立我的战队", "战队设置"

### `Zb` @L223299 (parent=Rt.ElementStageView, score=74)
- methods: changeToCharacterState, changeToCharacterUnlockState, changeToHomeState, changeToMatchmakingStartState, changeToMatchmakingState, changeToTutorialEndState, clearLocalPlayer, clearOpponentPlayers, despawnOpponentPlayer, getPlayer, getPlayerSpawnPoint, loadLevel, onCharacterChanged, onChararcterSkinUpdate, onDestroy, onDisable, onEnable, onGetEmoji, onInit, onMemberHudClicked, onProfileUpdate, refreshRoomHud, refreshRoomHuds, setLocalPlayerSpawnPoint, setPlayerToSpawnPoint, spawnOpponentPlayer, tryRefreshPlayerAvatar, update, updateBasicInfo, updatePlayerSpawnPoint (+2)
- strings: "value", "updatePosition", "_roomMemberHuds", "spawnIndex", "userProfile", "matchModel", "key", "updateRoomHudPosition", "forEach", "_opponentPlayers", "_player", "updateRoomHudsPosition", "openID", "basic", "indexOf"

### `Ck` @L184606 (parent=lk, score=72)
- methods: followNextTarget, getCanEditLevelComponent, getCanRotateLevelComponent, getIsOnlinePvpMode, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, getSpawnDistanceBetweenPlayer, handlePlayerHitCheckpoint, initGame, isTeamMode, onBeforeLoadAssets, onDropIn, onEndRoundPlay, onFlagOutOfBounds, onLocalPlayerDead, onLocalPlayerReachFlag, onOpponentAvatarUpdate, onOpponentJoin, onOpponentLeave, onPlayerEditLevelComponent, onPlayerWeakConnected, onProjectileTriggerComponent, onStartEdit, onStartPlay, startGame, stopGame (+1)
- strings: "pvp_start", "value", "weakConnectedVisible", "isWeakConnected", "matchModel", "headIcon", "key", "onPlayerWeakConnected", "updateAvatar", "originalAvatarUrl", "basic", "originalNickName", "updateNameAndAvatar", "userProfile", "userID"

### `Al` @L92876 (parent=(无), score=70)
- methods: destroy, disable, enable, getDifficultyStar, onCardClicked, onClaimButtonClicked, onCreateButtonClicked, onDailyChallengeFetched, onDoubleClaimButtonClicked, onGroupRewardClaimed, onHistoryButtonClicked, onLevelRewardClaimed, onLoadVideoFailed, onNextButtonClicked, onOKButtonClicked, onRewardPanelClicked, onShareCompleted, onUnlockAdButtonClicked, onUnlockButtonClicked, onWatchVideoEnd, refresh, refreshCountdownHud, refreshLevelInfo, refreshRewardInfo, refreshUnlockButton, skipWithCoin, trySkipFree, unlockWithCoin, update, updateVipInfo
- strings: "冷却时间 ", "正在冷却中", "看广告", "稍后再说", "广告结束后，即可立即挑战关卡", "继续观看广告?", "金币结束冷却时间？", "使用", "提示", "视频用完了", "再想想", "跳过", "即将为您跳过本关，您也无法获得本关的通关奖励。", "跳过关卡", "金币跳过本关？"

### `ak` @L179407 (parent=Rt.ElementModel, score=70)
- methods: changeReplaySpeed, decrementPrepCountdown, enableComponentSpeedUp, generatePartyComponents, getAvaliablePartyComponents, getMatchResult, getPartyComponentToSelect, getShouldAddComponent, getUGCPvpMatchResult, initRoundData, isLocalPlayerSelectPartyComponent, nextRound, onInit, plusRoundEndPlayersCount, pulsPrepPlayersCount, reset, resetCurrentTotalPlayTime, resetRound, resetTimeByCheckpoint, selectRoundComponent, setGameMode, setGameStarted, setInitReplaySpeed, setServerPlayStartTime, startPlay, updateElapsedTimeByCheckpoint, updatePlayStartTime, updatePlayStartTimeFromServerElapsedTime, updatePlayTime, updateRaceTime
- strings: "value", "components", "push", "_roundComponents", "length", "_selectedPlayerIndexes", "key", "initRoundData", "notify", "onGetMatchResult", "_matchSettled", "getMatchResult", "_isWin", "isWin", "_totalRaceTime"

### `$w` @L212486 (parent=Rt.ElementComponent, score=70)
- methods: bindPhoneNumber, checkVersion, claimAnnualReward, claimDouyinFollowReward, claimFriendlyMatchReward, claimShareRewardCoin, decodeAccountFromWechat, encodeAuthData, fetchAnnualReport, fetchProfile, fetchRealNameInfo, generateRestoreCode, getRestoreAccount, handleAnnualReportFetchCompleted, handleRestoreCodeGenerated, initProfileInfo, onGetUserProfileMsg, onInit, onNativeAuth, onWechatAuth, randomNickName, redeem, relogin, setAvatar, unlockAnnualReport, updateAccountFromWechat, updateGender, updateNickName, updatePhoneNumber, verifyPhoneNumber
- strings: "头像已同步", "昵称已同步", "account/update", "account/decode", "value", "updateProfile", "notify", "onProfileUpdate", "_model", "onAuth", "user", "updateBasicInfo", "profile", "needInitAvatar", "title"

### `An` @L51827 (parent=Rt.ElementStageView, score=68)
- methods: canShowReward, fetchUGCLevels, fetchUGCLevelsReverse, hideTutorial, idle, onBannerButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onEntryClicked, onHide, onInit, onLevelPassed, onMouseDown, onRewardClaimed, onRewardPanelClicked, onScroll, onScrollEnd, onScrollStart, onShow, onSkipButtonClicked, onTrainingLevelsFetched, onUGCLevelsFetched, refreshEntry, refreshList, refreshRewardPanel, setData, tryTutorial
- strings: "请先完成上一个关卡", "点开放", "花费钻石或印花跳过关卡？", "跳过关卡", "完成度 ", "关卡已跳过", "获得", "完成", "story.png", ".png", "/ui/title/", "title.png", "training_banner.png", "value", "tutorial"

### `Es` @L73086 (parent=Rt.ElementStageView, score=68)
- methods: despawnPlayer, handleBuy, idle, initList, onAction, onBackButtonClicked, onBottomBarClicked, onDisable, onEnable, onEventStateChanged, onEventTimeChanged, onFreeRewardButtonClicked, onHide, onInit, onRankEntryClicked, onRankFetched, onRareRewardButtonClicked, onShow, playInTween, playOutTween, refreshBasicInfo, refreshEmoji, refreshList, refreshRankEntry, refreshScoreProgress, refreshScoreRewards, refreshSelftRankInfo, showIntroPopup, spawnPlayer
- strings: "活动已结束", "距结束还有：", ".png", "ui/icon_", "reward_score.png", "reward_rank.png", "theme_name.png", "theme_bg.png", "value", "_player", "destroy", "key", "despawnPlayer", "scaleY", "entity"

### `Pr` @L82033 (parent=Lr, score=68)
- methods: actionComment, actionMark, addUnlimitedHpTime, addUploadSlotByVideo, adminActionComment, adminActionLevel, buyUploadSlot, comment, createUGCLevel, deleteUGCLevel, fetUGCLevelsByIDs, fetchComments, fetchHistoryList, fetchLevelData, fetchLocalLevels, fetchMarkList, fetchUGCRankList, fetchUGCReplayList, fetchUGCStarRankList, reportComment, reportLevel, searchUGCLevel, settle, updateIcon, updateLevelData, updatePanorama, upload, uploadLevelMode, uploadNameAndTag
- strings: "全景图", "无限体力", "今日已举报", "您今天已经举报过了", "删除评论", "ugclevel/addmark", "ugclevel/delmark", "ugclevel/getmarklist", "ugclevel/playhistory", "ugclevel/getlocallevelids", "ugclevel/addcomment", "ugclevel/getcomments", "ugclevel/updatepanorama", "ugclevel/updateicon", "shop/buy"

### `Br` @L82939 (parent=Lr, score=68)
- methods: actionComment, actionMark, addUnlimitedHpTime, addUploadSlotByVideo, adminActionComment, adminActionLevel, buyUploadSlot, comment, createUGCLevel, deleteUGCLevel, fetUGCLevelsByIDs, fetchComments, fetchHistoryList, fetchLevelData, fetchLocalLevels, fetchMarkList, fetchUGCRankList, fetchUGCReplayList, fetchUGCStarRankList, reportComment, reportLevel, searchUGCLevel, settle, updateIcon, updateLevelData, updatePanorama, upload, uploadLevelMode, uploadNameAndTag
- strings: "这是一条评论这是一条评论这是一条评论", "这是一条评论这是一条评论", "这是一条评论", "value", "id", "actionMark", "_model", "key", "handleMarkListFetched", "push", "fetchMarkList", "handleHistoryListFetched", "fetchHistoryList", "handleLocalLevelsFetched", "fetchLocalLevels"

### `fu` @L110694 (parent=Rt.ElementStageView, score=68)
- methods: buyWithCurrency, idle, onAnimButtonClicked, onAvatarLoaded, onBuy, onBuyButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onGetRatings, onHide, onInit, onMinusButtonClicked, onPlusButtonClicked, onRatingButtonClicked, onShareButtonClicked, onShow, playInTween, playOutTween, refrehShopDataInfo, refreshBuyInfo, refreshDetailInfo, refreshGainInfo, refreshIcon, refreshLimitInfo, refreshProgressHud, setShopData, updateScreenshotPlayerAnim
- strings: "暂无", "评分来自于资深玩家评审团", "赠送试用卡：", "购买个数：<span style='color:#FFCA00'>", "今日限购", "永久限购", "日内限购", "使用期限 ", "级</span>&nbsp;|&nbsp;", "确认购买", ".png", "ui/icon_", "</span>", "ui/info_bg_", "<span style='color:"

### `ZC` @L203472 (parent=Rt.ElementStageView, score=68)
- methods: onBeforeEndMatch, onChallengeHistoryAdd, onChangeViewButtonClick, onCommentButtonClicked, onCommentSuccess, onComponentAttched, onDestroy, onDisable, onEmojiSelected, onEnable, onExitButtonClick, onGameStateChanged, onGetEmoji, onGiveUpButtonClick, onHpTipButtonClicked, onInit, onLocalPlayerStateChanged, onPlayCountdown, onPlayerScoreAdd, onRematchButtonClicked, onRespawnHudClicked, onStartPlay, playAnnouncement, playCelebrateTween, playEndCountdownTween, playEndTween, refreshCommentInfo, refreshStarHud, refreshTime
- strings: "知道了", "重生时，在上个触碰的重生点继续游戏。", "重生点已启用", "重生时，使用气泡自动跟随队友。点击屏幕可戳破气泡，继续游戏。", "气泡已启用", "取消", "是的", "抛下队友，退出闯关，这就是你要的结果吗？", "溜之大吉？", "继续", "重玩", "立即重玩?", " 到达终点", ".png", "number/number_"

### `hl` @L88153 (parent=Rt.ElementStageView, score=66)
- methods: canClaim, canClaimBy, idle, onAdButtonClicked, onBuyButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onRecordStateChanged, onShareButtonClicked, onShareCompleted, onShow, onStateChanged, onUnlimitedChanged, onUnlimitedTimeAdd, onVideoShareButtonClicked, onWatchVideoEnd, playInTween, playOutTween, refresh, refreshButtonTip, refreshClaimTypes, refreshHp, refreshHpInfo
- strings: "求助好友，才能生命无限哦", "发布视频，才能生命无限哦", "钻石不足", "开启{{count}}分钟无限生命？", "再续{{count}}分钟无限生命？", "今日求助次数已达上限", "toast_norewardquota", "hp_toast_unlimited", "hp_recoverinfo", "hp_title_state_full", "hp_unlimitedinfo", "hp_tip_trial", "hp_tip_challenge", "hp_tip", "hp_title_state_empty"

### `bl` @L90868 (parent=Rt.ElementStageView, score=64)
- methods: fetchComments, handleCommentResult, onBackButtonClicked, onBlockButtonClicked, onCommentButtonClicked, onCommentChanged, onCompleteButtonClicked, onDeleteButtonClicked, onDetailButtonClicked, onDisable, onEditButtonClicked, onEnable, onFetched, onInit, onMouseDown, onQQGroupClicked, onReportButtonClicked, onScroll, onScrollEnd, onScrollStart, onStickyButtonClicked, onUnblockButtonClicked, onUnstickyButtonClicked, refresh, refreshEntry, refreshList, showReportPanel
- strings: "条，屏蔽", "显示", "举报已提交", "金币删除这条评论？", "使用", "提示", "取消", "删除并扣分", "是否立即删除这条评论，并扣分？", "巡检", "删除", "是否立即删除这条评论？", " 评论ID：", "玩家ID：", "看信息"

### `Lw` @L208349 (parent=(无), score=64)
- methods: cancelMatchmaking, debugMatchmaking, destroy, generateDouyinChannel, kickPlayerFromFriendlyMatch, onFriendlyMatchBasicInfoChanged, onFriendlyMatchChangeLevel, onFriendlyMatchChangeMode, onFriendlyMatchChangeOwner, onFriendlyMatchStateChanged, onGetActionResult, onGetDouyinChannel, onGetEmoji, onGetSwitchFriendlyMatchResult, onMatchmakingCancel, onMatchmakingFail, onMatchmakingSuccess, onRosterStateChange, sendEmoji, startEnterMatchmakingQueue, startFriendlyMatch, startFriendlyMatchmaking, startMatchmaking, startQQMatch, switchFriendlyMatch, update, updateFriendlyMatchBasicInfo
- strings: "您被房主请出了房间", "服务器正在更新维护，请稍后再试", "队伍人数不够", "队伍人数已满", "房间已超时", "组队好友可能退出了匹配", "matchmaking_result_matchstart", "matchmaking_result_matchfull", "matchmaking_result_matchnotexist", "matchmaking_result_matchnotowner", "value", "channelID", "updateDouyinChannel", "model", "_system"

### `Ra` @L63159 (parent=Rt.ElementStageView, score=62)
- methods: idle, onBuy, onBuyButtonClicked, onClaimButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onShareCompleted, onShow, onWatchVideoEnd, playInTween, playOutTween, refrehShopDataInfo, refreshBuyInfo, refreshClaimButton, refreshDetailInfo, refreshGainInfo, refreshIcon, refreshLimitInfo, refreshProgressHud, refreshRewardClaimType, setData
- strings: "通信失败，请尝试分享到其他群", "发布视频，才能获得小喇叭哦", "每日可领", "今日可领 ", "限购 ", "确认购买", ".png", "ui/info_bg_", "value", "_rewardClaimType", "videoShare", "isOnDouyin", "share", "isOnWechat", "video"

### `us` @L69468 (parent=hs, score=62)
- methods: blockUser, checkClanName, createClan, fetchClanList, getApplicationByIDs, getApplicationIDs, getChatMessageByIDs, getChatMessageIDs, getClanByIDs, getClanInfo, getLocalClanID, getMembers, handleApplication, invite, join, kickMember, leave, randomBadgeData, searchClan, sendChatMessage, setViceCaptain, transferRole, updateClanInfo, updateClanName, updateClanNotice, updateShortID
- strings: "这是一条文本消息", "发送人_", "哇哇哇", "我的战队", "啦啦啦啦啦啦啦这", "战队", "clanmember_2", "clanmember_1", "clanmember_0", "value", "encodeBadge", "frame", "badges", "clan", "keys"

### `uc` @L104017 (parent=Rt.ElementComponent, score=62)
- methods: afterPay, checkIfCanPay, delayRetryOnIOS, getPrice, handleBuySucceeded, handlePay, handleRechargeMsg, logBuySucceeded, logRecharge, onDestroy, onGetItem, onPayFailed, onPaySucceeded, onStart, pay, payOnAndroidAli, payOnAndroidWechat, payOnIOS, payOnKuaishou, payOnQQ, payOnToutiao, payOnWechat, retryOnIOS, showAlert, showInvalidPayReason, startRetryOnIOS
- strings: "苹果官方", "处理中", "支付错误 ", "错误 ", "出错了", "支付宝", "微信", "提示", "由于健康系统限制, ", "你本次支付已超过单次限额", "你本次支付已超过当月限额", "你暂不可购买游戏道具", "佩戴", "稍后再说", "是否立即佩戴魔法师专属头像框？"

### `V_` @L132318 (parent=Rt.ElementComponent, score=62)
- methods: addScore, hitByProjectile, kill, killByShooty, killFromSquashed, killOutOfScope, localPlayerKillByComponent, onComponentEvent, onInit, onProjectileEvent, reachCheckpoint, reachFlag, reachRespawnPoint, reset, sendLevelComponentEvent, sendOnlineLevelComponentEvent, sendProjectileHitEvent, springJump, startInvincible, stopInvicible, suicide, triggerAttachableComponent, triggerLevelComponent, triggerSpeedUp, triggerTextComponent, tryTriggerLevelComponent
- strings: "需要获得全部星星", "value", "onComponentEvent", "key", "onProjectileEvent", "sendLevelComponentEvent", "sendProjectileHitEvent", "PlayerLevelComponentMsgID", "sendCommand", "_matchRoom", "asUint8Array", "finish", "endPlayerLevelComponentMsg", "PlayerLevelComponentMsg", "playElapsedTime"

### `Lm` @L174519 (parent=Df[=LevelComponentBase], score=62)
- methods: attachBossColliders, destroyOnQuit, getElementExtension, getIsSystemDefaultComponent, getMoreEditData, getShouldRecycle, loadSkeleton, onAddToLevel, onBossEditComplete, onMouseClick, onPlayerEnterTrigger, onPlayerExitTrigger, onReset, onSkeletonLoad, onStartEdit, onStartPlay, playAnim, playIdleAnim, playStartAnim, playerWalkAnim, setElementExtension, setOverrideSpeed, setSkeletonTransform, update, updateBossProperties, updateFromMap
- strings: "格/秒）", "快速", "适中", "慢速", "/bgwide/boss.png", "/bgwide/boss.sk", "get", "skeleton", "_skeletonLoader", "destroyed", "key", "value", "_speed", "cellVisualSize", "speed"

### `Em` @L174945 (parent=Df[=LevelComponentBase], score=62)
- methods: attachBossColliders, destroyOnQuit, getElementExtension, getIsSystemDefaultComponent, getMoreEditData, getShouldRecycle, loadSkeleton, onAddToLevel, onBossEditComplete, onMouseClick, onPlayerEnterTrigger, onPlayerExitTrigger, onReset, onSkeletonLoad, onStartEdit, onStartPlay, playAnim, playIdleAnim, playStartAnim, playerWalkAnim, setElementExtension, setOverrideSpeed, setSkeletonTransform, update, updateBossProperties, updateFromMap
- strings: "格/秒）", "快速", "适中", "慢速", "/bgtall/boss2.png", "/bgtall/boss2.sk", "get", "skeleton", "_skeletonLoader", "destroyed", "key", "value", "_speed", "cellVisualSize", "speed"

### `cs` @L68898 (parent=hs, score=60)
- methods: blockUser, checkClanName, createClan, fetchClanList, getApplicationByIDs, getApplicationIDs, getChatMessageByIDs, getChatMessageIDs, getClanByIDs, getClanInfo, getLocalClanID, getMembers, handleApplication, invite, join, kickMember, leave, searchClan, sendChatMessage, setViceCaptain, transferRole, updateClanInfo, updateClanName, updateClanNotice, updateShortID
- strings: "】移除", "你已被【", "clan/appoint", "clan/blockuser", "clan/sendmessage", "clan/getmessages", "clan/getmessageids", "clan/kickmember", "clan/changecaptain", "clan/leave", "clan/join", "clan/randjoin", "clan/invite", "clan/closeapply", "clan/getapplies"

### `Xs` @L74928 (parent=zs, score=60)
- methods: handleScroll, initPanel, onAction, onDestroy, onDisable, onDrawAnimCompleted, onDrawButtonClicked, onEnable, onGetButtonClicked, onInit, onIntroButtonClicked, onItemEntryClicked, onLoadVideoFailed, onMaxRewardClicked, onShareCompleted, onVipButtonClicked, onVipUpdate, onWatchVideoEnd, refreshCurrencyHud, refreshItemEntry, refreshPanel, refreshRewardClaimType, startDrawAnim, startListTween, update
- strings: "开通免广告", "已开通免广告", "今日已获得&nbsp;", "每次兑换，可以额外获得20贵族经验（每日上限为1000", "说明", "已领取", "通信失败，请尝试分享到其他群", "发布视频，才能获得幸运鹅哦", "分钟可获得1只幸运鹅", "在线玩", "只幸运鹅", "每天最多获得", "次可获得大奖", "今日累计抽取", "</span>"

### `au` @L108967 (parent=Kc, score=60)
- methods: destroy, destroyEntries, disable, enable, hideTutorial, onBuy, onDailyItemsFetched, onFeaturedEntryClicked, onFreeGemEntryClicked, onFreeGemUpdate, onHotEntryClicked, onLoadVideoFailed, onNewbiePanelClicked, onPackEntryClicked, onRechargeEntryClicked, onRecharged, onVipPanelClicked, onWatchVideoEnd, refresh, refreshEventPanel, refreshNewbiePanel, refreshVipPanel, showPackDetailPopup, tryShowTutorial, update
- strings: "您已经购买", "已购买", "每日可领", "冷却中", "剩余时间：", "距活动结束：", "更新倒计时：", "shop_tutorial", "recharge/banner_vip.png", "recharge/banner_newbie.png", "banner.png", "value", "tutorial", "hideView", "isEnabled"

### `C_` @L130115 (parent=Rt.ElementBehaviour, score=60)
- methods: applyAnimAndCheckJump, applyBoundsCheck, applyCollisionStatesAndGravity, applyHorizontalVelocity, applyMove, applyMoveEntity, applyVerticalVelocity, celebrate, checkIfOutOfScope, checkIfReachFinishPoint, checkPlayerPenetration, clearMove, moveToFinishPoint, onDisable, onEnable, onEndRound, onHitCollider, onInit, onPlayerBecomeDisabled, onStart, refreshBounds, tryCelebrate, update, updateCollision, updateIfOnDynamicEntity
- strings: "value", "y", "x", "_curMinimuTranslationVector", "addExtraMotion", "_model", "disablePenetrationFix", "_headPenetrationFrames", "killFromSquashed", "match", "context", "npc", "type", "_headPenetration", "_rightPenetration"

### `pk` @L181705 (parent=lk, score=60)
- methods: generateTutorial1Elements, getCanEditLevelComponent, getCanRotateLevelComponent, getIsDoubleScoreRound, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, initGame, isTeamMode, jumpButtonTip, onLocalPlayerDead, onLocalPlayerReachFlag, onPartyComponentSelected, onPlayerEditLevelComponent, onStartEdit, onStartPlay, playToastHud, pointerHandTip, rightButtonTip, startGame, stopGame, updateGame
- strings: "同时按右和跳跃键，跳一下试试", "按住右键，往前走", "放个刺球，搞搞破坏如何？", "建造一个平台，通往终点！", "tutorial_round3", "tutorial_control_jump", "tutorial_round2", "tutorial_round1", "tutorial_round", "tutorial_start", "value", "playToastHud", "_gameUI", "key", "setPosition"

### `Tv` @L146140 (parent=(无), score=59)
- methods: bounce, checkCollision, deviateAndRemoveFromPreviousTriggers, getCanAddShootPressure, getCanTeleportNow, getEntity, getIsInsideLastTeleportedOfPortal, getIsInsidePortal, getIsOutOfOfPortal, getIsProjectile, getIsTeleportable, getShootVector, getShootableRelatedLevelComponent, getShouldPlayAudio, getTeleportDelay, getTriggerPlayer, reset, restoreLastTeleportedPortal, setOffset, setProperties, setStart, setWillDestroyBalloon, teleport, teleportFadeOut
- statics: collisionResultTemp
- strings: "value", "bottom", "bounds", "collider", "_entity", "right", "contains", "y", "x", "outEntity", "key", "getIsInsidePortal", "reset", "collisionResultTemp", "cloneTo"

### `ua` @L60468 (parent=Rt.ElementStageView, score=58)
- methods: getMailContent, getMailTitle, idle, onAgreeButtonClicked, onClanAction, onCloseButtonClicked, onDenyButtonClicked, onDisable, onEnable, onEntryClicked, onFetched, onHide, onInit, onMouseDown, onRead, onRelationAction, onScrollEnd, onScrollStart, onShow, playInTween, playOutTween, refreshEntry, setJumpView, showUserDetailView
- strings: "拒绝了您的申请", "你已经被移除", "你的身份变更为「", "欢迎你的加入", "招募人", "邀请人", "关系", "解除了和你的", "成为了你的", "邀请你成为ta的", "亲密度", "增加", "赠送给你", "新等级：", "合力打破了你的纪录"

### `El` @L92409 (parent=Rt.ElementStageView, score=58)
- methods: handleEntryClicked, hideTutorial, idle, onBattlePassHudClicked, onCloseButtonClicked, onDailyChallengeFetched, onDestroy, onDisable, onEnable, onGameLiveButtonClicked, onHide, onInit, onLiveStateChanged, onPrintingHudClicked, onSelectButtonClicked, onShow, onTutorialPass, playInTween, playOutTween, refreshCurrentMode, refreshGameLiveButton, setData, tryTutorial, update
- strings: "好的", "以后再说", "直播闯关", "开播后，大家可以在派对电视台中看到你！", "直播期间体力无限，还能出现在派对电视台中！", "闯关开宝箱 每日0点刷新", "有效时间剩余", "value", "battlepass", "showView", "uiStackController", "context", "key", "onBattlePassHudClicked", "refreshGameLiveButton"

### `We` @L40339 (parent=(无), score=56)
- methods: auth, clear, completeMission, completeTrainingMission, endLogin, failTrainingMission, finishTutorial, getTrainingMissionID, getUserData, initProfile, log, logLoginEvent, logToAliyun, logined, onChargeCancel, onChargeRequest, onChargeSuccess, onPurchase, onReward, startLogin, startTrainingMission, telLogin, updateProfile
- strings: "2.1.47", "value", "type", "tel", "Tel", "taptap", "TapTap", "apple", "Apple", "nativewechat", "Wechat", "nativeLoginPlatform", "profileModel", "isInited", "None"

### `Vn` @L52741 (parent=Rt.ElementStageView, score=56)
- methods: handleChallengeTraining, handlePvpTraining, handleSkillTraining, hideTutorial, idle, needTutorial, onAIButtonClicked, onBasicButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onRewardClaimed, onShow, onTrainingDataFetched, onTrainingEntryClicked, onTrainingRewardPanelClicked, passTutorial, refreshEntry, showTrainingLevelsView, tryTutorial
- strings: "挑战", "请先完成", "我的技能等级：", "training_tutorial", "ai_training.png", "value", "hideTutorial", "set", "idStr", "getStorageSync", "key", "passTutorial", "skill", "hard", "difficulty"

### `fo` @L55236 (parent=Rt.ElementStageView, score=56)
- methods: fetchDetailInfo, idle, onClanAction, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onEntryJoinButtonClicked, onHide, onInit, onMessageRemoved, onMessagesFetched, onScroll, onScrollStart, onShow, onUGCLevelsFetched, playInTween, playOutTween, refreshEntries, refreshEntry, refreshEntryByMessage, refreshList, startUGCChallenge
- strings: "小时，可随时查看", "广播消息会保留", "历史广播", "get", "_fetchingMsgs", "_fetchingLevels", "_fetchingClans", "key", "isFetching", "value", "refreshEntryByMessage", "id", "getMessageByID", "chatModel", "context"

### `Is` @L72025 (parent=Rt.ElementComponent, score=56)
- methods: buyBattlePass, buyBattlePassLevel, buyRankRushPass, checkin, claimBattlePassMaxReward, claimBattlePassReward, claimFullCheckedReward, fetchBattlePassInfo, fetchLeaderboard, fetchRankRushInfo, fillCheckin, handleBattlePassBuyLevelResult, handleBattlePassBuyResult, handleBattlePassClaimResult, handleBattlePassCommonResult, handleBattlePassMaxClaimResult, handleCheckinResponse, handleLotteryResponse, handleRankRushPassBuyResult, lotteryClaimMax, lotteryDraw, lotterySync, onInit
- strings: "抽奖", "抽奖大奖", "通行证", "派对金库", "通行证免费奖励", "通行证奖励", "冲榜活动", "通行证等级", "7日签到", "pack_battlepass", "value", "notify", "onAction", "handleGetItems", "delayCurrencyAnim"

### `nl` @L87004 (parent=el, score=56)
- methods: createLevel, fetchUGCLevels, onAlbumAction, onDestroy, onDisable, onEditButtonClicked, onEmptyClicked, onEnable, onEntryClicked, onInit, onLocalLevelsFetched, onMouseDown, onScroll, onScrollEnd, onScrollStart, onSelfEntryClicked, onTrialButtonClicked, onUGCLevelsFetched, onUploadSlotChanged, refreshEntry, refreshLevelsInfo, refreshList, startUGC
- strings: "地图额度已达上限", "地图 0/", "地图 ", "ugc_toast_createfailed", "ugc_tips_local", "value", "createLevel", "mode", "free", "game", "changeState", "create", "Handler", "startFadeWithTask", "cloudTransition"

### `al` @L87480 (parent=Rt.ElementStageView, score=56)
- methods: checkAutoLevelName, checkEditLevelName, idle, initTags, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onNameAndTagUpload, onShow, onTagEntryClicked, onUnloadButonClicked, playInTween, playOutTween, refreshAutoName, refreshTags, refreshTips, setItem, uploadName, uploadTag
- strings: "请选择（", "作者很懒什么也没选", "根据您选择的特点自动生成地图名", "根据您选择的特点自动生成地图名，点击可切换", "作者很懒什么都不写", "请至少选择一种类型", "最多可以选择", "保存", "地图类型", "地图名称", "ugc_upload_tip", "ugc_error_illegalname", "ugc_error_nametoolong", "ugc_error_emptyname", "value"

### `xl` @L91577 (parent=(无), score=56)
- methods: disable, enable, hide, isEnabled, onCloseButtonClicked, onCommentFailed, onCommentMax, onCommentSuccess, onDislikeButtonClicked, onGetCommentContent, onLikeButtonClicked, onNextButtonClicked, onPreviousButtonClicked, onRecommentButtonClicked, onStampButtonClicked, onTextButtonClicked, onUploadButtonClicked, onViewClear, playInTween, playOutTween, refresh, resetComment, show
- strings: "评论已发布", "请修改内容后重试", "请选择总体评价", "value", "ugctextcomment", "showPopup", "popupController", "_context", "onGetCommentContent", "gray", "uploadButton", "resultPanel", "_ui", "_needModifyContent", "_content"

### `jh` @L100659 (parent=Rt.ElementStageView, score=56)
- methods: canInviteChannelFriend, idle, initTab, onBackButtonClicked, onCompleteButtonClicked, onDisable, onEditButtonClicked, onEnable, onFriendStatusChanged, onFriendsFetched, onGroupInviteButtonClicked, onHide, onInit, onSearchButtonClicked, onShow, onTabSelected, playInTween, playOutTween, refreshApplicationState, refreshEditingState, refreshEmptyState, refreshFriendState, refreshOnlineFriendCount
- strings: "friend_application_empty_tips", "friend_empty_tips", "friend_online", "friend_title", "btn_confirm_inviteall", "modal_content_groupinvite", "modal_title_groupinvite", "value", "canShare", "key", "canInviteChannelFriend", "_isEditing", "refreshEditingState", "_currentPanel", "visible"

### `d_` @L128507 (parent=Rt.ElementModel, score=56)
- methods: addExtraMotion, checkJump, clearCurrentGroundedEntity, clearExtraMove, clearInput, clearJumpInput, enterGas, enterIce, enterMud, enterSpecialWall, exitGas, exitIce, exitMud, exitSpecialWall, jump, onInit, pushExtraMotion, reset, setCurrentGroundedEntity, setJumpInput, stopReverse, updateFromSnapshot, updatePhysicsProperties
- strings: "get", "length", "_inIce", "key", "isInIce", "value", "y", "_extraMotion", "x", "addExtraMotion", "entity", "context", "pushExtraMotion", "dispatch", "currentGroundedComponentCmd"

### `vC` @L194453 (parent=Rt.ElementStageView, score=56)
- methods: doDanDefendCountdown, onBuyButtonClicked, onDanDefend, onDefendButtonClicked, onDestroy, onDisable, onEnable, onInit, onLoadVideoFailed, onRecordStateChanged, onShareCompleted, onSkipButtonClicked, onWatchVideoEnd, playCountdownTween, playCurrentBarTween, playInTween, playOutTween, playPreviousBarTween, refreshButtonGroup, refreshDanInfo, refreshShareTips, refreshShareType, showButton
- strings: "求助好友", "发布视频", "观看视频", "广告购买", "求助好友，保住积分？", "发布视频，保住积分？", "求助好友，才能保住积分哦", "通信失败，请尝试分享到其他群", "发布视频，才能保住积分哦", "_brown.png", "ui/icon_", "dandefend_tips", "toast_dandefend_failed", "toast_dandefend_succeeded", "value"

### `Mw` @L208038 (parent=Rt.ElementComponent, score=56)
- methods: canMsg, cancelMatchmaking, destroy, doMatchmakingCountdown, generateDouyinChannel, getFriendlyMatchmakingMsg, kickPlayerFromFriendlyMatch, onInit, onKeyDown, sendEmoji, startEnterMatchmakingQueue, startFakeFriendlyMatchmaking, startFriendlyMatch, startFriendlyMatchmaking, startMatchmaking, startMatchmakingCountdown, startQQMatch, stopMatchmakingCountdown, switchFriendlyMatch, switchFriendlyMatchPvpMode, tutorialFakeMatchmaking, update, updateFriendlyMatchBasicInfo
- strings: "你不是房主，不能修改", "请求过于频繁", "unicode_escape", "trainer_pig", "tutorial_ai_name", "127.0.0.1:10000", "value", "now", "set", "_requestTimestamps", "get", "has", "key", "canMsg", "isVip"

### `bb` @L216753 (parent=pb, score=56)
- methods: canViewDetail, getRelationsInfo, handleBadgeInfoChange, handleBasicInfoChange, handleDeleteRelatoin, handleGiveGift, handleProfileChanged, initPanel, onAction, onDeleteButtonClicked, onDestroy, onDisable, onEnable, onGiftButtonClicked, onGiveGift, onInit, onIntimacySync, onSlotEntryClicked, onSync, onTipsButtonClicked, showGiftGivePopup, showRelationPopup, toggleHiddenState
- strings: "的好友，才能出现在关系图谱中", "亲密度满", "的亲密度：", "我和", "打好友赛、组队打联赛、组队闯关都可以获得亲密度", "说明", "」关系", "的「", "是否解除和", "解除关系", "对方选择不对外公开自己的身份", "查看个人名片", "已设置为公开", "已设置为隐藏", "get"

### `Ki` @L47817 (parent=Rt.ElementStageView, score=54)
- methods: fetchVideoInfos, idle, initTab, onCloseButtonClicked, onDestroy, onDisable, onEnable, onEntryClicked, onHide, onInit, onMouseDown, onRewardIntroPanelClicked, onScroll, onScrollEnd, onScrollStart, onShow, onTabSelected, onVideoButtonClicked, onVideoIDsFetched, onVideoInfosFetched, refreshEntry, refreshList
- strings: "关注生肖派对抖音号 get最新情报", "有奖活动", "游戏内发布的视频才能上榜哦", "热门视频", "每小时刷新一次", "最新视频", "视频已经被删除", "ui/icon_hotvideo.png", "ui/icon_recentvideo.png", "intro.png", "reward.png", "value", "set", "_tabs", "onTabSelected"

### `hd` @L115433 (parent=Rt.ElementStageView, score=54)
- methods: formatDate, getMaxPvpCoinReward, hideTutorial, onBackButtonClicked, onBattlePassHudClicked, onDanClicked, onDisable, onEnable, onEventBannerClicked, onInit, onInventoryEntryClicked, onLeagueInfoFetched, onStartButtonClicked, onTeamButtonClicked, onTeamPvpTipButtonClicked, onTipButtonClicked, refreshButtonGroup, refreshInventoryGroup, refreshRankRushEventInfo, refreshSeasonInfo, tryTutorial, update
- strings: "组队赛开放时间", "工作日：", "段位解锁组队赛", "达到", "停服维护中", ":00 开放", "今日 ", "奖励最高", "门票", "距离入口关闭还有 ", "eventBanner_home.png", "league_tutorial", ":00", ":00-", "league_seasontime"

### `Gd` @L119390 (parent=Rt.ElementStageView, score=54)
- methods: idle, onCloseButtonClicked, onDestroy, onDisable, onDropDebris, onEnable, onEntryClicked, onEquipped, onHide, onInit, onLoadVideoFailed, onShareButtonClicked, onShow, onUnlockButtonClicked, onUnlockSucceeded, onVideoButtonClicked, onWatchVideoEnd, playInTween, playOutTween, refresh, refreshPanel, setData
- strings: "」卡", "恭喜获得1张「", "debris_drop_tips", "debris_video_tips", "debris_share_tips", "debris_unlockbtn", "value", "count", "id", "getDebrisCount", "_characterModel", "debrisConfig", "refresh", "debrisNeed", "config"

### `j_` @L133149 (parent=(无), score=54)
- methods: celebrate, destroy, die, falldown, getBoneByName, getSprite, idle, jump, load, onSkeletonLoad, pause, play, playAnim, reset, run, setContext, showPersonality, startDieArrowAnim, startElectriedAnim, unload, unpause, wallcling
- strings: "value", "start", "_electrifiedAnim", "skeleton", "_skeletonLoader", "key", "startElectriedAnim", "get", "currentMoveStateCmd", "model", "_player", "play", "push", "_personalityAnims", "personality"

### `Ok` @L188201 (parent=xk, score=54)
- methods: addBundle, addComponentToLevelAndDestroy, addLevelComponent, addPlayer, getPlayerEdit, giveUpEdit, handleSelectComponent, moveLevelComponent, onDestroy, onDisable, onEnable, onInit, onLocalPlayerAddComponentFailed, packLevelComponent, receiveCreateComponent, receiveGiveUpEdit, receiveSelectComponent, sendAddBundle, sendAddComponent, sendCreateComponent, sendMoveComponent, sendSelectComponent
- strings: "value", "failed to find player with pvp index", "warn", "_playerEdits", "addPlayer", "getPlayerByIndex", "_playersController", "length", "key", "getPlayerEdit", "context", "onAddComponentFailed", "_editAI", "updateDragPanel", "_editTouch"

### `_C` @L194058 (parent=Rt.ElementStageView, score=54)
- methods: claimCoin, doubleClaimCoin, haveUnclaimedReward, haveVideoToShare, onCoinRewardClaimed, onCoinShareCompleted, onDestroy, onDisable, onDoubleCoinClaimed, onEnable, onInit, onLoadVideoFailed, onRecordStateChanged, onWatchVideoEnd, playInTween, playOutTween, refreshButtonGroup, refreshCurrentRewardTimes, refreshRewardClaimType, showButton, showScore, tryPlayOutTween
- strings: "奖金翻倍", "发布视频", "分享一下", "看广告", "通信失败，请尝试分享到其他群", "发布视频，才能领取奖励哦", "已经领取成功", "_brown.png", "ui/icon_", "toast_norewardquota", "value", "_coinRewardClaimed", "_canTimesCoin", "key", "haveUnclaimedReward"

### `KC` @L202835 (parent=Rt.ElementStageView, score=54)
- methods: claim, doubleClaim, isBreakRecord, onClaimed, onDestroy, onDisable, onEnable, onInit, onLevelRewardClaimed, onLoadVideoFailed, onRecordStateChanged, onRewardEntryClicked, onShareCompleted, onWatchVideoEnd, playInTween, refreshClaimButton, refreshDoubleClaimState, refreshReward, refreshRewardClaimType, showButton, showRewardHud, showShareTipsHud
- strings: "奖金翻倍", "月卡生效中，", "发布视频", "分享一下", "看广告", "分享视频到游戏中心，领取奖励", "求助好友，才能领取奖励哦", "通信失败，请尝试分享到其他群", "发布视频，才能领取奖励哦", "分享视频到游戏中心，才能领取奖励哦", "分享视频，领取奖励", "大神，分享一下神操作吧！", "大神，分享视频求挑战吧！", "_brown.png", "ui/icon_"

### `bw` @L206503 (parent=(无), score=54)
- methods: clearRPC, destroy, generateDouyinChannel, getIsOnline, getRPC, initClientEvents, join, onDouyinChannel, onEnterRoom, onKick, onMatchEnd, onMemberAvatarUpdate, onMemberJoin, onMemberLeft, registerCommand, registerRPC, rpc, sendCommand, shutdown, unregisterCommand, unregisterRPC, updateAvatar
- strings: "检测到作弊强制下线，多次作弊将被封号", "room_disconnected", "room_connectfailed", "unicode_escape", "value", "getLocalizationText", "onShutdown", "_system", "disconnected", "warn", "disconnect", "on", "_pvpClient", "connect fail", "connectFail"

### `qw` @L211876 (parent=Rt.ElementModel, score=54)
- methods: addCoin, addCurrency, consumeCurrency, gemToPrinting, getCountByType, getExchangeCount, getGemNeed, getItemByType, haveCoin, haveCurrency, haveGem, initCurrency, needConfirmGemUse, needRefreshTimeStamp, onDestroy, onInit, refresh, removeCoin, reset, setGemUseTs, showNotEnoughToast, updateCurrencyCount
- strings: "不足", "value", "getTime", "now", "getDate", "getMonth", "getFullYear", "getDay", "key", "needRefreshTimeStamp", "set", "_items", "init", "specialItems", "initCurrency"

### `xo` @L56096 (parent=Rt.ElementStageView, score=52)
- methods: fetchHistories, hideHistoryPanel, idle, initTab, onCloseButtonClicked, onDisable, onEnable, onHide, onHistoriesFetched, onInit, onQQGroupClicked, onScroll, onScrollStart, onShow, onTabSelected, playInTween, playOutTween, refreshEntry, refreshList, setData, showHistoryPanel
- strings: "，截图联系群主", "人品分遇到问题？请加QQ群", "人品分遇到问题？发布视频@", "rp_intro.png", "value", "visible", "historyPanel", "_ui", "key", "hideHistoryPanel", "fetchHistories", "array", "list", "_histories", "_canFetch"

### `xa` @L61986 (parent=Rt.ElementStageView, score=52)
- methods: getDecalCount, getDecalUsed, idle, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onMouseDown, onOKButtonClicked, onScrollEnd, onScrollStart, onShow, playInTween, playOutTween, refreshEntries, refreshEntry, selectItem, setComplete
- strings: "value", "id", "get", "_decalUsedInfo", "has", "key", "getDecalUsed", "count", "max", "getDecalCount", "_selectedItem", "item", "setSelected", "forEach", "_entries"

### `Za` @L66888 (parent=Rt.ElementStageView, score=52)
- methods: fetchUGCLevels, handleScroll, handleScrollStart, idle, isInvited, onCloseButtonClicked, onDestroy, onDisable, onEnable, onEntryInviteClicked, onHide, onInit, onInputChanged, onInviteButtonClicked, onLocalLevelsFetched, onSendMessage, onShow, onUGCLevelsFetched, playInTween, playOutTween, refreshEntry
- strings: "地图求玩", "ugc_toast_searchfailed", "value", "onHide", "id", "item", "isInvited", "refreshState", "forEach", "entries", "list", "_ui", "push", "_invitedIDs", "ugc"

### `ar` @L77383 (parent=Rt.ElementStageView, score=52)
- methods: handleBuy, idle, initEmoji, initList, onAction, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onEventStateChanged, onEventTimeChanged, onHide, onInit, onSecondButtonClicked, onShow, playEmojiAnim, playInTween, playOutTween, refreshBuyButton, refreshEntry, showEmoji
- strings: "主题赛季已结束", "距主题赛季结束还有：", "购买", "已开启通行证", "intro_battlepass.png", "value", "start", "emoji", "_ui", "setContext", "playEmojiAnim", "setCompletionHandler", "setDelay", "alpha", "tweenProps"

### `Qr` @L85841 (parent=Rt.ElementStageView, score=52)
- methods: idle, initTab, onAddSlotButtonClicked, onBackButtonClicked, onDisable, onEnable, onEventBannerClicked, onGetDefaultLevelInfo, onHide, onInit, onMarkListButtonClicked, onQQGroupClicked, onSearchButtonClicked, onShow, onTabSelected, onWeeklyRankButtonClicked, playInTween, playOutTween, refreshButtonGruop, refreshRankRushEventInfo, setEnterTab
- strings: "地图额度已达上限", "我的", "我的 ", "地图投稿&交流，请加QQ群 ", "精彩视频投稿&交流，请加QQ群 ", "地图投稿&交流，发布视频@", "精彩视频投稿&交流，发布视频@", "eventBanner_small.png", "value", "ugcmarklist", "showView", "uiStackController", "context", "idle", "_viewState"

### `ll` @L87855 (parent=Rt.ElementStageView, score=52)
- methods: fetchUGCLevels, getTimestampStr, idle, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onMouseDown, onScroll, onScrollEnd, onScrollStart, onShow, onUGCLevelsFetched, playInTween, playOutTween, refreshEntry, refreshLevelInfo, setLevelIDs, startUGCChallenge
- strings: "ugc_time_day", "ugc_time_hour", "ugc_time_minute", "ugc_totalplaycount", "value", "concat", "{{time}}", "replace", "getLocalizationText", "floor", "now", "key", "getTimestampStr", "text", "levelInfo"

### `Yl` @L95564 (parent=Rt.ElementStageView, score=52)
- methods: clearAndSave, createLevel, handleTemplateSelected, idle, lockedByLevelMode, needClearLevel, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onShow, onTipsButtonClicked, playInTween, playOutTween, refreshEntry, selectTemplate, setData, startUGC, updateTemplate
- strings: "创建", "切换", "」地图", "金币创建「", "花费", "创建「", "金币切换为「", "切换为「", "创建地图", "地图模板", "继续", "切换地图模板后，会自动移除全部组件。本操作无法恢复。", "警告", "级解锁", "玩家等级达到"

### `Oh` @L99658 (parent=Rt.ElementStageView, score=52)
- methods: addInvited, idle, isInvited, onAction, onCloseButtonClicked, onDestroy, onDisable, onEnable, onEntryAddClicked, onEntryDetailClicked, onFriendsFetched, onGiftButtonClicked, onHide, onInit, onIntimacySync, onInvited, onShow, playInTween, playOutTween, refreshEntry, setData
- strings: "已发送", "的好友，才能建立关系", "亲密度满", "邀请对方成为你的", "value", "userID", "profile", "item", "getFriendRelation", "_relationModel", "isInvited", "refreshStatus", "forEach", "entries", "list"

### `Nh` @L100267 (parent=Rt.ElementStageView, score=52)
- methods: getClipboardData, handleOnShow, idle, onApplicationSend, onBlur, onCloseButtonClicked, onCopyButtonClicked, onDisable, onEnable, onFocus, onFriendSearched, onHide, onInit, onSearchButtonClicked, onSearchedAddButtonClicked, onSearchedDetailButtonClicked, onShow, playInTween, playOutTween, refreshAutoPanel, refreshTips
- strings: "将对方数字ID复制到剪贴板，系统将自动识别", "复制成功", "friend_searchresult", "friend_toast_searchfailed", "friend_toast_searchself", "friend_idinfo", "value", "complete", "mouseEnabled", "inputField", "_ui", "fail", "refreshAutoPanel", "success", "_autoID"

### `Cc` @L105502 (parent=Rt.ElementStageView, score=52)
- methods: handleGiveGift, idle, onBlur, onCloseButtonClicked, onDisable, onEnable, onEntryDetailClicked, onEntryGiftClicked, onFocus, onFriendsFetched, onGiveGift, onHide, onInit, onSearchButtonClicked, onShow, onSync, playInTween, playOutTween, refreshEntry, setData, showGiftGivePopup
- strings: "</span>点亲密度", "为你们的友谊增加<span style='color:#FFCA00'>", "赠送礼物", "friend_toast_searchfailed", "<br/>", "value", "title", "getLocalizationText", "showToast", "visible", "list", "_ui", "searchedEntry", "init", "getFriendByShortID"

### `Uc` @L106868 (parent=Rt.ElementStageView, score=52)
- methods: fetchRoomByIDs, onCloseButtonClicked, onCreateButtonClicked, onDisable, onEnable, onEntryClicked, onEventBannerClicked, onHide, onInit, onJoinButtonClicked, onMouseDown, onRefreshButtonClicked, onRoomListFetched, onRoomsFetched, onScroll, onScrollEnd, onScrollStart, onSearchButtonClicked, onUGCLevelsFetched, refreshEntry, refreshFootBallEventInfo
- strings: "对战已开始", "对战已结束", "已满员", "eventBanner_home.png", "value", "create", "pvpMode", "team", "fixedRound", "party", "getCombinedPvpMode", "levelID", "levelfootball", "enterFriendlyMatchmaking", "context"

### `hu` @L109749 (parent=Rt.ElementModel, score=52)
- methods: addBuyHistory, canBuy, getBuyCount, getFeaturedDataByItem, getHotDataByItem, getPrintingShopDataList, getRelatedData, getRelatedItem, getRelatedItemType, getShopDataByID, getShopDataByItem, getShopDataListByType, handleFetched, hasFeaturedData, hasHotData, isFeaturedItem, isHotItem, onInit, refresh, reset, startFetch
- strings: "value", "_ts", "now", "_version", "version", "score", "id", "item", "refreshRating", "getCharacterSkinByID", "skinModel", "context", "characterskin", "type", "push"

### `pd` @L115820 (parent=Rt.ElementModel, score=52)
- methods: claimSeasonReward, claimSeasonRewardFailed, clearPreviousSeasonInfo, defendDan, getDan, getDanByID, getSeasonName, getTeamPvpOpeningTime, givePvpScore, isCurrentSeasonReward, isTeamPvpCanOpen, onInit, refresh, refreshCurrentMatchSeason, refreshDanRewards, refreshDans, refreshPrevious, reset, setEnterPvpType, setLastPvpMode, updateScore
- strings: "league_mode", ".png", "/title_league.png", "league_name", "value", "_seasonRewards", "_seasonRewardClaimed", "_previousSeasonID", "key", "clearPreviousSeasonInfo", "_currentDan", "refresh", "forEach", "_danItems", "refreshDans"

### `Zf` @L140496 (parent=Df[=LevelComponentBase], score=52)
- methods: checkSpatialHashAndUpdate, clampInBounds, editMore, getCanSwitchRotaryDirection, getCanSwitchSwingDirection, getFlippedOffset, getIsSystemDefaultComponent, getNeedClampViewBounds, getRotateMode, getRotatedOffset, getShouldRecycle, getSupportMoreEdit, onAddToLevel, onDestroy, onDirectionChange, onPositionChange, onRemoveFromLevel, onSelect, onUnselect, updateBounds, updateViewBounds
- strings: "value", "y", "x", "getConfigGridSize", "_base", "key", "getFlippedOffset", "down", "up", "getDefaultDir", "getRotatedOffset", "_attached", "checkComponentSpaceTaken", "checkPlatformOverlap", "decoration"

### `_k` @L182121 (parent=lk, score=52)
- methods: generateStartElements, getCanEditLevelComponent, getCanRotateLevelComponent, getIsDoubleScoreRound, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, initGame, isTeamMode, onLocalPlayerDead, onLocalPlayerReachFlag, onPartyComponentSelected, onPlayerEditLevelComponent, onStartEdit, onStartPlay, startGame, stopGame, updateGame
- strings: "value", "integer", "random", "setPosition", "platform5x1", "push", "key", "generateStartElements", "clearHud", "_gameUI", "pvpIndex", "userProfile", "matchModel", "player", "_context"

### `fk` @L182386 (parent=lk, score=52)
- methods: followNextTarget, getCanEditLevelComponent, getCanRotateLevelComponent, getIsOnlinePvpMode, getIsReplayMode, getLevelID, getLocalPlayerTeam, getMatchEndType, getMatchMode, getRoundCount, initGame, isTeamMode, onGhostComplete, onLocalPlayerDead, onLocalPlayerReachFlag, onPlayerEditLevelComponent, onStartEdit, onStartPlay, startGame, stopGame, updateGame
- strings: "开始跟随", "value", "onLocalPlayerEndRound", "_matchPlay", "play", "isInState", "stateMachine", "_context", "key", "onGhostComplete", "mode", "_matchHistory", "getMatchMode", "endType", "getMatchEndType"

### `Sk` @L185575 (parent=Rt.ElementComponent, score=52)
- methods: addPlayer, createGhostPlayer, createLocalAIPlayer, createLocalDeadGhostPlayer, createLocalHumanPlayer, createNetworkPlayer, createPlayersFromProfiles, destroyAllPlayers, destroyGhostPlayer, disableDeadGhost, enableDeadGhost, findAnotherAcitvePlayer, getLocalPlayers, getPlayerByID, getPlayerByIndex, getTeamPlayers, hasOpponentTeam, onDestroy, onInit, onWeakConnected, removeLocalHumanPlayer
- strings: "value", "addPlayer", "_playNetwork", "_editNetwork", "audioController", "stage", "init", "network", "context", "networkplayer", "key", "createNetworkPlayer", "ai", "aiplayer", "createLocalAIPlayer"

### `aC` @L191346 (parent=Rt.ElementStageView, score=52)
- methods: giveupUGCChange, onCloseButtonClicked, onDisable, onEnable, onGateHudClicked, onGiveupButtonClicked, onInit, onModeHudClicked, onNameAndTagUpload, onNameHudClicked, onRespawnTypeHudClicked, onTagHudClicked, onTemplateHudClicked, onTrashButtonClicked, onUpload, onUploadButtonClicked, refreshCurrentGate, refreshCurrentTemplate, refreshLevelMode, refreshLevelName, refreshLevelTags
- strings: "重生点", "气泡跟随", "单人闯关", "仅允许双人\b闯关", "未设置", "获得所有星星", "张地图", "一天只能发布", "贴花不足", "请先设置你的地图名称", "当前模板仅支持单人闯关模式", "仅允许双人闯关", "玩家等级达到", "请在地图编辑中修改", "ugc_toast_uploadfailed"

### `_w` @L205825 (parent=(无), score=52)
- methods: changeState, clearAllRPC, destroy, enterRoom, getRPC, handleMsg, handleRpcCommand, isInState, onClosed, onConnected, onSocketClosed, packEnterRoomMsg, packRPCMsg, registerCommand, registerRPC, rpcToServer, sendCommand, sendData, shutdown, unregisterCommand, unregisterRPC
- strings: "unknown msg type from pvp server:", "value", "failed to find rpc function with name", "warn", "_rpcHandlers", "invalid RPC attributes data from", "error", "parse", "attributes", "name", "flatByteBuffer", "getRootAsRPCMsg", "RPCMsg", "key", "handleRpcCommand"

### `Rb` @L218500 (parent=Rt.ElementStageView, score=52)
- methods: idle, onAuthButtonClicked, onCloseButtonClicked, onDecodeName, onDestroy, onDisable, onEnable, onHide, onInit, onInputChanged, onNextButtonClicked, onPopupHide, onProfileUpdate, onShow, playInTween, playOutTween, refreshPanel, refreshPriceInfo, showItemBuyPopup, supportSyncName, updateProfileInfo
- strings: "这个昵称太长了，重新起一个吧", "这个昵称不太好，重新起一个吧", "这个昵称已被占用,重新起一个吧", "请输入新的昵称", "当前昵称：", "使用<span style='color:#F5A623'>改名卡</span>修改昵称", "同步出错", "新昵称（4-16个字符）", "更改名称", "value", "none", "nativeAuthPlatform", "profileModel", "context", "isOnStandalone"

### `uS` @L225929 (parent=Rt.ElementStageView, score=52)
- methods: clear, onBackButtonClicked, onCurrencyChanged, onDisable, onEditButtonClicked, onEnable, onLevelUpdate, onPlayerInfoClicked, onProfileUpdate, onStart, refreshBackMode, refreshBackTitleMode, refreshCoinReddot, refreshCurrency, refreshCurrencyMode, refreshHomeMode, refreshTitle, refreshTitleMode, setRewardCurrency, setTitle, showAnim
- strings: ".png", "/ui/title/", "value", "onProfileUpdate", "playerInfo", "_ui", "key", "itemcommon", "showView", "uiStackController", "context", "appearance", "setEnterItem", "getView", "onEditButtonClicked"

### `ta` @L59419 (parent=Rt.ElementStageView, score=50)
- methods: idle, initList, initTab, onBuy, onCloseButtonClicked, onDisable, onEnable, onHide, onHistoryButtonClicked, onInit, onMultiBuyButtonClicked, onShow, onSingleBuyButtonClicked, onTabSelected, playInTween, playOutTween, refreshDescription, refreshEntry, refreshLimitInfo, setData
- strings: "&nbsp;自制地图评论时可用", "今日限购", "永久限购", "日内限购", "ui/rect_radius4_2944C4.png", "value", "text", "description", "_currentSelectedDay", "weekItems", "_pack", "dayTips", "_ui", "length", "items"

### `as` @L67775 (parent=Rt.ElementStageView, score=50)
- methods: fetchApplications, handleScroll, handleScrollStart, idle, onAction, onAgreeButtonClicked, onCloseButtonClicked, onDenyButtonClicked, onDestroy, onDisable, onEnable, onEntryDetailClicked, onGetApplications, onHide, onInit, onShow, onToggleClicked, playInTween, playOutTween, refreshEntry
- strings: "队员申请", "value", "scrollBar", "list", "_ui", "visible", "length", "_idList", "empty", "setArray", "_endIndex", "slice", "applications", "_clanModel", "_isFetching"

### `Sr` @L80715 (parent=Rt.ElementStageView, score=50)
- methods: fetchUGCLevels, idle, initPanel, onAddButtonClicked, onDisable, onEnable, onHide, onInit, onLocalLevelsFetched, onOKButtonClicked, onRemoveButtonClicked, onScroll, onScrollStart, onShow, onUGCLevelsFetched, playInTween, playOutTween, refreshEntry, setData, updateLevel
- strings: "张地图", "最多可以添加", "value", "onEnable", "list", "_ui", "spaceY", "repeatX", "bottom", "top", "onEntryClicked", "renderFunc", "bind", "refreshEntry", "itemRender"

### `lh` @L97728 (parent=Rt.ElementStageView, score=50)
- methods: fetchTopPvps, handleScroll, handleScrollStart, idle, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onPlayerEntryClicked, onRefreshButtonClicked, onShareButtonClicked, onShow, onTopPvpFetched, onTopPvpListFetched, onWatchButtonClicked, playInTween, playOutTween, refreshEntry, setData
- strings: "刷新太频繁", "toppvp/dialog_top.png", "value", "show", "id", "userID", "userProfile", "player", "canAddFriend", "aiProfile", "battleProfile", "isAI", "profile", "profileModel", "context"

### `hc` @L103790 (parent=Rt.ElementStageView, score=50)
- methods: idle, onBuy, onBuyButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onShow, playInTween, playOutTween, refrehShopDataInfo, refreshBuyInfo, refreshDetailInfo, refreshGainInfo, refreshIcon, refreshLimitInfo, refreshProgressHud, setData
- strings: "限购 ", "确认购买", ".png", "ui/info_bg_", "value", "_data", "pay", "_rechargeController", "idle", "_viewState", "key", "onBuyButtonClicked", "visible", "progressHud", "_ui"

### `Yu` @L114091 (parent=Rt.ElementStageView, score=50)
- methods: canInviteChannelFriend, idle, initTab, onBackButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onMeEntryClicked, onMouseDown, onScrollEnd, onScrollStart, onShow, onTabSelected, playInTween, playOutTween, refreshEntry, refreshFriendTab, refreshLeaderboard
- strings: "social_tab_friend", "value", "canShare", "key", "canInviteChannelFriend", "text", "selectedFriendTabText", "_ui", "friendTabText", "length", "concat", "getLocalizationText", "friend", "getLeaderboard", "_socialModel"

### `Hk` @L188958 (parent=Rt.ElementComponent, score=50)
- methods: changeToEditState, changeToMatchEndState, disableLocalPlayer, doLocalCountdown, doServerCountdown, localDelayToEnterNextRound, localNextRound, onDestroy, onInit, onLocalPlayerEndRound, onNotifyBeforeEndMatch, onNotifyEndMatch, onNotifyEndRound, onNotifyNextRound, onPlayerKilled, onPlayerScore, setLocalComponentsCandidate, skipTutorial, startRound, stopAllTimer
- strings: "tutorial_skip", "value", "disabled", "changeState", "player", "context", "key", "disableLocalPlayer", "notify", "onBeforeEndMatch", "_gameModel", "onNotifyBeforeEndMatch", "changeToMatchEndState", "nextRound", "onNotifyEndMatch"

### `Xk` @L189495 (parent=Rt.ElementComponent, score=50)
- methods: customShare, endShare, getVideoInfo, handleOnShow, handleRecordStateChanged, hasValidVideo, onDestroy, onInit, pauseRecord, recordClip, resumeRecord, share, shareReplayVideo, shareUGCFailVideo, shareUGCPvpResultVideo, shareUGCResultVideo, startRecord, stopRecord, update, updateCurrentRecordDelegate
- strings: "正在准备视频...", "ugc_fail", "pvpend_win", "value", "_recordStarted", "recording", "starting", "notify", "onRecordStateChanged", "key", "handleRecordStateChanged", "_onFail", "_onSuccess", "removeRequestCount", "request"

### `eb` @L212839 (parent=tb, score=50)
- methods: bindPhoneNumber, checkVersion, claimAnnualReward, claimDouyinFollowReward, claimFriendlyMatchReward, claimShareRewardCoin, fetchAnnualReport, fetchProfile, fetchRealNameInfo, generateRestoreCode, getRestoreAccount, initProfileInfo, randomNickName, redeem, setAvatar, unlockAnnualReport, updateGender, updateNickName, updatePhoneNumber, verifyPhoneNumber
- strings: "礼品兑换", "奖励已领取", "年报", "修改昵称成功", "修改性别成功", "请求过于频繁", "验证码已发送", "没有找到账号信息", "房主", "结算分享视频", "cdkey/claim", "account/identity", "douyin/claimfollowreward", "report/claim", "report/unlock"

### `ib` @L213309 (parent=tb, score=50)
- methods: bindPhoneNumber, checkVersion, claimAnnualReward, claimDouyinFollowReward, claimFriendlyMatchReward, claimShareRewardCoin, fetchAnnualReport, fetchProfile, fetchRealNameInfo, generateRestoreCode, getRestoreAccount, initProfileInfo, randomNickName, redeem, setAvatar, unlockAnnualReport, updateGender, updateNickName, updatePhoneNumber, verifyPhoneNumber
- strings: "礼品兑换", "啦啦3", "啦啦啦2", "啦啦啦1", "验证码已发送", "app账号", "avatar://", "value", "notify", "onRedeem", "_controller", "handleGetItems", "showItem", "reason", "items"

### `kb` @L216162 (parent=pb, score=50)
- methods: computePoints, drawAverageGraphic, drawGraphics, drawLevelGraphic, drawSelfGraphic, handleBadgeInfoChange, handleBasicInfoChange, handleProfileChanged, onBadgeHudClicked, onDestroy, onDisable, onEnable, onExpInfoClicked, onHonestyHistoryButtonClicked, onHonestyTipButtonClicked, onInit, onShareButtonClicked, refresh, refreshBadgeInfo, refreshHonestyInfo
- strings: "人品 ", "完美", "优秀", "及格", "不及格", "操作", "创造", "value", "self", "refreshBadgeInfo", "key", "handleBadgeInfoChange", "_isLocal", "refresh", "handleBasicInfoChange"

### `lt` @L27720 (parent=(无), score=49)
- methods: enterChatRoom, handleApplicationMsg, handleClanRejected, handleFriendAddMsg, handleFriendDeleteMsg, handleFriendStatusMsg, handleGameConfigRefresh, handleGetApplicationMsg, handleGetClanNoticeMsg, handleGetMemberJoinMsg, handleGetMemberLeaveMsg, handleMemberStatusChanged, handlePvpInvitationMsg, handleRechargeMsg, handleServerStopMsg, handleSessionExpire, onChatRoomFromClan, onChatRoomRTM, onEvent, syncEvents, syncHonesty
- strings: "value", "clanId", "setClanApplyState", "clanModel", "key", "handleClanRejected", "handleMemberStatusChanged", "handleGetMemberLeaveMsg", "handleGetMemberJoinMsg", "handleGetApplicationMsg", "handleGetClanNoticeMsg", "handleGetMsg", "onChatRoomFromClan", "chatSystem", "onChatRoomRTM"

### `Ht` @L33524 (parent=(无), score=48)
- methods: init, onDisable, onEnable, onEntryClicked, onMouseDown, onScroll, onScrollEnd, onScrollStart, refreshEntry, refreshHorizonalList, refreshList, refreshVerticalList, registerEvents, resetUIData, setArray, updateListBounds, updateRepeatX, updateRepeatY, updateSpace
- strings: "value", "key", "refreshEntry", "_canClickEntry", "onEntryClicked", "scrollBar", "max", "min", "updateListBounds", "notify", "handleScroll", "onScroll", "handleScrollEnd", "_scrolling", "onScrollEnd"

### `ln` @L49566 (parent=Rt.ElementStageView, score=48)
- methods: idle, initPanels, initTab, onChannelButtonClicked, onCloseButtonClicked, onCurrencyChanged, onDisable, onEnable, onHide, onInit, onLiveButtonClicked, onLiveStateChanged, onShow, onTabSelected, playInTween, playOutTween, refreshLiveButton, refreshReddot, refreshSelfInfo
- strings: "我要开播", "直播中...", "今日未开播", "今日已直播 ", "你的设备不支持直播", "请升级微信", "gamelive/tv_dialog_top.png", "value", "visible", "cumulativeLive", "getUnclaimedCount", "_missionModel", "cumulativeMissionReddot", "_ui", "dailyLive"

### `Gn` @L53232 (parent=Rt.ElementStageView, score=48)
- methods: fetchBadgesInfo, idle, onBadgesInfoFetched, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onEquippedInfoChanged, onGetBasicInfo, onHide, onInit, onMouseDown, onScroll, onScrollEnd, onScrollStart, onShow, refreshBasicInfo, refreshEntry, setEnterView
- strings: "已收集 ", "value", "onHide", "idle", "_viewState", "key", "onCloseButtonClicked", "badgedetail", "showPopup", "popupController", "context", "id", "getItemByID", "_badgeModel", "setData"

### `Ka` @L66158 (parent=Rt.ElementStageView, score=48)
- methods: checkClanNameLocal, idle, onAction, onCheckButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onInputChanged, onNextButtonClicked, onPopupHide, onShow, playInTween, playOutTween, refreshPriceHud, showItemBuyPopup, updateClanName
- strings: "请输入新的战队名称", "与当前战队名称相同", "个字符）", "新名称（", "现战队名：", "名称是战队的重要标识，修改需要消耗&nbsp;", "修改战队名称", ".png", "ui/icon_", "_small.png'></img>", "<img src='ui/icon_", "value", "updateName", "_lastErrorMsg", "errMsg"

### `As` @L73547 (parent=Rt.ElementStageView, score=48)
- methods: handleBuy, idle, initTab, onAction, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onHide, onInit, onQQGroupClicked, onSecondButtonClicked, onShow, onTabSelected, playInTween, playOutTween, refreshBuyButton, refreshBuyButtonGroup, setEvent
- strings: "知道了", "你的积分已达标，额外奖励已立即发放到首页-消息邮件中，记得去查看哦", "努力提升积分吧！", "额外奖励已解锁", "不足", "<br/>（领取方式：首页-右侧箭头展开菜单-消息）", "<br/>后续奖品根据进度逐个发放", "<br/>解锁后，已达标奖品将通过<span style='color:#00D0FF'>消息邮件</span>立即发放", "使用<span style='color:#FFCA00'>钻石或印花</span>可解锁额外奖励", "<br/>排名奖励活动结束后24小时内发放", "积分奖励，在积分达标后将通过<span style='color:#00D0FF'>消息邮件</span>立即发放", "剩余 ", "稀有奖励", "免费奖励", "活动规则"

### `il` @L86676 (parent=el, score=48)
- methods: fetchUGCLevels, hideSortTutorial, onDestroy, onDisable, onEnable, onEntryClicked, onFilterButtonClicked, onFilterChanged, onInit, onMouseDown, onRankListFetched, onScroll, onScrollEnd, onScrollStart, onSortButtonClicked, onSortChanged, onUGCLevelsFetched, refreshEntry, tryShowSortTutorial
- strings: "难度", "榜单", "点击这里，选择喜欢的难度", "ugc_sort_tutorial", "ugc_tips_rank", "value", "_endIndex", "slice", "fetUGCLevelsByIDs", "_ugcController", "repeatY", "list", "_root", "length", "min"

### `gl` @L89948 (parent=Rt.ElementStageView, score=48)
- methods: fetchUGCLevels, idle, onActionMarkLevel, onBackButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onMarkListFetched, onMouseDown, onScroll, onScrollEnd, onScrollStart, onShow, onUGCLevelsFetched, playInTween, playOutTween, refreshEntry
- strings: "地图已下线", "张地图，最早的收藏会被自动取消哦", "最多收藏", "value", "_idList", "getLevelByID", "_ugcModel", "setItem", "key", "refreshEntry", "mode", "ugcchallenge", "game", "changeState", "create"

### `oh` @L97347 (parent=Rt.ElementComponent, score=48)
- methods: fetchHistories, fetchHistory, fetchNextTopReplay, fetchReplay, fetchTopPvpList, fetchTopPvpReplay, fetchTopPvpsByIDs, handleFetchReplay, handleHistoriesFetchFailed, handleHistoriesFetched, handleHistoryFetchFailed, handleHistoryFetched, handleReplayDataFetched, handleTopPvpFetched, handleTopPvpListFetched, onDestroy, onInit, showFetchFailedToast, startFetchReplay
- strings: "history_toast_fetchreplayfailed", "value", "id", "fetchReplay", "_service", "key", "handleFetchReplay", "fetchHistory", "title", "getLocalizationText", "showToast", "showFetchFailedToast", "notify", "onReplayDataFetched", "_matchHistoryModel"

### `Xh` @L101006 (parent=Wh, score=48)
- methods: canInviteChannelFriend, disable, enable, onDeleteButtonClicked, onDetailButtonClicked, onEmptyEntryClicked, onFriendChanged, onFriendDeleted, onFriendStatusChanged, onFriendsFetched, onIntimacySync, onMouseDown, onPvpInviteButtonClicked, onScrollEnd, onScrollStart, refreshEditingState, refreshEntry, refreshList, sortByOnlineStatus
- strings: "friend_toast_deleted", "btn_confirm_remove", "modal_content_deletefriend", "modal_title_deletefriend", "value", "canShare", "key", "canInviteChannelFriend", "lastOnlineTime", "intimacy", "intimacyEnable", "config", "status", "getFriendByID", "_friendModel"

### `$h` @L102224 (parent=Rt.ElementStageView, score=48)
- methods: handleFriendlyMatchInvitation, handleRosterInvitation, idle, onCloseButtonClicked, onDenyButtonClicked, onDisable, onEnable, onEnterFriendlyMatch, onEnterRoster, onGetPvpInvitation, onHide, onInit, onJoinButtonClicked, onPvpInvitationChanged, onShow, playInTween, playOutTween, refreshEntry, sortInvitations
- strings: "金币不足", "已拒绝", "已加入队伍", "friend_pvpinvite_handled", "value", "timestamp", "sort", "_invitations", "push", "rosterID", "forEach", "pvpInvitations", "_friendModel", "isFriendlyMatch", "_matchmakingModel"

### `bc` @L105833 (parent=Rt.ElementStageView, score=48)
- methods: idle, onBuy, onCloseButtonClicked, onDestroy, onDisable, onEnable, onGiveGift, onHide, onInit, onMinusButtonClicked, onOKButtonClicked, onPlusButtonClicked, onPlusTenButtonClicked, onShow, playInTween, playOutTween, refreshGiveInfo, setData, showBuyPopup
- strings: " 个", "现有 ", "赠送数量：<span style='color:#FFCA00'>", "赠送成功", "再想想", "前往购买", "是否立即购买礼物?", "礼物不足", "亲密度", "，提升", "赠送1", "赠送礼物", "</span>", "get", "_currentGiftCount"

### `up` @L122464 (parent=Rt.ElementComponent, score=48)
- methods: addToBeShown, clearPopups, clearToBeShown, forceClearPopups, getZOrder, havePopup, havePopups, haveToBeShown, hideCurrencyHud, hidePopup, insertToBeShown, isCurrentPopup, onDestroy, onInit, popToBeShown, refreshNetworkState, showCurrencyHud, showForcePopup, showPopup
- strings: "loading/disconnect.png", "value", "length", "_popups", "key", "getZOrder", "_toBeShownList", "indexOf", "haveToBeShown", "_lastID", "clearToBeShown", "showPopup", "splice", "popToBeShown", "notify"

### `of` @L134600 (parent=ef, score=48)
- methods: aiEnter, aiExit, aiUpdate, ghostEnter, ghostExit, ghostUpdate, inputEnter, inputExit, inputUpdate, networkEnter, networkExit, networkUpdate, npcEnter, npcExit, npcUpdate, onEnter, onExit, onInit, onUpdate
- strings: "value", "disable", "_ghostControl", "key", "ghostExit", "update", "ghostUpdate", "enable", "sound", "context", "ghostEnter", "_networkControl", "networkExit", "networkUpdate", "networkEnter"

### `$o` @L59129 (parent=Rt.ElementStageView, score=46)
- methods: idle, onBuy, onCloseButtonClicked, onDisable, onEnable, onHide, onHistoryButtonClicked, onInit, onIntroButtonClicked, onMultiBuyButtonClicked, onShow, onSingleBuyButtonClicked, playInTween, playOutTween, refreshDescription, refreshEntry, refreshLimitInfo, setData
- strings: "&nbsp;自制地图评论时可用", "今日限购", "永久限购", "日内限购", "规则说明", "ui/rect_radius4_2944C4.png", "value", "centerX", "description", "_ui", "addChild", "centerY", "height", "width", "Box"

### `Ta` @L62295 (parent=Rt.ElementModel, score=46)
- methods: addPvpCount, addSkinTrialCount, cancelLive, encode, loadFromLocal, noticeReview, onInit, onStart, refresLiveTSInfo, refresh, refreshLocal, refreshPvpPrice, reset, saveLocal, showLiveButton, showSkinPackBuyView, startLive, updateGameLiveInfo
- strings: "local_daily", "value", "saveLocal", "_localTS", "now", "_skinPackBuyShown", "_skinTrialCount", "isBeforeToday", "TimeUtils", "key", "refreshLocal", "skinPackBuyShown", "skinTrialCount", "ts", "setStorageSync"

### `Qa` @L66414 (parent=Rt.ElementStageView, score=46)
- methods: checkLocal, idle, onAction, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onInputChanged, onNextButtonClicked, onPopupHide, onShow, playInTween, playOutTween, refreshPriceHud, showItemBuyPopup, updateShortID
- strings: "请输入新的战队号", "与当前战队号相同", "修改", "确认", "个性化确认", "个字符", "请输入", "现战队号：", "战队号是用于搜索的标识，一旦设置不可修改<br/>个性化战队号需要消耗&nbsp;", "个性化战队号", ".png", "ui/icon_", "_small.png'></img>", "<img src='ui/icon_", "value"

### `Cl` @L90569 (parent=Rt.ElementStageView, score=46)
- methods: idle, onBuyButtonClicked, onCloseButtonClicked, onDisable, onEnable, onEntryClicked, onHide, onInit, onMouseDown, onOKButtonClicked, onScrollEnd, onScrollStart, onShow, playInTween, playOutTween, refreshEntries, refreshEntry, setComplete
- strings: "请选择一个图章", "value", "_selectedStamp", "id", "item", "setSelected", "forEach", "_entries", "key", "refreshEntries", "stamp", "jumpToShopView", "uiStackController", "context", "hidePopup"

### `Jl` @L96165 (parent=Rt.ElementStageView, score=46)
- methods: idle, initTab, onBackButtonClicked, onDisable, onEnable, onHide, onInit, onPlayerEntryClicked, onQQGroupClicked, onReplayDataFetched, onShareButtonClicked, onShow, onTabSelected, onWatchButtonClicked, playInTween, playOutTween, refreshEntry, refreshMatchHisotries
- strings: "投稿QQ群「", "发布视频@", "history_tip_league", "history_tip_friend", "value", "handleQQGroupJump", "context", "key", "onQQGroupClicked", "args", "mode", "matchreplay", "id", "game", "quitgame"

### `Od` @L118165 (parent=Rt.ElementModel, score=46)
- methods: buy, consumeDebris, equip, getAvalialbeSkinListByID, getCharacterSkinByID, getDebrisByID, getDebrisCount, getDebrisCountNeed, getOwnSkinListByID, getSkinListByID, giveDebris, handleLockStateChanged, onDestroy, onStart, refreshCharacterSkinRatings, refreshCharacterSkins, refreshDebris, reset
- strings: "value", "notify", "onLockStateChanged", "key", "handleLockStateChanged", "onUpdate", "buy", "getCharacterSkinByID", "score", "id", "refreshRating", "get", "_skins", "forEach", "refreshCharacterSkinRatings"

### `op` @L121956 (parent=Rt.ElementComponent, score=46)
- methods: canStartFriendlyMatch, enterDouyinGroupMatch, enterDouyinMatch, enterFakeRoom, enterFriendlyMatch, enterQQMatch, handleDouyinGroupRoomEnter, handleDouyinMatchQuery, handleQQMatchmakingQuery, isMatchQuery, needHandled, onDestroy, onInit, setReloadGameFunc, tryAuth, tryExecReloadGameFunc, tryQuitCurrentMatch, tryReloadCurrentMatch
- strings: "派对制造需要您的授权，以显示您的头像和昵称", "提示", "当前游戏正在进行中，是否要立即退出，开始新的对战？", "对战邀请", "当前app不支持，请到「抖音」或「抖音极速版」玩游戏", "unicode_escape", "get", "isInGame", "lifeCycleController", "context", "game", "isInState", "stateMachine", "key", "isInMatch"

### `g_` @L129721 (parent=Rt.ElementBehaviour, score=46)
- methods: disableCollider, enableBarrelCollide, enableCollider, isSpaceTaken, onInit, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, onStart, onStateChange, setCollideToNone, setCollideToNormal, setJustShootFromBarrel, setPvpNetworkPlayer, stopIgnoreDownColliders, stopIgnoreLeftDirColliders, stopIgnoreRightDirColliders, updateNetworkCollider
- strings: "value", "enabled", "collider", "entity", "context", "isActiveMovingState", "model", "enableNetworkCollider", "key", "updateNetworkCollider", "onPlayerExitCollider", "fallingTime", "y", "normal", "onPlayerStayCollider"

### `Q_` @L134161 (parent=Rt.ElementBehaviour, score=46)
- methods: clearAllEffects, clearArrows, createArrow, disableStarGlow, enableStarGlow, getIsBubbleEffectOn, hideLoading, onDisable, onEnable, onPlayerMoveStateChange, setArrowTransform, showLoading, skewerCrossbowArrow, startBubbleEffect, startMudEffect, stopBubbleEffect, stopMudEffect, updateMudEffect
- strings: "game/mudslice.png", "game/crossbowarrow.png", "game/bubble.png", "ui/star.png", "ui/icon_rolling.png", "player_shadow.png", "value", "zOrder", "right", "rotation", "integer", "random", "y", "x", "left"

### `Eg` @L169211 (parent=(无), score=46)
- methods: disable, enable, hide, initTab, onCloseButtonClicked, onEntryClicked, onOKButtonClicked, onRandomButtonClicked, onSharpToggleClicked, onSoundToggleClicked, onTabSelected, playInTween, playNote, playOutTween, refreshEntries, show, updateNote, updateSkin
- strings: "value", "completeEdit", "_skinListPanel", "key", "updateSkin", "setIndex", "_note", "updateNote", "sharpSuffix", "concat", "_currentSelectIndex", "soundList", "note", "playSound", "SoundManager"

### `um` @L172565 (parent=Yg, score=46)
- methods: init, initBG, initRopes, initTiledSprite, initWall, onBottomSwitchTrigger, onPlayerEnterCollider, onPlayerEnterTrigger, onPlayerExitCollider, onPlayerExitTrigger, onPlayerStayCollider, onTopSwitchTrigger, playAnim, reset, startEdit, startPlay, triggerSwitch, update
- strings: ".png", "/windowslime", "/cage", "value", "_isOnBottom", "_currentState", "disabled", "key", "reset", "f", "e", "loadImage", "sprite", "clear", "graphics"

### `Gm` @L176555 (parent=(无), score=46)
- methods: applyHit, getCanSquashPlayer, getCanWalkWith, handleNetworkEvent, onEndRoundPlay, onHitStaticCollider, onPlayerEnterCollider, onPlayerExitCollider, onPlayerStayCollider, onTriggerEnter, onTriggerExit, reset, sendHitEvent, setBigBall, setLocalBall, setNormalBall, setRemoteBall, update
- strings: "value", "y", "x", "_ballCollider", "tryTriggerLevelComponent", "match", "key", "sendHitEvent", "_angularVelocity", "velocity", "_rigidbody", "setTo", "magnitude", "addImpulse", "scale"

### `CC` @L196183 (parent=f.PlayerStateHudUI, score=46)
- methods: addOutputTween, createItemEffect, disable, enable, getItemEffect, handleScoreAdd, handleSpeakersChanged, layout, onGameStateChange, playItemEffectAnim, refresh, refreshEntry, refreshTeamScore, showEmoji, sortByPvpIndex, updateAvatar, updateEntries, updateEntry
- strings: "正方", "反方", "ui/team_bg_red.png", "ui/team_bg_blue.png", ".png", "game/", "value", "visible", "teamHud", "color", "#FF640C", "#2974C3", "teamScore", "align", "left"

### `EC` @L197888 (parent=Rt.ElementStageView, score=46)
- methods: onClaimButtonClicked, onClaimed, onCloseButtonClicked, onDestroy, onDisable, onEnable, onFriendlyMatchRewardClaiemd, onInit, onLoadVideoFailed, onRecordStateChanged, onShareCompleted, onWatchVideoEnd, playInTween, playOutTween, refreshButtonGroup, refreshShareType, showButton, showRewardHud
- strings: "分享视频领取", "分享领取", "看视频领取", "求助好友，才能领取奖励哦", "通信失败，请尝试分享到其他群", "发布视频，才能领取奖励哦", "toast_norewardquota", "room_owner_reward", "value", "share", "_rewardClaimType", "video", "updateText", "claimButton", "_ui"

### `mS` @L227046 (parent=(无), score=46)
- methods: createAuthButton, createContactButton, createFeedbackButton, createGameClubButton, createRecordButton, destroy, disable, enable, handleAuthButtonTap, hide, hideInternal, refresh, refreshCanShowWXButton, refreshRecordButton, show, showInternal, updateRecordButtonImage, updateRecordInfo
- strings: "getUserInfo:ok", "3.11.0", "icon_recordshare.png", "7.0.8", "value", "_data", "onWechatAuth", "user", "getController", "code", "fail", "deny", "indexOf", "errMsg", "ok"

### `Yg` @L171109 (parent=(无), score=45)
- methods: destroy, getBoxCollider, getBoxColliders, getCameraScale, getCircleCollider, getCircleColliders, getGoalArea, getGoalAreaSize, getSceneObject, getSceneObjectByTag, getSceneObjects, getSceneObjectsByTag, getSpawnAreaSize, init, resize, startEdit, startPlay, update
- strings: "value", "key", "resize", "f", "e", "push", "tag", "options", "circlecollider", "type", "done", "n", "s", "initialComponents", "getCircleColliders"

### `hi` @L42486 (parent=(无), score=45)
- methods: checkFollowAwemeState, checkSupportSidebar, enterFromSidebar, logChat, logClickInviteButton, logEnterRoom, logExit, logInviteSuccess, logLaunch, logMatchEnd, logMatchStart, logMatchmakingResult, logMatchmakingStart, logNewSocial, logRTC, logWaitingRoom, openOfficialPage
- statics: url
- strings: "game_duration", "message_type", "voice_duration", "if_voice", "start_type", "match_result", "rebot_cnt", "is_full_match", "match_type", "match_start", "invite_type", "invite_click", "waiting_room_show", "enter_type", "chat_card"

### `Ai` @L46752 (parent=Rt.ElementStageView, score=44)
- methods: bind, closeVerifyPanel, idle, onBindPhoneNumber, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onOKButtonClicked, onReportButtonClicked, onShow, playInTween, playOutTween, refresh
- strings: "绑定手机号成功", "value", "visible", "inputMask", "_ui", "defaultInput", "key", "refresh", "text", "inputField", "onBlur", "onFocus", "report", "showPopup", "popupController"

### `Zo` @L58717 (parent=Rt.ElementStageView, score=44)
- methods: haveExchangedReward, onDestroy, onDisable, onEnable, onExchangeButtonClicked, onInit, onNextButtonClicked, onOKButtonClicked, openPack, refreshRewards, setData, showButton, showExchangeRewards, showPack, showPackShakeTween, showRewards, update
- strings: "奖励已领取", "_open.png", ".png", "ui/pattern_yellow.png", "get", "length", "_rewards", "currentRewardsCount", "_index", "key", "haveRewardToShow", "min", "value", "exchangeCoin", "haveExchangedReward"

### `ts` @L67209 (parent=Rt.ElementStageView, score=44)
- methods: getListByType, idle, initList, onCloseButtonClicked, onDestroy, onDisable, onEnable, onEntryClicked, onHide, onInit, onOKButtonClicked, onShow, playInTween, playOutTween, refreshEntries, refreshEntry, setData
- strings: "制作徽章", "value", "frame", "frameList", "_ui", "bg", "bgList", "icon", "iconList", "key", "getListByType", "refreshEntries", "_currentBadge", "refresh", "badge"

### `Js` @L75760 (parent=Cs, score=44)
- methods: addFlag, canClaim, getLevelByIndex, getLevelFlagCount, getLevelUnlockCountdown, getLevelUnlockPrice, getMaxRewardFlagCount, handleFetchResult, isClaimed, isLevelLocked, isLevelLockedByFlag, isLevelLockedByTime, isPreviousClaimed, refresh, refreshConfig, reset, startFetch
- strings: "title_no_1.png", "title.png", "value", "_uiData", "reset", "_battlePassItem", "_previousID", "_maxRewards", "_canClaimMax", "_maxClaimed", "_passClaimedIndex", "_freeClaimedIndex", "_flagCount", "_currentID", "key"

### `Xl` @L95042 (parent=el, score=44)
- methods: fetchUGCLevels, onDestroy, onDisable, onEnable, onEntryClicked, onFilterButtonClicked, onFilterChanged, onInit, onMouseDown, onRankListFetched, onScroll, onScrollEnd, onScrollStart, onSortButtonClicked, onSortChanged, onUGCLevelsFetched, refreshEntry
- strings: "排序", "类型", "点赞", "时间", "双人", "视觉", "新手", "跑酷", "自动", "微操", "解谜", "全部", "ugc_tips_rank", "value", "_endIndex"

### `Vd` @L119044 (parent=Rt.ElementStageView, score=44)
- methods: captureScreen, idle, initCharacterInfo, onCloseButtonClicked, onDestroy, onDisable, onDouyinButtonClicked, onDownloadButtonClicked, onEnable, onHide, onInit, onShareButtonClicked, onShow, onTapTapButtonClicked, playInTween, playOutTween, setData
- strings: "分享出错 ", "派对制造", "保存图片失败", "已保存到相册", "2.1.39", "/share/share_character_bg.png", "get", "appSDKVersion", "systemInfo", "compareVersion", "MathUtils", "key", "canDouyinShare", "taptap", "nativeLoginPlatform"

### `zd` @L119725 (parent=Rt.ElementStageView, score=44)
- methods: idle, onAdButtonClicked, onClaimDebris, onDestroy, onDisable, onEnable, onGetDebrisHelpResult, onHide, onInit, onLoadVideoFailed, onOKButtonClicked, onShareButtonClicked, onShow, onWatchVideoEnd, playInTween, playOutTween, refreshButtonGroup
- strings: "次机会", "今天还有", "卡！", "」收集了1张", "您帮「", "」卡", "恭喜获得1张「", "toast_norewardquota", "value", "refreshButtonGroup", "_freeCoinVideoAd", "key", "onLoadVideoFailed", "id", "_item"

### `lk` @L179976 (parent=(无), score=44)
- methods: addScoreByID, followNextTarget, getDiffComponents, getIsDoubleScoreRound, getIsOnlinePvpMode, getSpawnDistanceBetweenPlayer, handlePlayerHitCheckpoint, onBeforeLoadAssets, onEndRoundPlay, onFlagOutOfBounds, onMatchLocalPlayerAddLevelComponent, onMatchLocalPlayerDead, onMatchLocalPlayerReachFlag, onMatchStartEdit, onMatchStartPlay, onProjectileTriggerComponent, updateGame
- strings: "value", "startRound", "_matchPlay", "f", "e", "resetHaltScaleByDan", "ai", "getController", "type", "done", "n", "s", "players", "_context", "key"

### `sC` @L191763 (parent=Rt.ElementStageView, score=44)
- methods: backToLastCheckpoint, changeMode, changeRecordState, changneInputType, getInputText, isSmoothMode, onCloseButtonClicked, onContinueButtonClicked, onDisable, onEnable, onExitButtonClicked, onInit, onRematchButtonClicked, refreshCheckpointInfo, refreshCurrentMode, refreshInputHud, refreshRecordHud
- strings: "存档2个以上才能使用", "删除当前记忆点存档，回到前个记忆点", "未启用", "开启", "退出", "继续玩", "退出后，将删除记忆点保存的进度", "立即退出？", "input_name_touch", "input_name_button", "settings_toast_inputchanged", "value", "getLocalizationText", "button", "key"

### `Ib` @L217232 (parent=pb, score=44)
- methods: fetchBadgesInfo, getBadgesInfoByIDs, getBadgesOwnInfo, handleBadgeInfoChange, handleBasicInfoChange, handleProfileChanged, onBadgesButtonClicked, onBadgesInfoFetched, onDestroy, onDisable, onEnable, onEntryClicked, onInit, onScroll, onScrollStart, refreshBasicInfo, refreshEntry
- strings: "已收集徽章 ", "value", "fetchBadgesInfo", "refreshBasicInfo", "key", "handleBadgeInfoChange", "onBadgesInfoFetched", "getBadgesOwnInfo", "_needResetView", "handleBasicInfoChange", "handleProfileChanged", "badge", "showView", "uiStackController", "context"

### `lS` @L225503 (parent=Rt.ElementStageView, score=44)
- methods: idle, initTab, onCloseButtonClicked, onConnectButtonClicked, onDisable, onEnable, onHide, onInit, onLiveButtonClicked, onOfficialLiveInfoChanged, onShow, onTabSelected, playInTween, playOutTween, refreshOfficialInfo, setContent, setEnterTab
- strings: "休息中", "预约观看", "已预约", "点击观看", "eventBanner_notice.png", "value", "officialLiveInfo", "_gameLiveModel", "currentLiveState", "refreshOfficialInfo", "key", "onOfficialLiveInfoChanged", "visible", "nextLiveID", "end"

### `$` @L26307 (parent=(无), score=42)
- methods: addTask, callJson, changeState, clear, clearTasks, connect, connectSocket, handleMsg, isInState, onConnected, onDisconnect, onError, reconnect, removeTask, send, shutdown
- strings: "value", "splice", "_tasks", "indexOf", "key", "removeTask", "_rpcSession", "start", "push", "addListener", "onCompleted", "addTask", "stop", "forEach", "clearTasks"

### `vn` @L50404 (parent=f.GameLiveChannelPanelUI, score=42)
- methods: disable, enable, enterTab, initTab, initTabs, onEntryClicked, onLiveDataFetched, onLiveEntryClicked, onOfficialEntryClicked, onOfficialLiveInfoFetched, onRankListFetched, onTabSelected, refreshEntry, refreshLiveEntry, refreshLivelist, refreshOfficialInfo
- strings: "休息中", "预约观看", "已预约", "点击观看", "gamelive/official_live_banner.png", "get", "_currentSelectedType", "getRankListByType", "_gameLiveModel", "key", "rankListData", "value", "fetchRankList", "_gameLiveController", "setArray"

### `Wn` @L53733 (parent=Rt.ElementStageView, score=42)
- methods: idle, onBadgesInfoFetched, onCloseButtonClicked, onDisable, onEnable, onEquipButtonClicked, onEquippedInfoChanged, onGetBasicInfo, onHide, onInit, onShareButtonClicked, onShow, onUnequipButtonClicked, refresh, setData, update
- strings: "解锁条件", "解锁下一等级需要", "已取消佩戴", "关闭", "去看看", "新徽章已佩戴成功，去个人主页看看效果吧！", "佩戴成功✨", "你已经佩戴了三枚徽章，点击确定，用当前徽章取代最早的那枚", "佩戴新徽章", "ui/pattern_rabbit.png", "value", "visible", "unlocked", "_currentItem", "okButton"

### `_o` @L55050 (parent=Rt.ElementStageView, score=42)
- methods: idle, onBuy, onBuyButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onOKButtonClicked, onSend, onShow, playInTween, playOutTween, refresh, setItem
- strings: "当前小喇叭：", "广播", "将会消耗", "上首页", " 邀请你玩 ", "小时，可随时查看", "地图会在「历史广播」中保留", "value", "text", "horn", "getCountByType", "currencyModel", "context", "concat", "currentHornCount"

### `Ja` @L66672 (parent=Rt.ElementStageView, score=42)
- methods: idle, onBroadcastButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onFriendButtonClicked, onHide, onInit, onSendBroadcast, onShareButtonClicked, onShow, onVideoButtonClicked, playInTween, playOutTween, setData
- strings: "广播已发布", "招募", "将会消耗", "广播招募", "分享招募", "招募好友", "分享邀请", "邀请好友", "招募成员", "队长直招", "value", "title", "showToast", "alpha", "needCDBroadcast"

### `vs` @L71054 (parent=(无), score=42)
- methods: addBlockUser, addMessage, getMessageByID, handleChatStatusChanged, handleGetMsg, handleMsgListFetchResult, handleMsgsFetched, handleSendMsgFailed, handleSendMsgSuccess, isBlocked, readMessage, refreshPvpMessage, removeBlockUser, removeInvalidMessages, resetFetchState, startFetch
- strings: "请稍后再发送", "您已被禁言", "value", "delete", "_messages", "has", "forEach", "length", "_ids", "splice", "key", "removeInvalidMessages", "id", "get", "set"

### `tl` @L86393 (parent=Rt.ElementStageView, score=42)
- methods: getClipboardData, handleOnShow, idle, onBlur, onCloseButtonClicked, onDisable, onEnable, onFocus, onHide, onInit, onSearchButtonClicked, onShow, playInTween, playOutTween, refreshAutoPanel, refreshTips
- strings: "复制到剪贴板，系统将自动识别", "将5位地图", "未检测到有效", "ugc_search_tips", "ugc_toast_searchfailed", "value", "complete", "mouseEnabled", "inputField", "_ui", "fail", "refreshAutoPanel", "success", "_autoID", "color"

### `_l` @L89428 (parent=Rt.ElementStageView, score=42)
- methods: idle, onADButtonClicked, onBuyButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onShow, onUploadSlotChanged, onWatchVideoEnd, playInTween, playOutTween, refresh
- strings: "发布额度已提升到", "次，已看", "需要", "/ugc/icon_ugcslot.png", "value", "playOutTween", "title", "concat", "showToast", "refresh", "key", "onUploadSlotChanged", "count", "price", "_shopData"

### `Ql` @L95965 (parent=Rt.ElementStageView, score=42)
- methods: idle, onADButtonClicked, onBuyButtonClicked, onCloseButtonClicked, onDestroy, onDisable, onEnable, onHide, onInit, onLoadVideoFailed, onShow, onWatchVideoEnd, playInTween, playOutTween, setItem, updatePanorama
- strings: "金币，为当前地图生成全景截图？", "使用", "value", "previewPanorama", "_ugcController", "onHide", "_item", "updateUGCLevelPanorama", "key", "updatePanorama", "ugcPanoramaPrice", "config", "handleNotEnoughCurrency", "context", "haveCurrency"

### `Uh` @L99996 (parent=Rt.ElementStageView, score=42)
- methods: idle, onAddAllButtonClicked, onApplicationSend, onCloseButtonClicked, onDisable, onEnable, onEntryAddClicked, onEntryDetailClicked, onHide, onInit, onShow, onTipsClicked, playInTween, playOutTween, refreshEntry, setData
- strings: "复制成功", "加好友", "value", "refreshStatus", "profile", "forEach", "entries", "list", "_ui", "alpha", "addAllButton", "added", "userID", "includes", "_profiles"

### `Au` @L112866 (parent=zs, score=42)
- methods: onBankCoinClaimed, onClaimButtonClicked, onDestroy, onDisable, onEnable, onEntryClicked, onFreeCoinButtonClicked, onFreeCoinClaimed, onInit, onLoadVideoFailed, onWatchVideoEnd, refreshBankPanel, refreshDoubleCoinState, refreshFreeCoinPanel, showRewardAnim, update
- strings: " 后产出", "00:00:00 后产出", "/bank_top.png", "value", "refreshDoubleState", "forEach", "_entries", "key", "refreshDoubleCoinState", "visible", "freeCoinButton", "_ui", "_haveFreeVideoAd", "_freeCoinVideoAd", "haveDailyVideoAdQuota"

### `E_` @L131853 (parent=Rt.ElementBehaviour, score=42)
- methods: addPlayerStateMsg, doExtrapolation, doInterpolation, forceSendFullSnapshot, getCurrentSimulateOwnerTime, nonOwnerUpdate, onDisable, onEnable, onGetPlayerStateMsg, onGetPlayerStateRawMsg, onInit, reset, sendSnapshot, sendSnapshotRaw, update, updateToLastState
- strings: "value", "ts", "_currentLastKnownState", "onReceiveNewOwnerTime", "_ownerTime", "_states", "unshift", "_stateBufferSize", "splice", "length", "clearAllEffects", "effects", "context", "state", "teleport"

### `Lf` @L136228 (parent=(无), score=42)
- methods: checkIfAvailable, checkIfPlayerHitFace, checkIfShootableHitFace, findEmptyDecoCell, getAdjecentBlocks, getCellPostion, getDirAngleOffset, getDirByHitNormal, getDirVector, getIsDirFlipped, getIsDirHorizontal, getIsOppositeDir, getOppositeDir, nextDirection, sendProjectileTriggerRpc, setVectorFromDir
- strings: "value", "decoComponent", "key", "checkIfAvailable", "y", "x", "getCell", "cellVisualSize", "bottom", "editBounds", "round", "right", "spatialHash", "length", "findEmptyDecoCell"

### `Sw` @L206694 (parent=(无), score=42)
- methods: clearRPC, destroy, generateDouyinChannel, getIsOnline, getRPC, handleStartMatchRPC, join, onUpdate, registerCommand, registerRPC, rpc, sendCommand, shutdown, unregisterCommand, unregisterRPC, updateAvatar
- strings: "value", "clear", "timer", "startMatch", "getRPC", "delegate", "system", "components", "id", "map", "editableConfigs", "generatePartyComponents", "model", "startTime", "now"
