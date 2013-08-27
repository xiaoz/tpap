<? include("../common/head.php");?>

<script src="http://api.ditu.aliyun.com/map.js" type="text/javascript"></script>


<div data-componentid="uniqueSign" class="J_TScriptedModule">
    <div id="mapDiv" style="width:800px;height:600px"></div>
</div>

<script>
    KISSY.config(
        {
            debug: false,
            packages: [
                {
                    name: "openjs", //包名
                    tag: "20130527",//时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
                    path:"../../assets", //包对应路径, 相对路径指相对于当前页面路径    //
                    charset: "utf-8" //包里模块文件编码格式
                }
            ]
        }
    );
    cajaConfig={//配置下你需要引入的模块名称，最后会被use到
        modules:"openjs/thirdparty/alimap/1.0/index"
    }
</script>


    <!--这里是将自己的js让服务端编译一下，配置下服务端的php路径和自己的js即可，注意路径-->
<?
$jsurl="testcase/thirdparty/alimap.js";//注意路径
$jsservice="../common/cajoled_service.php";//注意路径
include("../common/foot.php");//引入foot
?>
