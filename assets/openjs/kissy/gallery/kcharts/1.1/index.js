/**
 * @fileOverview Kchars组件的安全适配器
 */
KISSY.add(function (S, LineChart, BarChart, PieChart) {
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
         * 因为KISSY的组件构造函数只有一个，后面可能会对构造函数本身做修改
         * 所以这里可以写一个SafeConstruector，相当于继承KISSY的组件，并且显示的声明要开放哪些api
         */
        //LineChart Adapter
        function SafeLineChart(cfg) {
            this.inner = new LineChart(cfg);
        }

        SafeLineChart.prototype.render = function(){
            this.inner.render();
        };

        SafeLineChart.prototype.showLine = function(){
            this.inner.showLine();
        };

        SafeLineChart.prototype.hideLine = function(){
            this.inner.hideLine();
        };

        SafeLineChart.prototype.clear = function(){
            this.inner.clear();
        };

        SafeLineChart.prototype.on = function(type, fnc){
            this.inner.on(type, frameGroup.markFunction(function(){
                fnc.call();
            }));
        };

        frameGroup.markCtor(SafeLineChart);
        frameGroup.grantMethod(SafeLineChart, "render");
        frameGroup.grantMethod(SafeLineChart, "showLine");
        frameGroup.grantMethod(SafeLineChart, "hideLine");
        frameGroup.grantMethod(SafeLineChart, "clear");
        frameGroup.grantMethod(SafeLineChart, "on");

        //BarChart Adapter
        function SafeBarChart(cfg) {
            this.inner = new BarChart(cfg);
        }

        SafeBarChart.prototype.render = function(){
            this.inner.render();
        };

        SafeBarChart.prototype.clear = function(){
            this.inner.clear();
        };

        SafeBarChart.prototype.on = function(type, fnc){
            this.inner.on(type, frameGroup.markFunction(function(){
                fnc.call();
            }));
        };

        frameGroup.markCtor(SafeBarChart);
        frameGroup.grantMethod(SafeBarChart, "render");
        frameGroup.grantMethod(SafeBarChart, "clear");
        frameGroup.grantMethod(SafeBarChart, "on");

        //PieChart Adapter
        function SafePieChart(cfg) {
            this.inner = new PieChart(cfg);
        }

        SafePieChart.prototype.render = function(){
            this.inner.render();
        };

        SafePieChart.prototype.clear = function(){
            this.inner.clear();
        };

        SafePieChart.prototype.on = function(type, fnc){
            this.inner.on(type, frameGroup.markFunction(function(){
                fnc.call();
            }));
        };

        frameGroup.markCtor(SafePieChart);
        frameGroup.grantMethod(SafePieChart, "render");
        frameGroup.grantMethod(SafePieChart, "clear");
        frameGroup.grantMethod(SafePieChart, "on");


        /**
         * @param context 上下文
         * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
         * @param context.frame 单个模块的沙箱
         * @return {Object} 实际的组件对象
         */
        return function (context) {

            //最终需要返回给
            return {
                KCharts: {
                    LineChart: frameGroup.markFunction(function () {
                        var args = S.makeArray(arguments);
                        var cfg = cajaAFTB.untame(args[0]);
                        cfg.renderTo = S.DOM.get(cfg.renderTo, context.mod);
                        return new SafeLineChart(cfg);
                    }),

                    BarChart: frameGroup.markFunction(function () {
                        var args = S.makeArray(arguments);
                        var cfg = cajaAFTB.untame(args[0]);
                        cfg.renderTo = S.DOM.get(cfg.renderTo, context.mod);
                        return new SafeBarChart(cfg);
                    }),

                    PieChart: frameGroup.markFunction(function () {
                        var args = S.makeArray(arguments);
                        var cfg = cajaAFTB.untame(args[0]);
                        cfg.renderTo = S.DOM.get(cfg.renderTo, context.mod);
                        return new SafePieChart(cfg);
                    })
                },
                kissy:true
            }
        }

    }
    return init;
}, {
    requires: ['gallery/kcharts/1.1/linechart/index', 'gallery/kcharts/1.1/barchart/index', 'gallery/kcharts/1.1/piechart/index']
});