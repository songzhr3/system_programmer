function toPercent(val, sum) {
    if (val == 0 || sum === 0) {
        return "0%";
    }
    var str = Number(val / sum * 100).toFixed(2);
    str += "%";

    if (str == "0%"){
        str = "<0.01%";
    }

    return str;
}

function sum(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--) {
      s += arr[i];
    }
    return s;
  }

function transfromFlow(num, fixed){
    var KB = 1000;
    var MB = KB * 1000;
    var GB = MB * 1000;
    var TB = GB * 1000;

    if (num < KB)  // 小于1K，单位是B
    {
        return num + "B";
    }
    else if (num < MB) // 小于1MB，单位是KB
    {
        num /= KB;
        return num.toFixed(fixed) + "KB";
    }
    else if (num < GB)  // 小于1GB，单位是MB
    {
        num /= MB;
        return num.toFixed(fixed) + "MB";
    }
    else if (num < TB) // 小于1TB，单位是GB
    {
        num /= GB;
        return num.toFixed(fixed) + "GB";
    }
    else // 大于1TB，单位是TB
    {
        num /= TB;
        return num.toFixed(fixed) + "TB";
    }
}

var palette = ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'];

function truncLongStringWithLen(str, len) {
    return echarts.format.truncateText(str, len, '14px Microsoft Yahei', '…');//图例名称过长拼接省略号
}

function truncLongString(str) {
    return truncLongStringWithLen(str, 130);
}

var TIME_1H_MS  = 1000 * 60 * 60;
var TIME_1D_MS  = 1000 * 60 * 60 * 24;
var TIME_1W_MS  = 1000 * 60 * 60 * 24 * 7;
var TIME_31D_MS = 1000 * 60 * 60 * 24 * 31;

function padStart(string, targetLength, padString) {
    while (string.length < targetLength) {
        string = padString + string
    }
    return string
}

function dateFormat(fmt, date) {
    var ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "D+": date.getDate().toString(),            // 日
        "h+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (padStart(opt[k], ret[1].length, "0")))
        };
    };
    return fmt;
}

// 获取base64图片byte大小
function getImgByteSize(graphicContents) {
    var size = 0;
    if (graphicContents) {
        var equalIndex = graphicContents.indexOf('='); // 获取=号下标
        if (equalIndex > 0) {
            var str = graphicContents.substring(0, equalIndex); // 去除=号
            var strLength = str.length;
            var fileLength = strLength - (strLength / 8) * 2; // 真实的图片byte大小
            size = Math.floor(fileLength); // 向下取整
        } else {
            var strLength = graphicContents.length;
            var fileLength = strLength - (strLength / 8) * 2;
            size = Math.floor(fileLength); // 向下取整
        }
    } else {
        graphicContents.size = null;
    }
    return (size / 1024).toFixed(2) + 'KB'
}

function isEmptyVar(v){
    return typeof(v) == 'undefined' || v == null || v == '';
}

function runwatingbar()
{
    $("#mask").show();
    $("#report_cmd_pro_bar_div").msg('show');
    $("#report_cmd_pro").show();
    $("#report_cmd_pro_bar").waitingbar("run");
}

function hideWaitingbar()
{
    $("#report_cmd_pro_bar").waitingbar("stop");
    $("#report_cmd_pro_bar").waitingbar("reset");
    $("#report_cmd_pro").hide();
    setTimeout(function() {
        $("#report_cmd_pro_bar_div").msg('hide');
    }, 100);
    $("#mask").hide();
}

var emptyOption = {
    title: {
        show: true,
        textStyle:{
          color:'grey',
          fontSize:15
        },
        text: "暂无数据",
        left: 'center',
        top: 'center'
      },
    xAxis: {
        show: false
    },
    yAxis: {
        show: false
    },
    series: []
};

var initPage = function(options) {
    var defaults = {
        pageId: '',
        panel: '',
        condition: null,
        radioOption: null,
        triggerOption: null,
        currentCondition: '',
        currentTrigger: '',
        graphType: '',
        grid: {
            store: null,
            columns: null
        },
        beginPicker: null
    };

    var me = $.extend({}, defaults, options);

    var $container = $('<div class="report-panel' + me.pageId + '"></div>');

    var $conditionTab = $('<div class="report-tab-container"></div>');
    var $operation = $('<div class="report-operation-container"></div>');

    var $chartContainer = $('<div class="report-chart-area"></div>');
    var $chartOperation = $('<div class="chart-operation-container"></div>');

    var $gridContainer = $('<div class="report-grid-area-' + me.pageId + '"></div>');
    var $customTimeMsg = $('<div class="custom-time-' + me.pageId + '"></div>');

    var $help = $('<div id="' + me.pageId + '_help"></div>');

    var $waitingBar = $('<div id="report_cmd_pro_bar_div" style="display: none;">' +
                            '<div id="report_cmd_pro" class="reboot-loading-msg hidden">' +
                                '<input id="report_cmd_pro_bar" type="text" />' +
                            '</div>' +
                        '</div>'
    );

    $.each(me.condition, function(index, item) {
        $conditionTab.append(
            '<div class="tab-item ' +
            (index === 0 ? 'active' : '') +
            '" data-condition="' + item.value + '">' + item.label + '</div>');
    });

    $operation.append(
        '<form id="download_pdf_form_' + me.pageId + '" class="report-new-form" enctype="multipart/form-data">' +
        '  <button type="button" class="download-pdf" name="download_pdf"></button>' +
        '</form>' +
        '<form id="download_csv_form_' + me.pageId + '" class="report-new-form" enctype="multipart/form-data">' +
        '  <button type="button" class="download-csv" name="download_csv"></button>' +
        '</form>' +
        '<button type="button" id="refresh_' + me.pageId + '" name="refresh"></button>' +
        '<input type="text"  id="report_time_combobox_' + me.pageId + '" name="report_time_combobox"/>' +
        '<span id="custom_time_text_' + me.pageId + '" class="custom-time-text"></span>'
    );

    $chartOperation.append(
        '<div align="left" style="float:left">' +
            '<input type="text"  class="chart-data' + me.pageId + '" name="chart_data"/>' +
        '</div>' +
        '<div align="right">' +
            '<input type="text"  class="chart-trigger' + me.pageId + '" name="chart_trigger"/>' +
        '</div>'
    );

    $customTimeMsg.append(
        '<div class="custom-time-item-container">' +
        '     <input id="start_time_' + me.pageId + '" name="start_time"/>' +
        '     <a class="report-date-time-picker begin" href="javascript:void(0);">' +
        '            <span class="icon"></span>' +
        '     </a>' +
        '     <div id="report_date_time_picker_begin_' + me.pageId + '" class="report-date-time-picker-begin"></div>' +
        '</div>' +
        '<div class="custom-time-item-container">' +
        '      <input id="end_time_' + me.pageId + '" name="end_time"/>' +
        '      <a class="report-date-time-picker end" href="javascript:void(0);">' +
        '            <span class="icon"></span>' +
        '      </a>' +
        '      <div id="report_date_time_picker_end_' + me.pageId + '" class="report-date-time-picker-end"></div>' +
        '</div>'
    );

    $chartContainer.append($chartOperation);
    $chartContainer.append(
        // '<div id="echarts_container_' + me.pageId + '"class="echarts-container"></div>'+
        '<div id="echarts_container_area_' + me.pageId + '" class="echarts-container" data-chart-type="area_chart"></div>' +
        '<div id="echarts_container_line_' + me.pageId + '" class="echarts-container" data-chart-type="line_chart"></div>' +
        '<div id="echarts_container_bar_' + me.pageId + '" class="echarts-container" data-chart-type="bar_chart"></div>' +
        '<div id="echarts_container_pie_' + me.pageId + '" class="echarts-container" data-chart-type="pie_chart"></div>'
    );

    // 初始化容器结构
    $container.append($conditionTab)
        .append($operation)
        .append($chartContainer)
        .append($gridContainer)
        .append($customTimeMsg)
        .append($help);

    $('#' + me.pageId).append($container);
    $('.func_container').append($waitingBar);

    var report_help = new $.su.Help({
        container: "div#" + me.pageId + "_help",
        content: [me.pageId.toUpperCase()]
    });

    var TH_REPORT_INFO = {
        // 统计维度
        CONDITION: me.condition,
        CHART_TYPE: {
            AREA_CHART: 'area_chart',
            LINE_CHART: 'line_chart',
            BAR_CHART: 'bar_chart',
            PIE_CHART: 'pie_chart'
        },
        LINE_CHART_TYPE: {
            AREA: 'area',
            LINE: 'line'
        }
    };
    var CURRENT_CONDITION = me.currentCondition; // 默认统计维度
    var CURRENT_CHART = TH_REPORT_INFO.CHART_TYPE.AREA_CHART; // 默认图表类型
    var END_TIME = -1; // 查询结束时间
    var START_TIME = -1; // 查询开始时间

    var EXPORT_PDF_URL = '';
    var EXPORT_CSV_URL = '';

    $('div.report-panel' + me.pageId).panel({
        title: me.panel,
        collapsible: false
    });

    $("#download_pdf_form_" + me.pageId).form({
        proxy: {},
        formEnctype: "multipart/form-data",
        traditional: true,
        hiddenFrame: true,
        autoLoad: false,
        fileUrlCb: function() {
            return $.su.url.subs + $.su.url.stok + EXPORT_PDF_URL;
        }
    });

    $("#download_csv_form_" + me.pageId).form({
        proxy: {},
        formEnctype: "multipart/form-data",
        traditional: true,
        hiddenFrame: true,
        autoLoad: false,
        fileUrlCb: function() {
            return $.su.url.subs + $.su.url.stok + EXPORT_CSV_URL;
        }
    });

    $("#report_cmd_pro_bar_div").msg({
        cls: 'warning reboot-confirm-size',
        closeBtn: false,
        type: "window"
    });
    $('input#report_cmd_pro_bar').waitingbar({
        fieldLabel: "正在加载报表数据",
        labelCls:"xxl",
        waitTime: 1000
    });

    $('.tab-item').on('click', function() {
        if (!$(this).hasClass('active')) {
            $('.tab-item').removeClass('active');
            $(this).addClass('active');
        }
        // 恢复默认图表配置
        CURRENT_CONDITION = $('.tab-item.active').attr('data-condition');
        CURRENT_CHART = $("input.chart-trigger" + me.pageId).radio('getValue');
        clearChartAndGrid();
    });

    // 下载pdf
    $('button.download-pdf').button({
        text: '导出PDF',
        cls: "report-page inline-block submit",
        fieldLabel: null,
        handler: function() {
            if (!calculateStartTime())
            {
                return;
            }

            var proxy = new $.su.Proxy();
            var graph_content = $("input.chart-data" + me.pageId).radio('getValue');
            var gen_pdf =
            {
                "report_new": 
                {
                    'gen_pdf': {
                        'report_name': me.pageId.split('_', 1)[0],
                        "start_time": START_TIME,
                        "end_time": END_TIME,
                        'pdf_list': 
                        [
                            {"report_table": CURRENT_CONDITION, "sort_content": graph_content}
                        ]
                    }
                }
            };

            proxy.action(gen_pdf, function(data) {
                EXPORT_PDF_URL = data.url;

                switch (CURRENT_CHART) {
                    case TH_REPORT_INFO.CHART_TYPE.AREA_CHART :
                        var areaChartBase64 = areaChart.getDataURL({
                            type: 'png',
                            pixelRatio: 1,
                            backgroundColor: '#fff'
                        });
                        uploadBase64String(areaChartBase64);
                        break;
                    case TH_REPORT_INFO.CHART_TYPE.LINE_CHART :
                        var lineChartBase64 = lineChart.getDataURL({
                            type: 'png',
                            pixelRatio: 1,
                            backgroundColor: '#fff'
                        });
                        uploadBase64String(lineChartBase64);
                        break;
                    case TH_REPORT_INFO.CHART_TYPE.BAR_CHART :
                        var barChartBase64 = barChart.getDataURL({
                            type: 'png',
                            pixelRatio: 1,
                            backgroundColor: '#fff'
                        });
                        uploadBase64String(barChartBase64);
                        break;
                    case TH_REPORT_INFO.CHART_TYPE.PIE_CHART :
                        var pieChartBase64 = pieChart.getDataURL({
                            type: 'png',
                            pixelRatio: 1,
                            backgroundColor: '#fff'
                        });
                        uploadBase64String(pieChartBase64);
                    break;
                        default: break;
                }
            });
        }
    });

    function clearChartAndGrid(){
        areaChart.clear();
        lineChart.clear();
        barChart.clear();
        pieChart.clear();

        topGrid.grid("getStore").loadData({});
    }

    function uploadBase64String(dataUrl) {
        var chunk = 30*1024;
        var chunks = [];

        var start = 0;
        dataUrl = dataUrl.replace('data:image/png;base64,', '');
        var fileLength = dataUrl.length;

        for (var i = 0; i < Math.ceil(fileLength / chunk); i++) {
          //最后一段取文件的真实大小
          var end = 0;
          if(i == (Math.ceil(fileLength / chunk)-1)){
            end = fileLength;
          }else{
            end = start + chunk;
          }
          chunks[i] = dataUrl.slice(start , end);
          start = end;
        }

        var index = 0;
        function sendProxy(chunks) {
          var uploadProxy = new $.su.Proxy();
          var more_fragment = index === chunks.length -1 ? "0" : "1";
          uploadProxy.action({
            report_new:
                {
                  upload_png:
                      {
                        report_table: CURRENT_CONDITION,
                        report_graph: chunks[index],
                        more_fragment: more_fragment
                      }
                }
          },function(data){
            index ++;
            if (index < chunks.length) {
              sendProxy(chunks);
           }else{
              // 图片发送完后，再请求下载
              $("#download_pdf_form_" + me.pageId).form('submit', {});
           }
          },function(error){

          },function(fail){

          });
        }

        sendProxy(chunks);
      }

    // 下载CSV
    $('button.download-csv').button({
        text: '导出CSV',
        cls: "report-page inline-block submit",
        fieldLabel: null,
        handler: function() {
            if (!calculateStartTime())
            {
                return;
            }

            var proxy = new $.su.Proxy();
            var graph_content = $("input.chart-data" + me.pageId).radio('getValue');
            proxy.action({
                'report_new': {
                    'gen_csv': {
                        "report_table": CURRENT_CONDITION,
                        "sort_content": graph_content,
                        "start_time": START_TIME,
                        "end_time": END_TIME
                    }
                }
            }, function(data) {
                EXPORT_CSV_URL = data.url;

                $("#download_csv_form_" + me.pageId).form('submit', {});
            });
        }
    });

    // 刷新
    $('#refresh_' + me.pageId).button({
        text: '加载报表',
        cls: "report-page inline-block",
        fieldLabel: null,
        handler: function() {
            switchChart(CURRENT_CHART);
        }
    });

    $('#report_time_combobox_' + me.pageId).combobox({
        fieldLabel: '时间',
        cls: 'report-time',
        inputCls: 'l',
        labelCls: 'xxxs',
        items: [
            { name: "过去1个小时", value: "0" },
            { name: "过去1天", value: "1"},
            { name: "过去1周", value: "2" },
            { name: "过去1个月", value: "3" },
            { name: "自定义时间", value: "4", selected: true }
        ]
    }).on('ev_click', function(e, oldValue, newValue) {
        if (newValue[0] !== '4') {
            $('#custom_time_text_' + me.pageId).text(''); // 隐藏用户选择的时间
        } else {
            // 自定义时间
            $custom_time.msg('show');
        }
    });

    $('#start_time_' + me.pageId).textbox({
        fieldLabel: '开始时间',
        allowBlank: false,
        cls: "xl",
        labelCls: 'xxs',
        readOnly: true
    });
    $('#end_time_' + me.pageId).textbox({
        fieldLabel: '结束时间',
        cls: "xl",
        labelCls: 'xxs',
        readOnly: true,
        allowBlank: false
    });

    var $custom_time = $("div.custom-time-" + me.pageId).msg({
        closeBtn: true,
        cls: "l report-datetime",
        title: "自定义时间",
        type: "prompt",
        okHandler: function() {
            var startTime = $('#start_time_' + me.pageId).textbox('getValue');
            var endTime = $('#end_time_' + me.pageId).textbox('getValue');

            if (!startTime || !endTime) {
                alert("请输入开始时间和结束时间");
                return false;
            }
            if (new Date(startTime) > new Date(endTime)) {
                alert('开始时间不能大于结束时间');
                return false;
            }
            if (new Date(endTime) - new Date(startTime) > TIME_31D_MS) {
                alert('最长查询区间不能大于31天');
                return false;
            }

            $('#custom_time_text_' + me.pageId).text(startTime + ' 至 ' + endTime);
        },
        cancelHandler: function() {
            return true;
        }
    }).msg("hide");

    $('#custom_time_text_' + me.pageId).on('click', function() {
        $custom_time.msg('show');
    });

    $('a.report-date-time-picker.begin').on('click', function() {
        me.beginPicker.show();
        me.endPicker.hide();
    });
    $('a.report-date-time-picker.end').on('click', function() {
        me.endPicker.show();
        me.beginPicker.hide();
    });

    me.beginPicker = $('#report_date_time_picker_begin_' + me.pageId).datetimepicker({
        date: new Date(),
        viewMode: 'YMDHMS',
        firstDayOfWeek: 0,
        onOk: function() {
            var beginTime = this.getText('YYYY-MM-DD HH:mm:ss');
            $('#start_time_' + me.pageId).textbox('setValue', beginTime);
            this.hide();
        },
        onClose: function() {

        }
    });
    me.beginPicker.hide();

    me.endPicker = $('#report_date_time_picker_end_' + me.pageId).datetimepicker({
        date: new Date(),
        viewMode: 'YMDHMS',
        firstDayOfWeek: 0,
        onOk: function() {
            var endTime = this.getText('YYYY-MM-DD HH:mm:ss');
            $('#end_time_' + me.pageId).textbox('setValue', endTime);
            this.hide();
        },
        onClose: function() {}
    });
    me.endPicker.hide();

    $("input.chart-data" + me.pageId).radio({
        fieldLabel: null,
        columns: 4,
        cls: 'report-data',
        items: me.radioOption
    }).on("ev_change", function(e, oldValue, newValue) {
        clearChartAndGrid();
    });

    $("input.chart-trigger" + me.pageId).radio({
        fieldLabel: null,
        columns: 4,
        cls: 'report-trigger',
        items: me.triggerOption
    }).on("ev_change", function(e, oldValue, newValue) {
        CURRENT_CHART = newValue;
        clearChartAndGrid();
    });

    function loadGrid(){
        topGrid.grid('getStore').load();
        // 暂时先改下标题
        var header1 = topGrid.find('.grid-header-1').children('span').eq(0);
        var title;
        switch (me.pageId)
        {
            case "flow_report":
                title = REPORT_INFO.FLOW_REPORT.TYPE[CURRENT_CONDITION];
                break;
            case "sphit_report":
                title = REPORT_INFO.SPHIT_REPORT.TYPE[CURRENT_CONDITION];
                break;
            case "threat_report":
                title = REPORT_INFO.THREAT_REPORT.TYPE[CURRENT_CONDITION];
                break;
            default:
                break;
        }
        header1.html(title);
    }

    // 切换chart
    function switchChart(type) {
        switch (type) {
            case TH_REPORT_INFO.CHART_TYPE.AREA_CHART:
                areaChart && areaChart.clear();
                initLineChart(TH_REPORT_INFO.LINE_CHART_TYPE.AREA);
                echartContainerShowTrigger(type);
                break;
            case TH_REPORT_INFO.CHART_TYPE.LINE_CHART:
                lineChart && lineChart.clear();
                initLineChart(TH_REPORT_INFO.LINE_CHART_TYPE.LINE);
                echartContainerShowTrigger(type);
                break;
            case TH_REPORT_INFO.CHART_TYPE.BAR_CHART:
                barChart && barChart.clear();
                initBarChart();
                echartContainerShowTrigger(type);
                break;
            case TH_REPORT_INFO.CHART_TYPE.PIE_CHART:
                pieChart && pieChart.clear();
                initPieChart();
                echartContainerShowTrigger(type);
                break;
            default:
                {}
        }
    }

    // 切换chart容器显示
    function echartContainerShowTrigger(type) {
        $.each($('.echarts-container'), function(index, item) {
            if ($(item).attr('data-chart-type') === type) {
                $(item).show();
            } else {
                $(item).hide();
            }
        })
    }

    // 计算START_TIME
    function calculateStartTime() {
        var value = $("#report_time_combobox_" + me.pageId).combobox("getValue")[0];

        END_TIME = -1;
        switch (value) {
            case '0':
                START_TIME = 0;
                break;
            case '1':
                START_TIME = 1;
                break;
            case '2':
                START_TIME = 2;
                break;
            case '3':
                START_TIME = 3;
                break;
            case '4':
                START_TIME = new Date($('#start_time_' + me.pageId).textbox('getValue')).getTime();
                END_TIME = new Date($('#end_time_' + me.pageId).textbox('getValue')).getTime();
                break;
            default:
                {}
        }

        if (isNaN(START_TIME) || isNaN(END_TIME))
        {
            alert('请选择正确的时间范围！');
            return false;
        }

        return true;
    }

    // 获取图数据  trend:叠加图与折线图 sum:柱状图与饼图
    function getGraphProxyData(graph_type, chart, type) {
        if (!calculateStartTime())
        {
            return;
        }

        var graph_content = $("input.chart-data" + me.pageId).radio('getValue');
        var graphProxy = new $.su.Proxy();
        var graphType = me.graphType;
        var queryJson = {
            "report_new": {
                "table": graphType,
                "filter": {
                    "start_time": START_TIME,
                    "end_time": END_TIME,
                    "report_table": CURRENT_CONDITION,
                    "graph_content": graph_content,
                    "graph_type": graph_type
                }
            }
        };
        runwatingbar();
        graphProxy.query(queryJson, function(data) {
            if (chart == TH_REPORT_INFO.CHART_TYPE.LINE_CHART) {
                initLineChartCb(data, type);
            } else if (chart == TH_REPORT_INFO.CHART_TYPE.BAR_CHART) {
                initBarChartCb(data);
            } else if (chart == TH_REPORT_INFO.CHART_TYPE.PIE_CHART) {
                initPieChartCb(data);
            }

            loadGrid();

            hideWaitingbar();
        });
    }

    var areaChart = echarts.init(document.getElementById('echarts_container_area_' + me.pageId));
    var lineChart = echarts.init(document.getElementById('echarts_container_line_' + me.pageId));
    $('#echarts_container_line_' + me.pageId).hide();
    var barChart = echarts.init(document.getElementById('echarts_container_bar_' + me.pageId));
    $('#echarts_container_bar_' + me.pageId).hide();
    var pieChart = echarts.init(document.getElementById('echarts_container_pie_' + me.pageId));
    $('#echarts_container_pie_' + me.pageId).hide();

    function getReportGraph(lineData) {
        var report_graph = '';

        if (me.graphType == REPORT_INFO.GRAPHTYPE.FLOW_REPORT) {
            report_graph = lineData.report_new.flow_report_graph;
        } else if (me.graphType == REPORT_INFO.GRAPHTYPE.THREAT_REPORT) {
            report_graph = lineData.report_new.threat_report_graph;
        } else if (me.graphType == REPORT_INFO.GRAPHTYPE.SPHIT_REPORT) {
            report_graph = lineData.report_new.sphit_report_graph;
        }

        return report_graph;
    }

    function initLineChartCb(lineData, type) {
        if (lineData.error_code === 0) {
            var report_graph = getReportGraph(lineData);
            var series = [];
            if (report_graph.length > 0) {
                var timeArr = report_graph[0]["time"];
                var ipInfo = report_graph.slice(1);
                // 将子类型按照从大到小排序，使得legend顺序与下方top排行榜一致
                ipInfo.sort(function(a,b){
                    var key1 = Object.keys(a)[0];
                    var key2 = Object.keys(b)[0];
                    return sum(b[key2]) - sum(a[key1]);
                })

                for (var i = 0; i < ipInfo.length; i++) {
                    var ip = Object.keys(ipInfo[i])[0];
                    var ipDetail = ipInfo[i][ip];
                    var data = [];
                    for (var j = 0; j < timeArr.length; j++) {
                        var itemData = [Number(timeArr[j]), Number(ipDetail[j])];
                        data.push(itemData);
                    }
                    var obj;
                    if (type === TH_REPORT_INFO.LINE_CHART_TYPE.AREA) {
                        obj = {
                            name: ip,
                            data: data,
                            type: 'line',
                            symbol: 'circle',
                            smooth: true,
                            smoothMonotone: 'x', // 在x轴保持单调性，防止叠加图错位
                            areaStyle: {}
                        };
                    } else {
                        obj = {
                            name: ip,
                            data: data,
                            type: 'line',
                            symbol: 'circle'
                        };
                    }
                    series.push(obj)
                }
            }
            var option = {
                grid: {
                    right: '20%'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: function (params) {
                        var list = [];
                        var listItem = ''
                        var key = ''
                        var val = ''

                        if (params.length > 0){
                            var tmpTime = dateFormat('YYYY-MM-DD hh:mm:ss', new Date(parseInt(params[0].value[0])))
                            list.push(tmpTime)
                        }

                        for (var i = 0; i < params.length; i++) {
                            if (me.pageId == "flow_report"){
                                key = '流量 : ';
                                val = transfromFlow(params[i].value[1], 2);
                            } else {
                                key = '命中次数 : ';
                                val = params[i].value[1] + '次';
                            }

                            list.push('<i style="display: inline-block;width: 10px;height: 10px;background: ' + params[i].color + ';margin-right: 5px;border-radius: 50%;}"></i>' +
                                    '<span style="display:inline-block;">' + params[i].seriesName + '</span>' +
                                    '&nbsp&nbsp' + key + val)
                        }
                        listItem = list.join('<br>');
                        return '<div class="showBox">' + listItem + '</div>';
                      }
                },
                legend: {
                    type: 'plain',
                    show: true,
                    orient: 'vertical',
                    right: 0,
                    bottom: 60,
                    icon: 'rect',
                    selector: ['all'],
                    selectorLabel: {
                        align: 'left'
                    },
                    selectorPosition: 'start',
                    formatter: truncLongString,
                    tooltip: {
                        show: true
                    }
                },
                xAxis: {
                    type: 'time',
                    axisLabel: {
                        formatter: function(value, index) {
                            var tmpTime = new Date(parseInt(value));
                            return tmpTime.format('yyyy-MM-dd hh:mm:ss');
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: function(value, index) {
                            if (me.pageId == "flow_report"){
                                return transfromFlow(value, 2);
                            }
                            else{
                                return value + '次';
                            }
                        }
                   }
                },
                series: series,
                color: palette
            };

            if (type === TH_REPORT_INFO.LINE_CHART_TYPE.AREA) {
                if (isEmptyVar(ipInfo)){
                    areaChart.setOption(emptyOption, true);
                } else {
                    areaChart.setOption(option, true);
                }
            } else {
                if (isEmptyVar(ipInfo)){
                    lineChart.setOption(emptyOption, true);
                } else {
                    lineChart.setOption(option, true);
                }
            }
        }
    }
    // 叠加图、折线图
    function initLineChart(type) {
        getGraphProxyData('trend', TH_REPORT_INFO.CHART_TYPE.LINE_CHART, type);
    }

    function initBarChartCb(barData) {
        if (barData.error_code === 0) {
            var sort_content = $("input.chart-data" + me.pageId).radio('getValue');
            var condition = CURRENT_CONDITION.substr(CURRENT_CONDITION.indexOf("_") + 1);

            var report_graph = getReportGraph(barData);
            var categoryData = report_graph[0][condition];
            var seriesData = report_graph[1][sort_content];

            // 翻转后，与下方grid顺序保持一致
            categoryData.reverse();
            seriesData.reverse();

            var bar_name = '';
            if (me.graphType == REPORT_INFO.GRAPHTYPE.FLOW_REPORT) {
                bar_name = '流量';
            } else if (me.graphType == REPORT_INFO.GRAPHTYPE.SPHIT_REPORT) {
                bar_name = '策略命中次数';
            } else if (me.graphType == REPORT_INFO.GRAPHTYPE.THREAT_REPORT) {
                bar_name = '威胁次数';
            }

            var option = {
                grid: {
                    left: '15%'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter : function(params, ticket, callback) {
                        var key = '';
                        var val = '';

                        if (me.pageId == "flow_report"){
                            key = '流量';
                            val = transfromFlow(params[0].value, 2);
                        } else {
                            key = '命中次数'
                            val = params[0].value + "次";
                        }

                        return  params[0].name + "  " + key + " : " + val;
                    }
                },
                legend: {
                    type: 'plain',
                    show: true,
                    orient: 'vertical',
                    right: 0,
                    top: 60,
                    icon: 'rect',
                    selectorPosition: 'start'
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        show: true
                    },
                    axisLabel: {
                        formatter: function(value, index) {
                            if (me.pageId == "flow_report"){
                                return transfromFlow(value, 2);
                            }
                            else{
                                return value + '次';
                            }
                        }
                   }
                },
                yAxis: {
                    type: 'category',
                    data: categoryData,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        formatter: function(value, index) {
                            return truncLongString(value);
                        }
                   }
                },
                series: [{
                    name: bar_name,
                    barWidth: '40%',
                    type: 'bar',
                    data: seriesData,
                    itemStyle: {
                        color: '#8bc34a'
                    }
                }]
            };

            if (isEmptyVar(categoryData)){
                barChart.setOption(emptyOption, true);
            }
            else{
                barChart.setOption(option, true);
            }
        }
    }
    // 柱状图
    function initBarChart() {
        getGraphProxyData('sum', TH_REPORT_INFO.CHART_TYPE.BAR_CHART, '');
    }

    function initPieChartCb(pieData) {
        if (pieData.error_code === 0) {
            var sort_content = $("input.chart-data" + me.pageId).radio('getValue');
            var condition = CURRENT_CONDITION.substr(CURRENT_CONDITION.indexOf("_") + 1);
            var report_graph = getReportGraph(pieData);
            var legendData = report_graph[0][condition];
            var seriesData = report_graph[1][sort_content];
            var pieSeriesData = [];
            for (var i = 0; i < seriesData.length; i++) {
            var obj = {
                name: legendData[i],
                value: seriesData[i]
            };
                pieSeriesData.push(obj);
            }

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var key = '';
                        var val = '';

                        if (me.pageId == "flow_report"){
                            key = '流量';
                            val = transfromFlow(params.value, 2);
                        } else {
                            key = '命中次数';
                            val = params.value + "次";
                        }

                        return  params.name + "  " + key + " : " + val + " (" + params.percent.toFixed(2) + "%)";
                    }
                },
                legend: {
                    type: 'plain',
                    show: true,
                    orient: 'vertical',
                    right: 0,
                    top: 60,
                    icon: 'rect',
                    selector: ['all'],
                    selectorLabel: {
                        align: 'left'
                    },
                    selectorPosition: 'start',
                    data: legendData,
                    formatter: truncLongString,
                    tooltip: {
                        show: true
                    }
                },
                series: [{
                    name: 'IP',
                    type: 'pie',
                    radius: '75%',
                    center: ['40%', '50%'],
                    data: pieSeriesData,
                    label: {
                        formatter: function (params) {
                            return truncLongStringWithLen(params.name + " : " + "[" + params.percent.toFixed(2) + "%]", 200);
                        },
                        opacity: 1,
                        color: '#000',
                        alignTo: 'labelLine'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    minAngle: 6,           　　  //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
                    avoidLabelOverlap: true     //是否启用防止标签重叠策略
                }],
                color: palette
            };

            if (isEmptyVar(legendData)){
                pieChart.setOption(emptyOption, true);
            } else {
                pieChart.setOption(option, true);
            }
        }
    }
    // 饼图
    function initPieChart() {
        getGraphProxyData('sum', TH_REPORT_INFO.CHART_TYPE.PIE_CHART, '');
    }

    // top grid
    me.grid.store.parseKey.getFilter = function() {
        var sort_content = $("input.chart-data" + me.pageId).radio('getValue');

        return {
            "start_time": START_TIME,
            "end_time": END_TIME,
            "report_table": CURRENT_CONDITION,
            "sort_content": sort_content
        };
    };

    var topGrid = $('.report-grid-area-' + me.pageId).grid({
        store: me.grid.store,
        columns: me.grid.columns,
        paging_true: {},
        autoRefresh: true
    });
};