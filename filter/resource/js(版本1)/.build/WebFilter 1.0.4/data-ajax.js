//ajax请求
define("WebFilter/data-ajax", [ "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
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
                /**去除0与空**/
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
                /**去除0与空 end**/
                var iMaxNum = result.children().children().size();
                var iMaxPage = 20;
                //当页最大记录数
                var iPageSize = Math.ceil(iMaxNum / iMaxPage);
                //总页数
                var aPageData = [];
                //存放分页数据
                var iPageNow = 1;
                //当前页码
                var oHtml = result;
                var oResultHead = result.children().children(":first");
                for (var i = 0; i < iPageSize; i++) {
                    var aTmp = [];
                    var oTmp = null;
                    for (var j = iMaxPage * i; j < iMaxPage * (i + 1); j++) {
                        if (j + 2 > iMaxNum) {
                            break;
                        }
                        oTmp = result.children().children().eq(j + 1);
                        aTmp.push(oTmp);
                    }
                    aPageData.push(aTmp);
                }
                $("#ZlgPageInfo").find("strong:first").html(iPageNow);
                $("#ZlgPageInfo").find("strong:last").html(iPageSize);
                var sBtn = "";
                //存放页码按钮html
                for (var i = 0; i < iPageSize + 4; i++) {
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

                      case iPageSize + 2:
                        sBtn += '<span data-index="next">下一页</span>';
                        break;

                      case iPageSize + 3:
                        sBtn += '<span data-index="last">末页</span>';
                        break;

                      default:
                        sBtn += '<span data-index="' + (i - 1) + '">' + (i - 1) + "</span>";
                        break;
                    }
                }
                addHtml(iPageNow);
                $("#ZlgPageList").html(sBtn);
                $("#ZlgPageList").children().bind("click", function() {
                    //分页点击事件
                    var sIndex = $(this).attr("data-index");
                    if (sIndex == "next") {
                        iPageNow < iPageSize ? iPageNow++ : iPageNow = iPageSize;
                    } else if (sIndex == "prev") {
                        iPageNow > 1 ? iPageNow-- : iPageNow = 1;
                    } else if (sIndex == "first") {
                        iPageNow = 1;
                    } else if (sIndex == "last") {
                        iPageNow = iPageSize;
                    } else {
                        iPageNow = sIndex;
                    }
                    iPageNow = Number(iPageNow);
                    $("#ZlgPageInfo").find("strong:first").html(iPageNow);
                    $("#ZlgPageList").find("span").removeClass("zlg-page-list-active");
                    $("#ZlgPageList").find("span").removeClass("zlg-page-list-hide");
                    $("#ZlgPageList").find("span").eq(iPageNow + 1).addClass("zlg-page-list-active");
                    if (iPageNow == 1) {
                        $("#ZlgPageList").find("span").eq(iPageNow).addClass("zlg-page-list-hide");
                    } else if (iPageNow == iPageSize) {
                        $("#ZlgPageList").find("span").eq(iPageNow + 2).addClass("zlg-page-list-hide");
                    }
                    addHtml(iPageNow);
                });
                function addHtml(index) {
                    //生成html
                    oHtml.children(":first").remove();
                    oHtml.append(oResultHead, aPageData[index - 1]);
                    $("#ZlgResult").html(oHtml);
                    require("./ui-hoverBgColor").init("#SelectTable", "td-hover-bg");
                    require("./ui-fixHead").init("#SelectTable", true);
                }
            }
        });
    }
    exports.init = init;
});