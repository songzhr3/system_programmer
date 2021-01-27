(function($){
    $.su = $.su || {};   $.su.CHAR = $.su.CHAR||{};
    $.su.CHAR.HELP ={};
})(jQuery);
// =======access_ctl.js=====
$.su.CHAR.HELP.ACL_LIST = {
    TITLE:"访问控制列表",
    CONTENT:[{
        type:"name",
        title:"规则名称",
        content:"为添加的规则命名，字符数限制在50个字符以内，且任意两条规则不能重名。"
    },{
        type:"name",
        title:"策略类型",
        content:"指明这条规则对符合条件的数据包放行还是丢弃。"
    },{
        type:"name",
        title:"服务类型",
        content:"选择生效的协议，ALL表示所有协议。"
    },{
        type:"name",
        title:"生效接口域",
        content:"选择生效的接口，ALL表示所有的接口。"
    },{
        type:"name",
        title:"源地址范围",
        content:"选择地址对象，以建立访问规则条目的源地址范围。"
    },{
        type:"name",
        title:"目的地址范围",
        content:"选择地址对象，以建立访问规则条目的目的地址范围。"
    },{
        type:"name",
        title:"生效时间",
        content:"选择规则生效的时间。"
    },{
        type:"name",
        title:"添加到指定位置(第几条)",
        content:"指定添加的规则的位置，排在前面的规则比后面规则优先级高。"
    }]
};

// =======account_mngt.js=====
$.su.CHAR.HELP.ADMIN_CONFIG = {
    TITLE: "系统管理设置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面进行服务端口和会话超时时间的管理。"
    },{
        type: "name",
        title: "Http服务",
        content: "Http服务默认打开，当取消勾选该项时，将无法通过Http的方式对WEB进行管理。"
    },{
        type: "name",
        title: "Http服务端口",
        content: "用于Web管理界面的Http服务端口，默认为80端口。不能与其他的服务端口重复。"
    },{
        type: "name",
        title: "Https服务端口",
        content: "用于Web管理界面的Https服务端口，默认为443端口。不能与其他的服务端口重复。"
    },{
        type: "name",
        title: "Web会话超时时间",
        content: "如果在会话超时时间内都没有进行操作，系统将自动退出登录，以保证设备和网络的安全。"
    },{
        type: "name",
        title: "最大登录尝试次数",
        content: "当连续尝试登陆失败达到该次数时，将会在一段时间内锁定设备不允许继续登录。"
    },{
        type: "name",
        title: "登录锁定时长",
        content: "当连续登陆失败次数达到最大登录尝试次数后，将会在锁定时长期间无法进行登录。"   
    }]
}

$.su.CHAR.HELP.ADMIN_ACCOUNT = {
    TITLE: "修改管理账户",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来修改管理账户的用户名和密码。"
    },{
        type: "name",
        title: "原用户名",
        content: "原用户名为您本次登录使用的用户名。"
    },{
        type: "name",
        title: "原密码",
        content: "原密码为您本次登录使用的密码。"
    },{
        type: "name",
        title: "新用户名",
        content: "您可以设置一个新的用户名。可以使用字母、数字及英文特殊符号的组合，不能使用中文、空格以及中文特殊符号。"
    },{
        type: "name",
        title: "新密码",
        content: "您可以设置一个新的密码。推荐使用强度较高的密码以保证设备及网络的安全。"
    },{
        type: "name",
        title: "确认新密码",
        content: "请您再输入一遍新设置的密码，来确认新密码。"
    },{
        type: "name",
        title: "密码强度",
        content: "在新密码输入框下的密码强度控件会提示您密码的强度，建议您使用字母、数字及常用符号的组合来提升密码的强度和安全性。"
    }]
}
// =======address_mngt.js=====
$.su.CHAR.HELP.IPGROUP_GROUP_SETTING =
{
    TITLE: "地址组列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置地址组对象，进行地址组对象的管理。"
    },
    {
        type: "name",
        title: "组名称",
        content: "标志地址组的名称。"
    },
    {
        type: "name",
        title: "地址名称",
        content: "地址组所引用的地址对象(可多选)，引用了该地址组的规则，对所有地址对象所包含的IP地址均会生效。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置地址组的备注，以方便您管理和查找。备注最多支持50个字符。"
    },
    {
        type: "name",
        title: "导入",
        content: "点击<导入>按钮导入多个地址组条目和地址条目。您可以通过“备份”功能获取符合规则的CSV文件，以查看文件的正确格式。"
    },
    {
        type: "name",
        title: "备份",
        content: "点击<备份>按钮备份所有地址组条目和地址条目。备份文件可直接通过“导入”功能重新添加到地址组列表和地址列表中。"
    },
    {
        type: "note",
        title: "注意",
         content:[
            "地址组对象一旦在其他地方被引用则无法在本页面被删除，除非解除引用。",
            "地址组可以为空(即不选择任何地址对象)，引用该地址组的规则对所有地址均不生效。"
         ]
    }
    ]
};

$.su.CHAR.HELP.IPGROUP_ADDRESS_SETTING =
{
    TITLE: "地址列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置地址对象，进行地址对象的管理。"
    },
    {
        type: "name",
        title: "地址名称",
        content: "标志地址的名称。"
    },
    {
        type: "name",
        title: "IP类型",
        content: "用于设置地址对象的类型，不同类型计算得到IP集合的方式不同，有下面两种类型：",
         children:[{
             type:"step",
             content:[
                "IP段：设置一个起始地址和一个结束地址，引用包含该地址对象地址组的规则在该地址段内均会生效。",
                "IP/MASK：设置一个网络标识和一个子网掩码，得到IP网段，引用包含该地址对象地址组的规则在该网段内均会生效。"
             ]
         }]
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置地址对象的备注，以方便您管理和查找。备注最多支持50个字符。"
    }
    ]
};

// =======administrator.js=====
$.su.CHAR.HELP.ROLE_MNGT = {
    TITLE: "管理员角色列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面查看各个管理员角色的权限划分。"
    },{
        type: "name",
        title: "名称",
        content: "管理员角色的名称。"
    },{
        type: "name",
        title: "描述",
        content: "管理员角色的描述。"
    },
    {
        type: "name",
        title: "权限列表",
        content: "用来表示各个管理员角色对于各个模块的权限，分为读写，只读，无权限三种类别。"
    }

    ]
}

$.su.CHAR.HELP.ACCOUNT_LIST = {
    TITLE: "管理员列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来管理管理账户的用户名和密码。"
    },{
        type: "name",
        title: "用户名",
        content: "您可以设置一个新的用户名。可以使用字母、数字及英文特殊符号的组合，不能使用中文、空格以及中文特殊符号。"
    },{
        type: "name",
        title: "密码",
        content: "您可以设置一个新的密码。需要使用强度较高的密码以保证设备及网络的安全。"
    },{
        type: "name",
        title: "确认新密码",
        content: "请您再输入一遍新设置的密码，来确认新密码。"
    },{
        type: "name",
        title: "角色",
        content: "不同的管理员角色对应不同的管理权限，具体的权限划分可以在\"管理角色\"页面查看。"
    }]
}
// =======alarm.js=====
$.su.CHAR.HELP.ALARM = {
    TITLE  : "告警信息",
    CONTENT: [{
        type   : "paragraph",
        content: "您可以通过本页面来查看设备告警信息。"
    }]
};

$.su.CHAR.HELP.ALARM_LIST = {
    TITLE: "告警信息列表",
    CONTENT: [{
        type   : "name",
        title  : "信息内容",
        content: "每一项信息内容组成格式为 [时间+功能模块+严重等级+详细信息]。"
    }]
};

$.su.CHAR.HELP.ALARM_CONFIG = {
    TITLE  : "告警配置",
    CONTENT: [{
        type   : "paragraph",
        content: "您可以通过本页面来配置设备告警功能。"
    }]
};

$.su.CHAR.HELP.ALARM_EVENT_CONFIG_LIST = {
    TITLE  : "告警事件配置列表",
    CONTENT: [{
        type    : "name",
        title   : "选择告警信息严重等级",
        content : "选中<选择告警信息严重等级>，将弹出告警信息严重等级复选框，以供您选择上报/发送特定等级的告警信息。",
        children: [{
            type   : "step",
            content: [
                "所有等级：查看所有等级的告警信息。",
                "致命错误：导致系统不可用的错误。",
                "紧急错误：必须对其采取紧急措施的错误。",
                "严重错误：导致系统处于危险状态的错误。",
                "一般错误：一般性的错误提示。",
                "警告信息：系统仍然正常运行，但可能存在隐患的提示信息。",
                "通知信息：正常状态下的重要提示信息。",
                "信息报告：一般性的提示信息。",
                "调试信息：调试过程中产生的信息。"
            ]
        }]
    },{
        type   : "name",
        title  : "选择告警信息模块类别",
        content: "选中<选择告警信息模块类别>，将弹出告警信息模块类别复选框，以供您选择上报/发送特定模块的告警信息。"
    }]
};

$.su.CHAR.HELP.ALARM_EMAIL_CONFIG_LIST = {
    TITLE  : "告警邮件配置列表",
    CONTENT: [{
        type    : "name",
        title   : "邮件服务器相关配置",
        content : "选中<开启邮件告警>，将激活邮件相关配置项。",
        children: [{
            type   : "step",
            content: [
                "服务器地址： 指定邮件发送所使用的SMTP服务器。",
                "加密类型： STARTTLS - 初始协商过程明文，其余均加密；SSL/TLS - 全流程加密。",
                "端口号： 指定发件过程与SMTP服务器通信的端口。",
                "发件人： 指定告警信息邮件的发件人地址。",
                "收件人： 指定告警信息邮件的收件人地址列表。",
                "开启用户认证： 选择是否启用用户认证，用于向SMTP服务器验证身份。",
                "账号： 当用户认证开启时，指定认证账号名。",
                "密码： 当用户认证开启时，指定认证账号对应的密码。"
            ]
        }]
    },{
        type    : "name",
        title   : "邮件内容相关配置",
        children: [{
            type: "step",
            content:[
                "邮件主题： 指定告警信息邮件头中的主题。",
                "发送间隔： 指定邮件之间的最小发送间隔。"
            ]
        }]
    }]
};

// =======app_library.js=====
$.su.CHAR.HELP.APP_LIBRARY = {
	TITLE: "应用列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "应用名称。"
		},
		{
			type: "name",
			title: "类别",
			content: "应用用途类别。"
		},
		{
			type: "name",
			title: "子类别",
			content: "应用用途子类别。"
		},
		{
			type: "name",
			title: "数据传输方式",
			content: "应用以数据传输方式分类。"
		},
		{
			type: "name",
			title: "风险等级",
			content: "应用风险程度，系统根据勾选的风险维度标签数量计算出风险级别。"
		},
		{
			type: "name",
			title: "标签",
			content: "应用以技术维度、功能维度、风险维度、其他维度标记标签。"
		},
		{
			type: "name",
			title: "备注",
			content: "设置备注信息。"
		}
	]
};

$.su.CHAR.HELP.APP_RULE_1 = {
	TITLE: "应用匹配规则列表",
	CONTENT: [
		{
	        type: "paragraph",
	        content: "用户自定义的应用匹配规则优先级比应用识别特征库优先级更高。"
	    },
		{
			type: "name",
			title: "名称",
			content: "应用名称。"
		},
		{
			type: "name",
			title: "目的地址",
			content: "连接接收方地址，一般为服务器地址，与发起方相对。"
		},
		{
			type: "name",
			title: "目的端口",
			content: "连接接收方端口。"
		},
		{
			type: "name",
			title: "协议",
			content: "应用使用的四层协议。"
		},
		{
			type: "name",
			title: "关键字",
			content: "应用识别匹配的关键字，关键字与匹配字段、检测方向、检测模式必须全选或全部不选。",
			children:[{
				type:"step",
				content:[
					"使用正则表达式模式时，请输入标准pcre语法的关键字",
					"不支持中文匹配，可考虑改为\\x01形式的十六进制输入并使用正则表达式模式",
					"不支持正则表达式的定位符"
				]
			}]
		},
		{
			type: "name",
			title: "匹配字段",
			content: "应用识别可选的匹配字段。"
		},
		{
			type: "name",
			title: "检测方向",
			content: "需要匹配的报文的传输方向，对于未设定目的地址和目的端口的规则，如果实际传输层协议为UDP，该匹配规则有在任意方向均生效的风险。"
		},
		{
			type: "name",
			title: "检测模式",
			content: "关键字匹配的模式。"
		},
		{
			type: "name",
			title: "备注",
			content: "设置备注信息。"
		}
	]
};

$.su.CHAR.HELP.APP_RULE_2 = {
	TITLE: "地址端口映射列表",
	CONTENT: [
		{
	        type: "paragraph",
	        content: "用户自定义的地址端口映射优先级比应用识别特征库优先级更高。"
	    },
		{
			type: "name",
			title: "名称",
			content: "应用名称。"
		},
		{
			type: "name",
			title: "目的地址",
			content: "连接接收方地址，一般为服务器地址。"
		},
		{
			type: "name",
			title: "目的端口",
			content: "连接接收方端口。"
		},
		{
			type: "name",
			title: "协议",
			content: "应用使用的四层协议。"
		},
		{
			type: "name",
			title: "备注",
			content: "设置备注信息。"
		}
	]
};

$.su.CHAR.HELP.APP_GROUPING = {
	TITLE: "应用组列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "应用组名称。"
		},
		{
			type: "name",
			title: "应用列表",
			content: "设置该应用组包含的应用。"
		},
		{
			type: "name",
			title: "备注",
			content: "设置备注信息。"
		}
	]
};

$.su.CHAR.HELP.ENGINE_MODE = {
	TITLE: "识别模式",
	CONTENT: [
		{
			type: "name",
			title: "全量识别",
			content: "全部开启应用识别功能，有可能造成性能下降。"
		},
		{
			type: "name",
			title: "智能识别",
			content: "根据生效的策略是否包含应用或应用组配置，自动选择是否开启应用识别功能。"
		}
	]
};

// =======arp_defense.js=====
$.su.CHAR.HELP.IMB_ENABLE = {
    TITLE:"功能设置",
    CONTENT:[{
        type:"name",
        title:"ARP防欺骗功能",
        content:"启用或关闭ARP的防欺骗功能。若关闭，防ARP欺骗，IP-MAC，ARP功能等功能都不会生效。"
    },{
        type:"name",
        title:"仅允许IP-MAC绑定的数据包通过",
        content:"开启该功能，则只允许在IP-MAC绑定规则中的数据包通过。<br>注意，要开启该功能，需要先开启ARP防欺骗功能。"
    },{
        type:"name",
        title:"在发现ARP攻击时发送GARP包",
        content:"开启该功能，设备收到与IP-MAC绑定列表中不一致的报文时，会发送GARP。<br>注意，要开启该功能，需要先开启ARP防欺骗功能。"
    },{
        type:"name",
        title:"发包间隔",
        content:"发送GARP的时间间隔。"
    }]
};

$.su.CHAR.HELP.IMB_IMPORT = {
    TITLE:"导入到静态地址分配列表",
    CONTENT:[{
        type:"name",
        title:"导入",
        content:"点击导入将列表中勾选的IP-MAC绑定条目导入到静态地址分配列表，您可以在 基本设置-DHCP服务-静态地址分配 中查看。"
    }]
};

$.su.CHAR.HELP.IMB_LIST = {
    TITLE:"IP-MAC绑定规则列表",
    CONTENT:[{
        type:"paragraph",
        content:"您可以查看IP-MAC绑定规则，还可以通过表格按钮对条目进行操作。"
    },{
        type:"name",
        title:"IP地址",
        content:"您可以输入待绑定的IP地址。"
    },{
        type:"name",
        title:"MAC地址",
        content:"您可以输入待绑定的MAC地址，格式为xx-xx-xx-xx-xx-xx。"
    },{
        type:"name",
        title:"生效域",
        content:"您可以选择生效的接口。"
    },{
        type:"name",
        title:"备注",
        content:"您可以设置条目备注，以方便您管理和查找。"
    },{
        type:"name",
        title:"状态",
        content:"您可以选择启用或禁用条目的IP-MAC绑定。"
    }]
};

$.su.CHAR.HELP.ARPSCAN_SCAN = {
    TITLE:"ARP扫描",
    CONTENT:[{
        type:"name",
        title:"扫描范围",
        content:"输入扫描的IP地址范围，设备会对该范围的IP地址进行ARP查询。"
    },{
        type:"name",
        title:"导入IP-MAC绑定",
        content:"您可以将扫描结果中的IP-MAC对导入IP-MAC绑定页面中。"
    },{
        type:"name",
        title:"扫描结果",
        content:"扫描结束后，扫描得到的结果会出现在这个列表中。"
    }]
};

$.su.CHAR.HELP.ARPLIST_SCAN = {
    TITLE:"ARP列表",
    CONTENT:[{
        type:"name",
        title:"导入IP-MAC绑定",
        content:"您可以将ARP列表中的IP-MAC对导入到IP-MAC绑定页面中。"
    },{
        type:"name",
        title:"ARP列表",
        content:"将系统中的ARP列表展现在此列表中。"
    }]
};

// =======attack_defense.js=====
$.su.CHAR.HELP.DEFENSE_FLOOD = {
    TITLE:"防Flood类攻击",
    CONTENT:[{
        type:"name",
        title:"启用防多连接的TCP SYN Flood攻击",
        content:"开启TCP的连接限制，将TCP连接限制在给定值。"
    },{
        type:"name",
        title:"启用防多连接的UDP Flood攻击",
        content:"开启UDP的连接限制，将UDP连接限制在给定值。"
    },{
        type:"name",
        title:"启用防多连接的ICMP Flood攻击",
        content:"开启ICMP的连接限制，将ICMP连接限制在给定值。"
    },{
        type:"name",
        title:"启用防固定源的TCP SYN Flood攻击",
        content:"将某个IP的TCP的连接限制在给定值之内。"
    },{
        type:"name",
        title:"启用防固定源的UDP Flood攻击",
        content:"将某个IP的UDP的连接限制在给定值之内。"
    },{
        type:"name",
        title:"启用防固定源的ICMP Flood攻击",
        content:"将某个IP的ICMP的连接限制在给定值之内。"
    }]
};

$.su.CHAR.HELP.DEFENSE_DOS = {
    TITLE:"防可疑包攻击",
    CONTENT:[{
        type:"name",
        title:"启用防碎片包攻击",
        content:"开启该功能，设备会过滤掉碎片包。"
    },{
        type:"name",
        title:"启用防TCP Scan（Strealth FIN/Xmas/Null）",
        content:"开启该功能，设备会过滤掉三种工具的tcp scan包。"
    },{
        type:"name",
        title:"启用防ping of Death",
        content:"开启该功能，设备会过滤掉异常的ping包。"
    },{
        type:"name",
        title:"启用防Large ICMP",
        content:"开启该功能，设备会过滤掉大ICMP包。"
    },{
        type:"name",
        title:"启用WinNuke攻击",
        content:"开启该功能，防止winNuke攻击。"
    },{
        type:"name",
        title:"启用TearDrop攻击",
        content:"开启该功能，防止TearDrop攻击。"
    },{
        type:"name",
        title:"启用LAND攻击",
        content:"开启该功能，防止LAND攻击。"
    },{
        type:"name",
        title:"阻止同时设置FIN和SYN的TCP包",
        content:"开启该功能，设备会过滤掉同时包含FIN和SYN的TCP报文。"
    },{
        type:"name",
        title:"阻止仅设置FIN未设置ACK的TCP包",
        content:"开启该功能，设备会过滤掉设置了FIN未设置ACK的TCP报文。"
    },{
        type:"name",
        title:"阻止带选项的包",
        content:"开启该功能，设备会过滤掉设置某些IP选项中的报文。"
    }]
};

$.su.CHAR.HELP.DEFENSE_NETSCAN = {
    TITLE:"网络扫描防护",
    CONTENT:[{
        type:"name",
        title:"启用IP地址扫描防护",
        content:"开启该功能，设备会开启IP地址扫描防护功能。"
    },{
        type:"name",
        title:"最大扫描速率（地址扫描）",
        content:"当发现某台主机的地址扫描行为的速率超过了最大扫描速率，系统将其判断为攻击者，并将其加入黑名单。"
    },{
        type:"name",
        title:"黑名单老化时间（地址扫描）",
        content:"加入黑名单的表项在超过黑名单老化时间后自动从黑名单中删除。"
    },{
        type:"name",
        title:"启用端口扫描防护",
        content:"开启该功能，设备会开启端口扫描防护功能。"
    },{
        type:"name",
        title:"最大扫描速率（端口扫描）",
        content:"当发现某台主机的端口扫描行为的速率超过了最大扫描速率，系统将其判断为攻击者，并将其加入黑名单。"
    },{
        type:"name",
        title:"黑名单老化时间（端口扫描）",
        content:"加入黑名单的表项在超过黑名单老化时间后自动从黑名单中删除。"
    }]
};

// =======audit_policy.js=====
$.su.CHAR.HELP.AUDITLOG =
{
	TITLE: "审计日志",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看审计日志。"
	},
	{
		type: "name",
		title: "流量起始时间",
		content: "本条流量日志对应数据流的起始时间。"
	},
	{
		type: "name",
		title: "流量结束时间",
		content: "本条流量日志对应数据流的结束时间。"
	},
	{
		type: "name",
		title: "类型",
		content: "数据流报文类型。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "数据流目的地址。"
	},
	{
		type: "name",
		title: "源端口",
		content: "数据流源端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "目的端口",
		content: "数据流目的端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "用户",
		content: "审计数据流对应的用户"
	},
	{
		type: "name",
		title: "协议",
		content: "数据流协议。"
	},
	{
		type: "name",
		title: "动作",
		content: "策略动作。"
	},
	{
		type: "name",
		title: "审计策略",
		content: "匹配到的审计策略。"
	},
	{
		type: "name",
		title: "审计配置文件",
		content: "匹配到的审计策略的审计配置文件。"
	},
	{
		type: "name",
		title: "审计类型",
		content: "审计类型。"
	},
	{
		type: "name",
		title: "详细内容",
		content: "审计信息的详细内容。"
	},
	{
		type: "name",
		title: "导出日志",
		content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志"
	}]
};

$.su.CHAR.HELP.FLOWLOG =
{
	TITLE: "流量日志",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看流量日志。"
	},
	{
		type: "name",
		title: "时间",
		content: "日志时间。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "数据流目的地址。"
	},
	{
		type: "name",
		title: "源端口",
		content: "数据流源端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "目的端口",
		content: "数据流目的端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "用户",
		content: "数据流对应的用户"
	},
	{
		type: "name",
		title: "协议",
		content: "数据流协议。"
	},
	{
		type: "name",
		title: "应用",
		content: "数据流应用。"
	},
	{
		type: "name",
		title: "应用组",
		content: "数据流应用所在应用组。"
	},
	{
		type: "name",
		title: "上行流量",
		content: "连接的上行流量。"
	},
	{
		type: "name",
		title: "下行流量",
		content: "连接的下行流量。"
	},
	{
		type: "name",
		title: "入接口",
		content: "连接的入接口。"
	},
	{
		type: "name",
		title: "出接口",
		content: "连接的出接口。"
	},
	{
		type: "name",
		title: "安全策略",
		content: "流量匹配到的安全策略。"
	},
	{
		type: "name",
		title: "导出日志",
		content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志。"
	}]
};

$.su.CHAR.HELP.AUDITPOLICY = {
	TITLE: "审计策略",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看审计策略。"
	},
	{
		type: "name",
		title: "策略名称",
		content: "审计策略名称。"
	},
	{
		type: "name",
		title: "描述",
		content: "审计策略的描述信息。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "指定审计策略匹配的数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "指定审计策略匹配的数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "指定审计策略匹配的数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "指定审计策略匹配的数据流目的地址。"
	},
	{
		type: "name",
		title: "服务",
		content: "指定审计策略匹配的数据流协议。"
	},
	{
		type: "name",
		title: "时间段",
		content: "指定审计策略生效的时间段。"
	},
	{
		type: "name",
		title: "动作",
		content: "是否开启审计。"
	},
	{
		type: "name",
		title: "审计配置文件",
		content: "指定审计策略的审计配置文件。"
	},
	{
		type: "name",
		title: "状态",
		content: "指定审计策略是否启用。"
	},
	{
		type: "name",
		title: "设置",
		content: "修改和删除审计策略。"
	}]
};

$.su.CHAR.HELP.AUDITPROFILE =
{
	TITLE: "审计配置文件",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看审计配置文件。"
	},
	{
		type: "name",
		title: "名称",
		content: "审计配置文件名称。"
	},
	{
		type: "name",
		title: "描述",
		content: "审计配置文件的描述信息。"
	},
	{
		type: "name",
		title: "HTTP行为审计",
		content: "审计配置文件的HTTP信息审计内容。"
	},
	{
		type: "name",
		title: "FTP行为审计",
		content: "审计配置文件的FTP信息审计内容。"
	},
	{
		type: "name",
		title: "邮件行为审计",
		content: "审计配置文件的邮件信息审计内容。"
	},
	{
		type: "name",
		title: "IM行为审计",
		content: "审计配置文件的IM信息审计内容。"
	},
	{
		type: "name",
		title: "设置",
		content: "修改和删除审计配置文件。"
	}]
};

// =======authentication.js=====
$.su.CHAR.HELP.SESSMNGR_LIST_VLAN = {
        TITLE: "认证用户列表",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来查看认证状态。"
        }, {
            type: "name",
            title: "认证方式",
            content: "用户登录所使用的认证方式。"
        }, {
            type: "name",
            title: "用户名",
            content: "当前登录成功的用户名。"
        }, {
            type: "name",
            title: "MAC地址",
            content: "当前登录用户的MAC地址。"
        }, {
            type: "name",
            title: "VLAN",
            content: "用户登录时所属的VLAN。"
        }, {
            type: "name",
            title: "认证时间",
            content: "用户登录时间。"
        }, {
            type: "name",
            title: "认证剩余时间",
            content: "用户认证过期的剩余时间。"
        }, {
            type: "name",
            title: "断开连接",
            content: "删除已认证用户条目，用户需要重新认证。"
        }]
};

$.su.CHAR.HELP.SESSMNGR_LIST_SSID = {
        TITLE: "认证用户列表",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来查看认证状态。"
        }, {
            type: "name",
            title: "认证方式",
            content: "用户登录所使用的认证方式。"
        }, {
            type: "name",
            title: "用户名",
            content: "当前登录成功的用户名。"
        }, {
            type: "name",
            title: "MAC地址",
            content: "当前登录用户的MAC地址。"
        }, {
            type: "name",
            title: "SSID",
            content: "当前登录用户所在的无线服务。"
        },  {
            type: "name",
            title: "认证时间",
            content: "用户登录时间。"
        }, {
            type: "name",
            title: "认证剩余时间",
            content: "用户认证过期的剩余时间。"
        }, {
            type: "name",
            title: "断开连接",
            content: "删除已认证用户条目，用户需要重新认证。"
        }]
};

$.su.CHAR.HELP.SESSMNGR_LIST_INTERFACE = {
        TITLE: "用户状态",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来查看用户状态。"
        }, {
            type: "name",
            title: "下线",
            content: "可实现批量断开用户连接。"
        }, {
            type: "name",
            title: "认证方式",
            content: "用户登录所使用的认证方式。"
        }, {
            type: "name",
            title: "认证时间",
            content: "用户登录时间。"
        }, {
            type: "name",
            title: "IP地址",
            content: "用户的IP地址。"
        }, {
            type: "name",
            title: "设置",
            content: "可断开用户的连接。"
        }]
};

$.su.CHAR.HELP.NONSENSE_LIST_VLAN = {
        TITLE: "认证用户列表",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来查看认证状态。"
        }, {
            type: "name",
            title: "VLAN",
            content: "无感知认证用户认证时的VLAN。"
        }, {
            type: "name",
            title: "MAC地址",
            content: "无感知认证用户认证时的MAC地址。"
        }, {
            type: "name",
            title: "用户名",
            content: "无感知认证用户认证时的用户名。"
        }, {
            type: "name",
            title: "密码",
            content: "无感知认证用户认证时的密码。"
        }, {
            type: "name",
            title: "认证时间",
            content: "无感知认证用户最后一次认证的时间。"
        }, {
            type: "name",
            title: "断开连接",
            content: "删除该无感知认证用户。"
        }]
};

$.su.CHAR.HELP.NONSENSE_LIST_SSID = {
        TITLE: "认证用户列表",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来查看认证状态。"
        }, {
            type: "name",
            title: "SSID",
            content: "无感知认证用户认证时所属的无线服务。"
        }, {
            type: "name",
            title: "MAC地址",
            content: "无感知认证用户认证时的MAC地址。"
        }, {
            type: "name",
            title: "用户名",
            content: "无感知认证用户认证时的用户名。"
        }, {
            type: "name",
            title: "密码",
            content: "无感知认证用户认证时的密码。"
        }, {
            type: "name",
            title: "认证时间",
            content: "无感知认证用户最后一次认证的时间。"
        }, {
            type: "name",
            title: "断开连接",
            content: "删除该无感知认证用户。"
        }]
};

$.su.CHAR.HELP.NONSENSE_LIST_INTERFACE = {
    // 待添加
};

$.su.CHAR.HELP.JUMP_PAGE = {
        TITLE: "跳转页面",
        CONTENT: [{
            type: "paragraph",
            content:"您可以通过本页面设置跳转页面。"
        },
        {
            type: "name",
            title: "跳转页面名称",
            content: "设置想要添加的跳转页面模板名称。"
        }, {
            type: "name", 
            title: "模板类型",
            content: "选择跳转页面的模板类型，有本地模板和云模板可供选择。",
            children:[{
                type: "step",
                content: [
                    "本地模板：终端将使用设备自带的页面版式。"
                ]
            },{
                type: "step",
                content: [
                    "云模板：设备将向云端服务器获取页面样式，需联网才能使用。"
                ]
            }]
        }, {
            type: "name",
            title: "备注",
            content: "设置跳转页面的备注信息，方便管理和查找。"
        }, {
            type: "name",
            title: "页面标题",
            content: "跳转页面的页面标题。"
        }, {
            type: "name",
            title: "欢迎语",
            content: "显示跳转页面的欢迎信息。"
        }, {
            type: "name",
            title: "版权信息",
            content:"显示跳转页面的版权声明信息。"
        }, {
            type: "name",
            title: "背景图片",
            content: "用于页面的背景展示图，图片大小限制在200KB以内。"
        }, {
            type: "name",
            title: "Logo图片",
            content:"设置页面的Logo图片，图片大小限制在100KB以内。"
        }, {
            type: "name",
            title: "公告",
            content: "设置页面的提示信息。"
        }]
};

$.su.CHAR.HELP.MULTI_PORTAL_VLAN = {
    TITLE:"组合认证",
    CONTENT:[
        {
            type: "paragraph",
            content: "您可以通过本页面配置组合认证功能。"
        }, {
            type: "name",
            title: "跳转页面名称",
            content: "选择该条目认证方式下的跳转页面模板。"
        }, {
            type: "name",
            title: "生效VLAN",
            content: "选择该条目生效对应的VLAN。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title:"认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "备注",
            content: "设置组合认证条目的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "认证方式",
            content: "提供Web认证、一键上网、短信认证三种方式，可进行详细配置。"
        }, {
            type:"name",
            title:"状态",
            content:"选择是否开启当前认证方式。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行Web认证的服务器类型。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行Web认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "认证用户可以免费上网的时长。若radius服务器设置了免费上网时长，生效的时间为radius服务器设置的时间。"
        }, {
            type: "name",
            title: "验证码有效期",
            content: "用户在该时间内输入验证码进行验证有效，否则需重新获取验证码。"
        },{
            type:"name",
            title:"阿里云",
            content:"使用阿里云平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问阿里云平台短信接口所对应的用户名。",
                    "Access Key Secret：访问阿里云平台短信接口所对应的密码。",
                    "模板CODE：阿里云平台所提供的模板ID号。",
                    "签名名称：阿里云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"腾讯云",
            content:"使用腾讯云平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "SMK_App_ID：访问腾讯云平台短信接口所对应的用户名。",
                    "App Secret：访问腾讯云平台短信接口所对应的密码。",
                    "模板ID：腾讯云平台所提供的模板ID号。",
                    "签名：腾讯云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"百度云",
            content:"使用百度云平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问百度云平台短信接口所对应的用户名。",
                    "Secret Access Key：访问百度云平台短信接口所对应的密码。",
                    "模板ID：百度云平台所提供的模板ID号。",
                    "短信签名：百度云平台发送的短信模板对应的签名名称。",
                    "调用ID：百度云平台调用短信发送应用的调用ID。"
                ]
            }]
        },{
            type:"name",
            title:"网易云信",
            content:"使用网易云信平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "AppKey：访问网易云信平台短信接口所对应的用户名。",
                    "App Secret：访问网易云信平台短信接口所对应的密码。",
                    "模板ID：网易云信平台所提供的模板ID号。",
                    "短信签名：网易云信平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"HTTP协议",
            content:"使用HTTP协议方式发送短信。",
            children:[{
                type:"step",
                content:[                   
                    "URL地址：所选择平台的URL地址。",               
                    "请求方式：向服务器发送请求的HTTP报文类型。",
                    "编码类型：所选择平台要求的编码格式。",           "短信模板：当为http类型时，短信模板为url参数。其中，手机号与验证码分别采用'{PHONE}'与'{CODE}'关键字替换，例如：user=zhangsan&password=12345678&phone={PHONE}&msg=您的验证码为{CODE}，请不要告诉他人！。参数中可增加其它固定的参数信息，如：action=send。不可添加不固定项，主要包括时间戳、MD5项、校验和项等。"
                ]
            }]
        }
    ]
};

$.su.CHAR.HELP.MULTI_PORTAL_VLAN_CWF = {
    TITLE:"组合认证",
    CONTENT:[
        {
            type: "paragraph",
            content: "您可以通过本页面配置组合认证功能。"
        }, {
            type: "name",
            title: "跳转页面名称",
            content: "选择该条目认证方式下的跳转页面模板。"
        }, {
            type: "name",
            title: "生效VLAN",
            content: "选择该条目生效对应的VLAN。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title:"认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "备注",
            content: "设置组合认证条目的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "认证方式",
            content: "提供Web认证、一键上网、短信认证三种方式，可进行详细配置。"
        }, {
            type:"name",
            title:"状态",
            content:"选择是否开启当前认证方式。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行Web认证的服务器类型。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行Web认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "认证用户可以免费上网的时长。若radius服务器设置了免费上网时长，生效的时间为radius服务器设置的时间。"
        }, {
            type: "name",
            title: "验证码有效期",
            content: "用户在该时间内输入验证码进行验证有效，否则需重新获取验证码。"
        },{
            type:"name",
            title:"阿里云",
            content:"使用阿里云平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问阿里云平台短信接口所对应的用户名。",
                    "Access Key Secret：访问阿里云平台短信接口所对应的密码。",
                    "模板CODE：阿里云平台所提供的模板ID号。",
                    "签名名称：阿里云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"腾讯云",
            content:"使用腾讯云平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "SMK_App_ID：访问腾讯云平台短信接口所对应的用户名。",
                    "App Secret：访问腾讯云平台短信接口所对应的密码。",
                    "模板ID：腾讯云平台所提供的模板ID号。",
                    "签名：腾讯云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"百度云",
            content:"使用百度云平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问百度云平台短信接口所对应的用户名。",
                    "Secret Access Key：访问百度云平台短信接口所对应的密码。",
                    "模板ID：百度云平台所提供的模板ID号。",
                    "短信签名：百度云平台发送的短信模板对应的签名名称。",
                    "调用ID：百度云平台调用短信发送应用的调用ID。"
                ]
            }]
        },{
            type:"name",
            title:"网易云信",
            content:"使用网易云信平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "AppKey：访问网易云信平台短信接口所对应的用户名。",
                    "App Secret：访问网易云信平台短信接口所对应的密码。",
                    "模板ID：网易云信平台所提供的模板ID号。",
                    "短信签名：网易云信平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"HTTP协议",
            content:"使用HTTP协议方式发送短信",
            children:[{
                type:"step",
                content:[                   
                    "URL地址：所选择平台的URL地址。",               
                    "请求方式：向服务器发送请求的HTTP报文类型。",
                    "编码类型：所选择平台要求的编码格式。",           "短信模板：当为http类型时，短信模板为url参数。其中，手机号与验证码分别采用'{PHONE}'与'{CODE}'关键字替换，例如：user=zhangsan&password=12345678&phone={PHONE}&msg=您的验证码为{CODE}，请不要告诉他人！。参数中可增加其它固定的参数信息，如：action=send。不可添加不固定项，主要包括时间戳、MD5项、校验和项等。"
                ]
            }]
        }
    ]
};

$.su.CHAR.HELP.MULTI_PORTAL_SSID = {
    TITLE:"组合认证",
    CONTENT:[
        {
            type: "paragraph",
            content: "您可以通过本页面配置组合认证功能。"
        }, {
            type: "name",
            title: "跳转页面名称",
            content: "选择该条目认证方式下的跳转页面模板。"
        }, {
            type: "name",
            title: "生效SSID",
            content: "选择需要进行Web认证的无线服务。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title:"认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "备注",
            content: "设置组合认证条目的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "认证方式",
            content: "提供Web认证、一键上网、短信认证三种方式，可进行详细配置。"
        }, {
            type:"name",
            title:"状态",
            content:"选择是否开启当前认证方式。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行Web认证的服务器类型。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行Web认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "认证用户可以免费上网的时长。若radius服务器设置了免费上网时长，生效的时间为radius服务器设置的时间。"
        }, {
            type: "name",
            title: "验证码有效期",
            content: "用户在该时间内输入验证码进行验证有效，否则需重新获取验证码。"
        },{
            type:"name",
            title:"阿里云",
            content:"使用阿里云平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问阿里云平台短信接口所对应的用户名。",
                    "Access Key Secret：访问阿里云平台短信接口所对应的密码。",
                    "模板CODE：阿里云平台所提供的模板ID号。",
                    "签名名称：阿里云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"腾讯云",
            content:"使用腾讯云平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "SMK_App_ID：访问腾讯云平台短信接口所对应的用户名。",
                    "App Secret：访问腾讯云平台短信接口所对应的密码。",
                    "模板ID：腾讯云平台所提供的模板ID号。",
                    "签名：腾讯云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"百度云",
            content:"使用百度云平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问百度云平台短信接口所对应的用户名。",
                    "Secret Access Key：访问百度云平台短信接口所对应的密码。",
                    "模板ID：百度云平台所提供的模板ID号。",
                    "短信签名：百度云平台发送的短信模板对应的签名名称。",
                    "调用ID：百度云平台调用短信发送应用的调用ID。"
                ]
            }]
        },{
            type:"name",
            title:"网易云信",
            content:"使用网易云信平台进行短信发送",
            children:[{
                type:"step",
                content:[
                    "AppKey：访问网易云信平台短信接口所对应的用户名。",
                    "App Secret：访问网易云信平台短信接口所对应的密码。",
                    "模板ID：网易云信平台所提供的模板ID号。",
                    "短信签名：网易云信平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"HTTP协议",
            content:"使用HTTP协议方式发送短信",
            children:[{
                type:"step",
                content:[                   
                    "URL地址：所选择平台的URL地址。",               
                    "请求方式：向服务器发送请求的HTTP报文类型。",
                    "编码类型：所选择平台要求的编码格式。",           "短信模板：当为http类型时，短信模板为url参数。其中，手机号与验证码分别采用'{PHONE}'与'{CODE}'关键字替换，例如：user=zhangsan&password=12345678&phone={PHONE}&msg=您的验证码为{CODE}，请不要告诉他人！。参数中可增加其它固定的参数信息，如：action=send。不可添加不固定项，主要包括时间戳、MD5项、校验和项等。"
                ]
            }]
        }
    ]
};

$.su.CHAR.HELP.MULTI_PORTAL_SSID_CWF = {
    TITLE:"组合认证",
    CONTENT:[
        {
            type: "paragraph",
            content: "您可以通过本页面配置组合认证功能。"
        }, {
            type: "name",
            title: "跳转页面名称",
            content: "选择该条目认证方式下的跳转页面模板。"
        }, {
            type: "name",
            title: "生效SSID",
            content: "选择需要进行Web认证的无线服务。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title:"认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "备注",
            content: "设置组合认证条目的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "认证方式",
            content: "提供Web认证、一键上网、短信认证三种方式，可进行详细配置。"
        }, {
            type:"name",
            title:"状态",
            content:"选择是否开启当前认证方式。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行Web认证的服务器类型。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行Web认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "认证用户可以免费上网的时长。若radius服务器设置了免费上网时长，生效的时间为radius服务器设置的时间。"
        }, {
            type: "name",
            title: "验证码有效期",
            content: "用户在该时间内输入验证码进行验证有效，否则需重新获取验证码。"
        },{
            type:"name",
            title:"阿里云",
            content:"使用阿里云平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问阿里云平台短信接口所对应的用户名。",
                    "Access Key Secret：访问阿里云平台短信接口所对应的密码。",
                    "模板CODE：阿里云平台所提供的模板ID号。",
                    "签名名称：阿里云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"腾讯云",
            content:"使用腾讯云平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "SMK_App_ID：访问腾讯云平台短信接口所对应的用户名。",
                    "App Secret：访问腾讯云平台短信接口所对应的密码。",
                    "模板ID：腾讯云平台所提供的模板ID号。",
                    "签名：腾讯云平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"百度云",
            content:"使用百度云平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "Access Key ID：访问百度云平台短信接口所对应的用户名。",
                    "Secret Access Key：访问百度云平台短信接口所对应的密码。",
                    "模板ID：百度云平台所提供的模板ID号。",
                    "短信签名：百度云平台发送的短信模板对应的签名名称。",
                    "调用ID：百度云平台调用短信发送应用的调用ID。"
                ]
            }]
        },{
            type:"name",
            title:"网易云信",
            content:"使用网易云信平台进行短信发送。",
            children:[{
                type:"step",
                content:[
                    "AppKey：访问网易云信平台短信接口所对应的用户名。",
                    "App Secret：访问网易云信平台短信接口所对应的密码。",
                    "模板ID：网易云信平台所提供的模板ID号。",
                    "短信签名：网易云信平台发送的短信模板对应的签名名称。"
                ]
            }]
        },{
            type:"name",
            title:"HTTP协议",
            content:"使用HTTP协议方式发送短信。",
            children:[{
                type:"step",
                content:[                   
                    "URL地址：所选择平台的URL地址。",               
                    "请求方式：向服务器发送请求的HTTP报文类型。",
                    "编码类型：所选择平台要求的编码格式。",           "短信模板：当为http类型时，短信模板为url参数。其中，手机号与验证码分别采用'{PHONE}'与'{CODE}'关键字替换，例如：user=zhangsan&password=12345678&phone={PHONE}&msg=您的验证码为{CODE}，请不要告诉他人！。参数中可增加其它固定的参数信息，如：action=send。不可添加不固定项，主要包括时间戳、MD5项、校验和项等。"
                ]
            }]
        }
    ]
};

$.su.CHAR.HELP.MULTI_PORTAL_INTERFACE = {
    TITLE:"组合认证",
    CONTENT:[
        {
            type: "paragraph",
            content: "您可以通过本页面配置组合认证功能。"
        }, {
            type: "name",
            title: "跳转页面名称",
            content: "选择该条目认证方式下的跳转页面模板。"
        }, {
            type: "name",
            title: "生效接口",
            content: "选择该条目生效对应的接口。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title:"认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "备注",
            content: "设置组合认证条目的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "认证方式",
            content: "提供Web认证方式，可进行详细配置。"
        }, {
            type:"name",
            title:"状态",
            content:"选择是否开启当前认证方式。"
        }
    ] 
};

$.su.CHAR.HELP.REMOTE_PORTAL_VLAN = {
        TITLE: "远程Portal",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看远程Portal认证条目。"
        }, {
            type: "name",
            title: "状态",
            content: "设置远程Portal认证条目当前的启用状态。"
        }, {
            type: "name",
            title: "VLAN",
            content: "选择需要进行远程Portal认证的VLAN。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title: "认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "远程Portal地址",
            content: "填写远程Portal服务器的地址。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行远程Portal认证的服务器类型。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行远程Portal认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "选择远程服务器进行认证时，若服务器未配置用户上网时长，则使用该时长作为用户的免费上网时长。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "备注",
            content: "设置远程Portal认证条目的备注信息，以方便管理和查找。"
        }]
};

$.su.CHAR.HELP.REMOTE_PORTAL_SSID = {
        TITLE: "远程Portal",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看远程Portal认证条目。"
        }, {
            type: "name",
            title: "状态",
            content: "设置远程Portal认证条目当前的启用状态。"
        }, {
            type: "name",
            title: "生效SSID",
            content: "选择需要进行远程Portal认证的无线服务。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title: "认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "远程Portal地址",
            content: "填写远程Portal服务器的地址。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行远程Portal认证的服务器类型。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行远程Portal认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "选择远程服务器进行认证时，若服务器未配置用户上网时长，则使用该时长作为用户的免费上网时长。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "备注",
            content: "设置远程Portal认证条目的备注信息，以方便管理和查找。"
        }]
};

$.su.CHAR.HELP.REMOTE_PORTAL_INTERFACE = {
        TITLE: "远程Portal",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看远程Portal认证条目。"
        }, {
            type: "name",
            title: "状态",
            content: "设置远程Portal认证条目当前的启用状态。"
        }, {
            type: "name",
            title: "生效接口",
            content: "选择需要进行远程Portal认证的接口。"
        }, {
            type: "name",
            title: "认证成功跳转链接",
            content: "设置认证成功后跳转的URL地址。"
        }, {
            type: "name",
            title: "认证失败跳转链接",
            content: "设置认证失败后跳转的URL地址。"
        }, {
            type: "name",
            title: "远程Portal地址",
            content: "填写远程Portal服务器的地址。"
        }, {
            type: "name",
            title: "备注",
            content: "设置远程Portal认证条目的备注信息，以方便管理和查找。"
        }]
};

$.su.CHAR.HELP.CMCC_PORTAL_VLAN = {
        TITLE: "CMCC Portal",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看CMCC Portal认证条目。"
        }, {
            type: "name",
            title: "状态",
            content: "设置CMCC Portal认证条目当前的启用状态。"
        }, {
            type: "name",
            title: "VLAN ID",
            content: "选择需要进行CMCC Portal认证的VLAN ID。"
        }, {
            type: "name",
            title: "CMCC Portal地址",
            content: "填写CMCC Portal服务器的地址。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行CMCC Portal认证的服务器类型。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行CMCC Portal认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "选择远程服务器进行认证时，若服务器未配置用户上网时长，则使用该时长作为用户的免费上网时长。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "ACNAME属性",
            content: "CMCC Portal跳转地址的acname属性值，用于识别不同的AC设备"
        }, {
            type: "name",
            title: "备注",
            content: "设置CMCC Portal认证条目的备注信息，以方便管理和查找。"
        }]
};

$.su.CHAR.HELP.CMCC_PORTAL_SSID = {
        TITLE: "CMCC Portal",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看CMCC Portal认证条目。"
        }, {
            type: "name",
            title: "状态",
            content: "设置CMCC Portal认证条目当前的启用状态。"
        }, {
            type: "name",
            title: "生效SSID",
            content: "选择需要进行CMCC Portal认证的无线服务。"
        }, {
            type: "name",
            title: "CMCC Portal地址",
            content: "填写CMCC Portal服务器的地址。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行CMCC Portal认证的服务器类型。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行CMCC Portal认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "选择远程服务器进行认证时，若服务器未配置用户上网时长，则使用该时长作为用户的免费上网时长。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户免费上网时长用尽或再次接入无线服务时会自动进行认证。"
        }, {
            type: "name",
            title: "ACNAME属性",
            content: "CMCC Portal跳转地址的acname属性值，用于识别不同的AC设备"
        }, {
            type: "name",
            title: "备注",
            content: "设置CMCC Portal认证条目的备注信息，以方便管理和查找。"
        }]
};

$.su.CHAR.HELP.CMCC_PORTAL_INTERFACE = {
        TITLE: "CMCC Portal",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看CMCC Portal认证条目。"
        }, {
            type: "name",
            title: "状态",
            content: "设置CMCC Portal认证条目当前的启用状态。"
        }, {
            type: "name",
            title: "生效接口",
            content: "选择需要进行CMCC Portal认证的接口。"
        }, {
            type: "name",
            title: "CMCC Portal地址",
            content: "填写CMCC Portal服务器的地址。"
        }, {
            type: "name",
            title: "认证服务器类型",
            content: "选择进行CMCC Portal认证的服务器类型。"
        }, {
            type: "name",
            title: "认证服务器组",
            content: "选择进行CMCC Portal认证的服务器组。"
        }, {
            type: "name",
            title: "免费上网时长",
            content: "选择远程服务器进行认证时，若服务器未配置用户上网时长，则使用该时长作为用户的免费上网时长。"
        }, {
            type: "name",
            title: "无感知认证",
            content: "若启用无感知认证，无感知认证用户再次接入WLAN时会自动进行认证。"
        }, {
            type: "name",
            title: "ACNAME属性",
            content: "CMCC Portal跳转地址的acname属性值，用于识别不同的AC设备"
        }, {
            type: "name",
            title: "备注",
            content: "设置CMCC Portal认证条目的备注信息，以方便管理和查找。"
        }]
};

$.su.CHAR.HELP.FREE_STRATEGY_CONFIG_VLAN = {
        TITLE: "免认证策略",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看免认证策略信息，免认证策略用来配置用户在Portal认证通过前可以免费访问的资源。"
        }, {
            type: "name",
            title: "策略名称",
            content: "填写免认证策略条目的名称。"
        }, {
            type: "name",
            title: "匹配方式",
            content: "免认证策略的匹配方式。"
        }, {
            type: "name",
            title: "URL地址",
            content: "当选择URL免认证策略时，需要匹配的URL地址。"
        }, {
            type: "name",
            title: "源IP地址范围",
            content: "设置免认证策略的源IP地址和网络掩码。"
        }, {
            type: "name",
            title: "源MAC地址",
            content: "设置免认证策略的源MAC地址。"
        }, {
            type: "name",
            title: "源VLAN",
            content: "设置免认证策略的源VLAN。"
        }, {
            type: "name",
            title: "源端口",
            content: "设置免认证策略的源端口范围。"
        }, {
            type: "name",
            title: "目的IP地址范围",
            content: "设置免认证策略的目的IP地址和网络掩码。"
        },{
            type: "name",
            title: "目的端口",
            content: "设置免认证策略的目的端口范围。"
        }, {
            type: "name",
            title: "服务协议",
            content: "设置免认证策略的服务协议。"
        }, {
            type: "name",
            title: "备注",
            content: "设置免认证策略的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "状态",
            content: "设置免认证策略是否生效。"
        }]
};

$.su.CHAR.HELP.FREE_STRATEGY_CONFIG_SSID = {
        TITLE: "免认证策略",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看免认证策略信息，免认证策略用来配置用户在Portal认证通过前可以免费访问的资源。"
        }, {
            type: "name",
            title: "策略名称",
            content: "填写免认证策略条目的名称。"
        }, {
            type: "name",
            title: "匹配方式",
            content: "免认证策略的匹配方式。"
        }, {
            type: "name",
            title: "URL地址",
            content: "当选择URL免认证策略时，需要匹配的URL地址。"
        }, {
            type: "name",
            title: "源IP地址范围",
            content: "设置免认证策略的源IP地址和网络掩码。"
        }, {
            type: "name",
            title: "源MAC地址",
            content: "设置免认证策略的源MAC地址。"
        }, {
            type: "name",
            title: "源端口",
            content: "设置免认证策略的源端口范围。"
        }, {
            type: "name",
            title: "目的IP地址范围",
            content: "设置免认证策略的目的IP地址和网络掩码。"
        },{
            type: "name",
            title: "目的端口",
            content: "设置免认证策略的目的端口范围。"
        }, {
            type: "name",
            title: "服务协议",
            content: "设置免认证策略的服务协议。"
        }, {
            type: "name",
            title: "备注",
            content: "设置免认证策略的备注信息，以方便管理和查找。"
        }, {
            type: "name",
            title: "状态",
            content: "设置免认证策略是否生效。"
        }]
};

$.su.CHAR.HELP.FREE_STRATEGY_CONFIG_INTERFACE = {
        TITLE: "免认证策略",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面设置和查看免认证策略信息，免认证策略用来配置用户在Portal认证通过前可以免费访问的资源。"
        }, {
            type: "name",
            title: "策略名称",
            content: "设置免认证策略的名称。"
        }, {
            type: "name",
            title: "免认证方式",
            content: "设置免认证策略的方式，可选择五元组和URL两种方式。"
        },{
            type: "name",
            title: "五元组方式",
            content: "设置免认证的五元组。"
        },{
            type: "name",
            title: "URL方式",
            content: "设置免认证的目的网络地址。"
        }, {
            type: "name",
            title: "源IP地址范围",
            content: "设置免认证策略的源IP地址和网络掩码。"
        }, {
            type: "name",
            title: "目的IP地址范围",
            content: "设置免认证策略的目的IP地址和网络掩码。"
        }, {
            type: "name",
            title: "源MAC地址",
            content: "设置免认证策略的源MAC地址。"
        }, {
            type: "name",
            title: "源端口范围",
            content: "设置免认证策略的源端口范围。"
        }, {
            type: "name",
            title: "目的端口范围",
            content: "设置免认证策略的目的端口范围。"
        }, {
            type: "name",
            title: "服务协议",
            content: "设置免认证策略的服务协议。"
        }, {
            type: "name",
            title: "生效接口域",
            content: "设置免认证策略的生效接口。"
        }, {
            type: "name",
            title: "备注",
            content: "您可以设置免认证策略的备注，以方便您管理和查找。备注最多支持50个字符。"
        }, {
            type: "name",
            title: "状态",
            content: "您可以勾选该项来启用该免认证策略。"
        }]
};

$.su.CHAR.HELP.PORTAL_PARA_VLAN_SSID = {
    TITLE: "认证参数",
    CONTENT: [
        {
            type: "paragraph",
            content: "本页可以进行认证的全局参数的设置。"
        }, {
            type: "name",
            title: "认证老化",
            content: "勾选后开启认证老化功能。"
        }, {
            type: "name", 
            title: "认证老化时间",
            content: "当已认证客户端断开连接后，对应的认证条目的老化时间。客户端在老化时间内重新连接，不需要重新认证，超过老化时间后接入的客户端需要重新认证。"
        }, {
            type: "name",
            title: "Portal认证端口",
            content: "用于Portal认证的服务端口，默认为8080端口。不能与其他的服务端口重复。"
        }, {
            type: "name",
            title: "CMCC Portal认证端口",
            content: "设置AC的CMCC Portal认证端口，用于接收Portal服务器发送的认证报文。"
        }, {
            type: "name",
            title: "CMCC Portal服务器端口",
            content: "设置CMCC Portal服务器的端口号，用于CMCC Portal认证时AC发送NTF_LOGOUT报文的目的端口号。"
        }, {
            type: "name",
            title: "认证模式",
            content: "设置Portal认证的认证模式，现支持基于SSID和基于VLAN两种模式。"
        }
    ]
};

$.su.CHAR.HELP.PORTAL_PARA_INTERFACE = {
    TITLE: "认证参数",
    CONTENT: [
        {
            type: "paragraph",
            content: "本页可以进行认证的全局参数的设置。"
        }, {
            type: "name",
            title: "认证老化",
            content: "勾选后开启认证老化功能。"
        }, {
            type: "name", 
            title: "认证老化时间",
            content: "当已认证客户端断开连接后，对应的认证条目的老化时间。客户端在老化时间内重新连接，不需要重新认证，超过老化时间后接入的客户端需要重新认证。"
        }, {
            type: "name",
            title: "Portal认证端口",
            content: "用于Portal认证的服务端口，默认为8080端口。不能与其他的服务端口重复。"
        }, {
            type: "name",
            title: "认证模式",
            content: "设置Portal认证的认证模式，现支持基于SSID和基于接口两种模式。"
        }
    ]
};

$.su.CHAR.HELP.PORTAL_PARA_INTERFACE_SSID = {
    TITLE: "认证参数",
    CONTENT: [
        {
            type: "paragraph",
            content: "本页可以进行认证的全局参数的设置。"
        }, {
            type: "name",
            title: "认证老化",
            content: "勾选后开启认证老化功能。"
        }, {
            type: "name", 
            title: "认证老化时间",
            content: "当已认证客户端断开连接后，对应的认证条目的老化时间。客户端在老化时间内重新连接，不需要重新认证，超过老化时间后接入的客户端需要重新认证。"
        }, {
            type: "name",
            title: "Portal认证端口",
            content: "用于Portal认证的服务端口，默认为8080端口。不能与其他的服务端口重复。"
        }
    ]
};

$.su.CHAR.HELP.AC_USER_MNGR = {
    TITLE: "用户管理规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来设置和查看本地用户。"
    }, {
        type: "name",
        title: "用户类型",
        content: "分为正式用户和免费用户。"
    }, {
        type: "name",
        title: "用户名",
        content: "自定义的用户名，注意不能与已有用户名重复。"
    }, {
        type: "name",
        title: "密码",
        content: "新增用户时，需要输入密码。修改用户配置时，可以输入新密码，不输入则表示不修改。"
    }, {
        type: "name",
        title: "有效期/上网时长",
        content: "正式用户有效期限。"
    }, {
        type: "name",
        title: "允许认证时间段",
        content: "允许使用该用户名进行认证的时间段。"
    }, {
        type: "name",
        title: "免费时长",
        content: "免费用户上网时间限制。"
    }, {
        type: "name",
        title: "MAC地址绑定方式",
        content: "不绑定：不绑定认证客户端MAC地址。<br/>动态绑定：绑定第一个使用该用户名认证成功的客户端MAC地址。<br/>静态绑定：绑定认证客户端MAC地址。"
    }, {
        type: "name",
        title: "同时登录用户数",
        content: "允许同时使用该用户名认证的客户端最大数目。"
    }, {
        type:"name",
        title:"上行带宽",
        content:"设置用户的上行带宽。取值范围为0或10-1000000Kbps，默认值为0，表示不限速。"  
    }, {
        type:"name",
        title:"下行带宽",
        content:"设置用户的下行带宽。取值范围为0或10-1000000Kbps，默认值为0，表示不限速。"  
    }, {
        type: "name",
        title: "姓名",
        content: "客户姓名备注，可选项。"
    }, {
        type: "name",
        title: "电话",
        content: "客户电话备注，可选项。"
    }, {
        type: "name",
        title: "备注",
        content: "您可以对本地用户进行描述。"
    }, {
        type: "name",
        title: "状态",
        content: "设置该用户是否生效。"
    }, {
        type: "name",
        title: "导入",
        content: "您可以通过合法的ANSI编码格式的CSV文件来一次性导入多个本地用户条目。您可以通过“备份”功能获取符合规则的CSV文件，以查看文件的正确格式。"
    }, {
        type: "name",
        title: "备份",
        content: "您可以通过点击<备份>按钮备份所有的本地用户条目至ANSI编码格式的CSV文件中。备份的文件可直接通过“导入”功能重新添加到用户列表中。"
    }]
};

$.su.CHAR.HELP.AC_AUTHGROUP_CONFIG = {
    TITLE: "服务器组",
    CONTENT: [
        {
            type: "paragraph",
            content: "您可以通过本页面来设置和查看认证服务器组。"
        }, {
            type: "name",
            title: "组名称",
            content: "自定义的认证服务器组名称，注意不能与已有服务器组名称重复。"
        }, {
            type: "name",
            title: "协议类型",
            content: "该组中认证服务器的类型，目前只支持Radius。"
        }, {
            type: "name",
            title: "主服务器",
            content: "选择特定类型的认证服务器为该组的主服务器，主服务器在认证过程中将优先被使用。"
        }, {
            type: "name",
            title: "备用服务器",
            content: "备用服务器在主服务器发生故障时启用，备份服务器为可选项。"
        }, {
            type: "name",
            title: "恢复时间",
            content: "当主服务器发生故障后，重新尝试使用主服务器的时间间隔。"
        }, {
            type: "name",
            title: "备注",
            content: "您可以对认证服务器组进行描述。"
        }
    ]
};

$.su.CHAR.HELP.AC_RADIUS_CONFIG = {
    TITLE: "Radius服务器",
    CONTENT: [
        {
            type: "paragraph",
            content: "您可以添加、修改或者删除一个外部Radius服务器。"
        }, {
            type: "name",
            title: "服务器名称",
            content: "您可以配置Radius服务器的名称。"
        }, {
            type: "name",
            title: "服务器地址",
            content: "设置服务器的地址，IPv4、IPv6地址或者DNS域名。"
        }, {
            type: "name",
            title: "认证端口",
            content: "服务器监听认证报文的端口。"
        }, {
            type: "name",
            title: "计费端口",
            content: "服务器监听计费报文的端口，0表示不启用计费功能。"
        }, {
            type: "name",
            title: "共享密钥",
            content: "Radius服务器配置的共享密钥。"
        }, {
            type: "name",
            title: "重复发送次数",
            content: "当客户端发送请求后，如果没有收到回复，重复发送请求的次数。"
        }, {
            type: "name",
            title: "超时时间",
            content: "当客户端发送请求后，数据包超时时间。"
        }, {
            type: "name",
            title: "NAS IP地址",
            content: "进行Radius认证或计费时，NAS-IP-Address字段的IP地址值（一般填写AC与Radius服务器交互的实际IP地址，也可以为空）。"
        }, {
            type: "name",
            title: "认证方式",
            content: "使用的认证方式，有PAP、CHAP、MSCHAP和MSCHAPv2。"
        }
    ]
};

$.su.CHAR.HELP.MAC_AUTH_GROUP_GLOBAL_HELP = {
    TITLE: "全局设置",
    CONTENT: [{
        type: "paragraph",
        content: "本栏用于设置MAC认证的认证模式。"
    }, {
        type: "name",
        title: "认证模式",
        content: "设置MAC认证的认证模式，现支持基于SSID和基于VLAN两种模式。"
    }]
};

$.su.CHAR.HELP.MAC_AUTH_GROUP_HELP = {
    TITLE: "MAC认证列表",
    CONTENT: [{
        type: "paragraph",
        content: "本栏用于查看MAC认证条目，还可以通过表格按钮进行相关操作。"
    }, {
        type: "name",
        title: "MAC认证名称",
        content: "MAC认证条目的名称，以方便识别。"
    }, {
        type: "name",
        title: "生效VLAN范围",
        content: "MAC认证条目生效的VLAN范围(0-4094)，其中0表示空VLAN。支持数字、区间，并可用英文逗号间隔。输入格式形如：<br>1<br>11-20<br>1,3,5,4090-4094。"
    }, {
        type: "name",
        title: "生效MAC",
        content: "MAC认证条目生效的MAC地址列表。"
    }, {
        type: "name",
        title: "备注",
        content: "MAC认证条目的备注，以方便管理和查找。"
    }, {
        type: "name",
        title: "认证类型",
        content: "黑名单：认证条目下的MAC地址禁止接入。<br>白名单：认证条目下的MAC地址允许接入。"
    }, {
        type: "name",
        title: "状态",
        content: "MAC认证条目处于启用/禁用状态。"
    }]
};

$.su.CHAR.HELP.MAC_AUTH_GROUP_HELP_FOR_SSID = {
    TITLE: "MAC认证列表",
    CONTENT: [{
        type: "paragraph",
        content: "本栏用于查看MAC认证条目，还可以通过表格按钮进行相关操作。"
    }, {
        type: "name",
        title: "MAC认证名称",
        content: "MAC认证条目的名称，以方便识别。"
    }, {
        type: "name",
        title: "生效SSID",
        content: "MAC认证条目生效的SSID范围。"
    }, {
        type: "name",
        title: "生效MAC",
        content: "MAC认证条目生效的MAC地址列表。"
    }, {
        type: "name",
        title: "备注",
        content: "MAC认证条目的备注，以方便管理和查找。"
    }, {
        type: "name",
        title: "认证类型",
        content: "黑名单：认证条目下的MAC地址禁止接入。<br>白名单：认证条目下的MAC地址允许接入。"
    }, {
        type: "name",
        title: "状态",
        content: "MAC认证条目处于启用/禁用状态。"
    }]
};

$.su.CHAR.HELP.MAC_AUTH_MAC_HELP = {
    TITLE: "MAC地址列表",
    CONTENT: [{
        type: "paragraph",
        content: "本栏用于查看MAC地址条目，还可以通过表格按钮进行相关操作。"
    }, {
        type: "name",
        title: "名称",
        content: "设置对象的名称。"
    }, {
        type: "name",
        title: "MAC地址",
        content: "设置对象的MAC地址。"
    }, {
        type: "name",
        title: "导入",
        content: "您可以通过点击<导入>按钮将合法的ANSI编码格式的CSV文件一次性导入多个本地MAC地址条目。您可以通过“备份”功能获取符合规则的CSV文件，以查看文件的正确格式。<br>合法的条目内容如下：<br>MAC地址不冲突、名称不冲突，插入该条目<br>MAC地址冲突、名称不冲突，更新已有条目<br>MAC地址冲突、名称冲突，更新已有条目<br>不合法的条目内容如下：<br>MAC地址不冲突、名称冲突，不更新已有条目。"
    }, {
        type: "name",
        title: "备份",
        content: "您可以通过点击<备份>按钮备份所有的MAC地址条目至ANSI编码格式的CSV文件中。备份的文件可直接通过“导入”功能重新添加到MAC地址列表中。"
    }]
};

$.su.CHAR.HELP.USERMNGR_USER = {
    TITLE: "认证用户规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看认证用户规则。"
    }, {
        type: "name",
        title: "用户类型",
        content: "手动刷新认证用户列表。",
        children:[{
                type: "step",
                content:[
                    "正式用户：存留在系统中的正式用户，具有一定的有效期，且可以绑定相应的设备MAC地址。可以记录更多用户的资料信息。",
                    "免费用户：免费用户具有一定的上网时长限制。"
                ]
        }]
    },{
        type: "name",
        title: "用户名",
        content: "用于认证登录的用户名。"
    }, {
        type: "name",
        title: "密码",
        content: "用户登录所使用的密码。"
    }, {
        type: "name",
        title: "有效期至",
        content: "正式用户的有效期。"
    }, {
        type: "name",
        title: "上网时长",
        content: "免费用户的免费上网时长。"
    }, {
        type: "name",
        title: "允许认证时间段",
        content: "允许用户进行认证的时间。"
    }, {
        type: "name",
        title: "MAC地址绑定方式",
        content: "选择是否绑定MAC地址，以及绑定的方式。",
        children:[{
            type: "step",
            content:[
                "不绑定：不绑定用户的MAC地址。",
                "静态绑定：绑定一个静态的MAC地址。",
                "动态绑定：进行动态绑定。"
            ]
        }]
    }, {
        type: "name",
        title: "同时登录的用户数",
        content: "最多允许同时使用该账号登录的用户数量。"
    }, {
        type: "name",
        title: "上行带宽",
        content: "当前用户允许的上行带宽，以Kbps为单位，0表示不限制。当开启此功能时，系统默认的NAT加速功能将会被关闭，因此转发性能会受到一定程度的影响。"
    }, {
        type: "name",
        title: "下行带宽",
        content: "当前用户允许的下行带宽，以Kbps为单位，0表示不限制。当开启此功能时，系统默认的NAT加速功能将会被关闭，因此转发性能会受到一定程度的影响。"
    }, {
        type: "name",
        title: "姓名",
        content: "可选记录当前用户姓名。"
    }, {
        type: "name",
        title: "电话",
        content: "可选记录当前用户电话。"
    }, {
        type: "name",
        title: "备注",
        content: "可选记录当前用户备注。"
    }, {
        type: "name",
        title: "状态",
        content: "是否启用当前用户规则。"
    }]
};

$.su.CHAR.HELP.USERMNGR_USER_BK = {
    TITLE: "备份配置信息",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来备份和下载用户配置信息。"
    }, {
        type: "name",
        title: "备份",
        content: "点击<备份>按钮来备份和下载用户配置信息。"
    },{
        type: "name",
        title: "导入",
        content: "点击<导入>按钮来导入用户配置信息。"
    }
    ]
};

$.su.CHAR.HELP.USER_LIST =
{
    TITLE: "用户管理规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来设置和查看本地用户。"
    }, {
        type: "name",
        title: "用户类型",
        content: "分为正式用户和免费用户。"
    }, {
        type: "name",
        title: "用户名",
        content: "自定义的用户名，注意不能与已有用户名重复。"
    }, {
        type: "name",
        title: "密码",
        content: "新增用户时，需要输入密码。修改用户配置时，可以输入新密码，不输入则表示不修改。"
    }, {
        type: "name",
        title: "有效期/上网时长",
        content: "正式用户有效期限。"
    }, {
        type: "name",
        title: "允许认证时间段",
        content: "允许使用该用户名进行认证的时间段。"
    }, {
        type: "name",
        title: "免费时长",
        content: "免费用户上网时间限制。"
    }, {
        type: "name",
        title: "MAC地址绑定方式",
        content: "不绑定：不绑定认证客户端MAC地址。<br/>动态绑定：绑定第一个使用该用户名认证成功的客户端MAC地址。<br/>静态绑定：绑定认证客户端MAC地址。"
    }, {
        type: "name",
        title: "同时登录用户数",
        content: "允许同时使用该用户名认证的客户端最大数目。"
    }, {
        type: "name",
        title: "姓名",
        content: "客户姓名备注，可选项。"
    }, {
        type: "name",
        title: "电话",
        content: "客户电话备注，可选项。"
    }, {
        type: "name",
        title: "备注",
        content: "您可以对本地用户进行描述。"
    }, {
        type: "name",
        title: "状态",
        content: "设置该用户是否生效。"
    }]
};

// =======av_profile.js=====
$.su.CHAR.HELP.AV_PROFILE= {
    TITLE: "反病毒配置文件",
    CONTENT: [
        {
            type: "name",
            title: "名称",
            content: "反病毒配置文件名称"
        },
        {
            type: "name",
            title: "描述",
            content: "反病毒配置文件具体介绍"
        },
        {
            type: "name",
            title: "协议",
            content: "支持病毒检测的协议类型"
        },
        {
            type: "name",
            title: "上传",
            content: "从客户端到服务器方向"
        },
        {
            type: "name",
            title: "下载",
            content: "从服务器到客户端方向"
        },
        {
            type: "name",
            title: "动作",
            content: "检测到病毒时,防火墙的处理动作"
        },
        {
            type: "name",
            title: "应用例外",
            content: "对于选定应用中发现的病毒文件采取例外动作"
        },
        {
            type: "name",
            title: "病毒例外",
            content: "对于指定id的病毒不进行处理, 可以通过日志获取并添加例外病毒id"
        },
        {
            type: "name",
            title: "功能测试",
            content: "可以通过eicar测试文件验证反病毒功能是否正常生效"
        }
    ]
};

// =======behave_audit.js=====
$.su.CHAR.HELP.ACTION_CHECK = {
	"TITLE": "上网行为分析", 
	"CONTENT": [
		{
			"type": "paragraph", 
			"content": "您可以通过本页面来设置行为审计功能。"
		}, 
		{
			"type": "name", 
			"title": "上传用户上网行为", 
			"content": "打开或者关闭上传用户上网行为的功能。"
		}, 
		{
			"type": "name", 
			"title": "行为审计服务器地址", 
			"content": "设备会将用户上网行为信息上传至该服务器，并通过TP-LINK上网行为审计软件输出审计结果。"
		}, 
		{
			"type": "note", 
			"title": "注意", 
			"content": [
				"若需要在某台主机上查看用户上网行为信息，请首先在这台主机上安装TP-LINK上网行为审计软件。"
			]
		}
	]
};
// =======certificate.js=====
$.su.CHAR.HELP.SSL_CERTIFICATE= {
    TITLE: "SSL证书",
    CONTENT: [
        {
            type: "name",
            title: "证书名称",
            content: "SSL证书名称"
        },
        {
            type: "name",
            title: "主题项-DN",
            content: "请到help.js填写"
        },
        {
            type: "name",
            title: "证书标记",
            content: "表明该证书是可信证书还是不可信证书"
        },
        {
            type: "name",
            title: "查看详细",
            content: "显示证书的详细信息"
        },
        {
            type: "name",
            title: "下载",
            content: "可以下载该证书"
        },
        {
            type: "name",
            title: "设置",
            content: "请到help.js填写"
        }
    ]
};

$.su.CHAR.HELP.CA_CERTIFICATE = {
    TITLE  : "CA证书",
    CONTENT: [
        {
            type   : "name",
            title  : "证书名称",
            content: "CA证书名称"
        },
        {
            type    : "name",
            title   : "上传",
            content : "点击上传按钮，将弹出上传对话框；按要求填写待上传证书内容，点击确认即可完成上传。",
            children: [{
                type   : "step",
                content: [
                    "证书文件： 支持的证书文件后缀为.cer .der .pem .crt .p12 .pfx。",
                    "密码： 仅pkcs12格式的证书文件导入时会对此值进行校验，其他格式的证书导入时会忽略此值。"
                ]
            }]
        }
    ]
};

// =======cloud.js=====
$.su.CHAR.HELP.CLOUD_MANAGEMENT = {
	TITLE: "云管理",
	CONTENT: [
		{
			type: "paragraph",
			content: "您可以通过本页面进行云配置管理。"
		}, {
			type: "name",
			title: "云管理",
			content: "云管理功能状态开关。云管理功能启用后，设备可以被添加绑定到TP-LINK商用网络云平台的某个项目中。"
		}, {
			type: "note",
			title: "注意",
			content: "修改云管理配置，设备将自动保存云管理和认证等相关配置。"
		}
	]
};

$.su.CHAR.HELP.CLOUD_MANAGEMENT_WITH_PRIVATE_CLOUD = {
	TITLE: "云管理",
	CONTENT: [
		{
			type: "paragraph",
			content: "您可以通过本页面进行云配置管理。"
		}, {
			type: "name",
			title: "云管理",
			content: "云管理功能状态开关。云管理功能启用后，设备可以被添加绑定到TP-LINK商用网络云平台或TP-LINK本地NMS管理平台的某个项目中。"
		}, {
			type: "name",
			title: "云类型",
			content: "云服务器类型。",
			children: [{
			type: "step",
			content: [
			"TP-LINK本地NMS管理平台：基于企业私有云管理架构的TP-LINK网络设备管理服务，可部署至企业本地物理服务器或虚拟机。",
			"TP-LINK商用网络云平台：基于公有云管理架构的TP-LINK网络设备云管理平台。"
			]
		}]
		}
	]
};

$.su.CHAR.HELP.PRIVATE_CLOUD_CONFIG = {
	TITLE: "TP-LINK本地NMS管理平台设置",
	CONTENT: [
		 {
			type: "name",
			title: "服务器地址",
			content: "TP-LINK本地NMS管理平台服务器的地址。"
		}, {
			type: "name",
			title: "端口",
			content: "TP-LINK本地NMS管理平台服务器的端口。"
		}, {
			type: "name",
			title: "描述",
			content: "TP-LINK本地NMS管理平台服务器的描述信息。"
		}, {
			type: "note",
			title: "注意",
			content: "修改云管理配置，设备将自动保存云管理和认证等相关配置。"
		}
	]
};

// =======cmxddns.js=====
$.su.CHAR.HELP.CMXDDNS = {
         TITLE: "科迈动态域名",
         CONTENT: [{
             type: "paragraph",
             content: "通过DDNS（Dynamic DNS，动态域名解析服务），您可以将固定域名与动态IP进行绑定，使Internet用户可以通过域名来访问设备或内网主机。您可以通过本页面登录科迈动态域名服务器，开启科迈动态域名服务。"
         },{
             type: "name",
             title: "服务接口",
             content: "科迈动态域名服务生效的接口。"
         },{
             type: "name",
             title: "用户名",
             content: "科迈动态域名服务账户的用户名。"
         },{
             type: "name",
             title: "密码",
             content: "科迈动态域名服务账户的密码。"
         },{
             type: "name",
             title: "启用/禁用",
             content: "选择是否在添加该账户后立即登录科迈动态域名服务器，开启动态域名服务。"
         },{
             type: "name",
             title: "域名",
             content: "从DDNS服务器获取的域名服务列表，最多可以显示16条域名信息。"
         } ]
};

// =======content_log.js=====
$.su.CHAR.HELP.CONTENTLOG =
{
	TITLE: "内容日志",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看内容日志。"
	},
	{
		type: "name",
		title: "时间",
		content: "日志时间。"
	},
	{
		type: "name",
		title: "类型",
		content: "内容日志对应的内容或应用行为控制的类型"
	},
	{
		type: "name",
		title: "文件名",
		content: "数据流包含的文件的名称"
	},
	{
		type: "name",
		title: "文件名",
		content: "数据流包含的文件的类型"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "数据流目的地址。"
	},
	{
		type: "name",
		title: "源端口",
		content: "数据流源端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "目的端口",
		content: "数据流目的端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "用户",
		content: "数据流对应用户。"
	},
	{
		type: "name",
		title: "协议",
		content: "数据流协议。"
	},
	{
		type: "name",
		title: "应用",
		content: "数据流应用"
	},
	{
		type: "name",
		title: "动作",
		content: "数据流处理的动作"
	},
	{
		type: "name",
		title: "安全策略",
		content: "命中的安全策略名称。"
	},
	{
		type: "name",
		title: "详细信息",
		content: "点击查看检测到威胁的详细信息"
	},
	{
		type: "name",
		title: "导出日志",
		content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志"
	}]
};
// =======dhcpd.js=====
$.su.CHAR.HELP.DHCP_SERVER_ABILITY_SETTINGS = 
{
	TITLE: "功能设置",
	ID: "help_global_settings",
	CONTENT: [
		{
			type: "paragraph", 
			content: "本栏用于设置IP分配范围。"
		}, 
		{
			type: "name", 
			title: "仅为AP分配",
			content: "DHCP服务器只能为TP-LINK系列AP分配IP地址。"
		}, 
		{
			type: "name", 
			title: "为AP和用户终端分配",
			content: "DHCP服务器可以为所有客户端分配IP地址。"
		}
	]
};

$.su.CHAR.HELP.DHCP_SERVER_SETTINGS = 
{
	TITLE: "DHCP服务列表",
	CONTENT: [
		{
			type: "paragraph",
			content: "本栏用于查看DHCP服务的相关信息，还可以通过表格按钮进行相关操作。"
		},
		{
			type: "name",
			title: "服务接口",
			content: "选择需要提供DHCP服务的Ethernet接口。"
		},
		{
			type: "name",
			title: "开始/结束地址",
			content: "DHCP服务器自动分配的IP的开始/结束地址。"
		},
		{
			type: "name",
			title: "地址租期",
			content: "DHCP服务器所分配IP地址的有效使用时间，超时将重新分配。"
		},
		{
			type: "name",
			title: "网关地址",
			content: "输入此地址池给客户端分配的默认网关，建议填入当前DHCP服务生效接口的IP地址。"
		},
		{
			type: "name",
			title: "缺省域名",
			content: "输入此地址池给客户指定的域，与IP地址一样共同表示相同子网的计算机集合，同一接口网络中的计算机通常配置为相同的域名。"
		},
		{
			type: "name",
			title: "首选DNS服务器",
			content: "输入此地址池给客户端分配的首选DNS服务器，也可以将接口IP地址配置为DNS服务器地址，并由接口为客户端转发域名解析请求。"
		},
		{
			type: "name",
			title: "备用DNS服务器",
			content: "输入此地址池给客户端分配的备用DNS服务器，当首选DNS服务器失效时，客户端可以向备用DNS服务器申请域名解析。"
		},
		{
			type: "name",
			id: "help_option60",
			title: "Option60",
			content: "可选项，请填入厂商信息。具体厂商信息请咨询相关厂商，例如TP-LINK的厂商信息为TP-LINK。"
		},
		{
			type: "name",
			id: "help_option138",
			title: "Option138",
			content: "可选项，请填入AC（无线控制器）IP地址。"
		},
		{
			type: "name",
			title: "状态",
			content: "勾选后开启DHCP服务。"
		},
		{
			type: "note",
			title: "注意",
			content: "DHCP服务的服务接口IP和开始/结束地址必须在同一网段，否则DHCP服务不生效。"
		}
	]
};


$.su.CHAR.HELP.DHCP_SERVER_SETTINGS_V6 = 
{
	TITLE: "DHCPv6服务列表",
	CONTENT: [
		{
			type: "paragraph",
			content: "本栏用于查看DHCPv6服务的相关信息，还可以通过表格按钮进行相关操作。"
		},
		{
			type: "name",
			title: "服务接口",
			content: "选择需要提供DHCPv6服务的Ethernet接口。"
		},
		{
			type: "name",
			title: "开始/结束地址",
			content: "DHCPv6服务器自动分配的IPv6的开始/结束地址。"
		},
		{
			type: "name",
			title: "地址租期",
			content: "DHCPv6服务器所分配IPv6地址的有效使用时间，超时将重新分配。"
		},
		{
			type: "name",
			title: "首选DNS服务器",
			content: "输入此地址池给客户端分配的首选DNS服务器，也可以将接口IPv6地址配置为DNS服务器地址，并由接口为客户端转发域名解析请求。"
		},
		{
			type: "name",
			title: "备用DNS服务器",
			content: "输入此地址池给客户端分配的备用DNS服务器，当首选DNS服务器失效时，客户端可以向备用DNS服务器申请域名解析。"
		},
		{
			type: "name",
			id: "help_option16",
			title: "Option16",
			content: "可选项，请填入厂商信息。具体厂商信息请咨询相关厂商，例如TP-LINK的厂商信息为TP-LINK。"
		},
		{
			type: "name",
			id: "help_option52",
			title: "Option52",
			content: "可选项，请填入AC（无线控制器）IPv6地址。"
		},
		{
			type: "name",
			title: "状态",
			content: "勾选后开启DHCPv6服务。"
		},
		{
			type: "note",
			title: "注意",
			content: "DHCPv6服务的服务接口IPv6地址和开始/结束地址必须在同一网段，否则DHCPv6服务不生效。"
		}
	]
};


$.su.CHAR.HELP.DHCP_SERVER_LAN_SETTINGS = 
{
	TITLE: "功能设置", 
	CONTENT: [
		{
			type: "paragraph", 
			content: "本栏用于设置DHCP服务。"
		}, 
		{
			type: "name", 
			title: "IP分配范围", 
			content: "现支持两种方式：仅为AP分配和为AP和用户终端分配。仅为AP分配代表DHCP服务器只能为TP-LINK系列AP分配IP地址，为AP和用户终端分配代表DHCP服务器可以为所有客户端分配IP地址。"
		}, 
		{
			type: "name", 
			title: "开始/结束地址", 
			content: "DHCP服务器自动分配的IP的开始/结束地址。"
		}, 
		{
			type: "name", 
			title: "地址租期", 
			content: "DHCP服务器所分配IP地址的有效使用时间，超时将重新分配。"
		}, 
		{
			type: "name", 
			title: "网关地址", 
			content: "可选项，请根据实际的网络环境进行填写。"
		}, 
		{
			type: "name", 
			title: "缺省域名", 
			content: "可选项，请填入本地网域名。"
		}, 
		{
			type: "name", 
			title: "首选/备用DNS服务器", 
			content: "可选项，请填入ISP提供的DNS服务器，若不清楚请向ISP询问。"
		}, 
		{
			type: "name", 
			title: "状态", 
			content: "勾选后开启DHCP服务。"
		}
	]
};


$.su.CHAR.HELP.DHCP_CLIENT_LIST = 
{
	TITLE: "客户端列表", 
	CONTENT: [
		{
			type: "paragraph", 
			content: "本栏用于查看DHCP的客户端相关信息。"
		}, 
		{
			type: "name", 
			title: "服务接口",
			id: "help_interface",
			content: "客户端主机所属的服务接口。"
		},
		{
			type: "name",
			title: "主机名",
			content: "通过DHCP获得IP地址的主机的名称，可用于识别不同的接入设备。"
		}, 
		{
			type: "name", 
			title: "MAC地址", 
			content: "分配到IP地址的客户端主机的MAC地址。"
		}, 
		{
			type: "name", 
			title: "IP地址", 
			content: "DHCP服务器分配给客户端主机的IP地址。"
		}, 
		{
			type: "name", 
			title: "剩余租期", 
			content: "DHCP服务器所分配IP地址的剩余有效使用时间，超时将重新分配。"
		}
	]
};

$.su.CHAR.HELP.DHCP_CLIENT_LIST_V6 = 
{
	TITLE: "客户端列表", 
	CONTENT: [
		{
			type: "paragraph", 
			content: "本栏用于查看DHCPv6的客户端相关信息。"
		}, 
		{
			type: "name", 
			title: "服务接口",
			id: "help_interface",
			content: "客户端主机所属的服务接口。"
		},
		{
			type: "name",
			title: "主机名",
			content: "通过DHCPv6获得IPv6地址的主机的名称，可用于识别不同的接入设备。"
		}, 
		{
			type: "name", 
			title: "MAC地址", 
			content: "分配到IPv6地址的客户端主机的MAC地址。"
		}, 
		{
			type: "name", 
			title: "IP地址", 
			content: "DHCPv6服务器分配给客户端主机的IPv6地址。"
		}, 
		{
			type: "name", 
			title: "剩余租期", 
			content: "DHCPv6服务器所分配IPv6地址的剩余有效使用时间，超时将重新分配。"
		}
	]
};

$.su.CHAR.HELP.DHCP_STATIC = 
{
	TITLE: "静态地址分配",
	CONTENT: [
		{
			type: "paragraph",
			content: "本栏用于显示静态地址分配相关信息，还可以通过表格按钮进行相关操作。为指定的MAC地址预留IP地址后，当该主机向DHCP服务器请求分配IP时，服务器将为其分配预留的IP地址。"
		}, 
		{
			type: "name",
			title: "MAC地址",
			content: "预留IP地址的主机MAC地址。"
		}, 
		{
			type: "name",
			title: "IP地址",
			content: "为指定主机预留的IP地址。"
		}, 
		{
			type: "name",
			title: "备注",
			content: "您可以设置静态地址分配条目备注，以方便您管理和查找。备注最多支持32个字符。"
		}, 
		{
			type: "name",
			title: "状态",
			content: "您可以通过启用/禁用来选择是否使该条目生效。"
		}, 
		{
			type: "name",
			id: "help_import",
			title: "导入",
			content: "点击<导入>按钮导入多个静态地址条目。您可以通过“备份”功能获取符合规则的CSV文件，以查看文件的正确格式。<br>文件格式示例(必须包含首行提示栏)：<br>状态,MAC地址,IP地址,备注<br>1,XX-XX-XX-XX-XX-XX,192.168.1.100,TP-LINK"
		}, 
		{
			type: "name",
			id: "help_export",
			title: "备份",
			content: "点击<备份>按钮备份所有静态地址条目。备份文件可直接通过“导入”功能重新添加到静态地址列表中。"
		}
	]
};

$.su.CHAR.HELP.DHCP_STATIC_V6 = 
{
	TITLE: "静态地址分配",
	CONTENT: [
		{
			type: "paragraph",
			content: "本栏用于显示静态地址分配相关信息，还可以通过表格按钮进行相关操作。为指定的MAC地址预留IPv6地址后，当该主机向DHCPv6服务器请求分配IP时，服务器将为其分配预留的IPv6地址。"
		}, 
		{
			type: "name",
			title: "MAC地址",
			content: "预留IPv6地址的主机MAC地址。"
		}, 
		{
			type: "name",
			title: "IP地址",
			content: "为指定主机预留的IPv6地址。"
		}, 
		{
			type: "name",
			title: "备注",
			content: "您可以设置静态地址分配条目备注，以方便您管理和查找。备注最多支持32个字符。"
		}, 
		{
			type: "name",
			title: "状态",
			content: "您可以通过启用/禁用来选择是否使该条目生效。"
		}, 
		{
			type: "name",
			id: "help_import",
			title: "导入",
			content: "点击<导入>按钮导入多个静态地址条目。您可以通过“备份”功能获取符合规则的CSV文件，以查看文件的正确格式。<br>文件格式示例(必须包含首行提示栏)：<br>状态,MAC地址,IP地址,备注<br>1,XX-XX-XX-XX-XX-XX,2000:1:2:3:4:5:6:7,TP-LINK"
		}, 
		{
			type: "name",
			id: "help_export",
			title: "备份",
			content: "点击<备份>按钮备份所有静态地址条目。备份文件可直接通过“导入”功能重新添加到静态地址列表中。"
		}
	]
};
// =======diagnostic.js=====
$.su.CHAR.HELP.DIA_ENABLE = {
    TITLE: "故障诊断",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来打开/关闭故障诊断模式。"
    }, {
        type: "name",
        title: "故障诊断模式",
        content: "开启本功能后可以配合技术支持人员对设备进行诊断。",
        children:[{
            type: "step",
            content:[
                "勾选表示开启诊断模式。",
                "取消勾选表示诊断模式关闭。"
            ]
        }]
    }, {
		type: "name",
		title: "AP调试日志收集",
		id: "help_aplog_collect",
		content: "开启/关闭AP调试日志收集功能，方便定位AP问题。",
		children: [{
			type: "step",
			content: [
				"发送至本设备/日志服务器：AP是否需要将日志发送给本设备或指定的日志服务器。",
				"日志上报等级：设置AP上报的日志等级，AP将不会上报小于该等级的日志。",
				"日志上报间隔：设置AP上报给日志服务器的时间间隔。",
				"远程服务器地址：设置AP上报的日志服务器地址。"
			]
		}]
	}, {
        type: "name",
        title: "诊断信息",
        content: "点击按钮下载基本的诊断信息，将其提供给技术人员以协助您分析和解决问题。"
    }, {
        type: "name",
        title: "一键清理",
		id: "help_clear_diagnose_data",
        content: "点击按钮进行设备清理，以协助解决问题。该功能需在技术支持人员的协助下使用。"
    },
    {
        type: "note",
        title: "注意",
        content: [
            "一般情况下请不要随意开启本功能。",
            "需要诊断时，请先联系技术支持人员，在其协助下打开并使用本功能。"
        ]
    }]
};

$.su.CHAR.HELP.DIGNOSTIC = {
    TITLE: "诊断工具",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过诊断工具来检测和诊断当前的网络状况。"
    }, {
        type: "name",
        title: "诊断工具类型",
        content: "用于诊断网络状况的方式。有下面两种：",
        children: [{
            type: "step",
            content: [
                "PING通信检测。",
                "路由跟踪检测。"
            ]
        }]
    },{
        type: "name",
        title: "目的IP/域名",
        content: "需要进行Ping通信检测或者路由跟踪检测的主机地址，支持IP地址和域名。"
    }, {
        type: "name",
		id:"help_interface",
        title: "出接口",
        content: "需要进行Ping通信检测或者路由跟踪检测的接口。"
    },{
        type: "name",
        title: "PING次数",
        content: "设置Ping通信检测时发送Ping包的数量。"
    }, {
        type: "name",
        title: "PING数据包大小",
        content: "设置Ping通信检测时发送的Ping包的大小。"
    },{
        type: "name",
        title: "路由跟踪最大TTL",
        content: "设置路由跟踪检测发送数据包在网络中的最大转发跳数。"
    }]
}

// =======disk_mngt.js=====
$.su.CHAR.HELP.DISK_MNGT = {
    TITLE: "存储设备管理",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备中的存储设备（硬盘/SD卡）的状态并对其进行管理。"
    }, 
    {
        type: "name",
        title: "存储设备状态",
        content: "设备中存储设备的状态"
    },
    {
        type: "name",
        title: "空间使用率",
        content: "存储设备已使用的空间比例"
    },
    {
        type: "name",
        title: "挂载",
        content: "点击<挂载>按钮来进行存储设备挂载操做。"
    },
    {
        type: "name",
        title: "卸载",
        content: "点击<挂载>按钮来进行存储设备卸载操做。"
    },
    {
        type: "name",
        title: "重置",
        content: "点击<重置>按钮来进行存储设备重置操做，重置会清除存储器中的所有数据，请谨慎操做。"
    },
    {
        type: "note",
        title: "提示",
        content: [
            "首次插入的存储设备在挂载时会进行初始化，此时会清空插入设备中的所有数据。",
            "请确保在进行存储设备的操做的过程中，不要将设备断电，不要拔出存储器。",
        ]
    }]
};

$.su.CHAR.HELP.LOG_STORAGE = {
    TITLE: "存储管理",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备中的日志/报表存储状态并对各类日志/报表的存储空间进行管理。"
    },
    {
        type: "name",
        title: "告警阈值设置",
        content: "当任何一类日志/报表的存储空间达到或超过配置的“告警阈值”时(例如流量日志分配了10%的存储空间\
        配置告警阈值为85%，当其实际存储空间达到8.5%时)，系统会定时产生告警日志通知管理员尽快进行清理。"
    },
    {
        type: "name",
        title: "存储策略设置",
        content: "设置硬盘空间满时的日志/报表处理方式: <覆盖>新产生的日志/报表覆盖旧数据；<丢弃>不存储新产生的日志/报表。"
    },
    {
        type: "name",
        title: "存储空间列表",
        content: "您可以通过该列表查看各类日志/报表当前使用空间大小并对每一类数据的最大可用空间进行配置。"
    }
    ]
}
// =======dns.js=====
$.su.CHAR.HELP.DNS_SETTING_HELP = {
     TITLE: "DNS代理",
     CONTENT: [{
          type: "paragraph",
          content: "您可以通过本页面设置进行DNS代理设置。"
     },
     {
          type: "name",
          title: "DNS TTL",
          content: "设置DNS TTL, 单位:秒, 范围:0~3600, 0为不设置。"
      }]
};

$.su.CHAR.HELP.DNS_RULE_LIST_HELP = {
     TITLE: "DNS代理列表",
     CONTENT:[
     {
         type: "paragraph",
         content: "您可以通过本页面查看DNS代理列表。"
     },
     {
          type:"name",
          title:"规则名称",
          content:"为DNS代理条目设置的规则名称。"
     },
     {
          type:"name",
          title:"服务接口",
          content:"配置DNS代理条目的接口。"
     },
     {
          type:"name",
          title:"出接口",
          content:"配置DNS代理条目的Ethernet接口，也可选择自动（auto）。"
     }]
};

$.su.CHAR.HELP.DNS_SMART_HELP = {
     TITLE: "智能DNS",
     CONTENT: [
     {
          type: "paragraph",
          content: "您可以通过本页面设置进行智能DNS设置，导入自定义数据库。"
     },
     {
          type: "name",
          title: "智能DNS",
          content: "您可以勾选此项，使智能DNS功能生效。"
     },
     {
         type: "name",
         title: "用户自定义数据库",
         content: "自定义数据库文件格式为每行由“IP/mask”组成，如“12.12.12.12/24”，总个数不超过2048条。文件格式为txt格式。"
     },
     {
         type: "note",
         title: "注意",
         content: [
             "该功能用于智能解析国内和国外域名。开启该功能，系统默认创建一条ISP规则(接口为:VPN，ISP为:\"其它\")。请根据实际需求选择是否开启。"
         ]
     }]
};

$.su.CHAR.HELP.DNS_MAP_LIST_HELP = {
     TITLE: "域名映射列表",
     CONTENT: [{
          type: "paragraph",
          content: "您可以查看域名映射条目，还可以通过表格按钮对条目进行操作。"
     },
     {
          type: "name",
          title: "域名",
          content: "需映射的域名。如www.tp-link.com.cn,也可以在域名前面加通配符'*'，如*.tp-link.com.cn。但是'*'只允许输入在最前面，而不能夹杂在域名中间或后面。"
     },
     {
          type: "name",
          title: "IP地址",
          content: "域名映射到的IP地址。"
      },
      {
          type: "name",
          title: "状态",
          content: "您可以选择该映射条目是否生效。"
      }]
};

$.su.CHAR.HELP.DNS_POLICY_LIST_HELP = {
     TITLE: "域名策略列表",
     CONTENT: [{
          type: "paragraph",
          content: "您可以查看域名策略条目，还可以通过表格按钮对条目进行操作。"
     },
     {
          type: "name",
          title: "域名",
          content: "域名。如www.tp-link.com.cn,也可以在域名前面加通配符'*'，如*.tp-link.com.cn。但是'*'只允许输入在最前面，而不能夹杂在域名中间或后面。"
      },
     {
          type: "name",
          title: "出接口",
          content: "域名查询时的出接口。"
      },
      {
          type: "name",
          title: "状态",
          content: "您可以选择该策略条目是否生效。"
      }]
};

// =======dnsproxy.js=====
$.su.CHAR.HELP.DNS_PROXY = {
        TITLE: "DNS代理列表",
        CONTENT:[{
            type: "paragraph",
            content: "您可以通过本页面查看DNS代理列表。"
        },{
             type:"name",
             title:"规则名称",
             content:"为DNS代理条目设置的规则名称。"
        },{
             type:"name",
             title:"服务接口",
             content:"配置DNS代理条目的接口。"
        },{
             type:"name",
             title:"出接口",
             content:"配置DNS代理条目的Ethernet接口，也可选择自动（auto）。"
        }]
};

// =======dyn3322ddns.js=====
$.su.CHAR.HELP.DYN3322DDNS = {
         TITLE: "3322动态域名",
         CONTENT: [{
             type: "paragraph",
             content: "通过DDNS（Dynamic DNS，动态域名解析服务），您可以将固定域名与动态IP进行绑定，使Internet用户可以通过域名来访问设备或内网主机。您可以通过本页面登录3322动态域名服务器，开启3322动态域名服务。"
         },{
             type: "name",
             title: "服务接口",
             content: "3322动态域名服务生效的接口。"
         },{
             type: "name",
             title: "用户名",
             content: "3322动态域名服务账户的用户名。"
         },{
             type: "name",
             title: "密码",
             content: "3322动态域名服务账户的密码。"
         },{
             type: "name",
             title: "启用/禁用",
             content: "选择是否在添加该账户后立即登录3322动态域名服务器，开启动态域名服务。"
         },{
             type: "name",
             title: "域名信息",
             content: "用户名绑定的域名信息。"
         } ]
};

// =======firmware_backuprestore.js=====
$.su.CHAR.HELP.BACKUP_RESTORE = {
    TITLE: "备份与导入配置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面保存或恢复您的配置。"
    }, {
        type: "name",
        title: "备份配置信息",
        content: "您可以通过点击<备份>按钮来保存您当前的配置信息。设备将以文件的形式保存您的设置，建议您在进行软件升级前进行备份。"
    }, {
        type: "name",
        title: "导入配置信息",
        content: "您可以通过浏览选择配置文件后点击<导入>按钮，导入配置文件来恢复您的配置信息。"
    }, {
        type: "note",
        title: "注意",
        content: [
            "如果您导入的配置文件版本与现有版本差距过大，有可能导致配置信息丢失。",
            "导入配置信息后，设备将自动重启。"
        ]
    }]
};

$.su.CHAR.HELP.FACTORY = {
    TITLE: "恢复出厂配置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过恢复出厂配置，将设备的所有配置重置为出厂时的默认配置。"
    }, {
        type: "name",
        title: "恢复出厂配置",
        content: "点击<恢复出厂配置>来进行设备恢复出厂配置。"
    }, {
        type: "note",
        title: "注意",
        content: [
            "恢复出厂配置后，当前的配置信息将会丢失。如果您想保留当前配置，请注意备份。",
            "恢复出厂配置后，设备将自动重启。"
        ]
    }]
};

$.su.CHAR.HELP.REBOOT = {
    TITLE: "重启设备",
    CONTENT: [{
        type: "paragraph",
        content: "设备的部分配置修改需要重启设备才能生效，您可以通过本页面来重启设备。"
    }, {
        type: "name",
        title: "重启设备",
        content: "点击<重启设备>按钮来完成设备的重启。"
    }, {
        type: "note",
        title: "注意",
        content: "在设备重启过程中，请不要将设备断电！"
    }]
};

$.su.CHAR.HELP.FIRMWARE = {
	TITLE: "软件升级",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来进行软件升级。建议您进行软件升级前，先备份您的配置信息。"
        }, {
            type: "name",
            title: "当前软件版本",
            content: "设备的软件版本。"
        },
        {
            type: "name",
            title: "检测新版本",
            content: "点击<检测新版本>按钮向云端检测是否存在更新版本的软件。"
        },
        {
            type: "name",
            title: "最新软件版本",
            content: "从云端获取到的最新的软件版本。"
        },
        {
            type: "name",
            title: "软件更新说明",
            content: "最新版本软件的更新说明。"
        },
        {
            type: "name",
            title: "在线升级",
            content: "点击<在线升级>按钮后设备将自动从云端下载最新版本的软件并升级。"
        },
        {
            type: "name",
            title: "当前硬件版本",
            content: "设备的硬件版本。"
        }, {
            type: "name",
            title: "升级文件路径",
            content: "您可以在此选择升级文件后点击<升级>按钮来进行软件升级。"
        }, {
            type: "note",
            title: "提示",
            content: [
                "使用在线升级的时候请确保设备正常联网。",
                "请确保在设备升级过程中，不要将设备断电，不要对页面进行刷新。升级完毕，设备将自动重启。",
                "您可以到网址<a href=\"http:\/\/www.tp-link.com.cn\" target=\"_blank\">www.tp-link.com.cn</a>下载最新的升级软件。"
            ]
        }, {
            type: "note",
            title: "注意",
            content: [
                "在设备升级过程中，请不要将设备断电。",
                "进行软件升级后，当前的配置信息可能会丢失。请您在升级前备份产品配置信息。"
            ]
        }]
};

$.su.CHAR.HELP.SYSTEM_MANAGEMENT_DEV_INFO = {
	TITLE: "设备信息设置",
	CONTENT: [
		{
			type: "name",
			title: "设备名称",
			content: "设置设备名称用于标示区分，默认为设备机型名。"
		}
	]
};

// =======ifstat.js=====
$.su.CHAR.HELP.IFSTAT = {
    TITLE: "流量统计列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备各接口的流量信息。"
    },{
        type: "name",
        title: "清空",
        content: "点击清空按钮可以清空设备各接口的流量统计信息。"
    },{
        type: "name",
        title: "接口",
        content: "接口名称。"
    },{
        type: "name",
        title: "发送速率",
        content: "各接口的数据发送速率。"
    },{
        type: "name",
        title: "接收速率",
        content: "各接口的数据接收速率。"
    },{
        type: "name",
        title: "发送包速率",
        content: "各接口的数据包发送速率。"
    },{
        type: "name",
        title: "接收包速率",
        content: "各接口的数据包接收速率。"
    },{
        type: "name",
        title: "发送总字节",
        content: "各接口发送数据的字节总数。"
    },{
        type: "name",
        title: "接收总字节",
        content: "各接口接收数据的字节总数。"
    },{
        type: "name",
        title: "发送总报文",
        content: "各接口发送数据的报文总数。"
    },{
        type: "name",
        title: "接收总报文",
        content: "各接口接收数据的报文总数。"
    },{
        type: "note",
        title: "注意",
        content: "点击表头中的文字，可以对该列进行升序/降序排序。"
    }]
}
// =======intrusion_prevention.js=====
$.su.CHAR.HELP.IPS_PROFILE_NON_STANDARD_PORT_DETECTION = {
    TITLE: "功能设置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置 IPS 配置文件列表，并在安全策略中引用。"
    },
/*    {
        type: "name",
        title: "检测非标准端口上的常见协议",
        content: "开启后，可以在没有预先定义端口时检测非标准端口上的 HTTP 等协议，使得规则覆盖面更大。开启此选项可能会影响性能。"
    }*/]
};

$.su.CHAR.HELP.IPS_PROFILE_LIST = {
    TITLE: "配置文件列表",
    CONTENT: [
        {
            type: "name",
            title: "名称",
            content: "设置本配置文件的名称。"
        }, {
            type: "name",
            title: "恶意域名检测",
            content: "选中后，该配置文件还会同时检测对恶意域名的访问。访问恶意域名的流量将被立即阻断。该功能需要具有有效的“恶意域名远程查询”授权、安装了“恶意域名特征库”，且与互联网连接时才有效。"
        }, {
            type: "name",
            title: "签名过滤器",
            content: "设置本配置文件使用的签名过滤器，以确定需检验的签名集合。请在 入侵防御 -> 签名过滤器 页面配置。"
        }, {
            type: "name",
            title: "例外签名",
            content: "设置本配置文件的例外签名，这里设定的签名将会先于签名过滤器进行匹配，匹配成功后的动作以这里的设定为准。"
        },
/*        {
            type: "name",
            title: "捕获数据包",
            content: "开启后，命中签名的数据包将会被捕获，可在日志中心下载。仅在连接硬盘时可用。"
        }, */
        {
            type: "name",
            title: "备注",
            content: "设置本配置文件的备注，50 字以内。"
        }
    ]
};

$.su.CHAR.HELP.IPS_FILTER_LIST = {
    TITLE: "签名过滤器列表",
    CONTENT: [
        {
            type: "paragraph",
            content: "您可以通过本页面设置签名过滤器列表，用来将适合您的需求的签名组成集合，供 IPS 配置文件使用。"
        }, {
            type: "name",
            title: "名称",
            content: "设置本签名过滤器的名称。"
        }, {
            type: "name",
            title: "目标",
            content: "选择需要保护的目标。不选择等同于不判断此条件。"
        }, {
            type: "name",
            title: "严重性",
            content: "筛选指定严重程度的签名。不选择等同于不判断此条件。"
        }, {
            type: "name",
            title: "操作系统",
            content: "筛选影响指定操作系统的签名。不选择等同于不判断此条件。"
        }, {
            type: "name",
            title: "应用程序",
            content: "筛选影响指定应用程序的签名。不选择等同于不判断此条件。"
        }, {
            type: "name",
            title: "协议",
            content: "筛选利用指定协议的威胁的签名。不选择等同于不判断此条件。"
        }, {
            type: "name",
            title: "威胁类别",
            content: "筛选签名对应的威胁类别。不选择等同于不判断此条件。"
        }, {
            type: "name",
            title: "动作",
            content: "选择本签名过滤器所选签名的默认动作。"
        }, {
            type: "name",
            title: "备注",
            content: "设置本签名过滤器的备注，50 字以内。"
        }, {
            type: "name",
            title: "过滤结果",
            content: "点击可查看当前条件所筛选出的签名及动作。"
        }
    ]
};

$.su.CHAR.HELP.IPS_SIGNATURE_LIST = {
    TITLE: "签名列表",
    CONTENT: [
        {
            type: "paragraph",
            content: "您可以通过本页面查看签名详细信息，并设置设备自带签名的默认动作。"
        }, {
            type: "name",
            title: "签名 ID",
            content: "显示本条签名的 ID. 可在 IPS 配置文件的例外签名设置中使用。"
        }, {
            type: "name",
            title: "签名标题",
            content: "显示本条签名的标题。可在日志中看到。"
        }, {
            type: "name",
            title: "目标",
            content: "显示本条签名要保护的目标。"
        }, {
            type: "name",
            title: "严重性",
            content: "显示本条签名所述威胁的严重等级。"
        }, {
            type: "name",
            title: "操作系统",
            content: "显示本条签名所述威胁影响的操作系统。"
        }, {
            type: "name",
            title: "应用程序",
            content: "显示本条签名所述威胁影响的应用程序。"
        }, {
            type: "name",
            title: "协议",
            content: "显示本条签名所述威胁利用的网络协议。"
        }, {
            type: "name",
            title: "威胁类别",
            content: "显示本条签名所述威胁的分类。"
        }, {
            type: "name",
            title: "动作",
            content: "选择本条签名命中后的默认动作。"
        }, {
            type: "name",
            title: "备注",
            content: "设置本签名的备注，50 字以内。"
        }, {
            type: "name",
            title: "详细信息",
            content: "点击可查看本条签名的详细信息。"
        }, {
            type: "name",
            title: "状态",
            content: "选择本条签名是否要被纳入检测流程。"
        }
    ]
};

$.su.CHAR.HELP.IP_BLACKLIST_LIST = {
    TITLE: "黑名单",
    CONTENT: [
        {
            type: "paragraph",
            content: "您可以通过本页面查看手动和自动添加的黑名单项目，并管理它们。根据类型设置，来自或前往黑名单 IP 的流量将不进行任何处理，直接丢弃。"
        }, {
            type: "name",
            title: "IP 地址",
            content: "显示或设置本条黑名单项目的 IP 地址。地址中的主机号部分将被自动清零。"
        }, {
            type: "name",
            title: "类型",
            content: "显示或设置本条黑名单项目匹配的方向。"
        }, {
            type: "name",
            title: "添加原因",
            content: "显示本条黑名单项目被添加的原因，例如在本页直接新增时为“手动添加”，通过入侵防御配置文件的例外签名阻断动作新增时为“入侵防御”。编辑一条非“手动添加”的条目后，其原因将变为“手动添加”。"
        }, {
            type: "name",
            title: "剩余时间",
            content: "显示或设置本条黑名单项目在多少分钟后自动失效，最长可以设置 35280 分钟，即 24.5 天。若为 0 则表示不过期、永久存在。"
        }, {
            type: "name",
            title: "备注",
            content: "显示或设置本条黑名单项目的注释信息，可选，最多 50 字。"
        }, {
            type: "name",
            title: "状态",
            content: "显示或设置本条黑名单项目是否生效。"
        }
    ]
};

$.su.CHAR.HELP.IP_WHITELIST_LIST = {
    TITLE: "白名单",
    CONTENT: [
        {
            type: "paragraph",
            content: "您可以通过本页面查看并管理白名单项目。根据类型设置，来自或前往白名单 IP 的流量将不进行黑名单匹配和内容安全检查，只要安全策略允许其通过，就可以直接放行。"
        }, {
            type: "note",
            title: "注意",
            content: [
                "白名单的源地址/目的地址指的是报文的源地址/目的地址，不同于安全策略中指的是数据流的源地址/目的地址。",
                "白名单的匹配在NAT之前，如果配置了NAT策略，需要将NAT转换前的 IP 地址加入白名单才能生效。"
            ]
        }, {
            type: "name",
            title: "IP 地址",
            content: "显示或设置本条白名单项目的 IP 地址。地址中的主机号部分将被自动清零。"
        }, {
            type: "name",
            title: "类型",
            content: "显示或设置本条白名单项目匹配的方向。"
        }, {
            type: "name",
            title: "备注",
            content: "显示或设置本条白名单项目的注释信息，可选，最多 50 字。"
        }, {
            type: "name",
            title: "状态",
            content: "显示或设置本条白名单项目是否生效。"
        }
    ]
};

// =======ip_pool.js=====
$.su.CHAR.HELP.IP_POOL_LIST =
{
     TITLE: "IP 地址池列表",
     CONTENT: [{
         type: "paragraph",
         content: "您可以通过本页面设置地址池条目，进行地址池的管理。"
     },{
         type: "name",
         title: "地址池名称",
         content: "标志地址池的名称。"
     },{
         type: "name",
         title: "起始IP地址",
         content: "设置地址池起始地址"
     },{
         type: "name",
         title: "结束IP地址",
         content: "设置地址池结束地址"
     },{
         type: "note",
         title: "注意",
         content: "由地址池起始IP和地址池结束IP组成，且地址池起始IP必须不大于地址池结束IP，而且不能与已有的地址池范围重叠。"
     }]
};






// =======ipstat.js=====
$.su.CHAR.HELP.IP_STATS_SETTING = {
    TITLE: "IP流量统计功能设置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以设置启用IP流量统计以及监控的IP地址范围。"
     },{
        type: "name",
        title: "启用IP流量统计",
        content: "您可以通过选择此选项来启用IP流量统计功能。"
     },{
        type: "name",
        title: "监控IP范围",
        content: "监控IP范围内的流量统计信息将会显示在本页的列表当中。"
     }]
};

$.su.CHAR.HELP.IP_STATS_LIST = {
    TITLE: "流量统计列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备各IP的流量信息。"
     },{
        type: "name",
        title: "清空",
        content: "点击清空按钮可以清空设备各接口的流量统计信息。"
     },{
		type: "name",
		title: "IP地址",
		content: "进行流量统计的IP地址。"
     },{
		type: "name",
		title: "发送速率",
		content: "各IP的数据发送速率。"
	 },{
		type: "name",
		title: "接收速率",
		content: "各IP的数据接收速率。"
	 },{
		type: "name",
		title: "发送包速率",
		content: "各IP的数据包发送速率。"
	 },{
		type: "name",
		title: "接收包速率",
		content: "各IP的数据包接收速率。"
	 },{
		type: "name",
		title: "发送总字节",
		content: "各IP发送数据的字节总数。"
	 },{
		type: "name",
		title: "接收总字节",
		content: "各IP接收数据的字节总数。"
	 },{
		type: "name",
		title: "发送总报文",
		content: "各IP发送数据的报文总数。"
	 },{
		type: "name",
		title: "接收总报文",
		content: "各IP接收数据的报文总数。"
	 },{
        type: "note",
        title: "注意",
        content: "点击表头中的文字，可以对该列进行升序/降序排序。"
     }]
};

// =======isp_route.js=====
$.su.CHAR.HELP.ISP_ROUTING_SETTING = {
    TITLE: "全局设置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置进行ISP选路设置，导入ISP数据库。"
    },
    {
        type: "name",
        title: "启用ISP地址段选路功能",
        content: "选中<启用ISP地址段选路功能>，将根据ISP进行选路。"
    }]
};

$.su.CHAR.HELP.ISP_IMPORT = {
    TITLE: "导入ISP数据库",
    CONTENT: [{
        type: "name",
        title: "导入",
        content: "可以导入ISP数据库对系统预设的ISP选路进行升级。"
    }]
};

$.su.CHAR.HELP.ISP_USER_DEFINE_HELP = {
    TITLE: "用户自定义数据库",
    CONTENT: [{
        type: "name",
        title: "导入",
        content: "自定义数据库文件格式为每行由“IP/mask”组成，如“12.12.12.12/24”，总个数不超过2048条。文件格式为txt格式。"
    }]
};

$.su.CHAR.HELP.ISP_ROUTING_LIST = {
    TITLE: "选路列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看选路条目，还可以通过表格按钮对条目进行操作。"
    },
    {
        type: "name",
        title: "接口",
        content: "选择ISP选路的出接口。"
    },
    {
        type: "name",
        title: "ISP",
        content: "选择ISP（Internet Service Provider，网络服务提供商）。"
    },
    {
        type: "name",
        title: "状态",
        content: "选择此规则是否启用。"
    }]
};

// =======keepalived.js=====
$.su.CHAR.HELP.VRRP_INTERFACE_CHANGEABLE = {
    "TITLE": "主备倒换设置",
    "CONTENT": [
        {
            "type": "paragraph",
            "content": "主备机器之间会定时通过心跳接口发送心跳信号，通过选举运行主备状态，当异常发生时能够进行主备倒换。"
        },
        {
            "type": "name",
            "title": "心跳接口",
            "content":"主备机器通过该接口进行通信，为保证主备倒换功能正常进行，请保证心跳接口的连通性。"
        },
        {
            "type": "name",
            "title": "状态",
            "content": "心跳接口的状态一旦启用后，将被设置为静态IP，且无法进行其他业务。"
        },
        {
	        type: "note",
	        title: "注意",
	        content: "接口的具体信息请到 接口设置 中设置成功后才可选中。拥有静态IP地址，且不是管理接口的以太网接口才可以成为心跳接口。只能存在一个心跳接口。"
	    }

    ]
};
$.su.CHAR.HELP.KEEPALIVED =
{
    TITLE: "主备倒换",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面进行主备倒换规则设置。主备倒换功能是当主设备挂起时，业务自动切换到备用设备。",
        children:[{
            type: "step",
            content: [
            "抢占模式配置：主设备配置为主模式且抢占，备设备配置备模式。",
            "非抢占模式配置：主设备配置主模式且非抢占，备设备配置备模式。"
            ]
        }]
    }, {
        type:"name",
        title:"名称",
        content:"条目名称。方便记忆和检索条目。"
    }, {
        type: "name",
        title: "主备状态",
        content: "设置设备为主设备或者备设备。"
    }, {
        type: "name",
        title: "生效接口",
        content: "主备倒换生效的接口。"
    }, {
        type: "name",
        title: "VRID",
        content: "虚拟路由器的ID（VRID），可用值为1-255。同一个VRRP组VRID必须相同。"
    }, {
        type: "name",
        title: "通告间隔",
        content: "通告时间间隔，单位是秒。同一个VRRP组通告间隔必须相同。"
    }, {
        type: "name",
        title: "模式",
        content: "设置主备模式。",
        children:[{
            type: "step",
            content: [
            "非抢占：主设备从挂掉到恢复，不再将服务抢占过来。",
            "抢占：主设备从挂掉到恢复，将服务抢占过来。"
            ]
        }]
    }, {
        type: "name",
        title: "虚拟IP地址",
        content: "虚拟路由器的IP地址。同一个VRRP组虚拟IP地址必须相同。"
    }, {
        type: "name",
        title: "运行状态",
        content: "设备正在运行的主备状态。"
    }, {
        type: "name",
        title: "状态",
        content: "启用禁用主备倒换功能。"
    },{
        type: "note",
        title: "注意",
        content: "虚拟IP地址会跟生效接口对应网关地址和DNS服务器自动保持同步。如果要使用自定义的网关地址和DNS服务器，那么可以前往接口设置功能页面重新配置"
    }]
};
// =======license.js=====
$.su.CHAR.HELP.DOWNLOAD_LICENSE = {
    TITLE: "导出凭证",
    CONTENT: [
        {
            type: "name",
            title: "导出",
            content: "下载凭证文件到本地"
        }
    ]
};

$.su.CHAR.HELP.ACTIVATE_LICENSE = {
    TITLE: "激活License",
    CONTENT: [
        {
            type: "name",
            title: "激活",
            content: "导入本地的License激活文件"
        },
        {
            type: "name",
            title: "License状态",
            content: "License是否激活"
        },
        {
            type: "name",
            title: "License资源",
            content: "需要License授权使用的功能，分别为入侵防御、反病毒、恶意域名远程查询"
        },
        {
            type: "name",
            title: "状态",
            content: "License资源的授权状态"
        }
    ]
};

// =======line_backup.js=====
$.su.CHAR.HELP.LINE_BACKUP_SETTING = {
    TITLE: "线路备份规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看备份策略，还可以通过表格按钮对条目进行操作。"
    },
    {
        type: "name",
        title: "主接口",
        content: "您可以选择一个接口作为主接口。"
    },
    {
        type: "name",
        title: "备接口",
        content: "您可以选择一个接口作为备用接口用来备份主接口的流量。"
    },
    {
        type: "name",
        title: "备份模式",
        content: "您可以选择定时备份或故障备份。"
    },
    {
        type: "name",
        title: "生效时间",
        content: "您可以选择规则备份生效时间。"
    },
    {
        type: "name",
        title: "状态",
        content: "您可以选择备份策略是否生效。"
    }]
};

// =======logger.js=====
$.su.CHAR.HELP.SYSTEM_LOG = {
    TITLE: "系统日志",
    CONTENT:[{
        type: "paragraph",
        content: "您可以通过本页面来查看系统运行状况。"
    }]
};

$.su.CHAR.HELP.SYSTEM_LOG_SETTING = {
    TITLE: "日志配置",
    CONTENT: [{
        type: "name",
        title: "选择系统日志等级",
        content: "选中<选择系统日志等级>，将弹出系统日志等级复选框以供您查看特定等级的系统日志信息。",
        children: [{
            type: "step",
            content: [
                "所有等级：查看所有等级的日志信息。",
                "致命错误：导致系统不可用的错误。",
                "紧急错误：必须对其采取紧急措施的错误。",
                "严重错误：导致系统处于危险状态的错误。",
                "一般错误：一般性的错误提示。",
                "警告信息：系统仍然正常运行，但可能存在隐患的提示信息。",
                "通知信息：正常状态下的重要提示信息。",
                "信息报告：一般性的提示信息。",
                "调试信息：调试过程中产生的信息。"
            ]
        }]
    },{
        type: "name",
        title: "选择系统日志模块类别",
        content: "选中<选择系统日志模块类别>，将弹出系统日志模块类别下拉框以供您查看特定模块的系统日志信息。"
    },{
        type: "name",
        title:"发送日志",
        content: "选中<发送日志>，将把日志发送到指定服务器。"
    }]
};

$.su.CHAR.HELP.SYSTEM_LOG_LIST = {
    TITLE: "系统日志列表",
    CONTENT: [{
        type: "name",
        title: "日志内容",
        content: "每一项日志内容组成格式为“时间+功能模块+日志等级+日志信息”。"
    },{
        type: "name",
        title: "导出日志",
        content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的系统日志。"
    }]
};

$.su.CHAR.HELP.SYSTEM_LOG_V2 = {
    TITLE: "系统日志列表",
    CONTENT: [{
        type: "name",
        title: "日志内容",
        content: "每一项日志内容组成格式为“时间+功能模块+日志等级+日志信息”。"
    }, {
        type: "name",
        title: "导出日志",
        content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中最多1000条系统日志。"
    }]
};

$.su.CHAR.HELP.OPERATIONLOG = {
    TITLE: "操作日志列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看操作日志。"
    },{
        type: "name",
        title: "时间",
        content: "操作日志产生时间。"
    },{
        type: "name",
        title: "管理员",
        content: "进行操作的管理员。"
    },{
        type: "name",
        title: "登录IP地址",
        content: "进行操作的管理员的登录IP。"
    },{
        type: "name",
        title: "详细内容",
        content: "操作日志的详细内容。"
    },{
        type: "name",
        title: "导出日志",
        content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的1000条日志"
    }]
};

// =======mac_filter.js=====
$.su.CHAR.HELP.MAC_FILTERING_SETTING = {
    TITLE: "功能设置",
    CONTENT: [{
        type: "name",
        title: "启用MAC地址过滤功能",
        content: "可启用或关闭MAC地址过滤功能。"
    },{
        type: "name",
        title: "仅允许规则列表内的MAC地址访问外网",
        content: "表示设备将只允许源MAC地址在过滤规则列表中的数据帧通过。"
    },{
        type: "name",
        title: "仅禁止规则列表内的MAC地址访问外网",
        content: "表示设备将禁止源MAC地址在过滤规则列表中的数据帧通过。"
    },{
        type: "name",
        title: "生效接口域",
        content: "表示MAC地址过滤所生效的接口。"
    },{
        type: "step",
        title: "举例：禁止LAN网段上MAC地址为 00-00-11-11-11-F2 的主机访问外网",
        content: [
            "1、点击<增加>添加MAC地址为00-00-11-11-11-F2的MAC过滤规则条目。",
            "2、启用MAC地址过滤功能。",
            "3、选择仅禁止规则列表的MAC地址访问外网。"
        ]
    }]
};

$.su.CHAR.HELP.MAC_FILTERING_LIST = {
    TITLE: "MAC过滤规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看MAC地址过滤条目，还可以通过表格按钮对条目进行操作。"
    },{
        type: "name",
        title: "名称",
        content: "您可以设置规则的名称。"
    },{
        type: "name",
        title: "MAC地址",
        content: "过滤的MAC地址，格式为xx-xx-xx-xx-xx-xx。"
    }]
};

// =======mail_filter_log.js=====
$.su.CHAR.HELP.MAIL_FILTERLOG={
    TITLE: "邮件过滤日志",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面查看邮件过滤日志。"
    },
    {
        type: "name",
        title: "时间",
        content: "日志时间。"
    },
    {
        type: "name",
        title: "源安全区域",
        content: "数据流源安全区域。"
    },
    {
        type: "name",
        title: "目的安全区域",
        content: "数据流目的安全区域。"
    },
    {
        type: "name",
        title: "源地址",
        content: "数据流源地址。"
    },
    {
        type: "name",
        title: "目的地址",
        content: "数据流目的地址。"
    },
    {
        type: "name",
        title: "源端口",
        content: "数据流源端口，仅对TCP/UDP有效。"
    },
    {
        type: "name",
        title: "目的端口",
        content: "数据流目的端口，仅对TCP/UDP有效。"
    },
    {
        type: "name",
        title: "用户",
        content: "数据流对应用户。"
    },
    {
        type: "name",
        title: "协议",
        content: "数据流协议。"
    },
    {
        type: "name",
        title: "应用",
        content: "数据流应用。"
    },
    {
        type: "name",
        title: "动作",
        content: "过滤的动作。"
    },
    {
        type: "name",
        title: "安全策略",
        content: "命中的安全策略名称。"
    },
    {
        type: "name",
        title: "配置文件",
        content: "命中安全策略对应邮件内容过滤配置文件名称。"
    },
    {
        type: "name",
        title: "发件人",
        content: "过滤邮件的发件人。"
    },
    {
        type: "name",
        title: "收件人",
        content: "过滤邮件的附收件人。"
    },
    {
        type: "name",
        title: "邮件协议",
        content: "过滤邮件的邮件协议"
    },
    /* {
        type: "name",
        title: "过滤类型",
        content: "本次邮件过滤对应的过滤类型"
    }, */
    {
        type: "name",
        title: "导出日志",
        content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志"
    }
]
};
// =======metric.js=====
$.su.CHAR.HELP.METRIC = {
	TITLE: "metric设置",
	CONTENT:[{
		type: "paragraph",
		content: "您可以通过本页面设置逻辑接口的metric参数。"
	},{
		 type:"name",
		 title:"静态IP接口",
		 content:"填写静态IP时的路由Metric信息。"
	},{
		 type:"name",
		 title:"DHCP接口",
		 content:"填写DHCP获取动态IP时的路由Metric信息。"
	},{
		 type:"name",
		 title:"PPPoE接口",
		 content:"填写PPPoE拨号时的路由Metric信息。"
	},{
		 type:"name",
		 title:"L2TP接口",
		 content:"填写L2TP的路由Metric信息。"
	},{
		 type:"name",
		 title:"PPTP接口",
		 content:"填写PPTP的路由Metric信息。"
	}]
};

// =======mwan3.js=====
$.su.CHAR.HELP.BALANCE_GLOBAL_SETTING = {
    TITLE: "全局设置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以在本页面进行流量均衡的基本设置。"
    },
    {
        type: "name",
        title: "启用流量均衡",
        content: "流量均衡的全局开关，勾选以启用流量均衡功能。"
    }]
};

$.su.CHAR.HELP.BALANCE_BASIC_SETTING = {
    TITLE: "功能设置",
    CONTENT: [
        {
            type: "name",
            title: "启用特殊应用程序选路功能",
            content: "选中<启用特殊应用程序选路功能>，设备将把属于同一个网络应用的多条连接通过同一个出接口转发，避免多出接口下由于该应用的多条连接通过不同出接口转发导致应用异常的问题。例如某内网主机访问某外网服务器，启用特殊应用程序选路后，可以保证该内网主机发往服务器的所有数据通过同一个出接口转发，避免因流量均衡导致数据通过多个出接口转发而引起服务异常。"
        },
        {
            type: "name",
            title: "启用智能均衡",
            content: "您可以在复选框中选择需要启用智能均衡的接口。"
        }
    ]
};

// =======nat.js=====
$.su.CHAR.HELP.ALG = {
    TITLE: "ALG服务",
    CONTENT: [{
        type: "paragraph",
        content: "为了适应NAT协议本身的特点，FTP、H.323、SIP、PPTP等特殊协议需要启用ALG才能正常工作。"
    }, {
        type: "name",
        title: "FTP ALG",
        content: "您可以选择启用，使FTP服务正常运行。"
    }, {
        type: "name",
        title: "H.323 ALG",
        content: "您可以选择启用，使H.323服务正常运行。"
    }, {
        type: "name",
        title: "PPTP ALG",
        content: "您可以选择启用，使PPTP服务正常运行。"
    }, {
        type: "name",
        title: "SIP ALG",
        content: "您可以选择启用，使SIP服务正常运行。"
    }]
};

$.su.CHAR.HELP.NAT_DMZ = {
    TITLE: "NAT-DMZ规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看规则条目，还可以通过表格按钮对条目进行操作。"
    }, {
        type: "name",
        title: "规则名称",
        content: "您可以设置条目的规则名称，以方便您管理和查找。"
    }, {
        type: "name",
        title: "出接口",
        content: "您可以选择规则生效的出接口。"
    }, {
        type: "name",
        title: "主机地址",
        content: "NAT DMZ服务指向的主机地址。"
    }, {
        type: "name",
        title: "状态",
        content: "您可以选择规则是否生效。"
    }]
};

$.su.CHAR.HELP.NAPT = {
    TITLE: "NAPT规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看选路规则，还可以通过表格按钮对条目进行操作。"
    }, {
        type: "name",
        title: "规则名称",
        content: "您可以设置规则条目名称。"
    }, {
        type: "name",
        title: "出接口",
        content: "您可以选择规则生效的出接口。"
    }, {
        type: "name",
        title: "源地址范围",
        content: "您可以选择规则生效的地址对象。"
    }, {
        type: "name",
        title: "状态",
        content: "您可以选择规则是否生效。"
    }, {
        type: "name",
        title: "备注",
        content: "您可以设置条目的备注，以方便您管理和查找。"
    }]
};

$.su.CHAR.HELP.ONE_NAT = {
    TITLE: "一对一NAT规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看规则条目，还可以通过表格按钮对条目进行操作。"
    }, {
        type: "name",
        title: "规则名称",
        content: "您可以设置规则条目名称。"
    }, {
        type: "name",
        title: "出接口",
        content: "您可以选择规则生效的出接口。"
    }, {
        type: "name",
        title: "映射前地址",
        content: "您可以选择规则生效的地址对象。映射前地址不能为各个接口的广播、网段和接口IP地址。"
    }, {
        type: "name",
        title: "映射后地址",
        content: "您可以选择规则生效的地址对象。映射后地址不能为各个接口的广播、网段和接口IP地址。"
    }, {
        type: "name",
        title: "DMZ转发",
        content: "您可以选择勾选\"启用\"来使DMZ转发功能生效，即将发送到映射后的地址的报文全部转发到映射前的地址主机。"
    }, {
        type: "name",
        title: "备注",
        content: "您可以设置条目的备注，以方便您管理和查找。"
    }, {
        type: "name",
        title: "状态",
        content: "您可以选择规则是否生效。"
    }]
};

$.su.CHAR.HELP.VIRTUAL_SERVER = {
    TITLE: "虚拟服务器规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看规则条目，还可以通过表格按钮对条目进行操作。"
    }, {
        type: "name",
        title: "规则名称",
        content: "您可以设置服务条目名称。"
    }, {
        type: "name",
        title: "生效接口",
        content: "您可以选择规则生效的出接口。"
    }, {
        type: "name",
        title: "外部端口",
        content: "设备提供给广域网的服务端口（范围）。端口组之间不允许重叠。"
    }, {
        type: "name",
        title: "内部端口",
        content: "局域网主机的服务端口。"
    }, {
        type: "name",
        title: "内部服务器IP",
        content: "建立服务的局域网主机地址。"
    }, {
        type: "name",
        title: "服务协议",
        content: "触发条目生效的协议类型。"
    },{
        type: "name",
        title: "环回地址",
        content: "添加网段支持环回。"
    }, {
        type: "name",
        title: "状态",
        content: "您可以选择规则是否生效。"
    }]
};

// =======network.js=====
$.su.CHAR.HELP.INTERFACE = {
    TITLE: "接口设置",
	CONTENT:[{
		type: "paragraph",
		content: "您可以通过本页面进行接口设置。"
	},{
		type:"note",
		title:"物理接口与接口的概念",
		content:[
			"物理接口：物理接口是设备上实际存在的组件，本设备的物理接口命名为端口1,端口2，端口3...端口n，n为物理接口个数",
			"接口：在逻辑上将一个物理接口划分为多个虚拟的接口，每个接口使用的带宽都来自于它所属的物理接口。"
		]
	},{
		type:"name",
		title:"选择物理接口",
		content:"在下拉菜单中选择一个物理接口，管理该物理接口上的接口。"
	},{
		type:"note",
		title:"Ethernet接口",
		content:"Ethernet接口有两种连接方式：静态IP地址和DHCP自动分配。"
	},{
		type:"name",
		title:"接口类型",
		content:"选择Ethernet接口。"
	},{
		type:"name",
		title:"接口名称",
		content:"设置一个名称来标识一个接口，仅可以使用英文、数字和下划线来命名，且不能以数字开头。"
	},{
		type:"name",
		title:"关联接口",
		content:"指定关联的物理接口。"
	},{
		type:"name",
		title:"关联VLAN",
		content:"输入一个该接口属于的VLAN ID，当勾选“UNTAG”时，从该接口发出的报文不带VLAN TAG；当不勾选“UNTAG”时，从该接口发出的报文带有VLAN TAG。"
	},{
		type:"name",
		title:"连接方式",
		content:"可以选择静态IP和DHCP自动分配两种连接方式。选择静态IP连接方式，需要手动配置IP；选择DHCP方式时，由设备动态获取IP。"
	},{
		type:"name",
		title:"IP地址",
		content:"设置接口的IP地址。"
	},{
		type:"name",
		title:"子网掩码",
		content:"设置接口的子网掩码。"
	},{
		type:"name",
		title:"网关地址",
		content:"设置网关地址。该项为可选项，允许留空。"
	},{
		type:"name",
		title:"上行带宽",
		content:"设置接口的上行带宽。"
	},{
		type:"name",
		title:"下行带宽",
		content:"设置接口的下行带宽。"
	},{
		type:"name",
		title:"MTU",
		content:"MTU即 Maximum Transmission Unit，最大传输单元。设置数据包的最大长度，取值范围为576-1500，默认值为1500。"
	},{
		type:"name",
		title:"首选DNS服务器",
		content:"DNS即 Domain Name Server，域名解析服务器。设置首选的DNS服务器，允许留空。"
	},{
		type:"name",
		title:"备用DNS服务器",
		content:"DNS即 Domain Name Server，域名解析服务器。设置备用的DNS服务器，允许留空。"
	},{
		type:"name",
		title:"备注",
		content:"可选填接口的备注信息。"
	},{
		type:"name",
		title:"管理接口开启",
		content:"勾选该项使得该接口成为管理接口。"
	},{
		type:"note",
		title:"PPPoE接口",
		content:"提供PPPoE连接方式的接口，xDSL拨号上网使用PPPoE连接方式。新建PPPoE接口时，必须保证在同一物理接口下有Ethernet接口可供选择。"
	},{
		type:"name",
		title:"接口类型",
		content:"选择PPPoE接口。"
	},{
		type:"name",
		title:"接口名称",
		content:"设置一个名称来标识一个接口，仅可以使用英文、数字和下划线来命名，且不能以数字开头。"
	},{
		type:"name",
		title:"关联接口",
		content:"指定关联的Ethernet接口。"
	},{
		type:"name",
		title:"用户名",
		content:"PPPoE拨号的用户名，由ISP提供。"
	},{
		type:"name",
		title:"密码",
		content:"PPPoE拨号的密码，由ISP提供。"
	},{
		type:"name",
		title:"连接方式",
		content:"选择上网时连入互联网的方式，有自动连接、手动连接、定时连接三种方式选择。",
		children:[{
			type:"step",
			content:[
				"自动连接：设备上电完成后，将自动拨号连入互联网。适合不限时的包月计费的用户。",
				"手动连接：需要手动拨号连入互联网，适合按小时计费的拨号连接上网方式。",
				"定时连接：在时间下拉列表中选择时间对象，适合于需要限时上网的场景。如需新建时间对象，请前往 对象管理->时间管理 页面。"
			]
		}]
	},{
		type:"name",
		title:"时间",
		content:"当连接方式选择为定时连接时，可以在下拉列表中选择合适的时间对象来进行拨号。如需新建时间对象，请前往 对象管理->时间管理 页面。"
	},{
		type:"name",
		title:"上行带宽",
		content:"设置接口的上行带宽。"
	},{
		type:"name",
		title:"下行带宽",
		content:"设置接口的下行带宽。。"
	},{
		type:"name",
		title:"MTU",
		content:"MTU即 Maximum Transmission Unit，最大传输单元。设置数据包的最大长度，取值范围为576-1492，默认值为1492。"
	},{
		type:"name",
		title:"服务名",
		content:"输入服务名称，由ISP提供。"
	},{
		type:"name",
		title:"首选DNS服务器",
		content:"DNS即 Domain Name Server，域名解析服务器。设置首选的DNS服务器，允许留空。"
	},{
		type:"name",
		title:"备用DNS服务器",
		content:"DNS即 Domain Name Server，域名解析服务器。设置备用的DNS服务器，允许留空。"
	},{
		type:"name",
		title:"备注",
		content:"可选填写接口的备注信息。"
	},{
		type:"name",
		title:"管理接口开启",
		content:"勾选该项使得该接口成为管理接口。"
	},{
		type:"note",
		title:"IPv6连接设置",
		content:"您可以通过IP协议类型切换至IPv6协议。"
	},{
		type:"name",
		title:"状态",
		content:"选择启用或者禁用IPv6地址。"
	},{
		type:"name",
		title:"IP地址",
		content:"ISP提供的IPv6全球地址。"
	},{
		type:"name",
		title:"子网前缀长度",
		content:"ISP提供的子网前缀长度，一般为64。"
	},{
		type:"name",
		title:"复用IPv4拨号链路",
		content:"当开启此功能后，IPv6将使用IPv4账号密码进行拨号，不需要手动输入IPv6宽带账号及密码。请注意开启此功能需要运营商支持，请根据实际情况正确选择是否开启。"
	},{
		type:"name",
		title:"用户名",
		content:"ISP提供ADSL IPv6独立虚拟拨号方式的帐号，若您不了解或遗忘账号密码，请向ISP询问。"
	},{
		type:"name",
		title:"密码",
		content:"ISP提供ADSL IPv6独立虚拟拨号方式的密码，若您不了解或遗忘账号密码，请向ISP询问。"
	},{
		type:"name",
		title:"IPv6地址获取协议",
		content:"当IPv6地址获取协议为自动、DHCPv6或者SLAAC时，可以选择是否开启前缀授权功能。开启此功能后，路由器将自动从运营商获取一个IPv6地址前缀，该前缀用于为局域网中设备生成IPv6地址。"
	},{
		type:"name",
		title:"前缀授权",
		content:"当IPv6地址获取协议为自动、DHCPv6或者SLAAC时，可以选择是否开启前缀授权功能。开启此功能后，路由器将自动从运营商获取一个IPv6地址前缀，该前缀用于为局域网中设备生成IPv6地址。"
	}]
};

$.su.CHAR.HELP.BRIDGE_SETTING = {
	TITLE: "网桥设置",
	CONTENT: [{
		type: "paragraph",
		content: "您可以在本页面为指定网桥配置包含接口。当前系统的网桥接口一般作为\"LAN\"接口使用。"
	},{
		 type:"name",
		 title:"网桥名称",
		 content:"标志配置网桥的名称。"
	},{
		 type:"name",
		 title:"包含接口",
		 content:"配置网桥包含接口。配置网桥接口后会将包含的物理接口级联在一起，达到不同接口之间互通的目的,同时被桥接的接口单独配置其它任何业务都将无效。"
	},{
		 type:"name",
		 title:"设置",
		 content:"设置网桥参数。"
	},{
		 type:"name",
		 title:"STP",
		 content:"勾选以启用生成树协议。"
	},{
		 type:"name",
		 title:"接口引用信息",
		 content:"所有接口上已配置的功能列表"
	},{
		type: "note",
		title: "注意",
		content: "设备需要在出厂设置状态下才能进行网桥接口配置，如需创建网桥，请先恢复出厂设置。"
	}]
};

$.su.CHAR.HELP.OPTICAL_PORT_SETTING = {
	TITLE: "SFP+速率",
	CONTENT: [{
		type: "paragraph",
		content: "您可以在本页面进行SFP+口配置。"
	},{
		 type:"name",
		 title:"SFP+速率",
		 content:"配置SFP+口速率大小,可选1000Mbps或10Gbps。"
	},{
		type: "note",
		title: "注意",
		content: "切换SFP+口速率，系统重启后才会生效。"
	}]
};

$.su.CHAR.HELP.IPV6_BRIDGE = {
	TITLE: "IPv6桥模式",
	CONTENT: [
	{
		type: "paragraph",
		content: "您可以在本页面进行IPv6桥模式的配置。当开启IPv6桥模式后，路由器IPv6工作在桥接模式，连接到路由器的客户端由上联设备分配IPv6地址并提供路由服务。"
	},
	{
		type: "name",
		title: "开启IPv6桥模式",
		content: "选择启用并设置可开启IPv6桥模式；选择禁用并设置可关闭IPv6桥模式。"
	},
	{
		type: "name",
		title: "广域网接口配置",
		content: "选取一个接口作为广域网接口。"
	},
	{
		type: "name",
		title: "局域网接口配置",
		content: "选取一个接口作为局域网接口。"
	},
	{
		type: "name",
		title: "设置",
		content: "点击设置按钮进行IPv6桥模式设置"
	}
	]
};

// =======online_check.js=====
$.su.CHAR.HELP.ONLINE_SETTING = {
    TITLE: "在线检测列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置不同的检测方式，并查看设备接口是否已经连接外网。"
    },
    {
        type: "name",
        title: "接口名",
        content: "进行在线检测的接口。对所有参与流量均衡的接口，均会进行在线检测。"
    },
    {
        type: "name",
        title: "检测模式",
        content: "您可以设置以何种方式检测外网连接状态。<br/>" +
            "自动模式：通过使用在设置接口时设置的DNS服务器进行DNS检测判断是否连接外网。<br/>" +
            "手动模式：通过使用在本页面上手动设置的DNS服务器和IP地址进行DNS检测和PING检测判断是否连接外网。<br/>" +
            "永远在线：不进行检测，而在页面上永远显示为在线状态。"
    },
    {
        type: "name",
        title: "PING检测",
        content: "您可以指定一个IP地址，让对应的接口去ping这个地址，从而判断是否连接外网，只能在手动模式下设置。"
    },
    {
        type: "name",
        title: "DNS检测",
        content: "您可以指定一个DNS服务器的IP地址，让对应的接口通过这个DNS服务器使用默认的域名进行DNS查询，从而判断是否连接外网，只能在手动模式下中设置。"
    }]
};

// =======phddns.js=====
$.su.CHAR.HELP.PHDDNS = {
         TITLE: "花生壳动态域名",
         CONTENT: [{
             type: "paragraph",
             content: "通过DDNS（Dynamic DNS，动态域名解析服务），您可以将固定域名与动态IP进行绑定，使Internet用户可以通过域名来访问设备或内网主机。您可以通过本页面登录花生壳动态域名服务器，开启花生壳动态域名服务。"
         },{
             type: "name",
             title: "服务接口",
             content: "花生壳动态域名服务生效的接口。"
         },{
             type: "name",
             title: "用户名",
             content: "花生壳动态域名服务账户的用户名。"
         },{
             type: "name",
             title: "密码",
             content: "花生壳动态域名服务账户的密码。"
         },{
             type: "name",
             title: "启用/禁用",
             content: "选择是否在添加该账户后立即登录花生壳动态域名服务器，开启动态域名服务。"
         },{
             type: "name",
             title: "域名",
             content: "从DDNS服务器获取的域名服务列表，最多可以显示16条域名信息。"
         } ]
};

// =======pppoe_server.js=====
$.su.CHAR.HELP.PPPOE_SERVER_GLOBAL_HELP = {
TITLE: "全局设置",
CONTENT: [{
	type: "paragraph",
	content: "根据您的网络环境，对PPPoE服务器进行正确的配置，以保证高效管理网络。"
}, {
	type: "name",
	title: "PPPoE服务器",
	content: "您可以选择<启用>，开启PPPoE服务器功能；选择<禁用>，关闭PPPoE服务器功能。"
},{
	type: "name",
	title: "强制PPPoE拨号",
	content: "您可以选择<启用>，开启强制PPPoE拨号功能；选择<禁用>，关闭PPPoE强制拨号功能。功能开启后，生效接口下仅有拨号用户和例外IP的用户能使用网络。设置例外IP，请到例外IP管理页面进行设置。"
}, {
	type: "name",
	title: "拨号用户互访",
	content: "您可以选择<允许>，开启拨号用户互访功能；选择<禁止>，禁止拨号用户互访功能。拨号用户互访功能允许拨号用户之间互相通信。"
}, {
	type: "name",
	title: "服务接口",
	content: "该用户接入网络的接口。接口只能设置为带IP的静态接口。"
}, {
	type: "name",
	title: "首选/备选DNS服务器",
	content: "请正确填写，作为DNS服务器地址，缺省为空。"
}, {
	type: "name",
	title: "系统最大会话数",
	content: "设置会话数的最大值。"
}, {
	type: "name",
	title: "最大未应答LCP包数",
	content: "作为最大未应答LCP包数，缺省为10。当一条连接的未应答LCP包数超过这个数值时，PPPoE Server会自动断开这条连接。"
}, {
	type: "name",
	title: "空闲断线时间",
	content: "作为最大空闲断线时间，缺省为30。请填写0-10080（分钟），即最大为7天。0代表不空闲断线。"
},{
	type:"name",
	title:"认证方式",
	content:"提供四种认证方式，请至少选择一种。"
}]
};

$.su.CHAR.HELP.PPPOE_SERVER_USER_HELP = {
TITLE: "账号管理",
CONTENT: [{
	type: "paragraph",
	content: "您可以查看账号设置信息，还可以通过表格按钮对账号设置信息条目进行操作。"
}, {
	type: "name",
	title: "账号",
	content: "账号规则设置的名称。"
},{
	type: "name",
	title: "密码",
	content: "账号的密码。"
}, {
	type: "name",
	title: "地址池",
	content: "PPPoE服务器分配给客户端的IP地址从地址池获取。"
}, {
	type: "name",
	title: "最大会话数",
	content: "用户允许登陆的最大会话数。"
}, {
	type: "name",
	title: "账号到期时间",
	content: "设置账号的有效时间，最大值为2099/01/01。"
}, {
	type: "name",
	title: "带宽模式",
	content: "设置账号带宽控制模式：共享表示账号的所有用户共用带宽；独立表示账号的所有用户独占带宽。"
}, {
	type: "name",
	title: "上行带宽",
	content: "当前账号用户允许的上行带宽，以Kbps为单位，0表示不限制。"
}, {
	type: "name",
	title: "下行带宽",
	content: "当前账号用户允许的下行带宽，以Kbps为单位，0表示不限制。"
}, {
	type:"name",
	title:"备注",
	content:"您可以设置规则条目备注，以方便您管理和查找。备注最多支持50个字符。"
}, {
	type:"name",
	title:"启用/禁用规则",
	content:"您可以选择<启用>，使该规则生效。您也可以选择<禁用>，使该规则失效。"
}, {
	type:"name",
	title:"账号高级设置",
	content:"设置账号的高级属性，如MAC绑定、定时断线等"
}, {
	type: "name",
	title: "MAC绑定方式",
	content: "您可以选择以下3种绑定方式。",
	children:[{
		type: "step",
		content: [
		"不绑定：不进行用户和MAC的绑定。",
		"静态绑定：静态绑定一个MAC地址，该账户只能在该MAC的主机上登录。",
		"动态绑定：当用户第一次登录的时候记录其MAC，以后用户的登录必须使用该MAC。"
		]
	}]
},{
	type:"name",
	title:"MAC地址",
	content:"当选择MAC绑定方式为静态绑定时须填写的MAC地址。"
},{
	type:"name",
	title:"定时断线时间",
	content:"设置定时断线的时间，当定时断线时间为0时，表示不会定时断线。"
}]
};

$.su.CHAR.HELP.PPPOE_SERVER_EXCEPTIP_HELP = {
TITLE: "例外IP管理",
CONTENT: [{
	type: "paragraph",
	content: "您可以查看例外IP条目，还可以通过表格按钮对条目进行操作。"
},{
	type: "name",
	title: "起始IP地址",
	content: "IP地址段的起始IP地址，且起始IP地址必须小于或等于结束IP地址，而且不能与已有的IP地址范围重叠。"
},{
	type: "name",
	title: "结束IP地址",
	content: "IP地址段的结束IP地址，且结束IP地址必须大于或等于起始IP地址，而且不能与已有的IP地址范围重叠。"
},{
	type: "name",
	title: "备注",
	content: "您可以对所添加的例外IP地址进行描述。"
},{
	type: "name",
	title: "启用/禁用规则",
	content: "您可以选择<启用>，使该规则生效。您也可以选择<禁用>，使该规则失效。"
}]
};

$.su.CHAR.HELP.PPPOE_SERVER_SESSION_HELP = {
TITLE: "账号信息列表",
CONTENT: [{
	type: "paragraph",
	content: "您可以通过本页面查看账号的有关信息。"
},{
	type: "name",
	title: "账号",
	content: "账号名。"
},{
	type: "name",
	title: "状态",
	content: "该账号的该IP对应的用户当时所处的状态。同一账号可允许异地登录。"
},{
	type: "name",
	title: "IP地址",
	content: "该用户的IP地址。"
},{
	type: "name",
	title: "MAC地址",
	content: "该用户的MAC地址。"
},{
	type: "name",
	title: "在线时间",
	content: "该用户的在线时间。"
},{
	type: "name",
	title: "备注",
	content: "该用户的备注信息。"
},{
	type: "name",
	title: "断开连接",
	content: "您可以点击此项，选择强制挂断该用户。"
}
]};
// =======qos.js=====
$.su.CHAR.HELP.QOS_SETTING = {
    TITLE: "功能设置",
    CONTENT: [{
        type: "paragraph",
        content: "您可以全局开启或关闭带宽控制功能，或设置为仅当带宽利用率达到一定值以上才开启带宽控制功能。"
    },
    {
        type: "name",
        title: "启用带宽控制",
        content: "您可以全局开启或关闭带宽控制功能。"
    },
    {
        type: "name",
        title: "带宽利用率条件",
        content: "在全局开启带宽控制功能的情况下，您可以设置一个百分比值，仅当带宽利用率高于这个值，带宽控制功能才会开启。"
    }]
};

$.su.CHAR.HELP.QOS_LIST = {
    TITLE: "带宽控制规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看带宽控制的用户规则，还可以通过表格按钮对每条规则进行操作。"
    },
    {
        type: "name",
        title: "规则名称",
        content: "您可以设置带宽控制规则的条目名称。"
    },
    {
        type: "name",
        title: "源接口",
        content: "您可以选择规则控制的数据源端。"
    },
    {
        type: "name",
        title: "目的接口",
        content: "您可以选择规则控制的数据目的端。"
    },
    {
        type: "name",
        title: "受控地址组",
        content: "您可以选择IP地址组对象，以建立规则条目作用的LAN地址范围。"
    },
    {
        type: "name",
        title: "地址类型",
        content: "您可以选择地址组是源地址或者目的地址。"
    },
    {
        type: "name",
        title: "最大带宽",
        content: "您可以选择规则定义的数据流的最大上行带宽（单位为 Kbps）。"
    },
    {
        type: "name",
        title: "带宽模式",
        content: "您可以设置地址组的带宽控制模式：共享表示地址组内IP共用带宽；独立表示地址组内IP独占带宽。"
    },
    {
        type: "name",
        title: "生效时间",
        content: "您可以选择规则生效的时间，Any表示立即生效。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以为规则创建描述信息，以便于记忆。"
    },
    {
        type: "name",
        title: "添加到指定位置",
        content: "您可以将规则设置到指定的位置，从而配置规则的优先级。"
    },
    {
        type: "name",
        title: "状态",
        content: "您可以选择此规则是否启用。"
    }]
};

// =======redundancy_analysis.js=====
$.su.CHAR.HELP.REDUNDANCY_ANALYSIS = {
	TITLE:"策略冗余分析",
	CONTENT:[
	{
		type:"paragraph",
		content:"策略冗余分析将分析策略中的冗余策略"
	},
	{
		type:"name",
		title:"匹配条件",
		content:"策略冗余分析将比较策略的源安全区域、目的安全区域、源地址、目的地址、服务组、应用组、用户组和时间段。"
	}
	]
};

// =======remote_mngt.js=====
$.su.CHAR.HELP.REMOTE_MNGT = {
    TITLE: "远程管理",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置进行远程管理的IP地址。"
    }, {
        type: "name",
        title: "远程地址范围",
        content: "远程管理主机的地址范围。"
    }, {
        type: "name",
        title: "状态",
        content: "您可以通过勾选改项来设置是否规则对应的地址范围内的主机进行远程管理。"
    }, {
        type: "note",
        title: "举例",
        content: "如果您想让地址段为102.31.70.0/24的主机（非LAN口网段）对设备进行远程管理，您可以建立远程管理地址条目，点击<新增>，设置远程地址范围102.31.70.0/24，状态勾选设置为启用。"
    }, {
        type: "note",
        title: "注意",
        content: [
            "包含局域网地址的远程管理地址条目无效。",
            "如果添加0.0.0.0/0的条目，将允许所有远程计算机访问设备，有可能在非法攻击情况下无法访问设备。"
        ]
    }]
}
// =======report_new.js=====
$.su.CHAR.HELP.FLOW_REPORT = {
    TITLE: "流量报表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备中存储的流量报表。"
    },
    {
        type: "name",
        title: "源地址",
        content: "以源地址为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "目的地址",
        content: "以目的地址为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "安全策略",
        content: "以安全策略为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "接口",
        content: "以接口为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "应用",
        content: "以应用为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "应用组",
        content: "以应用组为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "用户",
        content: "以用户为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "导出PDF",
        content: "导出当前统计条件下的报表PDF文件。"
    },
    {
        type: "name",
        title: "导出CSV",
        content: "导出当前统计条件下的报表CSV文件。"
    },
    {
        type: "name",
        title: "加载报表",
        content: "加载当前报表页面。"
    },
    {
        type: "name",
        title: "时间",
        content: "选择报表统计时间，可选择“过去1小时”、“过去1天”、“过去1周”、“过去1个月”、“自定义时间”，最长可选时间为31天。"
    },
    {
        type: "name",
        title: "上行流量",
        content: "以上行流量为排序条件，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "下行流量",
        content: "以下行流量为排序条件，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "总流量",
        content: "以总流量为排序条件，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "叠加图",
        content: "以叠加图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "折线图",
        content: "以折线图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "柱状图",
        content: "以柱状图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "饼图",
        content: "以饼图的形式，显示查询时间内TOP10数据报表。"
    }
    ]
};

$.su.CHAR.HELP.SPHIT_REPORT = {
    TITLE: "策略命中报表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备中存储的策略命中报表。"
    },
    {
        type: "name",
        title: "安全策略",
        content: "以安全策略为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "导出PDF",
        content: "导出当前统计条件下的报表PDF文件。"
    },
    {
        type: "name",
        title: "导出CSV",
        content: "导出当前统计条件下的报表CSV文件。"
    },
    {
        type: "name",
        title: "加载报表",
        content: "加载当前报表页面。"
    },
    {
        type: "name",
        title: "时间",
        content: "选择报表统计时间，可选择“过去1小时”、“过去1天”、“过去1周”、“过去1个月”、“自定义时间”，最长可选时间为31天。"
    },
    {
        type: "name",
        title: "安全策略命中次数",
        content: "以安全策略命中次数为排序条件，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "叠加图",
        content: "以叠加图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "折线图",
        content: "以折线图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "柱状图",
        content: "以柱状图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "饼图",
        content: "以饼图的形式，显示查询时间内TOP10数据报表。"
    }
    ]
};

$.su.CHAR.HELP.THREAT_REPORT = {
    TITLE: "威胁报表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面来查看设备中存储的威胁报表。"
    },
    {
        type: "name",
        title: "攻击者",
        content: "以攻击者为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "攻击目标",
        content: "以攻击目标为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "安全策略",
        content: "以安全策略为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "威胁类型",
        content: "以威胁类型为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "威胁名称",
        content: "以威胁名称为统计条件，筛选并显示报表。"
    },
    {
        type: "name",
        title: "导出PDF",
        content: "导出当前统计条件下的报表PDF文件。"
    },
    {
        type: "name",
        title: "导出CSV",
        content: "导出当前统计条件下的报表CSV文件。"
    },
    {
        type: "name",
        title: "加载报表",
        content: "加载当前报表页面。"
    },
    {
        type: "name",
        title: "时间",
        content: "选择报表统计时间，可选择“过去1小时”、“过去1天”、“过去1周”、“过去1个月”、“自定义时间”，最长可选时间为31天。"
    },
    {
        type: "name",
        title: "威胁次数",
        content: "以威胁次数为排序条件，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "叠加图",
        content: "以叠加图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "折线图",
        content: "以折线图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "柱状图",
        content: "以柱状图的形式，显示查询时间内TOP10数据报表。"
    },
    {
        type: "name",
        title: "饼图",
        content: "以饼图的形式，显示查询时间内TOP10数据报表。"
    }
    ]
}
// =======routing.js=====
$.su.CHAR.HELP.ADVANCED_ROUTING_SYSTEM_ROUTING_TABLE = {
    TITLE: "系统路由",
    CONTENT: [
    {
        type: "paragraph",
        content: "您可以通过本页面查看系统路由表。"
    },
    {
        type: "name",
        title: "目的地址",
        content: "数据包需要到达的地址。"
    },
    {
        type: "name",
        title: "子网掩码",
        content: "目的地址的子网掩码。"
    },
    {
        type: "name",
        title: "下一跳",
        content: "数据包到达目的地址前可以直接转发的下一个路由点。"
    },
    {
        type: "name",
        title: "出接口",
        content: "数据包进行转发的接口。"
    },
    {
        type: "name",
        title: "Metric",
        content: "数据包到达目的需要的跳数。"
    }]
};

$.su.CHAR.HELP.ADVANCED_ROUTING_STATIC_ROUTING = {
    TITLE: "静态路由",
    CONTENT: [
    {
        type: "paragraph",
        content: "您可以通过本页面设置静态路由条目。当数据包与静态路由匹配成功时，将按照指定的转发方式进行转发。"
    },
    {
        type: "name",
        title: "规则名称",
        content: "路由条目的名称，不能和已有的路由条目名称重复。"
    },
    {
        type: "name",
        title: "目的地址",
        content: "数据包需要到达的地址。"
    },
    {
        type: "name",
        title: "子网掩码",
        content: "目的地址的子网掩码。"
    },
    {
        type: "name",
        title: "下一跳",
        content: "数据包将发往的下一个路由点。"
    },
    {
        type: "name",
        title: "出接口",
        content: "数据包进行转发的接口。"
    },
    {
        type: "name",
        title: "Metric",
        content: "路由条目的优先级，其数值越低优先级越高。默认值为0，一般不需要修改。"
    },
    {
        type: "name",
        title: "可达性",
        content: "路由条目的实际生效情况。<br/>当出接口与下一跳相互匹配时，显示<可达>；<br/>当出接口与下一跳不匹配，或者条目被禁用时，显示<不可达>。<br/>仅当条目<可达>时，才是生效的。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置静态路由条目备注，以方便您管理和查找。备注最多支持50个字符。"
    },
    {
        type: "name",
        title: "启用/禁用规则",
        content: "设置路由条目生效或不生效。"
    }]
};

$.su.CHAR.HELP.ADVANCED_ROUTING_STATIC6_ROUTING = {
    TITLE: "IPv6静态路由",
    CONTENT: [
    {
        type: "paragraph",
        content: "您可以通过本页面设置IPv6静态路由条目。当数据包与静态路由匹配成功时，将按照指定的转发方式进行转发。"
    },
    {
        type: "name",
        title: "规则名称",
        content: "路由条目的名称，不能和已有的路由条目名称重复。"
    },
    {
        type: "name",
        title: "IPv6目的地址",
        content: "数据包需要到达的地址。"
    },
    {
        type: "name",
        title: "子网前缀长度",
        content: "目的地址的子网前缀长度。"
    },
    {
        type: "name",
        title: "下一跳",
        content: "数据包将发往的下一个路由点。"
    },
    {
        type: "name",
        title: "出接口",
        content: "数据包进行转发的接口。"
    },
    {
        type: "name",
        title: "Metric",
        content: "路由条目的优先级，其数值越低优先级越高。默认值为1，一般不需要修改。"
    },
    {
        type: "name",
        title: "可达性",
        content: "路由条目的实际生效情况。<br/>当出接口与下一跳相互匹配时，显示<可达>；<br/>当出接口与下一跳不匹配，或者条目被禁用时，显示<不可达>。<br/>仅当条目<可达>时，才是生效的。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置静态路由条目备注，以方便您管理和查找。备注最多支持50个字符。"
    },
    {
        type: "name",
        title: "启用/禁用规则",
        content: "设置路由条目生效或不生效。"
    }]
};

$.su.CHAR.HELP.POLICY_ROUTING_SETTING = {
    TITLE: "策略路由",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置，对数据包出接口进行选择。"
    }]
};

$.su.CHAR.HELP.POLICY_ROUTING_LIST = {
    TITLE: "规则列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以查看选路规则，还可以通过表格按钮对条目进行操作。"
    },
    {
        type: "name",
        title: "规则名称",
        content: "您可以设置策略选路规则条目名称。"
    },
    {
        type: "name",
        title: "服务类型",
        content: "您可以选择服务类型，以确定选路规则条目的协议。当服务对应的协议为TCP、UDP、TCP/UDP时，还将确定源、目的端口范围。"
    },
    {
        type: "name",
        title: "源地址",
        content: "您可以选择地址对象，以确定选路规则条目的源地址范围。"
    },
    {
        type: "name",
        title: "目的地址",
        content: "您可以选择地址对象，以确定选路规则条目的目的地址范围。"
    },
    {
        type: "name",
        title: "生效接口",
        content: "您可以选择符合此选路规则条目数据包的出接口。"
    },
    {
        type: "name",
        title: "生效时间",
        content: "您可以选择规则生效时间。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置条目的备注，以方便您管理和查找。"
    },{
        type:"name",
        title:"添加到指定位置",
        content:"指定添加的规则的位置，排在前面的规则比后面规则优先级高"
    },
    {
        type: "name",
        title: "强制",
        content: "您可以选择规则在出接口不在线时是否仍然执行。在所有出接口都不在线时，若强制，将转发到该规则中已连接的接口，如没有已连接的接口则丢包；若非强制，将跳过此规则。在任何其他情况下，将转发到在线的接口。"
    },
    {
        type: "name",
        title: "状态",
        content: "您可以选择规则是否生效。"
    }]
};

// =======security_global_config.js=====
$.su.CHAR.HELP.SECURITY_GLOBAL_CONFIG= {
    TITLE: "全局配置",
    CONTENT: [
        {
            type: "name",
            title: "阻断HTTP协议断点续传功能",
            content: "配置该功能后，HTTP协议将无法断点续传"
        },
        {
            type: "name",
            title: "阻断FTP协议断点续传功能",
            content: "设置该功能后，FTP协议将无法断点续传"
        },
    ]
};

// =======security_policy.js=====
$.su.CHAR.HELP.SECURITY_POLICY = {
	TITLE: "安全策略",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看安全策略。"
	},
	{
		type: "name",
		title: "策略名称",
		content: "安全策略名称。"
	},
	{
		type: "name",
		title: "描述",
		content: "安全策略的描述信息。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "指定安全策略匹配的数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "指定安全策略匹配的数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "指定安全策略匹配的数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "指定安全策略匹配的数据流目的地址。"
	},
	{
		type: "name",
		title: "服务组",
		content: "指定安全策略匹配的数据流协议及端口。"
	},
	{
		type: "name",
		title: "应用组",
		content: "指定安全策略匹配的应用组，也可以单选应用。当策略动作选择允许时，会放行相关的网络基础协议。"
	},
	{
		type: "name",
		title: "时间段",
		content: "指定安全策略生效的时间段。"
	},
	{
		type: "name",
		title: "动作",
		content: "允许或者禁用上述条件过滤出来的数据。"
	},
	{
		type: "name",
		title: "内容安全",
		content: "对满足上述过滤条件的流量数据进行更深入一步的内容安全的检查。"
	},
	{
		type: "name",
		title: "URL过滤",
		content: "选择安全配置文件中的URL过滤配置对URL请求进行检查。"
	},
	{
		type: "name",
		title: "反病毒",
		content: "选择安全配置文件中的反病毒配置对病毒文件进行检查。"
	},
	{
		type: "name",
		title: "入侵防御",
		content: "选择安全配置文件中的入侵防御配置对入侵行为进行检查。"
	},
	{
		type: "name",
		title: "文件过滤",
		content: "选择安全配置文件中的文件过滤配置对下载和上传的文件类型进行检查。"
	},
	{
		type: "name",
		title: "应用行为控制",
		content: "选择安全配置文件中的应用行为控制配置对多种应用的行为进行控制。"
	},
	{
		type: "name",
		title: "邮件内容过滤",
		content: "选择安全配置文件中的邮件内容过滤配置对邮件内容进行检查。"
	}]
};



$.su.CHAR.HELP.URLFILTER_CONF = {
	TITLE: "URL过滤配置文件列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "URL过滤配置文件的名称。"
		},
		{
			type: "name",
			title: "策略类型",
			content: "对符合规则的网址放行或禁止。当选择\"仅允许访问下列的URL\"时，会将不匹配的URL数据丢弃，选择\"禁止访问下列的URL\"时，仅丢弃匹配的URL数据。"
		},
		{
			type: "name",
			title: "过滤方式",
			content: "\"网站分组\"是根据\"对象\"中的网站组来对URL进行匹配，\"URL\"关键字是用自定义的关键字对URL进行部分匹配，\"完整URL\"是指自定义URL进行完全匹配。"
		},
		{
			type: "name",
			title: "过滤内容列表",
			content: "填写需要过滤的内容。其中单独符号.表示任意URL，也就是与任意URL匹配。<br>.规则只能配置一条，表示对任意的URL禁止或者允许，并且该规则只能在规则列表最后面。"
		},
		{
			type: "name",
			title: "网站过滤列表",
			content: "选择需要过滤的网站分组。"
		},
		{
			type: "name",
			title: "备注",
			content: "您可以为该规则添加备注，50字符以内。"
		}
	]
};

$.su.CHAR.HELP.FILEFILTER_CONF = {
	TITLE: "文件过滤配置文件列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "文件过滤配置文件的名称。"
		},
		{
			type: "name",
			title: "禁止网页提交",
			content: "是否开启禁止网页提交功能。"
		},
		{
			type: "name",
			title: "过滤文件拓展类型",
			content: "添加待过滤的文件后缀，各个后缀之间以换行隔开。"
		},
		{
			type: "name",
			title: "备注",
			content: "您可以为该规则添加备注，50字符以内。"
		}
	]
};

$.su.CHAR.HELP.APPCONTROLFILTER_CONF = {
	TITLE: "应用行为控制配置文件列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "应用行为控制配置文件的名称。"
		},
		{
			type: "name",
			title: "告警阈值",
			content: "输入被允许通过的应用行为的告警阈值。"
		},
		{
			type: "name",
			title: "阻断阈值",
			content: "输入被允许通过的应用行为的阻断阈值。"
		},
		{
			type: "name",
			title: "HTTP POST",
			content: "选择针对HTTP POST操作的安全动作，可选允许/禁止。如需保证高质量的HTTP POST，建议放行一定阈值的文件上传。"
		},
		{
			type: "name",
			title: "HTTP网页浏览",
			content: "选择针对HTTP网页浏览的安全动作，可选允许/禁止。如需保证高质量的网页浏览，建议放行一定阈值的文件下载。"
		},
		{
			type: "name",
			title: "HTTP代理上网",
			content: "选择针对HTTP代理上网的安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "HTTP文件上传",
			content: "选择针对HTTP文件上传的安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "HTTP文件下载",
			content: "选择针对HTTP文件下载操作的安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "FTP文件上传",
			content: "选择针对FTP文件上传的安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "FTP文件下载",
			content: "选择针对FTP文件下载操作的安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "FTP文件删除",
			content: "选择针对FTP文件删除操作的安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "QQ登录",
			content: "选择针对QQ登录的默认安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "QQ登录黑名单",
			content: "输入不可登录的QQ账号，当QQ登录的默认安全动作为允许时，登录黑名单生效。"
		},
		{
			type: "name",
			title: "QQ登录白名单",
			content: "输入可登录的QQ账号，当QQ登录的默认安全动作为禁止时，登录白名单生效。"
		},
		{
			type: "name",
			title: "备注",
			content: "您可以为该规则添加备注，50字符以内。"
		}
	]
};

$.su.CHAR.HELP.EMAILFILTER_CONF = {
	TITLE: "邮件内容过滤配置文件列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "邮件内容过滤配置文件的名称。"
		},
		{
			type: "name",
			title: "SMTP",
			content: "选择针对SMTP协议的默认安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "POP3",
			content: "选择针对POP3协议的默认安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "IMAP",
			content: "选择针对IMAP协议的默认安全动作，可选允许/禁止。"
		},
		{
			type: "name",
			title: "发件人黑名单",
			content: "输入不被允许通过的邮件中的发件人名单。"
		},
		{
			type: "name",
			title: "发件人白名单",
			content: "输入被允许通过的邮件中的发件人名单。"
		},
		{
			type: "name",
			title: "收件人黑名单",
			content: "输入不被允许通过的邮件中的收件人名单。"
		},
		{
			type: "name",
			title: "收件人白名单",
			content: "输入被允许通过的邮件中的收件人名单。"
		},
		{
			type: "name",
			title: "备注",
			content: "您可以为该规则添加备注，50字符以内。"
		}
	]
};

$.su.CHAR.HELP.FILECONTENTFILTER_CONF = {
	TITLE: "文件过滤配置文件列表",
	CONTENT: [
		{
			type: "name",
			title: "名称",
			content: "文件过滤配置文件的名称。"
		},
		{
			type: "name",
			title: "应用",
			content: "选择进行文件过滤的应用。"
		},
		{
			type: "name",
			title: "方向",
			content: "选择进行文件过滤的传输方向，可选上传/下载/双向。"
		},
		{
			type: "name",
			title: "动作",
			content: "选择文件过滤的命中动作，可选允许/告警/禁止。"
		},
		{
			type: "name",
			title: "文件后缀列表",
			content: "添加待过滤的文件后缀，各个后缀之间以换行隔开。"
		},
		{
			type: "name",
			title: "备注",
			content: "您可以为该规则添加备注，50字符以内。"
		}
	]
};

$.su.CHAR.HELP.SPSTAT_GLOBAL = {
	TITLE: "全局配置",
	CONTENT: [{
			type: "paragraph",
			content: "您可以通过本页面开启或关闭安全策略流量统计。"
		},
		{
			type: "name",
			title: "启用安全策略流量统计",
			content: "选中来启用安全策略流量统计。"
		}
	]
};

$.su.CHAR.HELP.SPSTAT_CHART = {
	TITLE: "流量统计报表",
	CONTENT: [{
			type: "paragraph",
			content: "您可以通过本页面查看安全策略历史流量统计。"
		},
		{
			type: "name",
			title: "折线图内容",
			content: "选择需要实时查看的内容。"
		},
		{
			type: "name",
			title: "安全策略",
			content: "选择需要实时查看的安全策略。"
		}
	]
};

$.su.CHAR.HELP.SPSTAT_GRID = {
	TITLE: "流量统计列表",
	CONTENT: [{
			type: "paragraph",
			content: "您可以通过本页面查看安全策略当前流量统计。"
		},
		{
			type: "name",
			title: "清空",
			content: "点击清空按钮可以清空安全策略命中的流量统计信息。"
		},
		{
			type: "name",
			title: "安全策略",
			content: "安全策略名称。"
		},
		{
			type: "name",
			title: "下行速率",
			content: "安全策略命中的的数据下行速率。"
		},
		{
			type: "name",
			title: "上行速率",
			content: "安全策略命中的的数据上行速率。"
		},
		{
			type: "name",
			title: "下行包速率",
			content: "安全策略命中的的数据包下行速率。"
		},
		{
			type: "name",
			title: "上行包速率",
			content: "安全策略命中的的数据包上行速率。"
		},
		{
			type: "name",
			title: "下行总字节",
			content: "安全策略命中的下行数据的字节总数。"
		},
		{
			type: "name",
			title: "上行总字节",
			content: "安全策略命中的上行数据的字节总数。"
		},
		{
			type: "name",
			title: "下行总报文",
			content: "安全策略命中的下行数据的报文总数。"
		},
		{
			type: "name",
			title: "上行总报文",
			content: "安全策略命中的上行数据的报文总数。"
		},
		{
			type: "note",
			title: "注意",
			content: "点击表头中的文字，可以对该列进行升序/降序排序。"
		}
	]
};

$.su.CHAR.HELP.SP_HITLOG =
{
	TITLE: "策略命中日志",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看策略命中日志。"
	},
	{
		type: "name",
		title: "时间",
		content: "日志时间。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "数据流目的地址。"
	},
	{
		type: "name",
		title: "源端口",
		content: "数据流源端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "目的端口",
		content: "数据流目的端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "协议",
		content: "数据流协议。"
	},
	{
		type: "name",
		title: "用户",
		content: "安全策略匹配到的用户"
	},
	{
		type: "name",
		title: "应用",
		content: "安全策略匹配的应用。"
	},
	{
		type: "name",
		title: "动作",
		content: "安全策略的动作。"
	},
	{
		type: "name",
		title: "安全策略",
		content: "命中的安全策略名称。"
	},
	{
		type: "name",
		title: "导出日志",
		content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志"
	}]
};

// =======service.js=====
$.su.CHAR.HELP.SERVICE_TYPE = 
{
     TITLE: "服务类型",
     CONTENT: [{
         type: "paragraph",
         content: "您可以在本页面设置自定义服务类型。"
     },{
         type: "name",
         title: "服务名称",
         content: "您将要设置的服务类型的名称，注意不能与系统预定义服务类型名称重复。"
     },{
         type: "name",
         title: "协议类型/协议号",
         content: "服务所使用的协议。您可以选择TCP，UDP，TCP/UDP或ICMP，也可以选择other并输入协议号(0-255)。"
     },{
         type: "name",
         title: "源端口范围",
         content: "服务所使用的源端口范围，仅TCP或UDP协议需要设置。"
     },{
         type: "name",
         title: "目的端口范围",
         content: "服务所使用的目的端口范围，仅TCP或UDP协议需要设置。"
     },{
         type: "name",
         title: "ICMP",
         content: "ICMP协议的类型(type)和编码(code)，填充255时表明所有类型/编码。"
     } ,{
         type: "name",
         title: "备注",
         content: "您可以对服务类型进行描述。"
     }]
};

$.su.CHAR.HELP.SERVICE_GROUP_SETTING =
{
    TITLE: "服务组列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置服务组对象，进行服务组对象的管理。"
    },
    {
        type: "name",
        title: "组名称",
        content: "标志服务组的名称。"
    },
    {
        type: "name",
        title: "服务类型",
        content: "服务组所引用的服务对象(可多选)，引用了该服务组的规则，对所有服务对象均会生效。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置服务组的备注，以方便您管理和查找。备注最多支持50个字符。"
    },
    {
        type: "note",
        title: "注意",
         content:[
            "服务组对象一旦在其他地方被引用则无法在本页面被删除，除非解除引用。",
            "服务组可以为空(即不选择任何地址对象)，引用该服务组的规则对所有服务均不生效。"
         ]
    }
    ]
};
// =======session_limits.js=====
$.su.CHAR.HELP.SESSIONLIMIT_ENABLE = {
    TITLE: "功能设置",
    CONTENT: [{
        type: "name",
        title: "启用连接数限制",
        content: "您可以勾选此项，使连接数限制功能生效。"
    }]
};

$.su.CHAR.HELP.SESSIONLIMIT_LIST = {
    TITLE: "连接数限制规则列表",
    CONTENT: [{
        type: "name",
        title: "名称",
        content: "设置规则的名称。"
    }, {
        type: "name",
        title: "受控地址组",
        content: "设置受限的IP地址范围。"
    }, {
        type: "name",
        title: "最大连接数",
        content: "设置受限IP的最大连接数。"
    }, {
        type: "name",
        title: "是否启用",
        content: "您可以勾选此项，使规则生效。"
    }]
};

$.su.CHAR.HELP.SESSION_LIMITS = {
    TITLE: "连接数监控",
    CONTENT: [{
        type: "paragraph",
        content: "您可通过本页面查看已设置连接数限制规则的地址组内IP地址已建立的连接数。"
    }, {
        type: "name",
        title: "IP",
        content: "已被设置连接数限制规则的地址组中已被监控到的IP地址。"
    }, {
        type: "name",
        title: "最大连接数",
        content: "设置受限IP的最大连接数。"
    }, {
        type: "name",
        title: "当前连接数",
        content: "受限IP当前的连接数。"
    }]
};

// =======signature_db.js=====
$.su.CHAR.HELP.SIGNATURE_DB = {
    TITLE: "升级中心列表",
    CONTENT: [
        {
            type: "name",
            title: "版本信息",
            content: "云端版本库信息"
        },
        {
            type: "name",
            title: "获取最新版本信息",
            content: "点击后，会同步云端信息,获取当前最新的版本库信息<br>设置了自动升级，设备会在自动升级前，自动拉取云端信息"
        },
        {
            type: "name",
            title: "特征库",
            content: "提供给设备使用的特征数据库的名称"
        },
        {
            type: "name",
            title: "上一版本",
            content: "上一个特征数据库的版本号"
        },
        {
            type: "name",
            title: "上一版本发布日期",
            content: "上一个特征数据库发布的年-月-日"
        },
        {
            type: "name",
            title: "当前版本",
            content: "当前特征数据库的版本号"
        },
        {
            type: "name",
            title: "当前版本发布日期",
            content: "当前特征数据库发布的年-月-日"
        },
        {
            type: "name",
            title: "升级服务有效期",
            content: "用户购买的特征库的升级服务的有效期限，超出有效期后，无法升级过期的特征库"
        },
        {
            type: "name",
            title: "定时升级",
            content: "是否定时升级该特征库，如果为'是'，则会按照规定的时间，定时升级特征库"
        },
        {
            type: "name",
            title: "定时升级时间",
            content: "定时升级特征库的时间，请尽量选在使用较少的时间段升级，升级过程中会消耗一定程度设备性能"
        },
        {
            type: "name",
            title: "状态",
            content: "表示特征库的状态，加载成功表示特征库已经成功加载到设备中"
        },
        {
            type: "name",
            title: "立即安装",
            content: "当设置仅下载，并下载好对应特征库，可以通过【状态】栏中立即安装按钮升级特征库"
        },
        {
            type: "name",
            title: "在线升级",
            content: "通过连接云端服务器下载并安装特征库"
        },
        {
            type: "name",
            title: "本地升级",
            content: "从本地电脑中导入和安装特征库"
        },
        {
            type: "name",
            title: "版本回退",
            content: "将特征库版本回退到上一个版本<br>可以再次点击版本回退，回退到原来的版本"
        },
        {
            type: "name",
            title: "仅下载",
            content: "仅下载的情况下，反病毒特征库会删除上一版本，只保留下载好的版本;其他特征库会保留上一版本"
        },
        {
            type: "name",
            title: "下载并安装",
            content: "该情况下，特征库会直接加载到设备中，并作为当前版本;之前生效的版本将作为上一版本"
        }
    ]
};

// =======slaac.js=====
$.su.CHAR.HELP.SLAAC_SERVER_SETTINGS = 
{
	TITLE: "SLAAC列表",
    CONTENT: [
    	{
            type: "paragraph",
            content: "本栏用于查看IPv6无状态地址自动配置服务（Stateless address autoconfiguration, SLAAC）的相关信息，还可以通过表格按钮进行相关操作。"
        },
        {
            type: "name",
            title: "服务接口",
            content: "用于SLAAC的服务接口。"
        },
        {
            type: "name",
            title: "IPv6地址前缀",
            content: "Server宣告的IPv6地址前缀。可选，默认使用服务接口的IPv6地址前缀。"
        },
        {
            type: "name",
            title: "DNS配置方式",
            content: "设置客户端的DNS配置方式，包括DHCPv6和RDNSS两种方式。"
        },
        {
            type: "name",
            title: "首选/备用DNS服务器",
            content: "可选项，请填入ISP提供的DNS服务器，若不清楚可以向ISP询问。"
        },
        {
            type: "name",
            title: "状态",
            content: "勾选后开启SLAAC服务。"
        }
    ]
};
// =======threat_log.js=====
$.su.CHAR.HELP.THREATLOG = {
	TITLE: "威胁日志",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看威胁日志。"
	},
	{
		type: "name",
		title: "时间",
		content: "日志时间。"
	},
	{
		type: "name",
		title: "威胁类型",
		content: "防火墙检测到的威胁的类型：入侵、病毒、恶意域名。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "数据流目的地址。"
	},
	{
		type: "name",
		title: "源端口",
		content: "数据流源端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "目的端口",
		content: "数据流目的端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "协议",
		content: "数据流协议。"
	},
	{
		type: "name",
		title: "安全策略",
		content: "命中的安全策略名称。"
    },
    {
		type: "name",
		title: "应用",
		content: "数据流应用。"
    },
    {
		type: "name",
		title: "威胁名称",
		content: "防火墙检测到的威胁的名称。"
    },
    {
		type: "name",
		title: "威胁ID",
		content: "防火墙检测到的威胁的ID编号。"
	},
	{
		type: "name",
		title: "动作",
		content: "威胁处理的动作。"
	},
	{
		type: "name",
		title: "详细信息",
		content: "点击查看检测到威胁的详细信息。"
	},
	{
		type: "name",
		title: "严重性",
		content: "详细信息内，入侵防御检测到的威胁的严重性。"
	},
	{
		type: "name",
		title: "操作系统",
		content: "详细信息内，入侵防御检测到的威胁对应的操作系统。"
	},
	{
		type: "name",
		title: "威胁类别",
		content: "详细信息内，入侵防御检测到的威胁的类别。"
	},
	{
		type: "name",
		title: "威胁计数",
		content: "详细信息内，数据流中检测到某一个病毒的个数。"
	},
	{
		type: "name",
		title: "文件名",
		content: "详细信息内，检测到病毒文件的文件名称。"
	},
	{
		type: "name",
		title: "文件类型",
		content: "详细信息内，检测到病毒文件的文件类型。"
	},
	{
		type: "name",
		title: "Hash值",
		content: "详细信息内，检测到病毒文件的MD5值。"
	},
	{
		type: "name",
		title: "访问内容",
		content: "详细信息内，检测到恶意域名时被访问的域名。"
	},
	{
		type: "name",
		title: "导出日志",
		content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志"
	}]
};
// =======time_mngt.js=====
$.su.CHAR.HELP.TIME_MNGT_SETTING = 
{
    TITLE: "时间对象列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置时间对象，进行时间对象的管理。注意时间对象只能设置生效星期和无法设置具体日期。"
    },
    {
        type: "name",
        title: "时间对象名称",
        content: "标志时间对象的名称。"
    },
    {
        type: "name",
        title: "时间设置",
        content: "用于设置时间对象所包含的时间段，有两种设置方式。",
         children:[{
             type:"step",
             content:[
                "工作日历：通过在日历上划分矩形覆盖对应的时间区域来设置包含的时间段，只能精确到小时。",
                "手动设置：通过手动输入生效时间段并勾选生效星期来设置一个时间段，精确到分钟，但一个对象最多只能设置12个时间段。"
             ]
         }]
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置时间对象的备注，以方便您管理和查找。"

    },
    {
        type: "note",
        title: "注意",
        content: "时间对象一旦在其他地方被引用则无法在本页面被删除，除非解除引用。"
    }
    ]
};


// =======time_setting.js=====
$.su.CHAR.HELP.TIME_SETTING = {
        TITLE: "时间设置",
        CONTENT: [{
            type: "paragraph",
            content: "您可以通过本页面来查看和设置系统时间。"
        }, {
            type: "name",
            title: "当前时间",
            content: "当前系统的时间。"
        }, {
            type: "name",
            title: "设置时间",
            content: "设置设备系统时间的方式，分为通过网络获取系统时间和手动设置系统时间，其中手动设置系统时间也可以通过获取管理主机时间的方式进行设置。"
        }, {
            type: "name",
            title: "通过网络获取系统时间",
            content: "选中<通过网络获取系统时间>，设备将通过网络获取GMT时间。",
            children: [{
                type: "step",
                content: [
                    "时区：设备所在的时区。",
                    "首选/备用NTP服务器：您可以自行指定NTP服务器地址。"
                ]
            }]
        }, {
            type: "name",
            title: "手动设置系统时间",
            content: "选中<手动设置系统时间>，您可以通过手动输入的方式来设置设备日期和时间。"
        }, {
            type: "name",
            title: "获取管理主机时间",
            content: "点击<获取管理主机时间>，系统将获取当前管理主机的时间并将设备的系统时间设置为该时间。"
        }]
};

// =======upnp.js=====
$.su.CHAR.HELP.UPNP_SETTING = {
        TITLE: "功能设置",
        CONTENT: [{
             type: "paragraph",
             content: "如果您启用UPnP服务，则本地应用程序可以通过UPnP协议与设备协商相关功能（如端口映射）设置。"
        },{
             type: "name",
             title: "服务接口",
             content: "您可以指定一组接口集，该集合包含的接口作为UPnP的内部接口。"
         },{
             type: "name",
             title: "对外生效接口",
             content: "您可以指定一组接口集，该集合包含的接口作为UPnP的外部接口。"
         },
         {
             type: "name",
             title: "启用/禁用服务",
             content: "您可以选择启/禁用UPnP服务。"
         }]
};

$.su.CHAR.HELP.UPNP_LIST = {
        TITLE: "服务列表",
        CONTENT: [{
             type: "paragraph",
             content: "在服务列表中，您会看到通过UPnP协议向设备请求的端口映射条目。您可以通过表格按钮对这些条目进行操作。"
        },
        {
             type: "name",
             title: "服务名称",
             content: "对应用程序所配置的端口映射的描述信息。"
        },
        {
             type: "name",
             title: "协议类型",
             content: "表示对何种协议（TCP、UDP或TCP/UDP）进行端口映射。"
        },
        {
             type: "name",
             title: "接口",
             content: "显示需要进行端口转换的设备接口集。"
        },
        {
             type: "name",
             title: "服务IP地址",
             content: "显示需要进行端口转换的主机IP地址。"
        },
        {
             type: "name",
             title: "外部端口",
             content: "显示端口映射配置的外部端口。"
        },
        {
             type: "name",
             title: "内部端口",
             content: "显示端口映射配置的内部端口。"
        },
        {
             type: "name",
             title: "状态",
             content: [
                "已启用：表示请求的端口映射功能被开启； 已禁用：表示请求的端口映射功能未生效。"
                ]
        }]
};

// =======url_filter.js=====
$.su.CHAR.HELP.URLFILTER_ENABLE = {
	TITLE: "全局设置", 
	CONTENT: [
		{
			type: "name", 
			title: "启用URL过滤功能", 
			content: "您可以选择是否开启URL过滤功能。"
		}
	]
};

$.su.CHAR.HELP.URLFILTER_LIST = {
	TITLE: "URL过滤规则列表", 
	CONTENT: [
		{
			type: "name", 
			title: "用户组", 
			content: "选择地址对象，以建立过滤规则条目的地址范围。"
		}, 
		{
			type: "name", 
			title: "策略类型", 
			content: "对符合规则的网址放行或禁止。"
		}, 
		{
			type: "name", 
			title: "过滤方式", 
			content: "关键字为部分匹配，完整URL表示完全匹配。"
		}, 
		{
			type: "name", 
			title: "过滤内容列表", 
			content: "填写需要过滤的内容。其中单独符号.表示任意URL，也就是与任意URL匹配。<br>.规则只能配置一条，表示对任意的URL禁止或者允许，并且该规则只能在规则列表最后面。"
		}, 
		{
			type: "name",
			title: "访问上述网站时",
			content: "系统日志是否记录上述网站的访问情况。"
		},
		{
			type: "name", 
			title: "规则生效时间", 
			content: "选择规则生效的时间。"
		}, 
		{
			type: "name", 
			title: "状态", 
			content: "表示是否启用该规则。"
		}, 
		{
			type: "name", 
			title: "备注", 
			content: "您可以为该规则添加备注，50字符以内。"
		}, 
		{
			type: "name", 
			title: "添加到指定位置(第几条)", 
			content: "指定添加的规则的位置，排在前面的规则比后面规则优先级高。"
		}
	]
};
// =======url_log.js=====
$.su.CHAR.HELP.URLLOG =
{
	TITLE: "URL日志",
	CONTENT: [{
		type: "paragraph",
		content: "您可以通过本页面查看URL日志。"
	},
	{
		type: "name",
		title: "时间",
		content: "日志时间。"
    },
    {
		type: "name",
		title: "URL",
		content: "被过滤的URL。"
    },
    {
		type: "name",
		title: "URL分组",
		content: "被过滤的URL的分组。"
	},
	{
		type: "name",
		title: "源安全区域",
		content: "数据流源安全区域。"
	},
	{
		type: "name",
		title: "目的安全区域",
		content: "数据流目的安全区域。"
	},
	{
		type: "name",
		title: "源地址",
		content: "数据流源地址。"
	},
	{
		type: "name",
		title: "目的地址",
		content: "数据流目的地址。"
	},
	{
		type: "name",
		title: "源端口",
		content: "数据流源端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "目的端口",
		content: "数据流目的端口，仅对TCP/UDP有效。"
	},
	{
		type: "name",
		title: "用户",
		content: "数据流对应用户。"
	},
	{
		type: "name",
		title: "协议",
		content: "数据流协议。"
	},
    {
		type: "name",
		title: "应用",
		content: "数据流应用"
    },
    {
		type: "name",
		title: "动作",
		content: "URL过滤的处理的动作"
	},
    {
		type: "name",
		title: "安全策略",
		content: "命中的安全策略名称。"
    },
    {
		type: "name",
		title: "URL过滤配置文件",
		content: "匹配到安全策略对应的URL过滤配置文件"
    },
    {
		type: "name",
		title: "域名",
		content: "被过滤URL对应的域名"
    },
	{
		type: "name",
		title: "导出日志",
		content: "点击<导出日志>按钮，设备将以文件形式保存当前设备中的日志,最多支持导出最近的100000条日志"
	}]
};
// =======usergroup.js=====
$.su.CHAR.HELP.USERGROUP_LIST =
{
    TITLE: "用户组列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置用户组对象，进行用户组对象的管理。"
    },
    {
        type: "name",
        title: "用户组名称",
        content: "标志用户组的名称。"
    },
    {
        type: "name",
        title: "成员列表",
        content: "用户组所引用的用户对象(可多选)，引用了该用户组的规则，对所有用户对象所包含的地址均会生效。"
    },
    {
        type: "note",
        title: "注意",
         content:[
            "用户组对象一旦在其他地方被引用则无法在本页面被删除，除非解除引用。"
         ]
    }
    ]
};

// =======vpn.js=====
//IPSec
$.su.CHAR.HELP.IPSEC_TUNNEL_SETTING = {
         TITLE: "IPSec安全策略设置",
         CONTENT: [{
             type: "paragraph",
             content: "您可以通过本页面设置IPSec安全策略，安全策略规定了对什么样的数据流采用什么样的安全提议。安全策略设置分为必要设置和高级设置两个部分，其中高级设置是可选部分。"
         },
		 {
             type: "paragraph",
			 title:"必要设置",
			 content:"对于新建的安全策略，必要设置是必须提供的，不能省略。"
         },
		 {
             type: "name",
             title: "安全策略名称",
             content: "设置IPSec安全策略的名称，名称最多支持32个字符。"
         },
         {
             type: "name",
             title: "对端网关",
             content: "设置对端网关，可以填写对端的IP地址或域名，作为响应者的时候可以将对端网关设为“0.0.0.0”,表示对端地址可以任意。"
         },
		 {
             type: "name",
             title: "绑定接口",
             content: "从下拉列表中指定本地使用的接口；对端网关设置的\"对端网关地址\"必须与该接口的IP地址相同。"
         },
		 {
             type: "name",
             title: "本地子网范围",
             content: "设置受保护的数据流的本地子网范围，由IP地址和子网掩码来确定。"
         },
		 {
             type: "name",
             title: "对端子网范围",
             content: "设置受保护的数据流的对端子网范围，由IP地址和子网掩码来确定。"
         },
		 {
             type: "name",
             title: "预共享密钥",
             content: "对于每对<绑定接口，对端网关>，都必须指定唯一的预共享密钥作为它们之间相互认证的凭证。"
         },
         {
             type: "name",
             title: "状态",
             content: "设置勾选启用时，当前策略生效。"
         },
		 {
             type: "paragraph",
			 title:"高级设置",
             content: "高级设置包括两个部分：阶段1设置和阶段2设置。一般地，用户不需要配置高级设置，采用默认值即可。"
         },
		 {
             type: "name",
			 title:"高级设置-阶段1设置",
             content: "设定IKEv1的第一阶段的相关参数"
         },
		 {
             type: "name",
             title: "安全提议",
             content: "用于IKE协商方式下选择IPSec安全提议，在IKE协商模式下可以最多选择四条不同安全提议，主模式协商可以选择4条，野蛮模式协商可以选择1条。"
         },
		 {
             type: "name",
             title: "交换模式",
             content: "IKEv1版本支持两种模式：主模式和野蛮模式，默认是选择主模式。"
         },
		 {
             type: "name",
             title: "协商模式",
             content: "初始者模式会主动向对端发起连接，此时要求对端网关是路由可达，而响应者模式仅仅会等待对端发起连接。"
         },
         {
             type: "name",
             title: "本地ID类型",
             content: "作为对端的身份标识，支持两种类型：IP地址和NAME，默认选择\"IP地址\",如果选择NAME类型，则需要输入任意的字符串。"
         },
		 {
             type: "name",
             title: "本地ID",
             content: "仅仅在本地ID类型选择NAME的时候生效，用于存储用户输入对应的字符串。"
         },
		 {
             type: "name",
             title: "对端ID类型",
             content: "作为对端的身份标识，支持两种类型：IP地址和NAME，默认选择\"IP地址\",如果选择NAME类型，则需要输入任意的字符串。"
         },
		 {
             type: "name",
             title: "对端ID",
             content: "仅仅在对端ID类型选择NAME的时候生效，用于存储用户输入对应的字符串。"
         },
		 {
             type: "name",
             title: "生存时间",
             content: "用于IKE协商方式下设置第一阶段IPSec会话密钥的生存时间。"
         },
		 {
             type: "name",
             title: "DPD检测开启",
             content: "选择是否开启DPD检测功能，开启该功能会定时发送DPD数据包以快速发现对端是否在线。"
         },
		 {
             type: "name",
             title: "DPD检测周期",
             content: "仅在DPD检测开启启用之后生效，用于指定相邻两次发送DPD检测数据包的时间间隔。"
         },
		 {
             type: "name",
             title: "高级设置-阶段2设置",
             content: "设定IKEv1的第二阶段的相关参数"
         },
         {
             type: "name",
             title: "封装模式",
             content: "指定该策略是隧道模式还是传输模式，两者的区别在于：前者会在原始IP报文外多增加一个IP头，后者则不会。"
         },
		 {
             type: "name",
             title: "安全提议",
             content: "用于IKE协商方式下选择IPSec安全提议，在IKE协商模式下可以最多选择四条不同安全提议。"
         },
		 {
             type: "name",
             title: "PFS",
             content: "用于IKE协商方式下设置IPSec会话密钥的PFS属性，对端的PFS属性必须与本地的PFS属性一致。"
         },
		 {
             type: "name",
             title: "生存时间",
             content: "用于IKE协商方式下设置第二阶段IPSec会话密钥的生存时间。"
         }]
};

$.su.CHAR.HELP.IPSEC_TUNNEL_LISTS = {
         TITLE: "IPSec安全策略列表",
         CONTENT: [{
             type: "paragraph",
             content: "您可以查看已经配置的IPSec安全策略条目，还可以通过表格按钮对条目进行操作。"
         }]
};

$.su.CHAR.HELP.IPSEC_SA = {
         TITLE: "IPSec安全联盟列表",
         CONTENT: [{
             type: "paragraph",
             content: "您可以通过本页面查看当前建立的安全联盟。"
         },
		 {
             type: "name",
             title: "名称",
             content: "显示安全联盟的名称，一般地，该名称和安全策略名称相同。"
         },
		 {
             type: "name",
             title: "SPI",
             content: "显示安全联盟的SPI（Security Parameter Index，安全性参数索引），注意每一个安全联盟的SPI都不相同。"
         },
		 {
             type: "name",
             title: "方向",
             content: "显示安全联盟的方向（in:流入/out:流出）。"
         },
		 {
             type: "name",
             title: "隧道两端",
             content: "显示安全联盟的两端的网关地址。"
         },
		 {
             type: "name",
             title: "数据流",
             content: "显示安全联盟的两端的子网范围。"
         },
		 {
             type: "name",
             title: "安全协议",
             content: "显示安全联盟使用的安全协议。"
         },
		 {
             type: "name",
             title: "AH验证算法",
             content: "显示安全联盟使用的AH验证算法。"
         },
		 {
             type: "name",
             title: "ESP验证算法",
             content: "显示安全联盟使用的ESP验证算法。"
         },
		 {
             type: "name",
             title: "ESP加密算法",
             content: "显示安全联盟使用的ESP加密算法。"
         }]
};

//L2TP
$.su.CHAR.HELP.L2TP_CLIENT_GLOBAL = {
        TITLE: "全局设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以设置L2TP客户端的全局配置。"
         },{
             type: "name",
             title: "L2TP链路维护时间间隔",
             content: "发送L2TP链路维护检测报文的时间间隔。"
         },{
             type: "name",
             title: "PPP 链路维护时间间隔",
             content: "发送PPP链路维护检测报文的时间间隔。"
         }]
     };

$.su.CHAR.HELP.L2TP_CLIENT_SET = {
        TITLE: "客户端设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以配置L2TP的客户端。"
         },{
             type: "name",
             title: "隧道名称",
             content: "L2TP隧道的名称，用于区分不同的隧道。"
         },{
             type: "name",
             title: "用户名",
             content: "L2TP隧道用于身份认证的用户名。"
         },{
             type: "name",
             title: "密码",
             content: "L2TP的用户密码。"
         },{
             type: "name",
             title: "出接口",
             content: "L2TP报文收发的接口。"
         },{
             type: "name",
             title: "服务器地址",
             content: "L2TP服务器的地址，可以为IP或域名。"
         },{
             type: "name",
             title: "IPSec加密",
             content: "是否对隧道进行加密。若启用，则使用IPSec对L2TP隧道加密。"
         },{
             type: "name",
             title: "预共享密钥",
             content: "设置IPSec加密时的预共享密钥。"
         },{
             type: "name",
             title: "对端子网",
             content: "L2TP隧道对端局域网使用的IP地址范围（一般可以填隧道对端设备LAN口的IP地址范围），由IP和子网掩码组成。"
         },{
             type: "name",
             title: "工作模式",
             content: "NAT：对经过此L2TP隧道的数据包进行NAT转换（数据包的源IP替换为L2TP隧道的本地虚拟IP）；路由：对经过此L2TP隧道的数据包只进行路由转发"
         },{
             type: "name",
             title: "状态",
             content: "您可以选择启用来使隧道生效。"
         }]
     };

$.su.CHAR.HELP.L2TP_SERVER_GLOBAL = {
        TITLE: "全局设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以设置L2TP服务器的全局配置。"
         },{
             type: "name",
             title: "L2TP链路维护时间间隔",
             content: "发送L2TP链路维护检测报文的时间间隔。"
         },{
             type: "name",
             title: "PPP 链路维护时间间隔",
             content: "发送PPP链路维护检测报文的时间间隔。"
         }]
     };

$.su.CHAR.HELP.L2TP_SERVER_SET = {
        TITLE: "服务器设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以配置L2TP的服务器。"
         },{
             type: "name",
             title: "服务接口",
             content: "L2TP服务器监听的接口，只有来自服务接口的报文才会被处理。"
         },{
             type: "name",
             title: "IPSec加密",
             content: "是否对隧道进行加密。若启用，则使用IPSec对L2TP隧道加密。"
         },{
             type: "name",
             title: "预共享密钥",
             content: "设置IPSec加密时的预共享密钥。"
         },{
             type: "name",
             title: "状态",
             content: "您可以选择启用来使隧道生效。"
         }]
     };

$.su.CHAR.HELP.L2TP_TUNNEL = {
        TITLE: "隧道信息列表",
        CONTENT: [{
             type: "paragraph",
             content: "您可以获得L2TP隧道的信息。"
         },{
             type: "name",
             title: "用户名",
             content: "L2TP隧道建立时用于认证身份使用的用户名称。"
         },{
             type: "name",
             title: "服务器/客户端",
             content: "建立隧道时，本端是作为服务器还是客户端。"
         },{
             type: "name",
             title: "虚拟接口名称",
             content: "隧道使用的虚拟接口名称。"
         },{
             type: "name",
             title: "虚拟本地IP",
             content: "隧道的本地虚拟IP地址。"
         },{
             type: "name",
             title: "接入服务IP",
             content: "隧道的对端实际IP地址。"
         },{
             type: "name",
             title: "对端虚拟IP",
             content: "隧道的对端虚拟IP地址。"
         },{
             type: "name",
             title: "DNS",
             content: "隧道的DNS地址。"
         }]
     };

//PPTP
$.su.CHAR.HELP.PPTP_CLIENT_GLOBAL = {
        TITLE: "全局设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以设置PPTP客户端的全局配置。"
         },{
             type: "name",
             title: "PPTP链路维护时间间隔",
             content: "发送PPTP链路维护检测报文的时间间隔。"
         },{
             type: "name",
             title: "PPP 链路维护时间间隔",
             content: "发送PPP链路维护检测报文的时间间隔。"
         }]
     };

$.su.CHAR.HELP.PPTP_CLIENT_SET = {
        TITLE: "客户端设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以配置PPTP的客户端。"
         },{
             type: "name",
             title: "隧道名称",
             content: "PPTP隧道的名称，用于区分不同的隧道。"
         },{
             type: "name",
             title: "用户名",
             content: "PPTP隧道用于身份认证的用户名。"
         },{
             type: "name",
             title: "密码",
             content: "PPTP的用户密码。"
         },{
             type: "name",
             title: "出接口",
             content: "PPTP报文收发的接口。"
         },{
             type: "name",
             title: "服务器地址",
             content: "PPTP服务器的地址，可以为IP或域名。"
         },{
             type: "name",
             title: "MPPE加密",
             content: "是否对隧道进行加密。若启用，则使用MPPE对PPTP隧道加密。"
         },{
             type: "name",
             title: "对端子网",
             content: "PPTP隧道对端局域网使用的IP地址范围（一般可以填隧道对端设备LAN口的IP地址范围），由IP和子网掩码组成。"
         },{
             type: "name",
             title: "工作模式",
             content: "NAT：对经过此PPTP隧道的数据包进行NAT转换（数据包的源IP替换为PPTP隧道的本地虚拟IP）；路由：对经过此PPTP隧道的数据包只进行路由转发"
         },{
             type: "name",
             title: "状态",
             content: "您可以选择启用来使隧道生效。"
         }]
     };

$.su.CHAR.HELP.PPTP_SERVER_GLOBAL = {
        TITLE: "全局设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以设置PPTP服务器的全局配置。"
         },{
             type: "name",
             title: "PPTP链路维护时间间隔",
             content: "发送PPTP链路维护检测报文的时间间隔。"
         },{
             type: "name",
             title: "PPP 链路维护时间间隔",
             content: "发送PPP链路维护检测报文的时间间隔。"
         }]
     };

$.su.CHAR.HELP.PPTP_SERVER_SET = {
        TITLE: "服务器设置",
        CONTENT: [{
             type: "paragraph",
             content: "您可以配置PPTP的服务器。"
         },{
             type: "name",
             title: "服务接口",
             content: "PPTP服务器监听的接口，只有来自服务接口的报文才会被处理。"
         },{
             type: "name",
             title: "MPPE加密",
             content: "是否对隧道进行加密。若启用，则使用MPPE对PPTP隧道加密。"
         },{
             type: "name",
             title: "状态",
             content: "您可以选择启用来使隧道生效。"
         }]
     };

$.su.CHAR.HELP.PPTP_TUNNEL = {
        TITLE: "隧道信息列表",
        CONTENT: [{
             type: "paragraph",
             content: "您可以获得PPTP隧道的信息。"
         },{
             type: "name",
             title: "用户名",
             content: "PPTP隧道建立时用于认证身份使用的用户名称。"
         },{
             type: "name",
             title: "服务器/客户端",
             content: "建立隧道时，本端是作为服务器还是客户端。"
         },{
             type: "name",
             title: "虚拟接口名称",
             content: "隧道使用的虚拟接口名称。"
         },{
             type: "name",
             title: "虚拟本地IP",
             content: "隧道的本地虚拟IP地址。"
         },{
             type: "name",
             title: "接入服务IP",
             content: "隧道的对端实际IP地址。"
         },{
             type: "name",
             title: "对端虚拟IP",
             content: "隧道的对端虚拟IP地址。"
         },{
             type: "name",
             title: "DNS",
             content: "隧道的DNS地址。"
         }]
     };

//vpn user
$.su.CHAR.HELP.VPNUSER = {
        TITLE: "VPN用户管理",
        CONTENT: [{
             type: "paragraph",
             content: "您可以配置L2TP/PPTP服务器的用户信息。"
         },{
             type: "name",
             title: "用户名",
             content: "允许拨入的用户名称。"
         },{
             type: "name",
             title: "密码",
             content: "用户名称对应的密码。"
         },{
             type: "name",
             title: "服务类型",
             content: "L2TP：本用户只用于L2TP；PPTP：本用户只用于PPTP；自动：本用户既可用于L2TP也可用于PPTP。"
         },{
             type: "name",
             title: "本地地址",
             content: "VPN隧道的本地虚拟IP地址。"
         },{
             type: "name",
             title: "地址池",
             content: "L2TP/PPTP服务器分配给客户端的IP地址从地址池内获取。"
         },{
             type: "name",
             title: "DNS地址",
             content: "L2TP/PPTP服务器分配给客户端的DNS地址，如8.8.8.8。"
         },{
             type: "name",
             title: "组网模式",
             content: "PC到站点：拨入的客户端是个人用户，往往由单个计算机拨入实现远端计算机与本地局域网的通信；站点到站点：拨入的客户端是一个网段的用户，往往通过一个设备拨入，实现隧道两端局域网的通信。"
         },{
             type: "name",
             title: "最大会话数",
             content: "每个用户允许接入的最大客户端数量。"
         },{
             type: "name",
             title: "对端子网",
             content: "L2TP/PPTP隧道对端局域网使用的IP地址范围（一般可以填隧道对端设备LAN口的IP地址范围），由IP和子网掩码组成。"
         }]
     };

// =======web_security.js=====
$.su.CHAR.HELP.WEBSEC_ENABLE = {
	TITLE: "功能设置", 
	CONTENT: [
		{
			type: "name", 
			title: "启用网页安全功能", 
			content: "您可以开启或关闭网页安全功能。"
		}
	]
};

$.su.CHAR.HELP.WEBSEC_SETTING = {
	TITLE: "规则列表", 
	CONTENT: [
		{
			type: "name", 
			title: "用户组", 
			content: "选择地址对象，以建立网页安全规则条目的地址范围。"
		}, 
		{
			type: "name", 
			title: "禁止网页提交", 
			content: "是否开启禁止网页提交功能。"
		}, 
		{
			type: "name", 
			title: "过滤文件拓展类型", 
			content: "添加待过滤的文件后缀，各个后缀之间以换行隔开。"
		}, 
		{
			type: "name", 
			title: "生效时间", 
			content: "选择规则生效的时间。"
		}, 
		{
			type: "name", 
			title: "备注", 
			content: "您可以为该规则添加备注，50字符以内。"
		}, 
		{
			type: "name", 
			title: "状态", 
			content: "表示是否启用该规则。"
		}
	]
};

// =======webfilter.js=====
$.su.CHAR.HELP.WEB_FILTER_ENABLE = {
	TITLE: "功能设置",
	CONTENT: [
		{
			type: "name",
			title: "启用网站过滤功能",
			content: "您可以选择开启或关闭网站过滤功能。"
		}
	]
};

$.su.CHAR.HELP.WEB_FILTER = {
	TITLE: "规则列表",
	CONTENT: [
		{
			type: "name",
			title: "用户组",
			content: "选择地址对象，以建立过滤规则条目的地址范围。"
		},
		{
			type: "name",
			title: "规则类型",
			content: "对符合规则的网站放行或禁止。"
		},
		{
			type: "name",
			title: "选择网站",
			content: "选择网站分组对象，其中所有网站表示对所有网站都生效。"
		},
		{
			type: "name",
			title: "访问上述网站时",
			content: "系统日志是否记录上述网站的访问情况。"
		},
		{
			type: "name",
			title: "规则生效时间",
			content: "选择规则生效的时间。"
		},
		{
			type: "name",
			title: "备注",
			content: "您可以为该规则添加备注，50字符以内。"
		},
		{
			type: "name",
			title: "添加到指定位置(第几条)",
			content: "指定添加的规则的位置，排在前面的规则比后面规则优先级高。"
		},
		{
			type: "name",
			title: "状态",
			content: "表示是否启用该规则。"
		}
	]
};
// =======websort.js=====
$.su.CHAR.HELP.WEB_GROUP = {
	TITLE: "网站分组", 
	CONTENT: [
		{
			type: "name", 
			title: "组名称", 
			content: "为网站分组添加名称，字符限制在28个字符以内，且两个分组不能重名"
		}, 
		{
			type: "name", 
			title: "自定义组成员", 
			content: "网站分组成员，您可以同时输入多个网站进行批量添加。<br>组成员可以为域名，如www.tp-link.com.cn,也可以在域名前面加通配符'*'，如*.tp-link.com.cn。但是'*'只允许输入在最前面，而不能夹杂在域名中间或后面。"
		}, 
		{
			type: "name", 
			title: "清空", 
			content: "您可以清空组成员中输入的内容"
		}, 
		{
			type: "name", 
			title: "文件路径", 
			content: "您可以通过文件导入的形式为网站分组添加成员，文件格式为txt格式"
		}, 
		{
			type: "name", 
			title: "备注", 
			content: "您可以为分组添加50字符以内的备注"
		}
	]
};

// =======zone.js=====
$.su.CHAR.HELP.USERZONE_SETTING =
{
    TITLE: "安全区域列表",
    CONTENT: [{
        type: "paragraph",
        content: "您可以通过本页面设置防火墙安全区域。"
    },
    {
        type: "name",
        title: "名称",
        content: "标志防火墙安全区域的名称。"
    },
    {
        type: "name",
        title: "优先级",
        content: "防火墙安全区域的优先级，数字越大表示优先级越高。"
    },
    {
        type: "name",
        title: "接口",
        content: "防火墙安全区域包含的接口。"
    },
    {
        type: "name",
        title: "备注",
        content: "您可以设置防火墙安全区域的备注，以方便您管理和查找。备注最多支持50个字符。"
    },
    {
        type: "note",
        title: "注意",
         content:[
            "防火墙安全区域一旦在其他地方被引用则无法在本页面被删除，除非解除引用。",
            "防火墙安全区域可以为空(即不选择任何接口)，引用该防火墙安全区域的规则不会被命中。"
         ]
    }
    ]
};
