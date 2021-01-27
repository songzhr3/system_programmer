--[[
Copyright(c) 2008-2014 Shenzhen TP-LINK Technologies Co.Ltd.

File    :  json.lua
Details :  the method getting json data
Author  :  songzhanren
Version :  1.0.0
Date    :  2020/12/15
]]--

local sys = require "luci.sys"
local jsonlib = require("luci.json")
module("luci.torchlight.json", package.seeall)
--[[
function:
	judge the file is existing or not
param：
	arg[1]: path of the file
return:
	true or false
--]]--
function file_exists(filename)
    local file = io.open(filename, "rb")
    if file then file:close() end
    return file ~= nil
end


function content_to_string(x)
	if "table" == type(x) then
		x = jsonlib.encode(x)
	end

	local tmp = tostring(x)
	tmp = string.gsub(tmp, "[\r\n]", "")
	return tmp
end

--[[
function:
	write  content to the file
param：
	arg[1]: path of the file
    arg[2]: content which need to write to the file
    arg[3]: the mode open the file
return: true or false
--]]--
function write_file(path, content, mode)
	mode = mode or "w+b"
	--dbg(content)
	local file = io.open(path, mode)
	if file then
		file:write(content)
		file:write("\n")
		io.close(file)
		return true
	else
		return false
	end
end


function get_json_data(result, request)
	-- filename: json result path name 
	filename = "/tmp/web/stok=/json_data.json"
	local sys = require ("luci.sys")
	if not file_exists(filename) then
		local cmd = "mkdir -p /tmp/web/stok=; cp -rf /www/web-static /tmp/web/; cp -rf /usr/lib/lua/luci/view/* /tmp/web/stok=;"
		cmd = cmd .. "cp -rf /usr/lib/lua/luci/view/admin/Index.htm /tmp/web/stok=;"
		cmd = cmd .. "touch /tmp/web/stok=/json_data.json;"
    	sys.fork_call(cmd)
	end

	write_file(filename, request, "a")
	write_file(filename, result, "a")
end

