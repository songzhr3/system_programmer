--[[
**********************************************************************************
* Copyright (c) 2010-2014 TP-LINK Technologies CO.,LTD.
* All rights reserved.
*
* FILE NAME  :   ds.lua
* VERSION    :   1.0
* DESCRIPTION:   数据服务类统一接口
*
* AUTHOR     :   WuWeier <wuweier@tp-link.net>
* CREATE DATE:   7/11/2014
*
* HISTORY    :
* 01   7/11/2014  WuWeier     Create.
**********************************************************************************
--]]
local http = require("luci.http")
local uci  = require("luci.model.uci")

local err = require("luci.torchlight.error")
local model = require("luci.torchlight.model")
local util = require("luci.torchlight.util")
local shell = require("luci.torchlight.lib.shell")
local lutil = require("luci.util")
local fs = require("luci.fs")
local validator_mod = require("luci.torchlight.validator")
local socket = require("socket")

local userconfig = require("luci.model.userconfig")
local sys = require ("luci.sys")
module("luci.controller.ds", package.seeall)

--[[
********************************************************************
	数据服务接口方法关键字定义
********************************************************************
--]]--
KEY_METHOD      	= "method"			-- 请求方法类型
KEY_TYPE   			= "table"			-- 请求的表类型
KEY_NAME       		= "name"			-- 请求的section名称数据
KEY_PARA       		= "para"			-- 请求增加section参数
KEY_COUNT			= "count"			-- 请求表格条目数量
KEY_FILT_PARA		= "filter"			-- 请求过滤参数
KEY_INSERT_INDEX 	= "insert_index" 	-- 请求插入索引
KEY_START			= "start"			-- 请求分页起始地址
KEY_END 			= "end"				-- 请求分页结束地址
METHOD_DO 			= "do"				-- 请求执行动作
METHOD_ADD 			= "add"				-- 请求增加section
METHOD_DELETE 		= "delete"			-- 请求删除section
METHOD_MODIFY 		= "set"				-- 请求修改section
METHOD_GET 			= "get"				-- 请求获取数据

SLP_UNIQUE_ID		= "slp_unique_id"	-- 非UCI
KEY_FILTER_OPTIONS_OP = "filter_options"
--[[
********************************************************************
    diff相关名称
********************************************************************
--]]--
DIFF_KEY_MOD 			= "modify"
DIFF_KEY_DEL 			= "delete"
DIFF_KEY_ADD 			= "add"
DIFF_KEY_NAME			= "name"
DIFF_KEY_TYPE			= "type"
DIFF_KEY_PARA			= "para"
DIFF_KEY_FILTER_PARA	= "filter"
DIFF_KEY_INSERT_INDEX	= "insert_index"
DIFF_KEY_ALL			= "*all*"

diff_handler_key = {
    parser    = "parser",
    compartor = "compartor",
    prefix    = "prefix"
}

--[[
********************************************************************
    关键字参数名称
********************************************************************
--]]--
KEYWORD_USERLIST = "userlist"
KEYWORD_FUNCPATH = "funcpath"

-- 发过来的原始JSON数据
HTTP_RAW_JSON_DATA = nil

--[[
********************************************************************
    配置选项类型表，表示UCI文件的配置选项类型，哪些为list，哪些为config
********************************************************************
--]]--
UCI_OPT_TYPE_OPTION = "option"
UCI_OPT_TYPE_LIST 	= "list"
uci_option_type_table = {}

--[[
********************************************************************
   filter 字段注册，只有注册的字段才能包含在filter中，否则返回错误
********************************************************************
--]]--
keyword_filter_options_data = {}
--[[
********************************************************************
    返回JSON对象选项类型表
********************************************************************
--]]--
json_datatype_table = {}

--[[
********************************************************************
    关键字动作表，表示哪些关键字执行哪些动作
********************************************************************
--]]--
keyword_action_table = {}

--[[
********************************************************************
    关键字获取数据表，表示哪些关键字获取哪些数据
********************************************************************
--]]--
keyword_data_table = {}

--[[
********************************************************************
    关键字获取数据条目数表，表示哪些关键字获取哪些数据条目数
********************************************************************
--]]--
keyword_count_table = {}

--[[
********************************************************************
    关键字修改数据表，表示哪些关键字设置哪些数据
********************************************************************
--]]--
keyword_set_data_table = {}

--[[
********************************************************************
    关键删除数据表，表示哪些关键字删除哪些数据
********************************************************************
--]]--
keyword_del_data_table = {}

--[[
********************************************************************
    关键添加数据表，表示哪些关键字添加哪些数据
********************************************************************
--]]--
keyword_add_data_table = {}

--[[
********************************************************************
	get接口强制返回list参数列表
	注册方式：
	register_sectype_force_return(uciname, sectype, list_name, option_name)
	register_secname_force_return(uciname, sectype, list_name, option_name)

	当uci配置中没有对应的参数的时候，填充指定的返回值
	e.g.
		keyword_force_secname_table = {
			"apmng_roam": { // uci section name
				"roam": {
					"list": {"2g_roaming_threshold_type", "5g_roaming_threshold_type"},
					"option": {}
				}
			}
		}

		keyword_force_sectype_table = {
			"vlan": {
				"vlan": { // uci section type
					"list": {},
					"option": {"note"}
				}
			}
		}
	get接口获取uci数据的时候，如果uci中没有配置"2g_roaming_threshold_type"这个选项
	e.g.
	config global 'roam'
		option 11k_switch 'on'
		option 2g_rssi_trigger_threshold '-75'
		option blacklist_restrict_time '5'
		list 5g_roaming_threshold_type 'rssi'
		list 5g_roaming_threshold_type 'rate'

	在返回结果中会自动加上"2g_roaming_threshold_type": []
********************************************************************
--]]--
keyword_force_secname_table = {}
keyword_force_sectype_table = {}

--[[
********************************************************************
    用户修改配置数据权限信息
********************************************************************
]]--
USERLIST_UCI_SEC_SEP = ":"
secname_userlist = {}
sectype_userlist = {}

--[[
********************************************************************
    数据收集模块信息
********************************************************************
]]--
PC_UCI = "cfg_web_record"
APP_UCI = "cfg_app_record"
KEY_USR_CFG_NUM = "usr_cfg_num"

PROC_NET_VLAN_DIR = "/proc/net/vlan/"
BR_FILE = "bridge_packet_to_wan"
IS_BR_MODE = "bridge_packet_to_wan = 1"

local function split_table_and_id(secname)
	local rev_secname = string.reverse(secname)
	local str_s = nil
	local str_e = nil
	str_s,str_e = string.find(rev_secname, "_")
	if nil == str_s or nil == str_e then
		return err.EINVARG
	end
	
	local m = string.len(secname) - str_e + 1
	local table_name = string.sub(secname, 1, m-1)
	local unique_id = string.sub(secname, m+1, string.len(secname))
	--id必须是数字
	if nil == unique_id or nil == table_name or nil == tonumber(unique_id) then
		unique_id = nil
		table_name = nil
		return err.EINVARG
	end
	return err.ENONE, table_name, unique_id
end

--[[
********************************************************************
    列表条目数限制信息
********************************************************************
]]--
UCI_SEC_LIMIT_EXT = {}

function register_sectype_limit(uciname, sectype, limit)
	if type(uciname) ~= "string" or type(sectype) ~= "string" or type(limit) ~= "number" then
		return false
	end

	local uciname_table = UCI_SEC_LIMIT_EXT[uciname] or {}
	UCI_SEC_LIMIT_EXT[uciname] = uciname_table
	uciname_table[sectype] = uciname_table[sectype] or limit
	return true
end

-- 注册secion name用户设置权限表
function register_secname_userlist(uciname, secname, userlist)
	if type(userlist) ~= "table" or type(secname) ~= "string" or type(uciname) ~= "string" then
		return false
	end

	secname_userlist[uciname .. USERLIST_UCI_SEC_SEP .. secname] = userlist
	return true
end

-- 注册secion type用户设置权限表
function register_sectype_userlist(uciname, sectype, userlist)
	if type(userlist) ~= "table" or type(sectype) ~= "string" or type(uciname) ~= "string" then
		return false
	end

	sectype_userlist[uciname .. USERLIST_UCI_SEC_SEP .. sectype] = userlist
	return true
end

-- 注册不备份的配置文件路径列表
function register_exclude_filepaths(paths)
	if type(paths) ~= "string" and type(paths) ~= "table" then
		return false
	end

	local setting = require("luci.torchlight.setting")
	paths = type(paths) ~= "table" and {paths} or paths

	for _, path in ipairs(paths) do
		table.insert(setting.EXCLUDE_FILE_PATHS, path)
	end

	return true
end

-- 检查用户是否有权限设置数据
function do_checkauth(webdata, method)
	if type(webdata) ~= "table" or type(method) ~= "string" then
		return err.EINVARG
	end

	if method == METHOD_ADD then
		return do_add_authcheck(webdata)
	elseif method == METHOD_DELETE then
		return do_delete_authcheck(webdata)
	elseif method == METHOD_MODIFY then
		return do_modify_authcheck(webdata)
	else
		return err.EINVARG
	end
end

-- 查看当前用户是否注册为合法用户
-- SMB 产品逻辑上只要登录了就有最高权限，不必分 section 判断，直接
-- 返回 true
function user_registered(uciname, nameortype, isname)
	return true
end

-- add方法权限检查
function do_add_authcheck(webdata)
	if type(webdata) ~= "table" then
		return err.EINVARG
	end

	for uciname, datainfo in pairs(webdata) do
		if not user_registered(uciname, datainfo[KEY_TYPE], false) then
			return err.EFORBID
		end
	end

	return err.ENONE
end

-- delete方法权限检查
function do_delete_authcheck(webdata)
	if type(webdata) ~= "table" then
		return err.EINVARG
	end

	for uciname, datainfo in pairs(webdata) do
		for kw, tbl in pairs(datainfo) do
			tbl = type(tbl) ~= "table" and {tbl} or tbl
			if kw == KEY_TYPE then
				for _, sectype in pairs(tbl) do
					if not user_registered(uciname, sectype, false) then
						return err.EFORBID
					end
				end
			elseif kw == KEY_NAME then
				for _, secname in pairs(tbl) do
					if not user_registered(uciname, secname, true) then
						return err.EFORBID
					end
				end
			end
		end
	end

	return err.ENONE
end

-- modify方法权限检查
function do_modify_authcheck(webdata)
	if type(webdata) ~= "table" then
		return err.EINVARG
	end

	for uciname, datainfo in pairs(webdata) do
		for secname, _ in pairs(datainfo) do
			if not user_registered(uciname, secname, true) then
				return err.EFORBID
			end
		end
	end

	return err.ENONE
end

--[[
********************************************************************
    注册功能模块列表
********************************************************************
]]--
module_speclist = {}
capacity_files 	= {}
KEY_CAPAB		= "capability"
KEY_SPEC_INFO	= "spec_info"
KEY_CAP_MODULE_VER  = "module_version"
KEY_CAP_VERSION_OP = "version"
KEY_PRIVATE_SEC = "private_sec"
KEY_PRIVATE_OP = "private_op"
--[[
********************************************************************
    规格回调注册，获取模块规格
********************************************************************
--]]--
module_spec_info_data_table = {}

-- 注册模块信息
function register_module(modulelist, capa_names)
	if #modulelist > 0 then
		modulelist = type(modulelist) == "string" and {modulelist} or modulelist
		for _, modname in pairs(modulelist) do
			if type(modname) == "string" then
				module_speclist[modname] = {}
			end
		end
	else
		if type(modulelist) ~= "string" then
			return false
		end
		module_speclist[tostring(modulelist)] = {}
	end
	if not capa_names then
		return true
	end
	
	capa_names = type(capa_names) == "string" and {capa_names} or capa_names
	for _, capa_name in pairs(capa_names) do
		capacity_files[capa_name] = true
	end
	
	return true
end

function module_register_check(module_name)
	return module_speclist[module_name] ~= nil
end

--映射关系table, 入参(模块名，TDCP接口字段，profile中section type, profile中 option)
--有个约定，规格都必须生命在profile中
function register_module_spec_info(uciname, public_op, private_sec, private_op)
	if type(uciname) ~= "string" or type(public_op) ~= "string" or type(private_op) ~= "string" or type(private_sec) ~= "string"then
		return false
	end
	local spec_info_cb_list = module_spec_info_data_table[uciname]

	if nil ~= spec_info_cb_list then
		if nil ~= spec_info_cb_list[public_op] then
			return false
		end
	else
		module_spec_info_data_table[uciname] = {}
	end	

	local spec_info_table = {}
	spec_info_table[KEY_PRIVATE_SEC] = private_sec
	spec_info_table[KEY_PRIVATE_OP] = private_op
	module_spec_info_data_table[uciname][public_op] = spec_info_table
	return true
end

function do_module_spec_info(uciname)
	local spec_info_cb_list = module_spec_info_data_table[uciname]
	local ret = nil
	if nil ~= spec_info_cb_list and type(spec_info_cb_list) == "table"  then
		local uci_r = uci.cursor()
		local value = nil
		for key, capa_name in pairs(spec_info_cb_list) do
			value = uci_r:get_profile(capa_name[KEY_PRIVATE_SEC], capa_name[KEY_PRIVATE_OP])
			if nil ~= value  then
				ret = ret or {}
				ret[key] = tostring(value)
			end
		end
	end
	return ret
end
--[[
********************************************************************
    过滤器相关信息
********************************************************************
]]--
--[[
uci_secname_filters与uci_sectype_filters结构类似，为字典形式，key与uci与section name或者
uci与section type的组合，过滤参数时只选择在value中的字典中的存在的
如下：
{
    -- uci与section type的组合或者uci与section name的组合
    ["network:interface"] = {
        -- 对应每一个option或者list
        proto = {
            need = true
        },
        ip = {
            need = false
            validator = "luci.torchlight.validator.check_network",
            args = {"192.168.1.2", "255.255.255.0"}
        }
    }
}
]]--
FILTER_UCI_SEC_SEP = ":"
uci_secname_filters = {}
uci_sectype_filters = {}
-- UCI名称与section name或者section type分隔符
filter_key = {
    -- 是否必要，默认为false，如果必要，则不能删除，如果非必要，则可以删除
    need = "need",
    -- 验证回调函数
    validator = "validator",
    -- 验证回调函数参数, 为table list类型
    args = "args",
    -- 是否执行 shell命令注入 检查
    injection_test = "injection_test"
}

-- 注册section type过滤器
function register_sectype_filter(config, sectype, filter_info)
    if type(filter_info) ~= "table" or type(config) ~= "string" or type(sectype) ~= "string" then
        return false
    end
    
    uci_sectype_filters[config .. FILTER_UCI_SEC_SEP .. sectype] = filter_info
    return true
end

-- 注册设置关键字数据表
function register_keyword_filter_options_data(uciname, keyword, options, userlist, order)
	if type(uciname) ~= "string" or type(keyword) ~= "string" or type(options) ~= "string" then
        return false
    end

	local uci_kw_table = keyword_filter_options_data[uciname] or {}
	keyword_filter_options_data[uciname] = uci_kw_table
	local keyword_para = keyword_filter_options_data[uciname][keyword] or {}
	keyword_filter_options_data[uciname][keyword] = keyword_para
	keyword_para[uciname .. "_" .. keyword] = {[KEY_FILTER_OPTIONS_OP] = options}

	return true
	
end

-- 注册section name过滤器
function register_secname_filter(config, secname, filter_info)
    if type(filter_info) ~= "table" or type(config) ~= "string" or type(secname) ~= "string" then
        return false
    end
    
    uci_secname_filters[config .. FILTER_UCI_SEC_SEP .. secname] = filter_info
    return true
end

-- 注册关键字动作表
function register_keyword_action(uciname, keyword, funcname, userlist, order)
	return register_keyword_datastruct(uciname, keyword_action_table, keyword, funcname, userlist, order)
end

-- 注册关键字数据表
function register_keyword_data(uciname, keyword, funcname, userlist)
	return register_keyword_datastruct(uciname, keyword_data_table, keyword, funcname, userlist)
end

-- 注册关键字数据条目数表
function register_keyword_count(uciname, keyword, funcname, userlist)
	return register_keyword_datastruct(uciname, keyword_count_table, keyword, funcname, userlist)
end

-- 注册设置关键字数据表
function register_keyword_set_data(uciname, keyword, funcname, userlist)
	return register_keyword_datastruct(uciname, keyword_set_data_table, keyword, funcname, userlist)
end

-- 注册设置关键字删除表
function register_keyword_del_data(uciname, keyword, funcname, userlist)
	return register_keyword_datastruct(uciname, keyword_del_data_table, keyword, funcname, userlist)
end

-- 注册设置关键字添加表
function register_keyword_add_data(uciname, keyword, funcname, userlist)
	return register_keyword_datastruct(uciname, keyword_add_data_table, keyword, funcname, userlist)
end

-- 配置uci中没有配置的情况下，需要返回空值的list和选项
function register_sectype_force_return(uciname, sectype, list_name, option_name)
	list_name = list_name or {}
	option_name = option_name or {}
	if type(uciname) ~= "string" or type(sectype) ~= "string" or type(list_name) ~= "table" or type(option_name) ~= "table" then
		return false
	end

	local uci_kw_table = keyword_force_sectype_table[uciname] or {}
	keyword_force_sectype_table[uciname] = uci_kw_table

	local section_kw_table = uci_kw_table[sectype] or {}
	local _list = section_kw_table["list"] or {}
	local _option = section_kw_table["option"] or {}

	for k, v in pairs(list_name) do
		table.insert(_list, v)
	end

	for k, v in pairs(option_name) do
		table.insert(_option, v)
	end

	keyword_force_sectype_table[uciname][sectype] = {
		["list"] = _list,
		["option"] = _option
	}

	return true
end

function register_secname_force_return(uciname, secname, list_name, option_name)
	list_name = list_name or {}
	option_name = option_name or {}
	if type(uciname) ~= "string" or type(secname) ~= "string" or type(list_name) ~= "table" or type(option_name) ~= "table" then
		return false
	end

	local uci_kw_table = keyword_force_secname_table[uciname] or {}
	keyword_force_secname_table[uciname] = uci_kw_table

	local section_kw_table = uci_kw_table[secname] or {}
	local _list = section_kw_table["list"] or {}
	local _option = section_kw_table["option"] or {}

	for k, v in pairs(list_name) do
		table.insert(_list, v)
	end

	for k, v in pairs(option_name) do
		table.insert(_option, v)
	end

	keyword_force_secname_table[uciname][secname] = {
		["list"] = _list,
		["option"] = _option
	}

	return true
end

-- 注册关键字数据结构
function register_keyword_datastruct(uciname, keyword_table, keyword, funcname, userlist, order)
	if type(uciname) ~= "string" or type(keyword) ~= "string" or type(funcname) ~= "string" then
		return false
	end
	
	keyword_table = keyword_table or {}
	local module = getfenv(3)._NAME
	
	local uci_kw_table = keyword_table[uciname] or {}
	keyword_table[uciname] = uci_kw_table
	local keyword_para = keyword_table[uciname][keyword] or {}
	keyword_table[uciname][keyword] = keyword_para

	if nil ~= order then
		if nil == keyword_para[order] then
			keyword_para[order] = {[KEYWORD_FUNCPATH] = module .. "." .. funcname, [KEYWORD_USERLIST] = userlist}
		else
			return false
		end
	else
		keyword_para[1] = {[KEYWORD_FUNCPATH] = module .. "." .. funcname, [KEYWORD_USERLIST] = userlist}
	end

	return true
end

-- 注册配置选项类型表
function register_uci_option_type(uciname, sectype, para)
	if type(uciname) ~= "string" or type(sectype) ~= "string" or type(para) ~= "table" then
		return false
	end
	
	local ucidata = uci_option_type_table[uciname] or {}
	uci_option_type_table[uciname] = ucidata
	ucidata[sectype] = para
	
	return true
end

-- 注册返回JSON对象选项类型表
function register_json_datatype(uciname, sectype, para)
	if type(uciname) ~= "string" or type(sectype) ~= "string" or type(para) ~= "table" then
		return false
	end
	
	local ucidata = json_datatype_table[uciname] or {}
	json_datatype_table[uciname] = ucidata
	ucidata[sectype] = para
	
	return true
end



--[[
********************************************************************
    ds对TDCP方法进行处理之前执行回调的相关信息
********************************************************************
]]--
ds_pre_callback_list = {}

--[[
	注册在处理TDCP方法前需执行的回调
	func_path为函数名，如"master_config_sync_ds_callback"，最终的注册结果为模块名+函数名
--]]
function register_ds_pre_callback(func_path)
	if "string" ~= type(func_path) then
		debug_print("register to ds pre callback failed.")
		return false
	end

	local module = getfenv(2)._NAME

	if ds_pre_callback_list[module .. "." .. func_path] then
		debug_print("\"" .. func_path .. "\" has register to ds pre callback.")
		return false
	end

	ds_pre_callback_list[module .. "." .. func_path] = true

	return true
end


function do_ds_pre_callback(json_data, method)
	if nil == method or nil == json_data then
		return
	end

	for func_path, _ in pairs(ds_pre_callback_list) do
		util.funcpath_call(func_path, json_data, method)
	end
end


function do_ds(jsondata)
	local result = {}
	local method = jsondata[KEY_METHOD]
	local method_map = {
		[METHOD_DO] = do_action,
		[METHOD_ADD] = set_data,
		[METHOD_DELETE] = set_data,
		[METHOD_MODIFY] = set_data,
		[METHOD_GET] = get_data
	}

	-- 去除method数据，传入处理函数时只包含数据
	jsondata[KEY_METHOD] = nil
	local func = method_map[method]

	if func then
		-- 在数据生效前，先执行回调
		do_ds_pre_callback(jsondata, method)
		result = func(jsondata, method)
	else
		-- 返回指令不存在错误码
		result[err.NAME] = err.EINVINSTRUCT
	end

	return result
end



-- 注册节点树
function index()
	local setting = require("luci.torchlight.setting")
	
	-- 注册ds节点
	local page   = node("ds")
	page.target  = firstchild()
	page.title   = _("Administration")
	page.order   = 20
	page.sysauth = get_authuser()
		--page.sysauth = false
	page.sysauth_authenticator = "htmlauth"
	page.ucidata = true
	page.index = true
	
    entry({"ds", "ds"}, call("ds"), "DataService", 20).index = true
end

-- 数据服务类接口
-- @author WuWeier <wuweier@tp-link.net>
function ds(json_tbl)
	local result = {}
	local jsondata

	if json_tbl then
		jsondata = json_tbl
	else
		local jsonlib = require("luci.json")
	    local protocol = require("luci.http.protocol")
	    jsondata = http.jsondata()
    	jsondata = jsondata or jsonlib.decode(http.get_raw_data() or "", protocol.urldecode) or {}
    end
	
	if not jsondata then
		-- 返回格式错误错误码
		result[err.NAME] = err.EINVFMT
		write_json(result)
		return
	end

	local json = require("luci.torchlight.json")
	request = json.content_to_string(jsondata)

	result = do_ds(jsondata)
	
	json.get_json_data(json.content_to_string(result), request)
	
	write_json(result)
end

function is_blank_tbl(tbl)
	if type(tbl) ~= "table" then
		return true
	end
	for _k, _v in pairs(tbl) do  --luacheck:ignore 512
		return false
	end
	
	return true
end

function transform_diffdata(diffdata)
	if type(diffdata) ~= "table" then
		return nil
	end
	local uci_file, uci_diff, method, method_diff, _idx, diff
	local ret = {}
	for uci_file, uci_diff in pairs(diffdata) do
		ret[uci_file] = {}
		for method, method_diff in pairs(uci_diff) do
			for _idx, diff in pairs(method_diff) do
				if (not is_blank_tbl(diff[DIFF_KEY_PARA]) or DIFF_KEY_DEL == method)
					and diff[DIFF_KEY_NAME] then
					local sec = diff[DIFF_KEY_NAME]
					ret[uci_file][sec] = {}
					ret[uci_file][sec][DIFF_KEY_TYPE] = diff[DIFF_KEY_TYPE]
					ret[uci_file][sec][DIFF_KEY_PARA] = diff[DIFF_KEY_PARA]
					ret[uci_file][sec][KEY_METHOD] = method
				end
			end
		end
	end
	
	-- 对空table进行处理
	local _k, _v
	for _k, _v in pairs(ret) do
		if is_blank_tbl(_v) then
			ret[_k] = nil
		end
	end
	
	if is_blank_tbl(ret) then
		ret = nil
	end
	
	return ret
end

-- 根据errorcode和extra data生成SLP接口返回内容
-- 错误码不为0并且有错误信息的时候携带在error_msg中
local function get_error_result(errcode, extra)
	local result = {}
	if errcode ~= err.ENONE and nil ~= extra and type(extra) == "table" and next(extra) then
		result[err.MSG] = extra
	end
	result[err.NAME] = errcode

	return result
end


local function local_set_data(webdata, method)
	local errcode = err.ENONE
	local retdata = {}
	local extra = {}
	local add_rst_data = {}
	local diff_items = {}
	local cursor = uci.cursor()
	
	if type(webdata) ~= "table" and type(method) ~= "string" then
		retdata[err.NAME] = err.EINVARG
		return retdata
	end

	HTTP_RAW_JSON_DATA = webdata

	-- 检查设置数据权限
	errcode = do_checkauth(webdata, method)
	if errcode ~= err.ENONE then
		retdata[err.NAME] = errcode
		return retdata
	end
	
	-- 获取差异数据
	local errcode, alldata, diffdata, changed = diff_data(webdata, method)
	if errcode ~= err.ENONE then
		retdata[err.NAME] = errcode
		return retdata
	end
	
	-- 数据未改变
	if not changed then
		retdata[err.NAME] = errcode
		return retdata
	end
	
	-- 检查参数合法性
	errcode, extra = do_chkcb(diffdata, alldata)
	retdata = util.merge_table(retdata, extra or {})
	if errcode ~= err.ENONE then
		return get_error_result(errcode, extra)
	end
	
	-- 检查并过滤参数，并检查表格是否已满
	errcode = check_filter_options(diffdata, alldata)
	if errcode ~= err.ENONE then
		retdata[err.NAME] = errcode
		return retdata
	end
	
	-- 检查并过滤参数，并检查表格是否已满
	errcode = filter_args(diffdata, alldata)
	if errcode ~= err.ENONE then
		retdata[err.NAME] = errcode
		return retdata
	end
	-- 修改数据之前执行回调函数
	errcode, extra = do_beforesavecb(diffdata, alldata)
	retdata = util.merge_table(retdata, extra or {})
	if errcode ~= err.ENONE then
		return get_error_result(errcode, extra)
	end
	
	-- 保存差异数据
	errcode, extra = save_diffdata(cursor, diffdata)
	retdata = util.merge_table(retdata, extra or {})

	if errcode ~= err.ENONE then
		return get_error_result(errcode, extra)
	end
	
	-- 提交数据
	for uciname, ucidata in pairs(diffdata) do
		diff_items = ucidata[DIFF_KEY_ADD]
		if diff_items and #diff_items > 0 then
			for _, item in pairs(diff_items) do
				if item[DIFF_KEY_NAME] then
					add_rst_data[uciname] = add_rst_data[uciname] or {}
					add_rst_data[uciname][KEY_NAME] = add_rst_data[uciname][KEY_NAME] or {}
					add_rst_data[uciname][KEY_NAME][#add_rst_data[uciname][KEY_NAME] + 1] = item[DIFF_KEY_NAME]
				end
			end
		end
		cursor:commit(uciname)
	end

	-- 修改回复出产设置标志位
	change_factory_status(cursor)
	
	-- 将差异数据设置到系统环境变量中
	local nixio = require("nixio")
	local LINUX_UCI_DIFF_ENV = "UCI_CONFIG"
	local jsonlib = require("luci.json")
	local trans_diff_data = transform_diffdata(diffdata)
	if nil ~= trans_diff_data then
		nixio.setenv(LINUX_UCI_DIFF_ENV, jsonlib.encode(trans_diff_data))
	end

	-- 执行服务
	errcode, extra = do_srvcb(diffdata, alldata)
	retdata = util.merge_table(retdata, extra or {})
	if errcode ~= err.ENONE then
		return get_error_result(errcode, extra)
	end
	
	retdata[err.NAME] = err.ENONE
	retdata = util.merge_table(retdata, add_rst_data or {})
	return retdata
end

-- 设置数据接口
-- @author WuWeier <wuweier@tp-link.net>
-- @param method 设置数据类型，add/delete/modify
-- @param webdata Web请求数据
-- error_code不为0的时候，允许携带额外的错误信息
function set_data(webdata, method)
	userconfig.take_running_cfg_lock( "luci-set_data")
	local retdata = local_set_data(webdata, method)
	userconfig.give_running_cfg_lock( "luci-set_data")
	return retdata
end

-- 获取数据接口
-- @author WuWeier <wuweier@tp-link.net>
-- @param webdata Web请求数据 
function get_data(webdata)
	local retdata = {}
	local datainfo = nil
	local count = 0
	local ret = false
	local errcode = nil
	
	if type(webdata) ~= "table" then
		retdata[err.NAME] = err.EINVARG
		return retdata
	end
	
	for uciname, getinfo in pairs(webdata) do
		local ucidata = {}
		local countdata = {}
		local has_getdata = false
		local has_count = false
		
		-- 获取条目数量
		local keycounts = getinfo[KEY_COUNT] or {}
		keycounts = type(keycounts) == "string" and {keycounts} or keycounts
		for _, keycount in pairs(keycounts) do
			
			if nil ~= getinfo[KEY_FILT_PARA] then
				if false == check_filter_options_is_register(uciname, keycount, getinfo[KEY_FILT_PARA] ) then
					return  err.EINVARG
				end
			end
			ret, count, errcode = get_count_data(uciname, keycount, getinfo[KEY_FILT_PARA] or {})

			if ret then
				ucidata[keycount] = {[KEY_COUNT] = count[1]}
				
				has_getdata = true
			else
				-- 返回参数错误错误码
				retdata = {}
				retdata[err.NAME] = errcode or err.EINVARG
				return retdata
			end
		end

		-- 获取指定section类型的数据
		local ztypes = getinfo[KEY_TYPE] or {}
		ztypes = type(ztypes) == "string" and {ztypes} or ztypes

		for _, ztype in pairs(ztypes) do
			if nil ~= getinfo[KEY_FILT_PARA] then
				if false == check_filter_options_is_register(uciname, ztype, getinfo[KEY_FILT_PARA] ) then
					return  err.EINVARG
				end
			end
			if nil ~= getinfo[KEY_PARA] then
				if nil ~= getinfo[KEY_PARA]["start"] and nil == getinfo[KEY_PARA]["end"] then
					return  err.EINVARG
				elseif 	nil == getinfo[KEY_PARA]["start"] and nil ~= getinfo[KEY_PARA]["end"] then
					return  err.EINVARG
				elseif 	nil ~= getinfo[KEY_PARA]["start"] and nil ~= getinfo[KEY_PARA]["end"] then
					local page_start = tonumber(getinfo[KEY_PARA]["start"])
					local page_end = tonumber(getinfo[KEY_PARA]["end"])
					if page_end < page_start then
						return  err.EINVARG
					end
				end
			end
			ret, datainfo, count, errcode = get_type_data(uciname, ztype,
								getinfo[KEY_FILT_PARA] or {}, getinfo[KEY_PARA] or {})	
			if ret then
				ucidata[ztype] = datainfo
				if count ~= nil then
					countdata[ztype] = count
					has_count = true
				end
				has_getdata = true
			else
				-- 返回参数错误错误码
				-- 有错误码时，允许增加error_msg信息
				errcode = errcode or err.EINVARG
				return get_error_result(errcode, datainfo)
			end
		end
		
		-- 获取指定section名称的数据
		local names = getinfo[KEY_NAME] or {}
		names = type(names) == "string" and {names} or names
		for _, name in pairs(names) do
			if nil ~= getinfo[KEY_FILT_PARA] then
				if false == check_filter_options_is_register(uciname, name, getinfo[KEY_FILT_PARA] ) then
					return  err.EINVARG
				end
			end
			ret, datainfo, errcode = get_name_data(uciname, name,
								getinfo[KEY_FILT_PARA] or {}, getinfo[KEY_PARA] or {})
			if ret then
				ucidata[name] = datainfo
				has_getdata = true
			else
				-- 返回参数错误错误码
				errcode = errcode or err.EINVARG
				return get_error_result(errcode, datainfo)
			end
		end
		
		-- 判断请求参数是否正确
		if #names == 0 and #ztypes == 0 and #keycounts == 0 then
			retdata = {}
			retdata[err.NAME] = err.EINVARG
			return retdata
		end

		-- 判断每个模块是否成功获取数据
		if not has_getdata then
			retdata = {}
			retdata[err.NAME] = err.EINVARG
			return retdata
		end
		
		-- 设置数据
		retdata[uciname] = ucidata
		if has_count then
			retdata[uciname][KEY_COUNT] = countdata
		end
	end
	
	retdata[err.NAME] = err.ENONE
	return retdata
end

local function local_do_action(webdata)
	local retdata = {}
	local ret = false
	
	if type(webdata) ~= "table" then
		retdata[err.NAME] = err.EINVARG
		return retdata
	end

	-- 执行动作
	for modname, datainfo in pairs(webdata) do
		for action_name, paras in pairs(datainfo) do
			local exists, errcode, data = do_keyword_func(modname, action_name, keyword_action_table, paras, nil)
			
			if exists then
				if errcode ~= err.ENONE then
					retdata = {}
					retdata[err.NAME] = errcode
					return retdata
				end
			else
				retdata = {}
				retdata[err.NAME] = err.EINVARG
				return retdata
			end
			
			data = data or {}
			lutil.update(retdata, data)
		end
	end
	
	retdata[err.NAME] = err.ENONE
	return retdata
end

-- 执行动作接口
-- @author WuWeier <wuweier@tp-link.net>
-- @param webdata Web请求数据 
function do_action(webdata)
	userconfig.take_running_cfg_lock( "luci-do_action")
	local retdata = local_do_action(webdata)
	userconfig.give_running_cfg_lock( "luci-do_action")
	return retdata
end

function urlencode(str)
	function __encode(c)
		return string.format("%%%02x", string.byte(c, 1, 1))
	end
	
	local tmp_str = str
	tmp_str = tmp_str.gsub(tmp_str, "\n", "\\n")
	tmp_str = tmp_str.gsub(tmp_str, "\r", "\\r")
	
	return string.gsub(tmp_str, "[^%a%d%-%_%.%!%~%*%'%(%)]", __encode)
end

-- 返回json数据
-- @author WuWeier <wuweier@tp-link.net>
function write_json(json)
	http.prepare_content("application/json")
	http.write_json(json, urlencode)
end

-- 获取配置选项类型
-- @author WuWeier <wuweier@tp-link.net>
-- @param uciname uci文件名称
-- @param sectype section类型
-- @param option_name 选项名称
-- @return option类型 option或者list
function get_option_type(uciname, sectype, option_name)
	local uci_sectype_info = uci_option_type_table[uciname] or {}	
	local sectype_info = uci_sectype_info[sectype] or {}
	
	if sectype_info[option_name] == UCI_OPT_TYPE_LIST then
		return UCI_OPT_TYPE_LIST
	end
	
	return UCI_OPT_TYPE_OPTION
end

-- 执行动态函数
-- @author WuWeier <wuweier@tp-link.net>
-- @param keyword 函数关键字
-- @return 是否包含存在关键字的函数
-- @return 错误码
-- @return 动态数据
function do_keyword_func(uciname, keyword, keyword_table, paras, page_para, unique_id)

	if type(keyword) ~= "string" or type(keyword_table) ~= "table" then
		return false
	end
	
	paras = paras or {}
	
	local uci_kw_table = keyword_table[uciname] or {}
	local cbs = uci_kw_table[keyword]
	local extra = {}
	local extra_data

	if not cbs or "table" ~= type(cbs) then
		return false
	end

	for _, entry in pairs(cbs) do
		local funcpath = entry[KEYWORD_FUNCPATH]
		if not funcpath then
			return false
		end

		local modulename, funcname = util.split_module_func(funcpath)
		local module = nil

		if modulename ~= nil then
			module = require(modulename)
		end

		local func = module and funcname and module[funcname] or nil
		assert(func ~= nil,
				   'Cannot resolve function "' .. funcpath .. '". Is it misspelled or local?')

		-- 查看是否有权限执行关键字函数
		local usrlist = entry[KEYWORD_USERLIST]
		if usrlist ~= nil then
			local user = util.get_user_group()
			if not util.index(usrlist, user) then
				return true, err.EFORBID
			end
		end

		local errcode, data, other = func(paras, uciname, keyword, page_para, unique_id)
		extra_data = other
		
		if nil ~= data then
			if type(data) == "table" then
				extra = util.merge_table(extra, data)
			elseif type(data) == "string" or type(data) == "number" then
				table.insert(extra, data)
			end
		end

		-- 返回错误的时候允许跟随错误码返回错误信息
		if err.ENONE ~= errcode then
			return true, errcode, extra
		end
	end
	
	return true, err.ENONE, extra, extra_data
end

-- 按照注册返回JSON对象选项类型表对数据进行转换
function convert_jsontype(uciname, sectype, ucidata)
	ucidata = ucidata or {}
	local jsondata = {}
	local sectype_map = json_datatype_table[uciname] or {}
	local paratype_map = sectype_map[sectype]
	
	if paratype_map == nil then
		return ucidata
	end
	
	local jsontype = require("luci.torchlight.jsontype")
	
	for k, v in pairs(ucidata) do
		jsondata[k] = v
		
		local funcname = paratype_map[k]
		if funcname then
			local func = jsontype[funcname] or nil
			assert(func ~= nil,
					   'Cannot resolve function "' .. funcname .. '". Is it misspelled or local?')
			
			jsondata[k] = func(v)
		end
	end
	
	return jsondata
end


-- 返回指定section类型的数据数组
-- @author WuWeier <wuweier@tp-link.net>
-- @param uciname uci文件名称
-- @param sectype section类型
-- @return 获取是否成功
-- @return 返回指定section类型的数据数组
function get_count_data(uciname, sectype, filter_para)
	if type(uciname) ~= "string" or type(sectype) ~= "string" then
		return false, nil
	end

	local cursor = uci.cursor()
	local ret = false
	local count = 0
	local data = {}
	local entry = nil
	local exists = false
	local errcode = err.ENONE
	local length = 0
	local start = 0
	local zend = 0
	
	-- 获取动态数据
	exists, errcode, count = do_keyword_func(uciname, sectype, keyword_count_table, filter_para, nil)
	if exists then
		return errcode == err.ENONE, count, errcode
	end

	data = {}
	cursor:foreach(
		uciname, sectype,
		function(s)
			entry = {}
			s = convert_jsontype(uciname, sectype, s)
			entry[s[".name"]] = s
			data[#data + 1] = entry
		end
	)

	return true, #data
end

-- 返回指定section类型的数据数组
-- @author WuWeier <wuweier@tp-link.net>
-- @param uciname uci文件名称
-- @param sectype section类型
-- @return 获取是否成功
-- @return 返回指定section类型的数据数组
function get_type_data(uciname, sectype, filter_para, page_para)
	if type(uciname) ~= "string" or type(sectype) ~= "string" then
		return false, nil
	end

	
	local ret = false
	local data = {}
	local count = 0
	local exists = false
	local errcode = err.ENONE
	local index = 1
	local count_filtered = 0
	local start_index = nil
	local end_index = nil
	local had_module_ver = false
	
	-- 获取动态数据
	exists, errcode, data, count = do_keyword_func(uciname, sectype, keyword_data_table, filter_para, page_para, nil)
	count = count or 0
	
	if exists then
		return errcode == err.ENONE, data, count, errcode
	end

	
	local cursor = uci.cursor()
	
	if page_para and page_para[KEY_START] and page_para[KEY_END] then
		start_index = tonumber(page_para[KEY_START])
		end_index = tonumber(page_para[KEY_END])
	end
	data = {}
	count = 0

	local uci_kw_table = keyword_force_sectype_table[uciname] or {}
	local section = uci_kw_table[sectype] or {}
	local _list = section["list"] or {}
	local _option = section["option"] or {}

	cursor:foreach(uciname, sectype,
		function(section)
			count = count + 1
			--------step1: filter----------
			local filter = false
			if filter_para ~= nil and #filter_para > 0 then
				--或的关系，只有一个符合即可
				for k0,v0 in ipairs(filter_para) do
					filter = true
					--与的关系，必须全部符合
					for k,v in pairs(v0) do
						filter = true
						if type(v) == "table" then
							if type(section[k]) == "table" then	
							--filter是list，必须全部匹配上才match
								for j=1, #v do
									filter = true
									local section_table = section[k]
									for i=1, #section_table do
										--必须匹配一个
										filter = true
										if section_table[i] == v[j] then
											filter = false
											break
										end
										if filter == false then		--no matched, get next filter
											break
										end
									end
									if filter == true then		--no matched, get next filter
										break
									end
								end
							end
						else
							--遍历list，若有一个等于v则匹配
							if type(section[k]) == "table" then
								local section_table = section[k]
								for i=1, #section_table do
									if section_table[i] == v then
										filter = false
										break
									end
								end
							else
								if section[k] ~= nil and section[k] == v then
									filter = false	--match
								end
							end					
						end
						
						if filter == true then		--no matched, get next filter
							break
						end
					end
					if filter == false then		--matched, no need to continue
						break
					end
				end
			end

			if filter == false then
				--------step2: para filter for paging----------
				if start_index  and end_index  then
					count_filtered = count_filtered + 1
					if start_index  > count_filtered - 1 or end_index  < count_filtered - 1 then
						return
					end
				end
				data[index] = {}
				for k, v in pairs(_list) do
					section[v] = section[v] or {}
				end

				for k, v in pairs(_option) do
					section[v] = section[v] or ""
				end

				data[index][section[".name"]] = section
				index = index + 1
				if KEY_CAP_MODULE_VER == section[".name"] and  sectype == KEY_CAPAB then
					had_module_ver = true
				end
			end
		end
	)

	if sectype == KEY_CAPAB then
		local spec_info_data = do_module_spec_info(uciname)
		if nil ~= spec_info_data then
			data[index] = {}
			data[index][KEY_SPEC_INFO] = spec_info_data
			index = index + 1
			count = count + 1
		end
		
		if false == had_module_ver then
			local module_version = {}
			module_version[KEY_CAP_VERSION_OP] = "1.0"
			data[index] = {}
			data[index][KEY_CAP_MODULE_VER] = module_version
			index = index + 1
			count = count + 1
		end

	end

	if filter_para ~= nil and #filter_para > 0 then
		count = #data
	end

	return true, data, count
end

-- 返回指定section名称的数据
-- @author WuWeier <wuweier@tp-link.net>
-- @param uciname uci文件名称
-- @param secname section名称
-- @return 获取是否成功
-- @return 返回指定section名称的数据
function get_name_data(uciname, secname, filter_key)
	if type(uciname) ~= "string" or type(secname) ~= "string" then
		return false, nil
	end
	
	local data = nil
	local cursor = uci.cursor()
	local ret = false
	local exists = false
	local errcode = err.ENONE
	local table_name = nil
	local unique_id = nil
	-- 获取动态数据
	exists, errcode, data = do_keyword_func(uciname, secname, keyword_data_table, filter_key, unique_id)
	if exists then
		return errcode == err.ENONE, data, errcode
	end
	
	ret = true
	data = {}
	
	data = cursor:get_all(uciname, secname)
	if data then
		data = convert_jsontype(uciname, data[".type"], data)
	else
		-- capability目前都是uci，不会走到此路劲，因此不需要执行module_spec_info_data_table 回调
		errcode, table_name, unique_id = split_table_and_id(secname)
		if nil ~= table_name and nil ~= unique_id then
			exists, errcode, data = do_keyword_func(uciname, table_name, keyword_data_table, nil, unique_id)
			if exists then
				return errcode == err.ENONE, data, errcode
			end
		end
	end
	
	data = data or {}
	if secname == KEY_CAPAB then
		local spec_info_data = do_module_spec_info(uciname)
		if nil ~= spec_info_data then
			data[KEY_SPEC_INFO] = spec_info_data
		end
		if nil == data[KEY_CAP_MODULE_VER] then
			local module_version = {}
			module_version[KEY_CAP_VERSION_OP] = "1.0"
			data[KEY_CAP_MODULE_VER] = module_version
		end
	end

	local uci_kw_table = keyword_force_secname_table[uciname] or {}
	local section = uci_kw_table[secname] or {}
	local _list = section["list"] or {}
	local _option = section["option"] or {}

	for k, v in pairs(_list) do
		data[v] = data[v] or {}
	end

	for k, v in pairs(_option) do
		data[v] = data[v] or ""
	end

	return ret, data
end

-- 获取flash中块数据与差异数据
-- @author WuWeier <wuweier@tp-link.net>
-- @param webdata Web请求数据
-- @param method 设置数据类型，add/delete/modify
-- @return 错误码
-- @return flash中的块数据
-- @return 与flash中有差异的数据
function diff_data(webdata, method)
	if type(webdata) ~= "table" or type(method) ~= "string" then
		return err.EINVARG, nil, nil
	end
	
	local errcode = nil
	local alldata = nil
	local diffdata = nil
	local changed = false
	
	if method == METHOD_ADD then
		errcode, alldata, diffdata, changed = diff_add_data(webdata)
	elseif method == METHOD_DELETE then
		errcode, alldata, diffdata, changed = diff_del_data(webdata)
	elseif method == METHOD_MODIFY then
		errcode, alldata, diffdata, changed = diff_modify_data(webdata)
	else
		return err.EINVARG, nil, nil
	end
	
	return errcode, alldata, diffdata, changed
end

-- 获取add接口所对应的flash中块数据与差异数据
-- @author WuWeier <wuweier@tp-link.net>
-- @param webdata Web请求数据
-- @return flash中的块数据
-- @return 与flash中有差异的数据
function diff_add_data(webdata)
	if type(webdata) ~= "table" then
		return err.EINVARG, nil, nil
	end
	
	local changed = false
	local cursor = uci.cursor()
	local alldata = nil
	local diffdata = nil
	local ucidata = nil
	local adddata = nil
	local addentry = nil
	local para = nil
	local error_code = nil
	local paras = nil
	local names = nil
	local ztable = nil
	local filter_para = nil

	function handle_patch(moddata, uciname, secname, sectype, para, filter_para, insert_index)
		local modentry = {}
		modentry[DIFF_KEY_NAME] 		= secname
		modentry[DIFF_KEY_TYPE] 		= sectype
		modentry[DIFF_KEY_PARA] 		= para
		modentry[DIFF_KEY_FILTER_PARA] 	= filter_para
		modentry[DIFF_KEY_INSERT_INDEX] = insert_index
		moddata[#moddata + 1] = modentry

		return err.ENONE
	end

	function transform_args(names, paras, ztable)
		if not paras or type(ztable) ~= "string" then
			debug_print("add func parameter is empty or table type is not string.")
			return err.EINVARG
		end

		if names and paras and #paras > 0 and (type(names) ~= "table"
			or #names ~= #paras) then
			debug_print("add func name length and parameter length is not equal")
			return err.EINVARG
		end

		if #paras > 0 then
			if type(names) == "table" then
				return err.ENONE, names, paras
			end

			names = {}
			for i = 1, #paras do
				table.insert(names, ztable .. "_" .. (tostring(math.ceil(socket.gettime() * 100)):sub(3)) .. tostring(i))
			end
		else
			if names then
				return err.ENONE, { names }, { paras }
			end

			names = { ztable .. "_" .. (tostring(math.ceil(socket.gettime() * 100)):sub(3)) }
			paras = { paras }
		end

		return err.ENONE, names, paras
	end
	
	for uciname, datainfo in pairs(webdata) do
		diffdata = diffdata or {}
		ucidata = diffdata[uciname] or {}
		adddata = ucidata[DIFF_KEY_ADD] or {}
		diffdata[uciname] = ucidata
		ucidata[DIFF_KEY_ADD] = adddata
		
		ztable = datainfo[KEY_TYPE]
		filter_para = datainfo[KEY_FILT_PARA]
		
		error_code, names, paras = transform_args(datainfo[KEY_NAME], datainfo[KEY_PARA], ztable)
		if error_code ~= err.ENONE then
			return error_code
		end

		for i = 1, #names do
			if keyword_add_data_table[uciname] and
				keyword_add_data_table[uciname][ztable] then
				error_code = handle_patch(adddata, uciname, names[i], ztable, paras[i], filter_para, datainfo[KEY_INSERT_INDEX])
				changed = true

				if error_code ~= err.ENONE then
					return error_code
				end
			else

				para = {}
				addentry = {}
				addentry[DIFF_KEY_NAME] 		= names[i]
				addentry[DIFF_KEY_TYPE] 		= ztable
				addentry[DIFF_KEY_PARA] 		= paras[i]
				addentry[DIFF_KEY_INSERT_INDEX] = datainfo[KEY_INSERT_INDEX]

				-- 判断条目是否已经存在
				local secinfo = cursor:get_all(uciname, addentry[DIFF_KEY_NAME])
				if secinfo then
					return err.EENTRYEXIST, nil, nil
				end

				local webpara = paras[i] or {}

				-- 根据配置选项类型表，设置差异数据
				for k, v in pairs(webpara) do
					para[k] = v
					if get_option_type(uciname, addentry[DIFF_KEY_TYPE], k) == UCI_OPT_TYPE_LIST then
						para[k] = type(v) == "table" and v or {v}
					end
				end

				changed = true
				adddata[#adddata + 1] = addentry
			end
		end
	end
	
	return err.ENONE, alldata, diffdata, changed
end

-- 获取delete接口所对应的flash中块数据与差异数据
-- @author WuWeier <wuweier@tp-link.net>
-- @param webdata Web请求数据
-- @return flash中的块数据
-- @return 与flash中有差异的数据
function diff_del_data(webdata)
	if type(webdata) ~= "table" then
		return err.EINVARG, nil, nil
	end
	local error_code = nil
	local changed = false
	local cursor = uci.cursor()
	local alldata = nil
	local diffdata = nil
	local ucidata = nil
	local deldata = nil
	local delentry = nil
	local diff_ucidata = nil
	
	function handle_patch(moddata, uciname, sectype, filter_para, unique_id)
		local modentry = {}
		modentry[DIFF_KEY_NAME] 		= sectype
		modentry[DIFF_KEY_TYPE] 		= sectype
		modentry[DIFF_KEY_FILTER_PARA] 	= filter_para
		modentry[SLP_UNIQUE_ID] 	= unique_id
		moddata[#moddata + 1] = modentry

		return err.ENONE
	end
	
	local table_names = nil
	local unique_ids = {}
	local ids_cnt = 1
	
	for uciname, datainfo in pairs(webdata) do
		diffdata = diffdata or {}
		diff_ucidata = diffdata[uciname] or {}
		deldata = diff_ucidata[DIFF_KEY_DEL] or {}
		
		diffdata[uciname] = diff_ucidata
		diff_ucidata[DIFF_KEY_DEL] = deldata
		
		alldata = alldata or {}
		ucidata = alldata[uciname] or {}
		alldata[uciname] = ucidata

		local dyna_table = datainfo[KEY_TYPE] or ""
		if keyword_del_data_table[uciname] and
				keyword_del_data_table[uciname][dyna_table] then
			error_code = handle_patch(deldata, uciname, dyna_table, datainfo[DIFF_KEY_FILTER_PARA], nil)
			changed = true
		
			if error_code ~= err.ENONE then
				return error_code
			end
		else
			-- 通过名称获取差异数据
			local delnames = datainfo[KEY_NAME] or {}
			delnames = type(delnames) == "table" and delnames or {delnames}
			
			for _, delname in pairs(delnames) do
				delentry = {}

				-- 判断条目是否存在
				local secinfo = cursor:get_all(uciname, delname)
				if not secinfo then
					local table_name, unique_id
					error_code, table_name, unique_id = split_table_and_id(delname)

					if nil ~= table_name and nil ~= unique_id then
						if nil == table_names then
							table_names = table_name
						elseif table_names ~= table_name then
							return err.EENTRYNOTEXIST, nil, nil
						end
						
						if nil ~= table_names then
							unique_ids[ids_cnt] = unique_id
							ids_cnt = ids_cnt + 1
						end
					else
						return err.EENTRYNOTEXIST, nil, nil
					end
					
					table_name = nil
					unique_id = nil
				else
					-- 设置alldata数据
					ucidata[delname] = secinfo

					delentry[DIFF_KEY_NAME] = delname
					delentry[DIFF_KEY_TYPE] = secinfo[".type"]

					changed = true
					deldata[#deldata + 1] = delentry
				end
				
				
			end
			
			-- 通过类型获取差异数据
			local deltypes = datainfo[KEY_TYPE] or {}
			deltypes = type(deltypes) == "table" and deltypes or {deltypes}
			
			for _, deltype in pairs(deltypes) do
				cursor:foreach(uciname, deltype,
					function(s)
						delentry = {}
						delentry[DIFF_KEY_NAME] = s[".name"]
						delentry[DIFF_KEY_TYPE] = deltype

						changed = true
						deldata[#deldata + 1] = delentry

						-- 设置alldata数据
						ucidata[s[".name"]] = s
					end
				)
			end
		end
	end
	
	
	if nil ~= table_names then
		error_code = handle_patch(deldata, nil, table_names, nil, unique_ids)
			changed = true
		
			if error_code ~= err.ENONE then
				return error_code
			end
	end
	
	return err.ENONE, alldata, diffdata, changed
end

-- 获取modify接口所对应的flash中块数据与差异数据
-- @author WuWeier <wuweier@tp-link.net>
-- @param webdata Web请求数据
-- @return flash中的块数据
-- @return 与flash中有差异的数据
function diff_modify_data(webdata)
	if type(webdata) ~= "table" then
		return err.EINVARG, nil, nil
	end
	
	local changed = false
	local cursor = uci.cursor()
	local alldata = nil
	local diffdata = nil
	local ucidata = nil
	local moddata = nil
	local modentry = nil
	local secinfo = nil
	local ztype = nil
	local secdata = nil
	local diffpara = nil
	local diff_ucidata = nil
	local error_code = err.ENONE
	local had_handle_patch = false

	function handle_patch(moddata, uciname, sectype, para, filter_para, unique_id)
		modentry = {}
		modentry[DIFF_KEY_NAME] 		= sectype
		modentry[DIFF_KEY_TYPE] 		= sectype
		modentry[DIFF_KEY_PARA] 		= para
		modentry[DIFF_KEY_FILTER_PARA] 	= filter_para
		modentry[SLP_UNIQUE_ID]			= unique_id

		moddata[#moddata + 1] = modentry

		return err.ENONE
	end
	
	for uciname, datainfo in pairs(webdata) do
		diffdata = diffdata or {}
		diff_ucidata = diffdata[uciname] or {}
		moddata = diff_ucidata[DIFF_KEY_MOD] or {}
		
		diffdata[uciname] = diff_ucidata
		diff_ucidata[DIFF_KEY_MOD] = moddata
		
		alldata = alldata or {}
		ucidata = alldata[uciname] or {}
		
		alldata[uciname] = ucidata
		
		if datainfo[KEY_TYPE] and datainfo[KEY_PARA]
		and datainfo[KEY_FILT_PARA] then
			error_code = handle_patch(moddata, uciname, datainfo[KEY_TYPE],
						datainfo[KEY_PARA], datainfo[KEY_FILT_PARA], nil)
			changed = true
			if error_code ~= err.ENONE then
				return error_code
			end
		else
			for secname, modinfo in pairs(datainfo) do
				-- 设置diffdata数据
				modentry = {}
				diffpara = {}
				had_handle_patch = false
				
				-- 处理单条目修改
				if secname ~= KEY_TYPE and secname ~= KEY_PARA
				and KEY_FILT_PARA ~= secname then
				
					modentry[DIFF_KEY_NAME] = secname
				
					-- 设置动态数据差异
					if keyword_set_data_table[uciname] and
					keyword_set_data_table[uciname][secname] then
						modentry[DIFF_KEY_TYPE] = secname
						modentry[DIFF_KEY_PARA] = modinfo
						changed = true
					else
						secinfo = cursor:get_all(uciname, secname)
						-- 条目不存在
						if secinfo == nil then
							local table_name = nil
							local unique_id = nil
							error_code, table_name, unique_id = split_table_and_id(secname)
							if nil ~= table_name and nil ~= unique_id then
								error_code = handle_patch(moddata, uciname, table_name,
											modinfo, nil, unique_id)
								changed = true
								had_handle_patch = true
								if error_code ~= err.ENONE then
									return error_code
								end
							else
								return err.EENTRYNOTEXIST, nil, nil
							end
						else
							-- 设置alldata数据
							ucidata[secname] = secinfo

							modentry[DIFF_KEY_TYPE] = secinfo[".type"]
							modentry[DIFF_KEY_PARA] = diffpara

							-- 比较差异数据
							for k, v in pairs(modinfo) do
								if type(v) ~= "table" then
									v = tostring(v)
								end

								if (secinfo[k] ~= nil and v ~= secinfo[k]) or (secinfo[k] == nil and v ~= "") then
									diffpara[k] = v
									changed = true

									if get_option_type(uciname, secinfo[".type"], k) == UCI_OPT_TYPE_LIST then
										diffpara[k] = type(v) == "table" and v or {v}
									end
								end
							end
						end
					end
					if false == had_handle_patch then
							-- 增加差异数据条目
						moddata[#moddata + 1] = modentry
						
					end

				end
			end
		end
	end
	
	return err.ENONE, alldata, diffdata, changed
end

-- 保存采集数据
-- @author WuWeier <wuweier@tp-link.net>
-- @para uciname  	UCI
-- @para secname  	差异数据
-- @para sectype  	差异数据
-- @para para     	差异数据
-- @return 操作是否成功，true/false
function save_collect_data(uciname, secname, sectype, para)
	local cursor = uci.cursor()
	local disp = require("luci.dispatcher")
	local client_info = disp.get_client_info()
	local is_pc = client_info[disp.CI_IS_PC]
	local cfgname = is_pc and PC_UCI or APP_UCI
	local para = para or {}
	local num = 0
	local change_num = 0
	
	if not fs.isfile("/etc/config/%s" % cfgname) then
		return true, change_num
	end
	
	if not cursor:get(cfgname, secname) then
		cursor:set(cfgname, secname, uciname)
	end
	
	for k, v in pairs(para) do
		num = cursor:get(cfgname, secname, k) or 0
		num = tonumber(num)
		if 0 == num then
			change_num = change_num + 1
		end
		
		num = tonumber(num) + 1
		cursor:set(cfgname, secname, k, num)
	end
	
	cursor:save(cfgname)
	
	return true, change_num
end

-- 判断value是否是空的table，空的table无法set到uci配置中
local function is_empty_table(value)
	return type(value) == "table" and next(value) == nil
end

-- 保存差异数据
-- @author WuWeier <wuweier@tp-link.net>
-- @para diffdata 差异数据
-- @return 操作是否成功，true/false
function save_diffdata(cursor, diffdata)
	if type(cursor) ~= "userdata" or type(diffdata) ~= "table" then
		return err.ENONE
	end
	
	local retdata = {}
	local extra = nil
	local result = false
	
	function save_secinfo(uciname, data, method, retdata)
		local err_code = err.ENONE
		
		if not data then
			return err.ENONE
		end
		
		for _, entry in pairs(data) do
			local name = entry[DIFF_KEY_NAME]
			local ztype = entry[DIFF_KEY_TYPE]
			local para =  entry[DIFF_KEY_PARA] or {}
			local filter_para = entry[DIFF_KEY_FILTER_PARA]
			local unique_id = entry[SLP_UNIQUE_ID]
			local exists, errcode

			if keyword_set_data_table[uciname] and method == DIFF_KEY_MOD
			and keyword_set_data_table[uciname][name] then
				exists, errcode, extra = do_keyword_func(uciname, name, keyword_set_data_table, para, filter_para, unique_id)
				retdata = util.merge_table(retdata, extra or {})
				if err.ENONE ~= errcode then
					err_code = errcode
				end
			elseif keyword_add_data_table[uciname] and method == DIFF_KEY_ADD
			and keyword_add_data_table[uciname][ztype] then
				exists, errcode, extra = do_keyword_func(uciname, ztype, keyword_add_data_table, para, filter_para, unique_id)
				retdata = util.merge_table(retdata, extra or {})				
				entry[DIFF_KEY_NAME] = nil
				retdata = util.merge_table(retdata, extra or {})
				if err.ENONE ~= errcode then
					err_code = errcode
				end
			else
				cursor:set(uciname, name, ztype)
				for k, v in pairs(para) do
					cursor:delete(uciname, name, k)
					-- 如果设置的是空的table，则删除这个list
					if is_empty_table(v) == false then
						cursor:set(uciname, name, k, v)
					end
				end
			end
		end
		
		return err_code, retdata
	end
	
	function del_secinfo(uciname, deldata, retdata)
		local error_code = nil
		local filter_para = nil
		local unique_id = nil
		local exists = nil
		local extra = nil

		if not deldata then
			return err.ENONE
		end

		for _, dataentry in pairs(deldata) do
			if keyword_del_data_table[uciname] and keyword_del_data_table[uciname][dataentry[DIFF_KEY_NAME]] then
				filter_para = dataentry[DIFF_KEY_FILTER_PARA]
				unique_id = dataentry[SLP_UNIQUE_ID]
				exists, error_code, extra = do_keyword_func(uciname, dataentry[DIFF_KEY_NAME], 
					keyword_del_data_table, nil, filter_para, unique_id)
				retdata = util.merge_table(retdata, extra or {})
				if err.ENONE ~= error_code then
					return error_code, retdata
				end
			else
				cursor:delete(uciname, dataentry[DIFF_KEY_NAME])
			end
		end
		
		return err.ENONE, retdata
	end
	
	function save_insert_data(uciname, data, retdata)
		local insert_index = tonumber(data[1][DIFF_KEY_INSERT_INDEX]) + 1
		local ztype = data[1][DIFF_KEY_TYPE]
		local all_data = {}
		local item = nil
		
		cursor:foreach(uciname, ztype, function(s)
			item = {}
			all_data[#all_data + 1] = item
			item[DIFF_KEY_NAME] = s[".name"]
			item[DIFF_KEY_TYPE] = ztype
			item[DIFF_KEY_PARA] = s
		end)
		
		if insert_index > #all_data then
			insert_index = #all_data + 1
		end
		
		-- 清空数据
		cursor:delete_all(uciname, ztype)
				
		-- 插入数据
		for i = 1, #data do
			table.insert(all_data, insert_index, data[i])
			insert_index = insert_index + 1
		end
		
		-- 保存数据
		for _, data_item in pairs(all_data) do
			cursor:section(uciname, ztype, data_item[DIFF_KEY_NAME], data_item[DIFF_KEY_PARA])
		end
		
		return err.ENONE, retdata
	end
	
	
	local adddata = nil
	local deldata = nil
	local moddata = nil
	local errcode = err.ENONE
	
	for uciname, ucidata in pairs(diffdata) do
		adddata = ucidata[DIFF_KEY_ADD]
		-- 添加数据且包含insert_index字段且没有注册添加回调
		if adddata and adddata[1] and tonumber(adddata[1][DIFF_KEY_INSERT_INDEX]) ~= nil 
			and not (keyword_add_data_table[uciname] and 
				keyword_add_data_table[uciname][adddata[1][DIFF_KEY_TYPE]])
			then
			errcode, extra = save_insert_data(uciname, adddata, retdata)
			retdata = util.merge_table(retdata, extra or {})
			if errcode ~= err.ENONE then
				return errcode, retdata
			end
		else
			errcode, extra = save_secinfo(uciname, adddata, DIFF_KEY_ADD, retdata)
			retdata = util.merge_table(retdata, extra or {})
			if errcode ~= err.ENONE then
				return errcode, retdata
			end
		end
		moddata = ucidata[DIFF_KEY_MOD]
		errcode, extra = save_secinfo(uciname, moddata, DIFF_KEY_MOD, retdata)
		retdata = util.merge_table(retdata, extra or {})
		if errcode ~= err.ENONE then
			return errcode, retdata
		end
		deldata = ucidata[DIFF_KEY_DEL]
		errcode, extra = del_secinfo(uciname, deldata, retdata)
		retdata = util.merge_table(retdata, extra or {})
		if errcode ~= err.ENONE then
			return errcode, retdata
		end
		
	end
	
	return err.ENONE, retdata
end

---[[
-- 修改出产设置标志位
-- @author WuWeier <wuweier@tp-link.net>
-- @return true/false
function change_factory_status(cursor)
	local uci_system = model.uciSystem

	-- 已经不是出厂设置，则直接返回
	local is_factory = cursor:get(uci_system.fileName, uci_system.secName.sys, uci_system.optName.isFactory)
	if is_factory ~= uci_system.optValue.isFactory.yes then
		return err.ENONE
	end

	-- 修改出厂设置字段
	local ret = cursor:set(uci_system.fileName, uci_system.secName.sys, uci_system.optName.isFactory,
			   uci_system.optValue.isFactory.no)
	ret = ret and cursor:commit(uci_system.fileName)

	-- -- 重置域名登录方式
	-- local fs = require "luci.fs"
	-- local setting = require "luci.torchlight.setting"
	-- if ret then fs.writefile("/proc/net/dn_login/login_way", setting.FIX_DOMAIN_LOGIN) end

	return ret
end
--]]

-- 按section类型进行索引
function change_to_type_index(uci_diffdata)
	if type(uci_diffdata) ~= "table" then
		return nil
	end
	
	local sectype = nil
	local typedata = nil
	local type_diffdata = {}
	local type_diffkey_data = nil

	local diffkeys = {DIFF_KEY_MOD, DIFF_KEY_DEL, DIFF_KEY_ADD}
	for _, diffkey in pairs(diffkeys) do
		diffkey_data = uci_diffdata[diffkey] or {}
		for _, diffkey_entry in pairs(diffkey_data) do
			sectype = diffkey_entry[DIFF_KEY_TYPE]
			typedata = type_diffdata[sectype] or {}
			type_diffdata[sectype] = typedata
			
			type_diffkey_data = typedata[diffkey] or {}
			typedata[diffkey] = type_diffkey_data
			type_diffkey_data[#type_diffkey_data + 1] = diffkey_entry
		end
	end
	
	return type_diffdata
end

-- 执行回调函数
-- @author WuWeier <wuweier@tp-link.net>
-- @param cbtype 回调函数方法类型
-- @param diffdata 差异数据
-- @param alldata 所有数据
-- @return 错误码
-- @return 是否继续执行
function do_callback(cbtype, diffdata, alldata)
    if type(cbtype) ~= "string" and type(diffdata) ~= "table" then
        return err.EEXPT
    end
	
    local disp = require("luci.dispatcher")
	local cb_key_type_name = disp.CB_KEY_TYPE_NAME
	local cb_key_type_type = disp.CB_KEY_TYPE_TYPE
	
	alldata = alldata or {}
	local errcode = err.ENONE
	local retdata = {}
	local extra = nil
	local sectype = nil
	local secname  = nil
	local para = nil
	local filter_para = nil
	local diffkey_data = nil
	local datacbs = disp.context.datacbs or {}
	local diffkeys = {DIFF_KEY_MOD, DIFF_KEY_DEL, DIFF_KEY_ADD}
	
	-- 执行回调函数
	function call_cb(cb_key_type, method, cbtype, uciname, secname, sectype,
					para, secdata, uci_diffdata, filter_para)

		local cb_key = secname
		local ext_data = nil
		if cb_key_type == cb_key_type_type then
			cb_key = sectype
		end
		
		local uci_datacbs = datacbs[uciname] or {}
		local type_datacbs = uci_datacbs[cb_key_type] or {}
		local key_datacbs = type_datacbs[cb_key] or {}
		local cbs = key_datacbs[cbtype]
		
		if not cbs then
			return err.ENONE
		end
		
		local errcode = err.ENONE
		for index, entry in pairs(cbs) do
			local module = require(entry.module)
			local func   = module[entry.func]
			assert(func ~= nil,
			   'Cannot resolve function "' .. entry.func .. '". Is it misspelled or local?')
	
			assert(type(func) == "function",
				   'The symbol "' .. entry.func .. '" does not refer to a function but data ' ..
				   'of type "' .. type(func) .. '".')
			
			errcode, ext_data = func(method, uciname, secname, sectype, para, secdata, uci_diffdata, filter_para)
			if errcode ~= err.ENONE then
				return errcode, ext_data
			end
		end
		
		return errcode, ext_data
	end
	
	-- 遍历diffdata，执行回调函数
	for uciname, uci_diffdata in pairs(diffdata) do
		local ucidata = alldata[uciname] or {}
	
		for _, diffkey in pairs(diffkeys) do
			diffkey_data = uci_diffdata[diffkey] or {}
			
			if datacbs[uciname] and datacbs[uciname][cb_key_type_name] and
			datacbs[uciname][cb_key_type_name][DIFF_KEY_ALL] then
				errcode, extra = call_cb(cb_key_type_name, diffkey, cbtype, uciname, DIFF_KEY_ALL,
							   DIFF_KEY_ALL, nil, nil, uci_diffdata)
				retdata = util.merge_table(retdata, extra or {})
				if errcode ~= err.ENONE then
					return errcode, retdata
				end
			end
			
			for _, diffkey_entry in pairs(diffkey_data) do
				secname = diffkey_entry[DIFF_KEY_NAME]
				sectype = diffkey_entry[DIFF_KEY_TYPE]
				para = diffkey_entry[DIFF_KEY_PARA] or {}
				filter_para = diffkey_entry[DIFF_KEY_FILTER_PARA] or {}
				
				local secdata = ucidata[secname] or {}
				
				-- 执行名称回调函数
				errcode, extra = call_cb(cb_key_type_name, diffkey, cbtype, uciname, secname,
							   sectype, para, secdata, nil, filter_para)
				retdata = util.merge_table(retdata, extra or {})
				if errcode ~= err.ENONE then
					return errcode, retdata
				end
			end
		end
		
		
		-- 按照section类型对diffdata重新组织, 执行类型回调函数
		local type_diffdata = change_to_type_index(uci_diffdata)
		for sectype, typedata in pairs(type_diffdata) do
			for _, diffkey in pairs(diffkeys) do
				diffkey_data = typedata[diffkey] or {}
				
				-- 组装alldata数据
				local type_alldata = {}
				for _, entry in pairs(diffkey_data) do
					secname = entry[DIFF_KEY_NAME]
					if ucidata[secname] then
						type_alldata[secname] = ucidata[secname]
					end
				end
				
				if #diffkey_data > 0 then
					-- 执行类型回调函数
					errcode, extra = call_cb(cb_key_type_type, diffkey, cbtype, uciname, nil,
								   sectype, typedata[diffkey], type_alldata)
					retdata = util.merge_table(retdata, extra or {})
					if errcode ~= err.ENONE then
						return errcode, retdata
					end
				end
			end
		end
	end

    return errcode, retdata
end

-- 执行检查回调函数
function do_chkcb(diffdata, alldata)
    return do_callback("chkfunc", diffdata, alldata)
end

-- 执行服务回调函数
function do_srvcb(diffdata, alldata)
    return do_callback("srvfunc", diffdata, alldata)
end

-- 修改数据之前执行的回调函数
function do_beforesavecb(diffdata, alldata)
    return do_callback("beforesavefunc", diffdata, alldata)
end

-- 检查config文件中sectype类型的section个数是否已经满了
-- AUTHOR: LiGuanghua <liguanghua@tp-link.net>
-- RETURN：false：没有满；true：已满
function check_sec_full(config, sectype)
	if type(config) ~= "string" or type(sectype) ~= "string" or "" == config or "" == sectype then
		return false
	end

	local cursor = uci.cursor()
	local limit  = UCI_SEC_LIMIT_EXT[config] and UCI_SEC_LIMIT_EXT[config][sectype] or
					model.UCI_SEC_LIMIT[config] and model.UCI_SEC_LIMIT[config][sectype]
	if limit then
		cursor:foreach(config, sectype, function(s) limit = limit - 1 end)
		return (limit <= 0)
	end

	return false
end

function check_filter_options_is_register(uciname, secname,filter_para)
	
	if nil == filter_para or 0 == #filter_para then
		return true
	else
		local options = keyword_filter_options_data[uciname]
		if nil == options then
			return true
		end
		options = keyword_filter_options_data[uciname][secname]
		if nil == options then
			return true
		end
		options = keyword_filter_options_data[uciname][secname][uciname .. "_" .. secname]
		if nil == options then
			return true
		end
		options = keyword_filter_options_data[uciname][secname][uciname .. "_" .. secname][KEY_FILTER_OPTIONS_OP]
		if nil == options then
			return true
		end
		options = util.split_string(options, ',')
		
		local rev_table = {}
		for i = 1, #options do
			rev_table[options[i]] = true
		end
		
		for i = 1, #filter_para do
			for key, val in pairs(filter_para[i]) do
				
				if nil == rev_table[key] or false == rev_table[key] then
					return false
				end
			end
		end
	end
	return true

end

-- 检查filter字段合法性
-- @author HuRihui <hurihui@tp-link.net>型
-- @param diffdata 差异数据
-- @param alldata 所有数据
-- @return 错误码
function check_filter_options(diffdata, alldata)
    if type(diffdata) ~= "table" then
        return err.ENONE 
    end
	
	
	local errcode = err.ENONE
	alldata = alldata or {}
	local filter = nil
	local secname = nil
	local diffkeys = {DIFF_KEY_MOD, DIFF_KEY_DEL, DIFF_KEY_ADD}
	for uciname, uci_diffdata in pairs(diffdata) do
		for _, diffkey in pairs(diffkeys) do
			diffkey_data = uci_diffdata[diffkey] or {}
			for _, diffkey_entry in pairs(diffkey_data) do
				secname = diffkey_entry[DIFF_KEY_NAME]
				filter = diffkey_entry[KEY_FILT_PARA]
				if nil ~= filter and nil ~= secname then
					
					if false == check_filter_options_is_register(uciname, secname,filter ) then
						return  err.EINVARG
					end
				end
			end
		end
	end
    
    return errcode
end


-- 过滤参数
-- @author WuWeier <wuweier@tp-link.net>型
-- @param diffdata 差异数据
-- @param alldata 所有数据
-- @return 错误码
function filter_args(diffdata, alldata)
    if type(diffdata) ~= "table" then
        return err.ENONE 
    end
	
	function filter_section(uciname, secname, sectype, para, secdata)
		-- 检查并过滤参数
		local filter_name_key = uciname .. FILTER_UCI_SEC_SEP .. secname
		local filter_type_key = uciname .. FILTER_UCI_SEC_SEP .. sectype
		
		local errcode = err.ENONE
		if uci_sectype_filters[filter_type_key] then
			errcode = filter(uci_sectype_filters[filter_type_key], para, secdata)
			if errcode ~= err.ENONE then
				return errcode
			end
		end
		
		if uci_secname_filters[filter_name_key] then
			errcode = filter(uci_secname_filters[filter_name_key], para, secdata)
			if errcode ~= err.ENONE then
				return errcode
			end
		end
		
		return errcode
	end
	
	local errcode = err.ENONE
	alldata = alldata or {}
	local diffkeys = {DIFF_KEY_MOD, DIFF_KEY_DEL, DIFF_KEY_ADD}
	for uciname, uci_diffdata in pairs(diffdata) do
		for _, diffkey in pairs(diffkeys) do
			local diffkey_data = uci_diffdata[diffkey] or {}
			for _, diffkey_entry in pairs(diffkey_data) do
				local secname = diffkey_entry[DIFF_KEY_NAME]
				local sectype = diffkey_entry[DIFF_KEY_TYPE]
				local para = diffkey_entry[DIFF_KEY_PARA] or {}
				
				local ucidata = alldata[uciname] or {}
				local secdata = ucidata[secname] or {}
				
				-- 检查表格数据是否已满
				if DIFF_KEY_ADD == diffkey and check_sec_full(uciname, sectype) then
					return err.ETABLEFULL
				end
				
				errcode = filter_section(uciname, secname, sectype, para, secdata)
	
				if err.ENONE ~= errcode then
					return errcode
				end
			end
		end
	end
    
    return errcode
end

-- 用于过滤和检查参数
-- @author WuWeier <wuweier@tp-link.net>型
-- @param filter_info: 过滤字段信息
-- @param sec_info: 传入的section信息
-- @return 错误码
function filter(filter_info, para, secdata)
    local lutil = require("luci.util")
    
    if type(filter_info) ~= "table" or type(para) ~= "table" then
        return err.ENONE 
    end

	secdata = secdata or {}
    for k, v in pairs(para) do
        local opt_info = filter_info[k]
        
        -- 如果不在过滤器中，则认为是无效参数
        if opt_info == nil then
            para[k] = nil
        end

        -- 如果注册了验证函数，则进行验证
        if opt_info and opt_info[filter_key.validator] then
            local validator = opt_info[filter_key.validator]
            local args = opt_info[filter_key.args] or {}
            local modulename, funcname = util.split_module_func(validator)
            local module = nil
            
            if modulename ~= nil then
                module = require(modulename)
            end
			
            local func = module and funcname and module[funcname] or nil
            local errcode = func and func(v, para, secdata, unpack(args))

			if not func and errcode ~= nil then
				debug_print("Please check your register check func whehter exact..")
				debug_print("module name: ")
				debug_print(modulename)
				debug_print("funcion name: ")
				debug_print(funcname)
			end
			
            errcode = type(errcode) == "number" and errcode or type(errcode) == "boolean"
						and errcode and err.ENONE or err.EINVARG
            if errcode ~= err.ENONE then
                return errcode 
            end

			-- shell injection test
			if opt_info[filter_key.injection_test] == true then
				if validator_mod.injection_test(v) == true then return err.EFORBID end
			end
        end
    end
    
    return err.ENONE 
end
