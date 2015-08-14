//筛选按钮事件
define("js/WebFilter/ui-checkbox-debug", [], function(require, exports, module) {
    function ui(oParent, oChild, Json, config) {
        var bStatus = false;
        //收起
        var iPH = 0;
        //参数展开、收起
        $(oParent).click(function(e) {
            //------------------------------------------今天写到展开收起
            bStatus = !bStatus;
            var iH = $(oChild).innerHeight();
            var iHp = 0;
            var sText = "";
            if (bStatus) {
                iHp = $(this).parent().parent().innerHeight() + iH;
                sText = "收起";
                iPH = $("#ZlgScreenMain").outerHeight() + iH;
            } else {
                iHp = $(this).parent().parent().innerHeight() - iH;
                sText = "更多";
                iPH = $("#ZlgScreenMain").outerHeight() - iH;
            }
            $(this).parent().parent().animate({
                height: iHp + "px"
            });
            $("#ZlgScreenMain").animate({
                height: iPH + "px"
            });
            $(oChild).toggle();
            $(oParent).html(sText);
            e.stopPropagation();
        });
        $(oChild).click(function(e) {
            e.stopPropagation();
        });
    }
    exports.ui = ui;
});