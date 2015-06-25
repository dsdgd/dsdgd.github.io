window.onload = function (){

	var aLi = $('Tree').getElementsByTagName('li');
	var iLen = aLi.length;
	var iH = aLi[0].firstChild.offsetHeight;//闭合高度

	for(var i = 0; i < iLen; i++){
		var obj = aLi[i].firstChild.firstChild;//<i>
		aLi[i].status = false;	//状态:展开true, 闭合false
		bind(obj, 'click', fnClick);
	};

	/**分割**/
	function fnClick(){
		if(this.status){
			setHeight(this, true);//闭合
			this.status = false;
			this.parentNode.className = 'tree-hide';
		}else{
			setHeight(this, false);//展开
			this.status = true;
			this.parentNode.className = 'tree-show';
		}
		
	};

	function setHeight(obj, status){

		var oNext = getNextSibling(obj.parentNode);//当前对象下一个相邻的<ul>

		if(!oNext)return;//不存在下一级则不执行下去

		var oNChild = oNext.children;//下一个相邻对象<ul>的<li>
		var oParent = obj.parentNode.parentNode;//当前对象的父级<li>
		var oRecursion = getPreviousSibling(oParent.parentNode) ? getPreviousSibling(oParent.parentNode).firstChild : null;//当前对象的父级<ul>的上一个含点击事件的对象<i>
		
		var iLen = oNChild.length;
		var iAttrH = 0;//下一个相邻<ul>的高度
		var iSum = 0;//上一级<li>的高度

		for(var i = 0; i < iLen; i++){
			iAttrH += oNChild[i].offsetHeight;
		};

		status ? iSum = iH : iSum = iH + iAttrH;

		oNext.style.height = iAttrH + 'px';//<ul>
		oParent.style.height = iSum + 'px';//<li>
		
		//animate(oNext, {'height':iAttrH}, 10);
		//animate(oParent, {'height':iSum}, 10);

		if(oRecursion){
			setHeight(oRecursion, status)
		};
	};



};
/**end**/

function $(selector){//选择器
	return document.getElementById(selector);
};

function getNextSibling(obj){//获取下一个兄弟节点
	var o = obj.nextSibling;
	o && o.nodeType!=1 ? o = o.nextSibling : false;
	return o;
};

function getPreviousSibling(obj){//获取上一个兄弟节点
	var o = obj.previousSibling;
	o && o.nodeType!=1 ? o = o.previousSibling : false;
	return o;
};

function bind(obj, event, fn){//事件绑定
	window.attachEvent ? obj.attachEvent('on'+event, fn) : obj.addEventListener(event, fn, false);
};

function unbind(obj, event, fn){//删除事件绑定
	window.detachEvent ? obj.detachEvent('on'+event, fn) : obj.removeEventListener(event, fn, false);
};

function animate(obj, attrJson, speeds, fnEnd){//运动
	
	clearInterval(obj.timer);

	var cur = 0;//存放样式值

	obj.timer = setInterval(function (){

		var bStop = true;//假设：所有值都运动完毕
		
		for(var name in attrJson){

			if(name === 'opacity'){//获取运动中的样式
				cur = Math.round( parseFloat(getStyle(obj, name) * 100) );
			}else{
				cur = parseInt(getStyle(obj, name));
			};

			var speed = (attrJson[name] - cur) / speeds;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			var iSp = cur+speed;//设置运动速度
			
			if(cur != attrJson[name]){//检测是否到达目标
				bStop = false
			};
			
			if(name === 'opacity'){//运动赋值
				obj.style[name] = iSp/100;
				obj.style.filter = 'alpha(opacity='+iSp+')';
			}else{
				obj.style[name] = iSp+'px';
			}
		};

		if(bStop){//回调函数
			clearInterval(obj.timer);
			if(fnEnd)fnEnd();
		}

	}, 17)

};

function getStyle(obj, name){//获取样式
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return getComputedStyle(obj, false)[name];
	}
};
