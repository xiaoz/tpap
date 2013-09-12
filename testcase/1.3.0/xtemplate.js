var XTemplate = KISSY.XTemplate;//模板组件默认在KISSY的命名空间下
var Event = KISSY.Event,DOM = KISSY.DOM;
//支持简单的变量替换
Event.on(DOM.query('.J_supportVariable')[0],'click',function(ev){
	 var tpl = 'this is {{title}}!';
	    var data = {
	        title: 'o'
	    };
	    var render = new XTemplate(tpl).render(data);
	    KISSY.alert(render);
})
//支持函数作为模板
Event.on(DOM.query('.J_fnTpl')[0],'click',function(ev){
		  var tpl = function (scopes) {
	          return 'this is ' + scopes[0].title + '!';
	      };
	      var data = {
	          title: 'o'
	      };
	      var render = new XTemplate(tpl).render(data);
	    KISSY.alert(render);
})
//测试if 语句
Event.on(DOM.query('.J_supportIf')[0],'click',function(ev){
		var tpl = '{{#if title}}has title{{/if}}\n' +
		'{{@if title2}}has title2{{else}}not has title2{{/if}}';
		var data = {
		    title: 'o',
		    title2: ''
		};
		var render = new XTemplate(tpl).render(data);
	    KISSY.alert(render);
})

//支持 each 语句循环对象数组
Event.on(DOM.query('.J_supportEachObject')[0],'click',function(ev){
	 var tpl = '{{#each data}}{{name}}-{{xindex}}/{{xcount}}|{{/each}}';
     var data = {
         data: [
             {
                 name: 1
             },
             {
                 name: 2
             }
         ]
     };
     var render = new XTemplate(tpl).render(data);

	    KISSY.alert(render);
})
 //支持 with 语句
Event.on(DOM.query('.J_supportWithObject')[0],'click',function(ev){
	 var tpl = '{{#with data}}{{name}}-{{age}}{{/with}}';

     var data = {
         data: {
             name: 'h',
             age: 2
         }
     };

     var render = new XTemplate(tpl).render(data);
	 KISSY.alert(render);
})

 //支持注释
Event.on(DOM.query('.J_supportComment')[0],'click',function(ev){
	var tpl = 'my {{!\n' +
	    'comment' +
	    '\n}} {{title}}';
	
	var data = {
	    title: 'oo'
	};
	var render = new XTemplate(tpl).render(data);
	 KISSY.alert(render);
})

 // html 转义
Event.on(DOM.query('.J_supportEscapeHtml')[0],'click',function(ev){
	 var tpl = 'my {{title}} is {{{title}}}';

     var data = {
         title: '<a>'
     };

     var render = new XTemplate(tpl).render(data);

	 KISSY.alert(render);
})
 // h支持局部行内命令扩展
Event.on(DOM.query('.J_supportLocalCommand')[0],'click',function(ev){
	  var tpl = 'my {{global3 title}}';
      var data = {
          title: '1'
      };
      var render = new XTemplate(tpl, {
          commands: {
              'global3': function (scopes, option) {
                  return 'global3-' + option.params[0];
              }
          }
      }).render(data);

	 KISSY.alert(render);
})

 // 支持字符串作为局部子模板
Event.on(DOM.query('.J_supportStringLocalSubTpl')[0],'click',function(ev){
	 var tpl = '{{include "sub-tpl-3"}}';

     var data = {
         title: '1'
     };

     var render = new XTemplate(tpl, {
         subTpls: {
             'sub-tpl-3': '{{title}}'
         }
     }).render(data);
	KISSY.alert(render);
})

 // 支持关系表达式
Event.on(DOM.query('.J_supportRelationalExpression')[0],'click',function(ev){
		var tpl = '{{#if n > n2+4/2}}' +
	    '{{n+1}}' +
	    '{{else}}' +
	    '{{n2+1}}' +
	    '{{/if}}';
	
	var tpl3 = '{{#if n === n2+4/2}}' +
	    '{{n+1}}' +
	    '{{else}}' +
	    '{{n2+1}}' +
	    '{{/if}}';
	
	
	var tpl4 = '{{#if n !== n2+4/2}}' +
	    '{{n+1}}' +
	    '{{else}}' +
	    '{{n2+1}}' +
	    '{{/if}}';


		var data = {
		        n: 5,
		        n2: 2
		    }, data2 = {
		        n: 1,
		        n2: 2
		    },
		    data3 = {
		        n: 4,
		        n2: 2
		    };
		KISSY.alert(new XTemplate(tpl).render(data));
		KISSY.alert(new XTemplate(tpl).render(data2));
		KISSY.alert(new XTemplate(tpl3).render(data3));
		KISSY.alert(new XTemplate(tpl4).render(data3));
})



