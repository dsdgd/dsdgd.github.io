//初始化
define("WebFilter/jQuery.webFilter", [ "./data-processing", "./ui-screening", "./ui-slider", "./data-getKeyWord", "./data-ajax", "./ui-hoverBgColor", "./ui-fixHead", "./ui-checkbox", "./ui-moreKey", "./ui-toggle", "./ui-reset" ], function(require, exports, module) {
    function init(config) {
        /***************************************************
*
*			网站选型表插件
*				【参数说明】:
*
config = {
	'url' 		: 	//Str 请求地址
	'nodeid' 	: 	//Int 节点ID,
	'tName' 	: 	//Str 模型,
	'pagesize'	: 	//Int 单页数据量,
	'page'		: 	//Int 页码,
	'filter'	: 	//Str 初始筛选条件,
	'title'		: 	//Str 筛选字段,
	'tabTitle'	: 	//Str 表格字段,
	'ifShow'	: 	//Str hide=隐藏选型表 选型表筛选参数区是否显示!
}
***************************************************/
        jQuery(document).ready(function() {
            var aTitle = config["title"].split(",");
            var aTabTitle = config["tabTitle"].split(",");
            var iLen1 = aTitle.length;
            var iLen2 = aTabTitle.length;
            config["key"] = [];
            config["title"] = [];
            config["tabKey"] = [];
            config["tabTitle"] = [];
            for (var i = 0; i < iLen1; i++) {
                config["key"].push(aTitle[i].split(":")[0]);
                config["title"].push(aTitle[i].split(":")[1]);
            }
            for (var i = 0; i < iLen2; i++) {
                config["tabKey"].push(aTabTitle[i].split(":")[0]);
                config["tabTitle"].push(aTabTitle[i].split(":")[1]);
            }
            var sData = "nodeid=" + config["nodeid"] + "&tName=" + config["tName"] + "&pagesize=" + 1e5 + "&page=" + config["page"] + "&filter=" + config["filter"];
            $.ajax({
                async: true,
                context: document.body,
                url: config["url"],
                data: sData,
                dataType: "text",
                beforeSend: function() {
                    var oLoading = $('<div id="ZlgLoading1" class="zlg-loading"></div>');
                    $("#ZlgScreenMain").append(oLoading);
                    if (config["ifShow"] == "隐藏选型表") {
                        $(".zlg-screening").hide();
                    }
                },
                error: function() {
                    alert("╮(╯﹏╰)╭网络故障,数据请求失败！");
                },
                success: function(Json) {
                    $("#ZlgLoading1").remove();
                    Json = eval("(" + Json + ")");
                    Json["alias"] = config["title"];
                    //解析筛选数据
                    var oJson = require("./data-processing").init(Json, true, config);
                    //生成筛选数据UI
                    require("./ui-screening").ui(oJson, config);
                    require("./ui-toggle").ui();
                    //发送表头数据请求
                    var sData = "nodeid=" + config["nodeid"] + "&tName=" + config["tName"] + "&pagesize=" + config["pagesize"] + "&page=" + config["page"] + "&filter=" + config["filter"];
                    var sUrl = config["url"] + "?" + sData;
                    sUrl = encodeURI(sUrl);
                    require("./data-ajax").init(sUrl, config);
                    //重置UI
                    require("./ui-reset").init("#ZlgReset", config, oJson, sUrl);
                    require("./ui-reset").init(".zlg-reset-one", config, oJson);
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
    function init(Json, bFirst, config) {
        //Json：数据, bFirst：true为筛选参数，false为表格数据
        bFirst ? Json["Param"] = config["key"] : Json["Param"] = config["tabKey"];
        var iLen0 = Json["Param"].length;
        var iLen1 = Json["Rows"].length;
        var iLen2 = Json["Title"].length;
        var aTmpIndex = [];
        //暂时存放对应title的产品信息下标数据
        var iPartNo = 0;
        //存放产品型号下标
        var iItemID = 0;
        //存放产品ID下标
        var iBest = true;
        //存放推荐产品下标
        var aProduct = [];
        //存放产品链接
        var aInfo = [];
        //存放产品信息
        for (var i = 0; i < iLen0; i++) {
            //查找下标
            for (var j = 0; j < iLen2; j++) {
                if (Json["Title"][j] === Json["Param"][i]) {
                    aTmpIndex.push(j);
                }
                if (Json["Title"][j] === "PartNo") {
                    iPartNo = j;
                }
                if (Json["Title"][j] === "ItemID") {
                    iItemID = j;
                }
                if (Json["Title"][j] === "IsBest") {
                    iBest = j;
                }
            }
        }
        for (var i = 0; i < iLen1; i++) {
            //获取产品链接、产品信息
            var iLen = Json["Rows"][i].length;
            var a = [];
            var s0 = "";
            var s1 = "";
            var s2 = "";
            var s3 = "";
            for (var j = 0; j < iLen; j++) {
                if (j === iPartNo) {
                    s1 = Json["Rows"][i][j];
                } else if (j === iItemID) {
                    s2 = Json["Rows"][i][j];
                } else if (j === iBest) {
                    s3 = Json["Rows"][i][j].toLowerCase();
                }
            }
            var iSize = aTmpIndex.length;
            for (var j = 0; j < iSize; j++) {
                for (var k = 0; k < iLen; k++) {
                    if (k === aTmpIndex[j]) {
                        a.push(Json["Rows"][i][k]);
                    }
                }
            }
            s0 = '<a href="/Item/' + s2 + '.aspx" target="_blank" class="zlg-best-' + s3 + '">' + s1 + "</a>";
            aProduct.push(s0);
            aInfo.push(a);
        }
        Json["Rows"] = aInfo;
        var aData = [];
        for (var i = 0; i < iLen0; i++) {
            //创建数据分组
            var oTmp = {};
            oTmp[Json["Param"][i]] = {
                str: [],
                num: []
            };
            aData.push(oTmp);
        }
        var iLen3 = aData.length;
        var iLen4 = Json["Rows"].length;
        var aTmp = [];
        //暂存
        for (var i = 0; i < iLen4; i++) {
            //数据分组添加→str、num
            var iLen = Json["Rows"][i].length;
            for (var j = 0; j < iLen; j++) {
                if (Json["Rows"][i][j] != "" && !isNaN(Json["Rows"][i][j])) {
                    //不为空且是数字
                    for (var k in aData[j]) {
                        //数字
                        aData[j][k]["num"].push(Json["Rows"][i][j]);
                    }
                } else if (Json["Rows"][i][j] != "") {
                    //不为空
                    for (var k in aData[j]) {
                        //字符串
                        if (Json["Rows"][i][j].indexOf(",") != -1) {
                            aTmp = Json["Rows"][i][j].split(",");
                            //逗号字段分割
                            aData[j][k]["str"] = aData[j][k]["str"].concat(aTmp);
                        } else {
                            aData[j][k]["str"].push(Json["Rows"][i][j]);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < iLen3; i++) {
            //排序、去重
            for (var j in aData[i]) {
                aData[i][j]["num"].sort(function(a, b) {
                    return a - b;
                });
                aData[i][j]["num"] = aData[i][j]["num"].unique();
                aData[i][j]["str"].sort(function(a, b) {
                    return a.localeCompare(b);
                });
                aData[i][j]["str"] = aData[i][j]["str"].unique();
            }
        }
        if (bFirst) {
            //解析筛选参数
            Json["Rows"] = aData;
        } else {
            //解析表格数据
            delete Json["Title"];
            Json["Item"] = aProduct;
        }
        return Json;
    }
    exports.init = init;
});

//筛选数据UI
define("WebFilter/ui-screening", [ "./ui-slider", "./data-getKeyWord", "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead", "./ui-checkbox", "./ui-moreKey" ], function(require, exports, module) {
    function ui(Json, config) {
        var aTitle = Json["Param"];
        var aData = Json["Rows"];
        var aAlias = Json["alias"];
        var iLen1 = aTitle.length;
        var iLen2 = aData.length;
        var sAllHtml = [];
        //存放所有html集合
        var aId1 = [], aId2 = [], aJsonNum = [];
        //存放不同类型html集合
        var aId01 = [], aId02 = [], aId03 = [], aId04 = [];
        //存放ID集合
        var iTimestamp = new Date().getTime();
        //当前时间戳
        var iNum1 = iTimestamp, iNum2 = iTimestamp;
        var iNum01 = iTimestamp, iNum02 = iTimestamp, iNum03 = iTimestamp, iNum04 = iTimestamp;
        for (var i = 0; i < iLen1; i++) {
            //----只有一个参数值（0，空，-）的字段则不生成dom
            if (aData[i][aTitle[i]]["num"].length == 0 && aData[i][aTitle[i]]["str"].length == 0) {
                continue;
            } else if (aData[i][aTitle[i]]["num"].length == 1 && aData[i][aTitle[i]]["num"][0] == 0) {
                continue;
            } else if (aData[i][aTitle[i]]["str"].length == 1 && aData[i][aTitle[i]]["str"][0] == "-") {
                continue;
            }
            //----定义一组html
            var sHtml1 = $('<dl class="zlg-screen-cont clearFix"></dl>');
            var sHtml2 = $('<dt class="fl"></dt>');
            var sHtml3 = $('<dd class="fl"></dd>');
            //----添加标题、属性
            sHtml2.attr("title", aAlias[i]);
            sHtml2.attr("data-name", aTitle[i]);
            sHtml2.html('<span class="zlg-screen-cont-title">' + aAlias[i] + '</span><span class="zlg-reset-one"></span>');
            var oRows = aData[i][aTitle[i]];
            //json→{str:[], num:[]}
            if (oRows["num"].length >= 8) {
                //生成滑动条html
                //----元素ID
                var sId1 = "ZlgRange" + ++iNum1;
                var sId2 = "ZlgSlider" + ++iNum2;
                aId1.push(sId1);
                aId2.push(sId2);
                var sHtml4 = $('<div id="' + sId2 + '" class="zlg-slider fl" data-name="' + aTitle[i] + '"></div>');
                var sHtml5 = $('<input class="fl" type="text" value=""/>');
                var sHtml6 = $('<div id="' + sId1 + '" class="zlg-range fl"></div>');
                var sHtml7 = $('<input class="fr" type="text" value=""/>');
                aJsonNum.push(oRows["num"]);
                sHtml4.append(sHtml5, sHtml6, sHtml7);
                sHtml3.prepend(sHtml4);
            }
            if (oRows["num"].length < 8 || oRows["str"].length > 0) {
                //生成按钮html
                //----元素ID
                var sId1 = "ZlgBtnsChosen" + ++iNum01;
                var sId2 = "ZlgBtnsData" + ++iNum02;
                var sId3 = "ZlgBtnsSubmit" + ++iNum03;
                var sId4 = "ZlgBtnsSelect" + ++iNum04;
                aId01.push(sId1);
                aId02.push(sId2);
                aId03.push(sId3);
                aId04.push(sId4);
                var sHtml4 = $('<div class="zlg-btns fr"></div>');
                var sHtml5 = $('<div id="' + sId1 + '" class="zlg-btns-chosen" title="更多筛选参数" data-name="' + aTitle[i] + '"><div>更多筛选参数</div></div>');
                var sHtml6 = $('<dl id="' + sId2 + '" class="zlg-btns-data"></dl>');
                var sHtml7 = $('<dt class="clearFix"></dt>');
                var sHtml8 = $('<input id="' + sId4 + '"  class="fl zlg-chosen-all" type="checkbox">');
                var sHtml9 = $('<span class="fl">全选</span>');
                var sHtml10 = $('<input id="' + sId3 + '" class="fr" type="button" value="提交" />');
                var sHtml11 = $("<dd></dd>");
                var sHtml12 = $("<ul></ul>");
                var sHtml13 = "";
                for (var j in oRows) {
                    //拼接html
                    var iLen = oRows[j].length;
                    if (j === "str" && iLen > 0) {
                        for (var k = 0; k < iLen; k++) {
                            sHtml13 += '<li title="' + oRows[j][k] + '"><input type="checkbox">' + oRows[j][k] + "</li>";
                        }
                    } else if (j === "num" && iLen > 0) {
                        for (var k = 0; k < iLen; k++) {
                            sHtml13 += '<li title="' + oRows[j][k] + '"><input type="checkbox">' + oRows[j][k] + "</li>";
                        }
                    }
                }
                sHtml7.append(sHtml8, sHtml9, sHtml10);
                sHtml12.append(sHtml13);
                sHtml11.append(sHtml12);
                sHtml6.append(sHtml7, sHtml11);
                sHtml4.append(sHtml5, sHtml6);
                sHtml3.append(sHtml4);
            }
            //----html集合
            sHtml1.append(sHtml2, sHtml3);
            sAllHtml.push(sHtml1);
        }
        //生成html
        $("#ZlgScreenMain").append(sAllHtml);
        for (var i = 0; i < aId1.length; i++) {
            //添加滑动条ui事件
            require("./ui-slider").ui("#" + aId1[i], "#" + aId2[i], aJsonNum[i], Json, config);
        }
        for (var i = 0; i < aId01.length; i++) {
            //添加筛选按钮ui事件
            require("./ui-checkbox").ui("#" + aId01[i], "#" + aId02[i], "#" + aId03[i], "#" + aId04[i], Json, config);
        }
        //展现部分下拉框的关键词
        require("./ui-moreKey").ui(Json, config);
    }
    exports.ui = ui;
});

//拖拽事件
define("WebFilter/ui-slider", [ "./data-getKeyWord", "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(Parent, Child, Arr, Json, config) {
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
                var sUrl = require("./data-getKeyWord").init(Json, config);
                require("./data-ajax").init(sUrl, config);
            }
        });
    }
    exports.ui = ui;
});

//筛选按钮事件
define("WebFilter/ui-checkbox", [ "./data-getKeyWord", "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(oParent, oChild, oBtn, oSelect, Json, config) {
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
            var sUrl = require("./data-getKeyWord").init(Json, config);
            require("./data-ajax").init(sUrl, config);
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
define("WebFilter/ui-moreKey", [ "./data-getKeyWord", "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
    function ui(Json, config) {
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
            var sUrl = require("./data-getKeyWord").init(Json, config);
            require("./data-ajax").init(sUrl, config);
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
define("WebFilter/ui-reset", [ "./data-ajax", "./data-processing", "./ui-hoverBgColor", "./ui-fixHead", "./data-getKeyWord" ], function(require, exports, moudle) {
    function init(obj, config, Json, url) {
        if (url) {
            //全部重置
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
                require("./data-ajax").init(url, config);
            });
        } else {
            //单个重置
            $(obj).click(function() {
                $(this).parent().next().find(".zlg-slider").each(function() {
                    //input重置
                    $(this).children(":first").val($(this).children(":first").attr("data-initnum"));
                    $(this).children(":last").val($(this).children(":last").attr("data-initnum"));
                });
                $(this).parent().next().find(".zlg-range").each(function() {
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
                $(this).parent().next().find(".zlg-btns-data").each(function() {
                    //单选框重置
                    $(this).find(":checkbox").prop({
                        checked: false
                    });
                });
                $(this).parent().next().find(".zlg-more-btns").each(function() {
                    //单选按钮重置
                    $(this).find(":checkbox").prop({
                        checked: false
                    });
                });
                $(this).parent().next().find(".zlg-btns-chosen").each(function() {
                    //单选框重置
                    $(this).attr("title", "更多筛选参数");
                    $(this).children().html("更多筛选参数");
                    $(this).children().removeClass("chosen-filter-color");
                });
                url = require("./data-getKeyWord").init(Json, config);
                require("./data-ajax").init(url, config);
            });
        }
    }
    exports.init = init;
});

//获取筛选值并返回URL
define("WebFilter/data-getKeyWord", [], {
    init: function(Json, config) {
        var sUrl = "";
        var JsonData = Json["Rows"];
        var JsonBak = Json["Rows"];
        var oKey = {};
        //存放按钮关键字
        var oSliderKey = {};
        //存放拖拽滚动关键字
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
                if (!oKey[$(this).attr("data-name")]) {
                    oKey[$(this).attr("data-name")] = [];
                }
                oKey[$(this).attr("data-name")] = oKey[$(this).attr("data-name")].concat(aTmp);
            }
        });
        $(".zlg-btns-chosen").each(function() {
            //复选按钮
            var aTmp = [];
            var sTmp = $(this).attr("title");
            sTmp == "更多筛选参数" ? sTmp = "" : sTmp = sTmp;
            aTmp = sTmp.split(",");
            if (aTmp.length == 1 && aTmp[0] == "") {} else {
                if (!oKey[$(this).attr("data-name")]) {
                    oKey[$(this).attr("data-name")] = [];
                }
                oKey[$(this).attr("data-name")] = oKey[$(this).attr("data-name")].concat(aTmp);
            }
        });
        /*********************************************************************/
        $(".zlg-slider").each(function() {
            //拖拽条
            var sV1 = $(this).find("input:first").val();
            //当前最小值
            var sV2 = $(this).find("input:last").val();
            //当前最大值
            var sT1 = $(this).find("input:first").attr("data-initnum");
            //初始最小值
            var sT2 = $(this).find("input:last").attr("data-initnum");
            //初始最大值
            var isChange = false;
            //假设未改变
            if (sV1 - sT1 > 0) {
                //检测拖拽条的值是否发生改变
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
                //字段名
                var aNewTmp = [];
                oSliderKey[sJIndex] = sJIndex + " between (" + sV1 + " and " + sV2 + ")";
            }
        });
        /**********************************************************************/
        for (var i in oKey) {
            //URL字符串拼接
            var s1 = "";
            for (var j = 0; j < oKey[i].length; j++) {
                s1 += "$" + oKey[i][j] + "$";
            }
            s1 = i + "=" + s1;
            sUrl += s1 + " AND ";
        }
        for (var i in oSliderKey) {
            sUrl += oSliderKey[i] + " AND ";
        }
        sUrl = config["url"] + "?nodeid=" + config["nodeid"] + "&tName=" + config["tName"] + "&pagesize=" + config["pagesize"] + "&page=" + config["page"] + "&filter=" + sUrl + config["filter"];
        sUrl = encodeURI(sUrl);
        return sUrl;
    }
});

//ajax请求
define("WebFilter/data-ajax", [ "./data-processing", "./ui-hoverBgColor", "./ui-fixHead" ], function(require, exports, module) {
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
                var oJson = require("./data-processing").init(result, false, config);
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
                            require("./ui-hoverBgColor").init("#SelectTable", "td-hover-bg");
                            require("./ui-fixHead").init("#SelectTable", {
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

//分页
define("WebFilter/ui-paging", [], function(require, exports, module) {
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

//表格头部固定事件
define("WebFilter/ui-fixHead", [], function(require, exports, module) {
    function init(obj, bool, append) {
        //obj:表格对象, bool:左一栏锁定→true:锁定,false:不锁定 {'L':true, 'T':false}, append:存放复制的数据对象
        if ($(obj).size() != 0) {
            var oTmp1 = $("<table></table>");
            //顶部表头
            var oTmp2 = $("<table></table>");
            //左侧表头
            var oTmp3 = $("<table></table>");
            //左上角表头
            var bAndroid = navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") > -1;
            var bMac = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var bIe8 = navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i) == "8.";
            var bIe7 = window.navigator.userAgent.indexOf("MSIE 7.0") !== -1;
            var bChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
            var bSafari = window.navigator.userAgent.indexOf("Safari") !== -1;
            var isFirefox = window.navigator.userAgent.indexOf("Firefox") > 0;
            var iMoreW = 0, iMoreH = 0;
            //不同设备额外添加的宽高
            var iST = $(window).scrollTop(), iSL = $(window).scrollLeft();
            //滚动条静止时位置，用于判断滚动条方向
            oTmp1.css({
                position: "absolute",
                top: "0",
                left: "0"
            });
            oTmp2.css({
                position: "absolute",
                top: "0",
                left: "0"
            });
            oTmp3.css({
                position: "absolute",
                top: "0",
                left: "0"
            });
            function appendTop() {
                if (bool["T"]) {
                    var oHead = $(obj).find("tr:first").clone();
                    //复制顶部表头
                    $(obj).find("tr:first td").each(function(i) {
                        var w1 = $(this).width() + iMoreW + "px";
                        var w2 = $(this).width() + iMoreW + "px";
                        oHead.find("td").eq(i).html('<div style="min-width:' + w1 + ";max-width:" + w2 + ';">' + $(this).html() + "</div>");
                    });
                    oTmp1.append(oHead);
                    $(append).append(oTmp1);
                }
                if (bool["L"]) {
                    $(obj).find("tr").each(function(i) {
                        var w1 = $(this).find("td:first").width() + iMoreW + "px";
                        var w2 = $(this).find("td:first").width() + iMoreW + "px";
                        var oLeft = $(this).find("td:first").clone();
                        var oTmpTr1 = $("<tr></tr>");
                        var oTmpTr2 = $("<tr></tr>");
                        if (iMoreH > 0 && i > 0) {
                            var h1 = $(this).find("td:first").height() + iMoreH + "px";
                            var h2 = $(this).find("td:first").height() + iMoreH + "px";
                            oLeft.html('<div style="min-width:' + w1 + ";max-width:" + w2 + ";height:" + h1 + ';">' + oLeft.html() + "</div>");
                        } else {
                            oLeft.html('<div style="min-width:' + w1 + ";max-width:" + w2 + ';">' + oLeft.html() + "</div>");
                        }
                        if (i == 0) {
                            var oLeftTop = $(this).find("td:first").clone();
                            oLeftTop.html('<div style="min-width:' + w1 + ";max-width:" + w2 + ';">' + oLeftTop.html() + "</div>");
                            oTmpTr2.append(oLeftTop);
                            oTmp3.append(oTmpTr2);
                        }
                        oTmpTr1.append(oLeft);
                        oTmp2.append(oTmpTr1);
                    });
                    $(append).append(oTmp2, oTmp3);
                }
            }
            //固定宽度
            if (bAndroid) {
                //安卓
                appendTop();
            } else if (bMac) {
                //苹果
                appendTop();
            } else if (bIe7) {} else if (bIe8) {
                //IE8
                iMoreW = 1;
                appendTop();
            } else if (bChrome) {
                //Chrome
                iMoreW = 1;
                appendTop();
            } else if (bSafari) {
                //Safari
                iMoreW = 1;
                appendTop();
            } else if (isFirefox) {
                //Firefox
                iMoreW = 0;
                appendTop();
            } else {
                //其他 or IE
                iMoreW = 1;
                appendTop();
            }
            var iT = $(obj).offset().top;
            var iL = $(obj).offset().left;
            var iW = $(obj).width();
            var iH = $(obj).height();
            setInterval(function() {
                iT != $(obj).offset().top ? iT = $(obj).offset().top : false;
                iL != $(obj).offset().left ? iL = $(obj).offset().left : false;
                var iNowT = $(this).scrollTop();
                var iNowL = $(this).scrollLeft();
                move(iT, iL, iNowT, iNowL);
            }, 30);
            $(window).scroll(function() {
                var iNowT = $(this).scrollTop();
                var iNowL = $(this).scrollLeft();
                move(iT, iL, iNowT, iNowL);
            });
            $(window).resize(function() {
                iT = oTmp1.offset().top;
                iL = oTmp1.offset().left;
                var iNowT = $(this).scrollTop();
                var iNowL = $(this).scrollLeft();
                move(iT, iL, iNowT, iNowL);
            });
            function move(T, L, Tn, Ln) {
                if (T > Tn && L > Ln) {
                    setStyle({
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    });
                } else if (T > Tn && L < Ln) {
                    setStyle({
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "fixed",
                        L: 0,
                        T: T - Tn,
                        Z: 1
                    }, {
                        P: "fixed",
                        L: 0,
                        T: T - Tn,
                        Z: 2
                    });
                } else if (T < Tn && L > Ln) {
                    setStyle({
                        P: "fixed",
                        L: L - Ln,
                        T: 0,
                        Z: 1
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    });
                } else if (T < Tn && L < Ln) {
                    setStyle({
                        P: "fixed",
                        L: L - Ln,
                        T: 0,
                        Z: 0
                    }, {
                        P: "fixed",
                        L: 0,
                        T: T - Tn,
                        Z: 1
                    }, {
                        P: "fixed",
                        L: 0,
                        T: 0,
                        Z: 2
                    });
                }
                if (iH + T <= Tn) {
                    setStyle({
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    });
                } else if (iW + L <= Ln) {
                    setStyle({
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    }, {
                        P: "absolute",
                        L: 0,
                        T: 0,
                        Z: 0
                    });
                }
            }
            function setStyle(o1, o2, o3) {
                oTmp1.css({
                    position: o1["P"],
                    left: o1["L"] + "px",
                    top: o1["T"] + "px",
                    "z-index": o1["Z"]
                });
                oTmp2.css({
                    position: o2["P"],
                    left: o2["L"] + "px",
                    top: o2["T"] + "px",
                    "z-index": o2["Z"]
                });
                oTmp3.css({
                    position: o3["P"],
                    left: o3["L"] + "px",
                    top: o3["T"] + "px",
                    "z-index": o3["Z"]
                });
            }
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
