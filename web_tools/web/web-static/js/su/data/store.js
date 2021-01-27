// JavaScript Document
(function($){

$.su.Store = function(options){
	var defaults = {
		fields: null,
		xtype: "store",
		proxy: null,
		autoLoad: false,
		tag: "store",
		global: false,
		keyProperty: "key",
        	extraProperty: false,
		updateMode: "operation",	//"complete"
		keyLength: 0,
		loading: false,
		/*
		parseKey:
		{
			moduleName: xxx,
			tableName: xxx,
			pageSizeName: xxx,
			getFilter: function(){},
			setFilter: function(index, itemName, data){},
			delFilter: function(itemNames, data, indexes){}
		},
		*/
		parseKey: null,

		//指定位置插入参数
		isAppointIndex: false,
		appointIndex: 0,
        orderSensitive: '',
		startNumPerPage: null
	};

	var settings = $.extend({}, defaults, options);

	/*if (!settings.proxy){
		//console.error("Debug: store without proxy!");
		return null;
	}else*/
	if (settings.proxy){
		if (settings.proxy.isProxy !== true){
			//var proxyConfig = settings.proxy;
			settings.proxy = new $.su.Proxy(settings.proxy);
		};
	}else{
		settings.autoLoad = false;
	};

	if (!settings.fields || settings.fields.length === 0){
		//console.error("Debug: without fields or fields error!");
		return null;
	};

	if (settings.global == true){
		if (!settings.id){
			//console.error("You are init a global store, so you have to set an id for it!");
			return null;
		};
	};

	this.id = settings.id || $.su.randomId("store");
	this.init(settings);
};

$.su.Store.prototype.init = function(config){
	$.extend(this, config);

	this.data = [];
	this.snapshot = null;

	this.isStore = true;
	this.isSorted = false;

	if (this.autoLoad === true){
		this.load();
	};

	//初始化默认的事件监听，这里注释定义了传进去的参数个数
	//$(this).on("loads", function(e, store, records){});
	$(this).on("ev_datachanged", function(e, store, records){
		this.isSorted = false;
	});

	$.su.storeManager.add(this);
};

$.su.Store.prototype.getData = function(key){	//根据key值来返回数据
	var	data = this.data,
		keyProperty = this.keyProperty;

	if (!key){
		return undefined;
	};
	//console.log(this, key);
	var index = this.getIndex(key);
	if (index == undefined){
		return undefined;
	}else{
		return data[index];
	};

};

$.su.Store.prototype.getDataByIndex = function(index){
	var data = this.data;
	return data[index];
};

$.su.Store.prototype.getIndex = function(key){	//根据key值来返回index值，key属性由keyProperty定义，默认为key
	var	data = this.data,
		keyProperty = this.keyProperty;
	if (!key){
		return undefined;
	};

	for (var index = 0, len = data.length; index < len; index++){
		if (data[index][keyProperty].toString() == key.toString()){
			return index;
			break;
		};
	};

	return undefined;
};

$.su.Store.prototype.getItemName = function(key){	//根据key值来返回Item Name，key属性由keyProperty定义，默认为key
	var	data = this.data,
		keyProperty = this.keyProperty;
	//console.log(data, keyProperty);
	if (!key){
		return undefined;
	};

	for (var index = 0, len = data.length; index < len; index++){
		if (data[index][keyProperty].toString() == key.toString()){
			return data[index]["itemName"];
			break;
		};
	};

	return undefined;
};

$.su.Store.prototype.getKeyByIndex = function(index){
	var data = this.data;
	var keyProperty = this.keyProperty;
	var d = data[index];

	return d[keyProperty];
};

$.su.Store.prototype.getIndexs = function(keyArray){	//根据keyArray返回index的array
	var	data = this.data,
		keyProperty = this.keyProperty;

	if (keyArray.length == 0){
		return undefined;
	};

	var indexArray = [];
	for (var jndex = 0, jlen = keyArray.length; jndex < jlen; jndex++){
		for (var index = 0, len = data.length; index < len; index++){
			var key = keyArray[jndex];
			if (data[index][keyProperty].toString() == key.toString()){
				indexArray.push(index);
				break;
			};
		};
	};

	return indexArray;
};

$.su.Store.prototype.getItemNames = function(keyArray){	//根据keyArray返回itemName的array
	var	data = this.data,
		keyProperty = this.keyProperty;

	if (keyArray.length == 0){
		return undefined;
	};

	var itemNameArray = [];
	for (var jndex = 0, jlen = keyArray.length; jndex < jlen; jndex++){
		for (var index = 0, len = data.length; index < len; index++){
			var key = keyArray[jndex];
			if (data[index][keyProperty].toString() == key.toString()){
				itemNameArray.push(data[index]["itemName"]);
				break;
			};
		};
	};

	return itemNameArray;
};

$.su.Store.prototype.getValuesByKeys = function(keyArray, field, splitField, limit){	//根据keyArray返回指定field的array
	var retVal = {},
		data = this.data,
		keyProperty = this.keyProperty;

	if (keyArray.length == 0){
		return undefined;
	};

	var valArray = [];
	for (var jndex = 0, jlen = keyArray.length; jndex < jlen; jndex++){
		for (var index = 0, len = data.length; index < len; index++){
			var key = keyArray[jndex];
			var value = (undefined != data[index][field]) ? data[index][field].toString() : "";
			if (this.strEncode){
				var src_str = this.strEncode;
				if ($.isArray(src_str) && src_str.length > 0){
					for(var i = 0; i < src_str.length; i++){
						var esp_str = escape(src_str[i]);
						var reg= new RegExp(src_str[i],"g");
						value = value.replace(reg, esp_str);
					}
				}
				value = value.replace(/\&/g,"&amp;");
				value = value.replace(/\"/g,"&quot;");//解决IE8下传到lua的json字符串中双引号的出现时不是以\"形式出现的问题
				value = value.replace(/\'/g,"&#39;");
			}
			if (data[index][keyProperty].toString() == key.toString() && value != undefined){
				valArray.push(value);
				break;
			};
		};
		if (undefined != limit && valArray.length >= limit){
			break;
		}
	};

	retVal = valArray.join(splitField || ',');
	return retVal;
};

$.su.Store.prototype.getArrayByKeys = function(keyArray, field, limit){	//根据keyArray返回指定field的array
	var retVal = {},
		data = this.data,
		keyProperty = this.keyProperty;

	if (keyArray.length == 0){
		return undefined;
	};

	var valArray = [];
	for (var jndex = 0, jlen = keyArray.length; jndex < jlen; jndex++){
		for (var index = 0, len = data.length; index < len; index++){
			var key = keyArray[jndex];
			var value = (undefined != data[index][field]) ? data[index][field].toString() : "";
			if (this.strEncode){
				var src_str = this.strEncode;
				if ($.isArray(src_str) && src_str.length > 0){
					for(var i = 0; i < src_str.length; i++){
						var esp_str = escape(src_str[i]);
						value = value.replace(src_str[i], esp_str);
					}
				}
				value = value.replace(/\&/g,"&amp;");
				value = value.replace(/\"/g,"&quot;");//解决IE8下传到lua的json字符串中双引号的出现时不是以\"形式出现的问题
				value = value.replace(/\'/g,"&#39;");
			}
			if (data[index][keyProperty].toString() == key.toString() && value != undefined){
				valArray.push(value);
				break;
			};
		};
		if (undefined != limit && valArray.length >= limit){
			break;
		}
	};

	retVal = valArray;
	return retVal;
};

$.su.Store.prototype.getExtraKey = function(keyArray){	//根据keyArray返回辅助key的array
    var	data = this.data,
        keyProperty = this.keyProperty,
        extraProperty = this.extraProperty;

    if (keyArray.length == 0 || !extraProperty){
        return [];
    };

    var extraArray = [];
    for (var jndex = 0, jlen = keyArray.length; jndex < jlen; jndex++){
        for (var index = 0, len = data.length; index < len; index++){
            var key = keyArray[jndex];
            if (data[index][keyProperty].toString() == key.toString()){
                    if($.isArray(extraProperty)){
                    var tempData = [];
                    $.each(extraProperty, function(i, extra){
                        tempData.push(data[index][extra]);
                    });
                    extraArray.push(tempData);
                }
                else{
                    extraArray.push(data[index][extraProperty]);
                }
                break;
            };
        };
    };

    return extraArray;
};

$.su.Store.prototype.getItemNameByIndex = function(index){
	var data = this.data;

	return data[index]["itemName"];
}

//可注释 ， 带data是本地操作，无data是ajax操作
$.su.Store.prototype.insert = function(index, data, _callback, _callback_failed, _callback_error){
	var	jndex = (index == undefined || index == null) ? data.length-1 : index,
		store = this,
		postData = {},
		insertRecord = data;

	if (store.parseKey)
	{
		var moduleName = this.parseKey.moduleName;
		var tableName = this.parseKey.tableName;

		postData[moduleName] = {};
		postData[moduleName]["table"] = tableName;
		postData[moduleName]["para"] = this.sendDataFormat(data);
		if (this.current_item_key) {
			postData[moduleName]["name"] = this.current_item_key;
		}
		//console.log(this.grid, this, this.current_item_key);
	}
	else
	{
		//此处先放着,以后再添加处理方案
		alert("parseKey doesn't exist!");
		return;
	}

	if (store.isAppointIndex)
	{
		postData[moduleName]["insert_index"] = store.appointIndex;
		if (store.appointIndex > data.length - 1 || store.appointIndex < 0)
		{
			index = store.appointIndex > data.length - 1 ? data.length - 1 : 0;
		}
		else
		{
			index = store.appointIndex;
		}
	}

	var row_index = undefined;
    // 处理条目敏感情况下的参数
    if(store.orderSensitive && insertRecord[store.orderSensitive]){
        if (insertRecord[store.orderSensitive] > data.length - 1 || store.appointIndex < 0)
        {
            row_index = insertRecord[store.orderSensitive] > data.length - 1 ? data.length - 1 : 0;
        }
        else
        {
            row_index = insertRecord[store.orderSensitive];
        }
    }


	//opt[this.keyProperty] = "add";
	this.proxy.add(
	//  "method": "add",
    //  "params": $.extend({
    //       "index": jndex
    //    }, data, opt)
		postData
	, function(data, others, status, xhr){
		//if (!$.isArray(data)){
		//	data = [data];
		//};

		if (data.error_code != 0)
		{
			//此处也先放着
			return;
		}

		insertRecord = store.dataFormat(insertRecord);	//此处dataFormat是为了带上key

		var itemName = store.parseKey ? data[store.parseKey.moduleName]["name"] : "";

		if (store.updateMode == "operation"){
			store.insertData(jndex, itemName, insertRecord, function(jndex, data){
				if (_callback){
					_callback.call(store, jndex, data);	//暂时未知有什么用
				};
			});
		}else{
			store.loadData(insertRecord, others, false, function(data){
				if (_callback){
					_callback.call(store, data, others, status, xhr);
				};
			});
		}
		$(store).trigger("ev_insert", [insertRecord, others, row_index]);
	}, function(error, others){
		if (_callback_failed){
			_callback_failed.call(store, error, others);
		};
		$(store).trigger("ev_failed", ["insert", error, others]);
	}, function(xhr, status, type) {
		if (_callback_error){
			_callback_error.call(store, xhr, status, type);
		};
		$(store).trigger("ev_error", ["insert", xhr, status, type]);
	});
};
$.su.Store.prototype.load = function(data, _callback, _callback_failed, _callback_error){
	var store = this,
		data = data || {},
		filter = data["filter"] || {},
		para = data["para"] || {},
		postData = {};

	store.loading = true;

	if(store.gridRefreshDataFlag)
	{
		this.proxy.gridRefreshDataFlag = true;
	}
	else
	{
		this.proxy.gridRefreshDataFlag = false;
	}

	if(store.preHandleCb)
	{
		if(store.gridRefreshDataFlag)
		{
			window.storePreHandCbRefreshFlag = true;
			store.preHandleCb.call();
			window.storePreHandCbRefreshFlag = false;
		}
		else
		{
			store.preHandleCb.call();
		}
	}

	if (store.parseKey)
	{
		var moduleName = store.parseKey.moduleName;
		var tableName = store.parseKey.tableName;

		postData[moduleName] = {};
		postData[moduleName]["table"] = tableName;

		if (store.parseKey.getFilter)
		{
			var filterData = store.parseKey.getFilter();

			if (filterData)
			{
				postData[moduleName]["filter"] = filterData;
			}
		}

		/* 此处是为了解决load中直接传入filter的情况，该情况优先级比getFilter高 */
		if (undefined!= filter && !$.isEmptyObject(filter))
		{
			if (!$.isArray(filter))
			{
				filter = [filter];
			}

			postData[moduleName]["filter"] = filter;
		}

		/* 分页参数 */
		if (undefined!= para && !$.isEmptyObject(para))
		{
			postData[moduleName]["para"] = para;
		}
		else if (store.workingPage != undefined)
		{
			/* 在表格中若进行启用/禁用以及自定义动作时，需注意页数的转变，指定对应页数，否则会默认请求第一页数据 */
			var params = {};

			params.start = store.workingPage * store.workingNumPerPage;
			params.end = (store.workingPage + 1) * store.workingNumPerPage - 1;

			postData[moduleName]["para"] = params;
		}
		else if (store.parseKey.pageSizeName)
		{
			/* 若有pageSizeName,则可认为该Grid是可以设置每页条目数的，此时必须要获取对应条目数 */
			/* 既然没有指定，那就默认从0开始 */
			var queryProxy = new $.su.Proxy({async:false});
			queryProxy.query({global_config:{name: 'page_size'}}, function(data){

                var numPerPage = data['global_config']['page_size'][store.parseKey.pageSizeName] || store.startNumPerPage;
				numPerPage = numPerPage ? numPerPage : 10;

				var params = {start: 0, end: numPerPage - 1};

				postData[moduleName]["para"] = params;
			});
		}
	}
	else
	{
		//同上
		alert("parseKey is NULL");
		store.loading = false;
		return;
	}

	this.proxy.query(postData, function(data, others, status, xhr){
		others = {};
		others.count = data[moduleName]["count"][tableName];

		data = store.dataFormat(data, true);
		store.loadData(data, others, false, function(data){
			if (_callback){
				_callback.call(store, data, others, status, xhr);
			};
		});

		$(store).trigger("ev_load", [store, data]);

		store.loading = false;
		store.gridRefreshDataFlag = false;
		store.proxy.gridRefreshDataFlag = false;
	}, function(error, others){
		if (_callback_failed){
			_callback_failed.call(store, error, others);
		};
		$(store).trigger("ev_failed", ["load", error, others]);

		store.loading = false;
		store.gridRefreshDataFlag = false;
		store.proxy.gridRefreshDataFlag = false;
	}, function(xhr, status, type) {
		if (_callback_error){
			_callback_error.call(store, xhr, status, type);
		};
		$(store).trigger("ev_error", ["load", xhr, status, type]);

		store.loading = false;
		store.gridRefreshDataFlag = false;
		store.proxy.gridRefreshDataFlag = false;
	});
};
$.su.Store.prototype.update = function(key, data, _callback, _callback_failed, _callback_error){
	var keyProperty = this.keyProperty;

	if (key == undefined || key == null){
		return;
	};

	var index = this.getIndex(key),
		itemName = this.getItemName(key),
		dOld = this.getData(key),
		dNew = {},
		opt = {},
		store = this,
		updateRecord = data["updateData"],		//对于update, data通常只带一个参数, 即要update的那一行数据
		para = data["opt"] || {};
		postData = {};

	if (store.parseKey)	//此处暂未添加para参数的考虑
	{
		var moduleName = store.parseKey.moduleName;
		var tableName = store.parseKey.tableName;

		postData[moduleName] = {};

		if (store.parseKey.setFilter)
		{
			postData[moduleName]["table"] = tableName;
			postData[moduleName]["filter"] = store.parseKey.setFilter(index, itemName, data);
			if (!$.isEmptyObject(para))	//此处是为了解决只传enable或disable情况
			{
				$.extend(postData[moduleName], {para : this.sendDataFormat(para)});
			}
			else
			{
				$.extend(postData[moduleName], {para : this.sendDataFormat(updateRecord)});
			}
		}
		else
		{
			postData[moduleName][itemName] = this.sendDataFormat(updateRecord);
		}
	}
	else
	{
		//同上
		return;
	}

	opt[keyProperty] = key;
	this.proxy.modify(postData, function(data, others, status, xhr){

		//if (!$.isArray(data)){
		//	data = [data];
		//};
		//console.log("store update", key)
		$.extend(updateRecord, opt);	//附加id
		$.extend(dNew, dOld, updateRecord, opt);
		//data = store.dataFormat(data);
		if (data.error_code != 0)
		{
			//此处也先放着
			return;
		}

		if (store.updateMode == "operation"){
			store.updateData(key, dNew, function(key, data){
				if (_callback){
					_callback.call(store, key, data);
				};
			});
		}else{
			store.loadData(dNew, others, false, function(data){
				if (_callback){
					_callback.call(store, data);
				};
			});
		};

		$(store).trigger("ev_update", [store, updateRecord]);
	}, function(error, others){
		if (_callback_failed){
			_callback_failed.call(store, error, others);
		};
		$(store).trigger("ev_failed", ["update", error, others]);
	}, function(xhr, status, type) {
		if (_callback_error){
			_callback_error.call(store, xhr, status, type);
		};
		$(store).trigger("ev_error", ["update", xhr, status, type]);
	})
};

//批量编辑
$.su.Store.prototype.update_multi = function(key, data, _callback, _callback_failed, _callback_error){
	var	keyProperty = this.keyProperty;

	if (key == undefined || key == null){
		return;
	};
	var index = this.getIndex(key),
		itemName = this.getItemName(key);
		opt = {},
		store = this,
		updateRecord = data,
		postData = {};

	if (store.parseKey)	//此处暂未添加para参数的考虑
	{
		var moduleName = store.parseKey.moduleName;
		var tableName = store.parseKey.tableName;

		postData[moduleName] = {};
		postData[moduleName]["table"] = tableName;
	}
	else
	{
		return;
	}

	$.extend(postData[moduleName], data);

	opt[keyProperty] = key;
	opt["index"] = index;
	this.proxy.modify(postData, function(data, others, status, xhr){

		if (data.error_code != 0)
		{
			//此处也先放着
			return;
		}

		//此处先不考虑搜索选项对列表的影响，直接刷新表格
		if (_callback){
			_callback.call(store, data);
		};
		$(store).trigger("ev_update", [store, updateRecord]);

		//此处是为了触发表格刷新
		$(store).trigger("ev_mulit_edit_update", [key, index, data]);
	}, function(error, others){
		if (_callback_failed){
			_callback_failed.call(store, error, others);
		};
		$(store).trigger("ev_failed", ["update", error, others]);
	}, function(xhr, status, type) {
		if (_callback_error){
			_callback_error.call(store, xhr, status, type);
		};
		$(store).trigger("ev_error", ["update", xhr, status, type]);
	})
};

$.su.Store.prototype.remove = function(keyArray, data, _callback, _callback_failed, _callback_error){	//需要返回indexArray
	var	store = this,
		keyProperty = this.keyProperty,
		postData = {},
		removeArray = keyArray,
		items = [],
		me = this;

	if (!$.isArray(keyArray)){
		keyArray = [keyArray]
	};

	/* 不需要这段
	if (undefined != data){
		if (!$.isArray(data)){
			data = [data];
		};
		var tmpData = {};
		for (var index = 0, len = data.length; index < len; index++){
			var param = "value_" + data[index].toString(),
				fields = "";
			if (store.idSort){
				fields = store.getArrayByKeys(keyArray, data[index]).sort(function(a,b){return a-b;}).join(',');
			}else{
				fields = store.getValuesByKeys(keyArray, data[index], store.splitField);
			}
			tmpData[param] = fields;
		};
		data = tmpData;
	};

	var indexArray = this.getIndexs(keyArray),
        keyData = {
            "key": keyArray.join(","),
            "index": indexArray.join(",")
        },
        extraKeyArray = this.getExtraKey(keyArray);
	*/

	var itemNameArray = this.getItemNames(keyArray);
	var indexes = this.getIndexs(keyArray);
	$.each(indexes, function(_, index){
		items.push(me.getDataByIndex(index));
	});

	if (itemNameArray.length == 1)
	{
		itemNameArray = itemNameArray[0];
	}

	if (store.parseKey)
	{
		var moduleName = store.parseKey.moduleName;

		postData[moduleName] = {};

		if (store.parseKey.delFilter)
		{
			postData[moduleName]["table"] = store.parseKey.tableName;
			postData[moduleName]["filter"] = store.parseKey.delFilter(itemNameArray, data, items);
		}
		else
		{
			postData[moduleName]["name"] = itemNameArray;
		}
	}
	else
	{
		//同上
		return;
	}

	/* 目前来看，也不需要extraKey，先注释
    if(this.extraProperty && extraKeyArray.length){
        if($.isArray(this.extraProperty)){
            $.each(extraKeyArray, function(i, el){
                extraKeyArray[i] = el.join(";");
            });
        }
        $.extend(keyData, {"extraKey": extraKeyArray.join(",")});
    }
	*/
	//console.log(keyArray);
	this.proxy.del(postData, function(data, others, status, xhr){
		//console.log(data);
		if (store.updateMode == "operation"){
			/*
			if (data.length > 0){
				if (data[0][keyProperty]){
					//有key值的状态
					var keyArray = [];
					for (var index = 0, len = data.length; index < len; index++){
						if (data[index].success){
							var key = data[index][keyProperty];
							keyArray.push(key);
						};
					};
					store.removeDataByKey(keyArray);
				}else{
					//无key值的状态，返回index
					var indexArray = [];
					for (var jndex = 0, len = data.length; jndex < len; jndex++){
						if (data[jndex].success){
							var index = data[jndex]["index"];
							indexArray.push(parseInt(index, 10));
						};
					};
					store.removeDataByIndex(indexArray);
				};
			};
			*/
			store.removeDataByKey(removeArray);

			if (_callback){
				//_callback.call(store, removeArray, indexArray, data);
				_callback.call(store, removeArray, data);
			};
		}else{	//问题不大，先保留
			var d = store.dataFormat(data);
			store.loadData(d, others, false, function(data){
				if (_callback){
					_callback.call(store, data, others);
				};
			});
		}
		$(store).trigger("ev_remove", [data, others]);		//暂未找到
	}, function(error, others){
		if (_callback_failed){
			_callback_failed.call(store, error, others);
		};
		$(store).trigger("ev_failed", ["remove", error, others]);
	}, function(xhr, status, type) {
		if (_callback_error){
			_callback_error.call(store, xhr, status, type);
		};
		$(store).trigger("ev_error", ["remove", xhr, status, type]);
	});
};

/*$.su.Store.prototype.sync = function(_callback){	//opt: insert/ add/ edit/ delete	有ajax操作，我觉得这个应该是个批量操作的事情
};
*/
//数据格式化操作
$.su.Store.prototype.dataFormat = function(data, tag){
	var	fields = this.fields,
		keyProperty = this.keyProperty,
		formatFuncList = $.su.format,
		parseKey = this.parseKey;

	if (tag)
	{
		/* 在此对SLP接口的数据进行处理 */
		var data = data[parseKey.moduleName][parseKey.tableName];
		for (var index = 0; index < data.length; index++)
		{
			for (var tempData in data[index])
			{
				data[index] = data[index][tempData];
				data[index]["itemName"] = tempData;
			}
		}
		/*END*/
	}

	if (!data || $.isEmptyObject(data)){
		data = [];
	}

	if (!$.isArray(data)){
		data = [data];
	}

	var result = [],
		keyInitialedFlag = false;

	for (var jndex = 0; jndex < fields.length; jndex++){
		//这部分应该是初始model的过程
		var fieldName = fields[jndex].name,
			fieldType = fields[jndex].type || "string",
			dataMapping = fields[jndex].mapping || fieldName,
			defaultValue = fields[jndex].defaultValue || undefined,
			formatFunc = (fields[jndex].dataFormat) ? fields[jndex].dataFormat : function(data){ return data };

		for (var index = 0; index < data.length; index++){
			result[index] = result[index] || {}; // {"seq": (index+1)};
			var _dd = data[index][dataMapping];
			//var ds = (_dd || _dd === 0 || _dd === false || _dd === "") ? _dd : defaultValue;
			var ds = (_dd === undefined || _dd === null) ? defaultValue : _dd;
			var dd = formatFunc(ds);
			result[index][fieldName] = dd;
		};

		if (keyProperty == name){
			keyInitialedFlag = true;
		};
	}

	if (!keyInitialedFlag){
		for (var index = 0; index < data.length; index++){
			result[index] = result[index] || {}; // {"seq": (index+1)};
			var key = data[index][keyProperty];
			if(key === undefined || key === null){
				result[index][keyProperty] = this.idFieldName?result[index][this.idFieldName] : "key-"+(index+this.keyLength)
			}
		}
	}

	/* 此处需要重新给result赋值itemName */
	for (var i = 0; i < data.length; i++)
	{
		result[i]["itemName"] = data[i]["itemName"];
	}

	this.keyLength += data.length;
	return result;
};

$.su.Store.prototype.sendDataFormat = function(data){
	var	fields = this.fields;

	if (!data || $.isEmptyObject(data)){
		data = {};
	};

	var result = {};

	for (var jndex = 0; jndex < fields.length; jndex++){
		var fieldName = fields[jndex].name,
			formatFunc = (fields[jndex].sendDataFormat) ? fields[jndex].sendDataFormat : function(data){ return data };

		result[fieldName] = formatFunc(data[fieldName]);
	};

	return result;
};

$.su.Store.prototype.insertData = function(index, itemName ,records, _callback){		//可以多条目操作~
	var	data = this.data;
	/*
	if (index > data.length){
		//console.error("Debug: insert overflow!");
		return false;
	};
	*/
	if (!$.isArray(itemName))
	{
		itemName = [itemName];
	}

	if (!$.isArray(records)){
		records = [records];
	};

	var dataStart = data.slice(0, index);
	var dataEnd = data.slice(index, data.length);
	var result = dataStart.concat(records, dataEnd);

	for (var i = index; i < index + records.length; i++)
	{
		result[i]["itemName"] = itemName[i - index];
	}

	this.data = null; delete this.data;
	this.data = result;

	this.snapshot = null; delete this.snapshot;
	this.snapshot = $.su.clone(this.data);

	if (_callback){
		_callback.call(this, index, records);
	};

	$(this).trigger("ev_insertdata", [index, records]);
	$(this).trigger("ev_datachanged", [this, this.data, "insertData"]);
	return this;
};
//无ajax操作
$.su.Store.prototype.loadData = function(data, others, _append, _callback){
	if (!_append && this.data.length > 0){
		this.removeAllData();
	};

	if (!data || $.isEmptyObject(data)){
		data = [];
	};

	if (!$.isArray(data)){
		data = [data];
	}

	this.data = this.data || [];
	this.data = this.data.concat(data);

	if (others && !$.isEmptyObject(others)){
		this.others = others;
	}

	this.snapshot = null; delete this.snapshot;
	this.snapshot = $.su.clone(this.data);
	//console.log(_callback)
	if (_callback){
		_callback.call(this, data, _append);
	};

	$(this).trigger("ev_loaddata", [this.data, this.others]);
	$(this).trigger("ev_datachanged", [this, this.data, "loadData"]);

	return this;
};

$.su.Store.prototype.updateData = function(key, data, _callback){

	if (!data || $.isEmptyObject(data)){
		data = [];
	};

	if ($.isArray(data)){
		data = data[0];
	};

	var index = this.getIndex(key);
	if (index === undefined || index === null){
		return;
	};
	//console.log("store updateData", index, key);

	var itemName = this.data[index]["itemName"];

	$.extend(data,{itemName:itemName});

	this.data.splice(index, 1, data);

	//console.log(this.data, data)

	this.snapshot = null; delete this.snapshot;
	this.snapshot = $.su.clone(this.data);

	if (_callback){
		_callback.call(this, key, data);
	};

	$(this).trigger("ev_updatedata", [key, index, data]);
	$(this).trigger("ev_datachanged", [this, this.data, "updateData"]);
	return this;
};

$.su.Store.prototype.removeDataByKey = function(keyArray, _callback){
	var	keyProperty = this.keyProperty;

	if (!$.isArray(keyArray)){
		keyArray = [keyArray];
	};

	var keyObj = {}
	for (var index = 0, len = keyArray.length; index < len; index++){
		keyObj[keyArray[index]] = true;
	};

	var data = this.data;
	var indexArray = [];
	for (var index = 0, len = data.length; index < len; index++){
		if (data[index][keyProperty] in keyObj){
			indexArray.push(index);
		};
	};
	//console.log("store index array", indexArray)
	this.removeDataByIndex(indexArray, function(keyArray, indexArray){
		if (_callback){
			_callback.call(this, keyArray, indexArray);
		}
	});
};

$.su.Store.prototype.removeDataByIndex = function(indexArray, _callback){
	var	keyProperty = this.keyProperty,
		data = this.data;

	if (!$.isArray(indexArray)){
		indexArray = [indexArray];
	};

	indexArray.sort(function(a, b){
		return a - b;
	});

	//从后向前作删除
	var keyArray = [];
	for (var index = indexArray.length - 1; index >= 0; index--){
		var i = indexArray[index];
		if (isNaN(i)){
			continue;
		};
		keyArray.push(data[i][keyProperty]);
		data.splice(indexArray[index], 1);
	};

	this.snapshot = null; delete this.snapshot;
	this.snapshot = $.su.clone(this.data);

	if (_callback){
		_callback.call(this, keyArray, indexArray);
	};

	$(this).trigger("ev_removedata", [keyArray, indexArray]);
	$(this).trigger("ev_datachanged", [this, this.data, "removeData"]);
	return this;
};

$.su.Store.prototype.removeAllData = function(_callback){
	this.data = null; delete this.data;
	this.data = [];
	this.snapshot = null;

	$(this).trigger("ev_removeAllData", [this]);
	$(this).trigger("ev_datachanged", [this, this.data, "removeData"]);
	return this;
};


})(jQuery);
