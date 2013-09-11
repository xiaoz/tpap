/**
 * @fileOverview gs组件的安全适配器
 * @depends
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
        var GS = {};
        GS.addListener = function (name, l) {
            if (!GS.addListener.Fncs[name]) {
                GS.addListener.Fncs[name] = [];
            }
            GS.addListener.Fncs[name].push(l);
        };
        GS.addListener.Fncs = [];

        GS.fireListener = function (name, config) {
            if (GS.fireListener.Fncs[name]) {
                GS.fireListener.Fncs[name](config);
            }
        };
        GS.fireListener.Fncs = [];

        //监听下scroll事件
        (function () {
            Event.on(window, 'scroll', function (e) {
                var event = {
                    scrollTop: S.DOM.scrollTop(window)
                };
                frameGroup.markReadOnlyRecord(event);
                var tameEvent = frameGroup.tame(event);

                if (GS.addListener.Fncs['windowScroll']) {
                    for (var i = 0; i < GS.addListener.Fncs['windowScroll'].length; i++) {
                        GS.addListener.Fncs['windowScroll'][i](tameEvent);
                    }
                }
            });
        })();

        //触发scroll
        (function () {
            GS.fireListener.Fncs['windowScroll'] = function(config){
                config.props = config.props || {};
                var props = {};
                props.scrollTop = config.props.scrollTop ;

                KISSY.Anim(window,props,config.duration,config.easing).run();
            }
        })();

        //监听resize
        (function () {
            Event.on(window, 'resize', function (e) {
                var event = {
                    viewportHeight: DOM.viewportHeight(),
                    viewportWidth: DOM.viewportWidth()
                };
                frameGroup.markReadOnlyRecord(event);
                var tameEvent = frameGroup.tame(event);

                if (GS.addListener.Fncs['windowResize']) {
                    for (var i = 0; i < GS.addListener.Fncs['windowResize'].length; i++) {
                        GS.addListener.Fncs['windowResize'][i](tameEvent);
                    }
                }
            });
        })();

        //提供上传功能
        (function () {
            var genTokenid = "#J_TCajaGenToken"; //页面临时产生token的id标示
            var targetId = "tempCajaIframe";

            /**
             * 构造一个iframe和form
             * @param url form需要提交的url
             * @param token form中的验证地址
             * @returns {{form: void, iframe: void}}
             */
            function construIframeForm(url, token) {
                //gen iframe to submit
                var ifr = DOM.create("<iframe id=''" + targetId + "' name='" + targetId + "'></iframe>");
                DOM.css(ifr, 'display', 'none');

                //gen form from submit
                var form = DOM.create('<form action="' + url + '" target="' + targetId + '" method="post"  enctype="multipart/form-data"></form>');
                DOM.css(ifr, 'display', 'none');
                var input = DOM.create('<input type="hidden" name="token" value="' + token + '"/>');
                form.appendChild(input);

                return {
                    form: form,
                    iframe: ifr
                }
            }


            /**
             * 为页面指定钩子注册事件处理程序
             */
            Event.delegate(document, 'change', 'input.J_TCajaUploadImg', function (e) {
                var tg = e.target;
                /*  IO({
                 type: "post",
                 url: DOM.val(genTokenid),
                 success: function (result) {*/
                var obj = construIframeForm(DOM.attr(tg, 'data-url'), 1/* result.data.token*/);
                DOM.append(tg, obj.form);
                document.body.appendChild(obj.iframe);
                document.body.appendChild(obj.form);
                obj.form.submit();
                /*   },
                 error: function () {
                 alert('服务端出错，token产生失败! 这是不可以理解的事情.');
                 }
                 });*/

                //开发者注册的事件，函数调用
                var tempFunc = function (tameJSON) {
                    if (GS.addListener.Fncs['cajaupload']) {
                        for (var i = 0; i < GS.addListener.Fncs['cajaupload'].length; i++) {
                            GS.addListener.Fncs['cajaupload'][i](tameJSON);
                        }
                    }
                };

                /**
                 * 上传完成后，由iframe内部包装函数触发的事件
                 * 临时创建事件注册，结束后会移除掉
                 * 这里因为需要异步拿token和上传，所以每一次只能上传一个文件
                 * todo 后面增加状态的判断
                 */
                Event.on(window, 'cajaupload', function (json) {
                    //caja 封装返回数据并且调用
                    json = {
                        content: json.content
                    }
                    frameGroup.markReadOnlyRecord(json);
                    var tameJSON = frameGroup.tame(json);
                    tempFunc(tameJSON);

                    //处理后，清楚临时数据
                    Event.remove(window, 'cajaupload');
                    DOM.remove(obj.iframe);
                    DOM.remove(obj.form);
                });

            });

        })();

        GS = frameGroup.markReadOnlyRecord(GS);
        frameGroup.markFunction(GS.addListener);
        frameGroup.markFunction(GS.fireListener);
        var tameGS = frameGroup.tame(GS);
        /**
         * @param context 上下文
         * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
         * @param context.frame 单个模块的沙箱
         * @return {Object} 实际的组件对象
         */
        return function (context) {

            //最终需要返回给
            return {
                GS: tameGS
            }
        }

    }

    return init;

});