var chosen_g={};
(function($){
    $.su.Widget("catalogueSelector", {
        defaults: {},
        create: function(defaults, options) {
            var me = this;
            $.extend(this, defaults, options);
            me.each(function(i, obj) {
                $.extend(this, defaults, options);
            });

            var inHTML='<div id="catalogueSelector_inner_dialog"></div>';
            $(this).append($(inHTML));

            //初始化Proxy
            var Proxy = new $.su.Proxy();

            //获得最左边的列表，可选的项，已选中的项
            var postData = {
                "app_library" : {
                    "get_catalogue_list": {
                    }
                }
            };
            Proxy.action(postData, function(data){
                var catalogue_list=[];
                function addCatalogue(catalogue_list, key, data) {
                    $.map(data["app_library"][key],function(item){
                        catalogue_list.push({
                            name:item,
                            icon:key
                        })
                    });
                }

                // 按顺序调整
                addCatalogue(catalogue_list, 'catalogue_customize', data);
                addCatalogue(catalogue_list, 'catalogue_software', data);
                addCatalogue(catalogue_list, 'catalogue_category', data);
                addCatalogue(catalogue_list, 'catalogue_label', data);

                //获得最左侧盒子的内容
                var catalogue_list_html='';
                for(var i=0;i<catalogue_list.length;i++){
                    catalogue_list_html+='<div class="catalogue" id="catalogue' +i +'"><img style="height:16px;width:16px;vertical-align:middle;margin-right:4px;" src="/web-static/themes/old/img/' +catalogue_list[i].icon +'.png?random=20200721110338"/><span>'+catalogue_list[i].name+'</span></div>';
                }
                //生成dialog里的内容
                var content='<div class="container">';
                content+=       '<div class="rowFlexBox" style="overflow:hidden">';
                content+=           '<div class="title-container">标签/应用组/软件</div>';
                content+=               '<div style="overflow: auto;height: 465px;">';
                content+=                   catalogue_list_html;
                content+=               '</div>';
                content+=       '</div>';
                content+=       '<div class="rowFlexBox" style="overflow:hidden">';
                content+=           '<div class="title-container">多选<button id="catalogue_select_all" style="margin-left: 50px">全选</button></div>';
                content+=           '<div id="catalogue_tree" style="width:99%;"></div>';
                content+=       '</div>';
                content+=       '<div class="rowFlexBox" style="overflow:hidden;padding-bottom:0">';
                content+=           '<div class="title-container">已选应用</div>';
                content+=           '<div class="dlt-container"><span class="dlt-bt">×</span><span>删除</span></div>';
                content+=           '<div class="title-container">';
                content+=               '<input type="checkbox" class="checkbox-title"/>';
                content+=               '<span class="filter-title">名称</span>';
                content+=           '</div>';
                content+=       '<div class="filter-table-container" style="height:400px">';
                content+=           '<table class="filter-table"></table>';
                content+=       '</div>';
                content+=   '</div>';
                content+='<p style="text-align: right;padding-right: 30px;">已选数量:<span id="catalogueSelector_counter">0</span></p>';
                content+='</div>';

                var dialogElement=$('#catalogueSelector_inner_dialog');
                dialogElement.dialog({
                    content:content,
                    width:'900px',
                    height:'600px',
                    top:'80px',
                    title: '应用组选择器'
                }).on('onConfirmClick', function(){
                    var list=convertChosenToLuciData();
                    me.trigger("confirm",[list]);//确定时向外部发射选中的list
                });

                $("#catalogue_select_all").on('click',function(){
                    var checked=true;
                    var currentCatalogue=$(".catalogue.selected")[0].innerText;
                    var l2LabelArray=[];
                    // 1.更改chosen_g
                    $.map(chosen_g[currentCatalogue], function(sub_catalogue, index){
                        sub_catalogue.selected = checked;
                        $.map(sub_catalogue.children,function(child){
                            if(!child.disabled){
                                child.selected = checked;
                                l2LabelArray.push(child.label);//当前catalogue改变选中状态的label
                            }
                        });
                    });
                    //更改其他catalogue的disable状态
                    for(var catalogue in chosen_g) {
                        if(catalogue!==currentCatalogue){
                            $.map(chosen_g[catalogue], function(sub_catalogue, index){
                                $.map(sub_catalogue.children,function(child){
                                    if(!child.selected){
                                        var l2Label=child.label;
                                        if(checked){
                                            if(l2LabelArray.indexOf(l2Label)!==-1){
                                                child.disabled=true;
                                            }else{
                                                child.disabled=false;
                                            }
                                        }else{
                                            if(child.disabled&&l2LabelArray.indexOf(l2Label)!==-1){
                                                child.disabled=false;
                                            }
                                        }
                                    }
                                });
                            });
                        }
                    }
                    // 2.更新树
                    var data=generateTreeDataByChosen(chosen_g[currentCatalogue]);
                    $("#catalogue_tree").tree('updateSource',data);
                    // 3.更新右侧盒子
                    var table=$('#catalogueSelector_inner_dialog').find('.filter-table');
                    getChosenAppsFromChosen(table);
                    // 4.更新已选数量
                    updateChosenNumber(chosen_g);
                });

                //初始化中间的树
                $("#catalogue_tree").tree({
                    id: 'catalogue_tree',
                    checkbox: true, // 默认开启checkbox
                    minExpandLevel: 1, // 默认展开级别为第1级
                    source: [],
                    maxHeight: 390,
                    maxWidth: 260,
                    nodeShallGet: function(node) {return true;},
                }).on("ev_treeNodeSelect", function (e,data) {
                    var currentCatalogue=$(".catalogue.selected")[0].innerText;
                    var l2IdArray=[];
                    var l2LabelArray=[];
                    var l1IdArray=[];
                    $.map(data,function(item){
                        if(item.type==='level2'){
                            l2IdArray.push(item.key);
                        }else if(item.type==='level1'){
                            l1IdArray.push(item.key);
                        }
                    });
                    //1.更改chosen_g
                    for(var catalogue in chosen_g){
                        $.map(chosen_g[catalogue], function(sub_catalogue, index){
                            if(catalogue===currentCatalogue){
                                //改本catalogue的selected状态
                                var l1Id=sub_catalogue.id;
                                if(l1IdArray.indexOf(l1Id)!==-1) {
                                    sub_catalogue.selected = true;
                                    $.map(sub_catalogue.children, function (item) {
                                        item.selected = true;
                                    });
                                }else{
                                    sub_catalogue.selected = false;
                                    $.map(sub_catalogue.children,function(item){
                                        var l2Id=item.id;
                                        if(l2IdArray.indexOf(l2Id)!==-1){
                                            item.selected=true;
                                        }else{
                                            item.selected=false;
                                        }
                                    });
                                }
                            }
                            //获得真实选中的label
                            $.map(sub_catalogue.children,function(child){
                                if(child.selected||sub_catalogue.selected){
                                    l2LabelArray.push(child.label);
                                }
                            });
                        });
                    }

                    //更改整个的chosen_g的disabled状态
                    for(var catalogue in chosen_g) {
                        $.map(chosen_g[catalogue], function(sub_catalogue, index){
                            $.map(sub_catalogue.children,function(child){
                                if(!child.selected){
                                    var l2Label=child.label;
                                    var selected=child.selected;
                                    if(l2LabelArray.indexOf(l2Label)!==-1){
                                        if(!selected){
                                            child.disabled=true;
                                        }
                                    }else{
                                        child.disabled=false;
                                    }
                                }
                            });
                        });
                    }

                    //2.更改右侧选中的项
                    var table=$(me).find('.filter-table');
                    getChosenAppsFromChosen(table);

                    // 3.更新已选数量
                    updateChosenNumber(chosen_g);
                });

                $(".catalogue").on('click',function(){
                    $(this).siblings().removeClass('selected');
                    $(this).addClass('selected');
                    var catalogue=this.innerText;
                    var data=generateTreeDataByChosen(chosen_g[catalogue]);
                    $("#catalogue_tree").tree('updateSource',data);
                    updateChosenNumber(chosen_g);
                });

                //最右侧盒子的事件
                //删除按钮
                $(".dlt-container").on('click',function(){
                    var currentCatalogue=$(".catalogue.selected")[0].innerText;
                    // 1.获得所有选中的项
                    var ids=[];
                    var labels=[];
                    var filterContainer=$(this).nextAll('.filter-table-container');
                    var checkboxes=filterContainer.find('.filter-table-checkbox');
                    for(var i=0;i<checkboxes.length;i++){
                        var checked=$(checkboxes[i]).find('input[type="checkbox"]').prop('checked');
                        if(checked){
                            var tr=$(checkboxes[i]).parents('tr');
                            var id=tr.attr('id');
                            var label=tr.prop('innerText');
                            ids.push(id);
                            labels.push(label);
                        }
                    }
                    if(ids.length!==0){
                        // 2.从前端缓存移除
                        // 需要拿到所有l2的label，包括被删除的l1的
                        for(var catalogue in chosen_g) {
                            $.map(chosen_g[catalogue], function(sub_catalogue, index){
                                var l1Id=sub_catalogue.id;
                                if(ids.indexOf(l1Id)!==-1){
                                    $.map(sub_catalogue.children,function(child){
                                        labels.push(child.label)
                                    });
                                }
                            });
                        }
                        for(var catalogue in chosen_g){
                            $.map(chosen_g[catalogue], function(sub_catalogue, index){
                                var l1Id=sub_catalogue.id;
                                var offAllL2SelectedFlag=false;
                                if(ids.indexOf(l1Id)!==-1){//父节点被删除，要删除所有子节点的选中状态
                                    offAllL2SelectedFlag=true;
                                    sub_catalogue.selected=false;
                                }
                                $.map(sub_catalogue.children,function(item){
                                    var id=item.id;
                                    var label=item.label;
                                    if(ids.indexOf(id)!==-1){
                                        item.selected=false;
                                    }else if(labels.indexOf(label)!==-1){
                                        item.disabled=false;
                                    }
                                    if(offAllL2SelectedFlag){
                                        item.selected=sub_catalogue.selected;
                                    }
                                });
                            });
                        }
                        // 3.从当前的树移除
                        var data=generateTreeDataByChosen(chosen_g[currentCatalogue]);
                        $("#catalogue_tree").tree('updateSource',data);
                        updateChosenNumber(chosen_g);
                        // 4.从最右的盒子移除
                        for(var i=0;i<ids.length;i++){
                            $('#'+ids[i]).remove();
                        }
                        // 4.把全选按钮的选中状态去掉
                        $(this).closest('.rowFlexBox').find(".checkbox-title").prop('checked',false);
                    }
                });
                //全选按钮
                $(".checkbox-title").on('click',function(){
                    // 全选/全不选
                    var checked=$(this).prop('checked');
                    $(this).parent().next().find('input[type="checkbox"]').prop('checked',checked);
                });
                //单选按钮
                $(".filter-table-checkbox").on('click',function(){
                    // 单个被点击时判断是不是全都选中/没选中了，如果是则更新全选/全不选状态
                    var checkboxes=$(this).parents('.filter-table').find('input[type="checkbox"]');
                    var allChecked=true;
                    for(var i=0;i<checkboxes.length;i++){
                        var checked=$(checkboxes[i]).prop('checked');
                        if(checked===false){
                            allChecked=false;
                            break;
                        }
                    }
                    $(this).parents('.rowFlexBox').find('.checkbox-title').prop('checked',allChecked);
                });

                return me;
            });
        },
        show: function(me,arg){
            var postData = {
                "app_library" : {
                    "get_to_choose": {
                    }
                }
            };
            $.su.loading.show();
            var Proxy = new $.su.Proxy();
            Proxy.action(postData, function(data){
                var to_choose = data["app_library"]["catalogue_to_choose"];
                var chosen=arg[1];
                initChosen(to_choose, chosen,me);
                $('#catalogueSelector_inner_dialog').dialog('show');
                $.su.loading.hide();

                //点击第一个catalogue，来获取中间的树的内容
                $(".catalogue:first").trigger('click');
                return this;
            },function(errcode){
                $.su.loading.hide();
            });
        },
        hide: function(){
            $('#catalogueSelector_inner_dialog').dialog('hide');
            return this;
        },
    });
})(jQuery);

function initChosen(to_choose, chosen,me){
    //清空chosen_g
    for(var key in chosen_g){
        delete chosen_g[key];
    }
    var chosen_labels=[];
    for(var i=0;i<to_choose.length;i++){
        //完整的选项
        var item=to_choose[i];
        var catalogue=item['catalogue'];
        var sub_catalogue=item['sub_catalogue'];
        var optionsApps=item['apps'];
        //已选中的选项
        var chosenApps = null;
        $.map(chosen,function(item){
            if(item.catalogue===catalogue&&item.sub_catalogue===sub_catalogue){
                chosenApps=item['apps'];
                return;
            }
        });
        if(!chosen_g[catalogue]){
            chosen_g[catalogue]=[];
        }
        var children=[];
        var sub_catalogue_selected=chosenApps&&chosenApps.length===0;
        $.map(optionsApps,function(app){
            var app_selected=chosenApps&&(chosenApps.length===0||chosenApps.indexOf(app)!==-1);
            if(app_selected){
                chosen_labels.push(app);
            }
            children.push({
                id:generateRandomId(),
                label:app,
                selected:app_selected,
                disabled:false
                //列表长度为0代表全部选中
            })
        });
        chosen_g[catalogue].push({
            id: generateRandomId(),
            label: sub_catalogue,
            selected: sub_catalogue_selected,//列表长度为0代表全部选中
            disabled:false,
            children: children,
        });
    }
    for(var catalogue in chosen_g){
        $.map(chosen_g[catalogue],function(sub_catalogue){
            $.map(sub_catalogue.children,function(app){
                var label=app.label;
                // !app.selected目的？
                if(!app.selected&&chosen_labels.indexOf(label)!==-1){
                    app.disabled=true;
                }
            });
        })
    }
    //获得最右侧盒子的内容
    var table=$(me).find('.filter-table');
    getChosenAppsFromChosen(table);
}

function getChosenAppsFromChosen(table){
    // 从chosen对象里拿到被选中的列表，放到最右边的盒子里
    // chosen对象的格式
    var apps=[];
    for(var catalogue in chosen_g){
        $.map(chosen_g[catalogue], function(sub_catalogue, index){
            var allSelected=sub_catalogue.selected;
            if(allSelected){
                apps.push(sub_catalogue)
            }else{
                $.map(sub_catalogue.children, function (n) {
                    if(n.selected){
                        apps.push(n)
                    }
                });
            }
        });
    }
    var chosen_apps_html='';
    for(var i=0;i<apps.length;i++){
        chosen_apps_html+='<tr id="'+apps[i].id+'"><td><label class="filter-table-checkbox"><input type="checkbox">'+apps[i].label+'</label></td></tr>';
    }
    table.html(chosen_apps_html);
}

function generateRandomId(){
    return Math.random().toString().split('.')[1];
}

function convertChosenToLuciData(){
    //变成这样的格式 {"catalogue": "通用类应用", "sub_catalogue": "TCP通用流量", "apps": []},
    var res=[];
    for(var catalogue in chosen_g){
        $.map(chosen_g[catalogue], function(sub_catalogue, index){
            if(sub_catalogue.selected){
                res.push({
                    catalogue:catalogue,
                    sub_catalogue:sub_catalogue.label,
                    apps:[]
                })
            }else{
                var children=sub_catalogue.children;
                var apps=[];
                $.map(children, function (n) {
                    if(n.selected){
                        apps.push(n.label)
                    }
                });
                if(apps.length != 0){
                    res.push({
                        catalogue:catalogue,
                        sub_catalogue:sub_catalogue.label,
                        apps:apps
                    })
                }
            }
        });
    }
    return res;
}

function generateTreeDataByChosen(chosen){
    var container = $("#catalogue_tree").closest("div.tree-container");
    var sub_catalogue = $.ui.fancytree.getTree(container).getRootNode().getChildren();
    var sub_catalogue_expanded_arr=[];
    if(sub_catalogue){
        $.map(sub_catalogue,function(parent){
            sub_catalogue_expanded_arr.push({
                key:parent.key,
                expanded:parent.expanded
            });
        });
    }
    var data=[];
    if(chosen){
        $.map(chosen,function(sub_catalogue){
            var children=[];
            $.map(sub_catalogue.children,function(child){
                children.push({
                    title: child.label,
                    key: child.id,
                    type: "level2",
                    selected: child.selected,
                    unselectable:child.disabled
                });
            });
            var match;
            $.map(sub_catalogue_expanded_arr,function(item){
                if(item.key===sub_catalogue.id){
                    match=item;
                    return;
                }
            });
            data.push({
                title: sub_catalogue.label,
                key:sub_catalogue.id,
                type: "level1",
                selected: sub_catalogue.selected,
                unselectable:sub_catalogue.disabled,
                children:children,
                expanded:match?match.expanded:false
            });
        });
    }
    return data;
}

function updateChosenNumber(chosen_g){
    // 更新已选数量
    var counter_map = new Array();
    for(var catalogue in chosen_g){
        $.map(chosen_g[catalogue], function(sub_catalogue, index){
            $.map(sub_catalogue.children,function(child){
                if(child.selected){
                    counter_map[child.label] = true
                }
            });
        });
    }
    $("#catalogueSelector_counter").html(Object.keys(counter_map).length);
}
