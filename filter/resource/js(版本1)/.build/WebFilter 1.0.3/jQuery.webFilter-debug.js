//初始化
define("WebFilter/jQuery.webFilter-debug", [ "./data-processing-debug", "./ui-screening-debug", "./ui-slider-debug", "./data-getKeyWord-debug", "./data-ajax-debug", "./ui-hoverBgColor-debug", "./ui-fixHead-debug", "./ui-checkbox-debug", "./ui-moreKey-debug", "./ui-toggle-debug", "./ui-reset-debug" ], function(require, exports, module) {
    function init(url, ifShow, sOrderBy) {
        /***************************************************
*
*			网站选型表插件
*				【参数说明】:
*				url:选型表头请求地址
*				ifShow:选型表筛选参数区是否显示!
*				sOrderBy:选型表筛选参数排序
*
***************************************************/
        jQuery(document).ready(function() {
            var sData = encodeURI("IsAjax=true&Labels=选型表表头Json&String");
            var aOrderBy = sOrderBy.split(",");
            $.ajax({
                async: true,
                context: document.body,
                url: url,
                data: sData,
                dataType: "text",
                beforeSend: function() {
                    var oLoading = $('<div id="ZlgLoading1" class="zlg-loading"></div>');
                    $("#ZlgScreenMain").append(oLoading);
                    if (ifShow == "隐藏选型表") {
                        $(".zlg-screening").hide();
                    }
                },
                error: function() {
                    alert("╮(╯﹏╰)╭网络故障,数据请求失败！");
                },
                success: function(Json) {
                    $("#ZlgLoading1").remove();
                    //解析筛选数据
                    var oJson = require("./data-processing-debug").initResult(Json);
                    //生成筛选数据UI
                    require("./ui-screening-debug").ui(oJson, url, aOrderBy);
                    require("./ui-toggle-debug").ui();
                    //发送表头数据请求
                    var sUrl = url + "?tName=" + oJson["title"]["TableName"] + "&filter=&IsAjax=true&Labels=商品综合信息列表Table";
                    sUrl = encodeURI(sUrl);
                    require("./data-ajax-debug").init(sUrl);
                    //重置UI
                    require("./ui-reset-debug").init("#ZlgReset", sUrl);
                }
            });
        });
    }
    exports.init = init;
});

/***************************************************
*
*			通用函数
*
***************************************************/
Array.prototype.unique = function() {
    //数组去重
    var n = {}, r = [];
    for (var i = 0; i < this.length; i++) {
        if (!n[this[i]]) {
            n[this[i]] = true;
            r.push(this[i]);
        }
    }
    return r;
};

function findIndex(arr, num) {
    //查询数组中最接近目标数字的数字下标
    var iLen = arr.length - 1;
    var aTmp1 = Math.abs(num - arr[0]);
    var aTmp2 = 0;
    var iRes = 0;
    for (var i = 0; i < iLen; i++) {
        aTmp2 = Math.abs(num - arr[i + 1]);
        if (aTmp1 >= aTmp2) {
            //min aTmp2
            aTmp1 = aTmp2;
            iRes = i + 1;
        }
    }
    return iRes;
}