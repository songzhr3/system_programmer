(function($){

$.su.Widget("comboSelector", {
    defaults: {
        combo: '',   // grid组合筛选
        chosen: 'catalogue_apps',  // 已选的应用
        gridParams:{},
        title: '应用选择器'
    },
    create: function(defaults, options) {
        var me = this;
        $.extend(this, defaults, options);
        me.each(function(i, obj){
            $.extend(obj, defaults, options);
        });

        var inHTML='<div id="comboSelector_inner_dialog"></div>';
        $(this).append($(inHTML));

        //TODO 检测入参
        var dialogElement=$('#comboSelector_inner_dialog');

        dialogElement.dialog({
            content:'<div id="comboSelector_inner_grid"></div>',
            width:'1000px',
            height:'85%',
            top:'50px',
            overflow: 'auto',
            dialogFooterCss: {
                position: 'static',
                float: 'right'
            },
            title: '应用选择器'
        }).on('onConfirmClick', function(){
            var gridElement=$('#comboSelector_inner_grid');
            var list=gridElement.grid('getAllPagesSelect');
            me.trigger("ev_comboSelectorConfirm",[list]);//确定时向外部发射选中的list
            $('#comboSelector_inner_dialog').dialog('hide');
        }).on('hide', function(){
            var gridElement=$('#comboSelector_inner_grid');
            gridElement.grid('clearAllPagesSelect');//关闭时清空选中的条目
            me.trigger("ev_comboSelectorCancel");//取消修改
            $('#comboSelector_inner_dialog').dialog('hide');
        })

        var gridElement=$('#comboSelector_inner_grid');
        this.gridParams.combo=this.combo;
        gridElement.grid(this.gridParams);
        return me;
    },
    show: function(me, arg){
        $('#comboSelector_inner_dialog').dialog('show');
        var gridElement=$('#comboSelector_inner_grid');
        gridElement.grid('initAllPagesSelect',arg[1]);//通过参数inputList初始化表格选中的条目
        return this;
    },
    hide: function(me, arguments){
        $('#comboSelector_inner_dialog').dialog('hide');
        return this;
    },
});

})(jQuery);
