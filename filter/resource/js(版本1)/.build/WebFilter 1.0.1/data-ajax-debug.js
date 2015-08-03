//ajax请求
define("WebFilter/data-ajax-debug", [ "./ui-hoverBgColor-debug", "./ui-fixHead-debug" ], function(require, exports, module) {
    function init(URL) {
        $.ajax({
            async: true,
            context: document.body,
            url: URL,
            beforeSend: function() {
                var oLoading = $('<div id="ZlgLoading2" class="zlg-loading"></div>');
                $("#ZlgResult").html(oLoading);
            },
            error: function() {
                alert("╮(╯﹏╰)╭网络故障,数据请求失败！");
            },
            success: function(result) {
                $("#ZlgLoading2").remove();
                var result = $(result);
                var iMax = result.children().children().size() - 1;
                var aRm = [];
                result.children().children(":first").children().each(function(i) {
                    var obj = $(this).parent().siblings();
                    var sum = 0;
                    obj.each(function() {
                        var o = $(this).children().eq(i).text();
                        var oReg = /[\n\r]/g;
                        if (o == "0" || o == "-" || o == " " || o == "") {
                            sum++;
                        } else if (o.search(oReg) != "-1") {
                            sum++;
                        }
                    });
                    if (sum == iMax) {
                        aRm.push(i);
                    }
                });
                $(aRm).each(function(i) {
                    result.children(":first").children().each(function() {
                        $(this).children().each(function(j) {
                            if (aRm[i] - i == j) {
                                $(this).remove();
                            }
                        });
                    });
                });
                $("#ZlgResult").html(result);
                require("./ui-hoverBgColor-debug").init("#SelectTable", "td-hover-bg");
                require("./ui-fixHead-debug").init("#SelectTable", true);
            }
        });
    }
    exports.init = init;
});