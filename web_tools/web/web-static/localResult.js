(function($){
$.su = $.su || {};

$.su.localResult = {
	"locale_info": {
		"locale": "zh_CN",
		"force": false,
		"radio": 0,
		"model": "TL-ER7520G v3.0"
	},
	"menu": {
		"advance_menu": [
			{
				"name": "panel",
				"children": [
					{
						"name": "status",
						"children": [
							{
								"name": "status"
							},
							{
								"name": "alarm"
							}
						]
					}
				]
			},
			{
				"name": "monitor",
				"children": [
					{
						"name": "log",
						"children": [
							{
								"name": "system_log_v2"
							},
							{
								"name": "operation_log"
							},
							{
								"name": "flow_log"
							},
							{
								"name": "sp_hit_log"
							},
							{
								"name": "threat_log"
							},
							{
								"name": "url_log"
							},
							{
								"name": "content_log"
							},
							{
								"name": "mail_filter_log"
							}
						]
					},
					{
						"name": "report",
						"children": [
							{
								"name": "flow_report"
							},
							{
								"name": "sphit_report"
							},
							{
								"name": "threat_report"
							}
						]
					},
					{
						"name": "system_statistics",
						"children": [
							{
								"name": "report_ifstat"
							},
							{
								"name": "report_ip_stats"
							},
							{
								"name": "report_sp_stats"
							}
						]
					},
					{
						"name": "diagnostic_center",
						"children": [
							{
								"name": "diagnostic"
							},
							{
								"name": "dia_info"
							}
						]
					}
				]
			},
			{
				"name": "policy",
				"children": [
					{
						"name": "security_policy",
						"children": [
							{
								"name": "security_policy"
							},
							{
								"name": "redundancy_analysis"
							}
						]
					},
					{
						"name": "bandwidth_policy",
						"children": [
							{
								"name": "qos"
							},
							{
								"name": "session-limit"
							},
							{
								"name": "session-monitor"
							}
						]
					},
					{
						"name": "nat_policy",
						"children": [
							{
								"name": "napt"
							},
							{
								"name": "one-nat"
							},
							{
								"name": "virtual-server"
							},
							{
								"name": "nat-dmz"
							},
							{
								"name": "upnp"
							}
						]
					},
					{
						"name": "alg_policy",
						"children": [
							{
								"name": "alg"
							}
						]
					},
					{
						"name": "security_guard",
						"children": [
							{
								"name": "imb"
							},
							{
								"name": "arp-scan"
							},
							{
								"name": "arp-list"
							},
							{
								"name": "macFiltering"
							},
							{
								"name": "attack-defense"
							},
							{
								"name": "ip-blacklist"
							},
							{
								"name": "ip-whitelist"
							}
						]
					}
				]
			},
			{
				"name": "object",
				"children": [
					{
						"name": "addresses",
						"children": [
							{
								"name": "group"
							},
							{
								"name": "address"
							}
						]
					},
					{
						"name": "time_segs",
						"children": [
							{
								"name": "time-mngt"
							}
						]
					},
					{
						"name": "ippool",
						"children": [
							{
								"name": "ippool"
							}
						]
					},
					{
						"name": "usergroup",
						"children": [
							{
								"name": "usergroup"
							},
							{
								"name": "user"
							},
							{
								"name": "sessmngr"
							},
							{
								"name": "template"
							},
							{
								"name": "multi_portal"
							},
							{
								"name": "remote_portal"
							},
							{
								"name": "free"
							},
							{
								"name": "portal_para"
							}
						]
					},
					{
						"name": "service",
						"children": [
							{
								"name": "service_group"
							},
							{
								"name": "service"
							}
						]
					},
					{
						"name": "web_urls",
						"children": [
							{
								"name": "websiteGroup"
							}
						]
					},
					{
						"name": "apps",
						"children": [
							{
								"name": "app_grouping"
							},
							{
								"name": "app_library"
							}
						]
					},
					{
						"name": "security_profile",
						"children": [
							{
								"name": "sp_url_filter"
							},
							{
								"name": "sp_file_content_filter"
							},
							{
								"name": "sp_app_control_filter"
							},
							{
								"name": "sp_email_filter"
							},
							{
								"name": "sp_av_profile"
							},
							{
								"name": "security_global_config"
							}
						]
					},
					{
						"name": "ips",
						"children": [
							{
								"name": "ips-profile"
							},
							{
								"name": "ips-filter"
							},
							{
								"name": "ips-signature"
							}
						]
					},
					{
						"name": "ssl_certificate",
						"children": [
							/*{
								"name": "ssl_certificate"
							},*/
							{
								"name": "server_ca_cert"
							}/*,
							{
								"name": "internal_server_cert"
							}*/
						]
					}
				]
			},
			{
				"name": "network",
				"children": [
					{
						"name": "interface",
						"children": [
							{
								"name": "interface-setting"
							},
							{
								"name": "bridge-setting"
							},
							{
								"name": "ipv6_bridge"
							},
							{
								"name": "sfp+_setting"
							}
						]
					},
					{
						"name": "zone",
						"children": [
							{
								"name": "zone"
							}
						]
					},
					{
						"name": "dhcp-server",
						"children": [
							{
								"name": "dhcp-server"
							},
							{
								"name": "clientlist"
							},
							{
								"name": "static"
							},
							{
								"name": "dhcp6-server"
							},
							{
								"name": "slaac"
							},
							{
								"name": "clientlist_v6"
							},
							{
								"name": "static_v6"
							}
						]
					},
					{
						"name": "routing",
						"children": [
							{
								"name": "basic-setting"
							},
							{
								"name": "isp-routing"
							},
							{
								"name": "line-backup"
							},
							{
								"name": "policy-routing"
							},
							{
								"name": "static-routing"
							},
							{
								"name": "static6-routing"
							},
							{
								"name": "system-routetbl"
							}
						]
					},
					{
						"name": "ipsec",
						"children": [
							{
								"name": "ipsec-setting"
							},
							{
								"name": "ipsec-sa"
							}
						]
					},
					{
						"name": "l2tp",
						"children": [
							{
								"name": "l2tp-server"
							},
							{
								"name": "l2tp-client"
							},
							{
								"name": "l2tp-tunnel"
							}
						]
					},
					{
						"name": "pptp",
						"children": [
							{
								"name": "pptp-server"
							},
							{
								"name": "pptp-client"
							},
							{
								"name": "pptp-tunnel"
							}
						]
					},
					{
						"name": "vpn-user",
						"children": [
							{
								"name": "vpn-user"
							}
						]
					},
					{
						"name": "dns",
						"children": [
							{
								"name": "dns-proxy"
							},
							{
								"name": "phddns"
							},
							{
								"name": "cmxddns"
							},
							{
								"name": "dyn3322ddns"
							}
						]
					}
				]
			},
			{
				"name": "system",
				"children": [
					{
						"name": "administration",
						"children": [
							{
								"name": "administrator"
							},
							{
								"name": "administrator_role"
							},
							{
								"name": "remote-mngt"
							},
							{
								"name": "account-config"
							}
						]
					},
					{
						"name": "cloud_mngr",
						"children": [
							{
								"name": "global_config",
								"children": [
									{
										"name": "global_config"
									}
								]
							},
						]
					},
					{
						"name": "firmware",
						"children": [
							{
								"name": "factory"
							},
							{
								"name": "backup-restore"
							},
							{
								"name": "reboot"
							},
							{
								"name": "upgrade"
							},
							{
								"name":"system_mgt"
							}
						]
					},
					{
						"name": "time-setting",
						"children": [
							{
								"name": "time-setting"
							}
						]
					},
					{
						"name": "log_config",
						"children": [
							{
								"name": "log_config"
							}
						]
					},
					{
						"name": "alarm_config",
						"children": [
							{
								"name": "alarm_event_config"
							},
							{
								"name": "alarm_email_config"
							}
						]
					},
					{
						"name": "disk_mngt",
						"children": [
							{
								"name": "disk_mngt"
							},
							{
								"name": "log_storage"
							}
						]
					},
					{
						"name": "upgrade_center",
						"children": [
							{
								"name": "signature_db"
							}
						]
					},
                    {
						"name": "license",
						"children": [
							{
								"name": "license"
							}
						]
					},
					{
						"name": "high_available",
						"children": [
							{
								"name": "keepalived"
							},
							{
								"name": "online"
							}
						]
					},
					{
						"name": "system_params",
						"children": [
							{
								"name": "metric"
							}
						]
					},
					{
						"name": "wizard",
						"children": [
							{
								"name": "wizard"
							}
						]
					}
				]
			}
		]
	},
	"error_code": 0
};


$.su.localResult_audit = {
	"locale_info": {
		"locale": "zh_CN",
		"force": false,
		"radio": 0,
		"model": "TL-ER7520G v3.0"
	},
	"menu": {
		"advance_menu": [
			{
				"name": "panel",
				"children": [
					{
						"name": "status",
						"children": [
							{
								"name": "status"
							},
							{
								"name": "alarm"
							}
						]
					}
				]
			},
			{
				"name": "monitor",
				"children": [
					{
						"name": "log",
						"children": [
							{
								"name": "system_log_v2"
							},
							{
								"name": "operation_log"
							},
							{
								"name": "flow_log"
							},
							{
								"name": "audit_log"
							},
							{
								"name": "sp_hit_log"
							},
							{
								"name": "threat_log"
							},
							{
								"name": "url_log"
							},
							{
								"name": "content_log"
							},
							{
								"name": "mail_filter_log"
							}
						]
					},
					{
						"name": "report",
						"children": [
							{
								"name": "flow_report"
							},
							{
								"name": "sphit_report"
							},
							{
								"name": "threat_report"
							}
						]
					},
					{
						"name": "system_statistics",
						"children": [
							{
								"name": "report_ifstat"
							},
							{
								"name": "report_ip_stats"
							},
							{
								"name": "report_sp_stats"
							}
						]
					}
				]
			},
			{
				"name": "policy",
				"children": [
					{
						"name": "audit_policy",
						"children": [
							{
								"name": "audit_policy"
							}
						]
					}

				]
			},
			{
				"name": "object",
				"children": [
					{
						"name": "audit_profile",
						"children": [
							{
								"name": "audit_profile"
							}
						]
					}
				]
			},
			{
				"name": "system",
				"children": [
					{
						"name": "log_config",
						"children": [
							{
								"name": "audit_config"
							}
						]
					}
				]
			}
		]
	},
	"error_code": 0
};

$.su.localResult_config = {
	"locale_info": {
		"locale": "zh_CN",
		"force": false,
		"radio": 0,
		"model": "TL-ER7520G v3.0"
	},
	"menu": {
		"advance_menu": [
			{
				"name": "panel",
				"children": [
					{
						"name": "status",
						"children": [
							{
								"name": "status"
							},
							{
								"name": "alarm"
							}
						]
					}
				]
			},
			{
				"name": "monitor",
				"children": [
					{
						"name": "log",
						"children": [
							{
								"name": "system_log_v2"
							},
							{
								"name": "operation_log"
							},
							{
								"name": "flow_log"
							},
							{
								"name": "sp_hit_log"
							},
							{
								"name": "threat_log"
							},
							{
								"name": "url_log"
							},
							{
								"name": "content_log"
							},
							{
								"name": "mail_filter_log"
							}
						]
					},
					{
						"name": "report",
						"children": [
							{
								"name": "flow_report"
							},
							{
								"name": "sphit_report"
							},
							{
								"name": "threat_report"
							}
						]
					},
					{
						"name": "system_statistics",
						"children": [
							{
								"name": "report_ifstat"
							},
							{
								"name": "report_ip_stats"
							},
							{
								"name": "report_sp_stats"
							}
						]
					},
					{
						"name": "diagnostic_center",
						"children": [
							{
								"name": "diagnostic"
							},
							{
								"name": "dia_info"
							}
						]
					}
				]
			},
			{
				"name": "policy",
				"children": [
					{
						"name": "security_policy",
						"children": [
							{
								"name": "security_policy"
							},
							{
								"name": "redundancy_analysis"
							}
						]
					},
					{
						"name": "bandwidth_policy",
						"children": [
							{
								"name": "qos"
							},
							{
								"name": "session-limit"
							},
							{
								"name": "session-monitor"
							}
						]
					},
					{
						"name": "nat_policy",
						"children": [
							{
								"name": "napt"
							},
							{
								"name": "one-nat"
							},
							{
								"name": "virtual-server"
							},
							{
								"name": "nat-dmz"
							},
							{
								"name": "upnp"
							}
						]
					},
					{
						"name": "alg_policy",
						"children": [
							{
								"name": "alg"
							}
						]
					},
					{
						"name": "security_guard",
						"children": [
							{
								"name": "imb"
							},
							{
								"name": "arp-scan"
							},
							{
								"name": "arp-list"
							},
							{
								"name": "macFiltering"
							},
							{
								"name": "attack-defense"
							},
							{
								"name": "ip-blacklist"
							},
							{
								"name": "ip-whitelist"
							}
						]
					}
				]
			},
			{
				"name": "object",
				"children": [
					{
						"name": "addresses",
						"children": [
							{
								"name": "group"
							},
							{
								"name": "address"
							}
						]
					},
					{
						"name": "time_segs",
						"children": [
							{
								"name": "time-mngt"
							}
						]
					},
					{
						"name": "ippool",
						"children": [
							{
								"name": "ippool"
							}
						]
					},
					{
						"name": "usergroup",
						"children": [
							{
								"name": "user"
							},
							{
								"name": "usergroup"
							},
							{
								"name": "sessmngr"
							},
							{
								"name": "template"
							},
							{
								"name": "multi_portal"
							},
							{
								"name": "remote_portal"
							},
							{
								"name": "free"
							},
							{
								"name": "portal_para"
							}
						]
					},
					{
						"name": "service",
						"children": [
							{
								"name": "service"
							},
							{
								"name": "service_group"
							}
						]
					},
					{
						"name": "web_urls",
						"children": [
							{
								"name": "websiteGroup"
							}
						]
					},
					{
						"name": "apps",
						"children": [
							{
								"name": "app_library"
							},
							{
								"name": "app_grouping"
							}
						]
					},
					{
						"name": "security_profile",
						"children": [
							{
								"name": "sp_url_filter"
							},
							{
								"name": "sp_file_content_filter"
							},
							{
								"name": "sp_app_control_filter"
							},
							{
								"name": "sp_email_filter"
							},
							{
								"name": "sp_av_profile"
							},
							{
								"name": "security_global_config"
							}
						]
					},
					{
						"name": "ips",
						"children": [
							{
								"name": "ips-profile"
							},
							{
								"name": "ips-filter"
							},
							{
								"name": "ips-signature"
							}
						]
					},
					{
						"name": "ssl_certificate",
						"children": [
							/*{
								"name": "ssl_certificate"
							},*/
							{
								"name": "server_ca_cert"
							}/*,
							{
								"name": "internal_server_cert"
							}*/
						]
					}
				]
			},
			{
				"name": "network",
				"children": [
					{
						"name": "interface",
						"children": [
							{
								"name": "interface-setting"
							},
							{
								"name": "bridge-setting"
							},
							{
								"name": "ipv6_bridge"
							},
							{
								"name": "sfp+_setting"
							}
						]
					},
					{
						"name": "zone",
						"children": [
							{
								"name": "zone"
							}
						]
					},
					{
						"name": "dhcp-server",
						"children": [
							{
								"name": "dhcp-server"
							},
							{
								"name": "clientlist"
							},
							{
								"name": "static"
							},
							{
								"name": "dhcp6-server"
							},
							{
								"name": "slaac"
							},
							{
								"name": "clientlist_v6"
							},
							{
								"name": "static_v6"
							}
						]
					},
					{
						"name": "routing",
						"children": [
							{
								"name": "basic-setting"
							},
							{
								"name": "isp-routing"
							},
							{
								"name": "line-backup"
							},
							{
								"name": "policy-routing"
							},
							{
								"name": "static-routing"
							},
							{
								"name": "static6-routing"
							},
							{
								"name": "system-routetbl"
							}
						]
					},
					{
						"name": "ipsec",
						"children": [
							{
								"name": "ipsec-setting"
							},
							{
								"name": "ipsec-sa"
							}
						]
					},
					{
						"name": "l2tp",
						"children": [
							{
								"name": "l2tp-server"
							},
							{
								"name": "l2tp-client"
							},
							{
								"name": "l2tp-tunnel"
							}
						]
					},
					{
						"name": "pptp",
						"children": [
							{
								"name": "pptp-server"
							},
							{
								"name": "pptp-client"
							},
							{
								"name": "pptp-tunnel"
							}
						]
					},
					{
						"name": "vpn-user",
						"children": [
							{
								"name": "vpn-user"
							}
						]
					},
					{
						"name": "dns",
						"children": [
							{
								"name": "dns-proxy"
							},
							{
								"name": "phddns"
							},
							{
								"name": "cmxddns"
							},
							{
								"name": "dyn3322ddns"
							}
						]
					}
				]
			},
			{
				"name": "system",
				"children": [
					{
						"name": "cloud_mngr",
						"children": [
							{
								"name": "global_config",
								"children": [
									{
										"name": "global_config"
									}
								]
							},
						]
					},
					{
						"name": "log_config",
						"children": [
							{
								"name": "log_config"
							}
						]
					},
					{
						"name": "alarm_config",
						"children": [
							{
								"name": "alarm_event_config"
							},
							{
								"name": "alarm_email_config"
							}
						]
					},
					{
						"name": "disk_mngt",
						"children": [
							{
								"name": "disk_mngt"
							},
							{
								"name": "log_storage"
							}
						]
					},
					{
						"name": "upgrade_center",
						"children": [
							{
								"name": "signature_db"
							}
						]
					},
					{
						"name": "time-setting",
						"children": [
							{
								"name": "time-setting"
							}
						]
					},
					{
						"name": "high_available",
						"children": [
							{
								"name": "keepalived"
							},
							{
								"name": "online"
							}
						]
					},
					{
						"name": "system_params",
						"children": [
							{
								"name": "metric"
							}
						]
					},
					{
						"name": "wizard",
						"children": [
							{
								"name": "wizard"
							}
						]
					}
				]
			}
		]
	},
	"error_code": 0
};

$.su.localResult_wizard = {
	"first_menu":"system",
	"second_menu":"wizard"
};

})(jQuery);
