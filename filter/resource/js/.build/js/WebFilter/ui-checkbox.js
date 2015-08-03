//筛选按钮事件
define("js/WebFilter/ui-checkbox", [ "./data-getKeyWord", "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(oParent, oChild, oBtn, oSelect, Json, config) {
        //参数展开、收起
        $(oParent).click(function(e) {
            var iT = $("#ZlgScreenMain").offset().top;
            var iB = $("#ZlgToggle").offset().top;
            var iO = $(oParent).offset().top;
            if (iO - iT < iB - iO) {
                //定位
                $(oChild).css("top", "-4px");
            } else {
                $(oChild).css("top", "");
            }
            $(oChild).toggle();
            e.stopPropagation();
        });
        $(oChild).click(function(e) {
            e.stopPropagation();
        });
        $(oBtn).click(function() {
            var sVal = "";
            $(oChild).hide();
            $(oChild).find("dd input[type=checkbox]").each(function() {
                if ($(this).prop("checked")) {
                    sVal += $(this).parent().attr("title") + ",";
                }
            });
            sVal = sVal.substring(0, sVal.length - 1);
            if (sVal.length > 0) {
                $(oParent).attr("title", sVal);
                $(oParent).children().html(sVal);
                $(oParent).children().addClass("chosen-filter-color");
            } else {
                $(oParent).attr("title", "更多筛选参数");
                $(oParent).children().html("更多筛选参数");
                $(oParent).children().removeClass("chosen-filter-color");
            }
            //这里需要提交一次Ajax
            var sUrl = require("./data-getKeyWord").init(Json, config);
            require("./data-ajax").init(sUrl, config);
        });
        $("body").click(function() {
            if ($(oChild).css("display") == "block") {
                $(oChild).hide();
            }
        });
        //checkbox全选、反选
        $(oSelect).click(function() {
            if ($(this).prop("checked")) {
                $(this).next("span").html("反选");
                $(oChild).find("dd input[type=checkbox]").prop({
                    checked: true
                });
            } else {
                $(this).next("span").html("全选");
                $(oChild).find("dd input[type=checkbox]").prop({
                    checked: false
                });
            }
        });
    }
    exports.ui = ui;
});