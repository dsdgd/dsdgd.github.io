//重置所有参数
define("js/WebFilter/ui-reset", [ "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead", "./data-getKeyWord" ], function(require, exports, moudle) {
    function init(obj, config, Json, url) {
        if (url) {
            //全部重置
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
                require("./data-ajax").init(url, config);
            });
        } else {
            //单个重置
            $(obj).click(function() {
                $(this).parent().next().find(".zlg-slider").each(function() {
                    //input重置
                    $(this).children(":first").val($(this).children(":first").attr("data-initnum"));
                    $(this).children(":last").val($(this).children(":last").attr("data-initnum"));
                });
                $(this).parent().next().find(".zlg-range").each(function() {
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
                $(this).parent().next().find(".zlg-btns-data").each(function() {
                    //单选框重置
                    $(this).find(":checkbox").prop({
                        checked: false
                    });
                });
                $(this).parent().next().find(".zlg-more-btns").each(function() {
                    //单选按钮重置
                    $(this).find(":checkbox").prop({
                        checked: false
                    });
                });
                $(this).parent().next().find(".zlg-btns-chosen").each(function() {
                    //单选框重置
                    $(this).attr("title", "更多筛选参数");
                    $(this).children().html("更多筛选参数");
                    $(this).children().removeClass("chosen-filter-color");
                });
                url = require("./data-getKeyWord").init(Json, config);
                require("./data-ajax").init(url, config);
            });
        }
    }
    exports.init = init;
});