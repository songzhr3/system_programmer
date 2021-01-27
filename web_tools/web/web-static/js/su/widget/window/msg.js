// JavaScript Document
(function($){


$.su.Widget("msg", {
	defaults: {
		type: "prompt", //alert, prompt, show, window
		cls: "xl",
		_title: "",
		autoshow: false,
		mask: true,
		msg: "",
		callback: null,
		okHandler: null,	//function
		noHandler: null,	//function
		cancelHandler: null,	//function
		closeBtn: true,
		global: false,
		search:false,
		// 对应的父级的grid，比如搜索按钮会关联一个grid，
		// 一般弹出msg的时候，grid不允许操作
		grid: null,

		okText: $.su.CHAR.OPERATION.OK,
		yesText: $.su.CHAR.OPERATION.YES,
		noText: $.su.CHAR.OPERATION.NO,
		cancelText: $.su.CHAR.OPERATION.CANCEL
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){

			if (this.isMsg){
				//已经初始化了，不再生成
				return;
			};

			var container = $(this);
			$.extend(this, defaults, options);
			if (this.global){
				if (!this.id){
					return null;
				};
			};
			this.id = this.id || $.su.randomId("msg");

			var	inHTML =	'';

			if (this.search){
				inHTML += "<div class=\"msg-header\">"
				if (this.closeBtn){
					inHTML +=		"<a class=\"widget-close msg-close\" href=\"javascript:void(0);\"></a>";
				};
				inHTML +=			"<h3 class=\"widget-title msg-search-title\">";//+this._title;
				inHTML +=				"<span class=\"msg-title-container\">"+this._title+"</span>";
				inHTML +=			"</h3>";
				inHTML += "</div>"
			}

				inHTML += 	"<div class=\"msg-wrap\">";

			if (this.closeBtn && !this.search){
				inHTML +=		"<a class=\"widget-close msg-close\" href=\"javascript:void(0);\"></a>";
			};

				inHTML +=		"<div class=\"msg-content-wrap\">";
			//if (this._title){
			var title = this._title || "";
				inHTML +=			"<h3 class=\"widget-title msg-title\">";
				inHTML +=				"<span class=\"msg-title-container\">"+ (this.search ? "" : title) +"</span>";
				inHTML +=			"</h3>";
			//};

			var content = this.msg || this.innerHTML;
				container.empty();

				inHTML +=			"<div class=\"widget-content msg-content-container\">"+content+"</div>";
				inHTML +=		"</div>";

			var type = this.type;
			switch (type){
				case "alert":
					inHTML +=	"<div class=\"msg-btn-container\">";
					inHTML +=		"<div class=\"msg-btn-wrap\">";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-ok btn-alert\">"
					inHTML +=					"<span class=\"text button-text\">"+this.okText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=		"</div>";
					inHTML +=	"</div>";

					break;
				case "confirm":
					inHTML +=	"<div class=\"msg-btn-container\">";
					inHTML +=		"<div class=\"msg-btn-wrap\">";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-ok btn-confirm\">"
					inHTML +=					"<span class=\"text button-text\">"+this.yesText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-no btn-confirm\">"
					inHTML +=					"<span class=\"text button-text\">"+this.noText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=		"</div>";
					inHTML +=	"</div>";

					break;
				case "prompt":
					inHTML +=	"<div class=\"button-container msg-btn-container\">";
					inHTML +=		"<div class=\"msg-btn-wrap\">";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-ok btn-prompt\">"
					inHTML +=					"<span class=\"text button-text\">"+this.okText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-cancel btn-prompt\">"
					inHTML +=					"<span class=\"text button-text\">"+this.cancelText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=		"</div>";
					inHTML +=	"</div>";
					break;
				/*case "wait":
					break;*/
				case "show":
					inHTML +=	"<div class=\"button-container msg-btn-container\">";
					inHTML +=		"<div class=\"msg-btn-wrap\">";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-cancel btn-show\">";
					inHTML +=					"<span class=\"text button-text\">"+this.cancelText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-no btn-show\">";
					inHTML +=					"<span class=\"text button-text\">"+this.noText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=			"<div class=\"button-container inline-block\">";
					inHTML +=				"<button type=\"button\" class=\"button-button btn-msg btn-msg-ok btn-show\">"
					inHTML +=					"<span class=\"text button-text\">"+this.yesText+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
					inHTML +=		"</div>";
					inHTML +=	"</div>";
					break;
				case "upgrade":
		    	    inHTML += '<div class="msg-btn-container" style="margin-bottom: 25px">';
				    inHTML += '<div class="msg-btn-wrap" style="text-align:center">';
				    inHTML += '<div class="button-container inline-block" style="margin:0px 25px">';
				    inHTML += '<button type="button" class="button-button btn-msg btn-msg-ok btn-confirm">';
				    inHTML += '<span class="text button-text">' + $.su.CHAR.OPERATION.UPGRADE + "</span>";
				    inHTML += "</button>";
				    inHTML += "</div>";
				    inHTML += '<div class="button-container inline-block" style="margin:0px 25px">';
				    inHTML += '<button type="button" class="button-button btn-msg btn-msg-no btn-confirm">';
				    inHTML += '<span class="text button-text">' + $.su.CHAR.OPERATION.CANCEL_UPGRADE + "</span>";
				    inHTML += "</button>";
				    inHTML += "</div>";
				    inHTML += "</div>";
				    inHTML += "</div>";
				    inHTML += '<div id="ignore" style="position:absolute;bottom:0px;right:10px">';
	        	    inHTML += '<input id="ignore_box"/>';
	    		    inHTML += '</div>';
					break;
				default:
					var buttonsCfg = this.buttons;
					if (buttonsCfg){
						//这里扩展自定义按钮的情况
					};
					break;
			};

				inHTML +=	"</div>";

			// for ie shadow
				inHTML =		'<div class="position-center-right">'+ inHTML +'</div>';
				inHTML =		'<div class="position-center-left">' + inHTML + '</div>';

				inHTML =		'<div class="position-top-right hidden"></div>' + inHTML;
				inHTML =		'<div class="position-top-center hidden"></div>' + inHTML;
				inHTML =		'<div class="position-top-left hidden"></div>' + inHTML;

				inHTML +=		'<div class="position-bottom-left"></div>';
				inHTML +=		'<div class="position-bottom-center"></div>';
				inHTML +=		'<div class="position-bottom-right"></div>';

			var msgBoxsContainer = $("div#msg-boxs-container");
			if (msgBoxsContainer.length == 0){
				msgBoxsContainer = $("<div id=\"msg-boxs-container\" class=\"msg-boxs-container\"></div>");
				$("body").append(msgBoxsContainer);
			};
			msgBoxsContainer.find("#"+obj.id).remove();
			msgBoxsContainer.append(container.detach());

			container.append($(inHTML)).addClass("container widget-container msg-container " + this.cls).css({
				"z-index": "999",
				"display": "none"
			});

			if (!this.search && typeof g_is_ie != "undefined" && g_is_ie == false){
				container.css("padding","9px");
			}

			this.isMsg = true;
			$.su.msgManager.add(this);
		});

		me.delegate("a.msg-close", "click", function(e){
			e.preventDefault();

            var container = $(this).closest("div.msg-container");
            container.msg("close", container.get(0).cancelHandler);
		}).delegate("button.btn-msg-ok", "click", function(e){
			e.preventDefault();

			var container = $(this).closest("div.msg-container");

			if (container.get(0).okHandler){
				if (container.get(0).okHandler.call(me) !== false){
					container.msg("close");
				};
			}else{
				container.msg("close");
			};

		}).delegate("button.btn-msg-no", "click", function(e){
			e.preventDefault();

			var container = $(this).closest("div.msg-container");
			container.msg("close", container.get(0).noHandler);

		}).delegate("button.btn-msg-cancel", "click", function(e){
			e.preventDefault();

			var container = $(this).closest("div.msg-container");
			container.msg("close", container.get(0).cancelHandler);
		});

		//me.draggable();

		if (me.get(0).autoshow){
			me.msg("show");
		};
		return me;
	},
	show: function(me, arguments){
		var me = me || this;
		var obj = me.get(0);
		var setCenter = arguments[1] || false;
		var additionalCss = arguments[2] || {};
		var overflow_x = me.get(0).overflow_x;
		var overflow_y = me.get(0).overflow_y;

		var container = $(this).closest("div.msg-container");

		var wh = $(window).height();
		var ww = $(window).width();

		if (obj.search){
			container.find("div.msg-wrap").css({
				"max-height": wh
			});
			container.find("div.msg-wrap").css(additionalCss);
		}else{
			container.css({
				"max-height": wh,
				"overflow-y": overflow_y!==undefined?overflow_y:"auto",
				"overflow-x": overflow_x!==undefined?overflow_x:"hidden"
			});
			container.css(additionalCss);
		}

		$(window).resize(function(){
		  	var wh = $(window).height();
			var ww = $(window).width();

			if (this.search){
				container.find("div.msg-wrap").css({
					"max-height": wh
				});
				container.find("div.msg-wrap").css(additionalCss);
			}else{
				container.css({
					"max-height": wh,
					"overflow-y": overflow_y!==undefined?overflow_y:"auto",
					"overflow-x": overflow_x!==undefined?overflow_x:"hidden"
				});
				container.css(additionalCss);
			}
		});

		me.msg("setPosition", "center", "center");

		me.each(function(){
			if (obj.isMsg === true){
				if (obj.mask && !obj.shown){
					$.su.mask.show();
				};
				obj.shown = true;
				$(this).fadeIn(200, function(){
					me.css("display", "block");
					me.trigger("ev_fade_in", me);

				});

			}else{
				return false;
			};
		});

		// 如果有父级grid，隐藏到遮蔽层后面
		if (obj.grid) {
			obj.grid.grid("behindMask");
		}

		me.trigger("ev_show", me);
		return me;
	},
	close: function(me, arguments){
		var me = me || this,
			obj = me.get(0);

		var callback = $.type(arguments[1]) === "function" ? arguments[1] : null,
			destroy = $.type(arguments[1]) === "boolean" ? arguments[1] : $.type(arguments[2]) === "boolean" ? arguments[2] : false;

		if (!obj.shown){
			return me;
		};

		if (obj.mask){
			$.su.mask.hide();
		};
		if (destroy){
			me.fadeOut(200, function(){
				this.shown = false;
				me.remove();
			});
		}else{
			me.fadeOut(200, function(){
				this.shown = false;
				me.css("display", "none");
			});
		};

		// 如果有父级grid，恢复到遮蔽层前面
		if (obj.grid) {
			obj.grid.grid("aheadMask");
		}

		me.trigger("ev_close", me);
		if (callback){
			return callback.call(me, me);
		}else{
			return me;
		};
	},
	setTitle: function(me, arguments){ //_title
		var me = me || this,
			obj = me.get(0),
			title = arguments[1];
		if (title){
			obj._title = title;
			me.find("span.msg-title-container").html(title);
		};
		return me;
	},
	setContent: function(me, arguments){ //_content可以是html代码！
		var me = me || this,
			text = arguments[1];
		if (text){
			me.find("span.msg-content-container").html(text);
		};
		return me;
	},
	showButtons: function(me){
		var me = me || this,
			buttonsContainer = me.find("div.msg-btn-container");

		buttonsContainer.fadeIn(150);

		return me;
	},
	hideButtons: function(me){
		var me = me || this,
			buttonsContainer = me.find("div.msg-btn-container");

		buttonsContainer.css("display", "none");

		return me;
	}
});

})(jQuery);