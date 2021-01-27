/**
 * Created by pengerdeng on 2018/6/13.
 */
(function($){
    var _slp_data_to_list = function(data) {
        if (!data.length || data.length == 0) {
            return [];
        }

        var result = [];
        for (var i = 0; i < data.length; i++) {
            for (var k in data[i]) {
                result.push(data[i][k]);
            }
        }
        return result;
    };
    $.su.Widget("autoGrid", {
        defaults: {
            rows: [],  /*  {name: a,callback:f()}的集合 */
            proxy:null,
            autoRefresh: false,
            refreshDuration: 10000,
            maxRows: 4,
            parseKey: null
        },
        create: function(defaults, options){
            var me = this;
            me.each(function(i, obj){
                var tar = $(obj).addClass("auto-grid");
                $.extend(obj, defaults, options);
                var url_datasource = obj.proxy;
                var moduleName, tableName;
                var post_data = {};
                if (obj.parseKey) {
                    moduleName = obj.parseKey.moduleName;
                    tableName = obj.parseKey.tableName;
                    post_data[moduleName] = {
                        table: tableName
                    };
                }
                else {
                    console.error("parseKey is null");
                    return false;
                }

                function getData(){
                    url_datasource.query(post_data, function (data) {
                        var count = data[moduleName].count[tableName];
                        var gridData = data[moduleName][tableName];
                        gridData = _slp_data_to_list(gridData);
                        if(count > obj.maxRows) {
                            gridData = gridData.slice(0, obj.maxRows);
                        }
                        me.autoGrid("_buildTable", tar, gridData, obj.rows);
                    })
                }
                if(obj.autoRefresh){
                    obj.autoRefreshTime = setInterval(getData, obj.refreshDuration);
                    window.autoRefreshId[obj.autoRefreshTime] = true;
                }

                getData();

            });
            return me;
        },
        _buildTable: function(dom, params){
            dom.empty();
            var me = this;
            //将json对象数组转化为二维数组
            var data = params[2],rows = params[3];
            var keyArr = new Array(),arr = new Array();
            if(!data && !data.length) return;
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                arr[i] = new Array();
                for (var j = 0; j < data.length; j++) {
                    row.callback = row.callback || function(data){return $.su.func.escapeHtml(data)};
                    var dd = (undefined == data[j][row.name] || data[j][row.name].toString() == "") ? "---" : data[j][row.name];
                    arr[i][j] =  row.callback.call(me,dd, data[j]);
                }
            };

            // 第二步：将二维数组转化为表格
            var inHtml = "";
            inHtml += "<table>"

            for (var i = 0; i < arr.length; i++) {
                inHtml +="<tr>"
                for (var j = 0; j < arr[i].length; j++) {
                    inHtml += "<td>"+arr[i][j] + "</td>"
                }
                inHtml +="</tr>"
            }
            inHtml += "</table>";
            dom.append(inHtml);
            dom.find('table').css("width","100%");
            me.trigger("ev_load", [data]);
        }
    });

})(jQuery);
