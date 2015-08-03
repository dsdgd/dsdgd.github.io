//获取筛选值并返回URL
define("WebFilter/data-getKeyWord-debug", [], {
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