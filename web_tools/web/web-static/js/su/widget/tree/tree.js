/*树形插件*/

(function ($) {

    $.su.Widget("tree", {
        defaults: {
            extensions: ["filter"],
            quicksearch: true,
            filter: {
                autoApply: true,   // Re-apply last filter if lazy data is loaded
                autoExpand: true, // Expand all branches that contain matches while filtered
                counter: true,     // Show a badge with number of matching child nodes near parent icons
                fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
                hideExpandedCounter: true,  // Hide counter badge if parent is expanded
                hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
                highlight: false,   // Highlight matches by wrapping inside <mark> tags
                leavesOnly: false, // Match end nodes only
                nodata: "无结果",      // Display a 'no data' status node if result is empty
                mode: "hide",
                clearText: '清除'
            },
            icon: false,
            checkbox: true,
            minExpandLevel: 2,
            selectMode: 3, // 1:single, 2:multi, 3:multi-hier
            fieldLabel: '',
            separator: ':',
            type: 'default',
            placeholder: "Search", /* 搜索框里的占位文字 */
            labelCls: 'm',
            filterWidth: '', /*选项树上的筛选输入框的宽度*/

            /* 在 setValue 时，对于 key 存在 value 中的节点，还需符合何种条件才应当被选中？ */
            nodeShallSet: function (node) { return true; },
            /* 在 getValue 时，对于每个节点（不一定 selected），应满足何种条件才应当返回它的 key？ */
            nodeShallGet: function (node) { return node.isSelected() &&
                (node.parent == null || /* 第一级只要选中就算（表示它的次级已经全部选中）*/
                 !node.parent.isSelected()); } /* 第二级要求它的上级未选中才可以（表示第一级大类没有全选）*/
        },
        create: function (defaults, options) {
            $.extend(this, defaults, options);
            var me = this;
            var inHTML = "<div class=\"container widget-container tree-container\"></div>";
            var container = $(inHTML);
            container.fancytree({
                extensions: me.filter ? defaults.extensions : [],
                quicksearch: defaults.quicksearch,
                filter: defaults.filter,
                icon: defaults.icon,
                checkbox: me.checkbox,
                minExpandLevel: me.minExpandLevel,
                source: me.source || [],
                selectMode: defaults.selectMode,
                /*以下是node event*/
                // 单击
                click: function(event, data) {
                    /* 单击标题文字可选择此项 */
                    if (data.targetType === 'title') {
                        data.node.toggleSelected();
                    }
                    me.trigger("ev_treeNodeClick", [event, data]);
                    return me;
                },
                // 双击
                dblclick: function(event, data) {
                    me.trigger("ev_treeNodeDbClick", [event, data]);
                    return me;
                },
                // 激活
                activate: function(event, data) {
                    me.trigger("ev_treeNodeActive", [event, data]);
                    return me;
                },
                // 激活之前
                beforeActivate: function(event, data) {
                    me.trigger("ev_treeNodeBeforeActivate", [event, data]);
                    return me;
                },
                select: function(event, data) {
                    var selectData = me.tree("getSelectedNode");
                    me.trigger("ev_treeNodeSelect", [selectData]);
                    return me;
                },
                beforeSelect: function(event, data) {
                    me.trigger("ev_treeNodeBeforeSelect", [event, data]);
                    return me;
                }
                /*以上是node event*/
            });
            me.attr("id", me.id || $.su.randomId("tree"));
            me.attr("name", me.name);
            me.get(0).xtype = "tree";
            me.get(0).nodeShallGet = me.nodeShallGet;
            me.get(0).nodeShallSet = me.nodeShallSet;
            me.replaceWith(container);
            container.prepend(me.hide());
            /* me 只是一个用来找 container 和配置信息的空元素，Fancytree 在 container 里面，和这个元素平级。
             * 所以使用 Fancytree 的 getTree(xxx) 和 DOM 操作时只能用 container 而不能用 me，
             * 而 xxx.tree("...") 时会自动寻找 container，所以既可以用 me 也可以用 container.
             */

            container.find("ul.fancytree-container").css({
                "border": "none",
                "maxHeight": me.maxHeight && typeof me.maxHeight === "number" ? me.maxHeight + "px" : "250px",
                "maxWidth": me.maxWidth && typeof me.maxWidth === "number" ? me.maxWidth + "px" : "250px",
                "overflow": "auto",
                "padding": "0",
                "marginTop": "10px"
            });
            if (me.type === 'editorTree'  && me.fieldLabel){
                container.find("ul.fancytree-container").addClass(me.labelCls || 'm');
                container.find("ul.fancytree-container").css({
                    "verticalAlign": "middle",
                    "display": "inline-block"
                });
            }
            if (!me.filter) {
                container.find("ul.fancytree-container").removeClass(me.labelCls || 'm');
            }
            if (me.fieldLabel && me.filter) {
                container.find("ul.fancytree-container").css({
                    "display": "block"
                });
            }
            me.tree("initDefaultStyle");

            // filter
            if (me.filter) {
                me.tree("initFilter", me, defaults, options);
            }
            // label
            if (me.fieldLabel) {
                var fieldLabelHtml = '';
                fieldLabelHtml += "<div class=\"widget-fieldlabel-wrap " + me.labelCls + "\">";
                fieldLabelHtml += "<label class=\"widget-fieldlabel text-fieldlabel\">" + me.fieldLabel + "</label>";
                if (me.fieldLabel !== "") {
                    fieldLabelHtml += "<span class=\"widget-separator\">" + me.separator + "</span>";
                }
                fieldLabelHtml += "</div>";
                container.prepend(fieldLabelHtml);
            }
            return me;
        },
        initDefaultStyle: function (me, args) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            container.find(".fancytree-plain span.fancytree-node").css({
                "border": "none"
            });
        },
        // 初始化filter选项
        initFilter: function (me, args) {
            var me = me || this;
            var container = me.closest("div.tree-container");

            // 搜索输入
            var input = document.createElement("input");
            input.id = "treeSearch";
            input.className = "tree-search-input";
            input.style.width = me.filterWidth && typeof me.filterWidth === 'number' ?
                me.filterWidth + 'px': '100px';
            input.setAttribute("placeholder",
                args[3].filter && typeof args[3].placeholder === "string" ? args[3].placeholder : "搜索" );
            input.setAttribute("name", "treeSearch");
            input.setAttribute("autocomplete", "off");

            // 清除搜索
            var resetSearchBtn = document.createElement("input");
            resetSearchBtn.id = "resetSearchBtn";

            container.prepend(resetSearchBtn);
            container.prepend(input);

            $(resetSearchBtn).button({
                fieldLabel: null,
                text: args[3].clearText || args[2].filter.clearText,
                cls: 'inline',
                handler: function(){
                    var tree = $.ui.fancytree.getTree(container);
                    $(input).val("");
                    tree.clearFilter();
                    $(this).button("disable");
                }
            }).button("disable"); /* 此函数调用时搜索框里没有文本，默认禁用 */

            $(input).on("keyup", function (e) {
                var tree = $.ui.fancytree.getTree(container);
                tree.filterBranches.call(tree, $(this).val(), args[2].filter);
                $(resetSearchBtn).button("enable");
            }).focus();
        },
        getSelectedNode: function (me) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            var selNodes = $.ui.fancytree.getTree(container).getSelectedNodes();
            return $.map(selNodes, function (n) {
                if (me.get(0).nodeShallGet(n)) {
                    return n.toDict();
                }
            });
        },
        updateSource: function (me, args) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            container.fancytree("option", "source", args[1]);
            me.tree("initDefaultStyle");
        },
        validate: function(me) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            var tree = $.ui.fancytree.getTree(container);

            /* TODO allow external filters */
            tree.generateFormElements(me.attr("name"), false, {filter: function (node) {
                return me.get(0).nodeShallGet(node);
            }});

            return true;
        },
        getValue: function(me) {
            var me = me || this;
            var selNodes = me.tree("getSelectedNode");
            var ret = [];
            for (var i = 0; i < selNodes.length; i++) {
                ret.push(selNodes[i].key);
            }
            return ret;
        },
        setValue: function(me, args) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            var tree = $.ui.fancytree.getTree(container);
            var vals = args[1];

            if (typeof(vals) == "string") {
                vals = [vals];
            }

            me.tree("reset");
            tree.visit(function (node) {
                if (vals.indexOf(node.key) != -1 && me.get(0).nodeShallSet(node)) {
                    node.setSelected(true);
                }
            });
        },
        reset: function (me) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            var tree = $.ui.fancytree.getTree(container);

            tree.selectAll(false);
            tree.clearFilter();
            container.find(".tree-search-input").val("");
        },
        disable: function (me) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            var tree = $.ui.fancytree.getTree(container);

            tree.visit(function (node) {
                node.unselectable = true;
                node.render();
            });
        },
        enable: function (me) {
            var me = me || this;
            var container = me.closest("div.tree-container");
            var tree = $.ui.fancytree.getTree(container);

            tree.visit(function (node) {
                node.unselectable = false;
                node.render();
            });
        }
    })
})(jQuery);
