//初始化
define("WebFilter/jQuery.webFilter", [ "./data-processing", "./ui-screening", "./ui-slider", "./data-getKeyWord", "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead", "./ui-checkbox", "./ui-moreKey", "./ui-toggle", "./ui-reset" ], function(require, exports, module) {
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
                    var oJson = require("./data-processing").initResult(Json);
                    //生成筛选数据UI
                    require("./ui-screening").ui(oJson, url, aOrderBy);
                    require("./ui-toggle").ui();
                    //发送表头数据请求
                    var sUrl = url + "?tName=" + oJson["title"]["TableName"] + "&filter=&IsAjax=true&Labels=商品综合信息列表Table";
                    sUrl = encodeURI(sUrl);
                    require("./data-ajax").init(sUrl);
                    //重置UI
                    require("./ui-reset").init("#ZlgReset", sUrl);
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

//数据解析模块
define("WebFilter/data-processing", [], function(require, exports, module) {
    function initResult(Json) {
        //筛选参数初始化数据Json
        //console.time('data-processing');
        Json = Json.replace(/[\n\r]/g, "");
        //去除回车符
        var JsonArr = Json.split(";");
        //数组切割
        var JsonArrData = eval("(" + JsonArr[0] + ")");
        //筛选值数据
        var JsonArrTitle = eval("(" + JsonArr[1] + ")");
        //筛选值标题
        var JsonArrNum = eval("(" + JsonArr[2] + ")");
        //筛选值对应芯片总量,目前不使用!!!
        var JsonArrType = eval("(" + JsonArr[3] + ")");
        //筛选值展示类型:按钮→0,拖拽→1
        var JsonArrDataBak = eval("(" + JsonArr[0] + ")");
        //备份筛选值数据
        //Title解析
        var JsonTmp = JsonArr[3];
        //暂存
        var sTmp = JsonTmp.substr(1).substring(0, JsonTmp.length - 2).replace(/:\d/g, "");
        var aTmp = sTmp.split(",");
        sTmp = "";
        for (var i = 0; i < JsonArrTitle["Alias"].length; i++) {
            sTmp += '"' + aTmp[i] + '":"' + JsonArrTitle["Alias"][i] + '",';
        }
        sTmp = "{" + sTmp.substring(0, sTmp.length - 1) + "}";
        sTmp = eval("(" + sTmp + ")");
        JsonArrTitle["Alias"] = sTmp;
        //Data解析
        var sReg = /^([0-9]\d*\.*\d*)\sto\s([0-9]\d*\.*\d*)\(Adj\)/g;
        var aConCat = [];
        for (var i in JsonArrData) {
            for (var j = 0; j < JsonArrData[i].length; j++) {
                if (JsonArrData[i][j].indexOf(",") > 0) {
                    //字段切割
                    var aTmp = JsonArrData[i][j].split(",");
                    JsonArrData[i].splice(j, 1);
                    for (var k = 0; k < aTmp.length; k++) {
                        JsonArrData[i].splice(0, 0, aTmp[k]);
                    }
                }
                if (JsonArrData[i][j].search(sReg) == 0) {
                    var sTmp1 = JsonArrData[i][j];
                    var aTmp1 = [];
                    var aTmp2 = [];
                    sTmp1 = sTmp1.replace("(Adj)", "");
                    aTmp1 = sTmp1.split(" to ");
                    for (var l = aTmp1[0] * 10; l <= aTmp1[1] * 10; l++) {
                        aConCat.push(String(l / 10));
                    }
                }
            }
            aContCat = aConCat.unique();
            if (typeof JsonArrData[i] === "object") {
                JsonArrData[i] = JsonArrData[i].concat(aContCat);
                JsonArrData[i] = JsonArrData[i].unique();
            }
        }
        for (var i in JsonArrData) {
            //数字与字符串分组
            var aTmp1 = [], aTmp2 = [];
            //暂存
            var oTmp = {};
            //暂存
            for (var j = 0; j < JsonArrData[i].length; j++) {
                if (isNaN(JsonArrData[i][j])) {
                    aTmp1.push(JsonArrData[i][j]);
                } else {
                    aTmp2.push(JsonArrData[i][j]);
                }
            }
            oTmp["str"] = aTmp1;
            oTmp["num"] = aTmp2;
            oTmp["str"].sort(function(a, b) {
                return a.localeCompare(b);
            });
            //英文排序,对于存在数字的数组会报错,使用时需将数字转换为字符串
            oTmp["num"].sort(function(a, b) {
                return a - b;
            });
            //数字从小到大排序
            JsonArrData[i] = oTmp;
        }
        //合并返回
        var Json = {};
        Json["data"] = JsonArrData;
        Json["title"] = JsonArrTitle;
        Json["Num"] = JsonArrNum;
        Json["type"] = JsonArrType;
        Json["bak"] = JsonArrDataBak;
        //console.timeEnd('data-processing');
        var aRemoveIndex = [];
        //存放需要删除的字段下标
        var bRemoveindex = false;
        for (var i in Json["data"]) {
            if (Json["data"][i]["num"].length == 0 && Json["data"][i]["str"].length == 0) {
                aRemoveIndex.push(i);
            } else if (Json["data"][i]["num"].length != 0 && Json["data"][i]["str"].length == 0) {
                for (var j = 0; j < Json["data"][i]["num"].length; j++) {
                    if (Json["data"][i]["num"][j] == 0) {
                        bRemoveindex = true;
                    } else {
                        bRemoveindex = false;
                    }
                }
                if (bRemoveindex) {
                    aRemoveIndex.push(i);
                    bRemoveindex = false;
                }
            } else if (Json["data"][i]["num"].length == 0 && Json["data"][i]["str"].length != 0) {
                for (var j = 0; j < Json["data"][i]["str"].length; j++) {
                    if (Json["data"][i]["num"][j] == "-" || Json["data"][i]["num"][j] == "") {
                        bRemoveindex = true;
                    } else {
                        bRemoveindex = false;
                    }
                }
                if (bRemoveindex) {
                    aRemoveIndex.push(i);
                    bRemoveindex = false;
                }
            } else {
                for (var j = 0; j < Json["data"][i]["num"].length; j++) {
                    if (Json["data"][i]["num"][j] == 0) {
                        bRemoveindex = true;
                    } else {
                        bRemoveindex = false;
                    }
                }
                for (var j = 0; j < Json["data"][i]["str"].length; j++) {
                    if (Json["data"][i]["num"][j] == "-" || Json["data"][i]["num"][j] == "") {
                        bRemoveindex = true;
                    } else {
                        bRemoveindex = false;
                    }
                }
                if (bRemoveindex) {
                    aRemoveIndex.push(i);
                    bRemoveindex = false;
                }
            }
        }
        aRemoveIndex = aRemoveIndex.unique();
        for (var i = 0; i < aRemoveIndex.length; i++) {
            delete Json["data"][aRemoveIndex[i]];
            delete Json["title"]["Alias"][aRemoveIndex[i]];
        }
        return Json;
    }
    module.exports = {
        initResult: initResult
    };
});

//筛选数据UI
define("WebFilter/ui-screening", [ "./ui-slider", "./data-getKeyWord", "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead", "./ui-checkbox", "./ui-moreKey" ], function(require, exports, module) {
    function ui(Json, url, OrderBy) {
        //console.log(Json);
        var JsonTitle = Json["title"];
        var JsonData = Json["data"];
        var iTimestamp = new Date().getTime();
        var aId1 = [], aId2 = [], aJsonNum = [];
        var iNum1 = iTimestamp, iNum2 = iTimestamp;
        var aId01 = [], aId02 = [], aId03 = [], aId04 = [];
        var iNum01 = iTimestamp, iNum02 = iTimestamp, iNum03 = iTimestamp, iNum04 = iTimestamp;
        var sAllHtml = [];
        for (var i in JsonData) {
            var sHtml1 = $('<dl class="zlg-screen-cont clearFix"></dl>');
            var sHtml2 = $('<dt class="fl"></dt>');
            var sHtml3 = $('<dd class="fl"></dd>');
            sHtml2.attr("title", JsonTitle["Alias"][i]);
            sHtml2.attr("data-name", i);
            sHtml2.html(JsonTitle["Alias"][i]);
            for (var j in JsonData[i]) {
                if (j == "num" && JsonData[i]["num"].length > 0) {
                    //生成滑动条ui
                    var sId1 = "ZlgRange" + ++iNum1;
                    var sId2 = "ZlgSlider" + ++iNum2;
                    var sHtml4 = $('<div id="' + sId2 + '" class="zlg-slider fl" data-name="' + i + '"></div>');
                    var sHtml5 = $('<input class="fl" type="text" value=""/>');
                    var sHtml6 = $('<div id="' + sId1 + '" class="zlg-range fl"></div>');
                    var sHtml7 = $('<input class="fr" type="text" value=""/>');
                    aId1.push(sId1);
                    aId2.push(sId2);
                    aJsonNum.push(JsonData[i]["num"]);
                    sHtml4.append(sHtml5, sHtml6, sHtml7);
                    sHtml3.prepend(sHtml4);
                } else {
                    //生成按钮ui
                    var iLen = JsonData[i][j].length;
                    if (iLen > 0) {
                        var sId1 = "ZlgBtnsChosen" + ++iNum01;
                        var sId2 = "ZlgBtnsData" + ++iNum02;
                        var sId3 = "ZlgBtnsSubmit" + ++iNum03;
                        var sId4 = "ZlgBtnsSelect" + ++iNum04;
                        aId01.push(sId1);
                        aId02.push(sId2);
                        aId03.push(sId3);
                        aId04.push(sId4);
                        var sHtml4 = $('<div class="zlg-btns fr"></div>');
                        var sHtml5 = $('<div id="' + sId1 + '" class="zlg-btns-chosen" title="更多筛选参数" data-name="' + i + '"><div>更多筛选参数</div></div>');
                        var sHtml6 = $('<dl id="' + sId2 + '" class="zlg-btns-data"></dl>');
                        var sHtml7 = $('<dt class="clearFix"></dt>');
                        var sHtml8 = $('<input id="' + sId4 + '"  class="fl zlg-chosen-all" type="checkbox">');
                        var sHtml9 = $('<span class="fl">全选</span>');
                        var sHtml10 = $('<input id="' + sId3 + '" class="fr" type="button" value="提交" />');
                        var sHtml11 = $("<dd></dd>");
                        var sHtml12 = $("<ul></ul>");
                        var sHtml13 = "";
                        for (var k = 0; k < iLen; k++) {
                            sHtml13 += '<li title="' + JsonData[i][j][k] + '"><input type="checkbox">' + JsonData[i][j][k] + "</li>";
                        }
                        sHtml7.append(sHtml8, sHtml9, sHtml10);
                        sHtml12.append(sHtml13);
                        sHtml11.append(sHtml12);
                        sHtml6.append(sHtml7, sHtml11);
                        sHtml4.append(sHtml5, sHtml6);
                        sHtml3.append(sHtml4);
                    }
                }
            }
            sHtml1.append(sHtml2, sHtml3);
            sAllHtml.push(sHtml1);
        }
        //筛选字段排序显示
        var sAllHtmlNew = [];
        for (var i = 0; i < OrderBy.length; i++) {
            for (var j = 0; j < sAllHtml.length; j++) {
                var s = $(sAllHtml[j]).children(":first").attr("data-name");
                if (s == OrderBy[i]) {
                    sAllHtmlNew.push(sAllHtml[j]);
                }
            }
        }
        //生成html
        $("#ZlgScreenMain").append(sAllHtmlNew);
        for (var i = 0; i < aId1.length; i++) {
            //添加滑动条ui事件
            require("./ui-slider").ui("#" + aId1[i], "#" + aId2[i], aJsonNum[i], Json, url);
        }
        for (var i = 0; i < aId1.length; i++) {
            //添加筛选按钮ui事件
            require("./ui-checkbox").ui("#" + aId01[i], "#" + aId02[i], "#" + aId03[i], "#" + aId04[i], Json, url);
        }
        //展现部分下拉框的关键词
        require("./ui-moreKey").ui(Json, url);
    }
    exports.ui = ui;
});

//拖拽事件
define("WebFilter/ui-slider", [ "./data-getKeyWord", "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(Parent, Child, Arr, Json, url) {
        var iLens = Arr.length;
        //数组长度
        var iMin = 0;
        //滚动范围最小值
        var iMax = 100;
        //滚动范围最大值	
        var iStep = parseFloat(iMax / (iLens - 1));
        //步长0~10长度11，需走10步1
        var aValues = [ 0, 100 ];
        var bReady = true;
        //阻止函数重复执行
        $(Child).find("input").bind("blur keydown", function(e) {
            if (e.type == "blur") {
                fnBind($(this));
            } else {
                if (e.which == 13) {
                    fnBind($(this));
                    bReady = false;
                }
            }
        });
        function fnBind(obj) {
            this.oTimer = setTimeout(function() {
                bReady = true;
            }, 1500);
            if (bReady) {
                var iVal = obj.val();
                var iIndex = obj.index() ? 1 : 0;
                var iAttr = findIndex(Arr, iVal) * iStep;
                obj.val(Arr[findIndex(Arr, iVal)]);
                $(Parent).slider("values", iIndex, iAttr);
            }
        }
        $(Parent).slider({
            range: true,
            min: iMin,
            max: iMax,
            step: iStep,
            values: aValues,
            create: function() {
                $(Child).children(":first").val(Arr[0]);
                $(Child).children(":last").val(Arr[Arr.length - 1]);
                $(Child).children(":first").attr("data-initnum", Arr[0]);
                $(Child).children(":last").attr("data-initnum", Arr[Arr.length - 1]);
            },
            slide: function(event, ui) {
                var iValF = Arr[Math.round(ui.values[0] / iStep)];
                var iValS = Arr[Math.round(ui.values[1] / iStep)];
                $(Child).children(":first").val(iValF);
                $(Child).children(":last").val(iValS);
            },
            change: function(event, ui) {
                //拖拽后鼠标抬起,在此添加ajax查询事件
                var sUrl = require("./data-getKeyWord").init(Json);
                sUrl = encodeURI(sUrl);
                require("./data-ajax").init(url + "?" + sUrl);
            }
        });
    }
    exports.ui = ui;
});

//筛选按钮事件
define("WebFilter/ui-checkbox", [ "./data-getKeyWord", "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(oParent, oChild, oBtn, oSelect, Json, url) {
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
            var sUrl = require("./data-getKeyWord").init(Json);
            sUrl = encodeURI(sUrl);
            require("./data-ajax").init(url + "?" + sUrl);
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

//展现部分关键词
define("WebFilter/ui-moreKey", [ "./data-getKeyWord", "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
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
            var sUrl = require("./data-getKeyWord").init(Json);
            sUrl = encodeURI(sUrl);
            require("./data-ajax").init(url + "?" + sUrl);
        });
    }
    exports.ui = ui;
});

//展开收起筛选参数
define("WebFilter/ui-toggle", [], function(require, exports, module) {
    function ui() {
        var iSize = $("#ZlgScreenMain").children().size();
        var sBeforeH = $("#ZlgScreenMain").height();
        var sAfterH = ($("#ZlgScreenMain").children(":first-child").outerHeight(true) + 1) * iSize;
        $("#ZlgToggle").click(function() {
            if ($(this).attr("data-toggle") == "show") {
                //展开
                $(this).attr("data-toggle", "hide").text("收起部分选项");
                $("#ZlgScreenMain").animate({
                    height: sAfterH + "px"
                });
            } else {
                //收起
                $(this).attr("data-toggle", "show").text("显示全部选项");
                $("#ZlgScreenMain").animate({
                    height: sBeforeH + "px"
                });
            }
        });
    }
    exports.ui = ui;
});

//重置所有参数
define("WebFilter/ui-reset", [ "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, moudle) {
    function init(obj, url) {
        $(obj).click(function() {
            $(".zlg-slider").each(function() {
                //input重置
                $(this).children(":first").val($(this).children(":first").attr("data-initnum"));
                $(this).children(":last").val($(this).children(":last").attr("data-initnum"));
            });
            $(".zlg-range").each(function() {
                //拖拽条重置
                $(this).children(":first").css({
                    left: "0%",
                    width: "100%"
                });
                $(this).children(":eq(1)").css({
                    left: "0%"
                });
                $(this).children(":last").css({
                    left: "100%"
                });
            });
            $(".zlg-btns-data").each(function() {
                //单选框重置
                $(this).find(":checkbox").prop({
                    checked: false
                });
            });
            $(".zlg-more-btns").each(function() {
                //单选按钮重置
                $(this).find(":checkbox").prop({
                    checked: false
                });
            });
            $(".zlg-btns-chosen").each(function() {
                //单选框重置
                $(this).attr("title", "更多筛选参数");
                $(this).children().html("更多筛选参数");
                $(this).children().removeClass("chosen-filter-color");
            });
            require("./data-ajax").init(url);
        });
    }
    exports.init = init;
});

//获取筛选值并返回URL
define("WebFilter/data-getKeyWord", [], {
    init: function(Json) {
        var sUrl = "";
        var sReg = /^([0-9]\d*\.*\d*)\sto\s([0-9]\d*\.*\d*)\(Adj\)/g;
        var JsonData = Json["data"];
        var JsonBak = Json["bak"];
        var oKey = {};
        $(".zlg-btns-chosen").each(function() {
            //筛选按钮
            var aTmp = [];
            var sTmp = $(this).attr("title");
            sTmp == "更多筛选参数" ? sTmp = "" : sTmp = sTmp;
            aTmp = sTmp.split(",");
            if (aTmp.length == 1 && aTmp[0] == "") {} else {
                oKey[$(this).attr("data-name")] = aTmp;
            }
        });
        $(".zlg-more-btns").each(function() {
            //单选按钮
            var aTmp = [];
            var sTmp = $(this).attr("title");
            $(this).find(":checkbox").each(function() {
                if ($(this).prop("checked")) {
                    aTmp.push($(this).parent().attr("title"));
                }
            });
            if (aTmp.length > 0) {
                oKey[$(this).attr("data-name")] = aTmp;
            }
        });
        $(".zlg-slider").each(function() {
            //拖拽条
            var sV1 = $(this).find("input:first").val();
            var sV2 = $(this).find("input:last").val();
            var sT1 = $(this).find("input:first").attr("data-initnum");
            var sT2 = $(this).find("input:last").attr("data-initnum");
            var isChange = false;
            if (sV1 - sT1 > 0) {
                isChange = true;
            } else if (sV2 - sT2 < 0) {
                isChange = true;
            } else {
                isChange = false;
            }
            if (isChange) {
                //拖拽条数值有变则执行关键词获取
                var aTmp = [], aIndex = [], aJTmp = [];
                var sJIndex = $(this).attr("data-name");
                var aNewTmp = [];
                aJTmp = aJTmp.concat(JsonData[sJIndex]["num"]);
                //原备份数值型数据
                //范围值
                aTmp.push($(this).find("input:first").val());
                aTmp.push($(this).find("input:last").val());
                //范围值对应的原始数据下标			
                aIndex.push(findIndex(aJTmp, aTmp[0]));
                aIndex.push(findIndex(aJTmp, aTmp[1]));
                aJTmp.splice(0, aIndex[0]);
                aJTmp.splice(aIndex[1] + 1 - aIndex[0], aJTmp.length);
                aNewTmp = aNewTmp.concat(aJTmp);
                for (var i = 0; i < JsonData[sJIndex]["str"].length; i++) {
                    if (JsonData[sJIndex]["str"][i].search(sReg) == 0) {
                        var aJTmpnew = [];
                        var sTmpnew = JsonData[sJIndex]["str"][i];
                        var sTmpnow = sTmpnew.replace("(Adj)", "");
                        aJTmpnew = sTmpnow.split(" to ");
                        for (var j = 0; j < aJTmp.length; j++) {
                            if (aJTmp[j] - aJTmpnew[0] >= 0 && aJTmp[j] - aJTmpnew[1] <= 0) {
                                aJTmp[j] = sTmpnew;
                            }
                        }
                    }
                }
                aJTmp = aJTmp.unique();
                aNewTmp = aNewTmp.concat(aJTmp);
                var aIntersection = [];
                //存放两个数组交集集合
                for (var i = 0; i < JsonBak[sJIndex].length; i++) {
                    //查找交集
                    for (var j = 0; j < aNewTmp.length; j++) {
                        if (JsonBak[sJIndex][i] == aNewTmp[j]) {
                            aIntersection.push(JsonBak[sJIndex][i]);
                        }
                    }
                }
                if (!oKey[sJIndex]) {
                    oKey[sJIndex] = [];
                }
                oKey[sJIndex] = oKey[sJIndex].concat(aIntersection);
                oKey[sJIndex] = oKey[sJIndex].unique();
            }
        });
        var iSign1 = [ "+", "&", "'", "%", "^", "?", "(", ")", "<", ">", "[", "]", "{", "}", "/", "\\", ";", ":", "--" ];
        var iSign2 = [ "加", "与", "单引号", "余", "位", "问号", "左括号", "右括号", "小于", "大于", "中左括号", "中右括号", "大左括号", "大右括号", "斜杠", "反斜杠", "分号", "冒号", "双横杆" ];
        for (var i in oKey) {
            //URL字符串拼接
            var s1 = "";
            for (var j = 0; j < oKey[i].length; j++) {
                s1 += "$" + oKey[i][j] + "$";
            }
            s1 = i + "=" + s1;
            sUrl += s1 + " AND ";
        }
        for (var i = 0; i < iSign1.length; i++) {
            //特殊字符转换	
            var iRegExp = new RegExp("\\" + iSign1[i], "g");
            sUrl = sUrl.replace(iRegExp, iSign2[i]);
        }
        sUrl = sUrl.substring(0, sUrl.length - 5);
        //删除最后一个AND字符
        sUrl = "tName=" + Json["title"]["TableName"] + "&filter=" + sUrl + "&IsAjax=true&Labels=商品综合信息列表Table";
        return sUrl;
    }
});

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
                require("./ui-hoverBgColor").init("#SelectTable", "td-hover-bg");
                require("./ui-fixHead").init("#SelectTable", true);
            }
        });
    }
    exports.init = init;
});

//表格头部固定事件
define("WebFilter/ui-fixHead", [], function(require, exports, module) {
    function init(obj, bool) {
        //obj:表格对象, bool:左一栏锁定→true:锁定,false:不锁定
        if ($(obj).size() != 0) {
            var oHead = $(obj).find("tr:first");
            var oTmp1 = $('<table id="FixTop"></table>');
            //顶部表头
            var oTmp2 = $('<table id="FixLeft"></table>');
            //左侧表头
            var oTmp3 = $('<table id="FixTopLeft"></table>');
            //左上角表头
            //将第一行表头各单元格宽度写死
            if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
                //chrome
                oHead.children().each(function() {
                    var iW = $(this).width() + 1;
                    $(this).css({
                        "min-width": iW,
                        "max-width": iW
                    });
                });
            } else if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.") {
                oHead.children().each(function() {
                    var iW = $(this).width() + 1;
                    $(this).css({
                        "min-width": iW,
                        "max-width": iW
                    });
                });
            } else {
                oHead.children().each(function() {
                    //ie,firfox
                    var iW = $(this).width();
                    $(this).css({
                        "min-width": iW,
                        "max-width": iW
                    });
                });
            }
            //将第一行数据各单元格宽度写死
            $(obj).find("tr:eq(1)").children().each(function() {
                var iW = $(this).width();
                $(this).css({
                    "min-width": iW,
                    "max-width": iW
                });
            });
            //复制			
            oTmp1.css({
                position: "absolute",
                top: "0px",
                left: "0px",
                "z-index": "1"
            });
            var oClone = oHead.clone();
            oTmp1.html(oClone);
            $("#ZlgResult").append(oTmp1);
            if (bool) {
                oTmp2.css({
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    "z-index": "0"
                });
                oTmp3.css({
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    "z-index": "1"
                });
                for (var i = 0; i < $(obj).find("tr").size(); i++) {
                    var oTmpT = $("<tr></tr>");
                    var oTmpHtml = $(obj).find("tr").eq(i).children().eq(0).clone();
                    oTmpT.html(oTmpHtml);
                    $(oTmp2).append(oTmpT);
                }
                oTmp3.append($("<tr></tr>").html($(obj).find("tr:first").children().eq(0).clone()));
                $("#ZlgResult").append(oTmp2, oTmp3);
            }
            $(window, document).scroll(function() {
                //滚条滚动事件
                if ($(obj).size() != 0) {
                    var oScSize = {
                        T: $(this).scrollTop(),
                        L: $(this).scrollLeft()
                    };
                    var oSize = {
                        T: $(obj).offset().top,
                        L: $(obj).offset().left
                    };
                    if (oScSize.T > oSize.T && oScSize.L <= oSize.L) {
                        oTmp1.css({
                            top: 0,
                            position: "fixed"
                        });
                        oTmp2.css({
                            top: 0,
                            position: "absolute"
                        });
                        oTmp3.css({
                            top: 0,
                            position: "fixed"
                        });
                        oTmp1.css({
                            left: oSize.L - oScSize.L + "px"
                        });
                        oTmp2.css({
                            left: 0
                        });
                        oTmp3.css({
                            left: oSize.L - oScSize.L + "px"
                        });
                    }
                    if (oScSize.L > oSize.L && oScSize.L > oSize.L) {
                        oTmp1.css({
                            top: 0,
                            position: "fixed"
                        });
                        oTmp2.css({
                            top: oSize.T - oScSize.T + "px",
                            position: "fixed"
                        });
                        oTmp3.css({
                            top: 0,
                            position: "fixed"
                        });
                        oTmp1.css({
                            left: oSize.L - oScSize.L + "px"
                        });
                        oTmp2.css({
                            left: 0
                        });
                        oTmp3.css({
                            left: 0
                        });
                    }
                    if (oScSize.T <= oSize.T && oScSize.L <= oSize.L) {
                        oTmp1.css({
                            top: 0,
                            position: "absolute"
                        });
                        oTmp2.css({
                            top: 0,
                            position: "absolute"
                        });
                        oTmp3.css({
                            top: 0,
                            position: "absolute"
                        });
                        oTmp1.css({
                            left: 0,
                            position: "absolute"
                        });
                        oTmp2.css({
                            left: 0,
                            position: "absolute"
                        });
                        oTmp3.css({
                            left: 0,
                            position: "absolute"
                        });
                    }
                    if (oScSize.T <= oSize.T && oScSize.L > oSize.L) {
                        oTmp1.css({
                            top: 0,
                            position: "absolute"
                        });
                        oTmp2.css({
                            top: oSize.T - oScSize.T + "px",
                            position: "fixed"
                        });
                        oTmp3.css({
                            top: oSize.T - oScSize.T + "px",
                            position: "fixed"
                        });
                        oTmp1.css({
                            left: 0
                        });
                        oTmp2.css({
                            left: 0
                        });
                        oTmp3.css({
                            left: 0
                        });
                    }
                }
            });
        }
    }
    exports.init = init;
});

//表格hover背景事件
define("WebFilter/ui-hoverBgColor", [], function(require, exports, moudle) {
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
