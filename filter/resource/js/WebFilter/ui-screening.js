//筛选数据UI
define(function(require, exports, module) {
    function ui(Json, config) {

        var aTitle = Json['Param'];
        var aData = Json['Rows'];
        var aAlias = Json['alias'];
        var iLen1 = aTitle.length;
        var iLen2 = aData.length;

        var sAllHtml = [];//存放所有html集合
        var aId1 = [], aId2 = [], aJsonNum = [];//存放不同类型html集合
        var aId01 = [], aId02 = [];//存放ID集合

        var iTimestamp = new Date().getTime();//当前时间戳
        var iNum1 = iTimestamp, iNum2 = iTimestamp;
        var iNum01 = iTimestamp, iNum02 = iTimestamp;


        
        for(var i = 0; i < iLen1; i++){

            //----只有一个参数值（0，空，-）的字段则不生成dom
            if( aData[i][ aTitle[i] ]['num'].length == 0 && aData[i][ aTitle[i] ]['str'].length == 0 ){
                continue;
            }else if( aData[i][ aTitle[i] ]['num'].length == 1 && aData[i][ aTitle[i] ]['num'][0] == 0 ){
                continue;
            }else if( aData[i][ aTitle[i] ]['str'].length == 1 && aData[i][ aTitle[i] ]['str'][0] == '-' ){
                continue;
            };

            //----定义一组html
            var sHtml1 = $('<dl class="zlg-screen-cont clearFix"></dl>');
            var sHtml2 = $('<dt class="fl"></dt>');
            var sHtml3 = $('<dd class="fr"></dd>');

            //----添加标题、属性
            sHtml2.attr("title", aAlias[i]);
            sHtml2.attr("data-name", aTitle[i]);
            sHtml2.html('<span class="zlg-screen-cont-title">'+aAlias[i]+'</span><span class="zlg-reset-one"></span>');

            var oRows = aData[i][ aTitle[i] ];//json→{str:[], num:[]}

            if( oRows['num'].length >= 8 ){//生成滑动条html
                //----元素ID
                var sId1 = "ZlgRange" + ++iNum1;
                var sId2 = "ZlgSlider" + ++iNum2;

                aId1.push(sId1);
                aId2.push(sId2);

                var sHtml4 = $('<div id="' + sId2 + '" class="zlg-slider fl" data-name="' + aTitle[i] + '"></div>');
                var sHtml5 = $('<input class="fl" type="text" value=""/>');
                var sHtml6 = $('<div id="' + sId1 + '" class="zlg-range fl"></div>');
                var sHtml7 = $('<input class="fr" type="text" value=""/>');

                aJsonNum.push(oRows['num']);
                sHtml4.append(sHtml5, sHtml6, sHtml7);
                sHtml3.prepend(sHtml4);
            };

            if( oRows['num'].length < 8 || oRows['str'].length > 0 ){//生成按钮html
                //----元素ID
                var sId1 = "ZlgBtnsChosen" + ++iNum01;
                var sId2 = "ZlgBtnsData" + ++iNum02;

                aId01.push(sId1);
                aId02.push(sId2);

                var sHtml4 = $('<div class="zlg-btns fr"></div>');
                var sHtml5 = $('<div id="' + sId1 + '" class="zlg-btns-chosen" title="更多筛选参数">更多</div>');
                var sHtml6 = $('<ul id="' + sId2 + '" class="zlg-btns-data" data-name="' + aTitle[i] + '"></ul>');
                var sHtml7 = "";

                for(var j in oRows){//拼接html

                    var iLen = oRows[j].length;

                    if(j === 'str' && iLen > 0){

                        for(var k = 0; k < iLen; k++){
                            sHtml7 += '<li title="' + oRows[j][k] + '"><input type="checkbox">' + oRows[j][k] + "</li>";
                        }

                    }else if(j === 'num' && iLen < 8){

                        for(var k = 0; k < iLen; k++){
                            sHtml7 += '<li title="' + oRows[j][k] + '"><input type="checkbox">' + oRows[j][k] + "</li>";
                        }

                    }

                };

                sHtml6.append(sHtml7);
                sHtml4.append(sHtml5, sHtml6);
                sHtml3.append(sHtml4);

            };



            //----html集合
            sHtml1.append(sHtml2, sHtml3);
            sAllHtml.push(sHtml1);

        };

        //生成html
        $("#ZlgScreenMain").append(sAllHtml);
        
        for (var i = 0; i < aId1.length; i++) {
            //添加滑动条ui事件
            require("./ui-slider").ui("#" + aId1[i], "#" + aId2[i], aJsonNum[i], Json, config);
        };

        for (var i = 0; i < aId01.length; i++) {
            //添加筛选按钮ui事件
            require("./ui-checkbox").ui("#" + aId01[i], "#" + aId02[i], Json, config);
        };

        //展现部分下拉框的关键词
        require("./ui-moreKey").ui(Json, config);

    }
    exports.ui = ui;
});