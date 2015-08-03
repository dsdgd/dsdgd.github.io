//展现部分关键词
define("WebFilter/ui-moreKey-debug", [ "./data-getKeyWord-debug", "./data-ajax-debug", "./ui-hoverBgColor-debug", "./ui-fixHead-debug" ], function(require, exports, module) {
    function ui(Json, url) {
        //展现部分关键词
        var iMaxKey = 4;
        $(".zlg-screen-cont").each(function() {
            if ($(this).find("dd:first").children().size() < 2 && $(this).find("dd:first").find(".zlg-btns").size() > 0) {
                var sTmp1 = $('<div class="zlg-more-btns fl" data-name="' + $(this).find("dt:first").attr("data-name") + '"></div>');
                var sTmp2 = $('<ul class="clearFix"></ul');
                var sTmp3 = null;
                for (var i = 0; i < iMaxKey; i++) {
                    sTmp3 = $(this).find("dd:first").find(".zlg-btns .zlg-btns-data ul:first").children(":first").clone();
                    $(this).find("dd:first").find(".zlg-btns .zlg-btns-data ul:first").children(":first").remove();
                    sTmp2.append(sTmp3);
                }
                sTmp1.append(sTmp2);
                $(this).find("dd:first").prepend(sTmp1);
            }
        });
        $(".zlg-btns-data").each(function(i) {
            if ($(this).find("dd ul li").size() == 0) {
                $(this).parent().remove();
            }
        });
        $(".zlg-more-btns input:checkbox").click(function() {
            var sUrl = require("./data-getKeyWord-debug").init(Json);
            sUrl = encodeURI(sUrl);
            require("./data-ajax-debug").init(url + "?" + sUrl);
        });
    }
    exports.ui = ui;
});