// JavaScript Document
(function($){

$.su.Widget("waitingbar", {
	defaults: {
		text:"",
		fieldLabel: "请稍后",
		timeout: 0,
		url: "",
		fn: null,	//function
		widgetName: "waitingbar",
		barWidth:null,
		barHeight:8,
		innerWidth:50,
		innerHeight:8,
		isRunning:false,
		interval:0,
		waitTime:40 // 开始检查设备是否已经重启完成的时间（单位：秒）
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var tar = $(obj);
			$.extend(obj, defaults, options);

			var width = $(obj).parents(".msg-container").width() - 35;
			obj.barWidth = obj.barWidth || width;

			var	inHTML = 	"<div class=\"container widget-container progressbar-container progressbar " +obj.cls+"\">";

			if (obj.fieldLabel !== null){
				inHTML +=		"<div class=\"widget-fieldlabel-wrap "+obj.labelCls+"\">";
				inHTML +=			"<label class=\"widget-fieldlabel processbar-fieldlabel\">"+obj.fieldLabel+"</label>";
				if (obj.fieldLabel !== ""){
					inHTML +=		"<span class=\"widget-separator\">"+obj.separator+"</span>";
				};
				inHTML +=		"</div>";
			};

				inHTML +=		"<div class=\"widget-wrap-outer progressbar-wrap-outer\" >";
				inHTML +=			"<div class=\"widget-wrap progressbar-wrap\">";
				inHTML +=				"<div class=\"widget-wrap progressbar-content\" style=\"width:"+ obj.barWidth + "px;height:" + obj.barHeight + "px;\">";
				inHTML +=					"<div class=\"progressbar-value\" style=\"width:"+ obj.innerWidth + "px;height:" + obj.innerHeight + "px;left:0;\"></div>"
				inHTML +=				"</div>";
				inHTML +=				"<div class=\"progressbar-text\">";

			if (obj.text != ""){
				inHTML +=					"<span class=\"progressbar-text\">" + obj.text + "</span>";
			};

				inHTML += 				"</div>";
				inHTML +=			"</div>";

			if (this.tips != null && this.tips != undefined){
				inHTML +=			"<div class=\"widget-tips textbox-tips "+obj.tipsCls+"\">";
				inHTML +=				"<div class=\"content tips-content\"></div>";
				inHTML +=			"</div>";
			};

				inHTML +=		"</div>";
				inHTML +=	"</div>";

			var container = $(inHTML);
			tar.replaceWith(container);
			container.append(tar.addClass("hidden"));
		});

		me.password("setTips", options.tips);
		return me;
	},
	run: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.closest("div.progressbar-container");

		var progressbarBox = container.find("div.progressbar-content"),
			progressbar = progressbarBox.children("div.progressbar-value"),
			percentageBox = container.find("span.progressbar-percentage");

		if(obj.isRunning){
			return me;
		}

		clearInterval(obj.interval);
		obj.interval = setInterval(function(){
			var currentLeft = progressbar.css("left").match(/\d*/);
			currentLeft = parseInt(currentLeft);
			if(currentLeft + obj.innerWidth + 1 <= obj.barWidth){
				progressbar.css("left", currentLeft + 1);
			}else{
				progressbar.css("left", 0);
			}

		}, 10);

		obj.isRunning = true;

		if(obj.timeout != 0){
			setTimeout(function(){
				me.waitingbar("stop");
				me.waitingbar("hide");
			}, obj.timeout);
		}

		return me;
	},
	runUntilReboot: function(me, param) {
		// 进度条开始滚动，直到设备重启完成后跳转到登录页面
		// 根据登录页面是否能访问判断设备是否启动成功
		// 如果执行这个函数之后需要阻止跳转到login一定要调用stop函数中断
		var me = me || this,
			obj = me.get(0);
			host = param[1];

		me.waitingbar("run");
		me.waitingbar("waitForReboot", obj.waitTime, host);
		return me;
	},
	waitForReboot: function(me, params) {
		// 设置时间，等待重启完成后跳转到登录页面
		// 如果之前设置了时间，会清除之前的计时器重新设置
		var me = me || this,
			obj = me.get(0);

		var wait_time = parseInt(params[1]);
		var host = params[2];
		var loginUrl = $.su.loginUrl;
		if (host)
			loginUrl = host + loginUrl;

		clearTimeout(obj._timeout);
		clearTimeout(obj._maxTimeout);
		obj._timeout = setTimeout(function() {
			var rebootInterval = setInterval(function(){
				$.ajax({
					url: $.su.loginUrl,
					async: true,
					dataType: "html",

					success: function(){
						clearInterval(rebootInterval);
						location.href= $.su.loginUrl;
					},
					error: function(){}
				});
			}, 1000);
		}, wait_time * 1000);

		// 如果超过了120秒机器还没有起来，就跳转到loginUrl
		obj._maxTimeout = setTimeout(function() {
			location.href= loginUrl;
		}, 120 * 1000);
	},
	reset: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.closest("div.progressbar-container");


		var progressbarBox = container.find("div.progressbar-content"),
			progressbar = progressbarBox.children("div.progressbar-value"),
			percentageBox = container.find("span.progressbar-percentage");



		progressbar.css("left", 0);

		if(!obj.isRunning){
			return me;
		}

		clearInterval(obj.interval);
		obj.interval = setInterval(function(){
			var currentLeft = progressbar.css("left").match(/\d*/);
			currentLeft = parseInt(currentLeft);
			if(currentLeft + obj.innerWidth + 1 <= obj.barWidth){
				progressbar.css("left", currentLeft + 1);
			}else{
				progressbar.css("left", 0);
			}

		}, 10);

		obj.isRunning = true;


		return me;
	},
	stop: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.closest("div.progressbar-container");


		var progressbarBox = container.find("div.progressbar-content"),
			progressbar = progressbarBox.children("div.progressbar-value"),
			percentageBox = container.find("span.progressbar-percentage");

		if(!obj.isRunning){
			return me;
		}

		clearInterval(obj.interval);
		clearTimeout(obj._timeout);
		clearTimeout(obj._maxTimeout);

		obj.isRunning = false;

		return me;
	},

	hide: function(me){
		var me = me || this,
			container = me.closest("div.progressbar-container");
		container.css("display", "none");
		return me;
	},
	show: function(me){
		var me = me || this,
			container = me.closest("div.progressbar-container");
		container.fadeIn(150);
		return me;
	}
});


})(jQuery);