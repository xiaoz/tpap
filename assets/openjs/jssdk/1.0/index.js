/**
 * @fileOverview jssdk组件的安全适配器
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

        function genWrapper() {
            function wrapper(data) {
                data = cajaAFTB.untame(data);
                if(typeof(data)=="function")
                {
                   frameGroup.markFunction(data);	
                }
                return wrapper.handle.call(this, data);
            }
            return wrapper;
        }


        /**
         * @param context 上下文
         * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
         * @param context.frame 单个模块的沙箱
         * @return {Object} 实际的组件对象
         */
        return function (context) {

            //最终需要返回给
            return {
                TOP:frameGroup.tame({
                    //TOP 的 api函数，第一个为string或者object，第二个为coback function，第三个为boolean
                    api:frameGroup.markFunction(function(a){
                        var param = S.makeArray(arguments);
                        if(param.length>3){
                            param[2] = cajaAFTB.untame(param[2]);
                            var fnc = param[3] ;
                            param[3] = frameGroup.markFunction(function(e){
                                fnc.call(window.TOP,e);
                            });
                        }else{
                            param[0] = cajaAFTB.untame(param[0]);
                        }

                        if(window.TOP){
                            window.TOP.api.apply(this,param);
                        }else{
                            S.log('TOP is not included(jssdk script not loaded)');
                        }
                    }),
                    auth:{
                        getLoginStatus:frameGroup.markFunction(function(){
                            TOP.auth.getLoginStatus.apply(this, arguments);

                        }),
                        getSession:frameGroup.markFunction(function(){
                            return TOP.auth.getSession();
                        }),
                        getUser:frameGroup.markFunction(function(){
                            return TOP.auth.getUser();
                        }),
                        isAuth:frameGroup.markFunction(function(){
                            return TOP.auth.isAuth.apply(this, arguments);
                        }),
                        isLogin:frameGroup.markFunction(function(){
                            return TOP.auth.isLogin.apply(this, arguments);
                        })
                    },
                    ui:frameGroup.markFunction(function(){
                        var param = S.makeArray(arguments);
                        if(param[0] == "authbtn"){
                            param[1] = cajaAFTB.untame(param[1]);
                            //封装callback
                            var wrapper = genWrapper();
                            wrapper.handle = param[1].callback;
                            param[1].callback = wrapper;
                            //封装onload
                             var wrapper1 = genWrapper();
                            wrapper1.handle = param[1].onload;
                            param[1].onload = wrapper1;
                        }
                        return TOP.ui(param[0],param[1]);
                    })
                })
            }
        }

    }

    return init;

});
