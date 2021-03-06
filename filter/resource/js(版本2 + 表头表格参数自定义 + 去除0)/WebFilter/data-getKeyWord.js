//获取筛选值并返回URL
define({
    init: function(Json, config) {
        var sUrl = "";
        var sReg = /^([0-9]\d*\.*\d*)\sto\s([0-9]\d*\.*\d*)\(Adj\)/g;//电源专用
        var JsonData = Json["Rows"];
        var JsonBak = Json["Rows"];
        var oKey = {};
        
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
                };
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
                };
                oKey[$(this).attr("data-name")] = oKey[$(this).attr("data-name")].concat(aTmp);
            }
        });

        $(".zlg-slider").each(function() {
            //拖拽条
            var sV1 = $(this).find("input:first").val();//当前最小值
            var sV2 = $(this).find("input:last").val();//当前最大值
            var sT1 = $(this).find("input:first").attr("data-initnum");//初始最小值
            var sT2 = $(this).find("input:last").attr("data-initnum");//初始最大值
            var isChange = false;//假设未改变

            if (sV1 - sT1 > 0) {//检测拖拽条的值是否发生改变
                isChange = true;
            } else if (sV2 - sT2 < 0) {
                isChange = true;
            } else {
                isChange = false;
            };

            if (isChange) {
                //拖拽条数值有变则执行关键词获取
                var aTmp = [], aIndex = [], aJTmp = [];
                var sJIndex = $(this).attr("data-name");//字段名
                var aNewTmp = [];
                
                var iLen = JsonBak.length;
                for(var i = 0; i < iLen; i++){//查找对应字段数据
                    for(var j in JsonBak[i]){
                        if(j === sJIndex){
                            aJTmp = aJTmp.concat(JsonBak[i][j]["num"]);
                        }
                    }
                };

                //原备份数值型数据
                //范围值数组[min,max]
                aTmp.push(sV1);
                aTmp.push(sV2);
                //范围值对应的原始数据下标			
                aIndex.push(findIndex(aJTmp, aTmp[0]));
                aIndex.push(findIndex(aJTmp, aTmp[1]));
                //删除范围值之外的数x[x,x,min,a,a,a,max,x,x,x]
                aJTmp.splice(0, aIndex[0]);
                aJTmp.splice(aIndex[1] + 1 - aIndex[0], aJTmp.length);
                //合并到新数组
                aNewTmp = aNewTmp.concat(aJTmp);

                for(var i = 0; i < iLen; i++){//查找对应字段数据---------------------------------------------------------需求未定暂时放下
                    for(var j in JsonBak[i]){
                        if(j === sJIndex){

                            var iSize1 = JsonBak[i][j]["str"].length;
                            for (var k = 0; k < iSize1; k++) {

                                if (JsonBak[i][j]["str"][k].search(sReg) == 0) {//电源专用：查找满足正则的特殊字段
                                    var aJTmpnew = [];
                                    var sTmpnew = JsonBak[i][j]["str"][k];
                                    var sTmpnow = sTmpnew.replace("(Adj)", "");
                                    aJTmpnew = sTmpnow.split(" to ");
                                    var iSize2 = aJTmp.length;

                                    for (var l = 0; l < iSize2; l++) {
                                        if (aJTmp[l] - aJTmpnew[0] >= 0 && aJTmp[l] - aJTmpnew[1] <= 0) {
                                            aJTmp[l] = sTmpnew;//str
                                        }
                                    }
                                }

                            }

                        }
                    }
                };

                aJTmp = aJTmp.unique();//去重
                aNewTmp = aNewTmp.concat(aJTmp).unique();

                var aIntersection = [];
                //存放两个数组交集集合
                for(var i = 0; i < iLen; i++){//查找对应字段数据
                    for(var j in JsonBak[i]){
                        if(j === sJIndex){
                            
                            var aTmpBak = [];
                            aTmpBak = aTmpBak.concat(JsonBak[i][j]['num']);
                            aTmpBak = aTmpBak.concat(JsonBak[i][j]['str']);
                            var iSize1 = aTmpBak.length;

                            for (var k = 0; k < iSize1; k++) {
                                //查找交集
                                var iSize2 = aNewTmp.length;
                                for (var l = 0; l < iSize2; l++) {
                                    if (aTmpBak[k] == aNewTmp[l]) {
                                        aIntersection.push(aTmpBak[k]);
                                    }
                                }
                            }                            
                        }
                    }
                };


                if (!oKey[sJIndex]) {
                    oKey[sJIndex] = [];
                };
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
        //sUrl = sUrl.substring(0, sUrl.length - 5);
        //删除最后一个AND字符
        sUrl = config['url']+'?nodeid='+config['nodeid']+'&tName='+config['tName']+'&pagesize='+config['pagesize']+'&page='+config['page']+'&filter='+sUrl+config['filter'];
        sUrl = encodeURI(sUrl);
        
        return sUrl;
    }
});