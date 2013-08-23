/**
 * @fileOverview core组件的安全适配器
 */
KISSY.add(function (S, Calendar) {
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

        /**
         * parse url  easy way but ugly
         * @param url
         * @return {Object}
         */
        function parseURL(url) {
            if (url.indexOf("http://") !== 0) { //相对路径
                return {
                    url: document.location.hostname
                };
            }
            var parser = document.createElement('a');
            parser.href = url;
            var p = KISSY.clone({url: parser.hostname});
            parser = null;
            return p;
        }


        /**
         * untame 属性
         */
            // 声明外部类库构造器以及函数
        frameGroup.markCtor(S.Anim);
        frameGroup.grantMethod(S.Anim, "run");
        frameGroup.grantMethod(S.Anim, "stop");
        frameGroup.grantMethod(S.Anim, "isRunning");
        frameGroup.grantMethod(S.Anim, "isPaused");
        frameGroup.grantMethod(S.Anim, "pause");
        frameGroup.grantMethod(S.Anim, "resume");

        /**
         * 链式写 需要注意的是，避免暴露原生dom节点给外部
         * 需要开放的方法说明
         * 不开放的接口 append prepend before after html attr相关 prop hasProp css index data removeData hasData unselectable
         */
            // 声明外部类库构造器以及函数
        S.NodeList.prototype.constructor = S.NodeList;
        frameGroup.markCtor(S.NodeList);
        var nodeFuncs = ('c_getDOMNodes end equals c_add item slice scrollTop scrollLeft height width' +
            ' c_appendTo c_prependTo c_insertBefore c_insertAfter c_animate stop run pause resume isRunning isPaused' +
            ' show hide toggle fadeIn fadeOut' +
            ' fadeToggle slideDown slideUp slideToggle c_filter test clone empty replaceWith' +
            ' parent hasClass c_addClass removeClass replaceClass toggleClass ' +
            'val text toggle offset scrollIntoView c_next c_prev c_first' +
            ' c_last c_siblings c_children contains remove  ' +
            'contains innerWidth innerHeight outerWidth outerHeight c_on c_delegate c_detach fire all len c_attr c_removeAttr c_hasAttr ' +
            'c_data c_hasData c_removeData').split(' ');

        /**
         * EventObject 的回调属性获取
         */
        var EventObject = S.EventObject || S.Event.DOMEventObject;//兼容kissy1.1.6 和 kissy1.3.0
        frameGroup.markCtor(EventObject);
        frameGroup.grantMethod(EventObject, "halt");
        frameGroup.grantMethod(EventObject, "preventDefault");
        frameGroup.grantMethod(EventObject, "stopImmediatePropagation");
        frameGroup.grantMethod(EventObject, "stopPropagation");
        var props = ('altKey attrChange attrName bubbles button cancelable ' +
            'charCode clientX clientY ctrlKey currentTarget data detail ' +
            'eventPhase fromElement handler keyCode layerX layerY metaKey ' +
            'newValue offsetX offsetY originalTarget pageX pageY prevValue ' +
            'relatedNode relatedTarget screenX screenY shiftKey srcElement ' +
            'target toElement view wheelDelta which axis type').split(' ');
        S.each(props, function (p) {
            frameGroup.grantRead(EventObject.prototype, p);
        });

        //url白名单 magine.taotaosou.net
        var urlIO = [/^(imagine\.taotaosou\.net)$|.\.(imagine\.taotaosou\.net)/, /.\.taobao\.(net)$/, /.\.taobaoapps\.(net)$/, /^(taegrid\.taobao\.com)$|.\.(taegrid\.taobao\.com)/, /^(uz\.taobao\.com)$|.\.(uz\.taobao\.com)/];


        /**
         * @param context 上下文
         * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
         * @param context.frame 单个模块的沙箱
         * @return {Object} 实Fs际的组件对象
         */
        return function (param) {

            // 限定模块的选择器范围，所以获取节点的api，均需要通过该函数获取一下
            // 将范围限定到caja容器之内
            function query(s, context) {
                var ret = [];
                if (context) {
                    context = query(context);
                } else {
                    context = [];
                }

                if (S.isString(s)) {
                    ret = S.query(s, context[0] || param.mod);
                } else {
                    ret = S.query(s);
                }

                return ret;
            }

            //讲原生node节点，进行tame封装
            function tame(n) {
                return param.frame.imports.tameNode___(n, true);
            }

            function genWrapper() {
                function wrapper(e) {
                    if (e.target) {
                        e.target = tame(e.target);
                    }
                    if (e.relatedTarget) {
                        e.relatedTarget = tame(e.relatedTarget);
                    }
                    if (e.currentTarget) {
                        e.currentTarget = tame(e.currentTarget);
                    }
                    return wrapper.handle.call(this, e);
                }

                return wrapper;
            }

            /**
             * Event on 因为这里需要处理 e.target的tame问题，所以需要额外做一些事情
             * Event remove 参考 Event on的写法， by 石霸
             * @author 承玉
             */
            var Event_On = frameGroup.markFunction(function (s, event, handle, scope) {
                var wrapper = genWrapper();
                wrapper.handle = handle;
                handle.__event_tag = handle.__event_tag || [];
                var els = query(s);
                S.each(els, function (el) {
                    handle.__event_tag.push({
                        fn: wrapper,
                        el: el,
                        scope: scope || el
                    });
                });
                S.Event.on(els, event, wrapper, scope);
            });

            var Event_Delegate = frameGroup.markFunction(function (s, event, filter, handle, scope) {
                var wrapper = genWrapper();
                wrapper.handle = handle;
                handle.__event_tag = handle.__event_tag || [];
                var els = query(s);
                S.each(els, function (el) {
                    handle.__event_tag.push({
                        fn: wrapper,
                        el: el,
                        filter: filter,
                        scope: scope || el
                    });
                });
                S.Event.delegate(els, event, filter, wrapper, scope);
            });

            var Event_Remove = frameGroup.markFunction(function (s, event, handle, scope) {
                var els = query(s);
                if (handle) {
                    var wrappers = handle.__event_tag || [];
                    for (var i = wrappers.length - 1; i >= 0; i--) {
                        var w = wrappers[i];
                        var tScope = scope || w.el;
                        if (w.scope === tScope &&
                            S.inArray(w.el, els)) {
                            S.Event.remove(w.el, event, w.fn, scope);
                            wrappers.splice(i, 1);
                        }
                    }
                } else {
                    S.Event.remove(els, event);
                }
            });

            //on和detach 手动转发给Event.on 和 Event.detach
            S.NodeList.prototype.c_on = function (event, handle, scope) {
                var self = this;
                var s = self.getDOMNodes();
                Event_On(s, event, handle, scope);
                return this;
            };

            //on和detach 手动转发给Event.on 和 Event.detach
            S.NodeList.prototype.c_delegate = function (event, filter, handle, scope) {
                var self = this;
                var s = self.getDOMNodes();
                Event_Delegate(s, event, handle, scope);
                return this;
            };

            S.NodeList.prototype.c_detach = function (event, handle, scope) {
                var self = this;
                var s = self.getDOMNodes();
                Event_Remove(s, event, handle, scope);
                return this;
            };

            /**
             * getDOMNodes tame一下
             */
            S.NodeList.prototype.c_getDOMNodes = function () {
                var l = [];
                S.each(this.getDOMNodes(), function (a) {
                    l.push(tame(a));
                });
                return l;
            };

            /**
             *  node接口中，有使用到选择器的部分，都用query限定下范围
             */
            S.each(('add appendTo prependTo insertBefore insertAfter').split(' '), function (fn) {
                S.NodeList.prototype['c_' + fn] = function (sel) {
                    return this[fn](query(sel))
                };
            });

            /**
             *  node接口中，attr ,data都只允许获得自定义属性
             */
            S.each(('data hasData removeData').split(' '), function (fn) {
                S.NodeList.prototype['c_' + fn] = function (sel, name, value) {
                    return this[fn](query(sel), name, cajaAFTB.untame(value));
                };
            });

            S.each(('attr hasAttr removeAttr').split(' '), function (fn) {
                S.NodeList.prototype['c_' + fn] = function (sel, name, value) {
                    if (S.isString(name) && S.startsWith(name, 'data-')) {
                        return this[fn](query(sel), name, cajaAFTB.untame(value));
                    }
                };
            });

            /**
             *  NodeList 支持的filter，第二个参数都支持函数, 这里面为了简单，先去掉函数的支持，只支持选择器过滤规则
             */
            S.each(('filter next prev first last siblings children').split(' '), function (fn) {
                S.NodeList.prototype['c_' + fn] = function (filter) {
                    if (!S.isFunction(filter)) {
                        return this[fn](filter);
                    } else {
                        S.error('filter参数必须是字符串');
                        return this;
                    }
                }
            });

            S.NodeList.prototype.len = function () {
                return this.length;
            };

            S.NodeList.prototype.c_animate = function () {
                var args = S.makeArray(arguments);
                if (S.isObject(args[0])) {
                    args[0] = cajaAFTB.untame(args[0]);
                }
                return this.animate(args[0], args[1], args[2], args[3]);
            };

            S.NodeList.prototype.c_addClass = function (sel) {
                return  this.addClass(sel);
            };

            S.each(nodeFuncs, function (func) {
                frameGroup.grantMethod(S.NodeList, func);
            });

            return {
                /**
                 * 一些kissy提供的方法
                 */
                unparam: frameGroup.markFunction(function (str) {
                    return S.unparam(str);
                }),

                param: frameGroup.markFunction(function (o, seq, eq, arr) {
                    return S.param(cajaAFTB.untame(o), seq, eq, arr);
                }),

                unEscapeHTML: frameGroup.markFunction(function (str) {
                    return S.unEscapeHTML(str);
                }),

                escapeHTML: frameGroup.markFunction(function (str) {
                    return S.escapeHTML(str);
                }),

                substitute: frameGroup.markFunction(function (str, o) {
                    return S.substitute(str, cajaAFTB.untame(o));
                }),

                DOM: {
                    //get, 即query[0]
                    get: frameGroup.markFunction(function (s, context) {
                        var ret = query(s, context);
                        return tame(ret[0], true);
                    }),

                    // 提供选择器功能
                    query: frameGroup.markFunction(function (s, context) {
                        var ret = query(s, context);
                        // imports.document.compareDocumentPosition 不存在 bug！
                        // 索性用 html ，反正店铺模块不能写 head
                        // body 不行，body.contains 与 body.compareDocumentPosition 都没！
                        // 不能用 imports , firefox/ie 不行
                        S.each(ret, function (v, i) {
                            // 手动 tame，框架保证返回数据无害！
                            ret[i] = tame(v, true);
                        });
                        return ret;
                    }),

                    // 兼容性处理，读取or设置元素 text
                    text: frameGroup.markFunction(function (s, value) {
                        return S.DOM.text(query(s), value);
                    }),

                    // 兼容性处理，读取or设置元素坐标
                    offset: frameGroup.markFunction(function (s, value) {
                        return S.DOM.offset(query(s), value);
                    }),

                    //目前这个接口先去掉，因为没有做校验
                    //2013年1月25日 提供读接口
                    css: frameGroup.markFunction(function (s, prop) {

                        return S.DOM.css(query(s), prop);
                    }),


                    hasClass: frameGroup.markFunction(function (s, value) {
                        return S.DOM.hasClass(query(s), value);
                    }),

                    addClass: frameGroup.markFunction(function (s, value) {
                        return S.DOM.addClass(query(s), value);
                    }),

                    removeClass: frameGroup.markFunction(function (s, value) {
                        return S.DOM.removeClass(query(s), value);
                    }),

                    toggleClass: frameGroup.markFunction(function (s, value) {
                        return S.DOM.toggleClass(query(s), value);
                    }),

                    replaceClass: frameGroup.markFunction(function (s, oc, nc) {
                        return S.DOM.replaceClass(query(s), oc, nc);
                    }),

                    data: frameGroup.markFunction(function (selector, name, value) {
                        return S.DOM.data(query(selector), name, cajaAFTB.untame(value));
                    }),

                    hasData: frameGroup.markFunction(function (selector, name) {
                        return S.DOM.hasData(query(selector), name);
                    }),

                    removeData: frameGroup.markFunction(function (selector, name) {
                        return S.DOM.removeData(query(selector), name)
                    }),

                    attr: frameGroup.markFunction(function (selector, name, value) {
                        if (S.isString(name) && S.startsWith(name, 'data-')) {
                            return S.DOM.attr(query(selector), name, value);
                        }
                    }),

                    hasAttr: frameGroup.markFunction(function (selector, name) {
                        return S.DOM.hasAttr(query(selector), name);
                    }),

                    removeAttr: frameGroup.markFunction(function (selector, name) {
                        if (S.isString(name) && S.startsWith(name, 'data-')) {
                            return S.DOM.removeAttr(query(selector), name);
                        }

                    })

                },

                io: frameGroup.markFunction(function (cfg) {
                    var untamedcfg = cajaAFTB.untame(cfg);
                    untamedcfg.data = cajaAFTB.untame(untamedcfg.data);

                    var url = untamedcfg.url, flag = false;
                    url = parseURL(url).url;
                    S.each(urlIO, function (reg) {
                        if (reg.test(url)) {
                            flag = true;
                        }
                    });

                    //这里处理下，目前只支持json或者jsonp的形式
                    if (!('json' === untamedcfg.dataType || 'jsonp' === untamedcfg.dataType)) {
                        untamedcfg.dataType = "jsonp";
                    }

                    if (flag) {
                        return S.io(S.mix(untamedcfg));
                    } else {
                        return function () {
                            //这里以后都加一个异常函数，统一处理
                        };
                    }

                }),


                UA: S.clone(S.UA),

                log: frameGroup.markFunction(function () {
                    S.log.apply(S, arguments);
                }),

                // 提供批量注册事件功能
                Event: {
                    add: Event_On,
                    on: Event_On,
                    remove: Event_Remove,
                    detach: Event_Remove,
                    delegate: Event_Delegate,
                    fire: frameGroup.markFunction(function (s, event) {
                        S.Event.fire(query(s), event);
                    })
                },

                // 提供动画方便功能
                Anim: frameGroup.markFunction(function () {
                    var args = S.makeArray(arguments);
                    args[0] = query(args[0])[0];
                    if (S.isObject(args[1])) {
                        args[1] = cajaAFTB.untame(args[1]);
                    }
                    return S.Anim.apply(window, args);
                }),

                JSON: {
                    parse: frameGroup.markFunction(function (text) {
                        return S.JSON.parse(text);
                    }),

                    stringify: frameGroup.markFunction(function (value) {
                        return S.JSON.stringify(cajaAFTB.untame(value));
                    })
                },

                all: frameGroup.markFunction(function () {
                    return S.all(query(arguments[0]));
                }),

                alert: frameGroup.markFunction(function (x) {
                    alert(x);
                })
            };
        }

    }

    return init;

}, {
    requires: ['core']
});