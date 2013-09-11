var $=KISSY.all;

function log(s){
  console.log(s)
}
function g(n) {
    var k = KISSY.DOM.query("." + n);

    return (k != null) ? k[0] : "1111";
}

var access_token='';
try{
    TOP.ui("authbtn", {
        container: '.taeapp_im_auth',
        name:'授权',
        type:'mini',
        callback: function(data){
            log('auth back:'+KISSY.JSON.stringify(data));
            access_token=data.result.access_token;
        }
    });
}catch(e){
    log('call top error:'+e);
}
console.log(g('taeapp_im_dox'));

KISSY.Event.on(g('taeapp_im_dox'),'click',function(e){
    try{
        if(access_token==''){
            log('请选授权!');
        }else{
            log('call top taobao.favorite.add...');
            TOP.api('rest','get',{method:'taobao.favorite.add',session:access_token,item_numid:60497547,collect_type:'SHOP',shared:'true'},function(resp){
                if(resp!=null){
                    log('call top taobao.favorite.add back:'+KISSY.JSON.stringify(resp));
                }else{
                    log('call top taobao.favorite.add back:null');
                }
            });
        }
    }catch(ex){
        log('call taobao.favorite.add error:'+ex);
    }
});




