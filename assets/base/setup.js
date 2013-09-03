KISSY.config(
    {
        debug: false,
        packages: [
            {
                name: "openjs", //包名
                tag: "20130527",//时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
                path:"http://a.tbcdn.cn/apps/taesite/balcony/core/r4000", //包对应路径, 相对路径指相对于当前页面路径    //
                charset: "utf-8" //包里模块文件编码格式
            }
        ]
    }
);
KISSY.ready(function () {
    KISSY.use("sizzle,"+cajaConfig.modules || "", function (S) {
        var adapterArray = S.makeArray(arguments);
        adapterArray.splice(0, 2);
        TShop.Balcony.setup(adapterArray);
    });
});