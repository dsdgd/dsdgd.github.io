//获取筛选值并返回URL
define({
    init: function(Json, config) {
        var sUrl = "";
        var JsonData = Json["Rows"];
        var JsonBak = Json["Rows"];
        var oKey = {};//存放按钮关键字
        var oSliderKey = {};//存放拖拽滚动关键字
        
        $(".zlg-more-btns, .zlg-btns-data").each(function() {
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

/*********************************************************************/

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

                oSliderKey[sJIndex] = sJIndex + " between (" + sV1 + " and " + sV2 + ")";

            }
        });



/**********************************************************************/
       
        for(var i in oKey){
            //URL字符串拼接
            var s1 = "";
            for (var j = 0; j < oKey[i].length; j++) {
                s1 += "$" + oKey[i][j] + "$";
            }
            s1 = i + "=" + s1;
            sUrl += s1 + " AND ";
        };

        for(var i in oSliderKey){
            sUrl += oSliderKey[i] + " AND ";
        };

        sUrl = config['url']+'?nodeid='+config['nodeid']+'&tName='+config['tName']+'&pagesize='+config['pagesize']+'&page='+config['page']+'&filter='+sUrl+config['filter'];
        
        sUrl = encodeURI(sUrl);
        
        return sUrl;
    }
});