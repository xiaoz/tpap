describe('alimap', function () {

    it("alimap init", function () {
        var map = AliMap("#mapDiv");
        var lat = new AliLatLng(30.238747, 120.14532);
        map.centerAndZoom(lat, 15);
      /*  var marker =AliMarker(lat);
        map.addOverlay(marker);
        map.openInfoWindow(lat,'sdfsdfsdfsdf','content');*/


          /*  map.closeInfoWindow();

            map.centerAndZoom(lat, 15);
            marker.depose();*/

        lat = new AliLatLng(30.838747, 120.14532);
        var info = new AliInfoWindow(lat);
            info.setContent("dfdfdfdf");
            map.addOverlay(info);
        info.moveIntoView();
        setInterval(function(){

            map.zoomIn();
        },1000)

    });

});
