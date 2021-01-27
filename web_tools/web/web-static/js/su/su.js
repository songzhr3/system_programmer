// JavaScript Document
(function($){
$.su = $.su || {};

$.su.isLocal = /^file:/.test(location.protocol);
$.su.loginUrl = $.su.isLocal && "./login.htm" || "/login.htm";

$.su.func = {};
$.su.func.breakWordWithLen = function(str, len){
	if(typeof str != "string")
	{
		return str;
	}
	if(str.length <= len)
	{
		return str;
	}
	else
	{
		var subStr =  str.substring(0, len);
		var result = subStr + "...";

		return result;
	}

};

$.su.func.changeUnit = function(value){
	var result = value;
	if(value >= 1000*1000*1000)
	{
		result = (result/(1000*1000*1000)).toFixed(3)+"G";
	}
	else if(value >= 1000*1000)
	{
		result = (result/(1000*1000)).toFixed(3)+"M";
	}
	else if(value >= 1000)
	{
		result = (result/(1000)).toFixed(3)+"K";
	}
	return result;

};

$.su.func.ipToInt = function(ip){
	var patternIp = /^\s*[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\s*$/;
    var ipArray = ip.split(".");

    if(ipArray.length != 4){
        return -1;
    }

    if(!patternIp.test(ip)){
        return -1;
    }

    return (Number(ipArray[0])*(1<<24)+(Number(ipArray[1])<<16 |Number(ipArray[2])<<8 |Number(ipArray[3])));
};

$.su.func.intToIp = function(int_ip){
    var str_ip = ((int_ip>>24)&0xff) + "." + ((int_ip>>16)&0xff) +"." + ((int_ip>>8)&0xff)+ "." + ((int_ip)&0xff);
    return str_ip;
};

$.su.func.isSameNet = function(ip1, ip2, mask){
	if(ip1 == ""){
        return false;
    };

    var ipToInt = $.su.func.ipToInt;

    var intIp1 = ipToInt(ip1);
    var intIp2 = ipToInt(ip2);
    var intMask = ipToInt(mask);

    if(intMask == 0){
    	return false;
    }

    /*if(((intIp1&intMask)!=(intIp2&intMask)) || ((intIp1&0xffffffff)==(intIp2&intMask))||((intIp1&(~intMask))==(~intMask))){
        return false;
    };*/

    if ((intIp1&intMask)!=(intIp2&intMask)){
    	return false;
	}
    return true;
};

$.su.func.isHostIp = function(ip1, ip2, mask){
	if(ip1 == ""){
		return false;
	};

	var ipToInt = $.su.func.ipToInt;

	var intIp1 = ipToInt(ip1);
	var intIp2 = ipToInt(ip2);
	var intMask = ipToInt(mask);

	if(intMask == 0) {
		return false;
	};


	if( (intIp1&0xffffffff)!=(intIp2&intMask) ){
		return false;
	};

	return true;
};

$.su.func.isNetIp = function(ip, mask){
	var ipToInt = $.su.func.ipToInt;

    if(!ip){
		return false;
	};
	var ipint = ipToInt(ip);
	var maskint = ipToInt(mask);

	if(0x00000000 == (ipint & (~maskint))){
		return true;
	};

	return false;
};

$.su.func.isNetIpLegal = function(ip, mask){
	var ipToInt = $.su.func.ipToInt;

	if (!ip){
		return false;
	};

	var ipint = ipToInt(ip);
	var maskint = ipToInt(mask);
	var res = ipint & maskint;

	if (res == 0x00000000 || res == maskint){
		return false;
	};

	return true;
}

$.su.func.isBroadCastIp = function(ip, mask){
	var ipToInt = $.su.func.ipToInt;

	if(!ip){
		return false;
	};

	var ipint = ipToInt(ip);
	var maskint = ipToInt(mask);

	if(((ipint & (~maskint)) == (~maskint))){
		return true;
	};

	return false;
};

$.su.func.logicOr = function(int_a, int_b){
	var binary_a = parseInt(int_a,10).toString(2);
	var binary_b = parseInt(int_b,10).toString(2);
	var len = (binary_a.length > binary_b.length) ? binary_a.length : binary_b.length;
	if (len != 32)
	{
		return int_a|int_b;
	}

	var cut = Math.abs(binary_a.length - binary_b.length);
	var temp = '';
	for (var i = 0 ; i < cut; i++)
	{
		temp = temp + '0';
	}

	if (binary_a.length > binary_b.length)
	{
		binary_b = temp + binary_b;
	}
	else
	{
		binary_a = temp + binary_a;
	}

	var res = 0;
	for (var i=len-1; i >= 0; i--)
	{
		if (binary_a.charAt(i)|binary_b.charAt(i) == 1)
		{
			if((len-1-i) > 24)
			{
				res = Number(res) + 256*Number((1<<(len-9-i)));
			}
			else
			{
				res = Number(res) + Number((1<<(len-1-i)));
			}
		}
	}
	return res;
},


$.su.func.ipContain = function(ip1, mask1, ip2, mask2){		// if ip1 contains ip2
	var ipToInt = $.su.func.ipToInt;
	var intToIp = $.su.func.intToIp;

	ip1StartIp = ipToInt( intToIp( ipToInt(ip1)&ipToInt(mask1) ))
	ip1EndIp = ipToInt( intToIp( $.su.func.logicOr( ipToInt(ip1), ~ipToInt(mask1) ) ));

	ip2StartIp = ipToInt( intToIp( ipToInt(ip2)&ipToInt(mask2) ))
	ip2EndIp = ipToInt( intToIp( $.su.func.logicOr( ipToInt(ip2), ~ipToInt(mask2) ) ));

	if (ip1StartIp <= ip2StartIp && ip2EndIp <= ip1EndIp)
	{
		return true;
	}

	return false;
};

$.su.func.getLimitIp = function(lanIP,lanMask,type){
	var ip_arr = lanIP.split(".");
	var mask_arr = lanMask.split(".");
	var ip_len = ip_arr.length;
	var mask_len = mask_arr.length;
	var return_arr = [];
	for(var i=0; i<ip_len; ++i){
		if(type == 'min'){
			return_arr.push(ip_arr[i] & mask_arr[i]);
		}
		else{
			var value = parseInt(mask_arr[i]);
			if(value < 128){
				return_arr.push( ip_arr[i] | ((( ~ value - 128 ) << 24 >> 24 ) + 128 ) );
			}
			else{
				return_arr.push( ip_arr[i] | ( ~ value << 24 >> 24 ) );
			}
		}
	}
	return return_arr.join(".");
};

$.su.func.escapeHtml = function(string){

	var r = string.toString();
		r = r.replace(/\&/g, "&amp;");
		r = r.replace(/\</g, "&lt;");
		r = r.replace(/\>/g, "&gt;");
		r = r.replace(/\"/g, "&quot;");

	return r;
};


$.su.func.showWidgets = function($list){
    if(!$list || !$list.length){
        return;
    }
    $list.each(function(i, o){
        $(o)[o.xtype]('enable')[o.xtype]('show');
    });
};

$.su.func.hideWidgets = function($list){
    if(!$list || !$list.length){
        return;
    }
    $list.each(function(i, o){
        $(o)[o.xtype]('disable')[o.xtype]('hide');
    });
};

$.su.func.enableWidgets = function($list){
    if(!$list || !$list.length){
        return;
    }
    $list.each(function(i, o){
        $(o)[o.xtype]('enable');
    });
};

$.su.func.disableWidgets = function($list){
    if(!$list || !$list.length){
        return;
    }
    $list.each(function(i, o){
        $(o)[o.xtype]('disable');
    });
};

$.su.func.isChinese = function(str) {
	return /[^\x00-\xff]/.test(str);
};

$.su.func.isIpv6 = function(val) {
	var vtype_ipv6 = $.su.vtype.types.ipv6;
	return vtype_ipv6.regex.test(val);
}

// 将完整格式的ipv6地址替换为简写模式的ipv6地址
$.su.func.ipv6Simplyfy = function(val) {
	if (!val) return "";
	if ($.su.func.isIpv6(val) == false) return val;

	var res = "";
	var resEle = [];
	var ip6Ele = val.split(":");
	var startPos = 0;
	var endPos = ip6Ele.length;
	var zeroNum = 9 - ip6Ele.length
	if(ip6Ele[startPos] == ""){
		startPos++;
		zeroNum++
	}
	if(ip6Ele[endPos] == ""){
		endPos--;
		zeroNum++
	}
	for(var i = startPos;i < endPos;i++){
		if(ip6Ele[i] != ""){
			ip6Ele[i] = ip6Ele[i].replace(/\b(0+)/gi,"").toLowerCase();
			if(ip6Ele[i] == "")ip6Ele[i] = "0";
			resEle.push(ip6Ele[i]);
		}else{
			for(var j = 0;j < zeroNum;j++)resEle.push("0");
		}
	}
	var zerePos = -1;
	var dupZero = 0;
	var maxZeroNum = 0;
	for(var i = 0;i < resEle.length;i++){
		if(resEle[i] != "0")dupZero = 0;
		else{
			dupZero++;
			if(dupZero > 1 && dupZero > maxZeroNum){
				maxZeroNum = dupZero;
				zerePos = i - maxZeroNum + 1;
			}
		}
	}
	if(zerePos == -1){
		for(var i = 0;i < resEle.length;i++){
			if(i == 0)res += resEle[i];
			else res += ":"+resEle[i];
		}
	}else{
		for(var i = 0;i < zerePos;i++){
			if(i == 0)res += resEle[i];
			else res += ":"+resEle[i];
		}
		res += "::";
		for(var i = zerePos + maxZeroNum;i < resEle.length;i++){
			if(i == zerePos + maxZeroNum)res += resEle[i];
			else res += ":"+resEle[i];
		}
	}
	return res;
}

$.su.vtype = function(options){
	var defaults = {
		type: "sample",
		regex: /^[a-zA-Z0-9]&/,
		vtypeText: "sample run!",
		validator: null
	};
	//$.extend(types, $.su.vtype);
	var name = "",
		opt = {};

	if ($.type(options) === "string"){
		name = options;
	}else if ($.type(options) === "object" && options.vtype){
		name = options.vtype;
		opt = options;
	};

	if (!$.su.vtype.types[name]){
		return null;
	}else{
		defaults = $.su.vtype.types[name];
	};

	$.extend(this, defaults, opt, {isVtype: true});
};
$.su.vtype.types = {
	email: {
		regex: /^(\w)+((\.){0,1}[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/,
		vtypeText: $.su.CHAR.VTYPETEXT.EMAIL
	},
	float_number: {
		regex: /^-?[0-9]\d*(.[0-9]\d{0,2})?$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NUMBER,
		validator: function(value){
			value = parseFloat(value);
			if (this.max !== null || this.max !== undefined){
				if (value > this.max){
					if (this.min !== null || this.min !== undefined)
					{
					      var str = $.su.CHAR.VTYPETEXT.NUMBER_MIN_MAX.replace("%min", this.min.toString()).replace("%max", this.max.toString());
						return str;
					}
					else
					{
						var str = $.su.CHAR.VTYPETEXT.NUMBER_MAX.replace("%max", this.max.toString());
						return 	str;
					}
				};
			};

			if (this.min !== null || this.min !== undefined){
				if (value < this.min){
					if (this.max !== null || this.max !== undefined)
					{
						var str = $.su.CHAR.VTYPETEXT.NUMBER_MIN_MAX.replace("%min", this.min.toString()).replace("%max", this.max.toString());
						return str;
					}
					else
					{
						var str = $.su.CHAR.VTYPETEXT.NUMBER_MIN.replace("%min", this.min.toString());
						return 	str;
						//return 	$.su.CHAR.VTYPETEXT.NUMBER_MIN.replace("%min", this.min.toString());
					}
				};
			};
			return true;
		}
	},
	number: {
		regex: /^-?[0-9]\d*$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NUMBER,
		validator: function(n){
			value = parseInt(n, 10);
			if(value != 0 && n[0] == '0')
			{
				return $.su.CHAR.VTYPETEXT.INVALIDTEXT;
			}
			if (this.max !== null || this.max !== undefined){
				if (value > this.max){
					if (this.min !== null || this.min !== undefined)
					{
					      var str = $.su.CHAR.VTYPETEXT.NUMBER_MIN_MAX.replace("%min", this.min.toString()).replace("%max", this.max.toString());
						return str;
					}
					else
					{
						var str = $.su.CHAR.VTYPETEXT.NUMBER_MAX.replace("%max", this.max.toString());
						return 	str;
					}
				};
			};

			if (this.min !== null || this.min !== undefined){
				if (value < this.min){
					if (this.max !== null || this.max !== undefined)
					{
						var str = $.su.CHAR.VTYPETEXT.NUMBER_MIN_MAX.replace("%min", this.min.toString()).replace("%max", this.max.toString());
						return str;
					}
					else
					{
						var str = $.su.CHAR.VTYPETEXT.NUMBER_MIN.replace("%min", this.min.toString());
						return 	str;
						//return 	$.su.CHAR.VTYPETEXT.NUMBER_MIN.replace("%min", this.min.toString());
					}
				};
			};

			return true;
		},
		keybordHandler: function(e){
			e.stopPropagation();
			var keyCode = e.keyCode,
				shiftKey = e.shiftKey,
				ctrlKey = e.ctrlKey;

			if (shiftKey){
				return false;
			};

			if (keyCode == 37 || keyCode == 39){
				return true;
			};

			if (keyCode == 38 || keyCode == 40){
				var input = $(this),
					_value = input.val();

				if ($.su.vtype.types.number.regex.test(_value)){
					if (keyCode == 38){
						var _maxValue = input.hasClass("hour-text") ? 23: 59;
						if (_value < _maxValue){
							input.val(parseInt(_value, 10)+1);
						}else{
							return false;
						};
					}else{
						if (_value == 0){
							return false;
						}else{
							input.val(parseInt(_value, 10)-1);
						}
					};
				}else{
					input.val(0);
				};
			};

			if (!ctrlKey){
				if ((keyCode < 48 || keyCode > 57) && keyCode > 32){
					return false;
				};
			};
		}
	},
	date:{
		//regex: /^[(0[0-9]{1})|(1[0,2]{1})]]$/,
		regex: /^([0-9]{4})\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])$/,
		vtypeText: $.su.CHAR.VTYPETEXT.DATE,
		validator:function(val)
		{
			//format:  yy/mm/dd

			var arr = val.split("/");
			if(parseInt(arr[0],10) < 1970)
			{
				return $.su.CHAR.VTYPETEXT.DATE_INVALID;
			}
			if(parseInt(arr[0],10) > 2030)
			{
				return $.su.CHAR.VTYPETEXT.DATE_INVALID;
			}
			if(1 == arr[1].length){
				arr[1] = "0" + arr[1];
			}
			if(1 == arr[2].length){
				arr[2] = "0" + arr[2];
			}
			var formatDate = arr[0] + "/" + arr[1] + "/" + arr[2];
			return (new Date(formatDate).getDate()==formatDate.substring(formatDate.length-2));
		}
	},
	// ip_domain:{
	// 	regex: /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$/,
	// 	vtypeText: $.su.CHAR.VTYPETEXT.IP_DOMAIN
	// },
	ipv6:{
		isPrefixFlag:false,
		regex: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
		vtypeText: $.su.CHAR.VTYPETEXT.IPV6,
		validator:function(val)
		{
		    var reg1 = new RegExp("^[2-3][0-9A-Fa-f]{3}:");
			if(!reg1.test(val))
			{
				return $.su.CHAR.VTYPETEXT.IPV6_NOT_GLOBAL;
			}

			var reg2 = /:/g;
			var arr =  val.match(reg2);
			if(this.isPrefixFlag)
			{
				if(arr.length > 5)
				{
					return $.su.CHAR.VTYPETEXT.IPV6_NOT_PREFIX;
				}
			}
			return true;
		}
	},
	ip: {
		//regex: /^[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}$/,
		//regex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
		allowAllZeroFlag:false,
		disallowAllZeroText: $.su.CHAR.VTYPETEXT.IP_NO_ALL_ZERO,
		allowLoopFlag:false,
		disallowLoopText: $.su.CHAR.VTYPETEXT.IP_NO_LOOP,
		allowDTypeFlag:false,
		disallowDTypeText: $.su.CHAR.VTYPETEXT.IP_NO_D_TYPE,
		allowETypeFlag:false,
		disallowETypeText: $.su.CHAR.VTYPETEXT.IP_NO_E_TYPE,
		allowAllOneFlag:false,
		disallowAllOneText: $.su.CHAR.VTYPETEXT.IP_NO_ALL_ONE,
		disallowFirstZeroFlag:true,
		disallowFirstZeroText: $.su.CHAR.VTYPETEXT.IP_NO_FIRST_ZERO,
		disallowFirstAllOneText: $.su.CHAR.VTYPETEXT.IP_NO_FIRST_ALL_ONE,
		//regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]|0\d\d)(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]|0\d\d)){3}$/,
		regex: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])){3}$/,
		validator: function(value){
			var ipStr = value;
			var szarray = [0,0,0,0];
			var remain;
			var i;
			for(i = 0; i < 3; i++)
			{
				var n = ipStr.indexOf('.');
				szarray[i] = ipStr.substring(0,n);
				remain = ipStr.substring(n+1);
				ipStr = remain;
			}
			szarray[3] = remain;
			for(i = 0; i < 4; i++)
			{
				if (szarray[i] < 0 || szarray[i] > 255)
				{
					return false;
				}
			}

			if(!this.allowLoopFlag)
			{
				if(szarray[0]==127)
				{
					return this.disallowLoopText;
				}
			}
			if(!this.allowDTypeFlag)
			{
				if(szarray[0] >= 224 && szarray[0] <=239)
				{
					return this.disallowDTypeText;
				}
			}
			if(!this.allowETypeFlag)
			{
				if(szarray[0] >= 240 && szarray[0] <=254)
				{
					return this.disallowETypeText;
				}
			}

			if(!this.allowAllOneFlag)
			{
				// if(szarray[0]==255)
				// {
				// 	return this.disallowAllOneText;
				// }
				if(szarray[0]==255 && szarray[1] ==255 && szarray[2] ==255 && szarray[3] ==255)
				{
					return this.disallowAllOneText;
				}
				if(szarray[0]==255)
				{
					return this.disallowFirstAllOneText;
				}
			}
			else
			{
				if(szarray[0]==255 && szarray[1] ==255 && szarray[2] ==255 && szarray[3] ==255)
				{

				}
				else
				{
					if(szarray[0]==255)
					{
						return this.disallowFirstAllOneText;
					}
				}
			}
			if(!this.allowAllZeroFlag)
			{
				if(szarray[0]==0 && szarray[1] ==0 && szarray[2] ==0 && szarray[3] ==0)
				{
					return this.disallowAllZeroText;
				}
			}

			if(this.allowAllZeroFlag && this.disallowFirstZeroFlag)
			{
				if(szarray[0]==0 && ( szarray[1] !=0 || szarray[2] !=0 || szarray[3] !=0 ) )
				{
					return this.disallowFirstZeroText;
				}
			}

			return true;
		},
		vtypeText: $.su.CHAR.VTYPETEXT.IP
	},
	ip_all: {
		regex: /^.+$/,
		includeLocalIpv6: false,
		validator:function(value){
			if(value == "0.0.0.0")return $.su.CHAR.VTYPETEXT.IP_NO_ALL_ZERO;
			if ($.su.vtype.types["ip"].regex.test(value) && $.su.vtype.types["ip"].validator(value) === true)
			{
				return true;
			}
			if ($.su.vtype.types["ipv6"].regex.test(value) && (this.includeLocalIpv6 || $.su.vtype.types["ipv6"].validator(value) === true))
			{
				return true;
			}
			return $.su.CHAR.VTYPETEXT.IP;
		},
		vtypeText: $.su.CHAR.VTYPETEXT.IP
	},
	ip_no_zero: {

	},
	ishex: {
		regex: /^[a-fA-F\d]/,
		vtypeText: $.su.CHAR.VTYPETEXT.HEX,
		validator: function(value){
			if (!this.regex.test(value)){
				return this.vtypeText;
			}
			return true;
		}
	},
	mac: {
		regex: /^[a-fA-F\d]{2}\-[a-fA-F\d]{2}\-[a-fA-F\d]{2}\-[a-fA-F\d]{2}\-[a-fA-F\d]{2}\-[a-fA-F\d]{2}$/,
		disallowAllMultiText: $.su.CHAR.VTYPETEXT.MULTI_MAC,
		validator: function(value){
			var patternMulti = /^\s*[0-9A-Fa-f]{1}[13579bdfBDF]{1}(\-[A-Fa-f0-9]{2}){5}\s*$/;
			var flag = patternMulti.test(value);
			if(flag)
			{
				return this.disallowAllMultiText;
			}

			var patternZero = /^(0{1,2}-){5}0{1,2}$/;
			if(patternZero.test(value))
			{

				return false;
			}

			return true;
		},
		vtypeText: $.su.CHAR.VTYPETEXT.MAC
	},
	netmask: {
		//regex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,
		allowAllOneFlag:false,
		disallowAllOneText: $.su.CHAR.VTYPETEXT.MASK_NO_ALL_ONE,
		allowAllZeroFlag:false,
		disallowAllZeroText: $.su.CHAR.VTYPETEXT.MASK_NO_ALL_ZERO,
		regex: /^255\.255\.255\.(255|254|252|248|240|224|192|128|0)$|^255\.255\.(254|252|248|240|224|192|128|0)\.0$|255\.(254|252|248|240|224|192|128|0)\.0\.0$|^(254|252|248|240|224|192|128|0)\.0\.0\.0$/,
		//regex: /^(255|254|252|248|240|224|192|128|0)(\.(255|254|252|248|240|224|192|128|0)){3}$/ ,
		vtypeText: $.su.CHAR.VTYPETEXT.MASK,
		validator: function(value){
			if(value == "255.255.255.255")
			{
				if(this.allowAllOneFlag)
				{
					return true;
				}
				else
				{
					return this.disallowAllOneText;
				}
			}
			if(value == "0.0.0.0")
			{
				if(this.allowAllZeroFlag)
				{
					return true;
				}
				else
				{
					return this.disallowAllZeroText;
				}
			}
			return true;
		}
	},
	string_ip_domain:{
		regex: /^[A-Za-z0-9\_\-]+\.{1,}/,
		vtypeText: $.su.CHAR.VTYPETEXT.STRING_DOMAIN,
		validator: function(value){
			var regex = /^\S+$/;
			if(!regex.test(value)){
				return $.su.CHAR.VTYPETEXT.STRING_DOMAIN;
			}
			return true;
		}
	},
	string_ip_all_domain:{
        regex: /^\S+$/,
        vtypeText: $.su.CHAR.VTYPETEXT.STRING_DOMAIN,
        validator: function(value){
            var regex = /^[A-Za-z0-9\_\-]+\.{1,}/;
            var regex_ipv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
            if(!regex.test(value) && !regex_ipv6.test(value)){
                return $.su.CHAR.VTYPETEXT.STRING_DOMAIN;
            }
            return true;
        }
	},
	string_ip_domain_no_loop:{
		regex: /^[A-Za-z0-9\_\-]+\.{1,}/,
		validator: function(value){
		 	if(value == '127.0.0.1'){
		 		return $.su.CHAR.ERROR["00000131"];
		 	}
		 	return true;
		 },
		vtypeText: $.su.CHAR.VTYPETEXT.STRING_DOMAIN
	},
	string_ip_all_domain_no_loop:{
		regex: /^\S+$/,
		validator: function(value){
		 	if(value == '127.0.0.1'){
		 		return $.su.CHAR.ERROR["00000131"];
		 	}
            var regex = /^[A-Za-z0-9\_\-]+\.{1,}/;
            var regex_ipv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
            if(!regex.test(value) && (!regex_ipv6.test(value) || $.su.vtype.types["ipv6"].validator(value) !== true)){
                return $.su.CHAR.VTYPETEXT.STRING_DOMAIN;
            }
            return true;
		 },
		vtypeText: $.su.CHAR.VTYPETEXT.STRING_DOMAIN
	},
	ip_domain:{
		regex: /^.+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.IP_DOMAIN,
		validator:function(value){
			if( $.su.vtype.types["ip"].regex.test(value) && $.su.vtype.types["ip"].validator(value) === true )
			{
				return true;
			}
			if( $.su.vtype.types["domain"].regex.test(value) )
			{

				return true;
			}
			return false;
		}
	},
	ip_domain_all:{
		regex: /^.+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.IP_DOMAIN,
		includeLocalIpv6: false,
		validator:function(value){
			var t_vtype = new $.su.vtype({vtype: "ip_all", includeLocalIpv6: this.includeLocalIpv6});
			if( t_vtype.validate(value) === true )
			{
				return true;
			}
			if( $.su.vtype.types["domain"].regex.test(value) )
			{
				return true;
			}
			return false;
		}
	},
	ip_domain_all_no_loop:{
		regex: /^.+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.IP_DOMAIN,
		validator:function(value){
		 	if(value == '127.0.0.1'){
		 		return $.su.CHAR.ERROR["00000131"];
		 	}
			if( $.su.vtype.types["ip_all"].regex.test(value) && $.su.vtype.types["ip_all"].validator(value) === true )
			{
				return true;
			}
			if( $.su.vtype.types["domain"].regex.test(value) )
			{
				return true;
			}
			return false;
		}
	},
	domain: {
		regex: /^(?=^.{3,255}$)([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.){1,9}([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)$/,
		vtypeText: $.su.CHAR.VTYPETEXT.DOMAIN
	},
	domain_more: {
		regex: /^(?=^.{3,255}$)([a-zA-Z0-9*]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.){1,9}([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)$/,
		vtypeText: $.su.CHAR.VTYPETEXT.DOMAIN
	},
	ascii_visible:{
		regex: /^[\x21-\x7e]+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.ASCII_VISIBLE
	},
	string_visible:{
		regex: /^\S+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.STRING_VISIBLE
	},
	string_visible_no_comma:{
		regex: /^\S+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.STRING_VISIBLE_NO_COMMA,
		validator: function(value){
			if(value.indexOf(",")>=0)
			{
				return false
			}
			return true;
		}
	},
	password:{
		regex: /^[A-Za-z0-9\`\~\!\@\#\$\&\*\(\)\-\=\_\+\[\]\{\}\;\:\'\"\\\|\/\?\.\,\<\>\%\^\/\ ]+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.PWD
	},
	string_visible_allow_blank:{
		regex: /^(\S|\x20)+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.STRING_VISIBLE_ALLOW_BLANK
	},
	string_visible_username: {
		regex: /^[A-Za-z0-9\`\~\!\@\#\$\&\*\(\)\-\=\_\+\[\]\{\}\;\:\'\"\\\|\/\?\.\,\<\>\%\^\/\ ]+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.SSID
	},
	name:{
		regex: /^[A-Za-z0-9\_]+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NAME
	},
	name_special:{
		regex: /^[A-Za-z0-9\_]+$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NAME,
		validator: function(value){
			if(value.length < 4){
				return false;
			}
			return true;
		}
	},
	name_with_special_start:{
		regex: /^[a-zA-Z_]/,
		vtypeText: $.su.CHAR.VTYPETEXT.NAME_START
	},
	name_in_vpn:{
		regex: /^[a-zA-Z_][A-Za-z0-9\_\-]{0,14}$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NAME
	},
	pwd_in_vpn:{
		regex: /^[A-Za-z0-9\_\-]{1,15}$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NAME
	},
	note: {
		regex: /^[A-Za-z0-9\`\~\!\@\#\$\%\^\&\*\(\)\-\=\_\+\[\]\{\}\;\:\'\"\\\|\/\?\.\,\<\>\ ]*$/,
		vtypeText: $.su.CHAR.VTYPETEXT.NOTE
	},
	update_period:{
		validator: function(value){
			if(value == 0) return true;

			var reg = /^[1-9][0-9]*$/
			if(value.match(reg)){
				return true;
			}else{
				return false;
			}
		}
	},
	strange_pwd: {
		validator: function(value){
			if(value.length < 8 || value.length > 64){
				return $.su.CHAR.VTYPETEXT.PASSWORD;
			}

			if(value.length == 64){
				var reg = /^[A-Fa-f0-9]{64}$/
				if(value.match(reg)){
					return true;
				}else{
                    return $.su.CHAR.VTYPETEXT.PASSWORD;
				}
			}
			return true;
		}
	},
    string_wireless_name: {
        validator: function(value){
            var invalidChar = /[\+\#\&\=\|\<\>\^]/g;
            if($.su.unicode.getUtf8Length(value) > 32){
                return $.su.CHAR.VTYPETEXT.WIRELESS_NAME;
            }
            if(invalidChar.exec(value)){
                return $.su.CHAR.VTYPETEXT.WIRELESS_NAME;
            }
            return true;
        }
	},
	string: {}
};
$.su.vtype.prototype.validate = function(value){
	var resultVal = true;
	var resultReg = true;

	if (this.regex){
		resultReg = this.regex.test(value);
		if (resultReg !== true){
			return this.vtypeText;
		};
	};

	if (this.validator){
		resultVal = this.validator(value);
		if (resultVal !== true){
			return resultVal;
		};
	};

	return true;
};

$.su.clearAttrAll = function(obj){
	var obj = $(obj);

	obj.removeAttr("id");
	obj.removeAttr("name");
	obj.removeAttr("class");
};
$.su.clone = function(obj){
	var type = Object.prototype.toString.call(obj);
	switch (type){
		case "[object Array]":
			var result = [];
			for (var index = 0; index < obj.length; index++){
				result[index] = $.su.clone(obj[index]);
			};
			return result;
			break;
		case "[object Object]":
			var result = {};
			for (var index in obj){
				result[index] = $.su.clone(obj[index]);
			};
			return result;
			break;
		case "[object Function]":
			return obj;
			break;
		case "[object String]":
			var result = obj;
			return result;
			break;
		case "[object Number]":
			var result = obj;
			return result;
			break;
		case "[object Boolean]":
			if (!obj){
				return false;
			}else{
				return true;
			}
			break;
		default:
			return undefined;
			break;
	};
};

$.su.format = {
	stringFormat: function(str){
		return str.toString();
	},
	intFormat: function(intD){
		if( !isNaN(parseInt(intD)) ){
			return parseInt(intD, 10);
		}
		else{
			return intD;
		}
	},
	floatFormat: function(floatV){
		if( !isNaN(parseFloat(floatV)) ){
			return parseFloat(floatV);
		}
		else{
			return floatV;
		}
	},
	booleanFormat: function(bool){
		if (!bool){
			return false;
		}else{
			return true;
		};
	},
	ip: function(ipStr){
		ipStr = $.trim(ipStr);
		// var regex = /^[0-9\.]+$/;
		// if(!regex.test(ipStr)){
		// 	return ipStr;
		// }
		var resultArr = [];
		var arr = ipStr.split(".");
		var len = arr.length;
		for (var i = 0; i < len; i++)
		{

			if(arr[i].replace(/\s/g,""))
			{
				resultArr.push(arr[i].replace(/\s/g,""));
			}
			else
			{
				if(arr[i] == "")
				{
					resultArr.push('');
					return resultArr.join(".");
				}
				else
				{
					return ipStr;
				}

			}
		}
		return resultArr.join(".");
	},
	port: function(portNumber){
		return portNumber.replace(/\s/g,"");
		var formatVal = portNumber;
		if(isNaN(parseInt(portNumber, 10)))
		{
			return formatVal;
		}
		else
		{
			return parseInt(portNumber, 10);
		}
	},
	number: function(number){
		return number.replace(/\s/g,"");
		var formatVal = number;
		if(isNaN(parseInt(number, 10)))
		{
			return formatVal;
		}
		else
		{
			return parseInt(number, 10);
		}
	}
};

$.su.randomId = function(type){
	return type+"-"+parseInt(Math.random()*1000*1000*1000*10, 10).toString();
};

$.su.Manager = function(options){
	var config = {
		type: "Store",
		id: $.su.randomId("manager")
	};
	this.local = {};
	this.global = {};

	$.extend(this, config, options);

	$.su.Manager.managers = $.su.Manager.managers || [];
	$.su.Manager.managers.push(this);
};
$.su.Manager.removeLocal = function(){
	var managers = $.su.Manager.managers;
	if (managers){
		for (var index = 0, len = managers.length; index < len; index++){
			if (managers[index].removeLocal){
				managers[index].removeLocal();
			};
		};
	};
};
$.su.Manager.removeGlobal = function(){
	var managers = $.su.Manager.managers;
	if (managers){
		for (var index = 0, len = managers.length; index < len; index++){
			if (managers[index].removeGlobal){
				managers[index].removeGlobal();
			};
		};
	};
};

$.su.Manager.prototype.get = function(id){
	var store = this.local[id] || this.global[id];
	if (!store){
		return null;
	};
	return store;
};
$.su.Manager.prototype.add = function(obj){
	var id = obj.id;
	if (!id){
		return false;
	};
	var me = this;
	if (obj.global){
		me.global[id] = obj;
	}else{
		me.local[id] = obj;
	};
	if (me.addCallback){
		me.addCallback(obj);
	};
};
$.su.Manager.prototype.remove = function(id){
	var obj = this.local[id] || this.global[id];
	if (!obj){
	};
	if (obj.nodeType){
		$(obj).remove();
	}else{
		delete obj;
	}
	delete this.local[id];
	delete this.global[id];
	obj = null;

	return this;
};
$.su.Manager.prototype.removeLocal = function(){
	for (var index in this.local){
		var obj = this.local[index];
		if (obj.nodeType){
			$(obj).remove();
		}else{
			delete obj;
		};
	};

	this.local = null;
	delete this.local;
	this.local = {};
	return this;
};
$.su.Manager.prototype.removeGlobal = function(){
	for (var index in this.global){
		var obj = this.global[index];
		if (obj.nodeType){
			$(obj).remove();
		}else{
			delete obj;
		};
	};
	this.global = null;
	delete this.global;
	this.global = {};
	return this;
};

$.su.storeManager = new $.su.Manager({
	type: "Stroe",
	id: "storeManager"
});

$.su.componentManager = new $.su.Manager({
	type: "Component",
	id: "componentManager"
});

$.su.tipManager = new $.su.Manager({
	type: "Tip",
	id: "tipManager"
});

$.su.msgManager = new $.su.Manager({
	type: "Msg",
	id: "msgManager"
});

$.su.tipManager.add = function(obj) {
	$.su.Manager.prototype.add.call(this, obj);

	var container = $("div.tips-container#tips-container").length === 0 ? $("<div class=\"tips-container\" id=\"tips-container\"></div>").appendTo("body") : $("div.tips-container#tips-container");
	container.append(obj);
};


$.su.Menu = function(options){
    var defaults = {
        container: "",
        tabMenuContainer: "",
        data: "",
        urlPath: "",
        cls: "",
        idTag: "",
        list: {},
        handlers: null	//init, click
    };

    var settings = $.extend({}, defaults, options);
    var menu = this;

	this.settings = settings;
	/*	调试阶段，先读取本地数据
	$.ajax({
		url: $.su.dsUrl(),
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		data: $.su.json.toJSONString(settings.data),
		dataType: "json",
		success: function(data, status, xhr){
			if("undefined" == typeof data.advanced_menu){
				window.location.href = "./login.html";

			}else{
				menu.init(data.advanced_menu.advanced_menu.menu, settings);
			}

		},
		error:function(){
		}
	});
	*/

	if (this.settings.handlers){
		if (settings.handlers.init){
			$(this).on("ev_init", this.settings.handlers.init);
		};
		if (settings.handlers.goTo){
			$(this).on("ev_goto", this.settings.handlers.goTo);
		};
	};
	var admin_role = localStorage.getItem("role");

	if ("sys_admin" == admin_role)
		menu.init($.su.localResult.menu.advance_menu, settings);
	else if ("audit_admin" == admin_role)
		menu.init($.su.localResult_audit.menu.advance_menu, settings);
	else if ("config_admin" == admin_role)
		menu.init($.su.localResult_config.menu.advance_menu, settings);
	else
		// default init the system admin menu
		menu.init($.su.localResult.menu.advance_menu, settings);


};

$.su.Menu.prototype.init = function(data, settings){
    var container = $(settings.container).addClass("menu-container").html("&nbsp;"),
        tabContainer = $(settings.tabMenuContainer).addClass("tab-menu").html("&nbsp;"),
        menu = this;

    if (container.length < 0 || tabContainer.length < 0){
        return;
    };
/////////////////////////////////// trans list

    function parseMenuData(data, list){
        if (!data || !list) return [];
        if (data.length == 0 || $.isEmptyObject(list)) return [];
        var menu = [];
        for(var i=0; i<data.length; i++){
            var currentList = {};
            var childrenList = [];

            if(!data[i]['name']){// case DO NOT have second menu
                currentList.name = false;
                currentList.children = parseMenuData(data[i].children, list['children']);
            }
            else{
                currentList.name = data[i]['name'];
				if (typeof(data[i]['name']) == "undefined" || typeof(list[ data[i]['name'] ]) == "undefined")
				{
					alert("Unkown node which should be defined in advanced.htm: " + data[i]['name']);
					continue;
				}
				currentList.text = list[ data[i]['name'] ]['text'];
				currentList.url = list[ data[i]['name'] ]['url'];
				currentList.cloud_config = list[ data[i]['name'] ]['cloud_config'];
				currentList.need_cloud_open = list[ data[i]['name'] ]['need_cloud_open'];
                childrenList = parseMenuData(data[i].children, list[ data[i]['name'] ]['children']);
                if(childrenList.length > 0){
                    currentList.children = childrenList;
                }
            }
            menu.push(currentList);
        }
        return menu;
    }

    var dataMenu = parseMenuData(data, settings.list);


////////////////////////////////////
    var inHTML = "<ul class=\"menu-tree "+settings.cls+"\">";
    var tabHTML = "";

    for (var index = 0; index < dataMenu.length; index++){
        var fstMenu = dataMenu[index];

        if (!fstMenu.children || fstMenu.children.length === 0){
        	var tabMenu = fstMenu,
                unique = $.su.randomId("tab-menu-ul");
            inHTML +=	"<li class=\"fst\" id=\""+"menu-"+settings.idTag+"-"+fstMenu.name+"-li"+"\">";
            inHTML +=		"<a class=\"fst none-sec\" data-child=\"no\" data-name=\""+fstMenu.name+"\" name=\""+fstMenu.name+"\" tab-id=\""+unique+"\">";
            inHTML +=			"<span class=\"icon\"></span>";
            inHTML +=			"<span class=\"text\">"+fstMenu.text+"</span>"
            inHTML +=		"</a>";
            inHTML +=	"</li>";

            tabHTML += "<ul class='tab-menu-ul' id='"+ unique +"' style='display:none;'>";

                tabHTML += "<li class='"+ "fst" +"'>";
                tabHTML +=     "<div class='nav-wrap'>";
                tabHTML +=         "<a class='nav' data-name='"+tabMenu.name+"' href='"+settings.urlPath+tabMenu.url+"'>";
                tabHTML +=             "<span>"+tabMenu.text+"</span>";
                tabHTML +=         "</a>";
                tabHTML +=     "</div>";
                tabHTML += "</li>";

            tabHTML += "</ul>";

            continue;
        }


        if (fstMenu.children.length === 1 && !fstMenu.children[0].name){//First layer menu directly links to the third layer menu
            var tabMenu = fstMenu.children[0].children,
                unique = $.su.randomId("tab-menu-ul");
            if (!tabMenu || tabMenu.length === 0){
                continue;
            }
            inHTML +=	"<li class=\"fst\" id=\""+"menu-"+settings.idTag+"-"+fstMenu.name+"-li"+"\">";
            inHTML +=		"<a class=\"fst none-sec\"";
            inHTML += 			" cloud-config=\"" + (fstMenu.cloud_config ? true : false) + "\"";
            inHTML += 			" need-cloud-open=\"" + (fstMenu.need_cloud_open ? true : false) + "\"";
            inHTML += 			" data-child=\"no\" data-name=\""+fstMenu.name+"\" name=\""+fstMenu.name+"\" tab-id=\""+unique+"\">";
            inHTML +=			"<span class=\"icon\"></span>";
            inHTML +=			"<span class=\"text\">"+fstMenu.text+"</span>"
            inHTML +=		"</a>";
            inHTML +=	"</li>";

            tabHTML += "<ul class='tab-menu-ul' id='"+ unique +"' style='display:none;'>";
            for (var kndex = 0, length = tabMenu.length; kndex < length; kndex++){
                tabHTML += "<li class='"+ (kndex==0?"fst":"") +"'>";
                tabHTML +=     "<div class='nav-wrap'>";
                tabHTML +=         "<a class='nav' data-name='"+tabMenu[kndex].name+"' href='"+settings.urlPath+tabMenu[kndex].url+"'>";
                tabHTML +=             "<span>"+tabMenu[kndex].text+"</span>";
                tabHTML +=         "</a>";
                tabHTML +=     "</div>";
                tabHTML += "</li>";
            }
            tabHTML += "</ul>";
        }
        else{
            var secMenus = fstMenu.children;

            inHTML += 	"<li class=\"fst\" id=\""+"menu-"+settings.idTag+"-"+fstMenu.name+"-li"+"\">";
            inHTML += 		"<a class=\"fst\"";
            inHTML += 			" cloud-config=\"" + (fstMenu.cloud_config ? true : false) + "\"";
            inHTML += 			" need-cloud-open=\"" + (fstMenu.need_cloud_open ? true : false) + "\"";
            inHTML += 			" data-child=\"yes\" data-name=\""+fstMenu.name+"\" name=\""+fstMenu.name+"\">";
            inHTML += 			"<span class=\"icon\"></span>";
            inHTML += 			"<span class=\"text\">"+fstMenu.text+"</span>";
            inHTML += 		"</a>";
            inHTML += 		"<div class=\"menu-sec-wrap\">";
            inHTML += 			"<ul class=\"sec hidden\">";
            for (var jndex = 0, len = secMenus.length; jndex < len; jndex++){
                var secMenu = secMenus[jndex],
                    pos = (jndex == 0) ? "sec-fst" : ((jndex == len - 1) ? "sec-lst" : ""),
                    unique = $.su.randomId("tab-menu-ul") ;

                inHTML += 			"<li class=\"sec "+pos+"\">";
                inHTML +=				"<a class=\"sec\"";
                inHTML += 					" cloud-config=\"" + (secMenu.cloud_config ? true : false) + "\"";
                inHTML += 					" need-cloud-open=\"" + (secMenu.need_cloud_open ? true : false) + "\"";
                inHTML += 					" data-name=\""+secMenu.name+"\" name=\""+secMenu.name+"\" tab-id=\""+unique+"\">";
                inHTML +=					"<span class=\"icon\"></span>";
                inHTML +=					"<span class=\"text\">"+secMenu.text+"</span>";
                inHTML +=				"</a>";
                inHTML +=			"</li>";
                tabHTML += "<ul class='tab-menu-ul' id='"+ unique +"' style='display:none;'>";
                var tabMenu = secMenu.children;
                if (typeof(tabMenu) == "undefined") alert("Empty menu "+secMenu.name);
                else
                for (var kndex = 0, length = tabMenu.length; kndex < length; kndex++){
					var cloud_config = tabMenu[kndex].cloud_config || false;
                    tabHTML += "<li class='"+ (kndex==0?"fst":"") +"'>";
                    tabHTML +=     "<div class='nav-wrap'>";
                    tabHTML +=         "<a class='nav' data-name='"+tabMenu[kndex].name+"' cloud-config='" + cloud_config + "' href='"+settings.urlPath+tabMenu[kndex].url+"'>";
                    tabHTML +=             "<span>"+tabMenu[kndex].text+"</span>";
                    tabHTML +=         "</a>";
                    tabHTML +=     "</div>";
                    tabHTML += "</li>";
                }
                tabHTML += "</ul>";
            };

            inHTML += 			"</ul>";
            inHTML +=		"</div>";
            inHTML +=	"</li>";

        }
    };


    inHTML += "</ul>";

	$.su.app = $.su.app || {};
	var build_year = $.su.app.build_year || 2019;
	var menu_footer = '<div id="menu-footer" onClick="javascript:window.open(\'http://www.tp-link.com.cn\');"  style="cursor:pointer;">\
		<p>Copyright <span class="copyright">&copy;</span><span id="copy_year"> ' + build_year + '</span></p>\
		<p>普联技术有限公司</p>\
		<p>版权所有</p>\
	</div>';
    container.html(inHTML + menu_footer);
    tabContainer.html(tabHTML);

    container.delegate("ul.menu-tree li.fst a#logoutLink", "click", function(e){
    	e.preventDefault();
        e.stopPropagation();
        $("div#logout_confirm_msg").msg("show");
    });

    container.delegate("ul.menu-tree li.fst a.fst", "click", function(e){
        e.preventDefault();
        e.stopPropagation();

        var me = $(this),
            name = me.attr("data-name"),
			tabId = me.attr("tab-id"),
			text = me.find(".text").text();

        if (me.hasClass("deployed")){
            menu.collapse(name);
        }else{
        	var fstMenuList = $.find("ul.menu-tree li.fst a.fst");
        	$(fstMenuList).each(function(i, obj){
        		var that = $(obj);
        		if (that.hasClass("deployed")){
        			var objName = that.attr("data-name");
        			menu.collapse(objName);
        			that.removeClass("selected");
        		}
        	});
            if (me.attr("data-child") == "no"){// Directly linked to tab menu
                tabContainer.find(".tab-menu-ul").hide();
                $("#"+tabId).show().find("a.nav:eq(0)").trigger("click");
                container.find("li.fst").each(function(i, o){
                    var $o = $(o);
                    if ($o.hasClass("deployed")){
                        menu.collapse($o.find("a.fst").attr("data-name"));
                    }
                    if ($o.hasClass("selected")){
                        $o.removeClass("selected").find(".selected").removeClass("selected");
                    }
                });
                me.addClass("selected");
                me.closest("li.fst").addClass("selected");
            }else{
                var items = container.find("ul.menu-tree li.fst a.fst");
                items.each(function(i, obj){
                    var item = $(obj);
                    if (!item.hasClass("selected")){
                        menu.collapse(item.attr("data-name"));
                    }
				});

				if ($.su.menu && $.su.menu.wservices_setting == 0 && me.attr("cloud-config") == "true") {
					tabContainer.find(".tab-menu-ul").hide();
					var href = $.su.url("/userrpm/cloud_tip_check.htm");
					var html =  '<ul class="tab-menu-ul" id="tab-menu-ul-wservice-setting"><li class="selected"><div class="nav-wrap"><a class="nav" data-name="CLOUD_TIP" href="' + href + '"><span>' +
					text+'</span></a></div></li></ul>';
					$("#tab-menu-ul-wservice-setting").remove();
					tabContainer.append(html);
					$.su.menu.cloud_tip_name = name;
					$.su.menu.level = 1;
					$(menu).trigger("ev_goto", ["cloud_tip_check", href]);
				}
				else if ($.su.menu && $.su.menu.cloud_mgt_status && me.attr("cloud-config") == "true") {
					// 开启云管理情况下，如果该一级菜单能在云端配置，则屏蔽本地页面
					tabContainer.find(".tab-menu-ul").hide();
					var href = $.su.url("/userrpm/cloud_tip_goto_SMBCloud.htm");
					var html = '<ul class="tab-menu-ul" id="tab-menu-ul-wservice-setting"><li class="selected"><div class="nav-wrap"><a class="nav" data-name="CLOUD_TIP" href="' + href + '"><span>' +
					text+'</span></a></div></li></ul>';
					$("#tab-menu-ul-wservice-setting").remove();
					tabContainer.append(html);
					$.su.menu.cloud_tip_name = name;
					$.su.menu.level = 1;
					$(menu).trigger("ev_goto", ["cloud_tip_goto_SMBCloud", href]);
				}
				else if ($.su.menu && false == $.su.menu.cloud_mgt_status && me.attr("need-cloud-open") == "true") {
					// 关闭云管理的情况下，如果配置了need-cloud-open，则屏蔽本页面
					var href = $.su.url("/userrpm/cloud_tip_open_cloud_mgt.htm");
					var html =  '<ul class="tab-menu-ul" id="tab-menu-ul-need-cloud-open"><li class="selected"><div class="nav-wrap"><a class="nav" data-name="CLOUD_TIP" href="' + href + '"><span>' +
					text+'</span></a></div></li></ul>';
					$("#tab-menu-ul-need-cloud-open").remove();
					tabContainer.append(html);
					$(menu).trigger("ev_goto", ["cloud_tip_open_cloud_mgt", href]);
				}
				else {
					menu.open(name);
				}
            }

            if ($.type($.su.layout.doLayout) == "function"){
                $.su.layout.doLayout();
			}
        }
    }).delegate("ul.menu-tree li.sec a.sec", "click", function(e){
        e.preventDefault();
        e.stopPropagation();
		// 初始化top-tip状态为隐藏
		$(".top-tip").hide();
		$.su.menu.fixMarginTop(-32);

        var me = $(this),
			meTop = me.closest("li.fst"),
			name = meTop.find('a.fst').attr("data-name"),
			text = me.find(".text").text();

        meTop.addClass("load-tag");
        container.find("li.fst").each(function(i, o){
            var $o = $(o);
            if (!$o.hasClass("load-tag")){
                if ($o.hasClass("deployed")){
                    menu.collapse($o.find("a.fst").attr("data-name"));
                }
            }
            if ($o.hasClass("selected")){
                $o.removeClass("selected").find(".selected").removeClass("selected");
            }
        });
        me.addClass("selected").closest("li.sec").addClass("selected");
        meTop.removeClass("load-tag").addClass("selected").find("a.fst").addClass("selected");

        var tabId = $(this).attr("tab-id");
        var $tab = $("#"+tabId);
        tabContainer.find(".tab-menu-ul").hide();
        if(me.data("name") === "wan-setting"){
            var wanCount = parseInt($.su.wanCount, 10);
            if(!$.isNumeric(wanCount)) wanCount = 1;
            var $lis = $tab.find("li").hide();
            $lis.eq(0).show();
            //renew WAN setting tabs after clicking th WAN setting sec menu.
            var wanProxy = new $.su.Proxy({url: $.su.url("/admin/interface_wan?form=wanmode")});
            wanProxy.read({}, function(data){
                if(data && data.wanmode){
                    $.su.wanCount = data.wanmode;
                    wanCount = parseInt($.su.wanCount, 10);
                    if(!$.isNumeric(wanCount)) wanCount = 1;
                    $.each($lis, function(i, li){
                        var $li = $(li);
                        if(i < wanCount){
                            $li.show();
                        }else{
                            $li.hide();
                        }
                    });
                }
            });
		}

		if ($.su.menu && $.su.menu.wservices_setting == 0 && me.attr("cloud-config") == "true") {
			// 恢复出厂设置后访问能在云端配置的页面，提示有云管理功能
			var href = $.su.url("/userrpm/cloud_tip_check.htm");
			var html =  '<ul class="tab-menu-ul" id="tab-menu-ul-wservice-setting"><li class="selected"><div class="nav-wrap"><a class="nav" data-name="CLOUD_TIP" href="' + href + '"><span>' +
			text+'</span></a></div></li></ul>';
			$("#tab-menu-ul-wservice-setting").remove();
			tabContainer.append(html);
			$.su.menu.cloud_tip_name = name;
			$.su.menu.level = 2;
			$(menu).trigger("ev_goto", ["cloud_tip_check", href]);
		}
		else if ($.su.menu && $.su.menu.cloud_mgt_status && me.attr("cloud-config") == "true") {
			// 开启云管理情况下，如果该二级菜单能在云端配置，则屏蔽本地页面
			var href = $.su.url("/userrpm/cloud_tip_goto_SMBCloud.htm");
			var html =  '<ul class="tab-menu-ul" id="tab-menu-ul-wservice-setting"><li class="selected"><div class="nav-wrap"><a class="nav" data-name="CLOUD_TIP" href="' + href + '"><span>' +
			text+'</span></a></div></li></ul>';
			$("#tab-menu-ul-wservice-setting").remove();
			tabContainer.append(html);
			$.su.menu.cloud_tip_name = name;
			$.su.menu.level = 2;
			$(menu).trigger("ev_goto", ["cloud_tip_goto_SMBCloud", href]);
		}
		else if ($.su.menu && false == $.su.menu.cloud_mgt_status && me.attr("need-cloud-open") == "true") {
			// 关闭云管理的情况下，如果配置了need-cloud-open，则屏蔽本页面
			var href = $.su.url("/userrpm/cloud_tip_open_cloud_mgt.htm");
			var html =  '<ul class="tab-menu-ul" id="tab-menu-ul-need-cloud-open"><li class="selected"><div class="nav-wrap"><a class="nav" data-name="CLOUD_TIP" href="' + href + '"><span>' +
			text+'</span></a></div></li></ul>';
			$("#tab-menu-ul-need-cloud-open").remove();
			tabContainer.append(html);
			$(menu).trigger("ev_goto", ["cloud_tip_open_cloud_mgt", href]);
		}
		else {
			if ($.su.menu && $.su.menu.top_bar_notify_again
				&& (me.attr("cloud-config") == "true"
					|| meTop.find("a:first").attr("cloud-config") == "true")
				) {
				// 自己可以在云管理中配置或者所在的一级菜单能在云管理配置
				$(".top-tip").show();
				$.su.menu.fixMarginTop(-66);
			}
			else {
				$(".top-tip").hide();
				$.su.menu.fixMarginTop(-32);
			}

			$tab.show().find("a.nav:eq(0)").trigger("click");
		}
    });

    tabContainer.delegate("ul.tab-menu-ul li a.nav", "click", function(e){
        e.preventDefault();
        e.stopPropagation();

        var me = $(this);
        var name = me.attr("data-name");
		var href = me.attr("href");
		var cloud_config = me.attr("cloud-config");

		me.closest(".tab-menu-ul").find("li").removeClass("selected");
		me.closest("li").addClass("selected");

		if ($.su.menu && $.su.menu.wservices_setting == 0 && me.attr("cloud-config") == "true") {
			// 恢复出厂设置后访问能在云端配置的页面，提示有云管理功能
			var href = $.su.url("/userrpm/cloud_tip_check.htm");
			$.su.menu.cloud_tip_name = name;
			$.su.menu.level = 3;
			$(menu).trigger("ev_goto", ["cloud_tip_check", href]);
		}
		else if ($.su.menu && $.su.menu.cloud_mgt_status && me.attr("cloud-config") == "true") {
			// 开启云管理情况下，如果该三级菜单能在云端配置，则屏蔽本地页面
			var href = $.su.url("/userrpm/cloud_tip_goto_SMBCloud.htm");
			$.su.menu.cloud_tip_name = name;
			$.su.menu.level = 3;
			$(menu).trigger("ev_goto", ["cloud_tip_goto_SMBCloud", href]);
		}
		else {
			$(menu).trigger("ev_goto", [name, href]);
		}
    });

    $(this).trigger("ev_init");
};

$.su.Menu.prototype.open = function(name){
    var	container = $(this.settings.container),
        menuItem = container.find("ul.menu-tree li a[name="+name+"]");

    if (!menuItem.length || !menuItem.hasClass("fst")){
        return;
    }else{
        menuItem.next("div.menu-sec-wrap").find("ul.sec").slideDown(150, function(){
            menuItem.addClass("deployed").closest("li.fst").addClass("deployed");
            if ($.type($.su.layout.doLayout) == "function"){
                $.su.layout.doLayout();
            }
        });
    }
};

$.su.Menu.prototype.goTo = function(fstName, secName, thirdName){
    var	container = $(this.settings.container),
        fstMenu = container.find("ul.menu-tree li.fst a[name="+fstName+"]");

    if (!fstMenu.length){
        return;
    }
    else{
        // 如果一级菜单没有展开，则点击一级菜单让菜单栏展开
        if (fstMenu.parent().hasClass("deployed") == false)
            fstMenu.trigger("click");
        if (!!secName){
            var secMenu = fstMenu.parent().find("li.sec a[name="+secName+"]");
            if (!secMenu.length){
                return;
            }
            else{
                secMenu.trigger("click");
                // 增加三级菜单的跳转，点击跳转到对应的页签
                // thirdName为advanced.htm中配置的页签的key
                // 比如系统管理设置为account-config
                if (!!thirdName) {
                    var tabContainer = $(this.settings.tabMenuContainer);
                    var thirdMenu = tabContainer.find("ul.tab-menu-ul li div a[data-name=" + thirdName + "]");
                    if (!thirdMenu.length) {
                        return;
                    }
                    else {
                        thirdMenu.trigger("click");
                    }
                }
            }
        }
    }
};

//回到首页
$.su.Menu.prototype.goToHome = function(){
    var first_menu, second_menu;
    var admin_role = localStorage.getItem("role");

    if (typeof($.su.localResult.menu.advance_menu[0]) != "undefined")
    {
        var home_sec = $.su.localResult.menu.advance_menu[0];

        first_menu = home_sec.name;
        second_menu = home_sec.children[0].name;
    }

    //判断是否跳转到设置向导
    if (((admin_role == "sys_admin") || (admin_role == "config_admin"))
        && typeof($.su.localResult_wizard) != "undefined"){
        var sys_proxy = new $.su.Proxy({async: false});
        sys_proxy.query({
            system:{"name":"sys"}
            }, function(sysResult) {
                if (sysResult.system.sys.go_wizard === "1") {
                    first_menu = $.su.localResult_wizard.first_menu;
                    second_menu = $.su.localResult_wizard.second_menu;
                }
        });
    }

    if (typeof(first_menu) != "undefined" && typeof(second_menu) != "undefined")
        this.goTo(first_menu, second_menu);
};

$.su.Menu.prototype.collapse = function(name){
    var	menuItem = null,
        container = $(this.settings.container);

    menuItem = container.find("ul.menu-tree li a[name="+name+"]");

    if (!menuItem.length || !menuItem.hasClass("fst")){
        return;
    }else{
        menuItem.next("div.menu-sec-wrap").find("ul.sec").slideUp(150);
        menuItem.removeClass("deployed").closest("li.fst").removeClass("deployed");
    };
};

$.su.app = null;

$.su.app_list = null;

$.su.mask = {
	displayed: false,
	count: 0,
	height: 0,
	width: 0,
	show: function(){
		var _this = this;
		_this.count++;

		_this.dom.queue(function(){
			if (_this.displayed == false){
				_this.dom.fadeIn(200, function(){
					$(this).css({
						"display": "block",
						"min-width":"980px"
					});
					_this.displayed = true;

				});
			};
			$(this).dequeue();
		});

	},
	hide: function(){
		var _this = this;
		_this.count--;

		if (_this.count <= 0){
			_this.count = 0;
		};

		_this.dom.queue(function(){
			if (_this.displayed == true && _this.count <= 0){
				_this.dom.fadeOut(200, function(){
					$(this).css("display", "none");
					_this.displayed = false;
				});
			};
			$(this).dequeue();
		});
	},
	init: function(){

		var dom = $("div.mask#mask");
		if (dom.length == 0){
			dom = $("<div id=\"mask\" class=\"mask\"></div>");
			dom.appendTo($("body"));
		};

		var _this = this;
		_this.dom = dom;

		if (dom.is(":hidden")){
			_this.displayed = false;
			_this.count = 0;
		}else{
			_this.displayed = true;
			_this.count = 1;
		};

		//_this.height = $(window).height() > $(document).height() ? $(window).height() : $(document).height();
		//_this.width = $(window).width() > $(document).width() ? $(window).width() : $(document).width();

		var changeSize = function(){
			_this.dom.css({
				width: "100%",
				height: "100%"
			});

			var wrapper = $("div#top-wrapper");
			var dh = wrapper.height();
			var dw = wrapper.width();

			var wh = $(window).height();
			var ww = $(window).width();

			if (dw > ww){
				_this.dom.css({
					width: dw
				});
			};

			if (dh > wh){
				_this.dom.css({
					height: dh
				});
			};
		};

		$(window).on("load resize", changeSize);
		//$("body").resize(changeSize);
	}
};

$.su.loading = {
	//dom: .length === 0 ? $(<div class=\"loading-waiting-icon\"></div></div></div>") : $("div.loading-container#loading-container"),
	displayed: false,
	init: function(){
		var dom = $("div.loading-container#loading-container");
		if (dom.length === 0){
			var inHTML = 	"<div class=\"loading-container\" id=\"loading-container\">";
				inHTML +=		"<div class=\"loading-container-wrap\">";
				inHTML +=			"<div class=\"loading-container-inner\">";
				inHTML +=				"<div class=\"loading-waiting-icon\">";
				inHTML +=				"</div>";
				inHTML +=			"</div>";
				inHTML +=		"</div>";
				inHTML +=	"</div>";

			dom = $(inHTML).appendTo($("body"));
		};

		var _this = this;
		_this.dom = dom;

		if (dom.is(":hidden")){
			_this.displayed = false;
		}else{
			_this.displayed = true;
		};
	},
	show: function(){
		var _this = this;
		_this.dom.queue(function(){
			if (_this.displayed == false){
				$.su.mask.show();
				$(this).fadeIn(200, function(){
					$(this).css("display", "block");
					_this.displayed = true;
				});
			};
			$(this).dequeue();
		});
	},
	hide: function(){
		var _this = this;
		_this.dom.queue(function(){
			if (_this.displayed == true){
				$.su.mask.hide();
				$(this).fadeOut(200, function(){
					$(this).css("display", "none");
					_this.displayed = false;
				});
			};
			$(this).dequeue();
		});
	}
};

$.su.mask.init();
$.su.loading.init();

$.su.addEventListener = function(obj, name, func, capture){
	if (!obj){
		//console.error("The Obj is null!");
		return;
	};

	if (obj.addEventListener){
		obj.addEventListener(name, function(ev){
			func.call(obj, ev || window.event);
		}, capture);
	}else{
		obj.attachEvent("on"+name, function(ev){
			func.call(obj, ev || window.event);
		});
	};

	return func;
};

$.extend($.fn, {
	getCss: function(key) {
		var v = parseInt(this.css(key));
		if (isNaN(v))
			return false;
		return v;
	}
});

$.su.mouse = {
	/*longpress: function(fn, callback){
		var me = $(this),
			t = 0;
		me.mousedown(function(e){
			t = setInterval(function(){
				if ($.type(fn) === "function"){
					fn.call(me, e);
				}
			}, 100);
		}).bind("mouseup mouseleave", function(e){
			clearInterval(t);
			if ($.type(callback) === "function"){
				callback.call(me, e);
			}
		});
	}*/
	mousescroll: function(handler){
		/*var type = $.type(obj);
		if (type === "string"){
			obj = $(obj).get(0);
		}else if(type === "object"){
			if (obj.jquery){
				obj = obj.get(0);
			};
		};*/
		var obj = this.get(0);
		if (!obj || !handler){
			//console.error("The Obj or the handler is null!");
			return;
		};

		var wheelType = "mousewheel";
		try{
			document.createEvent("MouseScrollEvents");
			wheelType = "DOMMouseScroll";
		}catch(e){};

		$.su.addEventListener(obj, wheelType, function(e){
			if ("detail" in e){
				e.wheelDelta = e.detail*(-40);
			};
			//console.log(e.wheelDelta)
			handler.call(obj, e);
		});
	},
	draggable: function(options){
		var me = this;
		var defaults = {
			zIndex: 99,
			opacity: 0.7,
			handle: null,
			containment: "parent",
			axis: false,
			distance: 1,
			//callback
			drag: null,
			start: null,
			stop: null
		};

		var dd = {
			_init: function(){


				this._start();
			},
			_setContainment: function(){
				//containment
				switch(this.containment){
					case "window":
						this.containment = [
							$(window).scrollLeft() - this.position.relative.left - this.offset.parent.left,
							$(window).scrollTop() - this.position.relative.top - this.offset.top,
							$(window).scrollLeft() + $(window).width() - this.margins.left,
							$(window).scrollTop() + ($(window).height() || document.body.parentNode.scrollHeight) - this.margins.top
						]
						break;
					case "document":
						this.containment = [
							0,
							0,
							$(document).width() - this.margins.left,
							($(document).height() || document.body.parentNode.scrollHeight) - this.margins.top
						]
						break;
					case "parent":
						break;
				};
			},
			_cacheMargins: function(){

			},
			_destroy: function(){

			},
			_capture: function(){

			},
			_start: function(){

				this._cacheMargins();
			},
			_drag: function(){

			},
			_stop: function(){

			},
			_cancel: function(){

			}
		};

		me.each(function(i, obj){
			$.extend(dd, defaults, options);
			dd.element = obj;
			obj.dragdrop = dd;

			obj.dragdrop._init();
		});

		return me;
	},
	Drags : function(opts) {
		var ps = $.extend({
			zIndex: 20,
			opacity: .7,
			handler: null,
			onMove: function() { },
			onDrop: function() { }
		}, opts);
		var dragndrop = {
			drag: function(e) {
				var dragData = e.data.dragData;
				dragData.target.css('opacity', dragData.opacity);
				dragData.target.css({
					left: dragData.left + e.pageX - dragData.offLeft,
					top: dragData.top + e.pageY - dragData.offTop
				});
				/*
				var x = e.layerX || e.offsetX;
				var y = e.layerY || e.offsetY;
				var pageX = e.pageX || e.clientX;
				var pageY = e.pageY || e.clientY;
				if (navigator.userAgent.toLowerCase().indexOf("msie") != -1){
					var tx = pageX - x + document.documentElement.scrollLeft;
					var ty = pageY - y + document.documentElement.scrollTop;
				}else{
					var tx = pageX - x;
					var ty = pageY - y;
				}
				console.log("left", dragData.target.getCss('left'), "top", dragData.target.getCss('top'));
				console.log("tx", tx, "ty", ty);
				if (0 <= ty && $(window).height() >= ty + dragData.offsetHeight + 10){
					dragData.target.css("top", ty+"px");
				}
				if (0 <= tx && $(window).width() >= tx + dragData.offsetWidth + 10){
					dragData.target.css("left", tx+"px");
				}
				console.log("left is", dragData.target.getCss('left'), "dragData.left", dragData.left, "e.pageX", e.pageX, "dragData.offLeft", dragData.offLeft);
				console.log("top is", dragData.target.getCss('top'), "dragData.top", dragData.top, "e.pageY", e.pageY, "dragData.offTop", dragData.offTop);
				console.log("$(window).scrollLeft", $(window).scrollLeft(), "$(window).scrollTop", $(window).scrollTop());
				console.log("scrollTop", document.documentElement.scrollTop, document.body.scrollTop);
				console.log("$(window).width", $(window).width(), "$(window).height", $(window).height(), dragData.width, dragData.height);
				console.log("x", e.layerX, e.offsetX, "y", e.layerY, e.offsetY);
				console.log(navigator.userAgent.toLowerCase().indexOf("msie"));
				*/
				dragData.handler.css('cursor', 'move');
				return false;
			},
			drop: function(e) {
				var dragData = e.data.dragData;
				dragData.target.css(dragData.oldCss)
				dragData.handler.css('cursor', 'auto');

				$(this).unbind('mousemove', dragndrop.drag)
					.unbind('mouseup', dragndrop.drop);

				$(document).unbind('mousemove').unbind('mouseup');
				dragData.me.find('iframe').unbind('mousemove').unbind('mouseup');
				document.onmousemove = null;
				document.onmouseup = null;

				document.unselectable  = "off";
				document.onselectstart = null;

				return false;
			}
		}
		return this.each(function() {
			var me = this,
				$me = $(me),
				handler = null;

			if (typeof ps.handler == 'undefined' || ps.handler == null)
				handler = $me;
			else
				handler = (typeof ps.handler == 'string' ? $(ps.handler, this) : ps.handle);

			handler.bind('mousedown', { e : me }, function(s) {
				var target = $(s.data.e);
				var oldCss = {};
				if (target.css('position') != 'absolute') {
					try {
						target.position(oldCss);
					} catch (ex) { }
					target.css('position', 'absolute');
				}
				oldCss.cursor = target.css('cursor') || 'default';
				oldCss.opacity = target.getCss('opacity') || 1;
				var dragData = {
					left: oldCss.left || target.getCss('left') || 0,
					top: oldCss.top || target.getCss('top') || 0,
					width: target.width() || target.getCss('width'),
					height: target.height() || target.getCss('height'),
					offLeft: s.pageX,
					offTop: s.pageY,
					offsetWidth: target.get(0).offsetWidth,//width+padding+border
					offsetHeight: target.get(0).offsetHeight,//height+padding+border
					oldCss: oldCss,
					onMove: ps.onMove,
					onDrop: ps.onDrop,
					opacity: ps.opacity,
					handler: handler,
					me : $me,
					target: target
				}

				document.unselectable  = "on";
				document.onselectstart = function(){return false;}/* 禁止选中 */

				handler.bind('mousemove', { dragData: dragData }, dragndrop.drag)
					.bind('mouseup', { dragData: dragData }, dragndrop.drop);

				$(document).bind('mousemove',{ dragData: dragData }, function(e){
					dragndrop.drag(e);
				}).bind('mouseup',{ dragData: dragData }, function(e){
					dragndrop.drop(e);
				});

				$me.find('body').bind('mousemove',{ dragData: dragData }, function(e){
					dragndrop.drag(e);
				}).bind('mouseup',{ dragData: dragData }, function(e){
					dragndrop.drop(e);
				});
			}).bind('mouseover', function(){
				handler.css('cursor','move');
				return false;
			}).bind('mouseout', function(){
				handler.css('cursor','auto');
				return false;
			});
		});
	}
};

$.su.keybord = {

};


$.extend($.fn, $.su.mouse, $.su.keybord);

$.su.Help = function(options){
	var defaults = {
		container: "",
		content: "",
		create: function(){

			var inHTML = 	"";
				inHTML +=	"<div class=\"help-container-wrap\">";

				inHTML +=		"<div class=\"help-btn-container\">";
				inHTML +=			"<a class=\"btn-help\" href=\"javascript:void(0);\">";
				inHTML +=			"</a>";
				inHTML +=		"</div>";


			// for ie shadow

				inHTML +=		"<div class=\"help-content-container\"><span class=\"help-content-delta\"></span>";

				inHTML +=			'<div class="position-top-left"></div><div class="position-top-center"></div><div class="position-top-right"></div>';

				inHTML +=			'<div class="position-center-left"><div class="position-center-right">';

				inHTML +=				"<div class=\"help-content-wrap\">";
				inHTML +=					"<div class=\"help-content-container-wrap\">";
				inHTML +=					"<div class=\"help-content\"></div>";
				inHTML +=					"</div>";
				inHTML +=				"</div>";

				inHTML +=			'</div></div>';


				inHTML +=			'<div class="position-bottom-left"></div><div class="position-bottom-center"></div><div class="position-bottom-right"></div>';

				inHTML +=		"</div>";

				inHTML +=	"</div>";

			var container = $(this.container);
			container.addClass("help-container").append($(inHTML));
			return inHTML;
		},
		layout: function(){
			var wh = $(window).height();
			var help = this,
				wrap = help.wrap;

			wrap.css({
				"max-height": wh-260
			});
		}
	};

	var settings = $.extend({}, defaults, options);

	this.settings = settings;
	this.init();
};

$.su.Help.prototype.init = function(){
	var help = this;
	if (!help.settings){
		return null;
	};

	help.settings.create();

	var container = $(help.settings.container),
		contentContainer = container.find("div.help-content-container"),
		wrap = container.find("div.help-content-container-wrap"),
		content = container.find("div.help-content"),
		button = container.find("a.btn-help");

	help.container = container;
	help.wrap = wrap;
	help.content = content;
	help.contentContainer = contentContainer;
	help.button = button;

	button.on("click", function(e){
		e.preventDefault();
		e.stopPropagation();

		var btn = $(this);
		if (help.show){
			help.close();
		}else{
			if (!help.loaded){
				help.load();
			};
			help.open();
		};
	});


	help.content.delegate("div.name-container h5.title.main-title", "click", function(){
		var title = $(this);
		var content = title.next("span.connector").next("div.content-wrap");

		if (title.hasClass("opened")){
			content.slideUp(200, function(){
				title.removeClass("opened");
			});
		}else{
			title.addClass("opened");
			content.slideDown(200);
		}

	});

	//return this;
};

$.su.Help.prototype.load = function(name){
	var help = this;
	if (help.loaded == true){
		return;
	};

	var name = name || this.settings.content;
	if (!$.isArray(name)){
		name = [name];
	};

	var render = function(obj){
		var contentRender = function(obj, subFlag){
			var inHTML = "";
			var sub = subFlag ? "sub-container" : "main-container";

			for (var index = 0, len = obj.length; index < len; index++){
				var o = obj[index];
				switch (o.type){

					case "paragraph":
						if(o.id)
						{
							inHTML +=	"<div id=\""+o.id+"\" class=\"paragraph-container "+sub+"\">";
						}
						else
						{
						inHTML +=	"<div class=\"paragraph-container "+sub+"\">";
						}

						if (o.title){
							inHTML +=		"<h5 class=\"title\">"+o.title+"</h5>";
						};
						inHTML +=		"<div class=\"content-container\">";
						inHTML +=			"<p class=\"paragraph\">"+o.content+"</p>";
						break;
					case "title":
						if(o.id){
							inHTML +=	"<div id=\""+o.id+"\" class=\"title-container "+sub+"\">";
						}
						else{
							inHTML +=	"<div class=\"title-container "+sub+"\">";
						}
						inHTML +=			"<h5 class=\"title\">"+o.title+"</h5>";
						inHTML +=		"<div class=\"content-wrap\">";
						if (o.content){
							inHTML +=		"<p>"+o.content+"</p>";
						};
						break;
					case "name":
						if(o.id){
							inHTML +=	"<div id=\""+o.id+"\" class=\"name-container "+sub+"\">";
						}
						else{
							inHTML +=	"<div class=\"name-container "+sub+"\">";
						}
						inHTML +=			"<h5 class=\"title "+(subFlag ? "" : "main-title")+"\">";
						inHTML +=				"<span>"+o.title+"</span>";
						inHTML +=				"<span class=\"arrow\"></span>";
						inHTML +=			"</h5>";
						inHTML +=		"<span class=\"connector\">"+(o.connector || " - ")+"</span>";
						inHTML +=		"<div class=\"content-wrap\">";
						if (o.content){
							inHTML +=		"<p>"+o.content+"</p>";
						};
						break;
					case "note":
						if(o.id){
							inHTML +=	"<div id=\""+o.id+"\" class=\"note-container "+sub+"\">";
						}
						else{
							inHTML +=	"<div class=\"note-container "+sub+"\">";
						}
						inHTML +=			"<h5 class=\"title\">"+o.title+(o.connector || ":")+"</h5>";
						inHTML +=		"<div class=\"content-wrap-note\">";
						inHTML +=			"<ol class=\"note\">";

						if ($.type(o.content) != "array"){
							o.content = [o.content];
						};
						for (var jndex = 0, lenj = o.content.length; jndex < lenj; jndex++){
							inHTML +=			"<li>"+o.content[jndex]+"</li>";
						};

						inHTML +=			"</ol>";
						break;
					case "step":
						if(o.id){
							inHTML +=	"<div id=\""+o.id+"\" class=\"step-container "+sub+"\">";
						}
						else{
							inHTML +=	"<div class=\"step-container "+sub+"\">";
						}

						if (o.title){
							inHTML +=		"<h5 class=\"title\">"+o.title+(o.connector || "")+"</h5>";
						};
						inHTML +=		"<div class=\"content-wrap-step\">";
						inHTML +=			"<ol class=\"step\">";

						if ($.type(o.content) != "array"){
							o.content = [o.content];
						};
						for (var jndex = 0, lenj = o.content.length; jndex < lenj; jndex++){
							var c = o.content[jndex];
							if ($.type(c) == "string"){
								inHTML +=			"<li>"+c+"</li>";
							}else{
								inHTML +=			"<li>";
								inHTML +=				"<p>"+c.content+"</p>";

								if (c.children){
									inHTML +=	contentRender(c.children, true);
								};

								inHTML +=			"</li>";
							};
						};
						inHTML +=			"</ol>";
						break;
					default:

				};

				if (o.children){
					inHTML +=	contentRender(o.children, true);
				};

				inHTML +=				"</div>";
				inHTML +=			"</div>";

			};
			return inHTML;

		};

		var inHTML = "";
		if (obj.ID){
			inHTML = "<div id=\""+obj.ID+"\">"
		}else{
			inHTML = "<div>"
		}
		if (obj.TITLE){
			inHTML +=	"<h4 class=\"title\">" +obj.TITLE+ "</h4>";
		};

		if ($.type(obj.CONTENT) == "array"){
			inHTML +=	contentRender(obj.CONTENT, false);
		};
		inHTML += "</div>"

		return inHTML;
	};

	for (var index = 0, len = name.length; index < len; index++){
		var contentObj = $.su.CHAR.HELP[name[index]];
		var htmlStr = render(contentObj);

		this.content.append($(htmlStr));
	};
	if(this.settings.afterLoad)
	{
		this.settings.afterLoad();
	}

	help.loaded = true;

};

$.su.Help.prototype.open = function(){
	var help = this;

	help.settings.layout.call(this);

	help.contentContainer.slideDown(150, function(){
		$(this).css("display", "block");
		help.show = true;
	});
	help.contentContainer.on("click", function(e){
		e.stopPropagation();
		//e.preventDefault();
	});

	var btn = help.button;
	btn.addClass("clicked");

	$("html").one("click", function(){
		help.close();
	});
};

$.su.Help.prototype.close = function(){
	var help = this;
	help.contentContainer.fadeOut(150, function(){
		$(this).css("display", "none");
		help.show = false;
	});
	var btn = help.button;
	btn.removeClass("clicked");
};

$.su.layout = {
	doLayout: function(){

	}
};

//unicode
$.su.unicode = {
	encode: function(str) {
        var a = [];
        for (var i = 0; i < str.length; i++){
			var code = str.charCodeAt(i);
			code = ((code.toString(16).length) % 2) == 0 ? code.toString(16) : "0" + code.toString(16);
			a[i] = code;
		};
		//console.log(a);
        return "&#" + a.join(";&#") + ";"
    },
    decode: function(str) {
        return str.replace(/&#(x)?([^&]{1,6});?/g,
        function(a, b, c) {
            return parseInt("0x"+String, 16).fromCharCode(parseInt(c, b ? 16 : 10))
        })
    },
    encodeNoPrefix: function(str){
    	var unicode = this.encode(str);
		return unicode.replace(/[&#;]/g, "").toString();
    },
    getUnicodeLength: function(str){
    	var unicode = this.encode(str);
		unicode = unicode.replace(/[&#;]/g, "");
    	return Math.ceil( unicode.length / 2)
    },
	getUtf8Length: function(str){
		var unicode = this.encode(str);
		var len = 0;
		unicode.replace(/&#(x)?([^&]{1,6});?/g,

		function(code){
			var utf8Code = code.replace(/\&\#/g, "0x").replace(/\;/g, "").toString();

			if (0x0000 <= utf8Code && utf8Code <= 0x007F){
				len = len + 1;
			}else if (0x0080 <= utf8Code && utf8Code <= 0x07FF){
				len = len + 2;
			}else if (0x0800 <= utf8Code && utf8Code <= 0xFFFF){
				len = len + 3;
			}else if (0x10000 <= utf8Code && utf8Code <= 0x1FFFFF){
				len = len + 4;
			}else if (0x200000 <= utf8Code && utf8Code <= 0x3FFFFFF){
				len = len + 5;
			}else if (0x4000000 <= utf8Code && utf8Code <= 0x7FFFFFFF){
				len = len + 6;
			}
		});

		return len;
	},
	checkUtf8Length: function(str, minLength, maxLength){
		var minLength = minLength || 0,
			maxLength = maxLength || "";

		var len = $.su.unicode.getUtf8Length(str);

		if (len < minLength){
			return false;
		};

		if (maxLength !== ""){
			if (maxLength < len){
				return false;
			};
		};

		return true;

	},
    checkUnicodeLength: function(str, minLength, maxLength){
    	var minLength = minLength*2 || 0,
			maxLength = maxLength*2 || "";

		var pattern = "^.{%minLength%,%maxLength%}$";
		pattern = pattern.replace("%minLength%", minLength).replace("%maxLength%", maxLength);
		pattern = new RegExp(pattern);
		//console.log(pattern, str)
		return pattern.test(this.encodeNoPrefix(str));
    }
};

$.su.tree = {
	convertSlpTreeData: function (data, name, cn_name, app, app_cn_name) {
		var source = [];
		if (!$.isEmptyObject(data) && name !== '' && cn_name !== '' && app !== '' && app_cn_name !== '') {
			$.each(data, function (index, item) {
				var obj = {};
				var sectname = "";
				for (var s in item) {
					sectname = s;
					break;
				}

				obj.title = item[sectname][cn_name];
				obj.key = item[sectname][name];
				obj.type = "level1";

				var app_arr = item[sectname][app];
				var app_cn_name_arr = item[sectname][app_cn_name];
				var children = [];
				if ($.isArray(app_arr) &&  $.isArray(app_cn_name_arr)) {
					$.each(app_arr, function (index, value) {
						var childrenObj = {};
						childrenObj.title = app_cn_name_arr[index];
						childrenObj.key = value;
						childrenObj.type = "level2";
						children.push(childrenObj);
					});
					obj.children = children;
				}
				source.push(obj);
			});
			return source;
		} else {
			return [];
		}
	},
};

$.su.loadComboData = function(url, para, arr, type){
	var proxy = new $.su.Proxy({
		url: url,
		type: type,
		async: false,
		autoLoad: false
	});

	var parseData = function(source, arr){
		var retArr = [];
		if(!$.isArray(arr)){
			return retArr;
		}
		$(source).each(
			function(index, element){
				var tempObj = {};
			    var len = arr.length;
				for(var i=0; i < len; i++){
					if (arr[i]){
						if(arr[i].func){
							tempObj[arr[i].dstKey] = arr[i].func(element[arr[i].srcKey], arr[i].para);
						}else{
							tempObj[arr[i].dstKey] = element[arr[i].srcKey];
						};
					};
				}
				retArr.push(tempObj);
			}
		);
		return retArr;
	};

	var res = {};
	proxy.read(para, function(result, others, status, xhr){
		res = parseData(result, arr);
	}, function(){
	}, function(){
	});

	return res;
};

$.su.orgAuthPwd = function(pwd)
{
	var strDe = "RDpbLfCPsJZ7fiv";
	var dic = "yLwVl0zKqws7LgKPRQ84Mdt708T1qQ3Ha7xv3H7NyU84p21BriUWBU43odz3iP4rBL3cD02KZciX"+
			  "TysVXiV8ngg6vL48rPJyAUw0HurW20xqxv9aYb4M9wK1Ae0wlro510qXeU07kV57fQMc8L6aLgML"+
			  "wygtc0F10a0Dg70TOoouyFhdysuRMO51yY5ZlOZZLEal1h0t9YQW0Ko7oBwmCAHoic4HYbUyVeU3"+
			  "sfQ1xtXcPcf1aT303wAQhv66qzW";

	return this.securityEncode(pwd, strDe, dic);
};

$.su.securityEncode = function(input1, input2, input3)
{
	var dictionary = input3;
	var output = "";
	var len, len1, len2, lenDict;
	var cl = 0xBB, cr = 0xBB;

	len1 = input1.length;
	len2 = input2.length;
	lenDict = dictionary.length;
	len = len1 > len2 ? len1 : len2;

	for (var index = 0; index < len; index++)
	{
		cl = 0xBB;
		cr = 0xBB;

		if (index >= len1)
		{
			cr = input2.charCodeAt(index);
		}
		else if (index >= len2)
		{
			cl = input1.charCodeAt(index);
		}
		else
		{
			cl = input1.charCodeAt(index);
			cr = input2.charCodeAt(index);
		}

		output += dictionary.charAt((cl ^ cr)%lenDict);
	}

	return output;
};

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }

// Augment the basic prototypes if they have not already been augmented.
// These forms are obsolete. It is recommended that JSON.stringify and
// JSON.parse be used instead.

    /*if (!Object.prototype.toJSONString) {
        Object.prototype.toJSONString = function (filter) {
            return JSON.stringify(this, filter);
        };
        Object.prototype.parseJSON = function (filter) {
            return JSON.parse(this, filter);
        };
    }*/
	$.su.json = {};
	$.su.json.toJSONString = function(str, filter){
		var userAgent = navigator.userAgent;
        var isOpera = userAgent.indexOf("Opera") > -1;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
        var json = JSON.stringify(str, filter);
        if(isIE){
        	var str1 = "";
			eval("var str1 = '"+json+"';");
			return str1;
        }else{
        	return json;
        }


	};

	$.su.json.parseJSON = function(str, filter){
		return JSON.parse(str, filter);
	};

}());

var check_error_code = function(error_code) {
	error_code = parseInt(error_code, 10);

	// 错误码是0或者负的五位十进制数
	return 0 == error_code || (-100000 < error_code && error_code <= -10000);
}

if ($.su.CHAR && $.su.CHAR.ERROR_CODE) {
	var handler = {
		get: function(target, name) {
			// console.log(name);
			if (check_error_code(name) == false) {
				console.error("错误码异常，请修改错误码", name);
			}
			var result = target[name];
			if (undefined == result) {
				console.error("错误码未定义", name);
			}
			return result;
		}
	}
	try {
		// 在代码中使用error code之前检查error code是否符合规范
		// 不规范的情况在控制台中输出错误，不影响程序运行
		$.su.CHAR.ERROR_CODE = new Proxy($.su.CHAR.ERROR_CODE, handler);
	} catch (error) {}
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (item, index) {
        var n = this.length, i = ~~index;
        if (i < 0)i += n;
        for (; i < n; i++)if (this[i] === item)return i;
        return -1;
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.15
// Reference: http://es5.github.io/#x15.4.4.15
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
		'use strict';

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		var n, k,
			t = Object(this),
			len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}

		n = len - 1;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) {
				n = 0;
			}
			else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}

		for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}

if (!Array.prototype.some){
	Array.prototype.some = function(fun /*, thisArg */){
		'use strict';

		if (this === void 0 || this === null) {
			try {
				throw new TypeError('no null');
			} catch(e) {
				console.log(e)
			}
		}


		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') {
			try {
				throw new TypeError('is not a function');
			} catch(e) {
				console.log(e)
			}

		}


		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++){
			if (i in t && fun.call(thisArg, t[i], i, t))
				return true;
		}

		return false;
	};
}

// 兼容IE8，在某些IE8没有开启控制台的时候，window没有console对象或只有其中某部分函数
// 重写console所有接口防止报错
window.console = window.console || {};
window.console.log = window.console.log || $.noop;
window.console.debug = window.console.debug || $.noop;
window.console.info = window.console.info || $.noop;
window.console.warn = window.console.warn || $.noop;
window.console.exception = window.console.exception || $.noop;
window.console.assert = window.console.assert || $.noop;
window.console.dir = window.console.dir || $.noop;
window.console.dirxml = window.console.dirxml || $.noop;
window.console.trace = window.console.trace || $.noop;
window.console.group = window.console.group || $.noop;
window.console.groupCollapsed = window.console.groupCollapsed || $.noop;
window.console.groupEnd = window.console.groupEnd || $.noop;
window.console.profile = window.console.profile || $.noop;
window.console.profileEnd = window.console.profileEnd || $.noop;
window.console.count = window.console.count || $.noop;
window.console.clear = window.console.clear || $.noop;
window.console.time = window.console.time || $.noop;
window.console.timeEnd = window.console.timeEnd || $.noop;
window.console.timeStamp = window.console.timeStamp || $.noop;
window.console.table = window.console.table || $.noop;
window.console.error = window.console.error || $.noop;
window.console.memory = window.console.memory || $.noop;
window.console.markTimeline = window.console.markTimeline || $.noop;
window.console.timeline = window.console.timeline || $.noop;
window.console.timelineEnd = window.console.timelineEnd || $.noop;

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function(obj) {
			if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

// 输入：{"key":{"opt_key1":"opt_val1","opt_key2":"opt_val2"}}
// 输出：{"opt_key1":"opt_val1","opt_key2":"opt_val2"}
// key是SLP封装的section_name，一般无法确定具体内容
$.su.get_uci_section = function(uci_section) {
	var result = {};
	for (var key in uci_section) {
		result = uci_section[key];
		break;
	}
	return result;
}

$.su.global = $.su.global || {};
$.su.global.new_module_list = $.su.global.new_module_list || [];
$.su.global.profile = $.su.global.profile || {};
$.su.initGlobalValue = function() {
	var _proxy = new $.su.Proxy({
		async: false
	});
	_proxy.query({
		"function": {
			name: "new_module_spec"
		},
		"profile": {"table":["global", "firmware"]}
	}, function(data) {
		var new_module_spec = data["function"].new_module_spec;
		$.su.global.new_module_list = new_module_spec.new_module_list;

		var profile = data["profile"];
		try {
			$.su.global.profile.firmware = $.su.get_uci_section(profile.firmware[0]);
			$.su.global.profile.global = $.su.get_uci_section(profile.global[0]);	
		} catch (e) {
			$.su.global.profile.firmware = {};
			$.su.global.profile.global = {};
		}
	})
}

$.su.isModuleSupport = function(module_name) {
	return $.su.global.new_module_list.indexOf(module_name) >= 0;
}

$.su.token_is_available = function() {
	var result = false;
	// 通过一个SLP请求判断当前token是否可用，接口能正常返回值表示可用
	// 使用proxy会自动跳转到登录页面，这里使用原生的ajax
	$.ajax({
		url: $.su.dsUrl(),
		type: "POST",
		dataType: "text",
		contentType: "application/json; charset=UTF-8",
		async: false,
		cache: false,
		data: '{"method":"get","function":{"name":"new_module_spec"}}',
		traditional: true,
		success: function(data, status, xhr) {
			data = JSON.parse(data, function(k, v){
				var val = v;
				if (typeof val === "string") {
					try {
						val = decodeURIComponent(val);
					}catch(ex){}
				}

				return val;
			});
			if (data.error_code == 0) {
				result = true;
			}
			else {
				result = false;
			}
		},
		error: function() {
			result = false;
		}
	});

	return result;
}

})(jQuery);
