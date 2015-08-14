//展开收起筛选参数
define("js/WebFilter/ui-toggle", [], function(require, exports, module) {
    function ui() {
        var iSize = 5;
        //默认显示个数
        $("#ZlgToggle").click(function() {
            if ($(this).attr("data-toggle") == "show") {
                //展开
                var sAfterH = 0;
                $("#ZlgScreenMain").children().each(function() {
                    sAfterH += $(this).outerHeight(true);
                });
                $(this).attr("data-toggle", "hide").text("收起部分选项");
                $("#ZlgScreenMain").animate({
                    height: sAfterH + "px"
                });
            } else {
                //收起
                var sBeforeH = 0;
                $("#ZlgScreenMain").children().each(function(i) {
                    i < iSize ? sBeforeH += $(this).outerHeight(true) : false;
                });
                $(this).attr("data-toggle", "show").text("显示全部选项");
                $("#ZlgScreenMain").animate({
                    height: sBeforeH + "px"
                });
            }
        });
    }
    exports.ui = ui;
});