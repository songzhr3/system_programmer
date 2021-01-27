// JavaScript Document
(function($){
	$.su.Widget("inputgroup", {
		defaults: {
			readOnly: false,

			isvalid: false,

			fieldLabel: "",
			tips: "",
			validator: null,
			invalidText: $.su.CHAR.VTYPETEXT.INVALIDTEXT,
			allowBlank: false,
			blankText: $.su.CHAR.VTYPETEXT.BLANKTEXT,
			cls: "",

			patialBlank:true,

			textFormat: null,

			autoTrim: true,

			// 第一个输入框占全部宽度的比例
			// 只支持0.25/0.5/0.75三种配置
			widthRatio: 0.5,
			inputPriConfig: {},
			inputSecConfig: {},
			splitChar: "/"
		},

		create: function(defaults, options){
			var me = this;
			me.each(function(i, obj){
				var input = $(this),
					inputPri = $('<input />'),
					inputSec = $('<input />');
				if (!input.is("input")){
					return null;
				};
				$.extend(this, defaults, options);

				var id = options.id || this.id || $.su.randomId("inputgroup"),
					value = options.value || input.val() || input.attr("value") || defaults.value,
					name = options.name || input.attr("name") || this.name || defaults.name;
				//重新初始化属性
				input.attr({
					name: name,
					id: id,
					value: value
				}).val(value).addClass("inputgroup-value hidden");

				var inputPriConfig = this.inputPriConfig;
				var inputSecConfig = this.inputSecConfig;

				inputPriConfig.vtype = inputPriConfig.vtype || "string";
				inputSecConfig.vtype = inputSecConfig.vtype || "string";

				inputPri.attr(inputPriConfig).addClass("text-text text-inputgroup-pri "+this.inputCls);
				inputSec.attr(inputSecConfig).addClass("text-text text-inputgroup-sec "+this.inputCls);

				var widthRatio = this.widthRatio || 0.25;
				// 第一个文本框的宽度占比
				if (widthRatio == 0.25) {
					inputPri.addClass("text-inputgroup-s");
					inputSec.addClass("text-inputgroup-l");
				}
				else if (widthRatio == 0.5) {
					inputPri.addClass("text-inputgroup-m");
					inputSec.addClass("text-inputgroup-m");
				}
				else {
					inputPri.addClass("text-inputgroup-l");
					inputSec.addClass("text-inputgroup-s");
				}

				var inHTML = 	"<div class=\"container widget-container text-container "+this.cls+"\">";

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
					inHTML +=			"</div>";
					inHTML +=			"<span>&nbsp;" + this.splitChar + "&nbsp;</span>";
					inHTML +=			"<div class=\"widget-wrap text-wrap\">";
					inHTML +=				"<span class=\"text-wrap\"></span>";
					inHTML +=			"</div>";

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

					inHTML += 		"</div>";
					inHTML += 	"</div>";

				var container = $(inHTML);
				input.replaceWith(container);
				container.find("span.text-wrap:eq(0)").append(inputPri);
				container.find("span.text-wrap:eq(1)").append(inputSec);
				container.append(input);


				if (this.readOnly){
					container.addClass("read-only");
					inputPri.prop("readOnly", true);
					inputSec.prop("readOnly", true);
				};
			});

			var container = me.closest("div.widget-container");
			container.delegate("input.text-text", "click", function(e){
				e.stopPropagation();
			}).delegate("input.text-text", "focus", function(e){
				me.inputgroup("setFocus");
			}).delegate("input.text-text", "blur", function(e){
				var $pri = me.inputgroup("getContainer").find(".text-inputgroup-pri"),
					$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
					tar = me.inputgroup("getContainer").find('input.inputgroup-value');

				var	valuePri = tar.get(0).autoTrim ? $.trim($pri.val()) : $pri.val(),
					valueSec = tar.get(0).autoTrim ? $.trim($sec.val()) : $sec.val();

				$pri.val(valuePri);
				$sec.val(valueSec);
				me.inputgroup("removeFocus").inputgroup("validate");
			}).delegate("input.text-text", "keyup", function(e){
				if($(this).val().length >= $(this).attr("maxlength")){
					if($(this).attr("overflow") == "true"){
						$(this).textbox("setError", $.su.CHAR.VTYPETEXT.MAX_LENGTH);
					}else{
						$(this).attr("overflow", "true");
					}

				}else{
					$(this).attr("overflow", false);
				}
				me.trigger("ev_change", [me.inputgroup("getValue")]);
			}).delegate("input.text-text", "setValue", function(e){
				me.inputgroup("validate");
			}).delegate("input.text-text", "ev_validatechange", function(e, isvalid, tips){
				e.stopPropagation();
				if (isvalid){
					me.inputgroup("setValid");
				}else{
					me.inputgroup("setError", tips);
				}
			});

			me.inputgroup("setTips", options.tips);

			return me;
		},
		validate: function(me, flag){
			var me = me || this,
				$pri = me.inputgroup("getContainer").find(".text-inputgroup-pri"),
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				tar = me.get(0),
				tarPri = $pri.get(0),
				tarSec = $sec.get(0),
				flag = (flag[1] === false) ? false : true;

			var result = false,
				valuePri = tar.autoTrim ? $.trim(tarPri.value) : tarPri.value,
				valueSec = tar.autoTrim ? $.trim(tarSec.value) : tarSec.value;

			var returnResult = function(resultText){
				if (resultText === true){
					if (flag){
						$pri.trigger("ev_validatechange", [true, tar.tips]);
					};
					return true;
				}else{
					if (!resultText){
						resultText = tar.tips;
					};
					if (flag){
						$pri.trigger("ev_validatechange", [false, resultText]);
					};
					return false;
				};
			};

			if (tarPri && tarSec){
				// 空白验证
				if (valuePri === "" && valueSec === ""){
					if (tar.allowBlank !== true){
						return returnResult(tar.blankText);
					}
					else {
						return true;
					}
				}

				// vtype验证
				var vtype = new $.su.vtype(tar.inputPriConfig);
				if (vtype && vtype.isVtype === true) {
					result = vtype.validate(valuePri);

					if (result !== true){
						if (result === false){
							return returnResult(vtype.vtypeText);
						}else{
							return returnResult(result);
						};
					};
				};

				vtype = new $.su.vtype(tar.inputSecConfig);
				if (vtype && vtype.isVtype === true) {
					result = vtype.validate(valueSec);

					if (result !== true){
						if (result === false){
							return returnResult(vtype.vtypeText);
						}else{
							return returnResult(result);
						};
					};
				};

				return returnResult(true);
			};

			return result;
		},
		disable: function(me){
			var me = me || this,
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri'),
				container = me.closest(".widget-container");

			container.addClass("disabled");
			me.prop("disabled", true);
			$pri.prop("disabled", true);
			$sec.prop("disabled", true);


			return me;
		},
		enable: function(me){
			var me = me || this,
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri'),
				container = me.closest(".widget-container");

			container.removeClass("disabled");
			me.prop("disabled", false);
			$pri.prop("disabled", false);
			$sec.prop("disabled", false);

			return me;
		},
		setReadonly: function(me){
			var me = me || this,
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri'),
				container = me.inputgroup("getContainer");

			container.addClass("read-only");
			me.attr("readonly", 'readonly');
			$pri.attr("readonly", 'readonly');
			$sec.attr("readonly", 'readonly');


			return me;
		},
		removeReadonly: function(me){
			var me = me || this,
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri'),
				container = me.inputgroup("getContainer");

			container.removeClass("read-only");
			me.removeAttr("readonly");
			$pri.removeAttr("readonly");
			$sec.removeAttr("readonly");

			return me;
		},
		setTitle: function(me, _value){
			var me = me || this,
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri');

			if (_value){
				if (_value[1])
					$pri.get(0).title = _value[1];
				if (_value[2])
					$sec.get(0).title = _value[2];
			};

			return me;
		},
		setValue: function(me, _value){
			var me = me || this,
				obj = me.get(0),
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri'),
				value = _value[1];


			me.attr("snapshot", value);
			if (value === "" || value === undefined || value === null || value.indexOf(obj.splitChar) == -1){
				me.val("");
				$sec.val("");
				$pri.val("");
			}else{
				var inputgroup = value.split(obj.splitChar);
				$pri.val(inputgroup[0]);
				$sec.val(inputgroup[1]);
				me.val(value);
			};

			return me;
		},
		getValue: function(me){
			var me = me || this,
				obj = me.get(0),
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri');

			me.val($pri.val() + obj.splitChar + $sec.val());
			if (me.val() == me.get(0).splitChar)
				return "";
			return me.val();
		},
		reset: function(me){
			var me = me || this,
				$sec = me.inputgroup("getContainer").find('.text-inputgroup-sec'),
				$pri = me.inputgroup("getContainer").find('.text-inputgroup-pri');

			me.val("");
			$sec.val("");
			$pri.val("");
		},
		getContainer: function(me){
			var me = me || this;
			return me.closest("div.text-container");
		}
	});

	})(jQuery);