// JavaScript Document
(function($){

$.search = $.search || {};

$.search.compare = {};

//tar表示搜索的目标值，source表示比较的对象,返回值等于0:比较匹配(字符串检测可能为包含)，

$.search.compare.string = function(source,tar)

{
	if (!source){
		if (tar == '-' || tar == '--' || tar == '---'){
			return true;
		}else{
			return false;
		}
	}

	tar = tar.toUpperCase();

	source = source.toUpperCase();



	if(source.indexOf(tar) >= 0)return true;

	else return false;

};



$.search.compare.stringStrict = function(source,tar)

{

	if (!source){
		if (tar == '-' || tar == '--' || tar == '---'){
			return true;
		}else{
			return false;
		}
	}

	tar = tar.toUpperCase();

	source = source.toUpperCase();



	if(tar == source) return true;

	else return false;

};



$.search.compare.num = function(source,tar)

{
	if (!$.su.vtype.types.number.regex.test(tar)){
		return false;
	}

	var source = parseInt(source,10);

	var tar = parseInt(tar,10);

	if (source == tar)

	{

		return true;

	}

	else

	{

		return false;

	}

}



$.search.compare.ip = function(source,tar)

{

	var tar_array = tar.split('.');

	var source_array = source.split('.');

	for (var i = 0; i < tar_array.length; i++)

	{

		if (tar_array[i] < source_array[i])

		{

			return 1;

		}

		else if(tar_array[i] > source_array[i])

		{

			return -1;

		}

	}

	return 0;

};



$.search.compare.ipLogic = function(IPstr1,IPstr2)//IP段匹配

{

	var string = (IPstr1.toString());

	var strSlice;

	if((strSlice = string.indexOf("-"))== -1)

	{

		/*RPM函数中必须选择IP字段 省略RPM函数对IP段的检查，默认是对的*/

		var subStr1 = ipmodify(string);

		var subStr2 = ipmodify(string);

	}

	else{

		var subStr1 = ipmodify(string.slice(0,strSlice));

		var subStr2 = ipmodify(string.slice(strSlice+1));

	}

	var stringScan = (IPstr2.toString());

	var strSliceScan;

	if((strSliceScan = stringScan.indexOf("-"))== -1)

	{

		if(!ipVerify(stringScan,false))return false;	/*RPM函数中必须选择IP字段*/

		var subStrScan1 = ipmodify(stringScan);

		var subStrScan2 = ipmodify(stringScan);

	}

	else{

		var subStrScan1 = stringScan.slice(0,strSliceScan);

		var subStrScan2 = stringScan.slice(strSliceScan+1);

		if(!ipVerify(subStrScan1,false))return false;

		if(!ipVerify(subStrScan2,false))return false;



		subStrScan1 = ipmodify(subStrScan1);

		subStrScan2 = ipmodify(subStrScan2);

		//console.log(itemList.compare.ip(subStrScan1,subStrScan2))

		if($.search.compare.ip(subStrScan1,subStrScan2) < 0)

		{

			return false;

		};

	}

	/*******RPM函数IP段 起始IP:subStr1  结束IP:subStr2 搜索字符串 起始IP:subStrScan1 结束IP:subStrScan2*********/

	var ret = $.search.compare.ip(subStrScan1,subStr1);

	if(ret < 0)/*RPM函数起始IP比搜索字符串起始IP更大，说明不在范围内*/

	{

		return false;

	}



	ret = $.search.compare.ip(subStrScan2,subStr2);

	if(ret > 0)/*RPM函数结束IP比搜索字符串结束IP更小，说明不在范围内*/

	{

		return false;

	}

	return true;

};



$.search.compare.portLogic = function(strPort1,strPort2)

{

	var string = strPort1.toString().toUpperCase();

	var strCmp = strPort2.toString().toUpperCase();

	if(string == "N/A")

	{

		if(strCmp != "N/A")

		return false;

		else

		return true;

	}

    if( (parseInt(string,10) < 0) || (parseInt(strCmp,10) < 0))

    {

        return false;

    }

	/*端口为0时，特殊处理*/

	if((string == "0") || (string == "0-0"))

	{

		if((strCmp != "0") && (strCmp != "0-0"))

		return false;

		else

		return true;

	}

	var strSlice ;



	if((strSlice = string.indexOf("-"))== -1)

	{

		var subStr1 = portmodify(string);

		var subStr2 = portmodify(string);

	}

	else{

		var subStr1 = portmodify(string.slice(0,strSlice));

		var subStr2 = portmodify(string.slice(strSlice+1));

	}

	var stringScan = (strPort2.toString());

	var strSliceScan;



	if((strSliceScan = stringScan.indexOf("-"))== -1)

	{

		if(!portVerify(stringScan,false))return false;

		var subStrScan1 = portmodify(stringScan);

		var subStrScan2 = portmodify(stringScan);

	}

	else{

		var subStrScan1 = stringScan.slice(0,strSliceScan);

		var subStrScan2 = stringScan.slice(strSliceScan+1);

		if(!portVerify(subStrScan1,false))return false;

		if(!portVerify(subStrScan2,false))return false;

		subStrScan1 = portmodify(subStrScan1);

		subStrScan2 = portmodify(subStrScan2);

	}

	/*******RPM函数Port段 起始Port:subStr1  结束Port:subStr2 搜索字符串 起始Port:subStrScan1 结束Port:subStrScan2*********/

	if(parseInt(subStr1,10) > parseInt(subStrScan1,10)){	/*RPM函数起始Port比搜索字符串起始Port更大，说明不在范围内*/

	return false;

	}

	if(parseInt(subStr2,10) < parseInt(subStrScan2,10)){	/*RPM函数结束Port比搜索字符串结束Port更小，说明不在范围内*/

	return false;

	}

	return true;

};

$.search.compare.mac = function(mac){
	var err = false;
	/* MAC */
	if(mac == "FF-FF-FF-FF-FF-FF" || mac == "ff-ff-ff-ff-ff-ff")
	{
		err = "您输入了广播MAC地址，请输入单播MAC地址(XX-XX-XX-XX-XX-XX)！";
		return err;
	}

	var items = mac.split("-");
	if(items.length > 6)
	{
		err = "请输入正确的MAC地址格式(XX-XX-...)！";
		return err;
	}
	else if(items.length == 6)
	{
		if ($.su.vtype.types["mac"].validator(mac) == $.su.CHAR.VTYPETEXT.MULTI_MAC)
		{
			err = "您输入了多播MAC地址，请输入单播MAC地址(XX-XX-XX-XX-XX-XX)！";
			return err;
		}
	}

	for(var idx = 0; idx < items.length; idx ++)
	{
		// 01- 合法
		if((idx == items.length - 1) && items[idx] == "")
		{
			continue;
		}

		// 01-1 合法，01-g 非法
		if((idx == items.length - 1) && (items[idx].length == 1))
		{
			if($.su.vtype.types["ishex"].regex.test(items[idx][0]))
			{
				continue;
			}
			else
			{
				err = "请输入正确的MAC地址格式(XX-XX-...)！";
				return err;
			}
		}

		// 0-01 非法，00-01 合法
		if(items[idx].length != 2)
		{
			err = "请输入正确的MAC地址格式(XX-XX-...)！";
			return err;
		}

		// 00-0g非法，ff-ff合法
		if($.su.vtype.types["ishex"].regex.test(items[idx][0]) && $.su.vtype.types["ishex"].regex.test(items[idx][1]))
		{
		}
		else
		{
			err = "请输入正确的MAC地址格式(XX-XX-...)！";
			return err;
		}
	}

	return true;
};

$.search.compare.vlan = function(value){
	var err = false;
	/* VLAN */
	var pattern = /^\s*([-]{1,3})\s*$/;
	if (new $.su.vtype({vtype: "number", min: 1, max: 4094}).validate(value) != true && !pattern.exec(value)){
		err = "请输入正确的VLAN ID(1-4094)！";
		return err;
	}
	return true;
}

/* 把string转化成二维数组*/
$.search.compare.strToArray = function(str){
	if(typeof str != 'string') return false;

	var strArray = [];

	str = str.split(',');
	for(var i in str){
		var vlan = /(^[\d]+$)|(^([\d]+)-([\d]+)$)/.exec(str[i]);
		if(null == vlan) return false;
		else if(vlan[1]){
			strArray[vlan[1]] = true;
		}else if(vlan[2]){
			var low = Number(vlan[3]);
			var high = Number(vlan[4]);
			if (low > high){
				low = Number(vlan[4]);
				high = Number(vlan[3]);
			}
			for(var p = Number(low); p <= Number(high); p ++){
				strArray[p] = true;
			}
		}
	}

	return strArray;
};

//字义搜索，搜索区间的某个数字
$.search.compare.num_interval = function(source,tar){
	if (!$.su.vtype.types.number.regex.test(tar)){
		return false;
	}
	var vlan_array = $.search.compare.strToArray(source);
	//console.log(tar, vlan_array[tar])
	if (vlan_array[tar]){
		return true;
	}
	return false;
}

$.search.real_value = {};

$.search.real_value.vlan = function(text) {
	return "" + (parseInt(text) || 0);
}

$.su.Widget("search", {
	defaults: {
		text: "",
		//icon: "",
		iconCls: "",

		enableToggle: false,
		toggleHander: null,	//function(state)

		pressedCls: "pressed",
		pressed: false, /*/false 这个属性动态设置！*/

		cls: "",
		btnCls: "",
		fieldLabel: null,
		isSearchingValue: ""
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var tar = $(obj);
			$.extend(obj, defaults, options);

			var scan_page = tar.find('div.scan_page_content_container');
			scan_page.find("input#slt_name").combobox({
				fieldLabel: "列名",
				allowBlank:false,
				labelCls:"xxxs",
				items:[

				]
			}).on('ev_change', function(e, oldValue, newValue){
					//console.log("slt_name changed, old:", oldValue, "new:", newValue);
					//console.log("slt_name change");
					me.search("setScanContent", newValue.toString());
				    obj.isSearchingValue = newValue.toString();
			});
			scan_page.find("input#scan_content").textbox({
				fieldLabel: "内容",
				//allowBlank:false,
				labelCls:"xxxs"
			});
			scan_page.find("input#slt_method").combobox({
				fieldLabel: "方式",
				allowBlank:false,
				labelCls:"xxxs",
				items:[
					{value:1, name: "在结果中搜索", selected: true},
					{value:0, name: "在当前页面所有条目中搜索"}
				]
			});
			scan_page.find("input#slt_status").combobox({
				fieldLabel: "状态",
				allowBlank:false,
				labelCls:"xxxs",
				items:[
					{value:2, name: "全部", selected: true},
					{value:1, name: "已启用"},
					{value:0, name: "已禁用"}
				]
			});
			scan_page.delegate("button#scan_do_scan", "click", function (e) {
                me.search("searchData", e);
            });
			scan_page.delegate("button#scan_show_all", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var obj = me.get(0);
				//console.log("scan_show_all click");
				if (obj._type == "all"){
					var params = {};
					var store = obj.grid.get(0).store;
					var paging = obj.grid.get(0).paging;
					if (paging){
						paging.search = false;//显示全部后，paging控件跳转时不再携带全局搜索参数
						paging.currentPage = 0;
					}
					if (undefined != store.pagingField)
					{
						$.each(store.pagingField, function(i, el){
							params[el] = store.pagingField[el];
						});
					}
					store.load(params);
					obj.grid.grid("disGridHeaderChkbox");
					if (obj.render_show){
						obj.render_show.call();
					}
					obj.grid.get(0).searchMsg.find("span.searching-hint").html('已显示全部');
					me.css("z-index", "997");
					obj.grid.get(0).searchMsg.msg("show");
					return false;
				}
				me.search("showAllItems");
			});
			scan_page.delegate("button#scan_return", "click", function(e){
				e.stopPropagation();
				e.preventDefault();
				//console.log("scan_return click");
				/*防止combobox没有收上去*/
				var comboboxList = me.find("div.combobox-container");
				comboboxList.each(function(i, obj){
					var switchBtn = $(obj);
					var wrap = switchBtn.find("div.combobox-list-wrap"),
						container = switchBtn.closest("div.combobox-container");
					wrap.fadeOut(500);
					wrap.attr("toggleflag", "hidden");
					container.removeClass("focus")
				});
				me.msg("close");
			});

            // 搜索可以响应焦点在输入框内时使用enter键搜索
            scan_page.delegate('#scan_content', 'keydown', function (event) {
                var e = event || window.event ||arguments.callee.caller.arguments[0];
                if (e.keyCode === 13) {
                    e.preventDefault();
                    me.search("searchData", e);
                }
            });
		});

		me.Drags({handler: '.msg-header'});
		return me;
	},
	showPopUpScan : function(me){
		var me = me || this,
			obj = me.get(0);

		if(me.is(":hidden")){
			me.msg("show");
		}

		/*初始化搜索方法*/
		if (obj._type == "all"){
			me.find("#slt_method").combobox('hide');
			me.find("div.scan_btn_container").css("top", "38px");
		}else if (obj._type == "page"){
			me.find("div.scan_btn_container").css("top", "56px");
		}

		/*初始化状态下拉框*/
		me.find("#slt_status").combobox("setValue", 2);
		if (($(obj.grid.get(0).operation).find("a.btn-enable").length == 0 &&
			$(obj.grid.get(0).operation).find("a.btn-disable").length == 0) || (obj._type == "all")){
			me.find("#slt_status").combobox("hide");
		}
		else
		{
			me.find("#slt_status").combobox("show");//p_scan_status.style.display = '';
		}

		/*****初始化列名，value需跟store中的field对应*****start*****/
		var columns = obj.grid.get(0).columns;
		var scan_slt_name = [];
		for (var index = 0; index < columns.length; index++){
			var column = columns[index];
			if (column.xtype == "globalSearch" && "all" == obj._type){
				if (column.render_search){
					obj.render_search = column.render_search;
				}
				if (column.render_show){
					obj.render_show = column.render_show;
				}
				if (column.render_return){
					obj.render_return = column.render_return;
				}

				scan_slt_name = [];
				for (var idx = 0; idx < column.columns.length; idx++){
					var col = column.columns[idx];
					if(col.hidden)continue;
					scan_slt_name.push({value:col.dataIndex, name:col.text});
				}
				break;
			}
			if(column.hidden){
				continue;
			}
			switch (column.xtype){
				case "checkcolumn":
				case "rownumberer":
				case "settings":
					break;
				case "statuscolumn":
					obj.status_name = column.dataIndex;
					break;
				case "globalSearch":
					if ("all" != obj._type){
						break;
					}
					scan_slt_name = [];
					for (var idx = 0; idx < column.columns.length; idx++){
						var col = column.columns[idx];
						scan_slt_name.push({value:col.dataIndex, name:col.text});
					}
					break;
				default:
					if (column.scan){
						scan_slt_name.push({value:column.name || column.dataIndex, name:column.text});
					}
					break;
			}
		}
		me.find("input#slt_name").combobox("loadData", scan_slt_name);
		if (scan_slt_name.length != 0){
			if (obj.isSearchingValue) {
				me.find("input#slt_name").combobox("select", obj.isSearchingValue);
			} else {
				me.find("input#slt_name").combobox("select", scan_slt_name[0].value);
			}
		}
		/*****初始化列名*****end*****/

		/*****初始化内容*****start*****/
		//me.search("setScanContent");
		/*****初始化内容*****end*****/

		//初始化方法
		me.find("input#slt_method").combobox("setValue", 1);

		return me;
	},
	setScanContent: function(me, param){
		var me = me || this,
			obj = me.get(0),
			slt_name_id = "input#" + param[1],
			type = "textbox";
		//修改scan_content,变为textbox或者是combobox
		//console.log("slt_name_id is", slt_name_id);

		// 将scan_content恢复为input
		var scan_content_obj = me.find("input#scan_content");
		if (scan_content_obj.closest("div.text-container").length != 0){
			scan_content_obj.closest("div.text-container").replaceWith("<input id = \"scan_content\">");//(scan_content_obj);
		}else if (scan_content_obj.closest("div.combobox-container").length != 0){
			scan_content_obj.closest("div.combobox-container").replaceWith("<input id = \"scan_content\">");//(scan_content_obj.removeClass("hidden combobox-value").prop("disabled", false));
		}

		scan_content_obj = me.find("input#scan_content");
		var slt_name_obj = $(me.get(0).grid.get(0).editor).find(slt_name_id);
		// 重新初始化scan_content
		// version 0.0.2
		var columns = obj.grid.get(0).columns;
		if ("all" == obj._type){
			for (var index = 0; index < columns.length; index++){
				var column = columns[index];
				if (column.xtype == "globalSearch"){
					columns = column.columns;
					break;
				}
			}
		}
		for (var index = 0; index < columns.length; index++){
			var column = columns[index];
			if (param[1] == column.dataIndex || param[1] == column.name){
				//console.log(slt_name_id, " found.");
				if (column.scan && column.scan.type){
					type = column.scan.type;
				}else{
					if (slt_name_obj.closest("div.text-container").length != 0){
						type = "textbox";
					}else if (slt_name_obj.closest("div.combobox-container").length != 0){
						type = "combobox";
					}
				}

				//部分搜索项未定义check函数，防止上一个搜索项的check函数作用与下一个搜索项
				if (obj.scan_check){
					obj.scan_check = false;
				}

				if (column.scan && column.scan.check){
					obj.scan_check = column.scan.check;
				}

				if (obj.real_value) {
					obj.real_value = false;
				}

				if (column.scan && column.scan.real_value) {
					obj.real_value = column.scan.real_value;
				}

				//全局搜索类型
				if (column.scan && column.scan.vtype){
					obj.scan_vtype = column.scan.vtype;
				}
				obj.scan_cmp = (column.scan && column.scan.cmp ? column.scan.cmp : $.search.compare.string);
				if (type == "textbox"){
					scan_content_obj.textbox({
						fieldLabel: "内容",
						//allowBlank:false,
						labelCls:"xxxs"
					});
				}else if (type == "combobox"){
					var scan_content_items = [{value: "test", name: "test", selected: true}];
					if (column.scan){
						if (typeof column.scan.items == "function"){
							scan_content_items = column.scan.items.call();
						}else{
							scan_content_items = column.scan.items;
						}
					}
					//scan_content_items = (column.scan ? column.scan.items : []);
					if (scan_content_items != undefined && scan_content_items.length != 0){
						scan_content_items[0].selected = true;
					}
					scan_content_obj.combobox({
						fieldLabel: "内容",
						allowBlank:false,
						labelCls:"xxxs",
						items: scan_content_items
					});
				}
				break;
			}
		}

		return me;
	},
	scan : function(me, params){
		var me = me || this,
			obj = me.get(0),
			data = obj.grid.get(0).store.data,
			content = params[1],
			name = params[2],
			status = params[3],
			method = params[4],
			cmp = params[5];
		var index_list = {};
		var status_value = {on:"1", off:"0"};//页面中存储状态的值可能是on/off,而不是1/0.

		//未输入content的状态
		if (content == ''){
			if (method == "1"){
				//在结果中搜索, data与rows是一一对应的
				for (var index = 0, len = data.length; index < len; index++){
					var data_status = data[index][obj.status_name].toString();
					data_status = (status_value[data_status] ? status_value[data_status] : data_status);
					if (data_status == status && !obj.grid.get(0).rows[index].is(":hidden")){
						index_list[index] = 1;
					}
				}
			}
			else{
				//在所有条目中搜索
				for (var index = 0, len = data.length; index < len; index++){
					var data_status = data[index][obj.status_name].toString();
					data_status = (status_value[data_status] ? status_value[data_status] : data_status);
					if (data_status == status){
						index_list[index] = 1;
					}
				}
			}

			return index_list;
		}

		cmp = (typeof cmp == 'function') ? cmp : $.search.compare.string;
		//content有内容的情况
		if (method == "1"){
			//在结果中搜索
			for (var index = 0, len = data.length; index < len; index++){
				//如果在搜索结果里,在页面里已经显示
				var result = cmp.call(this, data[index][name], content, index);
				var data_status;
				if (status != "2"){
					data_status = data[index][obj.status_name].toString();
					data_status = (status_value[data_status] ? status_value[data_status] : data_status);
				}
				if ((result === 0 || result === true) && (status == "2" || data_status == status) && !obj.grid.get(0).rows[index].is(":hidden")){
					index_list[index] = 1;
				}
			}
		}
		else{
			//在所有条目中搜索
			for (var index = 0, len = data.length; index < len; index++){
				var result = cmp.call(this, data[index][name], content, index);
				//console.log(result);
				var data_status;
				if (status != "2"){
					data_status = data[index][obj.status_name].toString();
					data_status = (status_value[data_status] ? status_value[data_status] : data_status);
				}
				if ((result === 0 || result === true) && (status == "2" || data_status == status)){
					//console.log(11);
					index_list[index] = 1;
				}
			}
		}

		return index_list;
	},
	showScanResult : function(me, param){
		//如果没有搜索结果
		var me = me || this,
			is_empty = true,
			index_list = param[1],
			obj = me.get(0),
			rows = obj.grid.get(0).rows;

		for (var attr in index_list){
			is_empty = false;
			break;
		}

		if (is_empty){
			//提示未搜索到内容
			obj.grid.get(0).searchMsg.find("span.searching-hint").html('未搜索到结果！');
			me.css("z-index", "997");
			obj.grid.get(0).searchMsg.msg("show");
			//alert('未搜索到结果！');
			return false;
		}

		//如果有搜索结果
		for (var i = 0, index = 0; i < rows.length ; i++){
			var row = rows[i];
			if (i in index_list){
				row.css("display", "");
				index = index + 1;
				row.find("span.grid-row-numberer").html(index);
				//document.getElementById(index).style.display = '';
			}
			else{
				row.css("display", "none");
				//document.getElementById(index).style.display = 'none';
			}
		}

		obj.grid.get(0).searchMsg.find("span.searching-hint").html('共搜索到' + index + '个结果');
		me.css("z-index", "997");
		obj.grid.get(0).searchMsg.msg("show");


		var rows_show = obj.grid.find("tr.grid-content-tr:not(:hidden):has(td.grid-content-td-check-column:not(.disabled))");
		var rows_checked = rows_show.has(".checked");
		if (rows_show.length == rows_checked.length && rows_show.length != 0){
			//全选键
			var label = obj.grid.find("tr.grid-header-tr label.checkbox-label");//.closest("div.checkbox-group-container");//.closest("");
			var container = label.closest("div.checkbox-group-container");
			if (!container.hasClass("selected")){
				container.addClass("selected");
				label.find("input[type=checkbox]").prop("checked", true);
				label.addClass("checked");
			}
		}

		return true;
	},
	showAllItems : function(me){
		var me = me || this,
			obj = me.get(0),
			rows = obj.grid.get(0).rows;

		for (var i = 0 ; i < rows.length ; i++){
			var row = rows[i];
			row.css("display", "");
			row.find("span.grid-row-numberer").html(i+1);
		}

		obj.grid.get(0).searchMsg.find("span.searching-hint").html('已显示全部');
		me.css("z-index", "997");
		obj.grid.get(0).searchMsg.msg("show");

		var rows_show = obj.grid.find("tr.grid-content-tr:not(:hidden):has(td.grid-content-td-check-column:not(.disabled))");
		var rows_checked = rows_show.has(".checked");
		if (rows_show.length != rows_checked.length){
			obj.grid.grid("disGridHeaderChkbox");
		}

		return true;
	},
    searchData: function (me, param) {
	    var e = param[1];
            e.stopPropagation();
            e.preventDefault();

            var obj = me.get(0);
            //console.log("scan click");
            //搜索按钮
            var name = me.find("input#slt_name").combobox("getValue").toString();
            var method = me.find("input#slt_method").combobox("getValue").toString();
            var status = me.find("input#slt_status").combobox("getValue").toString();
            var content = "";

            var scan_content_obj = me.find("input#scan_content");
            if (scan_content_obj.closest("div.text-container").length != 0){
                content = scan_content_obj.textbox("getValue").toString();
            }else if (scan_content_obj.closest("div.combobox-container").length != 0){
                content = scan_content_obj.combobox("getValue").toString();
            }
            //console.log("name", name, "method", method, "status", status, "content", content);

            if (content == '' && status == '2')
            {
                //未输入content同时选择状态为“全部”
                obj.grid.get(0).searchMsg.find("span.searching-hint").html('请输入搜索条件！');
                me.css("z-index", "997");
                obj.grid.get(0).searchMsg.msg("show");
                return false;
            }

            //主要针对mac地址、vlan做格式检查
            if (obj.scan_check){
                var chk_result = obj.scan_check.call(this, content);
                if (true != chk_result){
                    obj.grid.get(0).searchMsg.find("span.searching-hint").html(chk_result);
                    me.css("z-index", "997");
                    obj.grid.get(0).searchMsg.msg("show");
                    return false;
                }
            }

            //全局搜索，结束后直接退出不再执行局部搜索
            if (obj._type == "all"){
                var params = {};
                var store = obj.grid.get(0).store;
                var paging = obj.grid.get(0).paging;
                var postData = {};
                var moduleName = store.parseKey.moduleName;
                var tableName = store.parseKey.tableName;

                // 某些字段显示的值和实际值不一样
                // 比如vlan如果不指定的话会显示 --- 但是实际应该是0
                // 这里替换成实际的值去后台查找
                if (obj.real_value) {
                    content = obj.real_value(content);
                }

                //搜索参数
                params[name] = content;

                /* 全局搜索时根据各模块情况自己判断是否无视分组，所以搜索时参数仍携带group_id */
                //自定义全局参数，比如groupId
                if (store.ignorePagingFieldWhenSerching != true && undefined != store.pagingField)
                {
                    $.each(store.pagingField, function(i, el){
                        params[el] = store.pagingField[el];
                    });
                }

                postData[moduleName] = {};
                postData[moduleName]["table"] = tableName;
                postData[moduleName]["filter"] = [params];
                if(paging.numPerPage)postData[moduleName]["para"] = {start:0, end:paging.numPerPage-1};
                store.proxy.query(postData, function(data, others, status, xhr){
                    others = {};
                    others.count = data[moduleName]["count"][tableName];

                    data = store.dataFormat(data, true);

                    if (others.count == 0){
                        //提示未搜索到内容
                        obj.grid.get(0).searchMsg.find("span.searching-hint").html('未搜索到结果！');
                        me.css("z-index", "997");
                        obj.grid.get(0).searchMsg.msg("show");
                        return false;
                    } else {
                        obj.grid.get(0).searchMsg.find("span.searching-hint").html('共搜索到' + others.count + '个结果');
                        me.css("z-index", "997");
                        obj.grid.get(0).searchMsg.msg("show");
                    }
                    obj.grid.grid("disGridHeaderChkbox");
                    store.loadData(data, others, false, function(data){
                        if (paging){
                            paging.totalNum = others.count;
                            paging.currentPage = 0;

                            if (obj.grid.get(0).isPagingTrue == 1) {
                                $(paging).paging_true("updateBtns");
                                $(paging).paging_true("displayPage");
                            }else {
                                $(paging).paging("updateBtns");
                                $(paging).paging("displayPage");
                            }

                            paging.search = true;
                            paging.params = params;
                            //console.log("set paging search flag.");
                        }
                    });

                    $(store).trigger("ev_load", [store, data]);
                    obj.grid.trigger("ev_searchFinished");
                    if (obj.render_search){
                        obj.render_search.call();
                    }
                });

                return false;
            }

            //局部搜索
            var index_list = me.search("scan", content, name, status, method, obj.scan_cmp);
            me.search("showScanResult", index_list);

            return false;
    }
});

$.su.Widget("log_search", {
	defaults: {
		text: "",
		//icon: "",
		iconCls: "",

		enableToggle: false,
		toggleHander: null,	//function(state)

		pressedCls: "pressed",
		pressed: false, /*/false 这个属性动态设置！*/

		cls: "",
		btnCls: "",
		fieldLabel: null,
		isSearchingValue: "",

		default_time_lag: 3600*12*1000
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var tar = $(obj);
			$.extend(obj, defaults, options);

			var scan_page = tar.find('div.scan_page_content_container');
			var end_time = new Date().getTime();
			var start_time = end_time - obj.default_time_lag;
			var start_time_obj = scan_page.find("input#start_time").textbox({
				fieldLabel: "开始时间",
				allowBlank:false,
				labelCls:"xs",
				value: me.log_search.getFormatTime(start_time)
			});
			var end_time_obj =scan_page.find("input#end_time").textbox({
				fieldLabel: "结束时间",
				allowBlank:false,
				labelCls:"xs",
				value: me.log_search.getFormatTime(end_time)
			});
			/*初始化时间选择插件 */
			var start_time_picker = scan_page.find("div#input_start_time").datetimepicker({
				date: new Date(start_time),
				viewMode: 'YMDHMS',
				firstDayOfWeek: 0,
				onDateChange: function(me){
					start_time_obj.textbox({
						value: this.getText("YYYY-MM-DD HH:mm:ss"),
					});
				},
				onClose: function(){
					this.element.remove();
				},
				onOk: function(){
					this.element.hide();
				}
			});
			start_time_picker.element.hide();

			var end_time_picker = scan_page.find("div#input_end_time").datetimepicker({
				date: new Date(end_time),
				viewMode: 'YMDHMS',
				firstDayOfWeek: 0,
				onDateChange: function(me){
					end_time_obj.textbox({
						value: this.getText("YYYY-MM-DD HH:mm:ss"),
					});
				},
				onClose: function(){
					this.element.remove();
				},
				onOk: function(){
					this.element.hide();
				}
			});
			end_time_picker.element.hide();

			start_time_obj.click(function(){
				start_time_picker.element.show();
			});
			scan_page.click(function(e){
				var e = e || window.event;
				var elem = e.target || e.srcElement;
				 while(elem){
					if (elem.id && elem.id == 'input_start_time'){
						return;
					}
					elem = elem.parentNode;
				}
				start_time_picker.element.hide();
			});
			end_time_obj.click(function(){
				end_time_picker.element.show();
			});
			scan_page.click(function(e){
				var e = e || window.event;
				var elem = e.target || e.srcElement;
				while(elem){
					if (elem.id && elem.id == 'input_end_time'){
						return;
					}
					elem = elem.parentNode;
				}
				end_time_picker.element.hide();
			});
			tar.find("div.msg-header").click(function (){
				start_time_picker.element.hide();
				end_time_picker.element.hide();
			});

			var scan_table = scan_page.find("table.search_conditions").find("tbody#search_conditions_content");
			var columns = obj.grid.get(0).columns;
			var scan_slt_name = [];
			for (var index = 0; index < columns.length; index++){
				var column = columns[index];
				if (column.xtype == "globalSearch" && "all" == obj._type){
					if (column.render_search){
						obj.render_search = column.render_search;
					}
					if (column.render_show){
						obj.render_show = column.render_show;
					}
					if (column.render_return){
						obj.render_return = column.render_return;
					}

					scan_slt_name = [];
					for (var idx = 0; idx < column.columns.length; idx++){
						var col = column.columns[idx];
						if(col.hidden)continue;
						if(col.scan){
							scan_slt_name.push({value:col.dataIndex, name:col.text, scan:col.scan});
						}
					}
					break;
				}
			}

			condition_num = 0;
			while(condition_num < scan_slt_name.length){
				var condition_form = "";

				if(condition_num + 1 < scan_slt_name.length){
					condition_form += "<tr>";
					condition_form += 	"<td><input id = \""+scan_slt_name[condition_num].value+"\"></td>";
					condition_form += 	"<td><input id = \""+scan_slt_name[condition_num+1].value+"\"></td>";
					condition_form +=  "</tr>";
					condition_num += 2
				}else{
					condition_form += "<tr>";
					condition_form += 	"<td><input id = \""+scan_slt_name[condition_num].value+"\"></td>";
					condition_form += "</tr>";
					condition_num += 1;
				}
				scan_table.append(condition_form);
			}

			for(index = 0; index < scan_slt_name.length; index++){
				if(scan_slt_name[index].scan.type == "textbox"){
					scan_table.find("input#"+scan_slt_name[index].value).textbox({
						fieldLabel: scan_slt_name[index].name,
						labelCls:"xs"
					});
				}else if(scan_slt_name[index].scan.type == "combobox"){
					var scan_content_items = [{value: "test", name: "test"}];
					if(typeof scan_slt_name[index].scan.items == "function"){
						scan_content_items = scan_slt_name[index].scan.items.call();
					}else{
						scan_content_items = scan_slt_name[index].scan.items;
					}
					//console.log(scan_content_items[scan_content_items.length-1].value);
					if (scan_content_items != undefined && scan_content_items.length != 0){
						if(scan_content_items[scan_content_items.length-1].value != ''){
							scan_content_items.push({name:"---",value:'',select:true});
							//scan_content_items[0].selected = true;
						}
					}
					scan_table.find("input#"+scan_slt_name[index].value).combobox({
						fieldLabel: scan_slt_name[index].name,
						allowBlank:true,
						readOnly:false,
						labelCls:"xs",
						items: scan_content_items
					});
				}else if(scan_slt_name[index].scan.type == "multiSelect"){
					if(typeof scan_slt_name[index].scan.items == "function"){
						scan_content_items = scan_slt_name[index].scan.items.call();
					}else{
						scan_content_items = scan_slt_name[index].scan.items;
					}
					scan_table.find("input#"+scan_slt_name[index].value).multiSelect({
						fieldLabel: scan_slt_name[index].name,
						items: scan_content_items
					});
				}
			}

			scan_page.delegate("button#scan_do_scan", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var obj = me.get(0);
				//console.log("scan click");
				//搜索按钮
				var param = {};
				var start_time_obj = me.find("input#start_time");
				var start_time_str = "";
				start_time_str = start_time_obj.textbox("getValue");
				var post_start_time = (new Date(start_time_str.replace(/-/g, "/")).getTime()/1000);

				var end_time_obj = me.find("input#end_time");
				var end_time_str = "";
				end_time_str = end_time_obj.textbox("getValue").toString();
				var post_end_time = (new Date(end_time_str.replace(/-/g, "/")).getTime()/1000);

				if (post_end_time - post_start_time <= 0){
					obj.grid.get(0).searchMsg.find("span.searching-hint").html('请输入正确的时间范围');
					me.css("z-index", "997");
					obj.grid.get(0).searchMsg.msg("show");
					return false;
				}
				else if (post_end_time - post_start_time > 950399){
					obj.grid.get(0).searchMsg.find("span.searching-hint").html('搜索支持的最大时间范围为10天');
					me.css("z-index", "997");
					obj.grid.get(0).searchMsg.msg("show");
					return false;
				}

				param["start_time"]=post_start_time.toString();
				param["end_time"]=post_end_time.toString();

				for(var index = 0; index < scan_slt_name.length; index++){
					var name = scan_slt_name[index].value;
					var content = "";
					var scan_content_obj = me.find("input#"+name);
					if (scan_content_obj.closest("div.text-container").length != 0){
						content = scan_content_obj.textbox("getValue").toString();
					}else if (scan_content_obj.closest("div.combobox-container").length != 0){
						content = scan_content_obj.combobox("getValue").toString();
					}
					if ((content == '') || (content == '---')){
						continue;
					}
					param[name]=content;
				}
				//console.log("name", name, "method", method, "status", status, "content", content);

				//全局搜索
				if (obj._type == "all"){
					var store = obj.grid.get(0).store;
					var paging = obj.grid.get(0).paging;
					var postData = {};
					var moduleName = store.parseKey.moduleName;
					var tableName = store.parseKey.tableName;

					start_time_picker.element.hide();
					end_time_picker.element.hide();

					postData[moduleName] = {};
					postData[moduleName]["table"] = tableName;
					postData[moduleName]["filter"] = [param];
					if(paging.numPerPage)postData[moduleName]["para"] = {start:0, end:paging.numPerPage-1};
					me.log_search.runWaitingBar();
					store.proxy.query(postData, function(data, others, status, xhr){
						others = {};
						others.count = data[moduleName]["count"][tableName];

						data = store.dataFormat(data, true);

						if (others.count == 0){
							//提示未搜索到内容
							me.log_search.hideWaitingBar();
							obj.grid.get(0).searchMsg.find("span.searching-hint").html('未搜索到结果！');
							me.css("z-index", "997");
							obj.grid.get(0).searchMsg.msg("show");
							return false;
						} else {
							me.log_search.hideWaitingBar();
							obj.grid.get(0).searchMsg.find("span.searching-hint").html('共搜索到' + others.count + '个结果');
							me.css("z-index", "997");
							obj.grid.get(0).searchMsg.msg("show");
						}
						obj.grid.grid("disGridHeaderChkbox");
						store.loadData(data, others, false, function(data){
							if (paging){
								paging.totalNum = others.count;
								paging.currentPage = 0;

								if (obj.grid.get(0).isPagingTrue == 1) {
									$(paging).paging_true("updateBtns");
									$(paging).paging_true("displayPage");
								}else {
									$(paging).paging("updateBtns");
									$(paging).paging("displayPage");
								}

								paging.search = true;
								paging.params = param;
								//console.log("set paging search flag.");
							}
						});

						$(store).trigger("ev_load", [store, data]);
						obj.grid.trigger("ev_searchFinished");
						if (obj.render_search){
							obj.render_search.call();
						}
					});

					return false;
				}

				return false;
			});
			scan_page.delegate("button#scan_show_all", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				start_time_picker.element.hide();
				end_time_picker.element.hide();

				var obj = me.get(0);
				//console.log("scan_show_all click");
				if (obj._type == "all"){
					var params = {};
					var store = obj.grid.get(0).store;
					var paging = obj.grid.get(0).paging;
					if (paging){
						paging.search = false;//显示全部后，paging控件跳转时不再携带全局搜索参数
						paging.currentPage = 0;
					}
					if (undefined != store.pagingField)
					{
						$.each(store.pagingField, function(i, el){
							params[el] = store.pagingField[el];
						});
					}
					store.load(params);
					obj.grid.grid("disGridHeaderChkbox");
					if (obj.render_show){
						obj.render_show.call();
					}
					obj.grid.get(0).searchMsg.find("span.searching-hint").html('已重置搜索');
					me.css("z-index", "997");
					obj.grid.get(0).searchMsg.msg("show");
					//显示全部后，清空搜索条件
					me.log_search("cleanSearchConditions");
					return false;
				}
			});
			scan_page.delegate("button#scan_return", "click", function(e){
				e.stopPropagation();
				e.preventDefault();
				//console.log("scan_return click");
				/*防止combobox没有收上去*/
				start_time_picker.element.hide();
				end_time_picker.element.hide();
				var comboboxList = me.find("div.combobox-container");
				comboboxList.each(function(i, obj){
					var switchBtn = $(obj);
					var wrap = switchBtn.find("div.combobox-list-wrap"),
						container = switchBtn.closest("div.combobox-container");
					wrap.fadeOut(500);
					wrap.attr("toggleflag", "hidden");
					container.removeClass("focus")
				});
				me.msg("close");
			});
		});
		me.Drags({handler: '.msg-header'});
		return me;
	},
	showPopUpScan : function(me){
		var me = me || this,
			obj = me.get(0);

		if(me.is(":hidden")){
			me.msg("show");
		}
		return me;
	},

	cleanSearchConditions: function(me){
		var me = me || this,
			obj = me.get(0);
		var end_time = new Date().getTime();
		var start_time = end_time - obj.default_time_lag;
		var start_time_obj = me.find("input#start_time");
		start_time_obj.textbox({
			value: me.log_search.getFormatTime(start_time)
		});
		var end_time_obj = me.find("input#end_time");
		end_time_obj.textbox({
			value: me.log_search.getFormatTime(end_time)
		});
		var search_condition_obj=me.find("table.search_conditions").find("tbody#search_conditions_content");
		search_condition_obj.find("input").each(function(){
			if ($(this).closest("div.text-container").length != 0){
				$(this).textbox({
					value: ""
				});
			} else if ($(this).closest("div.combobox-container").length != 0){
				/* $(this).closest("div.combobox-container").find("li.selected").removeClass("selected");
				$(this).closest("div.combobox-container").find("li.combobox-list:first").addClass("selected"); */
				$(this).combobox("reset");
			}
		});
	},

	getFormatTime: function(timestamp){
		var time = new Date(timestamp);
		//console.log(timestamp);
		//console.log(time);
		var year = time.getFullYear().toString();
		var month = ('0'+(time.getMonth()+1)).slice(-2);
		var day = ('0'+time.getDate()).slice(-2);
		var hour = ('0'+time.getHours()).slice(-2);
		var minute = ('0'+time.getMinutes()).slice(-2);
		var second = '00';
		var timeStr = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
		return timeStr;
	},

	runWaitingBar: function(){
		$('.scan_page_all_msg').hide();
		$('#log_cmd_bar_pro_div').msg('show');
		$('#log_cmd_pro').show();
		$("#mask").show();
		$('#cmd_pro_bar').waitingbar("run");
	},

	hideWaitingBar: function(){
		$('.scan_page_all_msg').hide();
		$('#cmd_pro_bar').waitingbar("stop");
		$('#cmd_pro_bar').waitingbar("reset");
		$('#log_cmd_pro').hide();
		setTimeout(function () {
			$('#log_cmd_bar_pro_div').msg('hide');
		}, 200);
		$("#mask").hide();
	}

});
})(jQuery);
