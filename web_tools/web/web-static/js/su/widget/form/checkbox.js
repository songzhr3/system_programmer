// JavaScript Document
(function($){

// checkbox的设计逻辑大致上是使用两个input代表一个复选框
// 一个input始终处于隐藏状态，当页面上复选框处于不被勾选的状态的时候，这个input取消disable，另一个disable
// 另一个input类型就是checkbox，当页面上的复选框处于勾选状态的时候，这个input取消disable，将隐藏的那个复选框disable
// 由于两个复选框交替disable，所以通过form.serializeArray()方法能拿到他的值
// 勾选的话是inputValue，未勾选的话是uncheckedValue
// 目前系统中复选框一般有两种用法：
// 1. 只配置一个items，作为某项配置的开关
// 这时候一般来说会同时配置inputValue和uncheckedValue，form传值的时候以字符串的格式传递一个值
// 2. 配置多个items，作为一系列配置的组合（比如智能漫游的漫游阈值类型）
// 这个时候往往关注的是这一系列的值，哪些勾选了哪些没有勾选
// 因此这种情况下一般没有配置uncheckedValue，没有勾选的话form拿到的值是空字符串
// 这时候通过form发到后台的格式是一个list，哪些checkbox有值就将对应的值放到list里面发到后台
// 如果全部没有勾选就传递空的list
// > 如果某些item配置了uncheckedValue，且不为“”，form会拿到这个item的值，等同于勾选情况的值
$.su.Widget("checkbox", {
	defaults: {
		name: null,
		items: [],
		fieldLabel: null,
        alwaysTrigger: false,
		cls: "",
		hasSelectAll: false,

		/*tips: "",*/
		columns: 1 //在几列中显示，默认为1
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var input = $(this),
				id = options.id || this.id || defaults.id,
				value = options.value || this.value || defaults.value,
				name = options.name || this.name || defaults.name;

			input.addClass("hidden");
			//this.setAttribute("type", "hidden");
			$.extend(this, defaults, options);

			//重新初始化属性
			input.attr({
				value: value,
				id: id,
				name: name
			}).val(value).addClass("checkbox");

			//console.log(obj)

			var inHTML = 	"<div class=\"container widget-container checkbox-group-container "+this.cls+"\">";

			if (this.fieldLabel !== null){
				inHTML +=		"<div class=\"widget-fieldlabel-wrap "+this.labelCls+"\">";
				inHTML +=			"<label class=\"widget-fieldlabel checkbox-group-label\">"+this.fieldLabel+"</label>";
				if (this.fieldLabel !== ""){
					inHTML +=		"<span class=\"widget-separator\">"+this.separator+"</span>";
				};
				inHTML +=		"</div>";
			};

				inHTML +=		"<div class=\"widget-wrap-outer checkbox-group-wrap-outer\">";
				inHTML +=			"<div class=\"checkbox-group-wrap\">";

			var items = this.items,
				len = items.length,
				perColumnNum = Math.ceil(len/this.columns),
				_numFlag = 0;

				inHTML += 				"<ul class=\"checkbox-group-list-wrap\">";

				if (this.hasSelectAll) {
					items = [{
						boxlabel: "全选",
						inputValue: "checkbox_select_all"
					}].concat(items);
				}

			for (var index = 0; index < items.length; index++){
				if(!items[index]){
					continue;
				}

				var boxName = items[index].name || name || "",
					boxValue = items[index].inputValue || value || "",
					uncheckedValue = items[index].uncheckedValue || "",
					itemCls = items[index].itemCls || "",
					hide = items[index].hide ? items[index].hide : false,
					boxId = items[index].id || "checkbox-" + parseInt(Math.random()*1000*1000*1000, 10).toString();

				var checked = "",
					disabled = "",
					checkedCls = "";

				if (items[index].checked === "checked" || items[index].checked === true){
					checked = "checked=\"checked\"";
					disabled = "disabled=\"disabled\"";
					checkedCls = "checked";
                    me.get(0).defaultValue = items[index].inputValue;
				};

				var funcInitLi = function(boxName, boxValue, boxId, boxlabel){

					if(hide)inHTML += 				"<li class=\"checkbox-list\" style=\"display:none\">";
				    else inHTML += 				"<li class=\"checkbox-list\">";
					inHTML += 					"<div class=\"widget-wrap\">";
					inHTML +=						"<label class=\"checkbox-label "+itemCls+" "+checkedCls+"\" for=\""+boxId+"\">";
					inHTML +=							"<input class=\"hidden\" type=\"hidden\" name=\""+boxName+"\" value=\""+uncheckedValue+"\" data-checked=\""+boxValue+"\" data-unchecked=\""+uncheckedValue+"\" "+disabled+" />";
					inHTML += 							"<input class=\"checkbox-checkbox\" type=\"checkbox\" name=\""+boxName+"\" value=\""+boxValue+"\" data-checked=\""+boxValue+"\" data-unchecked=\""+uncheckedValue+"\" id=\""+boxId+"\" "+checked+" />";
					inHTML +=							"<span class=\"icon\"></span>";
					inHTML +=							"<span class=\"text\">"+items[index].boxlabel+"</span>";
					inHTML +=						"</label>";
					inHTML += 					"</div>";
					inHTML += 				"</li>";
				};

				if (_numFlag < perColumnNum){
					funcInitLi(boxName, boxValue, boxId, items[index].boxlabel);
				}else{
					inHTML +=			"</ul>";
					inHTML +=			"<ul class=\"checkbox-group-list-wrap\">";
					funcInitLi(boxName, boxValue, boxId, items[index].boxlabel);
					_numFlag = 0;
				}
				_numFlag++;
			};

				inHTML += 				"</ul>";

				inHTML +=			"</div>";

			if (this.tips != null && this.tips != undefined){
				inHTML +=			"<div class=\"widget-tips textbox-tips "+obj.tipsCls+"\">";
				inHTML += 				"<div class=\"widget-tips-wrap\">";
				inHTML +=					"<div class=\"content tips-content\"></div>";
				inHTML +=				"</div>";
				inHTML +=			"</div>";
			};

				inHTML +=			"<div class=\"widget-error-tips textbox-error-tips "+obj.errorTipsCls+"\">";
				inHTML +=				"<span class=\"widget-error-tips-delta\"></span>";
				inHTML +=				"<div class=\"widget-error-tips-wrap\">";
				inHTML +=					"<div class=\"content error-tips-content\"></div>";
				inHTML +=				"</div>";
				inHTML +=			"</div>";

				inHTML +=		"</div>";
				inHTML +=	"</div>";

			var container = $(inHTML);
			input.prop("disabled", true).val("").replaceWith(container);
			container.prepend(input);
		});

		var container = me.closest("div.checkbox-group-container");
		container.delegate("label.checkbox-label", "click", function(e){
			e.preventDefault();

			var label = $(this),
				li = label.closest("li.checkbox-list");

			if (li.hasClass("disabled")){
				return;
			}

			var vOld = me.checkbox("getValue1");

			label.toggleClass("checked");

			var checkbox = label.find("input[type=checkbox]").eq(0),
				unchecked = checkbox.prev("input[type=hidden]");

			if (checkbox.prop("checked")){
				if (me.get(0).hasSelectAll) {
					if (checkbox.val() === 'checkbox_select_all') {
						me.checkbox('setValue', []);
					} else {
						var preValue = me.checkbox("getValue1");
						var newValue = [];
						$.each(preValue, function(index, value) {
							if (value !== 'checkbox_select_all' && value !== checkbox.val()) {
								newValue.push(value);
							}
						})
						me.checkbox('setValue', newValue);
					}
				} else {
                    checkbox.prop("checked", false);
                    checkbox.prop("disabled", true);
                    unchecked.prop("disabled", false);
                }

			}else{
				if (me.get(0).hasSelectAll && checkbox.val() === 'checkbox_select_all') {
					var allValue = ['checkbox_select_all'];
					$.each(me.get(0).items,function(index,value){
						allValue.push(value.inputValue)
					});

					me.checkbox('setValue', allValue);
				} else {
					checkbox.prop("checked", true);
					checkbox.prop("disabled", false);
					unchecked.prop("disabled", true);

                    if (me.get(0).hasSelectAll) {
                        var value = me.checkbox("getValue1");
                        // 如果所有选项被勾选，全选选项也被勾选
                        if (value.length === me.get(0).items.length) {
                            me.checkbox('setValue', value.concat('checkbox_select_all'));
                        }
                    }
				}
			};

			var vNew = me.checkbox("getValue1");

			if ((me.get(0) && me.get(0).alwaysTrigger) || vNew.sort().toString() !== vOld.sort().toString()){
				// vOld和vNew改为配置的inputValue
				// e.g.
				// 对于单个item表示开关的情况： vOld ["on"], vNew: []
				// 对于多个item的情况： vOld ["rssi"], vNew: ["rssi", "rate"]
				me.trigger("ev_change", [vOld, vNew]);
			};

			me.trigger("ev_click", vNew);
		});

		me.checkbox("setTips", options.tips);
		return me;
	},
	setValue: function(me, _value){
		var me = me || this,
			vNew = _value[1],
			vOld = me.checkbox("getValue1"),
			container = me.checkbox("getContainer");

		if ($.type(vNew) != "array"){
			vNew = [vNew];
		};

		// 先将这个group中所有的checkbox全部设置为未勾选
		// 针对每个checkbox，设置为未勾选需要两个步骤
		// 1. 代表勾选值的input，去掉勾选（checked=false），设置为禁用（disabled=true）
		// 2. 代表不勾选值的input，设置为启用（disabled=false）
		container.find("input[type=checkbox]").each(function(i, obj){
			obj.checked = false;
			obj.disabled = true;
		});
		container.find("input[type=hidden]").each(function(i, obj){
			obj.disabled = false;
		});

		container.find("label.checkbox-label").removeClass("checked");

		// 找到勾选值与vNew中能匹配的checkbox，将这个checkbox设置为勾选
		// ps 如果传的值vNew是不勾选的值，不会找到勾选值与vNew匹配的checkbox，会维持不勾选的状态
		for (var index = 0; index < vNew.length; index++){
			var checkBox = container.find("input[data-checked="+vNew[index]+"][type=checkbox]");
			if (checkBox.length){
				checkBox.closest("label.checkbox-label").addClass("checked");
				checkBox.get(0).checked = true;
				checkBox.get(0).disabled = false;
			};

			var hiddenBox = container.find("input[data-checked="+vNew[index]+"][type=hidden]");
			if (hiddenBox.length){
				hiddenBox.get(0).disabled = true;
			};

			//console.log("setValue", checkBox, hiddenBox)
		};

		if ((me.get(0) && me.get(0).alwaysTrigger) || vNew.sort().toString() !== vOld.sort().toString()){
			me.trigger("ev_change", [vOld, vNew]);
		};

		return me;
	},
	/*getValue: function(me){
		var me = me || this;
		var	container = me.checkbox("getContainer");
		var	result = [];

		container.find("input[type=checkbox]").each(function(i, obj){
			var tar = $(obj);
			if (obj.checked){
				var v = tar.attr("data-checked");
				if (v){
					result.push(v);
				};
			}else{
				var v = tar.attr("data-unchecked")
				if (v){
					result.push(v);
				};
			};
		});
		//console.log(result)
		return result;
	},*/
	getValue: function(me) {
		var me = me || this,
			container = me.checkbox("getContainer"),
			result = [];

		container.find("input[type=checkbox]").each(function(i, obj){
			if (obj.checked && obj.value !== 'checkbox_select_all'){
				result.push(obj.name);
			};
		});

		return result;
	},
	getValue1: function(me) {
		var me = me || this,
			container = me.checkbox("getContainer"),
			result = [];

		container.find("input[type=checkbox]").each(function(i, obj){
			if (obj.checked && obj.value !== 'checkbox_select_all'){
				result.push(obj.value);
			};
		});

		return result;
	},
	reset: function(me){
		var me = me || this,
			obj = me.get(0),
			items = obj.items,
			val = [];

		if (obj.defaultValue){
			val = obj.defaultValue;
		}else if (items){
            $.each(items, function(i, o){
            	if(!o){
            		return;
            	}
                val.push(o["uncheckedValue"]);
            })
		}

		me.checkbox("setValue", val);
		return me;
	},
	/*禁用，但是传值*/
	disable: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.checkbox("getContainer").addClass("disabled"),
			checkboxs = container.find("input.checkbox-checkbox");

		checkboxs.each(function(i, obj){
			var tar = $(obj);

			tar.closest("li.checkbox-list").addClass("disabled");
			tar.closest("label.checkbox-label").addClass("disabled");
			tar.prop("disabled", true);

		});

		return me;
	},
	enable: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.checkbox("getContainer").removeClass("disabled"),
			checkboxs = container.find("input.checkbox-checkbox");

		checkboxs.each(function(i, obj){
			var tar = $(obj);

			tar.closest("li.checkbox-list").removeClass("disabled");
			tar.closest("label.checkbox-label").removeClass("disabled");
			tar.prop("disabled", false);

		});

		return me;
	},
	/*禁用并且不传值*/
	disableAllItem: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.checkbox("getContainer").addClass("disabled"),
			checkboxs = container.find("input.checkbox-checkbox"),
			hidden = container.find("input.hidden");

		checkboxs.each(function(i, obj){
			var tar = $(obj);

			tar.closest("li.checkbox-list").addClass("disabled");
			tar.closest("label.checkbox-label").addClass("disabled");
			tar.prop("disabled", true);

		});

		hidden.each(function(i, obj){
			var tar = $(obj);

			tar.closest("li.checkbox-list").addClass("disabled");
			tar.closest("label.checkbox-label").addClass("disabled");
			tar.prop("disabled", true);

		});

		return me;
	},
	enableAllItem: function(me){
		var me = me || this,
			obj = me.get(0),
			container = me.checkbox("getContainer").removeClass("disabled"),
			checkboxs = container.find("input.checkbox-checkbox"),
			hidden = container.find("input.hidden");

		checkboxs.each(function(i, obj){
			var tar = $(obj);

			tar.closest("li.checkbox-list").removeClass("disabled");
			tar.closest("label.checkbox-label").removeClass("disabled");
			tar.prop("disabled", false);

		});

		hidden.each(function(i, obj){
			var tar = $(obj);

			tar.closest("li.checkbox-list").removeClass("disabled");
			tar.closest("label.checkbox-label").removeClass("disabled");
			tar.prop("disabled", false);

		});


		return me;
	},
	/*禁用某些值的选择*/
	disableItem: function(me, valueArray){
		var me = me || this,
			obj = me.get(0),
			container = me.checkbox("getContainer"),
			checkboxs = container.find("input.checkbox-checkbox"),
			valueArray = valueArray[1];

		if ($.type(valueArray) === "string"){
			valueArray = [valueArray];
		};

		var valueObj = (function(){
			var valueObj = {};
			for (var index = 0; index < valueArray.length; index++){
				valueObj[valueArray[index]] = true;
			};
			return valueObj;
		})();

		checkboxs.each(function(i, obj){
			var tar = $(obj);
			if (tar.val() in valueObj){
				tar.closest("li.checkbox-list").addClass("disabled");
				tar.closest("label.checkbox-label").addClass("disabled");
				tar.prev("input[type=hidden]").prop("disabled", true);
				tar.prop("disabled", true);
			};
		});

		return me;
	},
	enableItem: function(me, valueArray){
		var me = me || this,
			obj = me.get(0),
			container = me.checkbox("getContainer"),
			checkboxs = container.find("input.checkbox-checkbox"),
			valueArray = valueArray[1];

		if ($.type(valueArray) === "string"){
			valueArray = [valueArray];
		};

		var valueObj = (function(){
			var valueObj = {};
			for (var index = 0; index < valueArray.length; index++){
				valueObj[valueArray[index]] = true;
			};
			return valueObj;
		})();

		checkboxs.each(function(i, obj){
			var tar = $(obj);
			if (tar.val() in valueObj){
				tar.closest("li.checkbox-list").removeClass("disabled");
				tar.closest("label.checkbox-label").removeClass("disabled");
				tar.prev("input[type=hidden]").prop("disabled", false);
				tar.prop("disabled", false);
			};
		});

		return me;
	},
	getContainer: function(me){
		var me = me || this;
		return me.closest("div.checkbox-group-container");
	}
	/*,
	selectAll: function(me){
		var me = me || this,
			container = me.checkbox("getContainer");
		container.find("input[type=checkbox]").attr("checked", "checked");
	},
	deselectAll: function(me){
		var me = me || this,
			container = me.checkbox("getContainer");
		container.find("input[type=checkbox]").removeAttr("checked");
	}*/
});

})(jQuery);