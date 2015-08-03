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