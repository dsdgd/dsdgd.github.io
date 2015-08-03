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