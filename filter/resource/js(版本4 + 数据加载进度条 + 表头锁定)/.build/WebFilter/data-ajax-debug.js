//ajax请求
define("WebFilter/data-ajax-debug", [ "./data-processing-debug", "./ui-hoverBgColor-debug", "./ui-fixHead-debug" ], function(require, exports, module) {
    function init(URL, config) {
        $.ajax({
            async: true,
            context: document.body,
            url: URL,
            dataType: "text",
            beforeSend: function() {
                var oLoading = $('<div id="ZlgLoading2" class="zlg-loading zlg-loading-bgcolor"></div>');
                $("#ZlgResult").append(oLoading);
            },
            error: function() {
                alert("网络故障,表格数据请求失败！");
            },
            success: function(result) {
                $("#ZlgLoading2").remove();
                result = eval("(" + result + ")");
                var oJson = require("./data-processing-debug").init(result, false, config);
                var sTmp1 = "", sTmp2 = "";
                //暂存，拼接字符串
                var iLen1 = oJson["Rows"].length;
                var iLen2 = oJson["Item"].length;
                var iLen3 = oJson["Param"].length;
                var iLen4 = config["tabKey"].length;
                if (iLen1 == 0) {
                    $("#ZlgResult").html('<div class="zlg-not-found">找不到相关数据</div>');
                    $("#ZlgPageInfo").html("");
                    $("#ZlgPageList").html("");
                    return;
                }
                for (var i = -1; i < iLen1; i++) {
                    //拼接表格html
                    if (i < 0) {
                        //表头
                        for (var j = -1; j < iLen3; j++) {
                            if (j < 0) {
                                var sTd = "<td>产品名称</td>";
                                sTmp1 += sTd;
                            } else {
                                for (var k = 0; k < iLen4; k++) {
                                    if (oJson["Param"][j] == config["tabKey"][k]) {
                                        var sTd = "<td>" + config["tabTitle"][k] + "</td>";
                                        sTmp1 += sTd;
                                    }
                                }
                            }
                        }
                        sTmp2 += "<tr>" + sTmp1 + "</tr>";
                        sTmp1 = "";
                    } else {
                        //表格
                        var iLen = oJson["Rows"][i].length;
                        for (var j = -1; j < iLen; j++) {
                            if (j < 0) {
                                var sTd = "<td>" + oJson["Item"][i] + "</td>";
                                sTmp1 += sTd;
                            } else {
                                var sTd = "<td>" + oJson["Rows"][i][j] + "</td>";
                                sTmp1 += sTd;
                            }
                        }
                        sTmp2 += "<tr>" + sTmp1 + "</tr>";
                        sTmp1 = "";
                    }
                }
                var sTab = '<table id="SelectTable">' + sTmp2 + "</table>";
                /**去除0与空**/
                var result = $(sTab);
                var iMax = result.children().children().size();
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
                    if (sum == iMax - 1) {
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
                var aRes = [];
                //存放 result.children().children() 数据;
                var aTmp = [];
                //暂存
                var iOnce = 10;
                //每次生成的数据量
                var oAfterTimer = null;
                for (var i = 0; i < iMax; i++) {
                    //分割Dom片段
                    if (i != 0 && i % iOnce == 0 && i < iMax - 1) {
                        aRes.push(aTmp);
                        aTmp = [];
                        aTmp.push(result.children().children().eq(i).clone());
                    } else if (i == iMax - 1) {
                        aRes.push(aTmp);
                        aTmp = [];
                        aTmp.push(result.children().children().eq(i).clone());
                        aRes.push(aTmp);
                    } else {
                        aTmp.push(result.children().children().eq(i).clone());
                    }
                }
                result.children().html("");
                $("#ZlgResult").html(result);
                var iLen = aRes.length;
                var iResIndex = 0;
                var iPer = 0;
                clearInterval(oAfterTimer);
                $("#ZlgPer").css("opacity", 1);
                $("#ZlgPer").children(":first").css("width", iPer + "%");
                oAfterTimer = setInterval(function() {
                    if (iResIndex == iLen) {
                        clearInterval(oAfterTimer);
                        $("#ZlgPer").animate({
                            opacity: 0
                        });
                        page(oJson, URL, config);
                        //分页
                        setTimeout(function() {
                            require("./ui-hoverBgColor-debug").init("#SelectTable", "td-hover-bg");
                            require("./ui-fixHead-debug").init("#SelectTable", {
                                L: true,
                                T: true
                            }, "#ZlgResult");
                        }, 300);
                    } else {
                        $(result).append(aRes[iResIndex]);
                        iPer = iResIndex / (iLen - 1) * 100;
                        $("#ZlgPer div:eq(0)").animate({
                            width: iPer + "%"
                        });
                    }
                    iResIndex++;
                }, 500);
            }
        });
    }
    function page(Json, URL, config) {
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
            //拼接页面html
            switch (i) {
              case 0:
                iNowIndex + 1 == 1 ? sBtn += '<span data-index="first" class="zlg-page-list-hide">首页</span>' : sBtn += '<span data-index="first">首页</span>';
                break;

              case 1:
                iNowIndex + 1 == 1 ? sBtn += '<span data-index="prev" class="zlg-page-list-hide">上一页</span>' : sBtn += '<span data-index="prev">上一页</span>';
                break;

              case iMaxCount + 2:
                iNowIndex + 1 == iMaxCount ? sBtn += '<span data-index="next" class="zlg-page-list-hide">下一页</span>' : sBtn += '<span data-index="next">下一页</span>';
                break;

              case iMaxCount + 3:
                iNowIndex + 1 == iMaxCount ? sBtn += '<span data-index="last" class="zlg-page-list-hide">末页</span>' : sBtn += '<span data-index="last">末页</span>';
                break;

              default:
                iNowIndex + 1 == i - 1 ? sBtn += '<span data-index="' + (i - 1) + '" class="zlg-page-list-active">' + (i - 1) + "</span>" : sBtn += '<span data-index="' + (i - 1) + '">' + (i - 1) + "</span>";
                break;
            }
        }
        $("#ZlgPageList").html(sBtn);
        //生成页码
        $("#ZlgPageList").children().bind("click", function() {
            //分页点击事件
            if (!$(this).hasClass("zlg-page-list-hide")) {
                var sIndex = $(this).attr("data-index");
                if (sIndex == "next") {
                    //获取页码
                    iNowIndex < iMaxCount ? iNowIndex++ : iNowIndex = iMaxCount;
                } else if (sIndex == "prev") {
                    iNowIndex > 1 ? iNowIndex-- : iNowIndex = 1;
                } else if (sIndex == "first") {
                    iNowIndex = 1;
                } else if (sIndex == "last") {
                    iNowIndex = iMaxCount;
                } else {
                    iNowIndex = sIndex;
                }
                iNowIndex = Number(iNowIndex);
                //发送表头数据请求
                var Reg = /page=\d&/g;
                URL = URL.replace(Reg, "page=" + iNowIndex + "&");
                init(URL, config);
            }
        });
    }
    exports.init = init;
});