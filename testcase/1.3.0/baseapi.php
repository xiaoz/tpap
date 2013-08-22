<!--页头公共资源引入-->
<? include("../common/head.php"); ?>

<!--
    需要测试的dom结构，注意，最外层<div class="J_TScriptedModule" data-componentid="uniqueSign"> 的class和为属性不可修改
    用户的javascript理论上只可以作用到这个dom下面，不可以"越界"
-->

<div id="dom-test" data-componentid="uniqueSign" class="J_TScriptedModule">
    <div class="top-authbtn-container top-login-btn-container"></div>
    <!--    <div id="mapDiv" style="width:800px;height:600px"></div>-->
    <a>test1</a>
    <a>test2</a>
    <input type="text" value="landao" class="inputcls">
    <div class="dom-father">
        <div class="dom-child1"></div>
        <div class="dom-child2"></div>
    </div>
    <div class="kissy-dom">
        <input class="inp1" name="inp1_na" type="text"/>
        <input class="inp2" name="inp2_na" type="checkbox"/>
    </div>
    <div class="select-dom">
        <label>
            <select class='selt'>
                <option value='one'>1</option>
                <option selected>2</option>
            </select>
        </label>
    </div>
    <div class="inner">1111</div>
    <div class="rep-father">
        <div class="rep-child1"></div>
        <div class="rep-child2"></div>
    </div>

    <!--    <input type="text" class="J_Calendar" name="sdfu7"/>-->
    <!---->
    <!--    <input type="text" id="J_AucTitle" name="item-title" value="明河">-->
    <!--    <div id="J_LimiterWrapper"></div>-->
</div>

<!--模块初始化的包配置，都很熟悉了-->
<script type="text/javascript">
    KISSY.config(
        {
            debug: false,
            packages: [
                {
                    name: "openjs", //包名
                    tag: "20130527",//时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
                    path: "../../assets", //包对应路径, 相对路径指相对于当前页面路径    //
                    charset: "utf-8" //包里模块文件编码格式
                }
            ]
        }
    );
    cajaConfig = {//配置下你需要引入的模块名称，最后会被use到
        module: "openjs/1.3.0/core"
    }

</script>

<!--这里是将自己的js让服务端编译一下，配置下服务端的php路径和自己的js即可，注意路径-->
<?
$jsurl = "testcase/1.3.0/baseapi.js"; //注意路径
$jsservice = "../common/cajoled_service.php"; //注意路径
include("../common/foot.php"); //引入foot
?>

