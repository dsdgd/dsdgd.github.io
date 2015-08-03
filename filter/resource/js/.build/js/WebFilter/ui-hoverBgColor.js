//表格hover背景事件
define("js/WebFilter/ui-hoverBgColor", [], function(require, exports, moudle) {
    function init(obj, hoverClass) {
        var iIndex1 = 0;
        var iIndex2 = 0;
        $(obj).find("td").hover(function() {
            iIndex1 = $(this).index();
            $(this).siblings().addClass(hoverClass);
            $(obj).find("tr").each(function() {
                $(this).find("td").eq(iIndex1).addClass(hoverClass);
            });
        }, function() {
            $(this).siblings().removeClass(hoverClass);
            $(obj).find("tr").each(function() {
                $(this).find("td").eq(iIndex1).removeClass(hoverClass);
            });
        });
    }
    exports.init = init;
});