$(document).ready(mustBeLoad);

$(window).resize(calcSize);

function mustBeLoad(){
	calcSize();
	codeHeightLight();
};


function calcSize(){//计算屏幕布局最小值时100%平铺屏幕

	var iWinH = $(window).height();
	var iH1 = parseInt($('#Wrap').css('padding-top'));
	var iH2 = $('#WTitle').outerHeight(true);
	var iH3 = parseInt($('#WBody').css('border-top-width'))*2+parseInt($('#WBody').css('padding-top'))*2;
	var iH = iWinH-iH1*2;
	$('#Wrap').css('min-height', iH+'px');
	$('#WBody').css('min-height', iH-iH2-iH3+'px');

};

function codeHeightLight(){
	SyntaxHighlighter.defaults['toolbar'] = false;
	SyntaxHighlighter.defaults['class-name'] = 'pre-code-border';
	SyntaxHighlighter.all();
}