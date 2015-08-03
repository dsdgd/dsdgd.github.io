//表格头部固定事件
define(function (require, exports, module){
	
	function init(obj, bool, append){//obj:表格对象, bool:左一栏锁定→true:锁定,false:不锁定 {'L':true, 'T':false}, append:存放复制的数据对象
		
		if( $(obj).size() != 0 ){

			var oTmp1 = $('<table></table>');//顶部表头
			var oTmp2 = $('<table></table>');//左侧表头
			var oTmp3 = $('<table></table>');//左上角表头

			var bAndroid = navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") > -1;
			var bMac = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			var bIe8 = navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8.";
			var bIe7 = window.navigator.userAgent.indexOf("MSIE 7.0") !== -1;
			var bChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
			var bSafari = window.navigator.userAgent.indexOf("Safari") !== -1;
			var isFirefox = window.navigator.userAgent.indexOf("Firefox") > 0;

			var iMoreW = 0, iMoreH = 0;//不同设备额外添加的宽高

			var iST = $(window).scrollTop(), iSL = $(window).scrollLeft();//滚动条静止时位置，用于判断滚动条方向

			oTmp1.css({'position' : 'absolute', 'top' : '0', 'left' : '0'});
			oTmp2.css({'position' : 'absolute', 'top' : '0', 'left' : '0'});
			oTmp3.css({'position' : 'absolute', 'top' : '0', 'left' : '0'});

			function appendTop(){

				if(bool['T']){

					var oHead = $(obj).find('tr:first').clone();//复制顶部表头

					$(obj).find('tr:first td').each(function (i){

						var w1 = $(this).width()+iMoreW+'px';
						var w2 = $(this).width()+iMoreW+'px';
						oHead.find('td').eq(i).html( '<div style="min-width:'+w1+';max-width:'+w2+';">'+ $(this).html() +'</div>' );

					});

					oTmp1.append(oHead);
					$(append).append(oTmp1);

				};

				if(bool['L']){
					
					$(obj).find('tr').each(function (i){

						var w1 = $(this).find('td:first').width()+iMoreW+'px';
						var w2 = $(this).find('td:first').width()+iMoreW+'px';

						var oLeft = $(this).find('td:first').clone();
						var oTmpTr1 = $('<tr></tr>');
						var oTmpTr2 = $('<tr></tr>');
						
						if( iMoreH > 0 && i > 0 ){

							var h1 = $(this).find('td:first').height()+iMoreH+'px';
							var h2 = $(this).find('td:first').height()+iMoreH+'px';
							oLeft.html( '<div style="min-width:'+w1+';max-width:'+w2+';height:'+h1+';">'+ oLeft.html() +'</div>' );

						}else{

							oLeft.html( '<div style="min-width:'+w1+';max-width:'+w2+';">'+ oLeft.html() +'</div>' );

						};

						if(i == 0){
							var oLeftTop = $(this).find('td:first').clone();
							oLeftTop.html( '<div style="min-width:'+w1+';max-width:'+w2+';">'+ oLeftTop.html() +'</div>' );
							oTmpTr2.append(oLeftTop);
							oTmp3.append(oTmpTr2);
						};
						
						oTmpTr1.append(oLeft);
						oTmp2.append(oTmpTr1);

					});

					$(append).append(oTmp2,oTmp3);

				}

			};

			//固定宽度
			if(bAndroid){//安卓
				appendTop();
				
			}else if(bMac){//苹果
				appendTop();					
				
			}else if(bIe7){//IE7
				
			}else if(bIe8){//IE8
				iMoreW = 1;
				appendTop();					
				
			}else if(bChrome){//Chrome
				iMoreW = 1;
				appendTop();
				
			}else if(bSafari){//Safari
				iMoreW = 1;
				appendTop();					
				
			}else if(isFirefox){//Firefox
				iMoreW = 0;
				appendTop();

			}else{//其他 or IE
				iMoreW = 1;
				appendTop();				
			};



			var iT = $(obj).offset().top;
			var iL = $(obj).offset().left;
			var iW = $(obj).width();
			var iH = $(obj).height();

			setInterval(function (){
				iT != $(obj).offset().top ? iT = $(obj).offset().top : false;
				iL != $(obj).offset().left ? iL = $(obj).offset().left : false;

				var iNowT = $(this).scrollTop();
				var iNowL = $(this).scrollLeft();

				move(iT, iL, iNowT, iNowL);
			}, 30);
			
			$(window).scroll(function (){

				var iNowT = $(this).scrollTop();
				var iNowL = $(this).scrollLeft();

				move(iT, iL, iNowT, iNowL);

			});

			$(window).resize(function (){

				iT = oTmp1.offset().top;
				iL = oTmp1.offset().left;

				var iNowT = $(this).scrollTop();
				var iNowL = $(this).scrollLeft();

				move(iT, iL, iNowT, iNowL);

			});

			function move(T, L, Tn, Ln){

				if( T > Tn && L > Ln ){
					setStyle(
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0}
					)
				}else if( T > Tn && L < Ln ){
					setStyle(
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'fixed', 'L':0, 'T':(T-Tn), 'Z':1},
						{'P':'fixed', 'L':0, 'T':(T-Tn), 'Z':2}
					)
				}else if( T < Tn && L > Ln ){
					setStyle(
						{'P':'fixed', 'L':(L-Ln), 'T':0, 'Z':1},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0}
					)
				}else if( T < Tn && L < Ln ){
					setStyle(
						{'P':'fixed', 'L':(L-Ln), 'T':0, 'Z':0},
						{'P':'fixed', 'L':0, 'T':(T-Tn), 'Z':1},
						{'P':'fixed', 'L':0, 'T':0, 'Z':2}
					)
				};

				if( iH+T <= Tn ){
					setStyle(
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0}
					)
				}else if( iW+L <= Ln ){
					setStyle(
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0},
						{'P':'absolute', 'L':0, 'T':0, 'Z':0}
					)
				}

			};

			function setStyle(o1, o2, o3){

				oTmp1.css({
					'position' : o1['P'],
					'left' : o1['L']+'px',
					'top' : o1['T']+'px',
					'z-index' : o1['Z']
				});

				oTmp2.css({
					'position' : o2['P'],
					'left' : o2['L']+'px',
					'top' : o2['T']+'px',
					'z-index' : o2['Z']
				});

				oTmp3.css({
					'position' : o3['P'],
					'left' : o3['L']+'px',
					'top' : o3['T']+'px',
					'z-index' : o3['Z']
				});

			};

			


		}
	};
	
	exports.init = init;
	
})