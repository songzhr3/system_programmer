// JavaScript Document
(function($){

$.su.Widget("grid", {
	defaults: {
		orderSensitive: '', //新增条目的顺序是否敏感,为空则不敏感，否则敏感且传field字段名称
		columns: [],
		combo: '', //组合筛选功能
		comboFilterModule: '', // 组合筛选的选项
		comboObjectModule: '', // 被组合筛选的模块
		comboFunction: '', // 执行组合筛选的动作
		store: null,
		//currentStartNumber: 0,	//临时参数，分页时使用
		operation: null,	//"add|delete|enable|disable|search|refresh", [{xtype: "display", display: "rownumber", fieldLabel: "fieldLabel"}, {xtype: "button", text: "button"}, "search"]	或者是数组对象
		sortable: false,
		selectionDisplay: false,//是否开启列内容定制，开启后可以选择表格的列显示

		paging: null,
		paging_true: null,
		isPagingTrue: 0,

		editor: null,	// "default"/null/{options}
		update: "operation",	//complete
		autoRefresh: false,		//autoRefresh为true时自动载入，不论autoLoad
		refreshDuration: 10000,
		//progressbar: false,

		minLines: 0,
		maxLines: 0,

		maxColumn: 0,

		rows: [],

		// grid所在的div容器
		div_container: null,

		/*
		exportCfg:{
			url: null,				备份操作对应的URL
			checkCallback: null,	查询进度回调函数
			completeCallback: null	完成操作后的回调函数
		},
		importCfg:{
			url: null,
			checkCallback: null,
			completeCallback: null
		},
		*/

		promptTextSuccessed: $.su.CHAR.OPERATION.GRID_SAVED,
		promptTextFailed: $.su.CHAR.OPERATION.GRID_FAILED,
		noneSelectedMsgText: $.su.CHAR.OPERATION.GRID_NONE_SELECT,
		deleteConfirmMsgText: $.su.CHAR.OPERATION.GRID_DELETE_COMFIRM,
		maxRulesMsgText: $.su.CHAR.OPERATION.GRID_MAX_RULES,
		deleteAllConfirmMsgText: $.su.CHAR.OPERATION.GRID_DELETE_ALL_COMFIRM,

		maxRulesProperty: "max_rules",
		pagingHandle: null,

		showPrompt: true,
		inherited_parent: '',
		inherited_child: '',
		hyperlink_text: '',
		childTable: {},
		gridKey: '',
		selectedIds: [],	// 记录所有页面的已选id
		recordAllPagesSelect: false, // 是否启动分页后依然记住上一页选项功能
		idColumnIndex: null, //启动以上功能后，selectedIds中放置的是第idColumnIndex列的内容
		deleteHandler: null
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var tar = $(obj);
			this.selectedIds = [];
			$.extend(this, defaults, options);
			obj.id = obj.id || $.su.randomId("gird");

			if (!obj.isPanel){
				$(obj).panel(options).addClass("grid-panel");
			};

			//初始化表格容器
			var columns = this.columns;
			if (columns.length === 0){
				//console.error("Please define the columns property!");
				return false;
			};

			var btnSort = "", btnSelect = "", divSelect = "";
			var btnSort = "";
			if (obj.sortable){
				btnSort = "<button class=\"grid-header-btn btn-sort\"></button>";
			};
			if (obj.selectionDisplay) {
				var gridId = me.attr("id");
				btnSelect = "<button class=\"grid-top-btn btn-select\" style=\"width: 60px; position: absolute ;top: 0px\">内容</button>"
				divSelect = "<div class=\"div-select\" style=\"position: absolute; display: none;" +
					"width: 176px; z-index: 999; border: 1px solid #CCC; border-radius: 2px; background-color: #FFF;" +
					"box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2); padding: 8px 12px 0\">";
				for (var i = 0, length = columns.length; i < length; i++) {
					if (columns[i].dataIndex && !columns[i].hidden){
						divSelect += "<div style=\"font-size: 14px;line-height: 30px\">";
						divSelect += "<table> <tr>";
						// id取值加上grid id避免与页面其它id重复， class与th class相同用来点击时联动选取th td隐藏
						divSelect += "<th  width=\"10%\"> <input type=\"checkbox\" id=" + gridId + "_" + columns[i].dataIndex + " class=" + columns[i].dataIndex + " checked /> </th>";
						divSelect += "<th> <label for=" + gridId + "_" + columns[i].dataIndex + " class=" + columns[i].dataIndex + " style=\"width: 92%; display: inline-block\">" + columns[i].text + "</label> </th>";
						divSelect += "</tr> </table>";
						divSelect += "</div>";
					}
				};
				divSelect += "</div>";
			}
			var styleText = "<style type=\"text/css\">";

			var inHTML = '<div class="container grid-container" id=' + obj.id + '>';

				inHTML +=		btnSelect;
				inHTML +=		divSelect;
				inHTML +=		"<div class=\"container grid-header-container\">";
				inHTML +=			"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
				inHTML +=				"<tr class=\"grid-header-tr\">";

				// 组合筛选功能
				if (this.combo !== '' && typeof this.combo === 'string') {
					var proxy = new $.su.Proxy();
					var query = {};
					query[obj.comboFilterModule] = {table: obj.combo};
					proxy.query(query, function(data) {
						var comboHTML = '';
						comboHTML += '<div class="filter-row" id="filter-row">';
						$.map(data[obj.comboFilterModule][obj.combo], function(i, index) {
							var item = i[obj.combo + '_' + (index + 1)];
							comboHTML += '<div class="filter-container" style="width:180px"><div class="title-container"><input type="checkbox" class="checkbox-title" value="' + item.title_key + '"/><span class="filter-title">' + item.title_label + '</span></div>';
							comboHTML += '<div class="filter-table-container">';
							comboHTML += '<table class="filter-table" border="0" cellspacing="0" cellpadding="0">';
							$.map(item.options, function(option) {
								comboHTML += '<tr><td><label class="filter-table-checkbox"><input type="checkbox">' + option + '</label></td></tr>';
							});
							comboHTML += '</table></div></div>';
						});
						comboHTML += '</div>';
						$('#' + obj.id).prepend(comboHTML);
						$(".checkbox-title").on('click', function() {
							// 全选/全不选
							var checked = $(this).prop('checked');
							$(this).parent().next().find('input[type="checkbox"]').prop('checked', checked);
							getFilterForCombo(this, store, obj);
						});
						$(".filter-table-checkbox").unbind().bind('click', function(e) {
							// 此处在label上绑事件，点击label时会触发两次，一次是label本身，一次是关联checkbox冒泡到label的。
                            if(e.target.tagName !== "INPUT") return;

                            // 如果处于editor状态，则取消。
                            if (me.grid("isEditing")) {
								$(obj.editor).editor("cancelEdit");
							}

							// 单个被点击时判断是不是全都选中/没选中了，如果是则更新全选/全不选状态
							var checkboxes = $(this).parents('.filter-table').find('input[type="checkbox"]');
							var allChecked = true;
							for (var i = 0; i < checkboxes.length; i++) {
								var checked = $(checkboxes[i]).prop('checked');
								if (checked === false) {
									allChecked = false;
									break;
								}
							}
							$(this).parents('.filter-container').find('.checkbox-title').prop('checked', allChecked);
							getFilterForCombo(this, store, obj);
						});
						$(me).find(".filter-container").find(".checkbox-label").on('click', function() {})
					});
				}

			for (var index = 0; index < columns.length; index++){
				var column = columns[index];
				if(column.hidden){
					continue;
				}

				column.cls = column.cls || "",
				column.dataIndex = column.dataIndex || column.name || "",
				column.renderer = column.renderer || function(data){return $.su.func.escapeHtml(data)};
				var addOn = "";

				switch(column.xtype){
					case "checkcolumn":
						addOn +=	"<div class=\"checkbox-group-container grid-header-checkbox checkcolumn inline\">";
						addOn +=		"<div class=\"widget-wrap\">";
						addOn +=			"<label class=\"checkbox-label\">";
						addOn +=				"<input class=\"checkbox-checkbox\" type=\"checkbox\" value=\"\"/>";
						addOn +=				"<span class=\"icon\"></span>";
						addOn +=			"</label>";
						addOn +=		"</div>";
						addOn +=	"</div>";
						column.text = column.text || "";
						column.name = column.name || "select";
						column.width = column.width || 40;
						break;
					case "rownumberer":
						column.text = column.text || $.su.CHAR.GRID.ID;
						column.name = column.name || "seq";
						column.width = column.width || 50;
						break;
					case "settings":
						column.text = column.text || $.su.CHAR.GRID.OPERATION;
						column.name = column.name || "settings";
						column.width = column.width || 80;
						break;
					case "query_detail":
						column.text = column.text || $.su.CHAR.OPERATION.SEE_DETAIL;
						column.name = column.name || "query_detail";
						column.width = column.width || 40;
						break;
					case "download":
						column.text = column.text || $.su.CHAR.OPERATION.DOWNLOAD;
						column.name = column.name || "download";
						column.width = column.width || 40;
						break;
					case "disconnect":
						column.text = column.text || $.su.CHAR.OPERATION.DISCONNECT;
						column.name = column.name || "disconnect";
						break;
					case "statuscolumn":
						column.text = column.text || $.su.CHAR.GRID.STATUS;
						column.dataIndex = column.dataIndex || "status";
						column.name = column.name || column.dataIndex;
						column.width = column.width || 80;
						break;
					case "comment":
						column.text = column.text || "备注";
						column.dataIndex = column.dataIndex || "comment";
						column.name = column.name || column.dataIndex;
						column.width = column.width || 80;

						break;
					default:
						column.text = column.text || "";
						column.name = column.name || column.dataIndex;
				};

				if (column.width){
					styleText += "div#"+obj.id+" th.grid-header-"+index+",";
					styleText += "div#"+obj.id+" td.grid-content-td-"+index;
					if (column.nowrap) {
						styleText += "{width:"+column.width+"px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}";
					} else {
						styleText += "{width:"+column.width+"px;}";
					}
				};

				inHTML +=			"<th class=\"grid-header grid-header-"+index+" "+column.dataIndex+"\" name=\""+column.dataIndex+"\">";
				inHTML +=				addOn;
				inHTML +=				"<span class=\"content "+column.xtype+"\">"+column.text+"</span>";
				inHTML +=				btnSort;
				inHTML +=			"</th>";
			};

				inHTML +=				"</tr>";
				inHTML +=			"</table>";
				inHTML +=		"</div>";

				inHTML +=		"<div class=\"grid-content-container-outer\">";
				inHTML +=			"<div class=\"grid-content-container\">";

				inHTML +=				"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
				inHTML +=					"<tbody class=\"grid-content-data\">";
				inHTML +=					"</tbody>";
				inHTML +=				"</table>";

				inHTML +=			"</div>";

				inHTML +=		"</div>";
				inHTML +=	"</div>";

			var grid = $(inHTML);
			$(obj).find("div.panel-content-container").append(grid);

			grid.find("tbody.grid-content-data").append(me.grid("initEmptyRow"));

				styleText +=	"div#"+obj.id+ " div.grid-content-container{";

			var lineHeight = grid.find("tr.grid-content-tr").outerHeight();

			if (obj.minLines){
				styleText +=	"min-height:" + obj.minLines*lineHeight + "px;";
			};

			if (obj.maxLines){
				styleText +=	"max-height:" + obj.maxLines*(lineHeight) + "px;";
				grid.addClass("allow-scroll");
			};
				styleText +=    "}";

			styleText +=	"</style>";
			grid.prepend($(styleText));

			if(obj.maxLines){
				var header = grid.find("div.grid-header-container");
				var content = grid.find("div.grid-content-container-outer");
				header.css({"overflow-y": "scroll"});
				header.css({"overflow-x": "hidden"});
				header.find('table').css({"width": "1000px" });
				header.scroll(function(e){
					content.scrollLeft($(this).scrollLeft());
				});
				content.scroll(function(e){
					header.scrollLeft($(this).scrollLeft());
				});
			}

			if (!obj.store){
				//console.error("Debug: Grid without store!");
				return null;
			}else{
				if (!obj.store.isStore){
					obj.store = new $.su.Store(obj.store);
				};
				// store orderSensitive 初始化
				obj.store.orderSensitive = obj.orderSensitive;
			};

			this.isGrid = true;

			//以下我插件加载
			if (obj.operation){
				tar.grid("initTBar");
			};

			//初始化editor
			if (obj.editor){
				tar.grid("initEditor");
			};

			if(obj.download_msg){
				tar.grid("initDownloadMsg");
			};

			if(obj.upload_msg){
				tar.grid("initUploadMsg");
			};

			if(obj.query_detail_msg){
				tar.grid("initQueryDetail");
			}
		});

		// 添加事件监听
		var obj = me.get(0),
			store = obj.store,
			numPerPage = 10,
			totalNum = 0,
			maxSize = null;

			obj.rows = [];	//清空行队列
			//事件监听 store监听grid的事件

		if (store.updateMode == "operation"){
			//局部加载
			$(store).on("ev_insertdata", function(e, index, data){
					me.grid("insert", index, data);
					me.find("tr.grid-content-tr.empty").remove();
				//};
			}).on("ev_loaddata", function(e, data, others){
					var queryProxy = new $.su.Proxy({async:false,authSessionsDataFlag:true});
					var pagingHandle = obj.pagingHandle;
					// 数据加载完成后不再关闭editor，以此解决editor闪退bug
					// if (me.grid("isEditing")){
					// 	$(obj.editor).editor("cancelEdit");
					// };

					if (me.grid("getSelected").length>0)
					{
						if (undefined == me.get(0).paging)
						{
							return;
						}
						else if (!me.get(0).paging.isPaging)
						{
							return;
						}
					}

					//先执行ev_loaddata，再执行paging中的ev_load
					if (me.get(0).paging && me.get(0).paging.search)
					{
						/* 在搜索时，暂不获取总条目数 */
					}
					else if (me.get(0).paging || me.get(0).paging_true)
					{
						if (store.parseKey)
						{
							var moduleName = store.parseKey.moduleName;
							var tableName = store.parseKey.tableName;
							var pageSizeName = store.parseKey.pageSizeName;
							var maxSizeTableName = store.parseKey.maxSizeTableName;
							var maxSizeOptionName = store.parseKey.maxSizeOptionName;

							var postData = {};
							postData['global_config'] = {name:"page_size"};
							/* postData[moduleName] = {table: tableName};
											postData[moduleName]["para"] = {start: "0", end:"1"}; */

							/* 此处添加filter参数 */
							/*
							if (store.parseKey.getFilter)
							{
								var filterData = store.parseKey.getFilter();

								if (filterData)
								{
									postData[moduleName]["filter"] = filterData;
								}
							}
							*/
							if (maxSizeTableName)
							{
								postData['profile'] = {};
								postData['profile']['table'] = maxSizeTableName;
							}
							totalNum = others.count ? others.count : 0;
							queryProxy.query(postData, function(data){
								var pageSize = data.global_config.page_size;
								//var counts = data[moduleName]['count'][tableName];

								if (maxSizeTableName)
								{
									maxSize = 0;

									var item = data['profile'][maxSizeTableName][0];

									for (var i in item)
									{
										if ($.isArray(maxSizeOptionName))
										{
											for (var n = 0; n < maxSizeOptionName.length; n++)
											{
												maxSize += parseInt(item[i][maxSizeOptionName[n]]);
											}
										}
										else
										{
											maxSize = parseInt(item[i][maxSizeOptionName]);
										}

									}
								}

								/* pageSize中可能没有定义pageSizeName */
                                if (pageSizeName) {
                                	numPerPage = pageSize[pageSizeName];
								} else {
									numPerPage = 10;
								}

								numPerPage = numPerPage ? numPerPage : 10;


							});
						}

						if (pagingHandle != null)
						{
							/* 使用单独定义的处理函数，适用于系统日志这种不按套路出牌的模块 */
							if (typeof pagingHandle != "function")
							{
								/* 暂无处理 */
								return;
							}

							/* Input : NULL */
							/* Ouput : numPerPage, totalNum, maxSize */
							pagingHandle(function(data){
								var resultNumPerPage = data.resultNumPerPage;
								var resultTotalNum = data.resultTotalNum;
								var resultMaxSize = data.resultMaxSize;

								if (resultMaxSize)
								{
									maxSize = parseInt(resultMaxSize) ;
								}
								numPerPage = resultNumPerPage || 10;
								totalNum = resultTotalNum || 0;
							});
						}

						if (me.get(0).paging_true)
						{
							//others中有后台返回的pageSize，用来初始化分页
							if (me.get(0).paging && me.get(0).paging.isPaging == true){
								//me.get(0).paging.numPerPage = others ? others.pageSize : 10;
								//me.get(0).paging.totalNum = others ? others.totalNum : 0;
								me.get(0).paging.numPerPage = numPerPage;
								me.get(0).paging.totalNum = totalNum;
							}else{
								//me.get(0).paging_true.numPerPage = others ? others.pageSize : 10;
								//me.get(0).paging_true.totalNum = others ? others.totalNum : 0;
								me.get(0).paging_true.numPerPage = numPerPage;
								me.get(0).paging_true.totalNum = totalNum;

								if (maxSize)
								{
									me.get(0).paging_true.maxNum = maxSize;
								}
								else
								{
									if (store.parseKey.maxNum)
									{
										me.get(0).paging_true.maxNum = store.parseKey.maxNum;
									}
									else
									{
										me.get(0).paging_true.maxNum = 1000;
									}
								}

								//me.get(0).paging_true.maxNum = maxSize ? maxSize : 1000;
							}
						}
						else
						{
							if (me.get(0).paging){
								//me.get(0).paging.numPerPage = others ? others.pageSize : 10;
								//me.get(0).paging.totalNum = others ? others.totalNum : 0;
								me.get(0).paging.numPerPage = numPerPage;
								me.get(0).paging.totalNum = totalNum;
							}
						}

						me.grid("initPaging");
					}

					me.grid("load", data, others);

					if (others){
						var maxRules = others[obj.maxRulesProperty];
						obj.maxRules = maxRules || 0;
					};

			}).on("ev_updatedata", function(e, key, index, data){
				me.grid("update", key, index, data);

			}).on("ev_removedata", function(e, keyArray, indexArray){
					me.grid("remove", keyArray);
			});
		}else{
			//全部刷新
			$(store).on("ev_loaddata", function(e, data, others){
				// 数据加载完成后不再关闭editor，以此解决editor闪退bug
				// if (me.grid("isEditing")){
					// $(obj.editor).editor("cancelEdit");
				// };

				if (me.get(0).paging || me.get(0).paging_true)
				{
					me.grid("initPaging");
				}

				me.grid("load", data);

				if (others){
					var maxRules = others[obj.maxRulesProperty];
					obj.maxRules = maxRules || 0;
				};
			});
		};


		//行事件的监听
		me.delegate("tr.grid-content-tr", "click", function(e){
			e.stopPropagation();
			e.preventDefault();
			/*var tar = $(this);
			if (e.shiftKey){
				//选择添加或减少
				tar.toggleClass("selected");
				if (tar.hasClass("selected")){
					tar.find("td.grid-content-td-check-column input[type=checkbox]").prop("checked", true);
				}
			}else{
				var trList = me.find("tr.grid-content-tr")
				trList.removeClass("selected");
				trList.find("td.grid-content-td-check-column input[type=checkbox]").prop("checked", false);

				tar.addClass("selected");
				tar.find("td.grid-content-td-check-column input[type=checkbox]").prop("checked", true);

				var key = $(this).attr("data-key"),
					store = me.grid("getStore");
				if (store && key !== undefined && key !== "undefined"){
					var	data = store.getData(key);
					me.trigger("ev_lineclicked", [key, data]);
				};
			};*/

			var key = $(this).attr("data-key"),
				store = me.grid("getStore");
			if (store && key !== undefined && key !== "undefined"){
				var	data = store.getData(key);
				me.trigger("ev_lineclicked", [key, data]);
			};

			return false;
		});
		me.delegate("tr.grid-content-tr", "mouseover", function(e){
			e.stopPropagation();
			e.preventDefault();
			e.currentTarget.bgColor = "#deeeee";

			return false;
		});
		me.delegate("tr.grid-content-tr", "mouseout", function(e){
			e.stopPropagation();
			e.preventDefault();
			e.currentTarget.bgColor = "";

			return false;
		});
		me.delegate("td.grid-content-td-check-column label.checkbox-label", "click", function(e){
			e.stopPropagation();
			e.preventDefault();

			var editorObj = me.grid("getEditor");
			if (editorObj && editorObj.isEditor){
				if (editorObj.editing){
					$(editorObj).editor("shake");
					return;
				};
			};

			//console.log("label")
			var label = $(this),
				tr = label.closest("tr.grid-content-tr"),
				checkbox = label.find("input[type=checkbox]");
			tr.toggleClass("selected");
			//console.log(tr)
			if (obj.recordAllPagesSelect) {
				var ifSelected = tr.hasClass("selected");
				handleRecordAllPagesSelect(tr[0], ifSelected, obj)
			}
			if (tr.hasClass("selected")){
				checkbox.prop("checked", true);
				label.addClass("checked");
			}else{
				checkbox.prop("checked", false);
				label.removeClass("checked");
			};
			//如果勾选框不全选或全选了，同步th上的勾选框
			var trList = me.find("tr.grid-content-tr:not(:hidden)");
			var label = me.find("tr.grid-header-tr label.checkbox-label");//.closest("div.checkbox-group-container");//.closest("");
			var container = label.closest("div.checkbox-group-container");
			if(trList.length>0){
				//不全选
				for(var index=0; index<trList.length; ++index){
					//console.log($(trList[index]).hasClass("selected"))
					if($(trList[index]).hasClass("disabled") || $(trList[index]).hasClass("unavailable")){
						continue;
					}
					if(!$(trList[index]).hasClass("selected")){
						break;
					}
				}
				if(index != trList.length){
					container.removeClass("selected");
					label.removeClass("checked");
				}
				//全选
				for(var index=0; index<trList.length; ++index){
					//console.log($(trList[index]).hasClass("selected"))
					if($(trList[index]).hasClass("disabled") || $(trList[index]).hasClass("unavailable")){
						continue;
					}
					if(!$(trList[index]).hasClass("selected")){
						break;
					}
				}
				if(index == trList.length){
					container.addClass("selected");
					label.addClass("checked");
				}
			}

			return false;
		}).delegate("th.grid-header div.checkcolumn label.checkbox-label", "click", function(e){
			e.stopPropagation();
			e.preventDefault();

			var editorObj = me.grid("getEditor");
			if (editorObj && editorObj.isEditor){
				if (editorObj.editing){
					$(editorObj).editor("shake");
					return;
				};
			};

			var label = $(this),
				container = $(this).closest("div.checkbox-group-container"),
				trList = me.find("tr.grid-content-tr:not(:hidden):has(td.grid-content-td-check-column:not(.disabled))");//非隐藏非disabled
				//console.log(label)
				//console.log(container)
			if (container.hasClass("selected")){
				container.removeClass("selected");

				trList.removeClass("selected");
				trList.find("label.checkbox-label").removeClass("checked");
				trList.find("input[type=checkbox]").prop("checked", false);

				label.find("input[type=checkbox]").prop("checked", false);
				label.removeClass("checked");
			}else{
				container.addClass("selected");

				//console.log($(this).find("input[type=checkbox]"))
				trList.addClass("selected");
				trList.find("input[type=checkbox]").prop("checked", true);
				trList.find("label.checkbox-label").addClass("checked");

				label.find("input[type=checkbox]").prop("checked", true);
				label.addClass("checked");
			};

			if (obj.recordAllPagesSelect) {
				var ifSelected = container.hasClass("selected");
				for (var i = 0; i < trList.length; i++) {
					var tr = trList[i];
					handleRecordAllPagesSelect(tr, ifSelected, obj)
				}
			}

			return false;
		});

		var btn_status_id = false;
		var btn_delete_id = false;

		/* 此处用于触发禁用或启用事件 */
		me.delegate("a.grid-content-btn.grid-content-btn-status", "click", function(e){
			e.preventDefault();
			e.stopPropagation();
			var btn = $(this),
				tr = $(this).closest("tr.grid-content-tr");
			if (tr.hasClass("disabled")){
				return;
			};

			var editorObj = me.grid("getEditor");
			if (editorObj && editorObj.isEditor){
				if (editorObj.editing){
					$(editorObj).editor("shake");
					return;
				};
			};

			var	key = btn.attr("data-key"),
				value = btn.attr("data-value"),
				vOn = btn.attr("data-on"),
				vOff = btn.attr("data-off"),
				name = btn.attr("data-name"),
				store = me.grid("getStore"),
				keyProperty = store.keyProperty,
				dOld = $.extend({}, store.getData(key));

			delete dOld[keyProperty];

			var opt = {};
				opt[name] = (value === vOn) ? vOff : vOn;

			var	dNew = $.extend({}, dOld, opt);

			if(btn_status_id){
				clearTimeout(btn_status_id);
				btn_status_id = false;
			}
			btn_status_id = setTimeout(function(){
				me.grid("runProgress");
				store.update(key, {updateData: dNew, opt: opt}, function(){
					me.grid("prompt", true);
					setTimeout(function() {
						me.trigger("ev_statusChange");
					}, 100);

				}, function(){
					me.grid("prompt", false);
				});
			},500);

		}).delegate("a.grid-content-btn.grid-content-btn-delete", "click", function(e){
			e.preventDefault();
			e.stopPropagation();

			var btn = $(this),
				tr = btn.closest("tr.grid-content-tr");
			if (tr.hasClass("disabled")){
				return;
			};
			if (tr.hasClass("disable-delete")){
				return;
			}

			var	key = btn.attr("data-key"),
				editorObj = me.grid("getEditor");

			if (editorObj && editorObj.isEditor){
				if (editorObj.editing === false){
					store = me.get(0).store;
					if(btn_delete_id){
						clearTimeout(btn_delete_id);
						btn_delete_id = false;
					}
					btn_delete_id = setTimeout(function(){
						me.grid("runProgress");
						$.su.loading.show();
						store.remove([key], store.rmField, function(){
							me.grid("prompt", true);
							$.su.loading.hide();
						}, function(){
							me.grid("prompt", false);
							me.trigger("ev_deleteError");
							$.su.loading.hide();
						}, function(){
							me.grid("prompt", false);
							me.trigger("ev_deleteError");
							$.su.loading.hide();
						});
					},500);
				}else{
					$(editorObj).editor("shake");
				};
			};
			//console.log("item delete");
		});

		// 宽度拖拽相关事件
		var tempTh;
		var minWidth = 20;
		var adjustmentWidth = 10;
		var gridId = me.attr('id');
		if(!obj.maxLines){
			$(document).find('.grid-container').css("overflow-x", "auto");
		}
		$("#" + gridId + " th.grid-header").on("mousedown", function (event) {
			tempTh = this;
			// console.log($(this).width(), tempTh.offsetWidth);
			if (event.offsetX > $(this).width() - adjustmentWidth) { // 在距离border-right 10px内才能调整
				tempTh.move = true;
				tempTh.prevX = event.clientX;
				tempTh.prevWidth = $(this).width();
			};

			$("body").on("mousemove", function (event) { // 调整宽度
				if (tempTh && tempTh.move) {
					if (tempTh.prevWidth + (event.clientX - tempTh.prevX) > minWidth) { // 调整列宽,最小宽度为20
						tempTh.width = tempTh.prevWidth + (event.clientX - tempTh.prevX);
					}

					tempTh.style.width = tempTh.width + 'px'; // 当前拖拽列th宽度

					me.grid.calculateTdWidth(gridId);
				}
			});
		});

		$("#" + gridId + " .grid-header").on("mousemove", function (event) {
			event.preventDefault(); // 避免鼠标拖拽选中theader的文字产生的表格拖拽默认事件
			if (event.offsetX > this.offsetWidth - adjustmentWidth) {
				this.style.cursor = 'col-resize';
			} else {
				this.style.cursor = 'default';
			}
		});

		$("body").on("mouseup", function () {
			if (tempTh && tempTh.move) {
				tempTh.move = false;
				$("#body").off("mousemove")
			}
		});

		// 设置部分列可见相关事件
		$("#" + gridId + " .grid-top-btn.btn-select").on("click", function (event) {
			event.stopPropagation();
			$("#" + gridId + " .div-select").toggle();
		});

		$("#" + gridId + " .div-select").on("click", function (event) {
			event.stopPropagation();
		});

		$("body").on("click", function () {
			$("#" + gridId + " .div-select").hide();
		});

		$("#" + gridId + " .div-columns-select input:checkbox").on("click", function (event) {
			event.stopPropagation();
		});

		$("#" + gridId + " .div-select input:checkbox").on("change", function () {
			var selector = "#" + gridId + " th." + $(this).attr("class"),
				columnIndex = $(selector).index();
			$(selector).toggle();
			$("#" + gridId + " table tr").find("td:eq(" + columnIndex + ")").each(function () {
				$(this).toggle();
			});

			me.grid.calculateTdWidth(gridId);
		});

		return me;
	},

	calculateTdWidth: function(gridId) { // td宽度与th保持一致
		var thWidthArr = [];
		$("#" + gridId + " th.grid-header").each(function () {
			thWidthArr.push($(this).width());
		});
		for (var i = 0;i < thWidthArr.length; i++) {
			$("#" + gridId + " table ").find("td:eq(" + i + ")").each(function() {
				$(this).width(thWidthArr[i]);
			})
			// $("#" + gridId + " table .grid-content-td-" + i).css('width', thWidthArr[i]) // 太卡
		}
	},

	initRow: function(me, params){	//row-index, data 返回html值
		var me = me || this,
			obj = me.get(0),
			jndex = params[1] || 0,
			data = params[2],
			key = data[obj.store.keyProperty],
			columns = me.grid("getColumns");
		//console.log(data, keyProperty)
		var inHTML = 	"<tr class=\"grid-content-tr grid-content-tr-"+key+"\" data-key=\""+key+"\" >";

		for (var lastVisibleIndex = columns.length - 1; lastVisibleIndex>=0; lastVisibleIndex--){
			if (!columns[lastVisibleIndex].hidden){
				break;
			}
		}
		for (var firstVisibleIndex = 0; firstVisibleIndex < columns.length; firstVisibleIndex++){
			if (!columns[firstVisibleIndex].hidden){
				break;
			}
		}

		var len = columns.length,
			actionFlag = [];
		//console.log(data);
		for (var kndex = 0; kndex < len; kndex++){
			var column = columns[kndex],
				dd = (data[column.dataIndex] == undefined  || data[column.dataIndex].toString() == "") ? "---" : data[column.dataIndex],
				fst = (kndex === firstVisibleIndex) ? "fst" : "",
				lst = (kndex === lastVisibleIndex) ? "lst" : "";
				// 有数据时拿到列头的宽度在内容td刷新时赋给列表内容,并且保持列的隐藏显示
				styleText = "width: " + columns[kndex].width + "px; display:" + columns[kndex].display;

			if(column.hidden){
				continue;
			}

			//console.log(column.xtype, column.dataIndex, data[column.dataIndex], column.renderer);
			switch (column.xtype){
				case "rownumberer":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-row-numberer "+fst+" "+lst+" "+column.cls+ "\" name=\"row-numberer\" style=\""+styleText+"\">";
					inHTML += 		"<span class=\"grid-row-numberer content\">"+(jndex+1)+"</span>";
					inHTML += 	"</td>";
					break;
				case "checkcolumn":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-check-column "+fst+" "+lst+"\" name=\"check-column\" style=\""+styleText+"\">";
					//inHTML += 		"<input type=\"checkbox\"/>";
					inHTML +=		"<div class=\"checkbox-group-container\">";
					inHTML +=			"<div class=\"widget-wrap\">";
					inHTML +=				"<label class=\"checkbox-label\">";
					inHTML +=					"<input class=\"checkbox-checkbox\" type=\"checkbox\" value=\""+key+"\"/>";
					inHTML +=					"<span class=\"icon\"></span>";
					inHTML +=				"</label>";
					inHTML +=			"</div>";
					inHTML +=		"</div>";
					inHTML +=		"<span class=\"content\">--</span>";
					inHTML += 	"</td>";
					break;
				case "statuscolumn":
					var res = "",
						cls = "",
						title = "",
						val = "",
						trueValue = column.trueValue || "on",
						falseValue = column.falseValue || "off";

					if (data[column.dataIndex] === trueValue){
						res = $.su.CHAR.GRID.IS_ENABLED;
						cls = "disabled";
						title = $.su.CHAR.GRID.DISABLED;
						val = trueValue;
					}else{
						res = $.su.CHAR.GRID.IS_DISABLED;
						cls = "enabled";
						title = $.su.CHAR.GRID.ENABLE;
						val = falseValue;
					};

					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-status-column "+fst+" "+lst+"\" name=\"check-column\" style=\""+styleText+"\">";
					inHTML +=		"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-name=\""+column.dataIndex+"\" data-value=\""+val+"\" data-key=\""+key+"\" data-on=\""+trueValue+"\" data-off=\""+falseValue+"\" title=\""+ title +"\" class=\"grid-content-btn grid-content-btn-status btn-status "+cls+"\">";
					inHTML +=			"<span class=\"text\">"+res+"</span>";
					inHTML +=			"<span class=\"icon\"></span>";
					inHTML +=		"</a>";
					inHTML += 	"</td>";
					break;
				case "settings":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-settings-column "+fst+" "+lst+"\" name=\"settings-column\" style=\""+styleText+"\">";
					if(column.renderer.call(me, 'edit', dd, jndex, data)){// default return value will be 'edit', so it's true
						inHTML +=	"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-key=\""+key+"\" title=\""+ $.su.CHAR.OPERATION.EDIT +"\" class=\"grid-content-btn grid-content-btn-edit btn-edit\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.EDIT+"</span>";
						inHTML +=	"</a>";
					}
					if(column.renderer.call(me, 'delete', dd, jndex, data)){// default return value will be 'delete', so it's true
						inHTML +=	"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-key=\""+key+"\" title=\""+ $.su.CHAR.OPERATION.DELETE +"\" class=\"grid-content-btn grid-content-btn-delete btn-delete\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DELETE+"</span>";
						inHTML +=	"</a>";
					}
					inHTML += "<span class=\"content\">---</span>";
					inHTML += 	"</td>";
					break;
				case "setting_only_edit":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-settings-column "+fst+" "+lst+"\" name=\"settings-column\" style=\""+styleText+"\">";
					if(column.renderer.call(me, 'edit', dd, jndex, data)){// default return value will be 'edit', so it's true
						inHTML +=	"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-key=\""+key+"\" title=\""+ $.su.CHAR.OPERATION.EDIT +"\" class=\"grid-content-btn grid-content-btn-edit btn-edit\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.EDIT+"</span>";
						inHTML +=	"</a>";
					}
					inHTML += "<span class=\"content\">---</span>";
					inHTML += 	"</td>";
					break;
				case "query_detail":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-settings-column "+fst+" "+lst+"\" name=\"settings-column\" style=\""+styleText+"\">";
					if(column.renderer.call(me, 'query_detail', dd, jndex, data)){// default return value will be 'edit', so it's true
						inHTML +=	"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-key=\""+key+"\" title=\""+ $.su.CHAR.OPERATION.QUERY_DETAIL +"\" class=\"grid-content-btn grid-content-btn-query-detail btn-query-detail\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.QUERY_DETAIL+"</span>";
						inHTML +=	"</a>";
					}
					inHTML += "<span class=\"content\">---</span>";
					inHTML += "</td>";
					break;
				case "download":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-settings-column "+fst+" "+lst+"\" name=\"settings-column\" style=\""+styleText+"\">";
					if(column.renderer.call(me, 'download', dd, jndex, data)){// default return value will be 'edit', so it's true
						inHTML +=	"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-key=\""+key+"\" title=\""+ $.su.CHAR.OPERATION.DOWNLOAD +"\" class=\"grid-content-btn grid-content-btn-download btn-download\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DOWNLOAD+"</span>";
						inHTML +=	"</a>";
					}
					inHTML += "<span class=\"content\">---</span>";
					inHTML += "</td>";
					break;
				case "disconnect":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-settings-column "+fst+" "+lst+"\" name=\"settings-column\" style=\""+styleText+"\">";
					if(column.renderer.call(me, 'disconnect', dd, jndex, data)){// default return value will be 'delete', so it's true
						inHTML +=	"<a href=\"javascript:void(0);\" data-index=\""+jndex+"\" data-key=\""+key+"\" title=\""+ $.su.CHAR.OPERATION.DISCONNECT +"\" class=\"grid-content-btn grid-content-btn-delete btn-delete\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DISCONNECT+"</span>";
						inHTML +=	"</a>";
					}
					inHTML += "<span class=\"content\">---</span>";
					inHTML += 	"</td>";
					break;
				case "actioncolumn":
					var items = column.items;
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-action-column "+fst+" "+lst+"\" name=\"action-column\" style=\""+styleText+"\">";
					inHTML +=		"<div class=\"grid-content-td-wrap\">";
					for (var index = 0; index < items.length; index++){
						var item = items[0];
						inHTML+= 	"<input class=\"actioncolumn-input\" data-index=\""+jndex+"\" data-type=\""+item.xtype+"\" data-property=\""+column.dataIndex+"\" data=\""+column.renderer.call(me, dd, jndex, data)+"\" />";
					};
					inHTML +=		"</div>";
					inHTML += 	"</td>";
					actionFlag.push(kndex);
					break;
				case "comment":
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-comment "+fst+" "+lst+"\" name=\"action-column\" style=\""+styleText+"\">";
					inHTML +=		"<div class=\"grid-content-td-wrap\">";

					dd = $.su.func.escapeHtml(unescape(dd));
					inHTML += 		dd;
					inHTML +=		"</div>";
					inHTML += 	"</td>";
					break;
				default:
					inHTML += 	"<td class=\"grid-content-td grid-content-td-"+kndex+" grid-content-td-"+column.name+" "+fst+" "+lst+" "+column.cls+"\" name=\""+column.name+"\" style=\""+styleText+"\">";
					if (column.nowrap) {
						inHTML += "<span class=\"content\" title=" + column.renderer.call(me, dd, jndex, data) + ">"+column.renderer.call(me, dd, jndex, data)+"</span>";
					} else {
						inHTML += 	"<span class=\"content\">"+column.renderer.call(me, dd, jndex, data)+"</span>";
					}
					inHTML += 	"</td>";
					break;
			};
		};

		inHTML +=		"</tr>";

		//对象初始化
		var row = $(inHTML);
		if (actionFlag.length > 0){
			for (var index = 0; index < actionFlag.length; index++){
				var num = actionFlag[index],
					items = columns[num].items,
					cellObj = row.find("td.grid-content-td-"+num);

				var inputs = cellObj.find("input.actioncolumn-input"),
					dIndex = inputs.attr("data-index"),			//条目序号
					dataIndex = inputs.attr("data-property"),	//属性项
					dd = me.grid("getStore").data[dIndex] || {};

				for (var lndex = 0; lndex < items.length; lndex++){
					var propertyObj = {},
						item = items[lndex],
						dIndex = item.dIndex;

					if (item.properties){
						var properties = item.properties;
						for (var mndex = 0; mndex < properties.length; mndex++){
							var property = properties[mndex];
							if (property.value === undefined || property.value === null){
								propertyObj[property.property] = property.index;
							}else{
								propertyObj[property.property] = (data[property.index] === property.value) ? true : false;
							};
						};
					};

					var input = inputs.eq(lndex),
						item = items[lndex],
						xtype = item.xtype,
						dIndex = item.dIndex,
						daIndex = item.dataIndex || dataIndex,
						di = input.attr("data-index");

					if (xtype == "html"){
						var renderer = item.renderer || function(d, dd){return "<span>"+d+"</span>"},
							inHTML = "";

						if (!dIndex || dIndex == ""){
							inHTML = renderer(dd[daIndex], dd, di);
						}else{
							var d = "";
							if (dd[dataIndex]){
								d = dd[dataIndex][dIndex] || "";
							}
							inHTML = renderer(d, dd);
						};

						input.replaceWith($(inHTML));
						//input.remove();
					}else{
						input[xtype]($.extend({}, item, propertyObj));

						if (!dIndex || dIndex == ""){
							input[xtype]("setValue", dd[daIndex]);
						}else if (dd[dataIndex]){
							var d = "";
							if (dd[dataIndex]){
								d = dd[dataIndex][dIndex] || "";
							};
							input[xtype]("setValue", d);
						};
					};

				};
			};
		};

		me.trigger("ev_rowinited", [data, jndex, key]);
		return row;
	},
	initEmptyRow: function(me){
		var me = me || this,
			columns = me.grid("getColumns");

		for (var lastVisibleIndex = columns.length - 1; lastVisibleIndex>=0; lastVisibleIndex--){
			if (!columns[lastVisibleIndex].hidden){
				break;
			}
		}
		var inHTML = 	"<tr class=\"grid-content-tr empty\">";

		for (var index = 0, len = columns.length; index < len; index++){
			if (!!columns[index].hidden){
				continue;
			}
			var lst = (index == lastVisibleIndex) ? "lst" : "",
			// 无数据时拿到列头的宽度在内容td刷新时赋给列表内容,并保持列表的隐藏显示
			styleText = "width: " + columns[index].width + "px; display: " + columns[index].display;
			inHTML += 		"<td class=\"grid-content-td grid-content-td-"+index+" "+lst+"\" style=\""+styleText+"\">--</td>";
		};
			inHTML +=	"</tr>";

		var row = $(inHTML);
		return row;
	},
	initTBar: function(me, params){
		var me = me || this,
			tar = me.get(0);

		if (!tar){
			return null;
		};

		//这里需要判断类型
		var type = $.type(tar.operation);
		var operations = null;
		//console.log(type, tar.operation);
		if (type === "string"){
			operations = tar.operation.split("|");
		}else if (type === "array"){
			operations = tar.operation;
		}else{
			return null;
		};
		tar.operation = operations;
		//console.log(operations);
		//var operations = tar.operation.split("|");
		var toolbarHintMsg;
		if (tar.toolbarHint) {
			var msgInHTML = 	"<h4 class=\"title\" id=\"toolBarHint\">"
				msgInHTML +=		"<span class=\"text\" id=\"toolBarHint_confirm_content\"></span>"
				msgInHTML +=	"</h4>"

			toolbarHintMsg = $("<div id=\"toolbarHint_msg\">").msg({
				okHandler:function(){
					if (tar.toolbarHint["searchAll"].show_flag) {
						var searcher = $(me.get(0).searcherAll);
						searcher.search("showPopUpScan");
					}else if(tar.toolbarHint["searchLog"].show_flag) {
						var searcher = $(me.get(0).searcherAll);
						searcher.log_search("showPopUpScan");
					}else if (tar.toolbarHint["import"].show_flag) {
						tar.import_msg.find("#file").file("reset");
						tar.import_msg.msg("show");
					} else if (tar.toolbarHint["export"].show_flag) {
						tar.export_msg.trigger("backcfg_write");
					}
					return true;
				},
				cancelHandler:function(){
					return true;
				},
				cls: 'warning reboot-confirm-size',
				closeBtn: false,
				type: "confirm",
				innerHTML: msgInHTML
			}).on("ev_close", function(){
				for (var i in tar.toolbarHint) {
					tar.toolbarHint[i].show_flag = false;
				}
			});
			tar.toolbarHintMsg = toolbarHintMsg;
		}
		var inHTML = "<div class=\"operation-container\">";
		for (var index = 0, len = operations.length; index < len; index++){
			var fst = (index === 0) ? "fst" : "",
				lst = (index === len-1) ? "lst" : "";

			switch (operations[index]){
				case "add":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-add "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.ADD+"</span>";
					inHTML +=	"</a>";

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+tar.maxRulesMsgText+"</span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var maxRulesMsg = $("<div class=\"grid-max-rules-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					});

					tar.maxRulesMsg = maxRulesMsg;
					break;
				case "upload":
						inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-upload "+fst+" "+lst+"\">";
						inHTML +=		"<span class=\"icon\"></span>";
						inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.UPLOAD+"</span>";
						inHTML +=	"</a>";
					break;
				case "edit":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-edit "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.EDIT+"</span>";
					inHTML +=	"</a>";
					break;
				case "prompt":
					inHTML +=	"<div class=\"grid-prompt hidden widget-container successed inline-block left\">";
					inHTML += 		"<div class=\"content\">";
					inHTML +=			"<span class=\"icon\"></span>";
					inHTML +=			"<span class=\"text text-successed\">"+tar.promptTextSuccessed+"</span>";
					inHTML +=			"<span class=\"text text-failed\">"+tar.promptTextFailed+"</span>";
					inHTML +=		"</div>";
					inHTML +=	"</div>";

					tar.showPrompt = true;
					break;
				/*case "reset":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-reset "+fst+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.RESET+"</span>";
					inHTML +=	"</a>";
					break;*/
				case "delete":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-delete "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DELETE+"</span>";
					inHTML +=	"</a>";

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var noneSelectMsg = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					});

						msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+tar.deleteConfirmMsgText+"</span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var deleteConfirmMsg = $("<div class=\"grid-delete-comfirm-msg\"></div>").msg({
						type: "prompt",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML,
						okHandler: tar.deleteHandler || function(e){
							me.trigger("ev_startDelete");
							var selectedKeys = me.grid("getSelected"),
							store = me.grid("getStore");
							var data_len = store.data.length;
							if (selectedKeys.length > 0){
								var cannotDelete = false;
								$.map(selectedKeys, function(key, index){
									var disabledTrs = me.find("tr.grid-content-tr:not(:hidden).selected.disable-delete.grid-content-tr-"+key);
									if(disabledTrs.length != 0){
										cannotDelete = true;
										return;
									}
								});
								if(cannotDelete == true){
									me.trigger("ev_deleteError", "disable-delete");
									return;
								}

								me.grid("runProgress");
								$.su.loading.show();
								store.remove(selectedKeys, store.rmField, function(){
									me.grid("prompt", true);
									setTimeout(function(){
										$.su.loading.hide();
									}, store.loadDelay ? data_len*store.loadDelay : data_len*0.5);
								}, function(){
									me.trigger("ev_deleteError");
									me.grid("prompt", false);
									$.su.loading.hide();
								}, function(){
									me.trigger("ev_deleteError");
									me.grid("prompt", false);
									$.su.loading.hide();
								});
								//console.log(store, selectedKeys);
							};
						}
					});

					tar.noneSelectMsg = noneSelectMsg;
					tar.deleteConfirmMsg = deleteConfirmMsg;

					break;
				case "deleteAll":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-delete-all "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DELETE_ALL+"</span>";
					inHTML +=	"</a>";

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var noneSelectMsg = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					});

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+tar.deleteAllConfirmMsgText+"</span>";
						msgInHTML +=		"</h4>"
						msgInHTML += 	"</div>";

					var deleteConfirmMsg = $("<div class=\"grid-delete-comfirm-msg\"></div>").msg({
						type: "prompt",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML,
						okHandler: function(e){
							var	store = me.grid("getStore"),
								keyProperty = store.keyProperty,
								selectedKeys = [],
								data = store.data;
							var data_len = store.data.length;
							for (var index = 0, len = data.length; index < len; index++){
								selectedKeys.push(data[index][keyProperty]);
							};

							if (selectedKeys.length > 0){
								var cannotDelete = false;
								$.map(selectedKeys, function(key, index){
									var disabledTrs = me.find("tr.grid-content-tr:not(:hidden).selected.disable-delete.grid-content-tr-"+key);
									if(disabledTrs.length != 0){
										cannotDelete = true;
										return;
									}
								});
								if(cannotDelete == true){
									me.trigger("ev_deleteError", "disable-delete");
									return;
								}

								me.grid("runProgress");
								$.su.loading.show();
								store.remove(selectedKeys, {}, function(){
									me.grid("prompt", true);
									setTimeout(function(){
										$.su.loading.hide();
									}, store.loadDelay ? data_len*store.loadDelay : data_len*0.5);
								}, function(){
									me.grid("prompt", false);
									me.trigger("ev_deleteError");
									setTimeout(function(){
										$.su.loading.hide();
									}, store.loadDelay ? data_len*store.loadDelay : data_len*0.5);
								}, function(){
									me.grid("prompt", false);
									me.trigger("ev_deleteError");
									$.su.loading.hide();
								});
							}
						}
					});

					tar.noneSelectMsg = noneSelectMsg;
					tar.deleteConfirmMsg = deleteConfirmMsg;

					break;
				case "enable":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-enable "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.ENABLE+"</span>";
					inHTML +=	"</a>";

					var msgInHTML_g = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML_g +=		"<h4 class=\"title\">";
						msgInHTML_g +=			"<span class=\"icon\"></span>";
						msgInHTML_g +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
						msgInHTML_g +=		"</h4>";
						msgInHTML_g += 	"</div>";

					var noneSelectMsg_g = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML_g
					});

					tar.noneSelectMsg_g = noneSelectMsg_g;

					break;
				case "disable":
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-disable "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DISABLE+"</span>";
					inHTML +=	"</a>";

					var msgInHTML_g = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML_g +=		"<h4 class=\"title\">";
						msgInHTML_g +=			"<span class=\"icon\"></span>";
						msgInHTML_g +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
						msgInHTML_g +=		"</h4>";
						msgInHTML_g += 	"</div>";

					var noneSelectMsg_g = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML_g
					});

					tar.noneSelectMsg_g = noneSelectMsg_g;

					break;
				case "search":
				/*
					inHTML +=	"<div class=\"container widget-container text-container search-container inline\">";
					inHTML +=		"<span class=\"widget-wrap text-wrap search-wrap\">";
					inHTML +=			"<input type=\"text\" class=\"text-text search-text\" value=\""+$.su.CHAR.OPERATION.SEARCH+"\" />";
					inHTML +=			"<span class=\"pos\"></span>"
					inHTML +=			"<a href=\"javascript:void(0);\" class=\"search-switch\"></a>"
					inHTML +=		"</span>";
					inHTML +=	"</div>";
					break;
				*/
					//搜索提示框
					var serInHTML = "";
					//serInHTML +=	"<div id=\"scan_page\" class=\"hidden\">";
					serInHTML +=		"<div class=\"scan_page_content_container\">";
					serInHTML +=			"<input id = \"slt_name\">";
					serInHTML +=			"<input id = \"scan_content\">";
					serInHTML +=			"<input id = \"slt_method\">";
					serInHTML +=			"<input id = \"slt_status\">";
					serInHTML +=			"<div class=\"scan_btn_container\">";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_do_scan\">搜索</button></span>";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_show_all\">显示全部</button></span>";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_return\">返回</button></span>";
					serInHTML +=			"</div>";
					serInHTML +=		"</div>";
					//serInHTML +=	"</div>";
					var scan_page = $("<div class=\"scan_page_msg\">").msg({
						closeBtn: true,
						//global: true,
						cls:"l",
						type: 'window',
						_title: "当前页搜索",
						search: true,
						innerHTML: serInHTML
					});
					scan_page.css({"width":"420px"});

					/* version 0.0.1 */
					var options = {grid: me, _type: "page"};
					var searcher = scan_page.search(options);
					tar.searcher = searcher.get(0);

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text searching-hint\"></span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var searchMsg = $("<div class=\"grid-none-searching-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					}).on("ev_close", function(){
						if (!$(tar.searcher).is(":hidden")){
							$(tar.searcher).css({"z-index":"999"});//, "display":"block"
							//console.log("searcher done.");
						}else if (tar.searcherAll && !$(tar.searcherAll).is(":hidden")){
							$(tar.searcherAll).css({"z-index":"999"});//, "display":"block"
							//console.log("searcherAll done.");
						}
					});
					searchMsg.find("div.msg-btn-container").css("margin-right", "39px");
					tar.searchMsg = searchMsg;

					inHTML +=	"<a href=\"javascript:void(0);\" id=\"search\" class=\"operation-btn btn-search "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.SEARCH+"</span>";
					inHTML +=	"</a>";
					break;
				case "searchAll":
				case "searchInGroup":
					//搜索提示框
					var serInHTML = "";
					serInHTML +=		"<div class=\"scan_page_content_container\">";
					serInHTML +=			"<input id = \"slt_name\">";
					serInHTML +=			"<input id = \"scan_content\">";
					serInHTML +=			"<input id = \"slt_method\">";
					serInHTML +=			"<input id = \"slt_status\">";
					serInHTML +=			"<div class=\"scan_btn_container\">";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_do_scan\">搜索</button></span>";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_show_all\">显示全部</button></span>";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_return\">返回</button></span>";
					serInHTML +=			"</div>";
					serInHTML +=		"</div>";

					var search_title = (operations[index] == "searchAll" ? $.su.CHAR.OPERATION.SEARCH_ALL : $.su.CHAR.OPERATION.SEARCH_IN_GROUP);
					var scan_page = $("<div class=\"scan_page_all_msg\">").msg({
						closeBtn: true,
						//global: true,
						cls:"l",
						type: 'window',
						_title: search_title,
						search: true,
						innerHTML: serInHTML,
						grid: me
					});
					scan_page.css({"width":"420px"});

					/* version 0.0.1 */
					var options = {grid: me, _type: "all"};
					var searcher = scan_page.search(options);
					tar.searcherAll = searcher.get(0);

					inHTML +=	"<a href=\"javascript:void(0);\" id=\"search\" class=\"operation-btn btn-search-all "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+search_title+"</span>";
					inHTML +=	"</a>";
					break;
				case "searchLog":
					var serInHTML = "";
					serInHTML +=		"<div class=\"scan_page_content_container\" style=\"min-height:100px\">";
					serInHTML +=			"<table class=\"search_conditions\">";
					serInHTML +=				"<thead id = \"search_time\">";
					serInHTML +=				"<tr>";
					serInHTML +=				"<td><input id = \"start_time\"> </td>";
					serInHTML +=				"<td><input id = \"end_time\"> </td>";
					serInHTML +=				"</tr>";
					serInHTML +=				"<tr>";
					serInHTML +=				"<td><div id = \"input_start_time\" style=\"position: absolute; z-index: 8036; padding-left: 80px;\"></div></td>";
					serInHTML +=				"<td><div id = \"input_end_time\" style=\"position: absolute; z-index: 8036; padding-left: 80px;\"></div></td>";
					serInHTML +=				"</tr>";
					serInHTML +=				"</thead>";
					serInHTML +=				"<tbody id = \"search_conditions_content\">";
					serInHTML +=				"</tbody>";
					serInHTML +=			"</table>";
					serInHTML +=			"<div class=\"scan_btn_container\">";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_do_scan\">搜索</button></span>";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_show_all\">重置</button></span>";
					serInHTML +=				"<span class=\"form_btn_span\"><button type=\"button\" class=\"btn_size_m\" id=\"scan_return\">返回</button></span>";
					serInHTML +=			"</div>";
					serInHTML +=		"</div>";
					serInHTML +=		"<div id=\"log_search_remind\"></div>";
					serInHTML +=		"<div id=\"log_cmd_bar_pro_div\" style=\"display: none\">";
					serInHTML +=			"<div id=\"log_cmd_pro\" class=\"reboot-loading-msg hidden\">";
					serInHTML +=				"<input id=\"cmd_pro_bar\" type=\"text\" />";
					serInHTML +=			"</div>";
					serInHTML +=		"</div>";

					var search_title = $.su.CHAR.OPERATION.SEARCH_LOG;
					var scan_page = $("<div class=\"scan_page_all_msg\">").msg({
						closeBtn: true,
						//global: true,
						cls:"l",
						type: 'window',
						_title: search_title,
						search: true,
						innerHTML: serInHTML,
						grid: me
					});
					scan_page.css({"width":"800px"});
					scan_page.css({"min-height":"200px"});
					$("tfoot#condition_btn>tr").css({"height":"60px"});
					$("#log_search_remind").html($.su.CHAR.OPERATION.SEARCH_LOG_REMIND);
					$('#log_cmd_bar_pro_div').msg({
						cls: 'warning reboot-confirm-size',
						closeBtn: false,
						type: "window"
					})
					$('input#cmd_pro_bar').waitingbar({
						fieldLabel: $.su.CHAR.OPERATION.SEARCH_LOG_WAITING,
						labelCls:"xxl",
						waitTime: 1000
					});

					var options = {grid: me, _type: "all"};
					var searcher = scan_page.log_search(options);
					tar.searcherAll = searcher.get(0);
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"search\" class=\"operation-btn btn-search-log "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.SEARCH_LOG+"</span>";
					inHTML +=	"</a>";
					break;
				case "export":
					var exportStr = $.su.CHAR.OPERATION.EXPORT;
					var exportCfg = me.get(0).exportCfg;
					if (exportCfg && exportCfg.text)exportStr = exportCfg.text;
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-export "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+exportStr+"</span>";
					inHTML +=	"</a>";

					var	store = me.grid("getStore");


					if (!exportCfg && $.isEmptyObject(exportCfg))
					{
						alert("exportCfg is undefined,check it again!");
						break;
					}

					//var getResultProxy = new $.su.Proxy();

					var get_ret = false;
					var query_interval = false;

					var msgInHTML = 	"<div id=\"backup_cnt\">";
						msgInHTML += 		"<form id=\"backup-setting\" enctype=\"multipart/form-data\">";
						msgInHTML += 		"</form>"
						msgInHTML += 	"</div>"

					var export_msg = $("<div class=\"export_msg\">").msg({
						closeBtn: true,
						cls:"l",
						type: 'window',
						innerHTML: msgInHTML
					}).on("backcfg_write", function(){
						function hideAlertMsg()
						{
							backcfg_pro_bar.waitingbar("stop");
							backcfg_pro_bar.waitingbar("reset");
							backcfg_pro_cnt_msg.msg('close');
						}

						function getResult()
						{
							if(get_ret == false)
							{
								exportCfg.checkCallback(function(status){
									if(status)
									{
										clearInterval(query_interval);
										hideAlertMsg();
										get_ret = true;
									}
								});
							}
						}

						backcfg_pro_cnt_msg.msg('show');
						backcfg_pro_cnt_msg.msg('hideButtons');
						backcfg_pro_bar.waitingbar("show");
						backcfg_pro_bar.waitingbar("run");
						export_msg.find("#backup-setting").form('submit');
						if(query_interval)
						{
							clearInterval(query_interval);
						}
						get_ret = false;

						if (exportCfg.checkCallback && typeof exportCfg.checkCallback == "function")
						{
							query_interval = setInterval(getResult,1000);
						}
						else
						{
							/* 若无查询进度参数，则直接执行回调函数 */
							hideAlertMsg();
							if (exportCfg.completeCallback && typeof exportCfg.completeCallback == "function")
							{
								exportCfg.completeCallback();
							}
						}
					});

					export_msg.find("#backup-setting").form({
						formEnctype: "multipart/form-data",
						fileUrlCb: function(){
							return exportCfg.url;
						},
						traditional: true,
						hiddenFrame: true,
						autoLoad: false
					});
					tar.export_msg = export_msg;

					msgInHTML =	"<input id=\"backcfg_pro_bar\" type=\"text\" />"
					var backcfg_pro_cnt_msg = $("<div id=\"backcfg_pro_cnt\" class=\"reboot-loading-msg hidden\">").msg({
						cls: 'warning reboot-confirm-size',
						type: "alert",
						closeBtn: false,
						innerHTML: msgInHTML
					});

					var backcfg_pro_bar  = backcfg_pro_cnt_msg.find('input#backcfg_pro_bar').waitingbar({
						barWidth: 320,
						fieldLabel:  $.su.CHAR.OPERATION.BACKUP_WAITINGBAR_TIP,
						labelCls:"xxl"
					}).waitingbar("stop");

					$.su.app.runningModule.addUnloadHandler(function(){
						if(query_interval)
						{
							clearTimeout(query_interval);
							query_interval = false;
						}

						backcfg_pro_bar.waitingbar("stop");
						backcfg_pro_bar.waitingbar("reset");
					});

					break;
				case "import":
					var importStr = $.su.CHAR.OPERATION.IMPORT;
					var importCfg = me.get(0).importCfg;
					if (importCfg && importCfg.text)importStr = importCfg.text;
					inHTML +=	"<a href=\"javascript:void(0);\" class=\"operation-btn btn-import "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+importStr+"</span>";
					inHTML +=	"</a>";

					var	store = me.grid("getStore");

					if (!importCfg && $.isEmptyObject(importCfg))
					{
						alert("importCfg is undefined,check it again!");
						break;
					}

					var get_ret = false;
					var query_interval = false;

					var msgInHTML = 	"<div id=\"loadcfg_cnt\">";
						msgInHTML += 		"<div id=\"loadcfg-setting\">";
						msgInHTML +=			"<input id=\"file\" name=\"archive\" type=\"file\" />"
						msgInHTML +=			"<button type=\"button\" id=\"loadcfg\" name=\"loadcfg\"></button>"
						msgInHTML +=		"</div>"
						msgInHTML +=		"</br>"
						msgInHTML +=		"<p id = \"remind_info\"/>"
						msgInHTML +=	"</div>"

					var import_msg = $("<div class=\"import_msg\">").msg({
						closeBtn: true,
						cls:"l",
						type: 'window',
						innerHTML: msgInHTML
					}).on("loadcfg_write", function(){
						function hideAlertMsg()
						{
							loadcfg_alert_cnt_msg.msg("close");
							loadcfg_pro_bar.waitingbar("stop");
							loadcfg_pro_bar.waitingbar("reset");
						}

						function getResult()
						{
							if(get_ret == false)
							{
								importCfg.checkCallback(function(status){
									if (status)
									{
										clearInterval(query_interval);
										hideAlertMsg();
										$(store).trigger("ev_refresh", []);
										loadcfg_suc_cnt_msg.msg("show");
										import_msg.find("#file").file("reset");

										get_ret = true;
									}
								});

							}
						}

						loadcfg_pro_bar.waitingbar("show");
						loadcfg_pro_bar.waitingbar("run");

						import_msg.find("#loadcfg-setting").form('submit', {}, function(data){
							//点击上传后，等文件传到DUT后，开始查询导入进度
							if(query_interval)
							{
								clearInterval(query_interval);
							}
							get_ret = false;

							/* 若无查询进度参数，则直接执行回调函数 */
							if (importCfg.checkCallback && typeof importCfg.checkCallback == "function")
							{
								query_interval = setInterval(getResult,1000);
							}
							else
							{
								hideAlertMsg();
								$(store).trigger("ev_refresh", []);
								loadcfg_suc_cnt_msg.msg("show");
								import_msg.find("#file").file("reset");

								if (importCfg.completeCallback && typeof importCfg.completeCallback == "function")
								{
									importCfg.completeCallback();
								}
							}
						},function(error_code){
							hideAlertMsg();
							$(store).trigger("ev_refresh", []);
							import_msg.find("#file").file("reset");
						},function(fail){
							hideAlertMsg();
							import_msg.find("#file").file("reset");
						});
					}).on("ev_close", function(){
						//import_msg.find("#file").file("reset");
					});

					tar.import_msg = import_msg;

					import_msg.find("#file").file({
						fieldLabel: $.su.CHAR.OPERATION.FILE_PATH,
						allowBlank:false,
						extension: "csv",
						max_len: 100
					});

					import_msg.find("#loadcfg-setting").form({
						proxy:new $.su.Proxy(),
						formEnctype: "multipart/form-data",
						fileUrlCb: function(){
							return importCfg.url;
						},
						traditional: true,
						hiddenFrame: true,
						fields: [
							{"name": "archive"}
						],
						autoLoad: false
					});

					import_msg.find("#loadcfg").button({
						text: $.su.CHAR.OPERATION.IMPORT,
						handler: function(){
							if(import_msg.find("#loadcfg-setting").form('validate'))
							{
								loadcfg_alert_cnt_msg.msg('showButtons');
								import_msg.css("z-index", "997");
								loadcfg_alert_cnt_msg.find('#loadcfg_confirm_cnt').show();
								loadcfg_alert_cnt_msg.find("#loadcfg_pro_cnt").hide();
								loadcfg_alert_cnt_msg.msg("show");
							}
							else
							{
								return false;
							}
						},
						cls: "submit"
					});

					import_msg.find('#remind_info').html(store.csv_tip || $.su.CHAR.OPERATION.CSV_TIP);

					msgInHTML = 	"<h4 class=\"title\" id=\"loadcfg_confirm_cnt\">"
					msgInHTML += 		"<span class=\"icon\"></span>"
					msgInHTML +=		"<span class=\"text\" id=\"loadcfg_confirm_content\"></span>"
					msgInHTML +=	"</h4>"
					msgInHTML +=	"<div id=\"loadcfg_pro_cnt\" class=\"reboot-loading-msg hidden\">"
					msgInHTML +=		"<input id=\"loadcfg_pro_bar\" type=\"text\" />"
					msgInHTML +=	"</div>"

					var loadcfg_alert_cnt_msg = $("<div id=\"loadcfg_alert_cnt\">").msg({
						okHandler:function(){
							loadcfg_alert_cnt_msg.msg('hideButtons');
							loadcfg_alert_cnt_msg.find('#loadcfg_confirm_cnt').hide();
							import_msg.msg("close");
							loadcfg_alert_cnt_msg.find("#loadcfg_pro_cnt").show();
							import_msg.trigger("loadcfg_write");
							return false;
						},
						cancelHandler:function(){
							return true;
						},
						cls: 'warning reboot-confirm-size',
						closeBtn: false,
						type: "confirm",
						innerHTML: msgInHTML
					}).on("ev_close", function(){
						import_msg.css({"z-index":"999"});
					});
					var loadcfg_pro_bar = loadcfg_alert_cnt_msg.find('input#loadcfg_pro_bar').waitingbar({
						fieldLabel:  $.su.CHAR.OPERATION.IMPORTING_WAITINGBAR_TIP,
						labelCls:"xxl"
					});
					loadcfg_alert_cnt_msg.find("#loadcfg_confirm_content").html($.su.CHAR.BACKUP.RESTORE_CONFIRM_CONTENT);

					msgInHTML =		"<h4 class=\"title\">"
					msgInHTML +=		"<span class=\"icon\" ></span>"
					msgInHTML +=		"<span class=\"text\" >导入成功</span>"
					msgInHTML +=	"</h4>"
					var loadcfg_suc_cnt_msg = $("<div id=\"loadcfg_suc_cnt\">").msg({
						cls: 'warning reboot-confirm-size',
						type: "alert",
						innerHTML: msgInHTML
					}).on("ev_close", function(){
						import_msg.css({"z-index":"999"});
					});

					break;
				case "multi_edit":
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"refresh\" class=\"operation-btn btn-multi-edit "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.MULTI_EDIT+"</span>";
					inHTML +=	"</a>";

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var noneSelectMsg = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					});

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML +=		"<h4 class=\"title\">";
						msgInHTML +=			"<span class=\"icon\"></span>";
						msgInHTML +=			"<span class=\"text\">"+$.su.CHAR.OPERATION.MULTI_EDIT_CONFLICT+"</span>";
						msgInHTML +=		"</h4>";
						msgInHTML += 	"</div>";

					var conflictRdMsg = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					});

					tar.noneSelectMsg = noneSelectMsg;
					tar.conflictRdMsg = conflictRdMsg;
					break;
				case "refresh":
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"refresh\" class=\"operation-btn btn-refresh "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.REFRESH+"</span>";
					inHTML +=	"</a>";
					break;
				case "refreshLog":
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"refreshLog\" class=\"operation-btn btn-refresh "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.REFRESH+"</span>";
					inHTML +=	"</a>";
					var msgHTML =	"<div id=\"refreshlog_cmd_pro\" class=\"reboot-loading-msg hidden\">";
						msgHTML +=		"<input id=\"refreshlog_pro_bar\" type=\"text\" />";
						msgHTML +=	"</div>";
					var refreshWaitingMsg = $("<div id=\"refreshlog_cmd_bar_pro_div\" style=\"display: none\"></div>").msg({
						cls: 'warning reboot-confirm-size',
						closeBtn: false,
						type: "window",
						innerHTML: msgHTML
					});
					refreshWaitingMsg.find("input#refreshlog_pro_bar").waitingbar({
						labelCls:"xxl",
						waitTime: 1000
					});
					break;

				case "autoRefresh":
					inHTML +=	"<input class=\"operation-auto-refresh "+fst+" "+lst+"\"/>";
					break;
				case "bind":
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"bind\" class=\"operation-btn btn-link "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.BIND+"</span>";
					inHTML +=	"</a>";
				case "disconnect":
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"disconnect\" class=\"operation-btn btn-disconnect "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+$.su.CHAR.OPERATION.DISCONNECT+"</span>";
					inHTML +=	"</a>";

					var msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
					msgInHTML +=		"<h4 class=\"title\">";
					msgInHTML +=			"<span class=\"icon\"></span>";
					msgInHTML +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
					msgInHTML +=		"</h4>";
					msgInHTML += 	"</div>";

					var noneSelectMsg = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML
					});

					msgInHTML = 	"<div class=\"grid-warning-msg warning\">";
					msgInHTML +=		"<h4 class=\"title\">";
					msgInHTML +=			"<span class=\"icon\"></span>";
					msgInHTML +=			"<span class=\"text\">"+tar.deleteConfirmMsgText+"</span>";
					msgInHTML +=		"</h4>";
					msgInHTML += 	"</div>";

					var deleteConfirmMsg = $("<div class=\"grid-delete-comfirm-msg\"></div>").msg({
						type: "prompt",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML,
						okHandler: function(e){
							var selectedKeys = me.grid("getSelected"),
							store = me.grid("getStore");
							var data_len = store.data.length;
							if (selectedKeys.length > 0){
								me.grid("runProgress");
								$.su.loading.show();
								store.remove(selectedKeys, store.rmField, function(){
									me.grid("prompt", true);
									setTimeout(function(){
										$.su.loading.hide();
									}, store.loadDelay ? data_len*store.loadDelay : data_len*0.5);
								}, function(){
									me.grid("prompt", false);
									me.trigger("ev_deleteError");
									$.su.loading.hide();
								}, function(){
									me.grid("prompt", false);
									me.trigger("ev_deleteError");
									$.su.loading.hide();
								});
								//console.log(store, selectedKeys);
							};
						}
					});

					tar.noneSelectMsg = noneSelectMsg;
					tar.deleteConfirmMsg = deleteConfirmMsg;

					break;

					/*导入按钮的具体实现,可根据需要在目标页面添加选择器和触发时间，$(#bind)*/
					/*也可新增不同的operation来实现相同外观按钮的不同功能实现*/

					break;
				case "clear":
					inHTML +=	"<a href=\"javascript:void(0);\" id=\"bind\" class=\"operation-btn btn-clear "+fst+" "+lst+"\">";
					inHTML +=		"<span class=\"icon\"></span>";
					inHTML +=		"<span class=\"text\">"+ $.su.CHAR.OPERATION.CLEAR +"</span>";
					inHTML +=	"</a>";
					break;
				default:
					var msgInHTML_g = 	"<div class=\"grid-warning-msg warning\">";
						msgInHTML_g +=		"<h4 class=\"title\">";
						msgInHTML_g +=			"<span class=\"icon\"></span>";
						msgInHTML_g +=			"<span class=\"text\">"+tar.noneSelectedMsgText+"</span>";
						msgInHTML_g +=		"</h4>";
						msgInHTML_g += 	"</div>";

					var noneSelectMsg_g = $("<div class=\"grid-none-selected-msg\"></div>").msg({
						type: "alert",
						cls: "grid-popup-msg",
						innerHTML: msgInHTML_g
					});

					tar.noneSelectMsg_g = noneSelectMsg_g;
					var xtype = operations[index].xtype;
					var show;
					if (operations[index].show) {
						show = operations[index].show();
					}
					else {
						show = true;
					}
					if (xtype && show){
						inHTML += "<input operation-index=\""+index+"\" ";
						inHTML += "class=\"operation-user-defined operation-"+index+" "+fst+" "+lst+" "+xtype+"\" ";
						if (operations[index].id)
							inHTML += "id='" + operations[index].id + "' "
						inHTML += "/>";
					};
					break;
			};
		};


		inHTML +=	"</div>";
		var toolbar = $(inHTML);
		if (tar.isPanel){
			//console.log("grid",me)
			me.panel("getContainer").find("div.panel-tbar-container").append(toolbar);
			//事件监听
			/*toolbar.find("button.operation-refresh").button({
				text: $.su.CHAR.OPERATION.REFRESH,
				handler: function(e){
					//console.log("refresh handler run!");
					me.grid("getStore").load();
				}
			});*/

			function auto_refresh_cb(){
				if(me.grid("isEditing"))return;
				var params = {};
				var store = me.grid("getStore");
				var paging = me.get(0).paging;

				me.grid("getStore").gridRefreshDataFlag = true;
				//var refreshParams = me.get(0).autoRefreshParams;
				if (paging){
					if (me.get(0).paging_true)
					{
						$(paging).paging_true("goToPage", paging.currentPage, "autoRefresh");
					}
					else
					{
						$(paging).paging("goToPage", paging.currentPage, "autoRefresh");
					}
				}else{
					var not_load = false;
					if(store.second_load)
					{
						not_load = true;
					}
					//if (refreshParams != undefined)
					//{
					//	params = refreshParams;
					//}

					me.grid("getStore").load(params, store.second_load, null,null, not_load);
				}

				if (window.restartSessionsTime && window.sessionsExceedTime != null)
				{
					window.restartSessionsTime();
				}
			}
			toolbar.find("input.operation-auto-refresh").checkbox({
				fieldLabel: null,
				items: [{
					boxlabel: $.su.CHAR.GRID.AUTO_REFRESH,
					inputValue: true,
					name: "auto-refesh"
				}],
				cls: "inline"
			}).on("ev_change", function(e, vOld, vNew){
				clearInterval(tar.autoRefreshTime);
				if(window.autoRefreshId[tar.autoRefreshTime])delete window.autoRefreshId[tar.autoRefreshTime];
				if (vNew.length > 0 && (vNew[0] === "auto-refesh" || vNew[0] == "true")){
					tar.autoRefreshTime = setInterval(auto_refresh_cb, tar.refreshDuration);
					window.autoRefreshId[tar.autoRefreshTime] = true;
				}
				else
				{
					me.grid("getStore").gridRefreshDataFlag = false;
				};
			});
			toolbar.find("input.operation-auto-refresh").checkbox("setValue",tar.autoRefresh);
			//直接赋值不触发ev_change，判断autoRefresh的值来设置修改
			tar.autoRefreshTime = 0;
			if(tar.autoRefresh){
				tar.autoRefreshTime = setInterval(auto_refresh_cb, tar.refreshDuration);
				window.autoRefreshId[tar.autoRefreshTime] = true;
			}

			toolbar.find("input.operation-user-defined").each(function(e){
				var input = $(this),
					index = input.attr("operation-index"),
					options = operations[index],
					xtype = options.xtype;

				switch (xtype){
					case "totalCount":
						options = $.extend({
							fieldLabel: "",
							labelCls: "s",
							readOnly: true,
							inputCls: "xs",
							value: 0,
							cls: "inline-block"
						}, options);
						input.textbox(options);
						break;
					case "display":
						options = $.extend({
							cls: "grid-display",
							fieldLabel: null,
							labelCls: "s",
							readOnly: true,
							inputCls: "xl grid-display",
							cls: "inline-block"
						}, options);
						input.textbox(options);
						break;
					default:
						options = $.extend(options, {"cls": "inline-block"});
						var handler = options.handler;
						if(handler)
						{
							options.handler = function(){
								var isEditing = me.grid("isEditing"),
								editor = me.grid("getEditor");
								if (isEditing === true){
									$(editor).editor("shake");
								}else
								{
									handler();
								}
							};
						}
						input[xtype](options);
				};
			});

			//按钮相关事件
			toolbar.delegate("a.btn-add", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	obj = me.get(0),
					editor = me.grid("getEditor"),
					isEditing = me.grid("isEditing");

				if ($.type(obj.beforeStartAdd) == "function"){
					if (!obj.beforeStartAdd()){
						return;
					};
				};

				if($(this).hasClass('proxy-disabled')){
					return ;
				}
				if (isEditing === true){
					$(editor).editor("shake");
				}else if (isEditing === false){
					$(this).addClass('proxy-disabled');
					var paging = obj.paging,
						store = me.grid("getStore");
					//console.log(obj.maxRules, store.data.length);

					if (obj.add_cb && $.type(obj.add_cb) == "function"){
						var alert_str = obj.add_cb.call(this);
						if (alert_str != true){
							obj.maxRulesMsg.find("div.msg-content-wrap span.text").html(alert_str);
							obj.maxRulesMsg.msg("show");
							return;
						}
					}

					if (obj.maxRules &&
						((undefined != me.get(0).paging && obj.maxRules <= me.get(0).paging.totalNum) || obj.maxRules <= store.data.length))
					{
						obj.maxRulesMsg.msg("show");
						return;
					};
					//console.log(paging)
					/*
					if (paging && paging.isPaging){
						$(paging).paging("goToPage", 0);
					};*/
					$(editor).editor("startEdit", "add");
				};

			}).delegate("a.btn-delete", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					var selectedKeys = me.grid("getSelected");
					if (selectedKeys.length == 0){
						obj.noneSelectMsg.msg("show");
					}else{
						obj.deleteConfirmMsg.msg("show");
					};
				};
			}).delegate("a.btn-delete-all", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");

				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					// obj.deleteConfirmMsg.msg("show");

					var selectedKeys = me.grid("getStore").data.length;
					if (selectedKeys == 0){
						obj.noneSelectMsg.msg("show");
					}else{
						obj.deleteConfirmMsg.msg("show");
					};
				};
			}).delegate("a#refresh", "click", function(e){
				e.stopPropagation();
				e.preventDefault();
				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");

				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					if (me.get(0).paging_true)
					{
						$(me.grid("getStore")).trigger("ev_refresh", []);
						me.grid("runProgress");
						me.grid("prompt", true);
					}
					else
					{
						me.grid("runProgress");
						me.grid("getStore").load({}, function(){
							me.grid("prompt", true);
						}, function(){
							me.grid("prompt", false);
						}, function(){
							me.grid("prompt", false);
						});
					}
				}
			}).delegate("a#refreshLog", "click", function(e){
				function runRefreshWaiting(){
					$('#refreshlog_cmd_bar_pro_div').msg('show');
					$('#refreshlog_cmd_pro').show();
					$('#refreshlog_pro_bar').waitingbar("run");
				}
				function hideRefreshWaiting(){
					setTimeout(function () {
						$('#refreshlog_pro_bar').waitingbar("stop");
						$('#refreshlog_pro_bar').waitingbar("reset");
						$('#refreshlog_cmd_pro').hide();
						$('#refreshlog_cmd_bar_pro_div').msg('hide');
						$("#mask").hide();
					}, 300);

				}

				e.stopPropagation();
				e.preventDefault();

				var obj = me.get(0);
				var store = obj.store;
				var paging = obj.paging;
				var	currentPage = 0;
				var numPerPage = paging.numPerPage;
				var params = {};
				var para = {};

				para.start = currentPage * numPerPage;
				para.end = (currentPage + 1)* numPerPage - 1;

				var postData = {};
				var moduleName = store.parseKey.moduleName;
				var tableName = store.parseKey.tableName;

				postData[moduleName] = {};
				postData[moduleName]["table"] = tableName;
				if (paging.search){
					$.extend(params, paging.params);
					postData[moduleName]["filter"]=[params];
				}
				postData[moduleName]["para"]=para;

				var log_refresh_proxy = new $.su.Proxy();
				log_refresh_proxy.action({"system":{"log_refresh":{}}}, function(data){
					if(0 == data.error_code){
						runRefreshWaiting();
						store.proxy.query(postData, function(data, others, status, xhr){
							others = {};
							others.count = data[moduleName]["count"][tableName];
							data = store.dataFormat(data, true);
							store.loadData(data, others, false, function(data){
								if(paging){
									paging.totalNum = others.count;
									paging.currentPage = currentPage;

									if (obj.isPagingTrue == 1) {
									$(paging).paging_true("updateBtns");
									$(paging).paging_true("displayPage");
									}else {
										$(paging).paging("updateBtns");
										$(paging).paging("displayPage");
									}
								}
							});
							$(store).trigger("ev_load", [store, data]);
						});
						hideRefreshWaiting();
					}
				});
			}).delegate("a.btn-disconnect", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					var selectedKeys = me.grid("getSelected");
					if (selectedKeys.length == 0){
						obj.noneSelectMsg.msg("show");
					}else{
						obj.deleteConfirmMsg.msg("show");
					};
				};
			}).delegate("a.btn-enable", "click", function(e){
				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					me.trigger("ev_operation", [this, "enable"]);
				}
			}).delegate("a.btn-disable", "click", function(e){
				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					me.trigger("ev_operation", [this, "disable"]);
				}
			}).delegate("a.btn-clear", "click", function(e){
				me.trigger("ev_clear", [this, "clear"]);
			}).delegate("a.btn-search", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	editor = me.grid("getEditor"),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					var searcher = $(me.get(0).searcher);
					searcher.search("showPopUpScan");
				}
			}).delegate("a.btn-search-all", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	editor = me.grid("getEditor"),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					if (me.get(0).toolbarHint) {
						me.get(0).toolbarHint["searchAll"].show_flag = true;
						me.get(0).toolbarHintMsg.find("#toolBarHint_confirm_content").html($.su.CHAR.OPERATION.SEARCH_ALL_HINT);
						me.get(0).toolbarHintMsg.msg("show");
					} else {
						var searcher = $(me.get(0).searcherAll);
						searcher.search("showPopUpScan");
					}
				}
			}).delegate("a.btn-search-log", "click", function(e){
				e.stopPropagation();
				e.preventDefault();

				var	editor = me.grid("getEditor"),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					if (me.get(0).toolbarHint) {
						me.get(0).toolbarHint["searchLog"].show_flag = true;
						me.get(0).toolbarHintMsg.find("#toolBarHint_confirm_content").html($.su.CHAR.OPERATION.SEARCH_ALL_HINT);
						me.get(0).toolbarHintMsg.msg("show");
					} else {
						var searcher = $(me.get(0).searcherAll);
						searcher.log_search("showPopUpScan");
					}
				}
			}).delegate("a.btn-export", "click", function(e){
				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					if (me.get(0).toolbarHint) {
						me.get(0).toolbarHint["export"].show_flag = true;
						me.get(0).toolbarHintMsg.find("#toolBarHint_confirm_content").html($.su.CHAR.OPERATION.EXPORT_HINT);
						me.get(0).toolbarHintMsg.msg("show");
					} else {
						obj.export_msg.trigger("backcfg_write");
					}
				}
			}).delegate("a.btn-import", "click", function(e){
				var	editor = me.grid("getEditor"),
					obj = me.get(0),
					isEditing = me.grid("isEditing");
				if (isEditing === true){
					$(editor).editor("shake");
				}else{
					if (me.get(0).toolbarHint) {
						me.get(0).toolbarHint["import"].show_flag = true;
						me.get(0).toolbarHintMsg.find("#toolBarHint_confirm_content").html($.su.CHAR.OPERATION.IMPORT_HINT);
						me.get(0).toolbarHintMsg.msg("show");
					} else {
						obj.import_msg.find("#file").file("reset");
						obj.import_msg.msg("show");
					}
				}
			});

			//搜索框相关事件
			toolbar.delegate("input.search-text", "focus", function(e){
				e.stopPropagation();
				$(this).closest("div.search-container").addClass("focus");
			}).delegate("input.search-text", "blur", function(e){
				e.stopPropagation();
				$("div.search-container").removeClass("focus");
			}).delegate("button.operation-btn", "mousedown", function(e){
				e.stopPropagation();
				$(this).closest("div.button-container").addClass("clicked");
			}).delegate("a.search-switch", "click", function(e){
				e.stopPropagation();
				var gridContainer = $(this).closest("div.grid-container"),
					content = $(this).prevAll("input.search-text").val();
				gridContainer.grid("search", content);
			});

			var store = tar.store;
			$(store).on("ev_datachanged", function(e, store, data){
				toolbar.find("input.totalCount").textbox("setValue", data.length);
			});

		};

		if (tar.showPrompt){
			/*var progressbar = $("<input type=\"hidden\"/>");
			progressbar.progressbar({
				cls: "gird-prompt-progressbar",
				width: me.width(),
				height: 4	//这个是硬编码
			});
			toolbar.append(progressbar.closest("div.widget-container"));*/
			inHTML =	"<div class=\"container widget-container progressbar-container progressbar-horizontal gird-prompt-progressbar \">";
			inHTML +=		"<div class=\"widget-wrap progressbar-wrap\">";
			inHTML +=		"<div class=\"widget-wrap progressbar-content\">";
			inHTML +=			"<div class=\"progressbar-value\">";
			// inHTML +=				"<div class=\"progressbar-text\">";
			// inHTML +=					"<span class=\"progressbar-percentage\">100%</span>";
			// inHTML +=				"</div>";
			inHTML +=			"</div>";
			inHTML +=		"</div>";
			inHTML +=	"</div>";

			toolbar.append($(inHTML));
		};

		tar.operation = toolbar.get(0);
	},
	initPaging: function(me, params){
		var me = me || this,
		   obj = me.get(0);

		if (!obj || (!obj.paging && !obj.paging_true)){return null;}

		if (obj.paging&&obj.paging.isPaging) {return me;}

		var options = $.extend({grid: me}, obj.paging_true?obj.paging_true:obj.paging);

		var panelContainer = me.panel("getContainer"),
		   fbarContainer = panelContainer.find("div.panel-fbar-container");

		if (obj.paging_true) {
		   var paging = $("<input type=\"hidden\" class=\"hidden paging-input\">").paging_true(options);
		   fbarContainer.append(paging.paging_true("getContainer"));
		   obj.paging = paging.get(0);
		   obj.isPagingTrue = 1;
		} else {
		   var paging = $("<input type=\"hidden\" class=\"hidden paging-input\">").paging(options);
		   fbarContainer.append(paging.paging("getContainer"));
		   obj.paging = paging.get(0);
		   obj.isPagingTrue = 0;
		}
		return me;
	},
	initEditor: function(me, params){
		var me = me || this,
			obj = me.get(0),
			settings;

		if (!obj){
			return null;
		};

		var editor = obj.editor;
		if (!editor || !editor.isEditor){
			var type = $.type(editor),
				// 初始化editor时候将参数注入，此处将orderSensitive保持一致，用户使用时候也无需声明editor的orderSensitive
				settings = {
					columns: obj.columns,
					grid: me,
					orderSensitive: obj.orderSensitive
				};
			if (false === $.isEmptyObject(obj.childTable)){
				settings.inheritedGrid = {
					hyperlink_text: obj.hyperlink_text,
					childTable: obj.childTable
				}
			}
			if (obj.gridKey) {
				settings.gridKey = obj.gridKey;
			}
			if (type == "string" && editor !== "default"){
				settings = $.extend(settings, {
					content: editor
				});
			}else{
				settings = $.extend(settings, editor);
			};

			var editorObj = $("<tr class=\"editor-container\"></tr>").editor(settings);

		};

		obj.editor = editorObj.get(0);
		return me;
	},
	load: function(me, params){	//data,
		//加载全部
		var me = me || this,
			obj = me.get(0),
			data = params[1] || obj.store.data,
			others = params[2],
			wrap = me.grid("getContainer").find("tbody.grid-content-data");

		obj.rows = [];
		wrap.empty();

        var fragment = $('<div></div>');

		for (var index = 0, len = data.length; index < len; index++){
			if (!data[index]){
				break;
			};
			var rowNew = me.grid("initRow", index, data[index]);
			obj.rows.push(rowNew);
			// wrap.append(rowNew);
            fragment.append(rowNew);
		};

		wrap.append(fragment.children());

		me.grid("updateRowNumber");
		me.trigger("ev_load", [data, others]);
		return me;
	},
	insert: function(me, params){	//index, data
		//加载一个
		var me = me || this,
			obj = me.get(0),
			index = parseInt(params[1], 10) || -1,
			data = params[2] || [{}],
			wrap = me.find("tbody.grid-content-data");

		if (!$.isArray(data)){
			data = [data];
		};
		data.reverse();

		/*已改动为插入到末尾*/
		for (var jndex = 0, len = data.length; jndex < len; jndex++){
		 	if(-1 == index){
		 		if(0 == obj.rows.length){
		 			var newRow = me.grid("initRow", jndex, data[jndex]);
		 			wrap.prepend(newRow);
		 		}else{
		 			var newRow = me.grid("initRow", obj.rows.length + jndex, data[jndex]);
		 			wrap.append(newRow);
		 		}

		 	}else{
		 		if(obj.rows.length <= index){
		 			var newRow = me.grid("initRow", obj.rows.length + jndex, data[jndex]);
		 			wrap.append(newRow);
		 		}else{
		 			var newRow = me.grid("initRow", index + jndex, data[jndex]);
		 			newRow.insertBefore(obj.rows[index-1]);
		 		}
		 	}

			obj.rows.splice(obj.rows.length, 0, newRow);
		}


		me.grid("updateRowNumber");
		me.trigger("ev_insert", [index, data]);
		if ($.isArray(data)){
			data = data[0];
		};
		me.trigger("ev_complete", [index, data]);

		// 为了兼容插入到具体某一行，在最后做一次paging_true
		if(obj.orderSensitive && obj.orderSensitive !== ''){
			var paging = $(me.grid("getPaging"));
			var numPerPage = paging.get(0).numPerPage;
			var gotoPage = paging.get(0).currentPage;
			if (data && data[obj.orderSensitive]) {
				gotoPage = parseInt((parseInt(data[obj.orderSensitive])-1)/parseInt(numPerPage));
			}

            if (gotoPage != paging.get(0).currentPage) {
                paging.paging_true("goToPage", gotoPage, "ev_update");
            }

		}
		return me;
	},
	update: function(me, params){
		var me = me || this,
			obj = me.get(0),
			rows = obj.rows,
			wrap = me.find("tbody.grid-content-data"),
			key = params[1],
			index = params[2] || 0,
			data = params[3];

		if ($.isArray(data)){
			data = data[0];
		};

		var	trNew = me.grid("initRow", index, data),
			trOld = rows[index];

		if (key == trOld.attr("data-key")){
			//确保key相同再操作
		trOld.replaceWith(trNew);
			rows[index] = trNew;
		};

		me.trigger("ev_update", [key, index, data]);
		me.trigger("ev_complete", [index, data]);

		// 为了兼容插入到具体某一行，在最后做一次paging_true
		if(obj.orderSensitive && obj.orderSensitive !== ''){
			var paging = $(me.grid("getPaging"));
			var numPerPage = paging.get(0).numPerPage;
			var gotoPage = paging.get(0).currentPage;
			if (data && data[obj.orderSensitive]) {
				gotoPage = parseInt((parseInt(data[obj.orderSensitive])-1)/parseInt(numPerPage));
			}

			if (gotoPage != paging.get(0).currentPage) {
                paging.paging_true("goToPage", gotoPage, "ev_update");
            }
		}
		return me;
	},

	remove: function(me, params){
		var me = me || this,
			obj = me.get(0),
			rows = obj.rows,
			keys = params[1],
			keyObj = {};

		if (!(keys === undefined) && !(keys === null)){
			if ($.type(keys) === "number"){
				keys = [keys];
			};

			//制作哈希表
			for (var index = 0, len = keys.length; index < len; index++){
				keyObj[keys[index]] = true;
			};
		}

		for (var index = 0; index < rows.length; index++){
			var rowOld = obj.rows[index];
			if (rowOld.attr("data-key") in keyObj){
				rowOld.remove();
				obj.rows.splice(index, 1);
				index--;/*就是缺少这一句*/
			};
		};

		me.grid("updateRowNumber");
		me.trigger("ev_remove", [keys]);

		if ($(obj).find("th.grid-header div.checkbox-group-container").hasClass("selected"))
		{
			//console.log("header checkbox selected.");
			$(obj).find("th.grid-header div.checkbox-group-container").removeClass("selected");
		}
		$(obj).find('th.grid-header div.checkcolumn label.checkbox-label').removeClass("checked");
		$(obj).find('th.grid-header div.checkcolumn label.checkbox-label').find("input[type=checkbox]").prop("checked", false);
		return me;
	},

	removeAllData: function(me, params){
		//console.log("grid   removeAllData");
		var me = me || this,
			obj = me.get(0);

		obj.rows = [];

		me.grid("updateRowNumber");
		me.trigger("ev_remove", ["all"]);
		return me;
	},

	updateRowNumber: function(me, start){
		var me = me || this,
			obj = me.get(0),
			rows = obj.rows,
			len = rows.length,
			wrap = me.find("tbody.grid-content-data");

		if (len == 0){
			var	rowEmpty = me.grid("initEmptyRow");

			wrap.empty();
			wrap.append(rowEmpty);
			rowEmpty.css("display", "table-row")
			return me;
		};

		for (var index = 0; index < len; index++){
			var row = rows[index];
			if (row){
				$(row).find("span.grid-row-numberer").html(index+1);
			};
		};

		return me;
	},
	initDownloadMsg: function(me, params){	//data,
		//加载全部
		var me = me || this,
			obj = me.get(0);

		me.delegate('a.grid-content-btn-download', 'click', function(e){
			var btn = $(this);
			var index = btn.attr("data-index");
			me.grid("download", index);
		});
		return me;
	},
	initUploadMsg: function(me, params){	//data,
		//加载全部
		var me = me || this,
			obj = me.get(0);

		me.delegate('a.btn-upload', 'click', function(e){
			me.grid("upload");
		});
		return me;
	},
	initQueryDetail: function(me, params){	//data,
		//加载全部
		var me = me || this,
			obj = me.get(0);

		me.delegate('a.grid-content-btn-query-detail', 'click', function(e){
			var btn = $(this);
			var index = btn.attr("data-index");
			console.log("register,queryDetail")
			me.grid("queryDetail", index);
		});
		return me;
	},

	// renderer: function(me){
	// 	var me = me || this,
	// 		obj = me.get(0),
	// 		wrap = me.grid("getContainer").find("tbody.grid-content-data"),
	// 		rows = obj.rows;

	// 	wrap.empty();

	// 	if (rows.length == 0){
	// 		//若当前无条目存在
	// 		var	trEmpty = me.grid("initEmptyRow");
	// 		wrap.append(trEmpty);
	// 	}else{
	// 		//若当前有条目存在
	// 		for (var index = 0, len < rows.length; index < len; index++){
	// 			var row = rows[index];
	// 			if (row){
	// 				wrap.append(row);
	// 			};
	// 		};
	// 	};

	// 	return me;
	// },

	//这部分放到editor控件中去，若不需要编辑，则不会被初始化
	/*startEdit: function(me, params){	//index, oldData, newData, callback //调出编辑框
		var me = me || this,
			index = params[1] || 0;
	},
	cancelEdit: function(me, params){	//取消编辑，关闭编辑框

	},
	completeEdit: function(me, params){	//完成编辑，调用store，发送request

	},*/

	getColumns: function(me){
		var me = me || this;

		var columns = me.get(0).columns;
		var thArr = [];
		$('th.grid-header').each(function () {
			thArr.push($(this));
		});

		for (var i = 0, j = 0; i < columns.length && j < thArr.length; i++) {
			if (!columns[i].hidden) {
				columns[i].width = thArr[j].width(); // 内容列宽度与表头保持一致
				columns[i].display = thArr[j].css('display'); // 某一列隐藏后避免数据刷新后又重新显示出来
				j++;
			}
		}
		return columns;
	},
	getSelected: function(me, allFlag){
		var me = me || this;
		var allFlag = allFlag[1];
		var	store = me.get(0).store;

		//console.log(allFlag)
		var selectedTrs = me.find("tr.grid-content-tr:not(:hidden).selected");

		var result = [];
		selectedTrs.each(function(i, obj){
			var tr = $(obj);
			var rules = allFlag ? !tr.hasClass("empty") : (!tr.hasClass("empty") && !tr.hasClass("disabled") && (!tr.hasClass("unavailable")));
			if (rules){
				var key = tr.attr("data-key");
				result.push(key);
			}
		});

		if (result.length != 0 && undefined != store.formField)
		{
			var itemFields = store.formField;
			var itemData = {};
			if (undefined != itemFields)
			{
				for (var j=0; j < itemFields.length; j++)
				{
					var item = store.getValuesByKeys(result, itemFields[j]);
					//console.log(item);
					itemData[itemFields[j]] = item;
				}
			}
			store.formParams = itemData;
			store.workingPage = me.get(0).paging ? me.get(0).paging.currentPage : undefined;
			store.workingNumPerPage = me.get(0).paging ? me.get(0).paging.numPerPage : undefined;
		}

		return result;
	},
	getAllPagesSelect: function(me) {
		return me.get(0).selectedIds;
	},
	clearAllPagesSelect: function(me) {
		me.get(0).selectedIds.length = 0;
		return me;
	},
	initAllPagesSelect: function(me, arg) {
		me.get(0).selectedIds = arg[1];
		var paging = $(me.grid("getPaging"));
		paging.paging_true("displayPage");
		return me;
	},

	/*setStartNumber: function(me, number){
		var me = me || this,
			num = number[1] || 0;
		return me.get(0).currentStartNumber = num;
	},
	getStartNumber: function(me){
		var me = me || this;
		return me.get(0).currentStartNumber || 0;
	},*/
	getStore: function(me){
		var me = me || this;
		return me.get(0).store || null;
	},
	getPaging: function(me){
		var me = me || this;
		return me.get(0).paging || null;
	},
	getEditor: function(me){
		var me = me || this,
			editor = me.get(0).editor;

		if (editor && $.type(editor) === "object" && editor.isEditor === true){
			return editor;
		}else{
			return undefined;
		};
	},
	getDisplay: function(me){
		var me = me || this,
			container = me.closest("div.grid-panel");

		var display = me.find("input.grid-display");
		if (display.length > 0){
			return display;
		}else{
			return null
		};
	},
	search: function(me, content){
		var me = me || this,
			content = content[1];
		if (!content){
			return null;
		};

		//alert(content)
		return me;
	},
	isEditing: function(me){
		var me = me || this,
			editor = me.grid("getEditor"),
			store = me.get(0).store;

		if (editor && editor.isEditor){
			if (editor.editing === true){
				return true;
			};
		}else{
			return null;
		};

		return false;
	},
	runProgress: function(me){
		var me = me || this,
			obj = me.get(0),
			toolbar = $(obj.operation),
			progressbar = toolbar.find("div.gird-prompt-progressbar"),
			bar = progressbar.find("div.progressbar-value");

		bar.stop();
		bar.css("width", "0px");
		progressbar.clearQueue().fadeIn(100, function(){
			bar.animate({
				width: "50%"
			}, 5*1000);
		});

		return me;
	},
	prompt: function(me, params){		//successed: true, false;	text为错误内容
		var me = me || this,
			obj = me.get(0),
			successed = params[1],
			text = params[2],
			toolbar = $(obj.operation),
			progressbar = toolbar.find("div.gird-prompt-progressbar"),
			editing = me.find("tr.grid-content-tr.editing"),
			editor = $(me.grid("getEditor")),
			formPrompt = toolbar.find("div.grid-prompt");

		var btn_container = me.find("div.editor-buttons-container");
		if(btn_container.length){
			var btn_submit = btn_container.find("button.btn-submit");
			if(btn_submit.length){
				btn_submit.attr("disabled",false);
			}
		}
		progressbar.find("div.progressbar-value").clearQueue().animate({
			width: "100%"
		}, 150, function(){
			progressbar.fadeOut(100, function(){
				if (successed){
					//成功
					formPrompt.find("span.text-successed").html((text || obj.promptTextSuccessed));
					formPrompt.removeClass("failed").addClass("successed");
				}else{
					//失败
					formPrompt.find("span.text-failed").html((text || obj.promptTextFailed));
					formPrompt.removeClass("successed").addClass("failed");

					editing.addClass("error");
					editor.addClass("error");
				};

				formPrompt.fadeIn(50, function(){
					setTimeout(function(){
						formPrompt.css("display", "none");
						editor.removeClass("error");
						editing.removeClass("error");
					}, 3*1000);
				});
			});
		});


		return me;
	},
// 方法
	hideRowByIndex: function(me,params) {
		var me = me || this,
			obj = me.get(0),
			data = obj.store.data,
			index = params[1],
			wrap = me.grid("getContainer").find("tbody.grid-content-data");

		obj.rows = [];
		wrap.empty();

		data.splice(index,1);

		for (var index = 0, len = data.length; index < len; index++){
			if (!data[index]){
				break;
			};
			var rowNew = me.grid("initRow", index, data[index]);
			obj.rows.push(rowNew);
			wrap.append(rowNew);
		};

		me.grid("updateRowNumber");
		return me;
	},
	disableDelete: function(me, index){	//index
		var me = me || this,
			obj = me.get(0),
			columns = obj.columns,
			index = index[1],
			row = null;

		if (!isNaN(index)){
			row = obj.rows[index];
		};

		if (row){
			row = $(row);
			row.addClass("disable-delete");
		}
	},
	disableRow: function(me, index){	//index
		var me = me || this,
			obj = me.get(0),
			columns = obj.columns,
			index = index[1],
			row = null;

		if (!isNaN(index)){
			row = obj.rows[index];
		};

		if (row){
			row = $(row);
			row.addClass("disabled");

			for (var index = 0, len = columns.length; index < len; index++){
				var column = columns[index],
					items = column.items;
				//console.log("111", column.xtype, column.items);
				if (column.xtype === "actioncolumn"){
					for (var jndex = 0, jen = items.length; jndex < jen; jndex++){
						var item = items[jndex],
							xtype = item.xtype,
							dataIndex = column.dataIndex,

						act = row.find("input[data-property="+dataIndex+"][data-type="+xtype+"]");
						//console.log(column, act, xtype, dataIndex)
						if (act && $.type(act[xtype]) == "function"){
							act[xtype]("disable");
						};

						//act.attr("auto-disabled", true);
					};
				};
			};
		};

		return me;
	},

	disableCheckbox: function(me, index){
		var me = me || this,
			obj = me.get(0),
			columns = obj.columns,
			index = index[1],
			row = null,
			items = null;

		if (!isNaN(index)){
			row = obj.rows[index];
		};

		if (row){
			var checkBoxTd = row.find("td.grid-content-td.grid-content-td-" + 0 + ".grid-content-td-check-column");
			checkBoxTd.addClass("disabled");
		};

		return me;
	},
	enableRow: function(me, index){
		var me = me || this;
			obj = me.get(0),
			columns = obj.columns,
			index = index[1],
			row = null;

		if (!isNaN(index)){
			row = obj.rows[index];
		};

		if (row){
			row = $(row);
			row.removeClass("disabled");

			for (var index = 0, len = columns.length; index < len; index++){
				var column = columns[index],
					items = column.items;
				//console.log("111", column.xtype, column.items);
				if (column.xtype === "actioncolumn"){
					for (var jndex = 0, jen = items.length; jndex < jen; jndex++){
						var item = items[jndex],
							xtype = item.xtype,
							dataIndex = column.dataIndex,

						act = row.find("input[data-property="+dataIndex+"][data-type="+xtype+"]");
						//console.log(column, act, xtype, dataIndex)
						if (act && $.type(act[xtype]) == "function"){
							act[xtype]("enable");
						};

						//act.removeAttr("auto-disabled");
					};
				};
			};
		};

		return me;
	},

	disGridHeaderChkbox: function(me){
		var me = me || this;

		//全选键
		var label = me.find("tr.grid-header-tr label.checkbox-label");//.closest("div.checkbox-group-container");//.closest("");
		var container = label.closest("div.checkbox-group-container");
		if (container.hasClass("selected")){
			container.removeClass("selected");
			label.find("input[type=checkbox]").prop("checked", false);
			label.removeClass("checked");
		}
	},

	disGridContentChkbox: function(me){
		var me = me || this;

		//单选
		var trList = me.find("tr.grid-content-tr.selected");
		if (trList.length != 0){
			trList.removeClass("selected");
			trList.find("label.checkbox-label").removeClass("checked");
			trList.find("input[type=checkbox]").prop("checked", false);
		}
	},

	refreshGridHeaderChkbox: function(me){
		var me = me || this;
		var obj = me.get(0);

		if(obj.recordAllPagesSelect == false) {
			// 不需要翻页记录的情况下直接取消全选
			me.grid("disGridHeaderChkbox");
		}
		else {
			// 根据实际情况选择是否勾选全选checkbox
			var trList = me.find("tr.grid-content-tr:not(:hidden)");
			var label = me.find("tr.grid-header-tr label.checkbox-label");
			var container = label.closest("div.checkbox-group-container");
			if(trList.length>0){
				var index = 0;
				for(index=0; index<trList.length; ++index){
					if($(trList[index]).hasClass("disabled") || $(trList[index]).hasClass("unavailable")){
						continue;
					}
					if(!$(trList[index]).hasClass("selected")){
						break;
					}
				}
				if(index != trList.length){
					container.removeClass("selected");
					label.removeClass("checked");
				}
				else{
					container.addClass("selected");
					label.addClass("checked");
				}
			}
		}
	},

	disGridChkbox: function(me){
		var me = me || this;

		me.grid("disGridHeaderChkbox");
		me.grid("disGridContentChkbox");
	},
	// 将grid放到遮蔽层后方
	behindMask: function(me) {
		var $div_container = me.get(0).div_container;
		if ($div_container && $div_container.css("z-index")) {
			var zindex = parseInt($div_container.css("z-index"));
			var mask_zindex = parseInt($("#mask").css("z-index"));
			if (zindex >= mask_zindex) {
				zindex = mask_zindex - 1;
			}
			$div_container.css("z-index", zindex);
		}
	},
	// 将grid放到遮蔽层前面
	aheadMask: function(me) {
		var $div_container = me.get(0).div_container;
		if ($div_container && $div_container.css("z-index")) {
			var zindex = parseInt($div_container.css("z-index"));
			var mask_zindex = parseInt($("#mask").css("z-index"));
			if (zindex <= mask_zindex) {
				zindex = mask_zindex + 1;
			}
			$div_container.css("z-index", zindex);
		}
	},
	// 根据ID隐藏grid上的操作
	hideOpt: function(me, params) {
		var id = params[1];
		if (!id) return;
		var $opt = $("#" + id);
		$opt.parents(".button-container").hide();
	},
	showOpt: function(me, params) {
		var id = params[1];
		if (!id) return;
		var $opt = $("#" + id);
		$opt.parents(".button-container").show();
	},
	// 刷新grid指定页面的数据，默认为当前页
	refresh: function(me, params) {
		if (me.grid("isEditing")) return;

		var _store = me.grid("getStore");
		var _paging = me.get(0).paging;
		var refresh_page = params[1] || _paging.currentPage;

		if (_paging) {
			if (me.get(0).paging_true) {
				$(_paging).paging_true("goToPage", refresh_page, "autoRefresh");
			}
			else {
				$(_paging).paging("goToPage", refresh_page, "autoRefresh");
			}
		}
		else {
			var not_load = false;
			if (_store.second_load) {
				not_load = true;
			}
			_store.load({}, _store.second_load, null, null, not_load);
		}
	},
	download: function (me, args) {
		var store = me.get(0).store,
			download_msg = me.get(0).download_msg;
			index = args[1];

		if(null == download_msg)
		{
			console.log("there is no download_msg, please set download_msg");
			return false;
		}

		if(null == download_msg.okHandler || null == download_msg.msgInHTML || null == download_msg.msgRenderFunc)
		{
			console.log("please enter okHandler or msgInHTML or msgRenderFunc");
			return false;
		}

		var download_real_msg = $("<div id=\"grid-download\"></div>").msg({
			showHead: true,
			closeBtn: true,
			cls: download_msg.cls || "xl",
			title: download_msg.title || $.su.CHAR.OPERATION.DOWNLOAD,
			type: "confirm",
			yesText: download_msg.yesText || $.su.CHAR.OPERATION.OK,
			noText: download_msg.noText || $.su.CHAR.OPERATION.CANCEL,
			innerHTML: download_msg.msgInHTML,
			okHandler: download_msg.okHandler,
			noHandler: download_msg.noHandler || function(){
				//console.log("cancel");
				return true;
			},
			index: index
		}).msg("hide");

		download_real_msg.css('z-index', 998);

		download_msg.msgRenderFunc();			//渲染msg中的组件

		download_real_msg.msg("show");
	},
	upload: function (me) {
		var store = me.get(0).store,
			upload_msg = me.get(0).upload_msg;

		if(null == upload_msg)
		{
			console.log("there is no upload_msg, please set upload_msg");
			return false;
		}

		if(null == upload_msg.okHandler || null == upload_msg.msgInHTML || null == upload_msg.msgRenderFunc)
		{
			console.log("please enter okHandler or msgInHTML or msgRenderFunc");
			return false;
		}

		var upload_real_msg = $("<div id=\"grid-upload\"></div>").msg({
			showHead: true,
			closeBtn: true,
			cls: upload_msg.cls || "xl",
			title: upload_msg.title || $.su.CHAR.OPERATION.UPLOAD,
			type: "confirm",
			yesText: upload_msg.yesText || $.su.CHAR.OPERATION.OK,
			noText: upload_msg.noText || $.su.CHAR.OPERATION.CANCEL,
			innerHTML: upload_msg.msgInHTML,
			okHandler: upload_msg.okHandler,
			noHandler: upload_msg.noHandler || function(){
				//console.log("cancel");
				return true;
			}
		}).msg("hide");

		upload_real_msg.css('z-index', 998);

		upload_msg.msgRenderFunc();

		upload_real_msg.msg("show");
	},
	queryDetail: function (me, args) {
		var store = me.get(0).store,
			query_detail_msg = me.get(0).query_detail_msg;

		if(null == query_detail_msg)
		{
			console.log("there is no query_detail_msg, please set query_detail_msg");
			return false;
		}

		query_fields = me.get(0).query_detail_msg.fields;
		if(null == query_fields || typeof query_fields == "undefined" || query_fields.length === 0)
		{
			console.log("there is no fields in query_detail_msg, please set fields in query_detail_msg");
			return false;
		}

		//console.log(me.get(0).query_detail_fields);
		// 请求数据
		var msgInHtml = "";
		var fields = $.extend([], query_fields.sort(function (a, b) {
			return a.index - b.index
		}));

		var store_index = args[1];

		// 初始化inHTML
		$.each(fields, function (index, item) {
			msgInHtml += "<textarea id=\"query_detail_textbox_"+ index +
			"\" class=\"tb\" name=\""+ item.key +"\" cols=\"50\" rows=\""+
			(typeof item.rows === 'number' ? item.rows : 1) +"\"></textarea>";
		});

		//初始化msg
		var $itemDetail = $("<div id=\"grid-queryDetail\"></div>").msg({
			showHead: true,
			closeBtn: true,
			cls: query_detail_msg.cls || "xl",
			title: query_detail_msg.title || "查看详细信息",
			type: "alert",
			// yesText: "确定",
			okText: query_detail_msg.okText || "关闭",
			innerHTML: msgInHtml,
			okHandler:function(){
				//console.log("ok");
				$itemDetail.msg("hide");
			},
			index: store_index
		}).msg("hide");

		$.each(fields, function (index, item) {
			$('#query_detail_textbox_' + index).textarea({
				fieldLabel: item.fieldLabel,
				allowBlank: true,
				readOnly: true,
				labelCls: 'queryDetail',
				inputCls: 'queryDetail',
				value: store.data[store_index][item.key]
			});
		});
		$itemDetail.msg("show");
	}
});


})(jQuery);

function getFilterForCombo(element, store, obj) {
	$.su.loading.show();
	var filter = {};
	var filterContainer = $(element).parents('.filter-row').find('.filter-container');
	for (var i = 0; i < filterContainer.length; i++) {
		var item = $(filterContainer[i]);
		var title = item.find('.checkbox-title').prop('value');
		var options = [];
		var checkboxes = item.find('.filter-table-checkbox');
		for (var j = 0; j < checkboxes.length; j++) {
			var checked = $(checkboxes[j]).find('input[type="checkbox"]').prop('checked');
			if (checked) {
				var option = $(checkboxes[j]).html().split('>')[1];
				options.push(option)
			}
		}
		if (options.length !== 0) {
			filter[title] = options;
		}
	}
	var doProxy = new $.su.Proxy();
	var numPerPage=parseInt(obj.paging_true.numPerPage);
	var start = 0;
	var end = numPerPage - 1;
	filter["startIndex"] = start;
	filter["endIndex"] = end;
	var postData = {}
	postData['app_library'] = {'combo_filter_app_list': filter};
	doProxy.action(postData, function(data){
		var totalNum=data['app_library']['count']['app_list'];
		data = store.dataFormat(data['app_library']['app_list']);
		store.loadData(data,{count: totalNum}, false, function(){
			$.su.loading.hide();
		});
		var pagingElement=$(obj).grid('getPaging');
		pagingElement.totalNum=totalNum;
		pagingElement.totalPage=Math.floor(totalNum/numPerPage)+1;
		var paging_true_obj=$(pagingElement);
		store.keyProperty='key';
	});
}

function handleRecordAllPagesSelect(tr, ifSelected, obj) {
	var id = tr.cells[obj.idColumnIndex + 1].innerText;
	var index = obj.selectedIds.indexOf(id);
	if (ifSelected) {
		if (index === -1) {
			obj.selectedIds.push(id);
		}
	} else {
		obj.selectedIds.splice(index, 1);
	}
}
