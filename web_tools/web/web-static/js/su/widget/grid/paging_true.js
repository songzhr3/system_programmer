// JavaScript Document
(function($){

$.su.Widget("paging_true", {
	defaults: {
		numPerPage: 64,
		goToPageHandle: null,
		chgItemHandle: null,
		evLoad:true,
		evInsert:true,
		evUpdate:true,
		evRemove:true,
		evRefresh:true,
        insertTofirst: false,
	},
	create: function(defaults, options){
		var me = this;
		me.each(function(i, obj){
			var tar = $(obj);
			$.extend(obj, defaults, options);

			var inHTML =	"<div class=\"container widget-container paging-container disabled\">";
				inHTML +=		"<div class=\"paging-wrap\">";
				inHTML +=		"<div id=\"paging_note\" >"+ me.paging_true("initPage") +"</div>"
				// 上一页按钮
				inHTML +=			"<a href=\"javascript:void(0);\" class=\"paging-btn pageing-btn-prev\" data-index=\"prev\">";
				inHTML +=				"<span class=\"icon\"></span>";
				inHTML +=				"<span class=\"text\">"+$.su.CHAR.OPERATION.PREV+"</span>";
				inHTML +=			"</a>";

				inHTML +=			"<div class=\"num-buttons-container\">";
				inHTML +=			"</div>";

				// 下一页按钮
				inHTML +=			"<a href=\"javascript:void(0);\" class=\"paging-btn pageing-btn-next\" data-index=\"next\">";
				inHTML +=				"<span class=\"icon\"></span>";
				inHTML +=				"<span class=\"text\">"+$.su.CHAR.OPERATION.NEXT+"</span>";
				inHTML +=			"</a>";

				inHTML +=		"</div>";
				inHTML +=	"</div>";

			var bar = $(inHTML);

			bar.append(tar.addClass("hidden"));
			obj.isPaging = true;

		});

		//监听部分
		// var store = $(options.grid.get(0).store);
		// store.on("ev_datachanged", function(e){
		// });
		var obj = me.get(0),
			grid = obj.grid,
			editor = grid.get(0).editor,
			store = grid.get(0).store;

		grid.on("ev_load", function(e){
			var obj = me.get(0),
				currentPage = obj.currentPage,
				store = obj.grid.get(0).store;

			if (obj.evLoad != true) {
				return;
			}

			me.paging_true("updateBtns");
			if (store.data.length == 0){
				//在全局搜索条件下进行操作，修改条目属性可能导致搜索结果发生变化，以至于出现缺页情况；
				//自定义按钮（启用/禁用，绑定/解绑等）都是直接显式调用的store.load函数，无法进行缺页处理，所以通过store.load触发的ev_load事件统一在此分支进行处理；
				//由于store.load请求会返回总条目数，此时totalPage已更新，但currentPage还是之前的页码，currentPage >= obj.totalPage
			    //注：分页跳转或者批量编辑(编辑完后会主动请求当前页数据)引起的缺页原本在上面goTopage的store.load的回调函数中已经进行了处理，
				//但该store.load也会触发ev_load事件，会进入此分支再请求一次，此时currentPage和totalPage都已更新，currentPage < obj.totalPage
				if (obj.search){
					if (!obj.inserting){
						if (currentPage > 0){
							if (currentPage >= obj.totalPage){
								obj.currentPage = obj.currentPage - 1;
								//obj.params.pageNo = obj.currentPage;
								me.paging_true("goToPage", obj.currentPage, "ev_load");
							}
						}else{
							me.paging_true("goToPage", currentPage);//更新页码
						}
					}else{
						obj.inserting = false;
					}
				}else{
					if (currentPage > 0){
						if (currentPage >= obj.totalPage){
							obj.currentPage = obj.currentPage - 1;
							//obj.params.pageNo = obj.currentPage;
							me.paging_true("goToPage", obj.currentPage, "ev_load");
						}
					}else{
						me.paging_true("goToPage", currentPage);//更新页码
					}
				}
			}else{
				me.paging_true("goToPage", currentPage);
			}
		});
		// }).on("ev_update", function(){

		// });
		$(store).on("ev_insert", function(e, data, others, index){
			var obj = me.get(0);

			if (obj.evInsert != true) {
				return;
			}

			obj.totalNum = obj.totalNum ? obj.totalNum+1 : 0;
			//obj.totalNum = others ? others.count : 0;
			me.paging_true("updateBtns");//根据totalNum计算总页码

            if (obj.insertTofirst) {
                obj.currentPage = 0;
            } else {
                obj.currentPage = (obj.totalPage > 0) ? (obj.totalPage - 1) : 0; /* currentPage starts from 0, totalPage start from 1*/
            }
            if(index){
                obj.currentPage = parseInt((parseInt(index)-1) / parseInt(obj.numPerPage));
			}
			// console.log('跳转到第：',obj.currentPage);
			me.paging_true("goToPage", obj.currentPage, "ev_insert");
		}).on("ev_remove", function(e, data, others){
			var obj = me.get(0);

			if (obj.evRemove != true) {
				return;
			}

			// 目前 SLP 对任何删除操作都不会返回总条目数，也不返回删除统计，所以不能确切得知现在还剩多少条，
			// totalNum 将会不准确。但目前的前端最多只可能一次删除一页的数据，即最多也只可能后退一页，所以
			// 从最终用户体验的角度考虑，可以不管 totalNum，只要发现 store 空了就说明本页已删完，将 totalNum
			// round down 到每页条目整数倍并后退一页即可。如果 store 还有数据，则页码不需改变，保留 totalNum
			// 不变即可，在 goToPage 完成后会自动刷新为正确值。
			var store = obj.grid.get(0).store;
			if (store.data.length == 0){
				// 如果原来满页，则取余结果将为 0, 但此时实际删掉的条目是一整页
				obj.totalNum -= obj.totalNum % obj.numPerPage || obj.numPerPage;
				me.paging_true("updateBtns");
				obj.currentPage = (obj.currentPage > 0 ? obj.currentPage - 1 : 0);
			}
			me.paging_true("goToPage", obj.currentPage, "ev_remove");
		}).on("ev_refresh", function(e, data, others){
			var obj = me.get(0);

			if (obj.evRefresh != true) {
				return;
			}

			me.paging_true("goToPage", obj.currentPage, "refresh");
		});

		var container = me.closest("div.paging-container");
		container.delegate("a.paging-btn-num", "click", function(e){
			e.stopPropagation();
			e.preventDefault();

			var btn = $(this),
				pageNum = parseInt(btn.attr("data-index"), 10);

			if (btn.hasClass("disabled")){
				return;
			}else{
				if (editor && editor.editing){
					$(editor).editor("cancelEdit");
				};
			};

			me.paging_true("goToPage", pageNum, "btn_num");

		}).delegate("a.pageing-btn-prev", "click", function(e){
			e.stopPropagation();
			e.preventDefault();

			var btn = $(this);
			if (btn.hasClass("disabled")){
				return;
			}else{
				if (editor && editor.editing){
					$(editor).editor("cancelEdit");
				};
				btn.addClass("disabled");
				me.paging_true("goPrev");
			};

		}).delegate("a.pageing-btn-next", "click", function(e){
			e.stopPropagation();
			e.preventDefault();

			var btn = $(this);
			if ($(this).hasClass("disabled")){
				return;
			}else{
				if (editor && editor.editing){
					$(editor).editor("cancelEdit");
				};
				btn.addClass("disabled");
				me.paging_true("goNext");
			};

		}).delegate("#slt_item_num", "change", function(e){
			e.stopPropagation();
			e.preventDefault();

			var slt = $(this),
				numPerPage = parseInt(slt.val(), 10);

			me.paging_true("chgItem", numPerPage);

		});

		return me;
	},
	//改变每页显示的条目数
	chgItem: function(me, number)
	{
		var me = me || this,
			obj = me.get(0),
			grid = obj.grid,
			store = grid.get(0).store,
			item = isNaN(number[1]) ? 10 : number[1],
			postData = {},
			chgItemHandle = obj.chgItemHandle;
			/*
			obj   = document.getElementById("slt_item_num"),
			index = obj.selectedIndex,
			item  = obj.options[index].value;*/

		if (chgItemHandle != null)
		{
			/* 使用单独定义的处理函数，适用于系统日志这种不按套路出牌的模块 */
			if (typeof chgItemHandle != "function")
			{
				/* 暂无处理 */
				return;
			}

			/* Input :item */
			/* Ouput : NULL */
			chgItemHandle({item:item}, function(data){
				obj.numPerPage = item;
				me.paging_true("updateBtns");
				me.paging_true("goToPage", obj.currentPage, "chgItem"); //跳转到第1页，下标从0开始
			});

			return;
		}


		postData['global_config'] = {};
		postData['global_config']['page_size'] = {};
		postData['global_config']['page_size'][store.parseKey.pageSizeName] = item.toString();


		grid.get(0).store.proxy.modify(postData, function(data, others, status, xhr){
			obj.numPerPage = item;
			me.paging_true("updateBtns");
			me.paging_true("goToPage", obj.currentPage, "chgItem"); //跳转到第1页，下标从0开始
		});

		return me;
	},
	initPage: function(me)
	{
		var me = me || this,
			container = me.closest("div.paging-container"),
			pagingNote = container.find("#paging_note"),
			obj = me.get(0),
			grid = obj.grid,
			numPerPage = obj.numPerPage,
			currentPage = obj.currentPage,
			totalPage = obj.totalPage,
			maxNum = obj.maxNum,
			rows = grid.get(0).rows,
			len = rows.length;

		var is_enough = false;

		//pagingNote.empty();
		var inHTML = "<span id='span_item_num' >" + $.su.CHAR.OPERATION.TOTAL + obj.totalNum + $.su.CHAR.OPERATION.ITERMS + $.su.CHAR.OPERATION.COMMA + $.su.CHAR.OPERATION.PERPAGE +"</span> ";
			inHTML += "<select name='slt_item_num' id='slt_item_num' >"

		var numPerPageList = [10, 20, 50, 100, 200, 500, 1000];

		for (var i = 0; i < numPerPageList.length; i++) {
			var numPerPageItem = numPerPageList[i];
			if (numPerPage == numPerPageItem) {
				inHTML += "<option value='" + numPerPageItem + "' selected = 'selected'>" + numPerPageItem + "</option>";
			}
			else {
				inHTML += "<option value='" + numPerPageItem + "'>" + numPerPageItem + "</option>";
			}
			if (maxNum <= numPerPageItem) {
				break;
			}
		}

			inHTML += "</select>"

			inHTML += "<span id='span_item_page'>" + $.su.CHAR.OPERATION.ITERMS +" | " + $.su.CHAR.OPERATION.CURRENT + (obj.totalNum == 0 ? 0 : (currentPage+1)) + "/" + totalPage + $.su.CHAR.OPERATION.PAGE;

		if(obj.totalNum == 0)
			inHTML += "0~0" + $.su.CHAR.OPERATION.ITERMS + " | </span>";
		else if(currentPage+1 == totalPage)
			inHTML += currentPage * numPerPage +1 + "~" +(currentPage * numPerPage + len) + $.su.CHAR.OPERATION.ITERMS + " | </span>";
		else
			inHTML += currentPage * numPerPage +1 + "~" +((currentPage + 1)  * numPerPage ) + $.su.CHAR.OPERATION.ITERMS + " | </span>";

		//pagingNote.append(inHTML);

		return inHTML;
	},
	displayPage: function(me) {
		var me = me || this,
			obj = me.get(0),
			grid = obj.grid.get(0),
			numPerPage = obj.numPerPage,
			container = me.closest("div.paging-container"),
			pagingNote = container.find("div#paging_note"),
			spanItem = pagingNote.find("span#span_item_num"),
			sltItem = pagingNote.find("select#select_item_num"),
			spanPage = pagingNote.find("span#span_item_page"),
			currentPage = obj.currentPage,
			totalPage = obj.totalPage,
			len = grid.rows.length;

		spanItem.empty();
		spanPage.empty();

		var inHTML = $.su.CHAR.OPERATION.TOTAL + obj.totalNum + $.su.CHAR.OPERATION.ITERMS + $.su.CHAR.OPERATION.COMMA + $.su.CHAR.OPERATION.PERPAGE;
			spanItem.append(inHTML);

			sltItem.val(numPerPage);

			inHTML = $.su.CHAR.OPERATION.ITERMS + " | " + $.su.CHAR.OPERATION.CURRENT + (obj.totalNum == 0 ? 0 : (currentPage+1)) + "/" + totalPage + $.su.CHAR.OPERATION.PAGE;

		if(obj.totalNum == 0){
			inHTML += "0~0" + $.su.CHAR.OPERATION.ITERMS + " | ";
		} else if(currentPage+1 == totalPage){
			inHTML += currentPage * numPerPage +1 + "~" +(currentPage * numPerPage + len) + $.su.CHAR.OPERATION.ITERMS + " | ";
		} else{
			inHTML += currentPage * numPerPage +1 + "~" +((currentPage + 1)  * numPerPage ) + $.su.CHAR.OPERATION.ITERMS + " | ";
		}
		spanPage.append(inHTML);

		if(grid.recordAllPagesSelect){
			var trList=$(grid).find("tr.grid-content-tr:not(:hidden):has(td.grid-content-td-check-column:not(.disabled))");
			for(var i=0;i<trList.length;i++){
				var tr=trList[i];
				var id=tr.cells[grid.idColumnIndex+1].innerText;
				if(grid.selectedIds.indexOf(id)!==-1){
					$(tr).addClass("selected");
					var label=$(tr).find('label');
					var checkbox=label.find("input[type=checkbox]");
					label.addClass("checked");
					checkbox.prop("checked", true);
				}
				else{
					$(tr).removeClass("selected");
					var label=$(tr).find('label');
					var checkbox=label.find("input[type=checkbox]");
					label.removeClass("checked");
					checkbox.prop("checked", false);
				}
			}
		}

		var gridid = obj.grid.selector.substring(1, obj.grid.selector.length);
		$("#" + gridid).grid.calculateTdWidth(gridid);
		me.get(0).grid.grid("refreshGridHeaderChkbox");
		return me;
	},
	updateBtns: function(me){
		var me = me || this,
			container = me.closest("div.paging-container"),
			btnsContainer = container.find("div.num-buttons-container"),
			obj = me.get(0),
			numPerPage = obj.numPerPage,
			currentPage = obj.currentPage;

		//var totalPage = Math.ceil(len/numPerPage);
		var totalPage = Math.ceil(obj.totalNum/numPerPage);
		obj.totalPage = totalPage;

		container.removeClass("disabled");

		var inHTML = 	"";
		for (var index = 0; index < totalPage; index++){
			inHTML +=	"<a href=\"javascript:void(0);\" class=\"paging-btn paging-btn-num pageing-btn-"+index+"\" data-index=\""+index+"\">";
			inHTML +=		"<span class=\"icon\"></span>";
			inHTML +=		"<span class=\"text\">"+(index+1)+"</span>";
			inHTML +=	"</a>"
			inHTML +=	"<span class=\"dots\">...</span>";
		};

		btnsContainer.empty().append($(inHTML));

		return me;
	},
	goToPage: function(me, pageNum){
		var me = me || this;
		var	container = me.closest("div.paging-container");
		var	obj = me.get(0);
		var	totalPage = obj.totalPage;
		var	currentPage = isNaN(pageNum[1]) ? 0 : pageNum[1];
		var grid=obj.grid.get(0);
		var numPerPage = obj.numPerPage;

		// 当前页码超过总页数时，将当前页码置为最大页码
		// currentPage索引从0开始
		if (currentPage >= totalPage) {
			currentPage = totalPage - 1;
		}
		currentPage = Math.max(0, currentPage);

		var	store = grid.store;
		var goToPageHandle = obj.goToPageHandle;		/* 自定义的处理函数 */

		/*
		if (currentPage >= totalPage){
			currentPage = 0;
		};
		*/

		//svn25483:解决进行启用/禁用以及自定义动作时，默认跳转至第一页的bug：引入此属性，但跳转后需重置该属性，避免带有分组的页面在切换分组时，该属性仍生效
		if (store.workingPage != undefined){
			store.workingPage = undefined;
		}

		//console.log(currentPage, totalPage)
		//按钮样式调整
		var btnPrev = container.find("a.paging-btn.pageing-btn-prev"),
			btnNext = container.find("a.paging-btn.pageing-btn-next"),
			btns = container.find("a.paging-btn-num"),
			dots = container.find("span.dots");

		//数字按钮的处理
		btns.removeClass("current");
		dots.removeClass("more");
		btns.filter("[data-index="+currentPage+"]").addClass("current");

		if (totalPage > 7){
			var gap1 = 0 + currentPage - 2,
				gap2 = 0 + currentPage + 3 - (totalPage - 1),

				minNum = 0,
				maxNum = 0;

			if (gap1 > 0){
				if (gap2 > 0){
					minNum = 0 + currentPage - 2 - gap2;
					maxNum = 0 + totalPage;
				}else{
					minNum = 0 + currentPage - 2;
					maxNum = 0 + currentPage + 3;
				};
			}else{
				if (gap2 > 0){
					minNum = 0;
					maxNum = 0 + totalPage;
				}else{
					minNum = 0;
					maxNum = 0 + currentPage + 3 - gap1;
				};
			};

			//console.log(currentPage, totalPage, gap1, gap2, minNum, maxNum);
			// var minNum = gap1 > 0 ? currentPage - 2 : 0;
			// 	maxNum = gap1 > 0 ? currentPage + 3 : currentPage + 3 - gap1;

			btns.addClass("hidden");

			for (var index = minNum; index < maxNum; index++){
				btns.eq(index).removeClass("hidden");
			};

			if (gap1 > 1){
				btns.eq(minNum).prev("span.dots").addClass("more");
			};

			if (gap2 < 0){
				btns.eq(maxNum).next("span.dots").addClass("more");
			};

			btns.filter(":first").removeClass("hidden");
			btns.filter(":last").removeClass("hidden");
		};

		if (goToPageHandle == null && !isNaN(pageNum[1]) && pageNum[2]!=undefined ){
			var params = {};
			var para = {};

			if (obj.search){
				$.extend(params, obj.params);
			}

			/* 此处开始携带分页参数 */
			//params.pageNo = currentPage;
			para.start = currentPage * numPerPage;
			para.end = (currentPage + 1)* numPerPage - 1;

			//携带分页filter
			if (!obj.search && undefined != store.pagingField)
			{
				$.each(store.pagingField, function(i, el){
					params[el] = store.pagingField[el];
				});
			}
			store.keyLength = 0;
			var not_load = false;
			if(store.second_load) {
				not_load = true;
			}
			store.load(
					{filter: params, para: para},
					function(data, others, status, xhr){
					if (data.length == 0 && currentPage > 0 && pageNum[2] != "wrong_page"){ //当页面跳转时，该页已经没有条目，需重新跳转到合法页面
						//console.log(others)
						obj = me.get(0);
						if (pageNum[2] == "ev_insert"){
							obj.inserting = true;
						}
						obj.totalNum = others ? others.count : 0;	/* 看来要每获取一次数据就要更新一次总页码 */
						me.paging_true("updateBtns"); //根据totalNum计算总页码
						obj.currentPage = (obj.totalPage > 0) ? (obj.totalPage - 1) : 0; /* currentPage starts from 0, totalPage start from 1*/
						me.paging_true("goToPage", obj.currentPage, "wrong_page");
					}else{
						// me.paging_true("displayPage");
						me.grid.disGridHeaderChkbox(me.get(0).grid);
						if (store.second_load){
							store.second_load.call(this, data, others, status, xhr);
						}
						if(store.load_suc)
						{
							store.load_suc.call(this, data, others, status, xhr);
						}
					}
				},null,null,not_load);
		}else if (goToPageHandle != null && !isNaN(pageNum[1]) && pageNum[2]!=undefined ) {
			/* 使用单独定义的处理函数，适用于系统日志这种不按套路出牌的模块 */
			if (typeof goToPageHandle != "function") {
				/* 暂无处理 */
				return;
			}

			/* Input ：currentPage(索引以0起始), numPerPage */
			/* Ouput : 数据条目数 */
			goToPageHandle({"currentPage": currentPage, "numPerPage": numPerPage}, function(data, others){
				if (data.length == 0 && currentPage > 0 && pageNum[2] != "wrong_page"){ //当页面跳转时，该页已经没有条目，需重新跳转到合法页面
					obj = me.get(0);
					if (pageNum[2] == "ev_insert"){
						obj.inserting = true;
					}
					obj.totalNum = others ? others.count : 0;	/* 看来要每获取一次数据就要更新一次总页码 */
					me.paging_true("updateBtns"); //根据totalNum计算总页码
					obj.currentPage = (obj.totalPage > 0) ? (obj.totalPage - 1) : 0; /* currentPage starts from 0, totalPage start from 1*/
					me.paging_true("goToPage", obj.currentPage, "wrong_page");
				}else{
					me.paging_true("displayPage");
					me.grid.disGridHeaderChkbox(me.get(0).grid);
				}
			}, pageNum[2]);

		}

		//数据跳转
		var minNum = numPerPage*currentPage,
			maxNum = minNum + numPerPage;

		//这个写法不太好
		/*
		grid.find("tr.grid-content-tr").css("display", "none");
		grid.find("tr.grid-content-tr.empty").css("display", "table-row");


		for (var index = minNum; index < maxNum; index++){
			var row = rows[index];
			if (row){
				row.fadeIn(150, function(){
					$(this).css("display", "table-row");
				});
			};
		};
		*/
		setTimeout(function(){
			//前后按钮的处理
			if (currentPage == 0){
				btnPrev.addClass("disabled");
				if (totalPage <= 1){
					btnNext.addClass("disabled");
				}else{
					btnNext.removeClass("disabled");
				}
			}else if (currentPage >= (totalPage-1)){
				btnPrev.removeClass("disabled");
				btnNext.addClass("disabled");
			}else{
				btnPrev.removeClass("disabled");
				btnNext.removeClass("disabled");
			};
		}, 180);

		obj.currentPage = currentPage;

		//显示分页信息
		//if ( isNaN(pageNum[1]) ){
		if ( undefined == pageNum[2]){
			me.paging_true("displayPage");
		}
		var obj = document.getElementById("goTopBtn");
		var obj1 = document.getElementById("goBottomBtn");
		$("div.top-main").scrollTop() > 0 ? obj.style.display = "": obj.style.display = "none";
		$("div.top-main").scrollTop() + $("div.top-main").height() >= $("div.top-main")[0].scrollHeight - 18 ? obj1.style.display = "none": obj1.style.display = "";
		me.get(0).grid.grid("refreshGridHeaderChkbox");
		return me;
	},
	goPrev: function(me){
		var me = me || this,
			obj = me.get(0),
			currentPage = obj.currentPage;

		currentPage--;
		if (currentPage < 0){
			return me;
		}else{
			//跳转到前一页
			me.paging_true("goToPage", currentPage, "prev");
		};

		return me;
	},
	goNext: function(me){
		var me = me || this,
			obj = me.get(0),
			currentPage = obj.currentPage,
			totalPage = obj.totalPage;

		currentPage++;
		if (currentPage >= totalPage){
			return me;
		}else{
			//跳转到下一页
			me.paging_true("goToPage", currentPage, "next");
		};

		return me;
	}
});

})(jQuery);
