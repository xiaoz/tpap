KISSY.ready(function () {
    KISSY.use("sizzle,"+cajaConfig.module, function (S) {
        var adapterArray = S.makeArray(arguments);
        adapterArray.splice(0, 2);
        TShop.Balcony.setup(adapterArray);
    });
});