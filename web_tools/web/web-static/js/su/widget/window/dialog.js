(function($){

$.su.Widget("dialog", {
    defaults: {
        content:'请传入content',
        title:'请传入title',
        width:'400px',
        height:'400px',
        top:'25%'
    },
    create: function(defaults, options){
        var me=this;
        $.extend(this, defaults, options);//把defaults和options赋值给this
        var inHTML='';
        inHTML +='<div class="dialog">';
        inHTML +=   '<div class="dialog-title"><span>'+this._title+'</span><span class="dialog-close-bt">×</span></div>';
        inHTML +=   '<div class="dialog-content">'+this.content+'</div>';
        inHTML +=   '<div class="dialog-footer">';
        inHTML +=       '<button class="dialog-confirm-bt">确定</button>';
        inHTML +=       '<button class="dialog-cancel-bt">取消</button>';
        inHTML +=   '</div>';
        inHTML +='</div>';
        $(this).append($(inHTML)).css({
            "display": "none",
        });
        $(this).find('.dialog').css({
            'width': this.width,
            'height':this.height,
            'top':this.top,
            'overflow': this.overflow || 'visible'
        });
        if (this.dialogFooterCss) {
            $(this).find('.dialog-footer').css(this.dialogFooterCss);
        }
        $(this).find('.dialog-close-bt').click(function(){
            me.trigger("hide");
            me.dialog("hide");
        });
        $(this).find('.dialog-confirm-bt').click(function(){
            me.trigger("onConfirmClick");
            me.dialog("hide");
        });
        $(this).find('.dialog-cancel-bt').click(function(){
            me.trigger("hide");
            me.dialog("hide");
        });
        return me;
    },
    show:function(me, arguments){
        var dialog=$(this).find('.dialog');
        setDialogLeft(dialog);
        $(this).css({
            "display":'block'
        });
        $.su.mask.show();
        $("#comboSelector_inner_grid").grid.calculateTdWidth("comboSelector_inner_grid");
        return this;
    },
    hide: function(me, arguments){
        $(this).css({
            "display":"none",
        });
        $.su.mask.hide();
        return this;
    },
});

})(jQuery);

$(window).resize(function(e) {
    var dialog=$('.dialog:visible');
    if(dialog.length!==0){
        setDialogLeft(dialog);
    }
});

function setDialogLeft(dialog){
    var windowWidth=$(window).innerWidth();
    var dialogWidth=dialog.css('width');
    if(typeof dialogWidth!=='undefined'){
        dialogWidth=dialogWidth.replace('px','')
        var left=(windowWidth-dialogWidth-20)/2;
        if(left<=10){
            left=10;
        }
        dialog.css('left',left+'px');//20是padding
    }
}
