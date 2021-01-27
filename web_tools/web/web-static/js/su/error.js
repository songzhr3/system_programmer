var ERR_CODE = "error_code";			/* 定义错误码名称 */
var ERR_PERCENT = -1;					/* 进度错误的定义 */
var ENONE = 0;							/* 没有错误 */

/* ---------------------------------- 系统通用错误 ----------------------------------- */
var ESYSTEM = -40101;					/* 系统错误。 */
var EEXPT = -40102;						/* 异常情况 */
var ENOMEMORY = -40103;					/* 内存不足 */
var EINVEVT = -40104;					/* 不支持的事件 */
var ECODE = -40105;						/* 不支持的操作类型； */
var EINVINSTRUCT = -40106;				/* 不支持的指令 */
var EFORBID = -40107;					/* 禁止的操作。 */
var ENOECHO = -40108;					/* 超时无响应。 */
var ESYSBUSY = -40109;					/* 系统繁忙。 */
var ENODEVICE = -40110;					/* 找不到设备。 */

/* ---------------------------------- 数据通用错误 ----------------------------------- */
var EOVERFLOW = -40201;					/* 数据溢出。 */
var ETOOLONG = -40202;					/* 数据过长。 */
var EENTRYEXIST = -40203;				/* 条目已存在。 */
var EREFERED = -40204;					/* 条目被关联了 */
var EENTRYNOTEXIST = -40205;			/* 条目不存在。 */
var EENTRYCONFLIC = -40206;				/* 条目冲突。 */
var ETABLEFULL = -40207;				/* 表满。 */
var ETABLEEMPTY = -40208;				/* 空表。 */
var EINVARG = -40209;					/* 参数错误 */
var EINVFMT = -40210;					/* 格式错误 */
var ELACKARG    = -40211;				/* 缺少必要参数 */
var EINVBOOL = -40212;					/* 布尔类型的取值只能是0或者1 */
var ESTRINGLEN = -40213;				/* 字符串长度非法 */

/* --------------------------------- 网络参数通用错误 --------------------------------- */
var EINVIP = -40301;					/* IP地址不正确。 */
var EINVGROUPIP = -40302;				/* 组播的IP地址 */
var EINVIPFMT = -40303;					/* IP地址格式错误 */
var EINVLOOPIP = -40304;				/* 回环的IP地址 */
var EINVMASK = -40305;					/* 掩码不正确。 */
var EINVGTW = -40306;					/* 网关不正确。 */
var EGTWUNREACH = -40307;				/* 网关不可达。 */
var ECOMFLICTNET = -40308;				/* 网段冲突*/
var EINVNET = -40309;					/* 非法的网段 */
var EINVMACFMT = -40310;				/* MAC地址格式不正确。 */
var EINVMACGROUP = -40311;				/* MAC地址为组播地址 */
var EINVMACZERO = -40312;				/* MAC地址全零 */
var EINVMACBROAD = -40313;				/* 广播地址的MAC地址 */
var EINVNETID = -40314;					/* 网络号全0或者1 */
var EINVHOSTID = -40315;				/* 主机号全0或者1 */
var EINDOMAIN = -40316;					/* 非法的域名 */
var EINVIPMASKPAIR = -40317;				/* IP和掩码不匹配 */
var EMACEMPTY = -40318;					/* MAC地址为空 */
var ECONFLICTFDNS = -40319;				/* 首选DNS与LAN口网段冲突 */
var ECONFLICTSDNS = -40320;				/* 备选DNS与LAN口网段冲突 */
var ECONFLICTGATEWAY = -40321;				/* WAN口网关与LAN口网段冲突 */

/* --------------------------------- 认证通用错误 -------------------------------------- */
var EUNAUTH = -40401;					/* 认证失败。 */
var ECODEUNAUTH = -40402;				/* 验证码认证失败 */
var ESESSIONTIMEOUT = -40403;			/* session超时 */
var ESYSLOCKED = -40404;				/* 客户端被锁定。 */
var ESYSRESET = -40405;					/* 恢复出厂设置。 */
var ESYSCLIENTFULL = -40406;			/* 认证失败，超出支持的客户端数量 */
var ESYSCLIENTNORMAL = -40407;			/* 其它情况，一般是首次登录。 */
var ESYSLOCKEDFOREVER = -40408;			/* 系统被锁定 */
var EUSER_NOT_EXIST = -40410;			/* 用户未注册 */

/* --------------------------------- 模块network错误 ------------------------------------ */
var EINVMTU = -50101;				/* MTU错误 */
var EINVFDNSVR = -50102;			/* 非法的首选DNS */
var EINVSDNSVR = -50103;			/* 非法的备选DNS */
var EDNSMODE = -50104;				/* DNS模式非法 */
var ENOLINK = -50105; 				/* WAN口未连接 */
var ENETMASKNOTMATCH = -50106;        		/* 网络号与掩码不匹配 */
var ENETLANSAME = -50107;             		/* 网络号处于LAN口IP网段 */
var ENETWANSAME = -50108;            		/* 网络号处于WAN口IP网段 */
var EWANSPEED = -50109;				/* WAN口速率非法 */
var EISPMODE = -50110;				/* ISP模式值非法 */
var EDIAGMODE = -50111;				/* 拨号模式值非法 */
var ECONNECTMODE = -50112;			/* 连接模式值非法 */
var ELANIPMODE = -50113;			/* LAN口IP模式值非法 */
var EHOSTNAME = -50114;				/* 主机名非法 */
var EPPPOEUSER = -50115;			/* 宽带帐号长度非法 */
var EPPPOEPWD = -50116;				/* 宽带密码长度非法 */
var EINVTIME = -50117;				/* 自动断线等待时间非法 */
var EPPPOEAC = -50118;				/* PPPoE服务名器名非法 */
var EPPPOESVR = -50119;				/* PPPoE服务名名非法 */
var EINVPTC = -50120;				/* 不支持的协议类型。 */
var EWANTYPE = -50121;				/* 不支持的WAN口接入类型。*/
var EMACCLONECONFLICT = -50122;				/* MAC地址克隆冲突 */
var EMANUALLANMODE = -50123;		/* WDS开启时，禁止将Lan口模式设置为手动 */

/* --------------------------------- 模块wireless错误 ------------------------------------ */
var EWLANPWDBLANK = -50201;				/* 无线密码为空 */
var EINVSSIDLEN = -50202;				/* 无线SSID长度不合法 */
var EINVSECAUTH = -50203;				/* 无线安全设置的认证类型错误 */
var EINVWEPAUTH = -50204;				/* WEP认证类型错误 */
var EINVRADIUSAUTH = -50205;				/* RADIUS认证类型错误 */
var EINVPSKAUTH = -50206;				/* PSK认证类型错误 */
var EINVCIPHER = -50207;				/* 加密算法错误 */
var EINVRADIUSLEN = -50208;				/* radius密钥短语长度错误 */
var EINVPSKLEN = -50209;				/* psk密钥短语错误 */
var EINVGKUPINTVAL = -50210;				/* 组密钥更新周期错误 */
var EINVWEPKEYTYPE = -50211;				/* WEP密钥类型错误 */
var EINVWEPKEYIDX = -50212;				/* 默认WEP密钥索引错误 */
var EINVWEPKEYLEN = -50213;				/* WEP密钥长度错误 */
var EINVACLDESCLEN = -50214;				/* MAC地址过滤条目描述信息长度错误 */
var EINVWPSPINLEN = -50215;				/* WPS PIN码长度错误 */
var EINVAPMODE = -50216;				/* 无线设备工作模式错误 */
var EINVWLSMODE = -50217;				/* 无线速率模式(bgn)错误 */
var EINVREGIONIDX = -50218;				/* 无线国家码错误 */
var EINVCHANWIDTH = -50219;				/* 频段带宽错误 */
var EINVRTSTHRSHLD = -50220;				/* 无线RTS阈值错误 */
var EINVFRAGTHRSHLD = -50221;				/* 无线分片阈值错误 */
var EINVBCNINTVL = -50222;				/* 无线beacon间隔错误 */
var EINVTXPWR = -50223;					/* 无线Tx功率错误 */
var EINVDTIMINTVL = -50224;				/* 无线DTIM周期错误 */
var EINVWLANPWD = -50225;				/* 无线密码错误 */
var ESSIDBROAD = -50226;              			/* 广播配置错误 */
var EAPISOLATE = -50227;             			/* AP隔离配置错误 */
var EWIFISWITCH = -50228;             			/* 无线开启关闭配置错误 */
var EMODEBANDWIDTHNOTMATCH = -50229; 			/* 无线模式与带宽不匹配 */
var EINVCHANNEL2G = -50230;          			/* 2g信道不合法 */
var EINVCHANNEL5G = -50231;           			/* 5g信道不合法 */
var EPSKNOTHEX = -50232;         			/* 64位加密包含非十六进制字符 */
var EINVWDSAUTH = -50233;				/* 无线WDS认证类型错误 */
var EINVA34DETECT = -50234;				/* 3/4地址格式配置错误 */
var EINVTURBO = -50235;					/* turbon on配置错误 */
var EINVSECCHECK = -50236;				/* 防蹭网配置错误 */
var EINVSSIDEMPTY = -50237;				/* SSID为空 */
var EINVCHNAMODEBAND = -50238;				/* WDS开启时，信道、模式和带宽均不可配 */
var EINVSSIDBLANK = -50239;				/* SSID全为空格 */

/* --------------------------------- 模块dhcp错误 ------------------------------------ */
var EINVLEASETIME = -50301;				/* 非法的地址租期。 */
var EINVSTARTADDRPOOL = -50302;				/* 地址池开始地址非法 */
var EINVENDADDRPOOL = -50303;				/* 地址池结束地址非法 */
var EDHCPDGTW = -50304;					/* 网关非法 */
var EGTWNOTLANSUBNET = -50305;				/* 网关不在LAN网段 */
var EDHCPDPRIDNS = -50306;				/* 首选DNS服务器地址非法 */
var EDHCPDSNDDNS = -50307;				/* 备用DNS服务器地址非法 */
var EDHCPDAUTO   = -50308;				/* 自动格式非法 */

/* --------------------------------- 模块firewall错误 -------------------------------- */
var EHOSTNAMEEMP = -50401;				/* 受控主机名为空 */
var EOBJNAMEEMP = -50402;				/* 访问目标名为空 */
var EPLANNAMEEMP = -50403;				/* 日程计划名为空 */
var ERULENAMEEMP = -50404;				/* 规则描述名为空 */
var EOBJDOMAINALLEMP = -50405;			/* 访问目标域名全为空 */
var EHOSTALLEMPTY = -50406;				/* 受控主机IP全为空 */
var EOBJALLEMPTY = -50407;				/* 访问目标IP和端口全为空 */
var ENOTLANSUBNET = -50408;				/* IP地址必须是LAN网段IP */
var ELANSUBNET = -50409;				/* IP地址不能为LAN网段IP */
var ELANIPCONFLIC = -50410;				/* IP地址不能为LAN口IP */
var EILLEGALPORT = -50411;				/* 端口值非法 */
var EPORTRESERVED = -50412;				/* 端口冲突*/
var EINVPORT = -50413;					/* 超出端口范围*/
var EINVPORTFMT = -50414;				/* 端口格式错误 */

/* --------------------------------- 模块nas错误 ------------------------------------ */
var EINVNASUSER = -50501;				/* 用户名非法 */
var EINVNASUSERLEN = -50502;				/* 用户名长度非法 */
var EINVNASPWD = -50503;				/* 密码非法 */
var EINVNASPWDLEN = -50504;				/* 密码长度非法 */
var EDELADMIN = -50505;					/* admin帐户不能删除 */
var EEDITADMIN = -50506;				/* admin帐户名不能修改 */
var EINVPATHNULL = -50507;				/* 文件夹路径为空 */
var EINVPATH = -50508;					/* 文件夹路径格式非法 */
var EINVPATHLEN = -50509;				/* 文件夹路径长度非法 */
var EPATHCONFLICT = -50510;				/* 文件夹路径冲突 */

/* --------------------------------- 模块samba错误 ---------------------------------- */


/* --------------------------------- 模块media_server错误 ---------------------------- */
var ESCANVAL = -50701;					/* 自动扫描时间非法 */
var EMSNAMENULL = -50702;				/* 媒体服务器共享名称为空 */
var EMSNAME = -50703;					/* 媒体服务器共享名称非法 */
var EMSNAMELEN = -50704;				/* 媒体服务器共享名称长度非法 */
var EMSNAMECONFLICT = -50705;				/* 媒体服务器共享名称冲突 */

/* --------------------------------- 模块ddns错误 ------------------------------------ */
var ENAMEBLANK = -50801;			/* 用户名输入为空 */
var EINVNAME = -50802;				/* 用户名非法 */
var EINVNAMELEN = -50803;			/* 用户名长度超出范围 */
var EDDNSPWDLEN = -50804;			/* 密码长度非法 */
var EDDNSPWD = -50805;				/* 密码还有非法字符 */
var EDDNSPWDBLANK = -50806;			/* 密码为空 */

/* --------------------------------- 模块system错误 ---------------------------------- */
var EINVDATE = -50901;					/* 日期输入错误 */
var EINVTIMEZONE = -50902;			    /* 时区输入错误 */
var EFWERRNONE = -50903;                /* 固件无错误，升级模块base code */
var EFWEXCEPTION = -50904;            /* 固件升级出现异常 */
var EFWRSAFAIL = -50905;              /* 固件RSA签名错误 */
var EFWHWIDNOTMATCH = -50906;         /* 固件不支持该类型硬件升级 */
var EFWZONECODENOTMATCH = -50907;     /* 固件区域码不匹配 */
var EFWVENDORIDNOTMATCH = -50908;     /* 固件品牌不匹配 */
var EFWNOTINFLANDBL = -50909;         /* 固件不在升级列表之内 */
var EFWNEWEST = -50910;               /* 固件内容与现有相同 */
var EFWNOTSUPPORTED = -50911;         /* 固件类型不支持升级 */
var EMD5 = -50914;						/* MD5校验失败 */
var EDESENCODE = -50915;				/* DES加密失败 */
var EDESDECODE = -50916;				/* DES解密失败 */
var ECHIPID = -50917;					/* 不支持的芯片类型； */
var EFLASHID = -50918;					/* 不支持的FLASH类型； */
var EPRODID = -50919;					/* 不支持的产品型号； */
var ELANGID = -50920;					/* 不支持的语言； */
var ESUBVER = -50921;					/* 不支持子版本号； */
var EOEMID = -50922;					/* 不支持的OEM类型； */
var ECOUNTRYID = -50923;				/* 不支持的国家； */
var EFILETOOBIG = -50924;      	    	/* 上传文件过大 */
var EPWDERROR = -50925;               	/* 登录密码错误 */
var EPWDBLANK = -50926;					/* 密码输入为空 */
var EINVPWDLEN = -50927;				/* 密码长度超出范围 */
var EINVKEY = -50928;					/* 旧密码错误 */
var EINVLGPWDLEN = -50929;				/* 登录密码长度不合法 */
var EINLGVALCHAR = -50930;				/* 登录密码含有非法字符 */
var EINLGVALOLDSAME = -50931;			/* 新登录密码和旧登录密码一样 */
var EHASINITPWD = -50932;              	/* 已设置过初始密码，不能重复设置 */
var ECHPWDDIF = -50933;              	/* 原密码和确认密码不一至 */

/* --------------------------------- 模块FTP错误 ------------------------------------ */
var EFTPNAMENULL = -51001;				/* FTP文件夹名称为空 */
var EFTPNAME = -51002;					/* FTP文件夹名称非法 */
var EFTPNAMELEN = -51003;				/* FTP文件夹名称长度非法 */
var EFTPNAMECONFLICT = -51004;			        /* FTP文名称冲突 */
var EFTPNAMEINVCHR = -51005;				/* 名称中含有非法字符 */
var EFTPNAMEINVSTARTENDCHR = -51006;			/* 名称的起始或结束字符非法 */

/* --------------------------------- 模块app错误 --------------------------------------- */
var EAPPNONE = -51101;					/* 安装应用不存在 */
var EAPPHAS = -51102;					/* 应用程序已安装 */
var EAPPNOT = -51103;					/* 应用程序未安装 */
var EINSFAIL = -51104;					/* 应用程序安装失败 */
var EUNINSFAIL = -51105;				/* 应用程序卸载失败 */

/* --------------------------------- 模块cloud错误 ------------------------------------- */
var EINVMAILFMT = -50201;       			/* 邮箱格式不正确 */
var EINVMAILLEN = -50202;        			/* 邮箱长度不正确 */
var EINVMAILPWDLEN = -50203;      			/* 邮箱密码长度不正确 */
var EINVCLIENTINTERNAL = -51204;			/* 云客户端内部错误 */
var EINVREQUESTIDNOTFOUND = -51205;			/* 请求字段中无ID */
var EINVMETHODNOTFOUND = -51206;			/* 请求方法不存在 */
var EINVPARAMETER = -51207;					/* 请求参数非法 */
var EINVGETDATAFAILED = -51208;				/* 获取数据失败 */
var EINVURLINVALID = -51209;				/* URL无效 */
var EINVPASSWORDFMT = -51210;				/* 无效密码 */
var EINVDOWNLOADFWFAILED = -51211;			/* 固件下载失败 */
var EINVUPGRADEFWFAILED = -51212;			/* 固件升级失败 */
var EINVCONFIGURATEFAILED = -51213;			/* 配置失败 */
var EINVPERMISSIONDENIED = -51214;			/* 权限不足 */
var EINVREQUESTTIMEOUT = -51215;			/* 请求超时 */
var EINVMEMORYOUT = -51216;					/* 存储空间不足 */
var EINVSENDREQMSGFAILED = -51217;			/* 发送请求失败 */
var EINVCONNECTTINGCLOUDSERVER = -51218;	/* 正在连接云路由服务器 */
var EINVLASTOPTIONISNOTFINISHED = -51219;	/* 上个动作执行中 */
var EINVCLOUDUSRCOUNTFORMAT = -51220;		/* 账户格式错误 */
var EINVVERICODEFORMAT = -51221;			/* 验证码格式错误 */
var EINVNEWPASSWORD = -51222;				/* 无效新密码 */
var EINVCLOUDACCOUNT = -51223;				/* 账户名错误 */
var EINDEVICEIDERROR = -51224;				/* 设备ID错误 */
var EINDEVICENOTBIND = -51225;				/* 未绑定TP-LINK云帐号，无法安装应用*/
var EINACCOUNTEMPTY = -51226;				/* 账号为空*/
var EINPASSWORDEMPTY = -51227;			 	/* 密码为空*/
var EINVERICODEEMPTY = -51228; 				/* 验证码为空*/
var EINVILLEGALDEVICE = -51229;				/* 非法设备 */
var EINDEVICEALREADYBOUND = -51230; 		/*设备已经被绑定*/
var EINDEVICEALREADYUNBOUND = -51231; 		/*设备已经被解除绑定*/
var ECLOUDTIMEOUT = -51237; 		        /*云端同步超时*/
var ECLOUDCLIENTUNINIT = -51238;	        /* 系统程序出错*/
var EPLUGINIDNOTFOUND = -51239; 		    /*没有新版本*/
var ESETAUTODOWNLOADERROR = -51240; 		/*设置自动下载失败*/
var ENO_LAST_VERSION = -51242               /*没有上一个版本*/
var EINVCLOUDCLIENTGENERIC = -90000;					/* 未知的错误，云客户端通用错误 */
var EINVCLOUDCLIENTPARSEDNSREQUEST = -90100;			/* DNS请求解析失败 */
var EINVCLOUDCLIENTESTABLISHTCP = -90101;				/* TCP无法建立 */
var EINVCLOUDCLIENTSSLSIGNERROR = -90102;				/* SSL无法建立--签名错误 */
var EINVCLOUDCLIENTSSLDOMAINERROR = -90103;				/* SSL无法建立--域名错误 */
var EINVCLOUDCLIENTSSLTIMEERROR = -90104;				/* SSL无法建立--时间错误 */
var EINVCLOUDCLIENTSSLENCRYPTIONNOTMATCH = -90105;		/* SSL无法建立--加密不匹配 */
var EINVCLOUDCLIENTDEVICEILLEGAL = -90106;				/* 设备合法性认证失败 */
var EINVCLOUDCLIENTHEARTREQUESTTIMEOUT = -90200;		/* 心跳请求超时 */
var EINVCLOUDCLIENTSTOPCONNECT = -90201;				/* 接收到stopconnect */
var EINVCLOUDCLIENTWANIPCHANGE = -90202;				/* WAN IP变动 */
var EINVCLOUDCLIENTDISCONNECTFIN = -90203;				/* 前端主动断开连接：FIN */
var EINVCLOUDCLIENTDISCONNECTRST = -90204;				/* 前端主动断开连接：RST */
var EINVCLOUDCLIENTDISCONNECT = -90205;					/* 前端主动断开连接：不区分FIN or RST */
var EINVCLOUDCLIENTDISCONNECTSOCKETERRNUM = -90206;		/* 前端主动断开连接：不区分FIN or RST，但能返回socket error number */
var EINVCLOUDCLIENTWANPHYPORTLINKDOWN = -90207;			/* WAN口的物理端口link down */
var EINVCLOUDCLIENTHELLOCLOUD = -90300;					/* hello cloud */
var EINVCLOUDCLIENTPUSHPLUGININFO = -90301;				/* pushPluginInfo */
var EINVCLOUDCLIENTGETFWLIST = -90302;					/* getFwList */
var EINVCLOUDCLIENTGETINITFWLIST = -90303;				/* getInitFwList */
var EINVCLOUDCLIENTDOWNLOADPARSEDNSREQUEST = -90400;	/* 下载：DNS请求解析失败 */
var EINVCLOUDCLIENTDOWNLOADESTABLISHTCP = -90401;		/* 下载：TCP无法建立 */
var EINVCLOUDCLIENTDOWNLOADHTTPNOTOK = -90402;			/* 下载：http非200错误码 */
var EINVCLOUDCLIENTDOWNLOADTIMEOUT = -90403;			/* 下载：网络环境差导致超时 */

/* --------------------------------- cloud server 错误 ------------------------------------- */
var EINVCLOUDERRORGENERIC = -10000;						/* 未知的错误，通用的错误 */
var EINVCLOUDERRORPARSEJSON = -10100;					/* JSON 消息体格式错误 */
var EINVCLOUDERRORPARSEJSONNULL = -10101;				/* JSON 消息体为空 */
var EINVCLOUDERRORSERVERINTERNALERROR = -20000;			/* 服务器内部错误 */
var EINVERRORPERMISSIONDENIED = -20001;					/* 权限不够，需要登录才能访问 */
var EINVCLOUDERRORPERMISSIONDENIED = -20002;			/* 请求超时 */
var EINVCLOUDERRORSERVERBUSY = -20003;					/* 云端繁忙 */
var EINVCLOUDERRORPARSEJSONID = -20100;					/* JSON ID解析错误 */
var EINVCLOUDERRORMETHODNOTFOUND = -20103;				/* 请求指令未带方法或者方法未定义 */
var EINVCLOUDERRORPARAMSNOTFOUND = -20104;				/* 该方法内参数名不存在 */
var EINVCLOUDERRORPARAMSWRONGTYPE = -20105;				/* 该方法内参数类型与值不符 */
var EINVCLOUDERRORPARAMSWRONGRANGE = -20106;			/* 该方法内参数值超出范围 */
var EINVCLOUDERRORINVALIDPARAMS = -20107;				/* 非法参数 */
var EINVACCOUNTEMAILFMT = -20200;						/* 邮箱地址格式错误 */		/****/
var EINVACCOUNTPHONENUMFMT = -20201;					/* 手机号码格式错误 */		/****/
var EINVERRORDEVICEIDFORMATERROR = -20500;				/* Device ID格式错误 */
var EINVDEVICEIDNOTEXIST = -20501;						/* device ID 不存在 */		/****/
var EINVCLOUDERRORBINDDEVICEERROR =  -20502;			/* 绑定设备出错,发送未知错误 */
var EINVCLOUDERRORUNBINDDEVICEERROR = -20503;			/* 解除绑设备出错,发送未知错误*/
var EINVCLOUDERRORHWIDNOTFOUND = -20504;				/* 硬件ID不存在 */
var EINVNOTFOUNTNEWFW = -20505;							/* 未检测到新版软件 */		/****/
var EINVACCOUNTBINDED = -20506;							/* 该设备已经被绑定给其他账户 */		/****/
var EINVACCOUNTUNBINDED = -20507;						/* 该设备已经被APP端或者云端解除绑定（用于设备启动后的登录过程） */		/****/
var EINVCLOUDERRORDEVICEOFFLINE = -20571;				/* 设备离线 */
var EINVCLOUDERRORDEVICEALIASFORMATERROR = -20572;		/* 设备别名格式错误，包括长度不符合要求 */
var EINVACCOUNTNOTEXIST = -20600;						/* 云帐号不存在 */		/****/
var EINVACCOUNTPWDERR = -20601;							/* 账户名与密码不匹配，即密码错误 */		/****/
var EINVACCOUNTREGISTED = -20603;						/* 帐号已被注册 */		/****/
var EINVCLOUDERRORACCOUNTUSERNAMEFORMATERROR = -20604;	/* 账户名错误，既不是邮箱也不是手机号码 */
var EINVCLOUDERRORACCOUNTACTIVEMAILSENDFAIL = -20606;	/* 发送激活邮件失败 */
var EINVACCOUNTRESETPWDCAPTCHAERR = -20607;				/* 找回云帐号密码的验证码验证失败 */		/****/
var EINVACCOUNTLENGTH = -20608;							/* 账号长度不符合要求 */		/****/
var EINVCLOUDERRORRESETMAILSENDFAIL = -20609;			/* 发送重设账户信息邮件失败 */
var EINVACCOUNTTYPEERR = -20610;						/* 云帐号类型错误 */		/****/
var EINVACCOUNTPWDFMT = -20615 ;						/* 密码格式错误 */		/****/
var EINVACCOUNTNEWPWDERR = -20616;						/* 新密码格式错误，包括长度不符合要求 */		/****/
var EINVCLOUDERRORTOKENEXPRIED = -20651;				/* Token过期 */
var EINVCLOUDERRORTOKENINCORRECT = -20652;				/* Token错误 */
var EINVACCOUNTLOCKED = -20661;							/* 云服务器锁定该TP-LINK ID 2小时 */		/****/
var EINVDEVICELOCKED = -20662;							/* 设备被锁定，24小时内不能再获取验证码 */		/****/
var EINVCLOUDERRORACCOUNTACTIVEFAIL = -20671;			/* 验证账户失败，发生未知错误 */
var EINVCLOUDERRORACCOUNTACTIVETIMEOUT = -20672;		/* 验证账户失败，验证链接失效 */
var EINVCLOUDERRORRESETPWDTIMEOUT = -20673;				/* 重设密码链接失效 */
var EINVCLOUDERRORRESETPWDFAIL = -20674;				/* 重设密码失败，发生未知错误 */
var EINVCLOUDERRORCAPTCHAINVAL = -20676;				/* 验证码验证三次失败，则验证码失效 */
var EINVCLOUDERRORFWIDNOTSUPPORTDEVICE = -20703;		/* Device ID与fwId不匹配 */

/* --------------------------------- 模块guest_network错误 ----------------------------- */
var EINVSPEEDCFG = -51301;				/* 最大上传速度或最大下载速度配置错误 */
var EINVTIMEOUTCFG = -51302;				/* 超时配置错误 */
var EINVLIMITTYPE = -51303;				/* 开放时间类型非法 */
var EINVMON = -51304;					/* 周期的开放时间，周一时间非法 */
var EINVTUE = -51305;					/* 周期的开放时间，周二时间非法 */
var EINVWED = -51306;					/* 周期的开放时间，周三时间非法 */
var EINVTHU = -51307;					/* 周期的开放时间，周四时间非法 */
var EINVFRI = -51308;					/* 周期的开放时间，周五时间非法 */
var EINVSAT = -51309;					/* 周期的开放时间，周六时间非法 */
var EINVSUN = -51310;					/* 周期的开放时间，周日时间非法 */
var EINVPERIODBLANK = -51311;    			/* 定时时间限制时间段描述为空 */
var EINVPERIODTOOLONG = -51312;    			/* 定时时间限制时间段描述太长 */
var EINVBEGINTIME = -51313;       			/* 定时时间限制开始时间非法 */
var EINVENDTIME = -51314;        			/* 定时时间限制结束时间非法 */
var EINVBEGINENDTIME = -51315;    			/* 定时时间限制开始时间不早于结束时间 */
var EINVREPEATBLANK = -51316;        			/* 定时时间限制重复周期为空 */
var EINVLIMITTIMEREPEAT = -51317;    			/* 定时时间限制重复周期非法 */

/* --------------------------------- 模块ip_mac_bind错误 -------------------------------- */
var ENOTLANWANNET = -51401;			/* 网段不是LAN或WAN */
var EBINDIPUSED = -51402;			/* 要绑定的IP已经被占用 */


/* --------------------------------- 模块hosts_info错误 ----------------------------- */
var ETIMEPERIODBLANK = -51501;      /* 上网时间限制时间段描述为空 */
var ETIMEPERIODTOOLONG = -51502;    /* 上网时间限制时间段描述太长 */
var EINVTLBEGINTIME = -51503;       /* 上网时间限制开始时间非法 */
var EINVTLEENDTIME = -51504;        /* 上网时间限制结束时间非法 */
var EINVTLBEGINENDTIME = -51505;    /* 上网时间限制开始时间不早于结束时间 */
var ETLREPEATBLANK = -51506;        /* 上网时间限制重复周期为空 */
var ELIMITTIMEREPEAT = -51507; 		/* 上网时间限制时间重复 */


/* --------------------------------- 模块av_profile错误 ----------------------------- */
var EIDNOTEXIST = -54921            /* 该病毒id不存在 */

/* --------------------------------- 模块keepalived错误 ----------------------------- */
var EKEEPALIVED_NAME_CONFLICT = -56800               //keepalived规则名冲突
var EKEEPALIVED_VIP_CONFLICT_MASK = -56801           //keepalived虚拟IP地址与接口子网掩码冲突
var EKEEPALIVED_VIP_CONFLICT_LAN = -56802            //keepalived虚拟IP地址与接口IP网段冲突
var EKEEPALIVED_VIP_CONFLICT = -56803                //keepalived虚拟IP地址冲突
var EKEEPALIVED_INTERFACE_CONFLICT = -56804          //keepalived接口冲突
var EKEEPALIVED_VID_CONFLICT = -56805                //keepalivedVRID冲突
var EKEEPALIVED_STATE_CONFLICT = -56806              //keepalived状态冲突
var EKEEPALIVED_VIP_BROADCAST = -56807               //keepalived虚拟地址广播域错误
var EKEEPALIVED_VIP_NETWORK = -56808                 //keepalived虚拟地址网络错误
var EKEEPALIVED_VRRP_EFFECT_INTERFACE_CONFLICT = -56809  //keepalived 心跳接口与生效接口冲突
var EKEEPALIVED_VRRP_NOT_SET = -56810            //keepalived心跳接口还未设置


/* --------------------------------- 模块app_library错误 ----------------------------- */
var EAPPDNAME = -58900
var EAPPMULTPORT = -58901
var EAPPPORTFORMAT = -58902
var EAPPPATTERNFIELD = -58903
var EAPPUDPFIELD = -58904
var EAPPPATTERNINVALID = -58905
var EAPPPORTDUPLICATE = -58906
