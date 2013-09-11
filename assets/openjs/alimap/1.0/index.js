/**
 * @fileOverview 日历组件的安全适配器
 * @depends 依赖于页面中正确的引入了jssdk的库文件
 */
KISSY.add(function (S) {
    var DOM = S.DOM,
        Event = S.Event;

    /**
     * 提供一个init方法，名字任取，最后模块return即可。 用来初始化适配器
     * 初始化方法需要返回一个函数，用来为每个沙箱环境提供适配对象。
     * ps: 页面中可能会有多个安全沙箱环境。init方法内执行的可以理解为所有沙箱共享的一些内容对象，主要提供最原始的安全适配对象和方法。(执行一次,所有沙箱共享)
     *     init返回的函数可以理解是为每个沙箱提供的安全适配对象。(执行多次，每个沙箱对对象的操作不影响其他沙箱)
     *     总结：可以理解为KISSY在frameGroup初始化的时候是一个对象，然后会copy多份，分别放到不同的沙箱环境中去执行。每个copy相互之间不影响
     * @param frameGroup 页面中的沙箱环境，frame即为沙箱，frameGroup为沙箱组。沙箱的公共环境
     * @returns {Function} 工厂获取实际的适配对象
     */
    function init(frameGroup) {


        function SafeAliMap() {
            this.obj = new AliMap(arguments[0]);
        }


        var funs = ('centerAndZoom,addOverlay,closeInfoWindow,openInfoWindow,depose,checkResize,clearOverlays,disableDragging,' +
            'draggingEnabled,enableDragging,endAutoSlide,endAutoSlide,getZoom,isDragging,removeOverlay,setZoom,startAutoSlide,zoomIn,zoomOut,'+
            'setDblClickAction,panTo').split(',');
        frameGroup.markCtor(SafeAliMap);
        SafeAliMap.prototype.centerAndZoom = function (x, y) {
            this.obj.centerAndZoom(new AliLatLng(x.la, x.lo), y);
        };
        SafeAliMap.prototype.addOverlay = function (o) {
            this.obj.addOverlay(o.obj);
        };
        SafeAliMap.prototype.openInfoWindow = function () {
            this.obj.openInfoWindow.apply(this, arguments)
        };
        SafeAliMap.prototype.closeInfoWindow = function () {
            this.obj.closeInfoWindow();
        };
        SafeAliMap.prototype.checkResize = function () {
            this.obj.checkResize();
        };
        SafeAliMap.prototype.clearOverlays = function () {
            this.obj.clearOverlays();
        };
        SafeAliMap.prototype.depose = function () {
            this.obj.depose();
        };
        SafeAliMap.prototype.disableDragging = function () {
            this.obj.disableDragging();
        };
        SafeAliMap.prototype.draggingEnabled = function () {
            this.obj.draggingEnabled();
        };
        SafeAliMap.prototype.enableDragging = function () {
            this.obj.enableDragging();
        };
        SafeAliMap.prototype.endAutoSlide = function () {
            this.obj.endAutoSlide();
        };
        SafeAliMap.prototype.getZoom = function () {
            this.obj.getZoom();
        };
        SafeAliMap.prototype.isDragging = function () {
            this.obj.isDragging();
        };
        SafeAliMap.prototype.removeOverlay = function (o) {
            this.obj.removeOverlay(o.obj);
        };
        SafeAliMap.prototype.setZoom = function (o, b) {
            this.obj.setZoom(o, b);
        };
        SafeAliMap.prototype.startAutoSlide = function (o) {
            this.obj.startAutoSlide(cajaAFTB.untame(o));
        };
        SafeAliMap.prototype.zoomIn = function () {
            this.obj.zoomIn();
        };
        SafeAliMap.prototype.zoomOut = function (o) {
            this.obj.zoomOut(cajaAFTB.untame(o));
        };
        SafeAliMap.prototype.setDblClickAction = function (o) {
            this.obj.setDblClickAction(o);
        };
        SafeAliMap.prototype.panTo = function (x) {
            this.obj.panTo(new AliLatLng(x.la, x.lo));
        };


        S.each(funs, function (fn) {
            frameGroup.grantMethod(SafeAliMap, fn);
        });


        //--------------------------------------

        function SafeAliLatLng() {
            var obj = new AliLatLng(arguments[0], arguments[1]),
                self = this;
            self.lo = obj.lo;
            self.la = obj.la;
            this.lat = function () {
                return self.la;
            };
            this.equals = function () {
                return self.equals.apply(window, arguments);
            };
            this.lng = function () {
                return self.lo;
            }
        }

        funs = ('lat,lng').split(',');
        frameGroup.markCtor(SafeAliLatLng);

        S.each(funs, function (fn) {
            frameGroup.grantMethod(SafeAliLatLng, fn);
        });

        //------------------------

        //--------------------------------------

        function SafeAliMarker() {
            this.obj = new AliMarker(new AliLatLng(arguments[0].la, arguments[0].lo), cajaAFTB.untame(arguments[1]));
        }

        funs = ('depose,setLatLng,setOpacity,setTitle,openInfoWindow,getIcon,setIcon,getLatLng').split(',');
        frameGroup.markCtor(SafeAliMarker);

        SafeAliMarker.prototype.depose = function () {
            this.obj.depose();
        };
        SafeAliMarker.prototype.setLatLng = function (o) {
            this.obj.setLatLng(new AliLatLng(o.la, o.lo));
        };
        SafeAliMarker.prototype.setOpacity = function (o) {
            this.obj.setOpacity(o);
        };
        SafeAliMarker.prototype.setTitle = function (o) {
            this.obj.setTitle(o);
        };
        SafeAliMarker.prototype.openInfoWindow = function (o) {
            this.obj.openInfoWindow.apply(this, arguments)
        };
        SafeAliMarker.prototype.getIcon = function () {
            this.obj.getIcon()
        };
        SafeAliMarker.prototype.setIcon = function (o) {   //注意，apply一个函数和直接调用该函数是不一样的
            this.obj.setIcon(new AliIcon(o.image, o.iconSize, o.iconAnchor))
        };
        SafeAliMarker.prototype.getLatLng = function () {
            return new SafeAliLatLng(this.obj.getLatLng().lat(),this.obj.getLatLng().lng());
        };


        S.each(funs, function (fn) {
            frameGroup.grantMethod(SafeAliMarker, fn);
        });

        //--------------------------------------

        function SafeAliInfoWindow(a) {
            this.obj = new AliInfoWindow(new AliLatLng(a.la, a.lo));
        }

        funs = ('close,depose,setContent,setLatLng,setRender,setTitle,setOpacity,moveIntoView').split(',');
        frameGroup.markCtor(SafeAliInfoWindow);

        SafeAliInfoWindow.prototype.close = function () {
            return this.obj.close();
        };
        SafeAliInfoWindow.prototype.depose = function () {
            return this.obj.depose();
        };

        SafeAliInfoWindow.prototype.moveIntoView = function () {
            this.obj.moveIntoView();
        };
        SafeAliInfoWindow.prototype.setContent = function () {
            return this.obj.setContent(arguments[0], arguments[1]);
        };
        SafeAliInfoWindow.prototype.setLatLng = function () {
            return this.obj.setLatLng(arguments[0].la, arguments[0].lo);
        };

        SafeAliInfoWindow.prototype.setOpacity = function () {
            return this.obj.setOpacity(arguments[0]);
        };
        SafeAliInfoWindow.prototype.setRender = function () {
            return this.obj.setRender(arguments[0], cajaAFTB.untame(arguments[1]));
        };
        SafeAliInfoWindow.prototype.setTitle = function () {
            return this.obj.setTitle(arguments[0]);
        };


        S.each(funs, function (fn) {
            frameGroup.grantMethod(SafeAliInfoWindow, fn);
        });

        function SafeAliPoint(){
            var self = this;
            var obj = new AliPoint(arguments[0],arguments[1]);
            self.x = obj.x;
            self.y = obj.y;
        }

        //--------------------------------------

        function SafeAliIcon() {
            var self = this;
            self.obj = new AliIcon(arguments[0],new AliPoint(arguments[1].x,arguments[1].y),new AliPoint(arguments[2]).x,arguments[2].y);

            self.image = self.obj.image;
            self.iconSize = self.obj.iconSize;
            self.iconAnchor = self.obj.iconAnchor;
        }

        funs = ('getCopy').split(',');
        frameGroup.markCtor(SafeAliIcon);

        SafeAliIcon.prototype.getCopy = function () {
            return this.obj.getCopy();
        };

        S.each(funs, function (fn) {
            frameGroup.grantMethod(SafeAliIcon, fn);
        });


        /**
         * @param context 上下文
         * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
         * @param context.frame 单个模块的沙箱
         * @return {Object} 实际的组件对象
         */
        return function (context) {

            //最终需要返回给
            return {
                AliMap: frameGroup.tame(frameGroup.markFunction(function (a) {
                    return new SafeAliMap(DOM.get(a,context.mod));
                })),
                AliPoint: frameGroup.tame(frameGroup.markFunction(function (a,b) {
                    return new SafeAliPoint(a,b)
                })),
                AliIcon: frameGroup.tame(frameGroup.markFunction(function (x, y, z) {
                    return new SafeAliIcon(x, y, z)
                })),
                AliMarker: frameGroup.tame(frameGroup.markFunction(function (a, b) {
                    return new SafeAliMarker(a, b);
                })),
                AliInfoWindow: frameGroup.tame(frameGroup.markFunction(function (a, b) {
                    return new SafeAliInfoWindow(a);
                })),
                AliLatLng: frameGroup.tame(frameGroup.markFunction(function (x, y) {
                    return new SafeAliLatLng(x, y)
                })),
                AliEvent: frameGroup.tame({
                    addListener:frameGroup.markFunction(function () {
                        var param = arguments;
                        AliEvent.addListener(param[0].obj,param[1], frameGroup.markFunction(function(e){
                            var tmp;
                            if(e.x){
                                tmp = {
                                    x: e.x,
                                    y: e.y
                                }
                            }
                            if(e.la){
                                tmp = new SafeAliLatLng(e.la, e.lo);
                            }
                            param[2].call(this,tmp); //frameGroup.tame(point)
                        }));
                    })
                })
            }
        }

    }

    return init;

});