KISSY.ready(function () {
    KISSY.use("sizzle,"+cajaConfig.modules || "", function (S) {
        var adapterArray = S.makeArray(arguments);
        adapterArray.splice(0, 2);
        TShop.Balcony.setup(adapterArray);
    });
});