//ajax请求
define("WebFilter/data-ajax-debug", [ "./ui-hoverBgColor-debug", "./ui-fixHead-debug" ], function(require, exports, module) {
    function init(URL) {
        $.ajax({
            async: true,
            context: document.body,
            url: URL,
            beforeSend: function() {
                var oLoading = $('<div id="ZlgLoading2" class="zlg-loading"></div>');
                $("#ZlgResult").append(oLoading);
            },
            error: function() {
                alert("╮(╯﹏╰)╭网络故障,数据请求失败！");
            },
            success: function(result) {
                $("#ZlgLoading2").remove();
                $("#ZlgResult").html(result);
                require("./ui-hoverBgColor-debug").init("#SelectTable", "td-hover-bg");
                require("./ui-fixHead-debug").init("#SelectTable", true);
            }
        });
    }
    exports.init = init;
});