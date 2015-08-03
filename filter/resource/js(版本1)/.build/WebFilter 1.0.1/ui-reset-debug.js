//重置所有参数
define("WebFilter/ui-reset-debug", [ "./data-ajax-debug", "./ui-hoverBgColor-debug", "./ui-fixHead-debug" ], function(require, exports, moudle) {
    function init(obj, url) {
        $(obj).click(function() {
            $(".zlg-slider").each(function() {
                //input重置
                $(this).children(":first").val($(this).children(":first").attr("data-initnum"));
                $(this).children(":last").val($(this).children(":last").attr("data-initnum"));
            });
            $(".zlg-range").each(function() {
                //拖拽条重置
                $(this).children(":first").css({
                    left: "0%",
                    width: "100%"
                });
                $(this).children(":eq(1)").css({
                    left: "0%"
                });
                $(this).children(":last").css({
                    left: "100%"
                });
            });
            $(".zlg-btns-data").each(function() {
                //单选框重置
                $(this).find(":checkbox").prop({
                    checked: false
                });
            });
            $(".zlg-more-btns").each(function() {
                //单选按钮重置
                $(this).find(":checkbox").prop({
                    checked: false
                });
            });
            $(".zlg-btns-chosen").each(function() {
                //单选框重置
                $(this).attr("title", "更多筛选参数");
                $(this).children().html("更多筛选参数");
                $(this).children().removeClass("chosen-filter-color");
            });
            require("./data-ajax-debug").init(url);
        });
    }
    exports.init = init;
});