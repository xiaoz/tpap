describe('alimap', function () {

    it("alimap init", function () {
        var map = AliMap("#mapDiv");
        var lat = new AliLatLng(30.238747, 120.14532);
        map.centerAndZoom(lat, 15);


        lat = new AliLatLng(30.838747, 120.14532);
        var info = new AliInfoWindow(lat);
        info.setContent("dfdfdfdf");
        map.addOverlay(info);
        info.moveIntoView();

        var marker = new AliMarker(lat);
        map.addOverlay(marker);
        var icons=[
            new AliIcon("http://ditu.aliyun.com/jsdoc/map/example/overlay/icon1.gif",{x:16,y:27},{x:8,y:27}),
            new AliIcon("http://ditu.aliyun.com/jsdoc/map/example/overlay/icon2.png",{x:49,y:59},{x:24,y:56}),
            new AliIcon("http://ditu.aliyun.com/jsdoc/map/example/overlay/icon3.png",{x:49,y:59},{x:24,y:56})
        ];

        marker.setIcon(icons[2]);
        map.setDblClickAction('none');  //centerandzoom, center, zoom, none

        lat = new AliLatLng(30.261875,120.155679);
        map.panTo(lat);
        var aliEvent = new AliEvent();

        aliEvent.addListener(map,'click',function(point){
            console.log(point.x);
        });

        var a = marker.getLatLng();
           console.log(a.la);   //todo 这里是否需要重新组织返回值？
        /*    setInterval(function(){
         map.zoomIn();
         },1000);*/

        var aliEvent = AliEvent();
        AliEvent.addListener(map,'click',function(point){
            console.log('click',point.y);
        });

    });
});
