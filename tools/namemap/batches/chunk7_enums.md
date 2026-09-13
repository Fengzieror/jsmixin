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

# 枚举块（141 个 TS 枚举/常量对象，成员名全部明文）

- `m` @L9963 (3): center=2/right=1/left=0
- `k` @L9964 (3): center=2/bottom=1/top=0
- `K` @L26235 (4): closed=3/calling=2/connected=1/connecting=0
- `Q` @L26236 (3): Connecting=2/Timeout=1/OK=0
- `Z` @L26306 (5): ErrNoFriendQuota=1002/ErrInvalidParams=1001/Connecting=2/OverTime=1/Success=0
- `ht` @L27951 (4): privacy=3/tip=2/report=1/fix=0
- `kt` @L29728 (3): out=2/in=1/idle=0
- `bt` @L29994 (4): canbuy=3/unown=2/own=1/all=0
- `ee` @L35837 (2): Max=120002/NoSuitableAd=1002
- `ie` @L35838 (1): NoSuitableAd=20001
- `re` @L36377 (7): clanVip=6/regiestDays=5/character=4/playerLevel=3/follow=2/score=1/none=0
- `pe` @L36564 (3): navigateBack=2/navigateForward=1/normal=0
- `be` @L37285 (5): flydownWithNumber=4/flydown=3/quickFade=2/scaleOut=1/explodeOut=0
- `Ne` @L40008 (4): failed=3/success=2/start=1/none=0
- `je` @L40338 (2): noHp=1/quit=0
- `ti` @L41542 (1): Default=0
- `ji` @L47660 (4): reward=3/time=2/like=1/none=0
- `Yi` @L47816 (4): reversed=3/end=2/live=1/none=0
- `nn` @L49334 (7): shop=6/cumulativeMission=5/dailyMission=4/watchLiveReward=3/liveReward=2/channel=1/none=0
- `hn` @L49873 (2): cumulativeLive=1/dailyLive=0
- `cn` @L49874 (9): liveUgcPvp=8/liveUgc=7/liveAudience=6/livePvpTeam=5/liveOneHourDays=4/liveMaxLikes=3/livePvp=2/livePvpWin=1/liveTime=0
- `Sn` @L51298 (3): next=2/current=1/previous=0
- `$n` @L54741 (2): tmpl=1/text=0
- `to` @L54742 (1): newUGCLevel=0
- `eo` @L54743 (1): global=0
- `no` @L54852 (1): levelText=0
- `oo` @L54853 (7): ugcTextComment=6/ugcUpload=5/friendlyPvp=4/league=3/emoji=2/report=1/ugcComment=0
- `ao` @L54854 (6): ban=5/guest=4/createdDay=3/level=2/score=1/none=0
- `ro` @L54856 (4): friendlyFire=3/hang=2/unfriendly=1/negative=0
- `lo` @L54857 (5): badplay=4/goodplay=3/pvp_report=2/comment_report=1/pvp_disconnect=0
- `bo` @L56056 (3): history=2/intro=1/none=0
- `To` @L56432 (2): count=1/time=0
- `La` @L62935 (3): chat=2/home=1/none=0
- `Ga` @L64048 (3): locked=2/review=1/none=0
- `Ha` @L64049 (5): shortID=4/chat=3/intro=2/notice=1/name=0
- `bs` @L71861 (3): claimMax=2/draw=1/sync=0
- `xs` @L72024 (2): buyPass=1/fetch=0
- `Bs` @L73085 (4): rare=3/free=2/intro=1/none=0
- `Os` @L73867 (3): claimMax=2/fill=1/checkin=0
- `Us` @L74010 (4): checkin=3/bank=2/lottery=1/none=0
- `Ws` @L74927 (5): claimMax=4/buyLevel=3/claimReward=2/buyBattlePass=1/fetch=0
- `Zs` @L76169 (2): intro=1/name=0
- `vr` @L78755 (4): dead=3/quit=2/restart=1/win=0
- `Dr` @L84757 (3): reported=2/blocked=1/none=0
- `Rr` @L84758 (4): delete=3/sticky=2/ban=1/report=0
- `Ar` @L84759 (2): deleteandreport=1/delete=0
- `Or` @L84760 (4): deleteRecord=3/star=2/downWeight=1/banText=0
- `Fr` @L84761 (5): insane=4/hard=3/medium=2/easy=1/all=0
- `Ur` @L84762 (3): pvponly=2/all=1/latest=0
- `Vr` @L84763 (2): like=1/time=0
- `Gr` @L84765 (5): insane=4/hard=3/medium=2/easy=1/none=0
- `Hr` @L84766 (3): text=2/stamp=1/none=0
- `Wr` @L85000 (2): RespawnPoint=1/Bubble=0
- `Kr` @L85840 (2): tags=1/name=0
- `rl` @L87854 (3): empty=2/full=1/normal=0
- `pl` @L89427 (3): end=2/comment=1/total=0
- `Ml` @L92087 (3): select=2/challenge=1/none=0
- `Rl` @L92875 (4): difficultySelect=3/rewardClaim=2/challenge=1/none=0
- `Gl` @L94566 (3): friend=2/league=1/none=0
- `nh` @L97346 (2): image=1/word=0
- `Sh` @L98689 (4): coop=3/team=2/normal=1/none=0
- `zh` @L100658 (1): friend=0
- `fc` @L104941 (6): skinpack=5/clangem=4/gem_event=3/vip=2/newbie=1/gem=0
- `yc` @L105117 (5): end=4/full=3/playing=2/waiting=1/none=0
- `Ac` @L106793 (1): all=0
- `Fc` @L106867 (2): count=1/training_control=0
- `Vc` @L107199 (2): control=1/ui=0
- `Gc` @L107355 (8): printing=7/stamp=6/character=5/emoji=4/appearance=3/title=2/home=1/none=0
- `qc` @L108151 (6): skill=5/creative=4/event=3/friend=2/world=1/none=0
- `Yc` @L108152 (2): week=1/all=0
- `Wu` @L113817 (2): Full=1/Limited=0
- `td` @L114761 (3): leagueQuick=2/league=1/none=0
- `ed` @L114762 (3): weekend=2/workday=1/stop=0
- `dd` @L115819 (2): moreRounds=1/rotate=0
- `vd` @L116513 (2): rare=1/normal=0
- `sp` @L122321 (1): ShareVideoCount=1
- `cp` @L122463 (13): douyingrouproom=12/ugcalbum=11/claninvite=10/douyinmatch=9/qqmatchmaking=8/ugcreplay=7/teammatch=6/ugc=5/debris=4/replay=3/match=2/bank=1/none=0
- `xp` @L125925 (1): reversed=16
- `Ip` @L125926 (5): celebrate=4/dead=3/springjump=2/walljump=1/normal=0
- `Tp` @L125927 (4): celebrating=3/dead=2/idle=1/none=0
- `c_` @L128505 (4): football=3/coin=2/setup=1/reachToFlag=0
- `k_` @L130114 (2): touch=1/button=0
- `z_` @L133148 (6): revive=5/deadghost=4/edit=3/hide=2/disabled=1/run=0
- `Z_` @L134541 (2): match=1/default=0
- `$_` @L134542 (4): sound=3/headicon=2/effects=1/avatar=0
- `cf` @L135139 (10): balloon=20/characterwander=19/charactermover=18/footballgoal=17/ice=16/repeatmove=15/levelcomponentcontext=14/playercontext=13/collision=12/trigger=11
- `pf` @L135513 (5): skin=5/decoration=4/special=3/hazards=2/platform=1
- `Mf` @L136227 (3): noDynamic=2/noKillable=1/normal=0
- `sv` @L141930 (8): purple=7/yellow=6/coffee=5/count=4/orange=3/blue=2/white=1/black=0
- `gy` @L155859 (10): count=9/black=8/purple=7/coffee=6/blue=5/green=4/yellow=3/orange=2/red=1/silver=0
- `my` @L155860 (2): none=1/full=0
- `Qy` @L163352 (2): swing=1/spin=0
- `ig` @L164781 (7): count=6/wall_jump=5/jump_practice=4/long_jump_hint=3/jump_hint=2/clear_hud=1/input_tutorial=0
- `og` @L165370 (3): count=2/lantern=1/pumpkin=0
- `lg` @L166318 (5): count=4/lantern=3/gem=2/score=1/pumpkin=0
- `ug` @L167046 (3): system=2/locked=1/none=0
- `pm` @L172992 (4): red=3/orange=2/yellow=1/blue=0
- `mm` @L173561 (3): large=2/middle=1/small=0
- `Cm` @L173717 (3): count=2/rightToLeft=1/leftToRight=0
- `wm` @L173718 (4): count=3/fast=2/medium=1/slow=0
- `jm` @L176862 (1): skin=0
- `Wm` @L176863 (1): effects=0
- `Qm` @L178540 (1): region=0
- `nk` @L179186 (9): football=8/ugcmultiplayer=7/ugcchallenge=6/matchreplay=5/matchaibattle=4/tutorialmatch=3/match=2/free=1/none=0
- `rk` @L179975 (5): fail=4/success=3/jumping=2/walkToJumpPoint=1/none=0
- `uk` @L181195 (5): undoDelete=4/undoAdd=3/delete=2/addFromCache=1/none=0
- `Jk` @L190739 (4): right=3/left=2/down=1/up=0
- `nC` @L191344 (6): ban=5/notSupportRespawnPoint=4/notForPvp=3/blocked=2/playerLevel=1/none=0
- `oC` @L191345 (7): cache=5/decoration=4/special=3/hazards=2/platform=1/common=0/none=-1
- `dC` @L193419 (8): buy=7/vip=6/live=5/encourage=4/share=3/videoShare=2/video=1/none=0
- `fC` @L194452 (4): football=3/score=2/treasurechest=1/none=0
- `bC` @L196749 (6): double=5/great=4/gameEnd=3/warning=2/battleStart=1/timeEnd=0
- `SC` @L196750 (2): fadeIn=1/scaleIn=0
- `TC` @L197193 (3): pvp=2/single=1/none=0
- `NC` @L201853 (5): zplatform=4/pushable=3/canHide=2/door=1/static=0
- `GC` @L201854 (23): topbar=22/hpcountdown=21/ugcpvpend=20/ugcpvp=19/ugclevelsetting=18/pause=17/ugcrecordend=16/dailychallengeend=15/tutorialend=14/ugcend=13/ugcchallenge=12/ugcedit=11/friendlymatchreward=10/replayrank=9/replay=8/select=7/danup=6/rank=5/lose=4/win=3/componentslist=2/grid=1/game=0
- `HC` @L201855 (1): game=0
- `zC` @L201856 (18): audio=17/dynamicBounds=16/rpc=15/levelNetwork=14/playNetwork=13/matchplay=12/matchprep=11/ghostrecord=10/video=9/path=8/camera=7/drag=6/editNetwork=5/editAI=4/editTouch=3/players=2/level=1/game=0
- `jC` @L201857 (8): revive=7/standby=6/end=5/edit=4/play=3/observelevel=2/observeplayer=1/init=0
- `pw` @L205824 (5): cheat=4/matchFull=3/matchNotExist=2/matchOverTime=1/none=0
- `yw` @L206076 (2): team=1/none=0
- `gw` @L206077 (5): football=4/coop=3/card=2/creative=1/party=0
- `kw` @L206079 (5): fakeRoom=4/battleAITraining=3/tutorial=2/friendly=1/normal=0
- `xw` @L207392 (4): matchMode=3/teamMode=2/roomType=1/map=0
- `Tw` @L208037 (9): end=8/assets=7/friend=6/ugcChallenge=5/ugcCreate=4/intimacy=3/total=2/cover=1/none=0
- `Dw` @L210140 (5): taptap=4/apple=3/tel=2/nativewechat=1/none=0
- `Ww` @L211793 (1): length=0
- `Yw` @L212146 (3): fail=2/deny=1/ok=0
- `Zw` @L212485 (4): http=3/item=2/default=1/none=0
- `db` @L215258 (5): relation=4/badge=3/pvp=2/level=1/none=0
- `fb` @L215947 (4): hazard=3/zero=2/first=1/reachflag=0
- `gb` @L216160 (5): pvp=4/training=3/newbie=2/dailychallenge=1/none=0
- `mb` @L216161 (2): normal=1/newbie=0
- `$b` @L223855 (4): darkblue=3/red=2/yellow=1/blue=0
- `iS` @L224159 (6): redeem=5/live=4/connect=3/system=2/update=1/none=0
- `hS` @L225770 (4): currency=3/title=2/back=1/home=0
- `pS` @L226382 (5): feedback=4/contact=3/record=2/gameclub=1/auth=0
- `kS` @L227522 (9): toppvp=8/training=7/tutorialLose=6/tutorialWin=5/friendlyMatch=4/clanChat=3/leagueHome=2/league=1/none=0
- `MS` @L228865 (18): douyinGroupRoom=17/createOnChat=16/clanchatlist=15/createOnMatchFull=14/createOnMatchStart=13/createOnMatchEnd=12/create=11/list=10/random=9/friend=8/rematch=7/outpush=6/push=5/search=4/invitation=3/im=2/shareCard=1/normal=0
- `PS` @L229694 (38): relation=37/gift=36/currency=35/mission=34/vip=33/gamelive=32/badge=31/douyinvideo=30/training=29/decal=28/honesty=27/chat=26/inventory=25/shop=24/dailychallenge=23/characterskin=22/pack=21/mail=20/userlevel=19/userdaily=18/event=17/clan=16/border=15/ugcalbum=14/ugc=13/matchhistory=12/emoji=11/friend=10/lobby=9/recharge=8/title=7/bank=6/social=5/league=4/character=3/matchroom=2/matchmaking=1/profi
- `BS` @L229695 (51): relation=50/gift=49/mission=48/vip=47/gamelive=46/roomlist=45/volpchat=44/query=43/badge=42/douyinvideo=41/training=40/honesty=39/chat=38/inventory=37/shop=36/dailychallenge=35/characterskin=34/pack=33/userlevel=32/mail=31/userdaily=30/event=29/clan=28/border=27/ugcalbum=26/ugc=25/matchhistory=24/emoji=23/friend=22/videorecord=21/lobby=20/userdetail=19/recharge=18/title=17/tutorial=16/reddot=15/ba