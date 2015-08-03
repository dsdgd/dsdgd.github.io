//展开收起筛选参数
define("WebFilter/ui-toggle-debug", [], function(require, exports, module) {
    function ui() {
        var iSize = $("#ZlgScreenMain").children().size();
        var sBeforeH = $("#ZlgScreenMain").height();
        var sAfterH = ($("#ZlgScreenMain").children(":first-child").outerHeight(true) + 1) * iSize;
        $("#ZlgToggle").click(function() {
            if ($(this).attr("data-toggle") == "show") {
                //展开
                $(this).attr("data-toggle", "hide").text("收起部分选项");
                $("#ZlgScreenMain").animate({
                    height: sAfterH + "px"
                });
            } else {
                //收起
                $(this).attr("data-toggle", "show").text("显示全部选项");
                $("#ZlgScreenMain").animate({
                    height: sBeforeH + "px"
                });
            }
        });
    }
    exports.ui = ui;
});