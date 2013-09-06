console.log(GS);
console.log(GS.addListener)

GS.addListener('windowScroll',function(e){
    console.log(e.scrollTop)
});


console.log(KISSY.DOM.offset('.aaaaa').top);
