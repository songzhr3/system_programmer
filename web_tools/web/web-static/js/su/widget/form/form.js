// JavaScript Document
(function($){

var _get_item_by_name = function(datas, itemName) {
	for (var i = 0; i < datas.length; i++) {
		for (var key in datas[i]) {
			if (key == itemName) {
				return datas[i][key];
			}
		}
	}
	return null;
};

$.su.Widget("form", {
	defaults: {
		fields: [],
		proxy: null,	//form通过这个proxy获取数据
		//items: {},		//列出需要被上传的name 和对应 控件的 id
		//buttons: [],	//后续再扩展

		//ajax相关属性
		formEnctype: "application/x-www-form-urlencoded",
		traditional: false,
		hiddenFrame: false,

		submitBtn: null,
		autoLoad: true,
		//submiting: false,

		parsekey: null,
		// 传输文件时的url
		fileUrlCb: null,
		showPrompt: true,
		showPromptSuccess: true,
		showPromptFail: true,
		promptTextSuccessed: $.su.CHAR.OPERATION.FORM_SAVED,
		promptTextFailed: $.su.CHAR.OPERATION.FORM_FAILED,
		cls: ""
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var tar = $(obj).addClass("form-panel");	//注意可以不是form！若是form注意所有button初始化时候的type类型不能为submit，避免form直接提交！
			$.extend(obj, defaults, options);

			obj.id = obj.id || $.su.randomId("form");

			//初始化proxy
			var proxy = obj.proxy;
			if (proxy){
				if (!proxy.isProxy){
					proxy = new $.su.Proxy(proxy);
				};
				obj.proxy = proxy;
			};

			var method = "POST",
				action = "",
				target = obj.hiddenFrame ? "_"+obj.id+"_iframe" : "_self";

			if (obj.proxy){
				method = obj.proxy.writer.type;
				action = obj.proxy.writer.url;
			};

			if (!tar.is("form")){
				var form = $("<form enctype=\""+obj.formEnctype+"\" method=\""+method+"\" action=\""+action+"\" target=\""+target+"\"></form>");
				form.append(tar.children().detach());
				tar.append(form);
			}else{
				tar.attr("enctype", obj.formEnctype);
				tar.attr("method", method);
				tar.attr("action", action);
				tar.attr("target", target);
			};

			tar.addClass(obj.cls);

			if (obj.hiddenFrame){
				var iframe = $("<iframe id=\""+target+"\" name=\""+target+"\" class=\"hidden\"></iframe>");
				iframe.insertAfter(tar);
			};

			//if (obj.showPrompt){
				var inHTML =	"";
				if (obj.submitBtn){
					inHTML += 	"<div class=\"form-submit button-container submit\">";
					inHTML +=		"<div class=\"form-submit-wrap\"></div>";
                    inHTML +=		"<span class=\"form-error-tips error\"></span>";
					inHTML +=		"<span class=\"loading\"></span>";
					inHTML +=	"</div>";
				};

				//提示框部分
					inHTML += 	"<div class=\"form-prompt successed\">";
					inHTML +=		"<div class=\"bg\"></div>";
					inHTML +=		"<div class=\"content\">";
					inHTML +=			"<span class=\"icon\"></span>";
					inHTML +=			"<span class=\"text text-successed\">"+obj.promptTextSuccessed+"</span>";
					inHTML +=			"<span class=\"text text-failed\">"+obj.promptTextFailed+"</span>";
					inHTML +=		"</div>";
					inHTML +=	"</div>";

				var formPrompt = $(inHTML);
				tar.append(formPrompt);
			//}


			/*//数据绑定
			var items = obj.items,
				dataBindFlag = false;
			for (var index in items){
				dataBindFlag = true;

			};

			obj.isBinded = dataBindFlag;*/
			obj.isForm = true;
			if (obj.isPanel){
				obj.isFormPanel = true;
			};

			if (obj.autoLoad){
				tar.form("load");
			};

			if (obj.submitBtn){
				var type = $.type(obj.submitBtn),
					submitBtn = null;
				if (type === "string"){
					if (obj.submitBtn === "default"){
						submitBtn = $("<button type=\"button\"></button>").button({
							text: $.su.CHAR.OPERATION.SAVE,
							cls: "submit",
							handler: function(e){
								if(!me.form("validate")){
									return false;
								}
								$.su.loading.show();
								me.form("submit", {}, function(){
									$.su.loading.hide();
									if(obj.callback){
										obj.callback();
									}
								},function(){
									$.su.loading.hide();
								},function(){
									$.su.loading.hide();
								});
							}
						});
					}else{
                        if (obj.submitBtn.charAt(0) === '#' || obj.submitBtn.charAt(0) === '.'){
                            //写id的状况，必须带#或点！
                            submitBtn = $(obj.submitBtn);
                            if (submitBtn.length == 0){
                                //console.error("Can not find the submit button!");
                            };
                        }else{
                            //自定义文本
                            submitBtn = $("<button type=\"button\"></button>").button({
                                text: obj.submitBtn,
                                cls: "submit",
                                handler: function(e){
                                    me.form("submit", {}, obj.callback);
                                }
                            });
                        }
					}
				}else{
					if (obj.submitBtn.isButton){
						submitBtn = $(obj.submitBtn);
					}else{
						//console.error("Can not find the submit button!");
					};
				};

				obj.submitBtn = submitBtn.get(0);
				/*if (tar.is("form")){
					tar.append(submitBtn.button("getContainer"));
				}else{
					tar.find("form").append(submitBtn.button("getContainer"));
				};*/

				if (obj.submitBtn && obj.submitBtn.isButton){
					tar.find("div.form-submit-wrap").append(submitBtn.button("getContainer"))
				}else{
					tar.find("div.form-submit-wrap").append(submitBtn);
				};

				/*var btnContainer = submitBtn.closest("div.button-container");
				console.log(submitBtn, btnContainer)
				btnContainer.append("<span class=\"loading\"></span>");
				btnContainer.prepend("<span class=\"form-error-tips error\"></span>");*/
			};

		});

		//数据监听
		var proxy = $(me.get(0).proxy);
		proxy.on("ev_read", function(e, result, status, xhr){
			var parseKey = me.get(0).parseKey;
			if(parseKey!=null){
				var moduleName = parseKey.moduleName;
				var sectionName = parseKey.sectionName;
				if(moduleName&&sectionName&&result[moduleName]&&result[moduleName][sectionName]){
					if ($.isArray(sectionName))
					{
						var tempData = {};
						for (var i = 0; i < sectionName.length; i++)
						{
							$.extend(tempData, result[moduleName][sectionName[i]]);
						}
						result = tempData;
					}
					else
					{
						result = result[moduleName][sectionName];
					}
				}
				else return;
			}

			if (parseKey && parseKey.itemName) {
				result = _get_item_by_name(result, parseKey.itemName);
			}
			me.form("loadData", result);
		}).on("ev_write", function(e, result, status, xhr){
			me.form("loadData", result);
		}).on("ev_failed", function(e, errorcode, others, data){
			//作相应的差错处理...
			me.form("hideLoading");
			me.trigger("ev_failed", [me, errorcode, others, data]);
		});

		me.on("ev_validatechange", function(e, result, fg){
			e.stopPropagation();
			if (result == true){
				me.form("setNormal");
			};
		});


		/*//事件监听
		if (me.get(0).submitBtn){
			me.find("div.button-container.submit").addClass("form-submit");
			me.find("div.button-container.submit button.button-button").on("click", function(e){
				//if (me.form("validate")){
					me.form("submit");
				//};
			});
		};*/

		//console.log(me);
		return me;
	},

	validate: function(me){
		var me = me || this,
			obj = me.get(0),
			fields = obj.fields,
			result = true,
			fg = null;

		me.form("setNormal");

		$("div.widget-error-tips").css("display", "none");
		for (var index = 0; index < fields.length; index++){
			var field = fields[index];
			if (field){

				var	name = field.name,
					mapping = field.mapping || name;
				//console.log(name, mapping)
				if (name){
					//console.log("ini")
					var	input = me.find("[name="+name+"]");
					if (input.length != 0){
						var xtype = input.get(0).xtype;

						//console.log("here:", input, xtype);
						//console.log(xtype, input[xtype]("getContainer").hasClass("disabled"), input.prop("disabled"));
						if (xtype){
							if (!input[xtype]("getContainer").hasClass("disabled") && (!input.prop("disabled") || xtype == "combobox")){
								//console.log(input[xtype]("validate"))
								if (input[xtype]("validate")){
									//console.log("continue!!", name);
									var inputObj = input.get(0);
									var v = input[xtype]("getValue");
									if (inputObj.textFormat){
										input[xtype]("setValue", inputObj.textFormat(v));
									};
									continue;
								}else{
									//console.log("return false", name);
									result = false;
									fg = input.attr("id");

									break;
								};
							}
						};
					}
				};
			};
		};

		if (result){
			if (obj.validator && $.type(obj.validator) === "function"){
				result = obj.validator.call(me);

				if(!result){
					me.find("div.error input.text-text").each(function(i,errorObj){
						var errorContainer = $(errorObj).closest("div");
						errorContainer.delegate("input.text-text","click",function(e){
							e.stopPropagation();
							me.find(".form-error-tips").css("display","none");
						});
					});
				}

				fg = "validator";
			};
		};
		//console.log("ssssssssss")
		me.trigger("ev_validatechange", [result, fg]);
		return result;
	},
	doSubmit: function(me, params){
		var me = me || this,
			obj = me.get(0),
			form = me.is("form") ? me : me.find("form");

		var	traditional = obj.traditional,
			proxy = me.form("getProxy"),
			param = params[1] || {},
			callback = params[2] || function(){},
			callback_failed = params[3] || function(){},
			callback_error = params[4] || function(){},
			showPrompt = (params[5] !== undefined) ?  params[5] : obj.showPrompt;

		//obj.submiting = true;

		// 处理上传文件情况
		if (obj.formEnctype != "application/x-www-form-urlencoded"){
			if (obj.fileUrlCb)
			{
				form[0].action = obj.fileUrlCb(obj);
			}

			form.submit();

			me.form("showLoading");

			var iframe = $("#"+$(form).attr("target"));
			var form_id = $(form).attr("target");
			iframe.one("load", function(){
				me.form("hideLoading");

				if ($.su.isLocal)
				{
					callback.call(me, {error_code: 0});
					return;
				}

				var doc;
				doc = document.getElementById(form_id).contentDocument;
				doc = $($(doc).find("body")).text();
				/* 如果导出的文件大小为0 */
				if(doc.indexOf("application/x-bin") >= 0){
					if ($.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
						$.su.app.errorOperation.denied(-40210);
					}
				}
				else{
					// 防止解析json失败报错，导致无法触发异常事件的情况
					var data = "";
					try {
						data = doc == "" ? "" : $.su.json.parseJSON(doc);
					} catch (e) {
						console.error("parseJSON failed. doc: ", doc);
					}

					if(typeof(data) == "object"){
						if("0" == data.error_code || 0 == data.error_code){
							callback.call(me, data);
						}
						else{
							if ($.su.app && $.su.app.errorOperation && $.su.app.errorOperation.denied){
								$.su.app.errorOperation.denied(parseInt(data.error_code), data.error_msg);
							}
							callback_failed.call(me, data.error_code);

						}
					}
					else{
						callback_error.call(me, doc);
					}
				}
			});
			return;
		};

		me.form("showLoading");

		var data = me.form("serialize");
		var fields = obj.fields;

		/*此处进行SLP接口封装*/

		var postData = {};

		if (obj.parseKey)
		{
			var moduleName = obj.parseKey.moduleName;
			var sectionName = obj.parseKey.sectionName;

			postData[moduleName] = {};

			if ($.isArray(sectionName))
			{
				for (var i = 0; i < sectionName.length; i++)
				{
					postData[moduleName][sectionName[i]] = {};
				}

				for (var key in data)
				{
					for (var j = 0; j < fields.length; j++)
					{
						if (key == fields[j]["name"])
						{
							postData[moduleName][fields[j]["sectionName"]][key] = data[key];
						}
					}
				}

				for (var i = 0; i < sectionName.length; i++)
				{
					if (Object.keys(postData[moduleName][sectionName[i]]) == 0)
					{
						delete postData[moduleName][sectionName[i]];
					}
				}
			}
			else
			{
				if (obj.parseKey && obj.parseKey.itemName && obj.parseKey.set_tdcp_filter) {
					var set_tdcp_filter = obj.parseKey.set_tdcp_filter;
					postData[moduleName] = {
						table: sectionName,
						filter: set_tdcp_filter,
						para: data
					}
				}
				else {
					postData[moduleName][sectionName] = data;
				}
			}
		}
		else
		{
			//日后添加处理方案
			var callback_noparsekeysubmit = me.get(0).callback_noparsekeysubmit;
			if (callback_noparsekeysubmit)
			{
				callback_noparsekeysubmit.call();
			}
			return;
		}

		/* END */

		if (proxy){
			proxy.modify(postData, function(data, others, status, xhr){
				//obj.submiting = false;
				me.form("hideLoading");

				if (showPrompt){
					me.form("prompt", true);
				};

				if (callback){
					callback.call(me, data, others, status, xhr);
				};

			}, function(errorcode, others, data){
				//obj.submiting = false;
				me.form("hideLoading");

				/*使用统一后台错误码处理，此处不再显示*/
				/*
				if (showPrompt){
					if(errorcode != 0){
						me.form("prompt", false);
					}

				};
				*/
				//console.log("Debug: commit fail!");

				if (callback_failed){
					callback_failed.call(me, errorcode, others, data);
				};
			}, function(xhr, status, type){
				//obj.submiting = false;
				//console.log("form", arguments)
				me.form("hideLoading");

				if (showPrompt){
					//在这里添加ajax错误的操作。
					me.form("prompt", false, $.su.CHAR.OPERATION.FORM_AJAX_FAILED);
				};

				if (callback_error){
					callback_error.call(me, xhr, status, type);
				};
			});
		};

	},
	submit: function(me, params){	//param, callback	//ajax向服务器提交数据
		var me = me || this,
			obj = me.get(0),
			form = me.is("form") ? me : me.find("form"),
			traditional = obj.traditional,
			proxy = me.form("getProxy"),
			param = params[1] || {},
			callback = params[2] || null,
			callback_failed = params[3] || null,
			callback_error = params[4] || null,
			showPrompt = (params[5] !== undefined) ?  params[5] : obj.showPrompt,
			doValidate = params[6] === false ? false : true;

		//$("div.widget-error-tips").css("display", "none");
		//console.log(showPrompt)
		if (doValidate !== false){
			if (!me.form("validate")){
				return false;
			};
		};

		//alert("fdsfafa")
		me.form("doSubmit", param, callback, callback_failed, callback_error, showPrompt, doValidate);


		me.trigger("ev_doSubmit", param);
	},
	load: function(me, params){	//ajax从服务器获取数据，并加载到表格中
		var me = me || this/*,
			data = params[1] || {},
			callback = params[1] || null*/;
		//console.log(me);
		var	proxy = me.get(0).proxy;

		if (proxy){
			var parseKey = me.get(0).parseKey;
			var postData = {};

			if (parseKey != null)
			{
				var moduleName = parseKey.moduleName;
				var sectionName = parseKey.sectionName;

				postData[moduleName] = {};
				postData[moduleName]["name"] = sectionName;
			}
			else
			{
				var callback_noparsekeyload = me.get(0).callback_noparsekeyload;
				if (callback_noparsekeyload)
				{
					callback_noparsekeyload.call();
				}
				return;
			}

			proxy.query(postData, function(data, status, xhr){
				//console.log(data)
				if ($.isArray(sectionName))
				{
					var tempData = {};
					for (var i = 0; i < sectionName.length; i++)
					{
						$.extend(tempData, data[moduleName][sectionName[i]]);
					}
					data = tempData;
				}
				else
				{
					data = data[moduleName][sectionName];
				}

				if (parseKey && parseKey.itemName) {
					data = _get_item_by_name(data, parseKey.itemName);
				}

				me.form("loadData", data);

			});
		}
	},
	loadData: function(me, params){	//data	//非ajax操作，从本地加载数据，并且修改form中的数据存储
		var me = me || this,
			data = params[1] || [],
			fields = me.get(0).fields;/*,
			items = me.get(0).items;*/
		//console.log("loadData", data, fields)
		me.trigger("ev_beforeLoadData", data);
		me.data("data", data);

		for (var index = 0; index < fields.length; index++){
			var field = fields[index];
			if (field){
				var	name = field.name,
					mapping = field.mapping || name;
				//console.log(name, mapping);
				if (name){
					//console.log("ini")
					var	obj = me.find("[name="+name+"]");
					//console.log(me, obj);
					if (obj.length != 0){
						var xtype = obj.get(0).xtype;
						//console.log("here:", obj, xtype)
						if (xtype){
							var dd = data[mapping];
							//console.log("xxxx", dd, mapping, data)
							if (dd !== undefined) {
								obj[xtype]("setValue", dd);
							}else{
								//console.log("Data not found with the name of "+name+"! Please Check the data object or the url!");
								//return null;
								continue;
							}
						}
					}
				}
			}
		}
		me.trigger("ev_loadData", data);
	},
	getProxy: function(me){
		var me = me || this,
			proxy = me.get(0).proxy;

		if (proxy && proxy.isProxy){
			return proxy;
		}else{
			return null;
		};
	},
	serialize: function(me){
		var me = me || this,
			obj = me.get(0),
			form = me.is("form") ? me : me.find("form");
		//console.log(form)
		//console.log(form.serializeArray())
		//return form.serializeArray()[0];
		var serializeArray = form.serializeArray(),
			params = {};

		for (var index = 0; index < serializeArray.length; index++){
			var serializeObj = serializeArray[index],
				name = serializeObj.name,
				value = serializeObj.value;

			var input = me.find("[name=" + name + "]");
			var xtype = "widget";
			var is_list_data = false;
			if (input.length != 0){
				xtype = input.get(0).xtype;
			}
			if(input&&input.get(0)&&input.get(0).getValueCb)value=input.get(0).getValueCb(value);
			// 如果是checkbox并且有多个items，则不管是否勾选都传递list到后台
			// 没有勾选传递空list，勾选一个也传递 ["value1"]
			// 只有一个items的情况可能是设置的某个功能开启或者关闭 e.g. 无线营销开关
			// 大量页面使用到了这种情况，因此checkbox只设置了一个items，还是传单个值
			if (xtype == "checkbox") {
				var items = input.get(0).items;
				if (items.length > 1) {
					is_list_data = true;
				}
			}
			// 如果是combobox，如果配置为多选，则发送数组到后台
			if (xtype == "combobox" && input.get(0).multiSelect) {
				is_list_data = true;
			}

			if(!params[name]){
				if (is_list_data) {
					// 多选的checkbox，如果值没有勾选则不传这个值
					// 一般来说不会有不勾选就要传一个空字符串的情况
					// 如果之后有这种需求，这里需要加上对这个item uncheckedValue属性的判断
					if (value == "" || value == 'checkbox_select_all')
						params[name] = [];
					else
						params[name] = [value];
				}
				else
					params[name] = value;
            }else{
                if($.isArray(params[name])){
					// checkbox多个items的情况，如果value为“”表示没有勾选，这个值不放到请求中
					if (!is_list_data || (value != "" && value !='checkbox_select_all') )
                    	params[name].push(value);
                }else{
                    params[name] = [params[name]];
                    params[name].push(value);
                }
            }
		};

		if (obj && obj.transParams)
		{
			params = obj.transParams(params);
		}

		return params;
	},
	reset: function(me){
		var me = me || this,
			obj = me.get(0),
			fields = obj.fields;

		for (var index = 0; index < fields.length; index++){
			var field = fields[index];
			if (field){
				var	name = field.name,
					mapping = field.mapping || name;
				if (name){
					var	input = me.find("[name="+name+"]");
					if (input.length != 0){
						var xtype = input.get(0).xtype;
						if (xtype){
							input[xtype]("reset");
						};
					}
				};
			};
		};
		//console.log("form reset")
		me.trigger("ev_reset");
		return me;
	},
	prompt: function(me, params){
		var me = me || this,
			obj = me.get(0),
			buttonContainer = me.find("div.form-submit"),
			showPrompt = me.get(0).showPrompt,
			showPromptSuccess = me.get(0).showPromptSuccess,
			showPromptFail = me.get(0).showPromptFail,
			successed = params[1],
			text = params[2],
			time = params[3] || 900,
			formPrompt = me.find("div.form-prompt");

		var pH = formPrompt.outerHeight(),
			pW = formPrompt.outerWidth(),
			fH = me.innerHeight() - buttonContainer.height(),
			fW = me.innerWidth() - buttonContainer.height();

		var l = parseInt((fW-pW)/2, 10);
		var t = parseInt((fH-pH)/2, 10);

		//console.log(pH, pW, fH, fW, l, t);
		formPrompt.css({
			left: l,
			top: t
		});

		if (successed){
			if(showPromptSuccess){
				//成功
				formPrompt.removeClass("failed").addClass("successed");
				text = text || obj.promptTextSuccessed;
				formPrompt.find("span.text-successed").html(text);
				formPrompt.fadeIn("150", function(){
					setTimeout(function(){
						formPrompt.fadeOut("150");
					}, time);
				});
			}
		}else{
			if(showPromptFail){
				//失败

				formPrompt.removeClass("successed").addClass("failed");
				text = text || obj.promptTextFailed;
				formPrompt.find("span.text-failed").html(text);
				formPrompt.fadeIn("150", function(){
					setTimeout(function(){
						formPrompt.fadeOut("150");
					}, time);
				});
			}
		};



		return me;
	},
	setPrompt: function(me, params){
		var me = me || this,
			obj = me.get(0);
			obj.showPrompt = params[1];
		return me;
	},
	getContainer: function(me){
		var me = me || this;
		return me;
	},
	setError: function(me, tips){
		var me = me || this;
		var tips = tips[1];
		if (tips){
			var tipContaienr = me.find("span.form-error-tips");
			tipContaienr.html(tips).fadeIn(150);
		};
		return me;
	},
	setNormal: function(me){
		var me = me || this,
			obj = me.get(0),
			fields = obj.fields;
		for (var index = 0; index < fields.length; index++){
			var field = fields[index];
			if (field){
				var	name = field.name,
					mapping = field.mapping || name;
				if (name){
					var	input = me.find("[name="+name+"]");
					if (input.length != 0){
						var xtype = input.get(0).xtype;
						if (xtype){
							input[xtype]("setNormal");
						};
					}
				};
			};
		};
		var tipContaienr = me.find("span.form-error-tips");
		tipContaienr.css("display", "none");
		return me;
	},
	showLoading: function(me){
		var me = me || this,
			obj = me.get(0),
			submitBtn = $(obj.submitBtn);

		submitBtn.button("disable");
		//submitBtn.closest("div.form-submit").find("span.loading").fadeIn(50);

		return me;
	},
	hideLoading: function(me){
		var me = me || this,
			obj = me.get(0),
			submitBtn = $(obj.submitBtn);

		submitBtn.button("enable");
		//submitBtn.closest("div.form-submit").find("span.loading").fadeOut(50);

		return me;
	},
	enable: function(me, callback){
		var me = me || this,
			obj = me.get(0),
			submitBtn = $(obj.submitBtn),
			fields = obj.fields,
			callback = callback[1];

		for (var index = 0, len = fields.length; index < len; index++){
			var field = fields[index];
			if (field){
				var name = field["name"];
				var tar = me.find("[name=\""+name+"\"]");
				if (tar.length > 0){
					var xtype = tar.get(0).xtype;
					if (xtype && (tar.prop("inFront") != "no")){
						tar[xtype]("enable");
					};
				};
			};
		};

		if (submitBtn.length > 0){
			submitBtn.button("enable");
		};

		if (callback){
			callback.call(me);
		};
		return me;
	},
	disable: function(me, callback){
		var me = me || this,
			obj = me.get(0),
			submitBtn = $(obj.submitBtn),
			fields = obj.fields,
			callback = callback[1];

		for (var index = 0, len = fields.length; index < len; index++){
			var field = fields[index];
			if (field){
				var	name = field["name"];
				var tar = me.find("[name=\""+name+"\"]");
				if (tar.length > 0){
					var xtype = tar.get(0).xtype;
					//console.log(xtype, tar, name);
					if (xtype && (tar.prop("inFront") != "no")){
						tar[xtype]("disable");
					};
				};
			};
		};

		if (submitBtn.length > 0){
			submitBtn.button("disable");
		};

		if (callback){
			callback.call(me);
		};

		return me;
	}
});
})(jQuery);
