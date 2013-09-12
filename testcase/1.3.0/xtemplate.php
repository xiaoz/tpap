<!--页头公共资源引入-->
<?php include("../common/head.php");?>

<!--
    需要测试的dom结构，注意，最外层<div class="J_TScriptedModule" data-componentid="uniqueSign"> 的class和为属性不可修改
    用户的javascript理论上只可以作用到这个dom下面，不可以"越界"
-->
<div class="J_TScriptedModule" data-componentid="uniqueSign">
	<h2>支持简单的变量替换</h2>
  	<button class="J_supportVariable">测试变量替换</button> </br>
  	<h2>支持函数作为模板</h2>
  	<button class="J_fnTpl">测试函数模板</button> </br>
  	
  	<h2>支持 if 语句</h2>
  	<button class="J_supportIf">测试if 语句</button> </br>
  	
  	<h2>支持 each 语句循环对象数组</h2>
  	<button class="J_supportEachObject">测试each 语句循环对象数组</button> </br>
  	<h2>支持 with 语句</h2>
  	<button class="J_supportWithObject">测试 with 语句</button> </br>
  	<h2>支持注释</h2>
  	<button class="J_supportComment">测试 支持注释</button> </br>
  	<h2>支持 html 转义</h2>
  	<button class="J_supportEscapeHtml">测试 支持 html 转义</button> </br>
  	<h2>支持局部行内命令扩展</h2>
  	<button class="J_supportLocalCommand">测试 支持局部行内命令扩展</button> </br>
  	<h2>支持字符串作为局部子模板</h2>
  	<button class="J_supportStringLocalSubTpl">支持字符串作为局部子模板</button> </br>
  	<h2>支持关系表达式</h2>
  	<button class="J_supportRelationalExpression">测试 支持关系表达式</button> </br>
  	
  
</div>

<!--模块初始化的包配置，都很熟悉了-->
<script type="text/javascript">

     cajaConfig={//配置下你需要引入的模块名称，最后会被use到
         modules:"openjs/kissy/1.3.0/core,openjs/kissy/1.3.0/xtemplate"
     }

</script>

<!--这里是将自己的js让服务端编译一下，配置下服务端的php路径和自己的js即可，注意路径-->
<?php
    $jsurl="testcase/1.3.0/xtemplate.js";//注意路径
    $jsservice="../common/cajoled_service.php";//注意路径
    include("../common/foot.php");//引入foot
?>