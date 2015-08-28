//初始化
define(function (require, exports, module){

	function init(config){
/***************************************************
*
*			网站选型表插件
*				【参数说明】:
*
config = {
	'url' 		: 	//Str 请求地址
	'nodeid' 	: 	//Int 节点ID,
	'tName' 	: 	//Str 模型,
	'pagesize'	: 	//Int 单页数据量,
	'page'		: 	//Int 页码,
	'filter'	: 	//Str 初始筛选条件,
	'title'		: 	//Str 筛选字段,
	'tabTitle'	: 	//Str 表格字段,
	'ifShow'	: 	//Str hide=隐藏选型表 选型表筛选参数区是否显示!
}
***************************************************/
		jQuery(document).ready(function (){

			var aTitle =  config['title'].split(',');
			var aTabTitle =  config['tabTitle'].split(',');

			var iLen1 = aTitle.length;
			var iLen2 = aTabTitle.length;

			config['key'] = [];
			config['title'] = [];
			config['tabKey'] = [];
			config['tabTitle'] = [];

			for(var i = 0; i < iLen1; i++){
				config['key'].push( aTitle[i].split(':')[0] );
				config['title'].push( aTitle[i].split(':')[1] );
			};

			for(var i = 0; i < iLen2; i++){
				config['tabKey'].push( aTabTitle[i].split(':')[0] );
				config['tabTitle'].push( aTabTitle[i].split(':')[1] );
			};
				
			var sData = 'nodeid='+config['nodeid']+'&tName='+config['tName']+'&pagesize='+100000+'&page='+config['page']+'&filter='+config['filter'];
			sData = encodeURI(sData);
			sData = sData.replace(/[+]/g, '%2b');
			
			$.ajax({
				async: true,
				context: document.body,
				url: config['url'],
				data: sData,
				dataType: 'text',
				beforeSend: function(){
					var oLoading = $('<div id="ZlgLoading1" class="zlg-loading"></div>');
					$('#ZlgScreenMain').append(oLoading);
					if( config['ifShow'] == '隐藏选型表'){
						$('.zlg-screening').hide()
					};
				},
				error: function (){
					alert('╮(╯﹏╰)╭网络故障,数据请求失败！')
				},
				success: function(Json){
					
					$('#ZlgLoading1').remove();
					Json = eval('('+Json+')');

					Json['alias'] = config['title'];
					
					//解析筛选数据
					var oJson = require('./data-processing.js').init(Json, true, config);
					
					//生成筛选数据UI
					require('./ui-screening.js').ui(oJson, config);
					require('./ui-toggle.js').ui();
					
					//发送表头数据请求
					var sData = 'nodeid='+config['nodeid']+'&tName='+config['tName']+'&pagesize='+config['pagesize']+'&page='+config['page']+'&filter='+config['filter'];
					var sUrl = config['url'] + '?' + sData;
					sUrl = encodeURI(sUrl);
					sUrl = sUrl.replace('+', '%2b');
					require('./data-ajax.js').init(sUrl, config);
					
					//重置UI
					require('./ui-reset.js').init('#ZlgReset', config, oJson, sUrl);
					require('./ui-reset.js').init('.zlg-reset-one', config, oJson);
				}
			})
		})//End
	};
	
	exports.init = init;
	
});

	


/***************************************************
*
*			通用函数
*
***************************************************/
		
Array.prototype.unique = function(){	//数组去重
	var n = {},r=[];
	for(var i = 0; i < this.length; i++){
		if (!n[this[i]]){
			n[this[i]] = true;
			r.push(this[i]);
		}
	}
	return r;
};

function findIndex(arr, num){//查询数组中最接近目标数字的数字下标
	var iLen = arr.length-1;
	var aTmp1 = Math.abs(num-arr[0]);
	var aTmp2 = 0;
	var iRes = 0;
	
	for(var i = 0; i < iLen; i++){
		aTmp2 = Math.abs(num-arr[i+1]);
					
		if(aTmp1 >= aTmp2){//min aTmp2
			aTmp1 = aTmp2;
			iRes = i+1;
		}
	};
	return iRes;
};