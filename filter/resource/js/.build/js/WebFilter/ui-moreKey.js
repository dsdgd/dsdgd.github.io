//展现部分关键词
define("js/WebFilter/ui-moreKey", [ "./data-getKeyWord", "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(Json, config) {
        //展现部分关键词
        var iMaxKey = 4;
        $(".zlg-screen-cont").each(function() {
            if ($(this).find("dd:first").children().size() < 2 && $(this).find("dd:first").find(".zlg-btns").size() > 0) {
                var sTmp1 = $('<div class="zlg-more-btns fl" data-name="' + $(this).find("dt:first").attr("data-name") + '"></div>');
                var sTmp2 = $('<ul class="clearFix"></ul');
                var sTmp3 = null;
                for (var i = 0; i < iMaxKey; i++) {
                    sTmp3 = $(this).find("dd:first").find(".zlg-btns-data").children(":first").clone();
                    $(this).find("dd:first").find(".zlg-btns-data").children(":first").remove();
                    sTmp2.append(sTmp3);
                }
                sTmp1.append(sTmp2);
                $(this).find("dd:first").prepend(sTmp1);
            }
        });
        $(".zlg-btns-data").each(function(i) {
            if ($(this).find("li").size() == 0) {
                $(this).parent().remove();
            }
        });
        $(".zlg-more-btns input:checkbox, .zlg-btns-data input:checkbox").click(function() {
            var sUrl = require("./data-getKeyWord").init(Json, config);
            require("./data-ajax").init(sUrl, config);
        });
    }
    exports.ui = ui;
});