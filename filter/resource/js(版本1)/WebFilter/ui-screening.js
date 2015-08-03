//筛选数据UI
define(function(require, exports, module) {
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
                    
                    if(JsonData[i]["num"].length > 8){
                        //生成滑动条ui
                        var sId1 = "ZlgRange" + ++iNum1;
                        var sId2 = "ZlgSlider" + ++iNum2;
                        var sHtml4 = $('<div id="' + sId2 + '" class="zlg-slider fl" data-name="' + i + '"></div>');
                        var sHtml5 = $('<input class="fl" type="text" value=""/>');
                        var sHtml6 = $('<div id="' + sId1 + '" class="zlg-range fl"></div>');
                        var sHtml7 = $('<input class="fr" type="text" value=""/>');
                        aId1.push(sId1);
                        aId2.push(sId2);
                        aJsonNum.push(JsonData[i][j]);
                        sHtml4.append(sHtml5, sHtml6, sHtml7);
                        sHtml3.prepend(sHtml4);
                    }

                }else if(j == "str") {

                    if(JsonData[i]["num"].length < 8){
                        JsonData[i]["str"] = JsonData[i]["str"].concat(JsonData[i]["num"]);
                    }

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
		for(var i = 0; i < OrderBy.length; i++){
			for(var j = 0; j < sAllHtml.length; j++){
				var s = $(sAllHtml[j]).children(':first').attr('data-name');
				if(s == OrderBy[i]){
					sAllHtmlNew.push(sAllHtml[j])
				}
			}
		}
		
		//生成html
		$("#ZlgScreenMain").append(sAllHtmlNew);
		
        for (var i = 0; i < aId1.length; i++) {
            //添加滑动条ui事件
            require("./ui-slider").ui("#" + aId1[i], "#" + aId2[i], aJsonNum[i], Json, url);
        }
        for (var i = 0; i < aId01.length; i++) {
            //添加筛选按钮ui事件
            require("./ui-checkbox").ui("#" + aId01[i], "#" + aId02[i], "#" + aId03[i], "#" + aId04[i], Json, url);
        }
        //展现部分下拉框的关键词
        require("./ui-moreKey").ui(Json, url);
    }
    exports.ui = ui;
});