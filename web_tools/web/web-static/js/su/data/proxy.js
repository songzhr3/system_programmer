// JavaScript Document
(function($){
var arrayFilter = function(array, obj){
    var returnObj = {};
    /* get instance from array via obj */
    if(!array || array.length === 0 || !obj){
        return returnObj;
    }
    if(!$.isArray(array)){
        array = [array];
    }
    $.each(array, function(i, instance){
        var match = true;
        $.each(obj, function(key, value){
            if(instance[key] != value){
                match = false;
                return false;
            }
        });
        if(!!match){
            returnObj = instance;
            return false;
        }
    });
    return returnObj;
};
$.su.Proxy = function(options){
	var defaults = {
		xtype: "proxy",
		url: $.su.dsUrl(),
        combineKey: null,
		async: true,
		timeout: 240*1000,
		reader: {
			url: null,
			root: "result",
			type: null,
			timeout: null
		},
		writer: {
			url: null,
			root: "result",
			type: null,
			timeout: null
		},
		type: "GET",
		dataType: "text",
		isWizard: false
	};

	var settings = $.extend(defaults, options);

	//reader
	settings.reader.url = settings.reader.url || settings.url;
    settings.reader.combineKey = settings.reader.combineKey || settings.combineKey;
	settings.reader.type = settings.reader.type || settings.type;
	settings.reader.timeout = settings.reader.timeout || settings.timeout;
	settings.reader.type = settings.reader.type.toUpperCase();
	//writer
	settings.writer.url = settings.writer.url || settings.url;
    settings.writer.combineKey = settings.writer.combineKey || settings.combineKey;
	settings.writer.type = settings.writer.type || settings.type;
	settings.writer.timeout = settings.writer.timeout || settings.timeout;
	settings.writer.type = settings.writer.type.toUpperCase();


	$.extend(this, settings);
	this.isProxy = true;
};

$.su.Proxy.prototype.query = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var data = $.extend({
		"method": "get"
	}, data);

	this.read(data, callback, callback_fail, callback_error, triggerEvent, scope);
}

$.su.Proxy.prototype.modify = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var data = $.extend({
		"method": "set"
	}, data);

	this.read(data, callback, callback_fail, callback_error, triggerEvent, scope);
}

$.su.Proxy.prototype.action = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var data = $.extend({
		"method": "do"
	}, data);

	this.read(data, callback, callback_fail, callback_error, triggerEvent, scope);
}

$.su.Proxy.prototype.del = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var data = $.extend({
		"method": "delete"
	}, data);

	this.read(data, callback, callback_fail, callback_error, triggerEvent, scope);
}

$.su.Proxy.prototype.add = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var data = $.extend({
		"method": "add"
	}, data);

	this.read(data, callback, callback_fail, callback_error, triggerEvent, scope);
}

$.su.Proxy.prototype.read = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var me = scope || this,
		callback = callback || function(){},
		callback_fail = callback_fail || function(){},
		callback_error = callback_error || function(){},
		triggerEvent = triggerEvent === false ? false: true;

	if (data["localtest"] && data["localtest"] == "true" || $.su.isLocal)
	{
		setTimeout(function(){
            callback.call(me, $.extend(true, {}, $.su.localResult), $.extend(true, {}, $.su.localResult.others));
        }, 500);
		return;
	}

	data = JSON.stringify(data,function(key, value) {
							if (typeof(value) === "string") {
								return encodeURIComponent(value);
							}
							return value;
						});

	data = data.replace(/null/g, "[]").replace(/{}/g, "[]")
	var request_data = Array.from(data).sort().join("").replace(/"/g,"")

	if (!me.authSessionsDataFlag && !me.gridRefreshDataFlag && !window.storePreHandCbRefreshFlag && window.sessionsExceedTime != null)
	{
		if (window.restartSessionsTime && window.sessionsExceedTime != null)
		{
			window.restartSessionsTime();
		}
	}

	var url = me.reader.url,
        combineKey = me.reader.combineKey;
    if(!$.isArray(url)){
        return $.ajax({
            url: me.reader.url,
            type: me.reader.type,
            timeout: me.reader.timeout,
            dataType: me.dataType,
			contentType: "application/json; charset=UTF-8",
            async: me.async,
            cache: false,
            data: data,
            traditional: true,
            success: function(data, status, xhr){

				data = JSON.parse(data,
						function(k, v){
							var val = v;

							if (typeof val === "string")
							{
								try
								{
									val = decodeURIComponent(val);
								}catch(ex){}
							}

							return val;
						}
					);

                data = data[request_data]

				if (data.error_code == 0){
                    /*
					var root = me.reader.root,
                        result = null;
                    if (root){
                        result = data[root];
                        //console.log(url);
                    }else{
                        result = data;
                        //console.log(url);
                    };
					*/
                    //console.log("proxy", data);
                    callback.call(me, data, data.others, status, xhr);
                    if (triggerEvent){
                        $(me).trigger("ev_read", [data, data.others, status, xhr]);
                    };
                }else{
                    //alert(data.error_code);
                    if ("undefined" == typeof(data.error_code)) {
                        data.error_code = -40101;
                    }
                    //进入配置失败机制
                    var error_msg = data.error_msg || {};
                    var sub_err_code = error_msg.sub_err_code || [];
                    var sub_err_msg = error_msg.sub_err_msg || [];

                    // sub_err_code 只有一个值的时候，接口允许返回一个数字，对应的sub_err_msg也只有一个table
                    // 多个值的时候，sub_err_code为数字组成的list，sub_err_msg为table组成的list
                    if (typeof(sub_err_code) == "number") {
                        sub_err_code = [sub_err_code];
                        sub_err_msg = [sub_err_msg];
                    }

                    if (!me.isWizard && $.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
                        if (data.error_code > -51200 || data.error_code <= -51300) //暂不处理云错误码
						{
							$.su.app.errorOperation.denied(data.error_code, error_msg, sub_err_code, sub_err_msg);
						}
                    };

                    callback_fail.call(me, data.error_code, data);
                    $(me).trigger("ev_failed", [data.error_code, data]);
                };
            },
            error: function(xhr, status, type){
                //console.log(url);
                //console.log("proxy", arguments)
                if (!me.preventErrorDefault){
                    //console.log("error", xhr, status, type, url);
                    //alert("Data Error!");
                };

				try {
					var result = JSON.parse(xhr.responseText);
					if ($.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
                        $.su.app.errorOperation.denied(result.error_code, result);
                    }
                    else if (result.error_code && result.error_code == EUNAUTH) {
                        // index页面没有初始化完成的时候，$.su.app变量不存在
                        // 这时候判断错误码为未登录的话，跳转到登录页面
                        if (location.pathname != $.su.loginUrl) {
                            location.href = $.su.loginUrl;
                        }
                    }
				} catch(e){}

                callback_error.call(me, xhr, status, type, url);
                $(me).trigger("ev_error", [xhr, status, type, url]);
            }
        });
    }
    else{
        var deferredArray = [];
        $.each(url, function(i, obj){
            deferredArray.push($.ajax({
                url: obj,
                type: me.reader.type,
                timeout: me.reader.timeout,
                dataType: me.dataType,
                async: me.async,
                cache: false,
                data: {data: $.su.json.toJSONString(data)},
                traditional: true
            }));
        });
        return $.when.apply($, deferredArray).done(function(){
            var root = me.reader.root,
                result = {},
                others = {},
                error_code = 0,
                status = "success",
                xhr = arguments[0][2];
            //arguments = [[data, status, jqXHR], ..., []]
            if(!combineKey){
                for(var i = arguments.length - 1; i>=0; i--){
                    var dataTemp = arguments[i][0],
                        statusTemp = arguments[i][1];

                    if(dataTemp.error_code != 0){
                        error_code = dataTemp.error_code;
                        break;
                    }
                    if(statusTemp != "success"){
                        status = statusTemp;
                    }
                    if(dataTemp){
                        $.extend(true, result, dataTemp[root]);
                        $.extend(true, others, dataTemp.others);
                    }
                }
                result.length = arguments[0][0][root].length;
                result = Array.prototype.slice.call(result, 0);
            }else{
                if($.isArray(combineKey) && combineKey.length == url.length){
                    result = arguments[0][0][root];
                    if(!result || $.isEmptyObject(result)){
                        result = [];
                    }
                    if(!$.isArray(result)){
                        result = [result];
                    }
                    status = arguments[0][1];
                    error_code = arguments[0][0].error_code;
                    others = arguments[0][0].others;
                    for(var i = arguments.length - 1; i>=1; i--){
                        var dataTemp = arguments[i][0],
                            statusTemp = arguments[i][1];

                        if(dataTemp.error_code != 0){
                            error_code = dataTemp.error_code;
                            break;
                        }
                        if(statusTemp != "success"){
                            status = statusTemp;
                        }
                        $.each(result, function(idx, instance){
                            var obj = {};
                            obj[combineKey[i]] = instance[combineKey[0]];	//先取对应的name，如"tunnelname":"UUH"中的UUH
																			//此时：obj = {"interface": "UUH"}
                            obj = arrayFilter(dataTemp[root], obj);			//获取次结果中含有obj的interface
                            delete obj[combineKey[i]];						//删除"interface": "UUH"
                            $.extend(result[idx], obj);						//合并到主结果中
                        });
                    }
                }
            }
            if(error_code == 0){
                callback.call(me, result, others, status, xhr);
                if (triggerEvent) {
                    $(me).trigger("ev_read", [result, others, status, xhr]);
                }
            }else{
                if ("undefined" == typeof(error_code)) {
                        error_code = -40101;
                }
                    //进入配置失败机制
                    if ($.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
                        $.su.app.errorOperation.denied(error_code);
                };
                callback_fail.call(me, error_code, others, result);
                $(me).trigger("ev_failed", [error_code, others, result]);
            }
        }).fail(function(){
            var xhr = arguments[0][0],
                status = arguments[0][1],
                type = arguments[0][1];
            callback_error.call(me, xhr, status, type, url);
            if (triggerEvent) {
                $(me).trigger("ev_error", [xhr, status, type, url]);
            }
        });
    }
};

$.su.Proxy.prototype.write = function(data, callback, callback_fail, callback_error, triggerEvent, scope){
	var data = $.extend({
		"method": "set"
	}, data);

	var me = scope || this,
		callback = callback || function(){},
		callback_fail = callback_fail || function(){},
		callback_error = callback_error || function(){},
		triggerEvent = triggerEvent === false ? false: true;

	var url = me.writer.url,
        combineKey = me.writer.combineKey;
    if(!$.isArray(url)) {
	return $.ajax({
		url: me.writer.url,
		type: me.writer.type,
		timeout: me.writer.timeout,
		dataType: me.dataType,
		cache: false,
		async: me.async,
		data: {data: $.su.json.toJSONString(data)},
		traditional: true,
		success: function(data, status, xhr){
			data = data[request_data]

				if (data.error_code == 0){
				var root = me.writer.root,
					result = null;
				if (root){
					result = data[root];
				}else{
					result = data;
				}
				callback.call(me, result, data.others, status, xhr);
				if (triggerEvent){
					$(me).trigger("ev_write", [result, data.others, status, xhr]);
				};
			}else{
				//进入配置失败机制
                if ("undefined" == typeof(data.error_code)) {
                    data.error_code = -40101;
                }


                if ($.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
                    $.su.app.errorOperation.denied(data.error_code);
                };

				callback_fail.call(me, data.error_code, data.others, data.result);
				$(me).trigger("ev_failed", [data.error_code, data.others, data.result]);
			};
		},
		error: function(xhr, status, type){
			if (!me.preventErrorDefault){
				//console.log("error", xhr, status, type);
				//alert("Data Error!");
			};
                callback_error.call(me, xhr, status, type);
                $(me).trigger("ev_error", [xhr, status, type, url]);
            }
        });
    }else{
        var deferredArray = [];
        $.each(url, function(i, obj){
            deferredArray.push($.ajax({
                url: obj,
                type: me.reader.type,
                timeout: me.reader.timeout,
                dataType: me.dataType,
                async: me.async,
                cache: false,
                data: {data: $.su.json.toJSONString(data)},
                traditional: true
            }));
        });
        return $.when.apply($, deferredArray).done(function(){
            var root = me.reader.root,
                result = {},
                others = {},
                error_code = 0,
                status = "success",
                xhr = arguments[0][2];
            //arguments = [[data, status, jqXHR], ..., []]
            if(!combineKey){
                for(var i = arguments.length - 1; i>=0; i--){
                    var dataTemp = arguments[i][0],
                        statusTemp = arguments[i][1];

                    if(dataTemp.error_code != 0){
                        error_code = dataTemp.error_code;
                        break;
                    }
                    if(statusTemp != "success"){
                        status = statusTemp;
                    }
                    if(dataTemp){
                        $.extend(true, result, dataTemp[root]);
                        $.extend(true, others, dataTemp.others);
                    }
                }
                result.length = arguments[0][0][root].length;
                result = Array.prototype.slice.call(result, 0);
            }else{
                if($.isArray(combineKey) && combineKey.length == url.length){
                    result = arguments[0][0][root];
                    if(!result || $.isEmptyObject(result)){
                        result = [];
                    }
                    if(!$.isArray(result)){
                        result = [result];
                    }
                    status = arguments[0][1];
                    error_code = arguments[0][0].error_code;
                    others = arguments[0][0].others;
                    for(var i = arguments.length - 1; i>=1; i--){
                        var dataTemp = arguments[i][0],
                            statusTemp = arguments[i][1];

                        if(dataTemp.error_code != 0){
                            error_code = dataTemp.error_code;
                            break;
                        }
                        if(statusTemp != "success"){
                            status = statusTemp;
                        }
                        $.each(result, function(idx, instance){
                            var obj = {};
                            obj[combineKey[i]] = instance[combineKey[0]];
                            obj = arrayFilter(dataTemp[root], obj);
                            delete obj[combineKey[i]];
                            $.extend(result[idx], obj);
                        });
                    }
                }
            }
            if(error_code == 0){
                callback.call(me, result, others, status, xhr);
                if (triggerEvent) {
                    $(me).trigger("ev_read", [result, others, status, xhr]);
                }
            }else{
                if ("undefined" == typeof(error_code)) {
                        error_code = -40101;
                }
                    //进入配置失败机制
                    if ($.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
                        $.su.app.errorOperation.denied(error_code);
                };
                callback_fail.call(me, error_code, others, result);
                $(me).trigger("ev_failed", [error_code, others, result]);
            }
        }).fail(function(){
            var xhr = arguments[0][0],
                status = arguments[0][1],
                type = arguments[0][1];
            callback_error.call(me, xhr, status, type, url);
            if (triggerEvent) {
                $(me).trigger("ev_error", [xhr, status, type, url]);
            }
        });
    }
};


})(jQuery);