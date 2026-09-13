/* batch2.js — 把批次 2 推断结果合并进 auto-names.json（幂等） */
'use strict';
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'auto-names.json');
const a = JSON.parse(fs.readFileSync(FILE, 'utf8'));
a.note = 'AI 辅助推断命名（批次1+2，2026-09-06）。conf=high 才会被 gen_map.js 合入 name-map.json（build-tool 消费）；conf=medium 仅出现在 enums.json 的建议名。每条带证据，核对后可把 medium 升 high。';

Object.assign(a.classes, {
    LoginStageView: { real: 'wi', conf: 'high', ev: 'loginWithApple/Guest/Taptap/Tel/Wechat + 用户协议/隐私政策/TapTap 预约更新文案; parent=Rt.ElementStageView' },
    BattlePassStageView: { real: 'ir', conf: 'high', ev: 'onBuyBattlePassButtonClicked/initList + 赛季通行证/旗帜数量会延续至下一等级/跳过当前等级; parent=Rt.ElementStageView' },
    CheckinPanel: { real: 'Vs', conf: 'high', ev: 'onCheckinButtonClicked/onFillButtonClicked + 补签成功/签到成功/签满7日即可领取; parent=Rt.ElementStageView' },
    FriendService: { real: 'ac', conf: 'high', ev: 'agreeApplication/deleteFriend/fetchFriends/handlePvpInvitationMsg/handleIntimacySyncResult; parent=Rt.ElementComponent' },
    GameLiveService: { real: 'Ji', conf: 'high', ev: 'fetchMission/fetchOfficialLiveInfo/handleLiveReserveResult + 主播任务/连播奖励/周播奖励/看播奖励/startLive; parent=Rt.ElementComponent' },
    FriendModel: { real: 'nc', conf: 'high', ev: 'addFriend/deleteFriend/getFriendByShortID/getOnlineFriendCount/_pvpInvitations; parent=Rt.ElementModel' },
    CharacterModel: { real: 'Yd', conf: 'high', ev: 'buy/equip/getCharacterByID/giveDebris/getDebrisCountNeed/characterSkinConfig; parent=Rt.ElementModel' },
    BuffModel: { real: 'Do', conf: 'high', ev: 'addBuff/getInventoryBuff/getItemTrialBuff/haveSpecialSkinTrailBuff/_localBuffs; parent=Rt.ElementModel' },
    ReplayDataModel: { real: 'th', conf: 'high', ev: 'addGameEvent/addPlayerRoundScore/convertToFlatBuffer/getRoundReplayData/fillStructure + invalid RPC attributes data; parent=Rt.ElementModel' },
    ItemUtils: { real: 'wp', conf: 'high', ev: 'getItemName/getQuality/getQualityColor/getInventoryTypeName + statics currencyTypes; 字符串: 试用卡/保星卡/金币卡/道具/礼物/贴花' },
    AiPathBehaviour: { real: 'P_', conf: 'high', ev: 'advanceToNextNode/findNextPlatformNodeAndUpdate/isNextPlatformDangerousToLand/getFinalNode + "use top/large path"; parent=Rt.ElementBehaviour' },
    SettingsStageView: { real: 'aS', conf: 'high', ev: 'ToggleSound/ToggleMusic/ToggleRecord/clearCache + 用户协议/隐私政策/清理缓存？; parent=Rt.ElementStageView' },
    LevelSpatialGrid: { real: 'yg', conf: 'high', ev: 'addWithCells/cellAtPosition/checkComponentSpaceTaken/checkGhostComponentOverlap/checkInHazardReachableArea/checkIfPathNodeAtCellPos' },
    MatchmakingState: { real: 'LS', conf: 'high', ev: 'createNewMatch/joinRoom/enterGameState/exitMatchmaking + 正在联赛，无法进入房间/已经在房间中; parent=Rt.State' },
    EmojiPanel: { real: 'At', conf: 'high', ev: 'initSlotEntries/isItemPreviewed + 全部表情（/预览中/使用中/ui/icon_emoji_white.png; parent=xt(面板基类)' },
    DisconnectReason: { real: 'WC', conf: 'high', ev: 'disconnect_inObserveLevel=4/disconnect_afterPlayOutTween=3/disconnect_afterEnterRoom=2/timeout_connectRoom=1/none=0' },
    Difficulty: { real: 'Ln', conf: 'high', ev: 'hard=3/medium=2/easy=1/none=0' },

    EditorComponentListView: { real: 'cC', conf: 'medium', ev: 'initTabs/mapComponentCategoryToTabType/createComponentAtCenter/getComponentLockType + 该组件仅限「双人重生模式」; parent=Rt.ElementStageView' },
    EditorSaveStageView: { real: 'DC', conf: 'medium', ev: 'doSaveLevel/handleSaveLevel/onMapSizeButtonClicked + 上传失败/关卡中有部分文字内容不符合平台规范/录屏中; parent=Rt.ElementStageView' },
    MatchSettingsPanel: { real: 'jb', conf: 'medium', ev: 'changeMatchMode/initMapList/changeToTargetScoreEndType + 联赛升级到「/随机地图' },
    UnlimitedHpPanel: { real: 'hl', conf: 'medium', ev: 'canClaimBy/onAdButtonClicked/onLiveButtonClicked + 求助好友，才能生命无限哦/直播期间无限生命' },
    ClanInfoEditPanel: { real: 'qa', conf: 'medium', ev: 'checkClanNameLocal/onChangeIDButtonClicked/onChangeModeButtonClicked + 战队号修改成功/请输入战队名称/确认创建; parent=Rt.ElementStageView' },
    RoomStageView: { real: 'Zb', conf: 'medium', ev: 'changeToCharacterState/changeToHomeState/despawnOpponentPlayer/getPlayerSpawnPoint/_roomMemberHuds; parent=Rt.ElementStageView' },
    GameplayControllerBase: { real: 'lk', conf: 'medium', ev: 'lk 家族(dk/pk/_k/fk/Ck)共同基类; 成员含 getMatchMode/getLevelID/initGame 等对局控制通用方法' },
    PvpMatchController: { real: 'dk', conf: 'medium', ev: 'checkIfFirstPvp/onFetchLevelSnapshot/onGetLevelSnapshotFromOtherPlayer + 遇见高手 开启5局模式/只剩1个对手; parent=lk' },
    TutorialMatchController: { real: 'pk', conf: 'medium', ev: 'generateTutorial1Elements/jumpButtonTip + 同时按右和跳跃键，跳一下试试/放个刺球，搞搞破坏如何？; parent=lk' },
    DailyChallengeView: { real: 'Al', conf: 'medium', ev: 'onDailyChallengeFetched/getDifficultyStar + 冷却时间 /看广告…立即挑战关卡' },
    PartyComponentModel: { real: 'ak', conf: 'medium', ev: 'initRoundData/nextRound/generatePartyComponents/getAvaliablePartyComponents/_roundComponents/_selectedPlayerIndexes; parent=Rt.ElementModel' },
    AccountApiService: { real: '$w', conf: 'medium', ev: 'bindPhoneNumber/fetchProfile/fetchRealNameInfo/generateRestoreCode + account/update、account/decode 端点; parent=Rt.ElementComponent' },
    StoryModeView: { real: 'An', conf: 'medium', ev: 'fetchUGCLevels/fetchUGCLevelsReverse + 请先完成上一个关卡/花费钻石或印花跳过关卡？/story.png; parent=Rt.ElementStageView' },
    ActivityStageView: { real: 'Es', conf: 'medium', ev: 'onEventStateChanged/onRankFetched + 活动已结束/reward_score.png/reward_rank.png/theme_bg.png; parent=Rt.ElementStageView' },
    UgcLevelApiService: { real: 'Pr', conf: 'medium', ev: '同 Mr(UgcLevelService) 方法表 + ugclevel/addmark、ugclevel/getmarklist、ugclevel/playhistory 端点; parent=Lr' },
    ItemBuyPanel: { real: 'fu', conf: 'medium', ev: 'buyWithCurrency/onBuy + 赠送试用卡/购买个数/今日限购/永久限购/确认购买/评分来自于资深玩家评审团; parent=Rt.ElementStageView' },
    CoopGameStageView: { real: 'ZC', conf: 'medium', ev: 'onGiveUpButtonClick + 重生点已启用/气泡已启用/抛下队友，退出闯关，这就是你要的结果吗？; parent=Rt.ElementStageView' },
    CommentAdminPanel: { real: 'bl', conf: 'medium', ev: 'onBlockButtonClicked/onReportButtonClicked + 举报已提交/金币删除这条评论？/巡检; parent=Rt.ElementStageView' },
    FriendlyMatchRoom: { real: 'Lw', conf: 'medium', ev: 'kickPlayerFromFriendlyMatch/onFriendlyMatchBasicInfoChanged/generateDouyinChannel + 您被房主请出了房间/队伍人数已满' },
    FreehornPanel: { real: 'Ra', conf: 'medium', ev: 'refrehShopDataInfo/refreshBuyInfo + 发布视频，才能获得小喇叭哦/每日可领/限购; parent=Rt.ElementStageView' },
    ClanServiceBase: { real: 'hs', conf: 'medium', ev: 'cs/us(clan/* 端点变体)共同父类; blockUser/createClan/fetchClanList/getClanInfo' },
    VipLotteryPanel: { real: 'Xs', conf: 'medium', ev: 'onVipButtonClicked/onDrawButtonClicked/onMaxRewardClicked + 开通免广告/幸运鹅/贵族经验; parent=zs' },
    RechargePanel: { real: 'au', conf: 'medium', ev: 'onRecharged/onRechargeEntryClicked + recharge/banner_vip.png/recharge/banner_newbie.png/您已经购买; parent=Kc' },
    PhysicsMoveBehaviour: { real: 'C_', conf: 'medium', ev: 'applyHorizontalVelocity/applyVerticalVelocity/checkPlayerPenetration/killFromSquashed/addExtraMotion; parent=Rt.ElementBehaviour' },
    TrainingPanel: { real: 'Vn', conf: 'medium', ev: 'handleChallengeTraining/handlePvpTraining/handleSkillTraining + 我的技能等级：/ai_training.png; parent=Rt.ElementStageView' },
    ClanBroadcastPanel: { real: 'fo', conf: 'medium', ev: 'onMessagesFetched + 历史广播/广播消息会保留; parent=Rt.ElementStageView' },
    ActivityService: { real: 'Is', conf: 'medium', ev: 'buyBattlePass/claimBattlePassReward/fillCheckin/handleLotteryResponse + 通行证/派对金库/7日签到/冲榜活动; parent=Rt.ElementComponent' },
    MyLevelsPanel: { real: 'nl', conf: 'medium', ev: 'createLevel/fetchUGCLevels/onAlbumAction + 地图额度已达上限/地图 0/; parent=el' },
    LevelInfoEditPanel: { real: 'al', conf: 'medium', ev: 'checkAutoLevelName/initTags/onNameAndTagUpload + 地图类型/地图名称/根据您选择的特点自动生成地图名; parent=Rt.ElementStageView' },
    AiBattleController: { real: 'ck', conf: 'medium', ev: 'createAIPlayer/createTargetBox/getAIParamKey/_successParams' },
    ClanDetailPanel: { real: 'za', conf: 'medium', ev: 'fetchClanMembers/onApplicationClicked/onCaptainInviteButtonClicked + 转让队长/退出战队后第二天才能加入新的战队/战队号; parent=Fa' },
    ClanChatPanel: { real: 'Wa', conf: 'medium', ev: 'canSendMessage/checkNoticeLocal/hideTextChatPanel + 队内公告/您已被禁言/请输入新的公告; parent=Fa' },
    PlayerEventService: { real: 'V_', conf: 'medium', ev: 'addScore/kill/killByShooty/killFromSquashed/reachFlag/sendLevelComponentEvent + PlayerLevelComponentMsgID; parent=Rt.ElementComponent' },
    ProjectileEntity: { real: 'Tv', conf: 'medium', ev: 'getIsProjectile/getShootVector/getTeleportDelay/getIsInsidePortal + statics collisionResultTemp' },
    TrackService: { real: 'We', conf: 'medium', ev: 'logLoginEvent/logToAliyun/onChargeRequest/onChargeSuccess/completeTrainingMission + tel/Taptap/Apple/2.1.47' },
});

Object.assign(a.enums, {
    Gr: { name: 'DifficultyEx', conf: 'medium', ev: 'insane=4/hard=3/medium=2/easy=1/none=0（比 Difficulty 多 insane）' },
    ee: { name: 'RewardedAdError', conf: 'medium', ev: 'Max=120002/NoSuitableAd=1002（激励视频错误码）' },
    ji: { name: 'LevelSort', conf: 'medium', ev: 'reward=3/time=2/like=1/none=0' },
    hn: { name: 'LiveRewardCycle', conf: 'medium', ev: 'cumulativeLive=1/dailyLive=0' },
    oo: { name: 'RestrictScope', conf: 'medium', ev: 'ugcTextComment=6/ugcUpload=5/friendlyPvp=4/league=3/emoji=2/report=1/ugcComment=0（禁言/封禁范围）' },
    lo: { name: 'ReportScene', conf: 'medium', ev: 'badplay=4/goodplay=3/pvp_report=2/comment_report=1/pvp_disconnect=0' },
    bs: { name: 'LotteryOp', conf: 'medium', ev: 'claimMax=2/draw=1/sync=0' },
    Us: { name: 'RewardCenterTab', conf: 'medium', ev: 'checkin=3/bank=2/lottery=1/none=0' },
    vr: { name: 'EndReason', conf: 'medium', ev: 'dead=3/quit=2/restart=1/win=0' },
    Rr: { name: 'CommentAdminOp', conf: 'medium', ev: 'delete=3/sticky=2/ban=1/report=0' },
    'c_': { name: 'TutorialStep', conf: 'medium', ev: 'football=3/coin=2/setup=1/reachToFlag=0' },
    'k_': { name: 'InputSource', conf: 'medium', ev: 'touch=1/button=0' },
    'z_': { name: 'PlayState', conf: 'medium', ev: 'revive=5/deadghost=4/edit=3/hide=2/disabled=1/run=0' },
    '$_': { name: 'SettingGroup', conf: 'medium', ev: 'sound=3/headicon=2/effects=1/avatar=0' },
    Mf: { name: 'DynamicCategory', conf: 'medium', ev: 'noDynamic=2/noKillable=1/normal=0' },
    Jk: { name: 'RotateDir', conf: 'medium', ev: 'right=3/left=2/down=1/up=0' },
    oC: { name: 'PaletteFilter', conf: 'medium', ev: 'cache=5/decoration=4/special=3/hazards=2/platform=1/common=0/none=-1（组件面板过滤）' },
    zC: { name: 'GameSystem', conf: 'medium', ev: 'audio=17/dynamicBounds=16/rpc=15/levelNetwork=14/playNetwork=13/matchplay=12/ghostrecord=10/video=9/camera=7/drag=6…（18 成员）' },
    jC: { name: 'GameFlowState', conf: 'medium', ev: 'revive=7/standby=6/end=5/edit=4/play=3/observelevel=2/observeplayer=1/init=0' },
    db: { name: 'ProfileInfoTab', conf: 'medium', ev: 'relation=4/badge=3/pvp=2/level=1/none=0' },
});

fs.writeFileSync(FILE, JSON.stringify(a, null, 1));
console.log('auto-names.json: classes =', Object.keys(a.classes).length, ', enums =', Object.keys(a.enums).length);
