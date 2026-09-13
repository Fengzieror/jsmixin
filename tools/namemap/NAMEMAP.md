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
| PlayerDataModel | `Er` | 类/推断(high) | 86 方法: adaptLevelData/addLocalLevel/consumeHp/buyStamp/addChallengeHistory/addReplayRecord/clearLocalSetting; 字符串: 人品分不足/你的人品分过低，不允许点评; parent=Rt.ElementModel | 83366 |
| HomeStageView | `Vb` | 类/推断(high) | 60+ 方法: onBadgeButtonClicked/onBattlePassHudClicked/onClanButtonClicked/onDailyChallengeButtonClicked/getTutorialType; 字符串: 创建房间/组队赛暂时关闭中/自制地图，全国挑战; parent=Rt.ElementStageView | 219397 |
| UgcLevelService | `Mr` | 类/推断(high) | 43+ 方法: createUGCLevel/deleteUGCLevel/fetchComments/fetchLevelData/buyUploadSlot/actionComment; 字符串: 地图槽位/生成全景图失败/今天已经发了…点评; parent=Rt.ElementComponent | 81149 |
| LevelEditor | `Ek` | 类/推断(high) | 42+ 方法: addEditComponentToLevel/createComponentAndDrag/editCurrentComponent/handleResizeMap/initMapAllComponents/moveMap; statics: maxUndoCount; 字符串: 地图最多/地图横向至少/广告结束后，即可立即获得组件; parent=xk | 186279 |
| MatchController | `kk` | 类/推断(high) | 38+ 方法: getMatchMode/getMatchEndType/getPlayerByIndex/getLocalPlayerTeam/handlePlayerHitCheckpoint/checkIfRespawnInstantKill; 字符串: parse level snapshot failed/房主决定重新开始闯关 | 183789 |
| MatchRoomStageView | `zb` | 类/推断(high) | 33+ 方法: cancelMatchmaking/changeTeam/changeToCreativeMode/copyMatchID/getMatchID/onChangeRoomType/onEnterFriendlyMatch; 字符串: 率先达到…分的队伍获胜/生肖训练师为你准备了新手教学; parent=Rt.ElementStageView | 221026 |
| ShareService | `dp` | 类/推断(high) | 32+ 方法: getShareConfig/getShareMessage/onShareAppMessage/onShareSuccess/captureScreen/logShareInfo; 字符串: 派对制造/生肖派对/20.6.0; parent=Rt.ElementComponent | 122737 |
| GameEndStageView | `yC` | 类/推断(high) | 32+ 方法: canRematch/doRematchCountdown/backToHome/handleRematch/needShowAnnualReportButton; 字符串: 分享比赛视频/继续游戏/赛季已结束; parent=Rt.ElementStageView | 194964 |
| AnnualReportStageView | `Ew` | 类/推断(high) | 29+ 方法: onAnnualReportFetched/onAnnualRewardClaimed/onAnnualReportUnlocked/getVideoInfo; 字符串: 年终奖已解锁，分享领取/年终奖已领取; parent=Rt.ElementStageView | 209298 |
| ReplayStageView | `UC` | 类/推断(high) | 26+ 方法: onRecordButtonClicked/canComment/handleCommentResult/despawnPlayer; 字符串: 回放数据是临时的。如需录屏，请现在启动哦/点评地图; parent=Rt.ElementStageView | 201097 |
| ClanService | `ls` | 类/推断(high) | 24+ 方法: createClan/fetchClanList/getClanInfo/handleApplication/invite/blockUser; 字符串: 战队招募/战队邀请/不是队长，没有操作权限; parent=Rt.ElementComponent | 68243 |
| PvpEndStageView | `XC` | 类/推断(high) | 23+ 方法: getOtherPlayerName/canComment/despawnPlayers; 字符串: 你们创造了新纪录！/地图发布后，才可以点评; parent=Rt.ElementStageView | 201859 |
| GameHudStageView | `pC` | 类/推断(high) | 22+ 方法: onPlayerKilled/onPlayerScoreAdd/onGiveupButtonClick/onOpponentJoin/clearHud/initByGameMode; 字符串: 放弃本局!/飞出了边界!/被挤扁了!; parent=Rt.ElementStageView | 193420 |
| LoginStageView | `wi` | 类/推断(high) | loginWithApple/Guest/Taptap/Tel/Wechat + 用户协议/隐私政策/TapTap 预约更新文案; parent=Rt.ElementStageView | 44066 |
| BattlePassStageView | `ir` | 类/推断(high) | onBuyBattlePassButtonClicked/initList + 赛季通行证/旗帜数量会延续至下一等级/跳过当前等级; parent=Rt.ElementStageView | 76454 |
| CheckinPanel | `Vs` | 类/推断(high) | onCheckinButtonClicked/onFillButtonClicked + 补签成功/签到成功/签满7日即可领取; parent=Rt.ElementStageView | 74011 |
| FriendService | `ac` | 类/推断(high) | agreeApplication/deleteFriend/fetchFriends/handlePvpInvitationMsg/handleIntimacySyncResult; parent=Rt.ElementComponent | 103243 |
| GameLiveService | `Ji` | 类/推断(high) | fetchMission/fetchOfficialLiveInfo/handleLiveReserveResult + 主播任务/连播奖励/周播奖励/看播奖励/startLive; parent=Rt.ElementComponent | 48260 |
| FriendModel | `nc` | 类/推断(high) | addFriend/deleteFriend/getFriendByShortID/getOnlineFriendCount/_pvpInvitations; parent=Rt.ElementModel | 102748 |
| CharacterModel | `Yd` | 类/推断(high) | buy/equip/getCharacterByID/giveDebris/getDebrisCountNeed/characterSkinConfig; parent=Rt.ElementModel | 120451 |
| BuffModel | `Do` | 类/推断(high) | addBuff/getInventoryBuff/getItemTrialBuff/haveSpecialSkinTrailBuff/_localBuffs; parent=Rt.ElementModel | 56638 |
| ReplayDataModel | `th` | 类/推断(high) | addGameEvent/addPlayerRoundScore/convertToFlatBuffer/getRoundReplayData/fillStructure + invalid RPC attributes data; parent=Rt.ElementModel | 96626 |
| ItemUtils | `wp` | 类/推断(high) | getItemName/getQuality/getQualityColor/getInventoryTypeName + statics currencyTypes; 字符串: 试用卡/保星卡/金币卡/道具/礼物/贴花 | 125441 |
| AiPathBehaviour | `P_` | 类/推断(high) | advanceToNextNode/findNextPlatformNodeAndUpdate/isNextPlatformDangerousToLand/getFinalNode + "use top/large path"; parent=Rt.ElementBehaviour | 131216 |
| SettingsStageView | `aS` | 类/推断(high) | ToggleSound/ToggleMusic/ToggleRecord/clearCache + 用户协议/隐私政策/清理缓存？; parent=Rt.ElementStageView | 224736 |
| LevelSpatialGrid | `yg` | 类/推断(high) | addWithCells/cellAtPosition/checkComponentSpaceTaken/checkGhostComponentOverlap/checkInHazardReachableArea/checkIfPathNodeAtCellPos | 167371 |
| MatchmakingState | `LS` | 类/推断(high) | createNewMatch/joinRoom/enterGameState/exitMatchmaking + 正在联赛，无法进入房间/已经在房间中; parent=Rt.State | 228866 |
| EmojiPanel | `At` | 类/推断(high) | initSlotEntries/isItemPreviewed + 全部表情（/预览中/使用中/ui/icon_emoji_white.png; parent=xt(面板基类) | 32442 |
| Direction | `w` | 枚举 | 枚举成员 none=0/up=1/right=2/down=3/left=4 | 9966 |
| PhysicsLayer | `hf` | 枚举 | player=1/oneWayPlatform=2/platform=4/hazard=8/playerTriggerable=16/robot=4096/pvpNetworkPlayer=8192/balloon=16384/boxingglove=32768 | 135138 |
| ZOrder | `VC` | 枚举 | sky=0/grid=4/scene=5/platform=200/moveplatform=4000/trigger=6000/movetrigger=8000/player=10000/projectile=10010/foreground=20000/gizmo=30000 | 201852 |
| ComponentType | `_f` | 枚举 | onewayblock=24/nowallblock=34/gem=41/startArea=100/goalArea=101/boss=102/sky=200/bgm=203…（80+ 成员） | 135514 |
| RotateMode | `Pf` | 枚举 | none=0/rotate=1/flip=2 | 136462 |
| EditableScope | `Bf` | 枚举 | none=0/pvpOnly=1/challengeOnly=2/both=3 | 136463 |
| ScreenId | `ES` | 枚举 | realname/realnameinfo/antiaddiction/clan/album*/skintrial…（150+ 视图 id） | 229696 |
| DialogType | `S` | 枚举/推断(high) | actionSheet=3/loading=2/modal=1/toast=0 | 24697 |
| InitStep | `yt` | 枚举/推断(high) | assets=5/login=4/uiConfig=3/gameConfig=2/appConfig=1/none=0 | 28920 |
| ProfileTab | `wt` | 枚举/推断(high) | inventory=4/emoji=3/appearance=2/skin=1/none=0 | 29993 |
| ProfileItemType | `Mt` | 枚举/推断(high) | socialAvatar=4/authButton=3/emptyItem=2/item=1/none=0 | 30470 |
| ItemDuration | `Dt` | 枚举/推断(high) | lifetime=2/consumable=1 | 32440 |
| PreloadType | `Kt` | 枚举/推断(high) | gameconfig=4/sound=3/character=2/uijson=1/atlas=0 | 35361 |
| FeatureType | `Qt` | 枚举/推断(high) | skintrial=27/freehorn=26/lottery=25/freegem=24/ugcpanorama=23/npc=22/dailylogin=21…（28 成员） | 35362 |
| AdState | `$t` | 枚举/推断(high) | showing=2/loading=1/none=0（紧邻 te/ee/ie 广告错误码） | 35835 |
| AdErrorCode | `te` | 枚举/推断(high) | NoSuitableAd=1004/InterError=1003/ServerError=1000 | 35836 |
| ScreenEdge | `Pe` | 枚举/推断(high) | centerX=5/centerY=4/rightEdge=3/leftEdge=2/topEdge=1/bottomEdge=0 | 37913 |
| FetchState | `Ee` | 枚举/推断(high) | failed=3/succeed=2/fetching=1/none=0 | 38130 |
| AccountType | `Ve` | 枚举/推断(high) | restore=7/session=6/guest=5/taptap=4/apple=3/tel=2/nativewechat=1/none=0 | 40007 |
| SmsStep | `Ge` | 枚举/推断(high) | verifyCode=2/getCode=1/getAccount=0 | 40009 |
| LoginChannel | `ze` | 枚举/推断(high) | TapTap=9/Apple=8/Tel=7/Wechat=6/None=0 | 40337 |
| MatchFlowEvent | `Xe` | 枚举/推断(high) | reMatch=7/exitMatch=6/endMatch=5/startMatch=4/exitRoom=3/enterRoom=2/loaded=1/launch=0 | 40652 |
| CommentSort | `gi` | 枚举/推断(high) | like=2/time=1/none=0 | 43570 |
| ChallengeCycle | `qi` | 枚举/推断(high) | weekly=2/daily=1/none=0 | 47815 |
| GameMode | `Pn` | 枚举/推断(high) | challenge=4/pvp=3/league=2/skill=1/basic=0 | 51556 |
| MissionType | `En` | 枚举/推断(high) | gamelive=12/pvpKing=11/marathon=10/joinDays=9/login=8/ugcLevelPassed=5/ugcLikes=4/spendCoins=1/pvpTop1=0（13 成员） | 51824 |
| ReportReason | `so` | 枚举/推断(high) | others=4/conflict=3/abuse=2/vulgar=1/violation=0 | 54855 |
| CardType | `Mo` | 枚举/推断(high) | specialSkinTrial=5/danDefendCard=4/pvpScoreCard=3/coinCard=2/skinTrialCard=1/none=0 | 56433 |
| PushNoticeType | `Oo` | 枚举/推断(high) | clanRoleChanged=16/clanKicked=15/clanInvite=12/giftReceived=8/badgeUnlocked=7/mail=5/levelUp=3/friendAdded=1（17 成员） | 57075 |
| RankType | `sa` | 枚举/推断(high) | vip=4/pvp=3/skill=2/creative=1/active=0/none=-1 | 60203 |
| AdFailReason | `va` | 枚举/推断(high) | maxQuota=1/noSuitableAd=0 | 61465 |
| ClanOp | `Va` | 枚举/推断(high) | getClans=20/blockUser=19/setViceCaptain=18/kickMember=17/transferRole=15/handleApplication=14/join=11/create=7…（21 成员） | 64046 |
| ClanPage | `Na` | 枚举/推断(high) | broadcast=6/mail=5/random=4/invite=3/search=2/clandetail=1/list=0 | 64047 |
| ClanRole | `ps` | 枚举/推断(high) | viceCaptain=2/captain=1/none=0 | 70581 |
| ChatType | `fs` | 枚举/推断(high) | friendPvp=5/teamPvp=4/ugc=3/emoji=2/text=1/none=0 | 71053 |
| ActivityType | `gs` | 枚举/推断(high) | recharge=9/lottery=8/battlePass=7/checkin=6/football=5/challenge=4/douyinVideo=3/skinFree=2/newyear2022=1/rankRushv2=0（11 成员） | 71402 |
| ActivityState | `ks` | 枚举/推断(high) | end=4/reward=3/active=2/notOpen=1/none=0 | 71607 |
| AlbumOp | `pr` | 枚举/推断(high) | sortAlbum=5/getAlbum=4/delete=3/update=2/create=1/getLocals=0 | 78357 |
| PlayMode | `Tr` | 枚举/推断(high) | tutorial=4/record=3/replay=2/challengeWithGhost=1/none=0 | 81148 |
| LevelTag | `Nr` | 枚举/推断(high) | coop=7/visual=6/newbie=5/run=4/auto=3/micro=2/puzzle=1/all=0 | 84764 |
| LevelTab | `qr` | 枚举/推断(high) | replay=5/history=4/local=3/star=2/latest=1/none=0 | 85769 |
| FriendAction | `Ih` | 枚举/推断(high) | delete=5/reject=4/add=3/invite=2/setting=1/info=0 | 98920 |
| FriendTab | `Ah` | 枚举/推断(high) | application=2/friend=1/none=0 | 99657 |
| InviteType | `Hh` | 枚举/推断(high) | clanCaptainInvite=3/clanInvite=2/teamPvp=1/friendPvp=0 | 100657 |
| Presence | `Zh` | 枚举/推断(high) | online=2/ingame=1/offline=0 | 102223 |
| PayChannel | `ic` | 枚举/推断(high) | alipay=1/wechatpay=0 | 102747 |
| PayError | `cc` | 枚举/推断(high) | IsProcessing=51008/NoUncompletedOrder=51007/VerifyFailed=51006/InvalidProduct=51004/PayFailed=51001（8 成员） | 104016 |
| RankTier | `ud` | 枚举/推断(high) | epic=8/master=7/diamond=6/platinum=5/gold=4/silver=3/iron=2/bronze=1/newbie=0 | 115818 |
| ServerError | `hp` | 枚举/推断(high) | 79 个错误码: ErrChatRoomChannelRateLimited=8004/ErrClanNotCaptain=7011/ErrNickNameTooShort=7016… | 122462 |
| Quality | `gp` | 枚举/推断(high) | legendary=5/epic=4/rare=3/excellent=2/common=1/none=0 | 125272 |
| RecordState | `bp` | 枚举/推断(high) | stopped=5/stopping=4/paused=3/recording=2/starting=1/none=0 | 125923 |
| PlayerAnim | `Sp` | 枚举/推断(high) | shootbarrel=11/bubble=10/electrified=9/teleport=8/celebrate=6/dead=5/wallcling=4/run=3/falldown=2/jump=1/idle=0（12 成员） | 125924 |
| SurfaceType | `Mp` | 枚举/推断(high) | mud=2/ice=1/normal=0 | 125928 |
| DeathReason | `u_` | 枚举/推断(high) | giveup=5/squash=4/electricity=3/hazard=2/outOfScope=1/none=0 | 128506 |
| MoveState | `w_` | 枚举/推断(high) | unknown=6/halt=5/walljump=4/jump=3/waitForJump=2/walk=1/none=0 | 130831 |
| ControlSource | `J_` | 枚举/推断(high) | npc=6/deadghost=5/ui=4/network=3/ghost=2/ai=1/input=0 | 134540 |
| GameEvent | `tf` | 枚举/推断(high) | teleport=10/componentevent=9/ghost=8/match=7/edit=6/trigger=5/collider=4/move=3/network=2/ai=1/input=0（11 成员） | 134543 |
| CollisionRole | `Nf` | 枚举/推断(high) | onlyTakeUpSpace=3/doNotTakeUpSpace=2/onewayPlatform=1/platform=0 | 138766 |
| ProjectileType | `ff` | 枚举/推断(high) | balloon=3/laserBullet=2/cannonBullet=1/arrow=0 | 135515 |
| EnvType | `Ef` | 枚举/推断(high) | blocked=2/prod=1/alpha=0 | 136464 |
| BalloonColor | `$v` | 枚举/推断(high) | count=10/black=9/cyan=8/coffee=7/orange=6/berry=5/green=4/lavender=3/red=2/yellow=1/blue=0（Balloon=ey @L151811 同位置） | 151809 |
| BalloonShape | `ty` | 枚举/推断(high) | count=3/rect=2/circle=1/triangle=0（@L151810 紧邻 Balloon） | 151810 |
| LaserState | `Cv` | 枚举/推断(high) | revertback=3/shootstill=2/shooting=1/disabled=0（LaserShooter=Gy 相关） | 144430 |
| WidgetType | `Ig` | 枚举/推断(high) | slider=4/action=3/toggle=2/radio=1/list=0 | 168965 |
| EditPropKey | `Tg` | 枚举/推断(high) | 34 成员: skin/action/switches/color/robotSpeed/spawn/move_dirY/rotateDir/swingAngle/spinMode/size/gap/height/connect/ease/waitTime/flip/spinSpeed… | 168966 |
| SpectateMode | `Km` | 枚举/推断(high) | observeplayer=3/observeposition=2/play=1/nonfollow=0 | 178539 |
| RecordMode | `AC` | 枚举/推断(high) | replay=5/recordNative=4/recordToutiao=3/recordWechat=2/normal=1/none=0 | 200949 |
| GamePhase | `kC` | 枚举/推断(high) | lose=4/win=3/play=2/edit=1/ready=0 | 196182 |
| AppState | `DS` | 枚举/推断(high) | characterinit=7/quitgame=6/matchmaking=5/reloadgame=4/game=3/home=2/login=1/init=0 | 229697 |
| UILayer | `RS` | 枚举/推断(high) | toast=7/tutorial=6/mask=5/effect=4/popup=3/ui=2/gameui=1/game=0 | 229698 |
| PlatformType | `HS` | 枚举/推断(high) | kuaishou=6/bilibili=5/qq=4/standalone=3/toutiao=2/wechat=1/chrome=0 | 231769 |
| RoomVisibility | `vw` | 枚举/推断(high) | private=1/public=0 | 206075 |
| WinCondition | `mw` | 枚举/推断(high) | targetScore=1/fixedRound=0 | 206078 |
| TutorialStage | `Nb` | 枚举/推断(high) | tutorialEnd=5/characterUnlock=4/matchmaking=3/matchmakingStart=2/character=1/home=0 | 220632 |
| SocketState | `lw` | 枚举/推断(high) | closed=2/connected=1/connecting=0 | 205466 |
| ShareState | `Uk` | 枚举/推断(high) | shared=2/sharing=1/notShared=0 | 188596 |
| FeatureFlag | `ju` | 枚举/推断(high) | 23 成员: ugc_delRecord/ugc_album/ugc_banLevel/noAntiAddiction/dailyChallenge_freeReward/dailyChallenge_freeSkip… | 113816 |
| DisconnectReason | `WC` | 枚举/推断(high) | disconnect_inObserveLevel=4/disconnect_afterPlayOutTween=3/disconnect_afterEnterRoom=2/timeout_connectRoom=1/none=0 | 201858 |
| Difficulty | `Ln` | 枚举/推断(high) | hard=3/medium=2/easy=1/none=0 | 51555 |

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