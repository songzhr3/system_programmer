// JavaScript Document
(function($){
/*
interface text{

}
*/
//$.fn.text = function(options){
$.su.Widget("textbox", {
	defaults: {
		/*value: "",*/
		/*name: "",*/

		readOnly: false,
		//isdisabled: true,	//目前只在readOnlytrue后生效。

		isvalid: false,

		fieldLabel: "",

		tips: "",
		hint: "",
		validator: null,
		invalidText: $.su.CHAR.VTYPETEXT.INVALIDTEXT,
		vtype: null,
		vtypeText: null,
		allowBlank: true,
		blankText: $.su.CHAR.VTYPETEXT.BLANKTEXT,
		cls: "",
		validateIcon: false,
		defaultLength: 50,
		textFormat: null,
		allowChunk: false,

		//数据预处理函数
		setValueCb: null,
		getValueCb: null,

		autoTrim: true
	},

	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var input = $(this);
			if (!input.is("input")){
				//console.error("only input tag can be inited as textbox!");
				return null;
			};
			$.extend(this, defaults, options);
			//console.log(input)

			var id = options.id || this.id || $.su.randomId("textbox"),
				value = options.value || input.val() || input.attr("value") || defaults.value,
				name = options.name || input.attr("name") || this.name || defaults.name;
			//console.log(id, value, name)
			//重新初始化属性
			$(this).attr({
				value: value,
				id: id,
				name: name
			}).val(value).addClass("text-text "+this.inputCls);

			if(this._maxLength){
				$(this).attr("maxlength", this._maxLength);
			}else{
				$(this).attr("maxlength", this.defaultLength);
			}

			var inHTML = 	"<div class=\"container widget-container text-container "+this.cls+"\">";

			if (this.allowChunk){
				//inHTML +=		"<div class=\"checkbox-group-container grid-header-checkbox checkcolumn inline\">";
				inHTML +=		"<div class=\"widget-checkbox-wrap\">";
				inHTML +=			"<label class=\"checkbox-label\">";
				inHTML +=				"<input class=\"checkbox-checkbox hidden\" type=\"checkbox\" value=\"\"/>";
				inHTML +=				"<span class=\"icon\"></span>";
				inHTML +=			"</label>";
				inHTML +=		"</div>";
				//inHTML +=		"</div>";
			}

			if (this.fieldLabel !== null){
				inHTML +=		"<div class=\"widget-fieldlabel-wrap "+this.labelCls+"\">";
				inHTML +=			"<label class=\"widget-fieldlabel text-fieldlabel\">"+this.fieldLabel+"</label>";
				if (this.fieldLabel !== ""){
					inHTML +=		"<span class=\"widget-separator\">"+this.separator+"</span>";
				};
				inHTML +=		"</div>";
			};

				inHTML +=		"<div class=\"widget-wrap-outer text-wrap-outer\">";
				inHTML +=			"<div class=\"widget-wrap text-wrap\">";
				inHTML +=				"<span class=\"text-wrap\"></span>";

			if (this.hint){
				inHTML +=				"<span class=\"hint text-hint\">";
				inHTML +=					"<input class=\"text-hint\" value=\""+this.hint+"\" tabindex=\"-1\" contenteditable=\"false\" readonly=\"readonly\"/>";
				inHTML +=				"</span>";
			};

				inHTML +=			"</div>";

			if (this.validateIcon){
				inHTML +=			"<span class=\"widget-validate-icon\"></span>";
			};

			if (this.tips != null && this.tips != undefined){
				inHTML +=			"<div class=\"widget-tips textbox-tips "+this.tipsCls+"\">";
				inHTML +=				"<div class=\"content tips-content\"></div>";
				inHTML +=			"</div>";
			};

				inHTML +=			"<div class=\"widget-error-tips textbox-error-tips "+this.errorTipsCls+"\">";
				inHTML +=				"<span class=\"widget-error-tips-delta\"></span>";
				inHTML +=				"<div class=\"widget-error-tips-wrap\">";
				inHTML +=					"<div class=\"content error-tips-content\"></div>";
				inHTML +=				"</div>";
				inHTML +=			"</div>";

				// inHTML +=		"<div class=\"widget-tips textbox-tips "+obj.tipsCls+"\">";
				// inHTML +=			"<div class=\"content tips-content\"></div>";
				// inHTML +=		"</div>";
				inHTML += 		"</div>";
				inHTML += 	"</div>";

			var container = $(inHTML);
			//避免嵌套添加
			if (input.parent("span.text-wrap").length == 0){
				input.replaceWith(container);
				container.find("span.text-wrap").append(input.addClass(this.allowChunk?"chunk":""));
			}

			if (this.vtype){
				var vtype = this.vtype;

				if (this.vtypeText){
					this.vtype.vtypeText = this.vtypeText;
				};

				this.vtype = new $.su.vtype(vtype);
				this.vtype.vtype = vtype;
			};

			if (this.readOnly){
				container.addClass("read-only");
				$(this).attr("readOnly", true);
				/*if (this.isdisabled){
					$(this).prop("disabled", true);
				};*/
			};
		});

		//事件监听
		/*me.find("div.widget-container").bind("focus", function(){
			$(this).text("setFocus");
		});
		me.bind("keyup blur", function(){
			$(this).text("validate");
		});
		me.bind("validatechange", function(e, isvalid){
			if (isvalid){
				me.text("setNormal");
			}else{
				me.text("setError");
			};
		});*/

		var container = me.closest("div.widget-container");
		container.delegate("input.text-text", "click", function(e){
			e.stopPropagation();
		}).delegate("input.text-text", "focus", function(e){
			var isReadOnly = container.find("input").attr("readOnly");
			if( isReadOnly != "readonly"){
				container.find("input.text-hint").fadeOut(50);
			}

			$(this).textbox("setFocus");
		}).delegate("input.text-text", "blur", function(e){
			$(this).textbox("validate");
		}).delegate("input.text-text", "keyup", function(e){
			var isReadOnly = container.find("input").attr("readOnly");
			if( isReadOnly != "readonly"){
				if($(this).val().length >= $(this).attr("maxlength")){
					if($(this).attr("overflow") == "true"){
						$(this).textbox("setError", $.su.CHAR.VTYPETEXT.MAX_LENGTH);
					}else{
						$(this).attr("overflow", "true");
					}

				}else{
					$(this).attr("overflow", false);
				}
				$(this).trigger("ev_change", [$(this).val(), e.key, e.keyCode]);
			}
		}).delegate("input.text-text", "setValue", function(e){
			//console.log("setValue occured");
			$(this).textbox("validate");
		}).delegate("input.text-text", "blur", function(e){
			//e.stopPropagation();
			var o = $(this);
			var	value = this.autoTrim ? $.trim(o.val()) : o.val();

			o.val(value);

			o.textbox("removeFocus");
			if (!value){
				container.find("input.text-hint").css({
					"display": "inline"
				});
			};
		}).delegate("input.text-text", "ev_validatechange", function(e, isvalid, tips){
			e.stopPropagation();
			if (isvalid){
				$(this).textbox("setValid");
			}else{
				$(this).textbox("setError", tips);
			};
			//$(this).textbox("setTips", tips);
		}).delegate("input.text-hint", "focus click", function(e){
			e.preventDefault();
			var isReadOnly = container.find("input").attr("readOnly");
			if( isReadOnly != "readonly"){

				$(this).fadeOut(50, function(e){
					me.focus();
				});
			}
		}).delegate("input.checkbox-checkbox", "click", function(e){
			if ($(this).is(":checked")){
				//$(this).addClass("selected");
				$(this).closest("div.text-container").find("input.chunk").textbox("enable");
			}else{
				$(this).closest("div.text-container").find("input.chunk").textbox("disableNoCheckbox");//checkbox需一直生效
				//$(this).removeClass("selected");
			}
			//console.log("checkbox click.")
		});

		setTimeout(function(){	//修正因为浏览器记住密码产生的bug
			if (me.val() !== ""){
				container.find("input.text-hint").css("display", "none");
			};
		}, 100);

		me.textbox("setTips", options.tips);

		return me;
	},
	validate: function(me, flag){
		var me = me || this,
			tar = me.get(0),
			flag = (flag[1] === false) ? false : true;

		var result = false,
			value = tar.autoTrim ? $.trim(tar.value) : tar.value;

		if ($.type(tar.textFormat) == "function"){
			value = tar.textFormat(value);
			$(tar).val(value);
		};

		//console.log(value, value.length);
		var returnResult = function(tar, resultText, val){
			if (resultText === true){
				if (flag){
					//console.log(tar)
					$(tar).trigger("ev_validatechange", [true, tar.tips]);
				};
				return true;
			}else{
				if (!resultText){
					resultText = tar.tips;
					//console.log("textbox no error tips!", tar.name);
				};
				if (flag){
					$(tar).trigger("ev_validatechange", [false, resultText]);
				};
				return false;
			};
		};

		if (tar){
			//空白验证
			if (value === ""){
				if (tar.allowBlank !== true){
					result = false;
					return returnResult(tar, tar.blankText);
				}else{
					result = true;
					return returnResult(tar, true);
				};
			}else{
			/*
				if (!$.su.unicode.lengthCheck(value, tar._minLength, tar._maxLength)){
					result = false;
					return returnResult(tar, tar.invalidText);
				};
			*/

				//vtype验证
				var vtype = tar.vtype;
				if (vtype && vtype.isVtype === true){
					result = vtype.validate(value);

					//console.log("t, result")
					if (result !== true){
						if (result === false){
							return returnResult(tar, vtype.vtypeText);
						}else{
							return returnResult(tar, result);
						};
					};
				};

				//validator验证
				if (tar.validator){
					result = tar.validator(tar.value);
					if ($.type(result) !== "boolean"){
						//result = false;
						return returnResult(tar, result);
					};
					if (result !== true){
						return returnResult(tar, tar.invalidText);
					};
				};
				if(vtype && vtype.vtype == "mac"){
					value = value.toUpperCase();
					$(tar).val(value);
				}
				else if (vtype && (vtype.vtype == "ipv6" || (typeof(vtype.vtype) == "object" && vtype.vtype.vtype == "ipv6"))) {
					$(tar).val($.su.func.ipv6Simplyfy(value));
				}
				else if (vtype && vtype.vtype){
					var t_vtype = vtype.vtype;
					if(typeof(t_vtype) == "object")t_vtype = t_vtype.vtype;
					if(t_vtype == "ip_all" || t_vtype == "string_ip_all_domain" || t_vtype == "string_ip_all_domain_no_loop" || t_vtype == "ip_domain_all_no_loop") {
						if($.su.func.isIpv6(value)){
							$(tar).val($.su.func.ipv6Simplyfy(value));
						}
					}
				}
			};

			//me.val(value);
			return returnResult(tar, true);
		};

		return result;
	},
	disable: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.addClass("disabled");
		container.find("input.checkbox-checkbox").addClass("disabled").prop("disabled", true);
		me.prop("disabled", true);

		return me;
	},
	disableNoCheckbox: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.addClass("disabled");
		container.find("input.checkbox-checkbox").removeClass("disabled");
		me.prop("disabled", true);

		return me;
	},
	enable: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.find("input.checkbox-checkbox").removeClass("disabled").prop("disabled", false);
		container.removeClass("disabled");
		me.prop("disabled", false);

		return me;
	},
	disableStyle: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.addClass("disabled");
		container.find("input").attr("readOnly",true);
		return me;
	},
	enableStyle: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.removeClass("disabled");
		container.find("input").attr("readOnly",false);
		return me;
	},
	setReadonly: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.addClass("read-only");
		me.attr("readonly", 'readonly');


		return me;
	},
	removeReadonly: function(me){
		var me = me || this,
			container = me.textbox("getContainer");

		container.removeClass("read-only");
		me.removeAttr("readonly");

		return me;
	},
	setTitle: function(me, _value){
		var me = me || this,
			obj = me.get(0),
			value = _value[1];

		if (value){
			obj.title = value;
		};

		return me;
	},
	setMaxLength:function(me, _value){
		var me = me || this,
			obj = me.get(0),
			value = _value[1],
			old_value = me.textbox("getValue");

		if (value){
			$(obj).attr("maxlength", value);
			//cut-off if value exceed new size
			if('string' == typeof(old_value) && old_value.length > value){
				me.textbox("setValue", old_value.substring(0,value));
			}
		};

		return me;
	},
	setValue: function(me, _value){
		var me = me || this,
			obj = me.get(0),
			value = _value[1],
			hint = me.closest("div.text-container").find("span.hint");

		/*if (obj && obj.hint){
			hint.css("display", "none");
		};*/

		me.attr("snapshot", value);
		//$(obj).trigger("ev_setValue", [value]);
		//console.log(22);
		//me.trigger("ev_setValue", [value]);
		//console.log(33);
		if (value === "" || value === undefined || value === null){
			me.val("");
			if (obj && obj.hint){
				hint.css("display", "block");
			};
		}else{
			if (obj && obj.setValueCb)
			{
				me.val(obj.setValueCb(value));
			}
			else
			{
				me.val(value);
			}
			if(me.val() && me.attr("maxlength") && me.val().length >= me.attr("maxlength")){
				me.attr("overflow", "true");
			}else{
				me.attr("overflow", false);
			}
			if (obj && obj.hint){
				hint.css("display", "none");
			};
		};

		return me;
	},
	getValue: function(me){
		var me = me || this,
			obj = me.get(0);

		if (obj && obj.getValueCb)
		{
			return obj.getValueCb(me.val());
		}
		else
		{
			return me.val();
		}
	},
	getContainer: function(me){
		var me = me || this;
		return me.closest("div.text-container");
	}
});

})(jQuery);