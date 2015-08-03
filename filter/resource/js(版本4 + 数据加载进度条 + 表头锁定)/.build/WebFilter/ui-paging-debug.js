//分页
define("WebFilter/ui-paging-debug", [], function(require, exports, module) {
    function init(Json, URL, config) {
        var iMaxCount = Json["Count"];
        //分页总数
        var iPageSize = config["pagesize"];
        //单页数据量
        var iNowSize = Json["Rows"].length;
        //当前记录量
        var iNowIndex = Json["Index"];
        //当前页码
        var iMaxNum = 10;
        //最大页码按钮量
        var sBtn = "";
        //存放页码按钮html
        $("#ZlgPageInfo").find("strong:first").html(iNowIndex + 1);
        $("#ZlgPageInfo").find("strong:last").html(iMaxCount);
        for (var i = 0; i < iMaxCount + 4; i++) {
            switch (i) {
              case 0:
                sBtn += '<span data-index="first">首页</span>';
                break;

              case 1:
                sBtn += '<span class="zlg-page-list-hide" data-index="prev">上一页</span>';
                break;

              case 2:
                sBtn += '<span class="zlg-page-list-active" data-index="1">' + (i - 1) + "</span>";
                break;

              case iMaxCount + 2:
                sBtn += '<span data-index="next">下一页</span>';
                break;

              case iMaxCount + 3:
                sBtn += '<span data-index="last">末页</span>';
                break;

              default:
                sBtn += '<span data-index="' + (i - 1) + '">' + (i - 1) + "</span>";
                break;
            }
        }
        $("#ZlgPageList").html(sBtn);
    }
    exports.init = init;
});