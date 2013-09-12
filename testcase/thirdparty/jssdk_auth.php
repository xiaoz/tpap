<!--页头公共资源引入-->
<?php include("../common/head.php");?>
<!--script src="http://a.tbcdn.cn/apps/top/x/sdk.js?appkey=12262395"></script-->
<script src="http://l.tbcdn.cn/apps/top/x/sdk.js?appkey=12262395"></script>


<!--
    需要测试的dom结构，注意，最外层<div class="J_TScriptedModule" data-componentid="uniqueSign"> 的class和为属性不可修改
    用户的javascript理论上只可以作用到这个dom下面，不可以"越界"
-->
<div class="J_TScriptedModule" data-componentid="uniqueSign">
    <a class="authbtn">授权</a>
    <!--
    自定义授权按钮
    -->
   <div class="top-authbtn-container"></div>
    <!--
    原始授权按钮
    -->
</div>


<!--模块初始化的包配置，都很熟悉了-->
<script type="text/javascript">




    cajaConfig={//配置下你需要引入的模块名称，最后会被use到
        modules:"openjs/kissy/1.3.0/core,openjs/jssdk/1.0/index"
    }

</script>

<!--这里是将自己的js让服务端编译一下，配置下服务端的php路径和自己的js即可，注意路径-->
<?php 
$jsurl="testcase/thirdparty/jssdk_auth.js";//注意路径
$jsservice="../common/cajoled_service.php";//注意路径
include("../common/foot.php");//引入foot
?>

