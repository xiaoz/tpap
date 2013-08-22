<?php
$jsurl = "alimap.js";
@require('../common/header.php');
?>
<script src="http://api.ditu.aliyun.com/map.js" type="text/javascript"></script>


<div data-componentid="uniqueSign" class="J_TScriptedModule">
    <div id="mapDiv" style="width:800px;height:600px"></div>
</div>

<script>
    cajaConfig = {
        kissy: {
            alimap: true
        }
    }
</script>

<?php
@include('../common/footer.php');
?>