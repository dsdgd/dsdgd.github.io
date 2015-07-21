<?php
function HTTP_GET($url){
	$ch = curl_init($url) ;   
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true) ; // 获取数据返回   
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, true) ; // 在启用 CURLOPT_RETURNTRANSFER 时候将获取数据返回   
	echo $output = curl_exec($ch) ; 
};

$id = 409;
$URL = 'http://120.24.86.98:8088/Category_'.$id.'/Index.aspx?'.$_SERVER["QUERY_STRING"];
HTTP_GET($URL);
?>