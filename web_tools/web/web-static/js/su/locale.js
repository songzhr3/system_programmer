(function($){
$.su = $.su || {};

$.su.url = function(url){
	var url = $.su.url.subs + $.su.url.stok + url;
	return url;
};
$.su.dsUrl = function(){
	var url = $.su.url.subs + $.su.url.stok + "/json_data.json";
	return url;
};

$.su.ozkerurl = function(url){
	var url = $.su.url.ozkersubs + $.su.url.stok + url;
	return url;
};

$.su.url.ozkersubs = "/cgi-bin/ozker/;stok=";

$.su.url.subs = ".";
/*$.su.url.stok = (function(){
	var stok = "12345",
		href = top.location.href;
	var stokPos = href.indexOf("stok=");
	if (stokPos >= 0){
		stok = href.substring(stokPos+5);
	};
	return stok;
})();*/

$.su.url.stok = "";

$.su.locale = {

	URL_LAN_CHECK: "./data/lan.json",

    DEFAULT_LAN_TYPE: "zh_CN",

    URL_JS: "../web-static/locale/%LAN_TYPE%/lan.js?random=20201217044300",
    URL_CSS: "../web-static/locale/%LAN_TYPE%/lan.css?random=20201217044300",
    URL_HELP: "../web-static/locale/%LAN_TYPE%/help.js?random=20201217044300",
    URL_SETTING: "../web-static/locale/%LAN_TYPE%/setting.js?random=20201217044300",

    locale: "zh_CN"
};

$.su.locale.get = function(callback_success, callback_failed){
    var me = this;

	//var URL_LAN_CHECK = this.URL_LAN_CHECK;
	var URL_LAN_CHECK = "";

	var URL_JS = this.URL_JS;
	var URL_CSS = this.URL_CSS;
	var URL_HELP = this.URL_HELP;
    var URL_SETTING = this.URL_SETTING;

    $.ajax({
    	type: "POST",
        url: URL_LAN_CHECK,
        async: false,
        dataType: "json",
        data:{
        	local:{name: "locale_info"},
            method:"get"
        },
        success: function(data){
        	if (data.error_code == 0 && data.locale_info){
        		$.su.locale.changeType(data.locale_info);
        	}else{
                $.su.locale.setDefault();
            };

            if (callback_success){
                callback_success.call(me);
            };
        },
        error: function(){
            $.su.locale.setDefault();
            if (callback_failed){
                callback_failed.call(me);
            };
        }
    });
};
/* locale的set方法用于在页面修改语言种类，目前不会用到 */
$.su.locale.set = function(lanType, callback_success, callback_failed){
    var me = this;
	if (!lanType){
		return;
	}

	var URL_LAN_CHECK = this.URL_LAN_CHECK;

	var URL_JS = this.URL_JS;
	var URL_CSS = this.URL_CSS;
	var URL_HELP = this.URL_HELP;
    var URL_SETTING = this.URL_SETTING;

    $.ajax({
    	type: "POST",
        url: URL_LAN_CHECK,
        async: false,
        dataType: "json",
        cache: false,
        data:{
        	"operation": "write",
        	"locale": lanType
        },
        success: function(data){
        	location.reload();
            if (callback_success){
                callback_success.call(me);
            };
        },
        error: function(){
            $.su.locale.setDefault();
            if (callback_failed){
                callback_failed.call(me);
            };
        }
    });
};
$.su.locale.changeType = function(data){
	var lanType = data.locale || this.DEFAULT_LAN_TYPE,
        force = data.force === true ? true : false,
        model = data.model || "",
        region = data.region || "";

	var URL_JS = this.URL_JS.replace("%LAN_TYPE%", lanType);
	var URL_CSS = this.URL_CSS.replace("%LAN_TYPE%", lanType);
	var URL_HELP = this.URL_HELP.replace("%LAN_TYPE%", lanType);
    var URL_SETTING = this.URL_SETTING.replace("%LAN_TYPE%", lanType);

    this.locale = lanType;
    this.force = force;
    this.model = model;

	$("script#lan-js").remove();
	$("link#lan-css").remove();
	$("script#lan-help").remove();
    $("script#lan-setting").remove();
	$("head").append("<script id=\"lan-js\" type=\"text/javascript\" src=\""+URL_JS+" \"></script>");
	$("head").append("<link id=\"lan-css\" type=\"text/css\" rel=\"stylesheet\" href=\""+URL_CSS+" \"/>");
	$("head").append("<script id=\"lan-help\" type=\"text/javascript\" src=\""+URL_HELP+" \"></script>");
    $("head").append("<script id=\"lan-setting\" type=\"text/javascript\" src=\""+URL_SETTING+" \"></script>");
    $("head").append("<script type=\"text/javascript\" src=\"../web-static/locale/language.js\" ></script>");
    //console.log("this", this)
};

$.su.locale.setDefault = function(){
	this.changeType({
        "locale": this.DEFAULT_LAN_TYPE,
        "force": false,
        "model": "",
        "region": ""
    });
};

})(jQuery);