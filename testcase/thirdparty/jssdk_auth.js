
//原有授权方式
var $=KISSY.all;
TOP.ui("authbtn", {
    container: '.top-authbtn-container',
    name:'立即使用',
    type:'mini',
    callback: function(data){
        console.log(data);
    }
});



//自定义授权方式，当点击class=authbtn 的按钮时触发授权界面
TOP.ui("authbtn", {
    
     type:'mini',
     onload:function(handler){ 
     	KISSY.all(".authbtn").on("click",function(){
          handler();
           });
     },
    callback: function(data){
        console.log(data);
    }
});
