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