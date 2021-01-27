// JavaScript Document
(function($){

$.su.Widget("editor", {
	defaults: {
		columns: null,
		grid: null,		//宿主grid
		//properties
		editing: false,
		pluginId: "",
		editingId: null,
		form: null,

		beforeSubmit: null,
		beforeRealSubmit: null,

		//额外项目
		items: null,
		orderSensitive: '',//新增条目的顺序是否敏感,与宿主grid保持一致
		content: null,
		fields: null,
		inheritedGrid: null,  //editor中显示一个超链接，点击显示一个子表
		gridKey: ''
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			$.extend(this, defaults, options);
			var tar = $(obj),
				columns = obj.columns;

			var columnLen = 0;
			for(var i=0; i<columns.length;i++){
				if(!columns[i].hidden)
					columnLen++;
			}
			//需要添加一个td和colspan
			var inHTML = 	"<td class=\"editor-container\" colspan=\""+columnLen+"\">";

				inHTML +=		"<div class=\"container editor-content-container\"></div>";		//编辑器内容

				inHTML +=		"<div class=\"container editor-buttons-container\">";


				// inHTML +=			"<div class=\"button-container\">";
				// inHTML +=				"<button type=\"button\" class=\"editor-btn btn-delete button-button\">"+$.su.CHAR.OPERATION.DELETE+"</button>";
				// inHTML +=			"</div>";

				inHTML +=			"<div class=\"button-container submit\">";		//按钮框
				inHTML +=				"<button type=\"button\" class=\"editor-btn btn-submit button-button\">";
				inHTML +=					"<span class=\"button-text text\">"+$.su.CHAR.OPERATION.OK+"</span>";
				inHTML +=				"</button>";
				inHTML +=			"</div>";

				inHTML +=			"<div class=\"button-container submit\">";
				inHTML +=				"<button type=\"button\" class=\"editor-btn btn-cancel button-button\">";
				inHTML +=					"<span class=\"button-text text\">"+$.su.CHAR.OPERATION.CANCEL+"</span>";
				inHTML +=				"</button>";
				inHTML +=			"</div>";

				if(obj.extraButton){
					inHTML +=			"<div class=\"button-container submit\">";
					inHTML +=				"<button type=\"button\" class=\"editor-btn btn-extra button-button\">";
					inHTML +=					"<span class=\"button-text text\">"+obj.extraButton+"</span>";
					inHTML +=				"</button>";
					inHTML +=			"</div>";
				}
				inHTML +=			"<span class=\"form-error-tips\"></span>";


			inHTML +=		"</div>";

				inHTML +=	"</td>";

			var form = $(inHTML);
			tar.append(form).addClass("container widget-container editor-container");

			var editorContentContainer = tar.find("div.editor-content-container");
			var fields = [];
			//初始化编辑框
			for (var index = 0; index < columns.length; index++) {
				var column = columns[index],
						editorType = columns[index]["editor"];	//先只默认为text

				//这个初始化函数需要优化~		1、column的属性 + 扩展 editor的属性
				//console.log(column);
				if (editorType) {
					var editor = $("<input />");
					if (editorType.xtype == "textarea") {
						editor = $("<textarea />")
					}
					editorContentContainer.append(editor);

					if ($.type(editorType) === "string") {
						editor[editorType]({
							fieldLabel: column.text || "",
							name: column.name || column.dataIndex || ""
						});
					} else {
						if (editorType.xtype) {
							var opt = $.extend({}, editorType, {
								fieldLabel: editorType.text || column.text || "",
								name: column.name || column.dataIndex || ""
							});
							var editorObj = editor[editorType.xtype](opt);
							if (editorType.events) {
								$.each(editorType.events, function(index, item) {
									editorObj.on(item.eventName, item.eventCallback);
								})
							}

							if (editorType.areaTitle) {
								editor.closest('.widget-container').before('<div class="widget-container editor-area-title">' + editorType.areaTitle + '</div>')
							}
						} else {
							//console.error("Invalid Editor type!");
							return null;
						}
					}

					//设置fields
					fields.push({
						name: column.name || column.dataIndex || ""
					});
				}
			}

			//额外的表单部分
			if (obj.items){
				for (var index = 0, len = obj.items.length; index < len; index++){
					var	item = obj.items[index],
						editor = $("<input />");

					editorContentContainer.append(editor);
					editor[item.xtype]($.extend({}, item));

					fields.push({
						name: item.name
					})
				};
			};

			if (obj.content && obj.content != "default"){
				if (!obj.fields){
					//console.error("You shold defined the fields first!");
					return;
				};

				//条目敏感时，增加编辑框中输入框
				if (obj.orderSensitive) {
					var inputHtml ='<input class="'+obj.orderSensitive+'" name="'+obj.orderSensitive+'" />';
					var insert = $(inputHtml);
					$(obj.content).append(insert)
				}

				//  往form里面插入内容
								editorContentContainer.append($(obj.content).detach());

				if (obj.inheritedGrid) {
					// onclick 中要求是全局函数，而用function x() {} 或 var xx = function() {}
					//  定义的函数是在当前作用域内，因此切不可加上var
					goToHyperLink = function(index) {
						me.editor("_goToHyperLink", index);
					};
					var hyperlink = '';
					for( var i = 0; i < obj.inheritedGrid.hyperlink_text.length; i++) {
						hyperlink += '<a href="javascript:void(0);" id="hyperlink_'+ i + '" class="editor-inner-hyperlink" onclick="goToHyperLink(' + i + ');">' +
						obj.inheritedGrid.hyperlink_text[i] + ' </a>';
					}
					editorContentContainer.append(hyperlink);
				}

				if (obj.orderSensitive) {
					var insertClass = '.'+obj.orderSensitive;
					editorContentContainer.find(insertClass).textbox({
						fieldLabel: $.su.CHAR.GRID.INSERT_INDEX,
						allowBlank: true,
						vtype: {
							vtype:"number",
							max: 9999,
							min:1
						},
						maxLength: 5,
						tip: $.su.CHAR.GRID.OrderSensitiveTip
					})
				}
			};

			$.extend(fields, obj.fields);

			//条目敏感时，增加fields增加字段
			if (obj.orderSensitive){
				var	indexItem = {
					name: obj.orderSensitive
				};

				fields.push({
					name: indexItem.name || ""
				});

				// 将store里的fields与editor里保持一致，这种写法不一定好，因为暂不明确这两者是否有必须不统一的情况。
				var grid = me.get(0).grid;
				var store = grid.get(0).store;
				store.fields.push({
					name: indexItem.name || ""
				});
			}

			$.extend(options, {
				fields: fields
			});

			//console.log(options)

			form.form(options).on("ev_validatechange", function() {
				if (options.hasValidChange && typeof options.hasValidChange == 'function') {
					options.hasValidChange();
				}
			});

			obj.pluginId = $.su.randomId("editor");	//这个就不用id了，xtype属于form！
			obj.isEditor = true;
		});

		//console.log(me, me.find("button.btn-submit"))
		me.delegate("button.btn-submit", "click", function(e){
			e.stopPropagation();
			me.find("button.btn-submit").attr("disabled",true);
			var obj = me.get(0);
			if (obj.beforeSubmit){
				var t = obj.beforeSubmit();
				if (!t){
					$("button.btn-submit").attr("disabled",false);
					return;
				};
			};
			/*防止combobox没有收上去*/
			var comboboxList = me.find("div.combobox-container");
			comboboxList.each(function(i, obj){
				var switchBtn = $(obj);
				var wrap = switchBtn.find("div.combobox-list-wrap");
				wrap.fadeOut(500);
				wrap.attr("toggleflag", "hidden");
			});
			me.trigger("ev_submit");
			if (obj.multi_editing){
				me.editor("completeEdit_multi", obj.param, obj.suc, obj.fail);
			}else{
				me.editor("completeEdit", obj.param, obj.suc, obj.fail);
			}
		});

		/*me.delegate("button.btn-delete", "click", function(e){

		});*/

		me.delegate("button.btn-cancel", "click", function(e){
			e.stopPropagation();
			/*防止combobox没有收上去*/
			var comboboxList = me.find("div.combobox-container");
			comboboxList.each(function(i, obj){
				var switchBtn = $(obj);
				var wrap = switchBtn.find("div.combobox-list-wrap");
				wrap.fadeOut(500);
				wrap.attr("toggleflag", "hidden");
			});


			me.editor("cancelEdit");
		});

		me.delegate("button.btn-extra", "click", function(e){
			e.stopPropagation();
			var obj = me.get(0);
			/*防止combobox没有收上去*/
			me.trigger("ev_extra", [obj.editingId])
		});
		//存放
		var grid = me.get(0).grid;
		if (!grid || grid.length == 0 || !grid.get(0).isGrid){
			//console.error("Invalid grid for the editor!");
			return null;
		};

		//事件绑定
		grid.delegate("a.grid-content-btn.grid-content-btn-edit", "click", function(e){
			e.preventDefault();
			e.stopPropagation();
			// 对于store数据需要互斥处理，不能够在load数据时，进行编辑。
			if(true == grid.get(0).store.loading)
			{
				return ;
			}

			if($(this).hasClass('proxy-disabled'))
			{
				return ;
			}
			var btn = $(this),
				tr = btn.closest("tr.grid-content-tr");
			if (tr.hasClass("disabled")){
				return;
			};

			var	key = btn.attr("data-key"),
				index = btn.attr("data-index"),
				editor = me;

			//console.log(btn, key, index, editor);

			if (editor){
				var editorObj = editor.get(0);
				if (editorObj && editorObj.isEditor){
					if (editorObj.editing === false){
						editorObj.multi_editing = false;
						editor.editor("startEdit", key);
					}else{
						editor.editor("shake");
					};
				};
			};
			//console.log("item edit");
		}).delegate("a.operation-btn.btn-multi-edit", "click", function(e){
			//console.log("multi-edit.")
			var	editor = me,
				grid = me.get(0).grid,
				obj = grid.get(0);
			if($(this).hasClass('proxy-disabled'))
			{
				return ;
			}
			if (editor){
				var editorObj = editor.get(0);
				if (editorObj && editorObj.isEditor){
					if (editorObj.editing === false){
						var selectedKeys = grid.grid("getSelected");
						if (selectedKeys.length == 0){
							obj.noneSelectMsg.msg("show");
						}else{
							if (selectedKeys.length == 1){
								editorObj.multi_editing = false;
								editor.editor("startEdit", selectedKeys[0]);
							}else{
								$(this).addClass('proxy-disabled');
								editor.editor("startEdit_multi", selectedKeys);
							}
						}
					}else{
						editor.editor("shake");
					};
				}
			}

		});


		//默认隐藏
		me.css("display", "none");

		return me;
	},
		_goToHyperLink:function(me, param) {
		var me = me || this,
			obj = me.get(0),
			index=param[1];
		var msgInHTML = "<div id='inherited-grid'></div>";
		inheritedGridMsg = $("<div id=\"inheritedGrid_msg\">").msg({
			type: "",
			innerHTML: msgInHTML,
			cls: obj.inheritedGrid.childTable.msgSize || 'xxl',
		}).on("ev_fade_in", function(){
			// ev_fade_in动画效果后重新计算表格对齐
			inheritedGridMsg.css({
                'max-height': '640px',
                'overflow': 'hidden',
                'top': '100px'
            });

            inheritedGridMsg.find('.grid-container').css({
                overflow: 'auto',
                height: '500px'
            });

			inheritedGrid.grid.calculateTdWidth('inherited-grid');
		});
        inheritedGridMsg.css('z-index', 998);

		var current_item_key = obj.grid.get(0).store['current_item_key'];
		//console.log("hyperLink:current_item_key" + current_item_key);

		var gridOpt = {
			gridKey: current_item_key
		};

		//将子表格的属性复制到gridOpt中，用于生成表格
		for (var key in obj.inheritedGrid.childTable[index]) {
			gridOpt[key] = obj.inheritedGrid.childTable[index][key];
		}

		gridOpt.store.parseKey.getFilter = function(){
			return {parent_table_key: current_item_key};
		}

		var inheritedGrid = $('#inherited-grid').grid(gridOpt).on("ev_insert",function(){
			//用于在插入数据后，调用get接口获取数据
			//不然，反病毒的病毒例外中，无法获取病毒名
			$('#inherited-grid').grid("getStore").load();
		});
		// 修改数据后重新计算表格对齐
		inheritedGrid.on("ev_load",function(){
			inheritedGrid.grid.calculateTdWidth('inherited-grid');
		}).on("ev_remove",function(){
			inheritedGrid.grid.calculateTdWidth('inherited-grid');
		}).on('ev_formatAddData', function() {
			inheritedGrid.grid.calculateTdWidth('inherited-grid');
		}).on('ev_update', function() {
			inheritedGrid.grid.calculateTdWidth('inherited-grid');
		}).on('ev_startEdit', function() {
			inheritedGridMsg.msg("setPosition", "center", "center");
		}).on('ev_editorHide', function() {
			inheritedGridMsg.msg("setPosition", "center", "center");
		});
		inheritedGridMsg.msg('show');
	},
	hide: function(me){	//不会对对象进行销毁
		var me = me || this;
		var grid = me.get(0).grid;
		me.detach().css("display", "none");
		grid.trigger('ev_editorHide');
		return me;
	},
	shake: function(me){
		var me = me || this;
		me.queue(function(){
			$(this).addClass("shaking");
			$(this).dequeue();
		});
		me.delay(80);
		me.queue(function(){
			$(this).removeClass("shaking");
			$(this).dequeue();
		});
		me.delay(80);
		me.queue(function(){
			$(this).addClass("shaking");
			$(this).dequeue();
		});
		me.delay(80);
		me.queue(function(){
			$(this).removeClass("shaking");
			$(this).dequeue();
		});
		return me;
	},
	startEdit: function(me, params){	//editingId, column	//因为是对一整条条目操作，顾第二个参数暂时忽视
		var me = me || this,
			obj = me.get(0),
			editingId = params[1] || "add",	//数据条目数如何传进来？
			//editingIndex = params[2] || "add",
			grid = me.get(0).grid,
			gridObj = grid.get(0),
			store = grid.get(0).store,
			//dataContainer = grid.find("tbody.grid-content-data"),
			targetTr = null,
			form = me.find("td.editor-container");

		me.editor("hide");
		form.form("setNormal");
		obj.editing = true;
		obj.editingId = editingId;
		obj.editingIndex = "add";

		//obj.editingIndex = isNaN(editingIndex) ? "add" : parseInt(editingIndex, 10);
		//console.log(store, gridObj.rows, listIndex, editingId)
		if (editingId != "add"){
			//在这添加数据回显
			var data = store.getData(editingId),
				editingIndex = store.getIndex(editingId);

			//内嵌表格使用的key
			//Author: Fu Fenghai
			if(false == $.isEmptyObject(obj.grid.get(0).childTable))
			{
				store['current_item_key'] = data.itemName;
			}

			obj.editingIndex = editingIndex;
			obj.adding = false;

			// var editorContentContainer = form;
			//条目敏感时，增加编辑框中输入框
			if (obj.orderSensitive) {
				var inputHtml ='<input class="'+obj.orderSensitive+'" name="'+obj.orderSensitive+'" />';
				var insert = $(inputHtml);
				$(obj.content).append(insert)
			}

			form.append($(obj.content).detach());

			if (obj.orderSensitive) {
				var insertClass = '.'+obj.orderSensitive;
				form.find(insertClass).textbox({
					fieldLabel: $.su.CHAR.GRID.INSERT_INDEX,
					allowBlank: true,
					vtype: {
						vtype:"number",
						max: $(me.get(0).grid.grid("getPaging")).get(0).totalNum || 9999,
						min:1
					},
					maxLength: 5,
					tip: $.su.CHAR.GRID.OrderSensitiveTip
				})
			}

			form.form("reset");
			if (data){
				form.form("loadData", data);
			}else{
				form.form("reset");
			}

			targetTr = gridObj.rows[editingIndex];

			if (targetTr){
				targetTr.addClass("editing");
				grid.grid("disableRow", editingIndex);
			}
			//显示编辑器
			//targetTr = dataContainer.find("tr.grid-content-tr").filter(".grid-content-tr-"+editingId).addClass("editing");
		}else{
			//清空表单
			me.get(0).adding = true;

			//预生成表单的id,仅在存在嵌套表格时使用 - Fu Fenghai
			if(false == $.isEmptyObject(obj.grid.get(0).childTable))
			{
				var parentGridKey = store.parseKey.tableName + '_' + Date.parse(new Date()) / 1000
				store['current_item_key'] = parentGridKey;
				//console.log("预生成表格id: " + store['current_item_key']);
			}

			// var editorContentContainer = form;
			//条目敏感时，增加编辑框中输入框
			if (obj.orderSensitive) {
				var inputHtml ='<input class="'+obj.orderSensitive+'" name="'+obj.orderSensitive+'" />';
				var insert = $(inputHtml);
				$(obj.content).append(insert)
			}

			form.append($(obj.content).detach());

			if (obj.orderSensitive) {
				var insertClass = '.'+obj.orderSensitive;
				form.find(insertClass).textbox({
					fieldLabel: $.su.CHAR.GRID.INSERT_INDEX,
					allowBlank: true,
					vtype: {
						vtype:"number",
						max:$(me.get(0).grid.grid("getPaging")).get(0).totalNum + 1 || 9999,
						min:1
					},
					maxLength: 5,
					tip: $.su.CHAR.GRID.OrderSensitiveTip
				})
			}

			form.form("reset");

			var dataContainer = grid.find("tbody.grid-content-data"),
				fistTr = dataContainer.find("tr.grid-content-tr").eq(0);

			if (fistTr.hasClass("empty")){
				targetTr = fistTr;
			}else{
				targetTr = me.grid("initEmptyRow");
				dataContainer.prepend(targetTr);
			}

			//显示编辑器
			targetTr.addClass("editing add disabled")
		}

		me.insertAfter(targetTr);
		me.slideDown(0);
		var scrolllen = targetTr.offset().top - $("#func-advanced").offset().top-150;
		scrolllen = (scrolllen >= 0)?scrolllen:0;
		$("div.top-main").scrollTop(scrolllen);
		//重新计算表格高度

		//me.editor("show", editingId);
		//console.log("startEdit", editingId);
		me.trigger("ev_startEdit", [obj.editingIndex, obj.editingId])
		return me;
	},
	startEdit_multi: function(me, params){
		var me = me || this,
			obj = me.get(0),
			keys = params[1],
			grid = me.get(0).grid,
			gridObj = grid.get(0),
			store = grid.get(0).store,
			targetTr = null,
			form = me.find("td.editor-container");

		obj.multi_forbidden = false;
		me.trigger("ev_multiEdit", [keys]);
		if (obj.multi_forbidden){
			// 取消批量编辑按钮置灰
			$("a.operation-btn.btn-multi-edit").removeClass("proxy-disabled");
			return;
		}

		me.editor("hide");
		form.form("setNormal");
		obj.editing = true;

		var editingIndex = obj.multi_data_index,
			data = store.data[editingIndex];

		obj.editingIndex = editingIndex;
		obj.editingId = data.key;
		//console.log(data.key)
		obj.adding = false;
		form.form("reset");
		if (data){
			form.form("loadData", data);
		}else{
			form.form("reset");
		};

		targetTr = gridObj.rows[obj.editingIndex];//为了避免歧义，editor还是出现在模板数据所在行的位置

		if (targetTr){
			targetTr.addClass("editing");
			grid.grid("disableRow", obj.editingIndex);
		};

		me.insertAfter(targetTr);
		me.slideDown(0);
		var scrolllen = targetTr.offset().top - $("#func-advanced").offset().top-150;
		scrolllen = (scrolllen >= 0)?scrolllen:0;
		$("div.top-main").scrollTop(scrolllen);

		me.trigger("ev_startEdit", [obj.editingIndex, obj.editingId, true]);

		//disable input
		var chunk_chkbox = me.find("input.checkbox-checkbox").show();
		chunk_chkbox.css("display", "inline-block");
		chunk_chkbox.each(function(i, chk_obj){
			var chunk = $(chk_obj);
			chunk.closest("div.widget-checkbox-wrap").addClass("show");
			if (!chunk.hasClass("disabled")){
				var widget = chunk.closest("div.widget-container");
				if (widget.hasClass("combobox-container")){
					widget.find("input.chunk").combobox("disable");
				}else if (widget.hasClass("text-container")){
					widget.find("input.chunk").textbox("disable");
				}else if (widget.hasClass("radio-group-container")){
					widget.find("input.chunk").radio("disable");
				}
				chunk.prop("disabled", false);
				chunk.removeClass("disabled");
			}
		})

		obj.multi_editing = true;
		me.find("button.btn-extra").addClass("disabled").prop("disabled", true);
		return me;
	},
	//批量编辑，目前只有射频设置有该选项
	completeEdit_multi: function(me, params){
		var me = me || this,
			form = me.find("td.editor-container"),
			obj = me.get(0),
			grid = obj.grid,
			rows = grid.get(0).rows,
			listIndex = obj.editingIndex,
			store = grid.get(0).store,
			editingId = obj.editingId,
			/*默认插入点*/
			len = rows.length,
			/*回调列表*/
			param = params[1] || {},
			callback = params[2] || null,
			callback_failed = params[3] || null,
			callback_error = params[4] || null;


		if (form.form("validate")){
			if (obj.beforeRealSubmit){
				var t = obj.beforeRealSubmit();
				if (!t){
					$("button.btn-submit").attr("disabled",false);
					return;
				};
			};
			var multi_obj = form.find("input.chunk");
			var multi_data = {};
			var multi_list_id = null;
			multi_obj.each(function(i, chunk){
				var chkbox_obj = $(chunk).closest("div.widget-container").find("input.checkbox-checkbox");
				//带checkbox，处于勾选状态
				if (chkbox_obj.get(0)){
					if (chkbox_obj.is(":checked")){
						var name = $(chunk).prop("name");
						var value = $(chunk).prop("value");
						if (value.length != 0){
							value = value.replace(/\&/g,"&amp;");
							value = value.replace(/\"/g,"&quot;");
							value = value.replace(/\'/g,"&#39;");
						}
						multi_data[name] = value;
					}
				}else{//不带checkbox，处于enable状态
					var serializeArray = $(chunk).closest("div.widget-container").find("input").serializeArray();
					for (var index = 0; index < serializeArray.length; index++){
						var name = serializeArray[index].name,
							value = serializeArray[index].value;
						if (value.length != 0){
							value = value.replace(/\&/g,"&amp;");
							value = value.replace(/\"/g,"&quot;");
							value = value.replace(/\'/g,"&#39;");
						}
						multi_data[name] = value;
					}
				}
			});
			multi_list_id = obj.multi_id_list;

			var postData = {};
			postData["filter"] = [];
			//postData["filter"][0] = {};

			if (obj.multi_edit_key != undefined)
			{
				for(var i=0;i<multi_list_id.length;i++){
					var filterObj = {};
					filterObj[obj.multi_edit_key] = String(multi_list_id[i]);
					postData["filter"].push(filterObj);
				}
			}
			else
			{
				return;
			}

			postData["para"] = multi_data;

			//var multi_data = form.find("div.chunk_items").find("input").serializeArray();
			grid.grid("runProgress");
			if (editingId != "add"){
				//multi_data = form.form("dataFormat", multi_data);
				var data_len = store.data.length;
				$.su.loading.show();
				store.update_multi(editingId, postData, function(){
					grid.grid("prompt", true);
					me.editor("cancelEdit");
					store.do_upt = false;
					if (callback){
						callback.call(me, dOld, dNew, listIndex);
					}
					$(store).trigger("ev_refresh", []);
					setTimeout(function(){
						$.su.loading.hide();
					}, store.loadDelay ? data_len*store.loadDelay : data_len*0.5);
				}, function(errorcode, others, data){
					if(callback_failed){
						callback_failed.call(me, errorcode, others, data);
					}
					grid.grid("prompt", false);
					$.su.loading.hide();
				}, function(){
					grid.grid("prompt", false);
					$.su.loading.hide();
				});
			};
			me.get(0).adding = false;
		}
		else{
			setTimeout(function(){
				$("button.btn-submit").attr("disabled",false);
			},500);
		}
		return me;
	},
	completeEdit: function(me, params){
		var me = me || this,
			form = me.find("td.editor-container"),
			obj = me.get(0),
			grid = obj.grid,
			rows = grid.get(0).rows,
			listIndex = obj.editingIndex,
			store = grid.get(0).store,
			editingId = obj.editingId,
			/*默认插入点*/
			len = rows.length,
			/*回调列表*/
			param = params[1] || {},
			callback = params[2] || null,
			callback_failed = params[3] || null,
			callback_error = params[4] || null;

		if (form.form("validate")){
			if (obj.beforeRealSubmit){
				var t = obj.beforeRealSubmit();
				if (!t){
					$("button.btn-submit").attr("disabled",false);
					return;
				};
			};
			var dNew = form.form("serialize"),
			dOld = null;
			if (obj.gridKey) {
			    dNew['parent_table_key'] = obj.gridKey;	//子表格获取parent_table_key
			}
			grid.grid("runProgress");
			if (editingId != "add"){
				me.trigger("ev_formatEditData", [dNew]);
				dOld = $.extend({}, store.getData(editingId));
				delete dOld[store.keyProperty];
//				store.update(editingId, {
//					"old": dOld,
//					"new": dNew
//				}, function(){
				store.update(editingId, {updateData: dNew}, function(){	//此处对于SLP来说，只需要提供修改后的数据就可以了,剩下的都让store去封装,下同
					grid.grid("prompt", true);
					me.editor("cancelEdit");
					if (callback){
						callback.call(me,dOld, dNew, listIndex,store.data);
					}
					$(store).trigger("ev_linked", [dOld, dNew]);
					/*编辑完后去除全选*/
					if (!rows[listIndex].hasClass("unavailable")){
						grid.grid("disGridHeaderChkbox");
					}
				}, function(errorcode, others, data){
					if(callback_failed){
						callback_failed.call(me, errorcode, others);
					}
					grid.grid("prompt", false);
				}, function(){
					grid.grid("prompt", false);
				});
			}else{
				me.trigger("ev_formatAddData", [dNew]);
				// 如果指定插入顺序，insert的index值应该为输入值而不是len
				// if(obj.orderSensitive && $('.'+obj.orderSensitive).textbox('getValue')){
				//     len  = $('.'+obj.orderSensitive).textbox('getValue');
				// }
				store.insert(len, dNew, function(){
					grid.grid("prompt", true);
					me.editor("cancelEdit");
					if (callback){
						callback.call(me, undefined, dNew, "add");
					}
				}, function(errorcode, others, data){
					if(callback_failed){
						callback_failed.call(me, errorcode, others);
					}
					grid.grid("prompt", false);
				}, function(){
					grid.grid("prompt", false);
				});
			};
			me.get(0).adding = false;
		}
		else{
			$.su.loading.hide();
			setTimeout(function(){
				$("button.btn-submit").attr("disabled",false);
			},500);
		}
		return me;
	},
	cancelEdit: function(me){
		var me = me || this,
			obj = me.get(0),
			grid = me.get(0).grid,
			gridObj = grid.get(0),
			editingIndex = obj.editingIndex;

		var	tr = null;

		if($(".operation-container .btn-add").hasClass('proxy-disabled')){
			$(".operation-container .btn-add").removeClass('proxy-disabled');
		}
		if($(".operation-container .btn-multi-edit").hasClass('proxy-disabled')){
			$(".operation-container .btn-multi-edit").removeClass('proxy-disabled');
		}
		if (obj.multi_editing){
			//editingIndex = obj.multi_last_index;
			var chunk_chkbox = me.find("input.checkbox-checkbox").hide();
			chunk_chkbox.each(function(i, chk_obj){
				var chunk = $(chk_obj);
				chunk.closest("div.widget-checkbox-wrap").removeClass("show");
				chunk.prop("checked", false);
				chunk.removeClass("disabled");
				//if (!chunk.hasClass("disabled")){
				{
					var widget = chunk.closest("div.widget-container");
					if (widget.hasClass("combobox-container")){
						widget.find("input.chunk").combobox("enable");
					}else if (widget.hasClass("text-container")){
						widget.find("input.chunk").textbox("enable");
					}else if (widget.hasClass("radio-group-container")){
						widget.find("input.chunk").radio("enable");
					}
					//chunk.prop("disabled", false);
				}
			})
			obj.multi_editing = false;
			me.find("button.btn-extra").removeClass("disabled").prop("disabled", false);
		}
		if (editingIndex !== "add"){
			gridObj.rows[editingIndex].removeClass("editing");
			grid.grid("enableRow", editingIndex);
		}else{
			grid.find("tr.grid-content-tr.add").remove();
		};
		me.trigger("ev_cancelEdit", [obj.editingIndex, obj.editingId, obj.multi_editing])
		me.editor("hide");

		//添加清空表表单
		obj.editing = false;
		obj.editingIndex = "";

		grid.grid("updateRowNumber")
		return me;
	},
	isEditing: function(me){
		var me = me || this;
		if (me.get(0).editing){
			return true;
		}else{
			return false;
		};
	},
	getEditingId: function(me){
		var me = me || this;
		if (me.get(0).editing){
			return me.get(0).editingId;
		}else{
			return undefined;
		}
	},
	// 在确定和取消按钮后面显示错误提示
	setError: function(me, params) {
		var tip = params[1];
		var form = me.find("td.editor-container");
		form.form("setError", tip);
	},
	setNormal: function(me) {
		var form = me.find("td.editor-container");
		form.form("setNormal");
	}
	/*getOwnGrid: function(me){	//只有当editor插入dom中之后才能生效！
		var me = me || this,
			gridContainer = me.closest("div.grid-panel");
		//console.log(gridContainer)
		if ((gridContainer.length != 0) && (gridContainer.get(0).isGrid == true)){
			return gridContainer;
		}else{
			return null;
		};
	},
	showMsg: function(me, params){	// _content, _title,
		var me = me || this,
			text = params[2],
			title = params[1],
			msgBox = $(me.get(0).msg);

		if (text){
			msgBox.msg("setContent", text);
		};

		if (title){
			msgBox.msg("setTitle", title);
		};

		msgBox.msg("show");

		return me;
	}*/
});

})(jQuery);
