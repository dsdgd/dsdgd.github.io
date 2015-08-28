//拖拽事件
define(function (require, exports, module){
	
	function ui(Parent, Child, Arr, Json, config){
		
		var iLens = Arr.length;					//数组长度
		var iMin = 0;						//滚动范围最小值
		var iMax = 100;				//滚动范围最大值	
		var iStep = Math.round(iMax/(iLens-1));	//步长0~10长度11，需走10步1
		var aValues = [0, 100];
		var bReady = true;	//阻止函数重复执行
		
		$(Child).find('input').bind('blur keydown', function(e){
			
			if(e.type == 'blur'){
				fnBind($(this))
			}else{
				
				if(e.which == 13){
					fnBind($(this));
					bReady = false;
				}
			}
			
		});
		
		function fnBind(obj){
			
			this.oTimer = setTimeout(function (){
				bReady = true;
			}, 1500);
			
			if(bReady){
				var iVal = obj.val();
				var iIndex = obj.index() ? 1 : 0;
				var iAttr = findIndex(Arr, iVal) * iStep;
				obj.val(Arr[findIndex(Arr, iVal)]);
				
				$(Parent).slider('values', iIndex, iAttr)				
			}
		};
	
		$(Parent).slider({
			range: true,
			min: iMin,
			max: iMax,
			step: iStep,
			values: aValues,
			create: function(){
				$(Child).children(':first').val( Arr[0] );
				$(Child).children(':last').val( Arr[Arr.length-1] );
				
				$(Child).children(':first').attr('data-initnum', Arr[0]);
				$(Child).children(':last').attr('data-initnum', Arr[Arr.length-1]);
			},
			slide: function( event, ui ){
				var iValF = Arr[Math.round(ui.values[0]/iStep)];
				var iValS = Arr[Math.round(ui.values[1]/iStep)];
				
				$(Child).children(':first').val(iValF);
				$(Child).children(':last').val(iValS);
			},
			change: function( event, ui ){
				//拖拽后鼠标抬起,在此添加ajax查询事件
				var sUrl = require('./data-getKeyWord.js').init(Json, config);
				require('./data-ajax.js').init(sUrl, config);
			}
		});
			         
	};		
	
	exports.ui = ui;
})