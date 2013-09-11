
console.log(KISSY.KCharts.LineChart)

var linechart = KISSY.KCharts.LineChart({
    renderTo:".my",
    title:{
        content:"1周消费记录"
    },
    anim:{},
    subTitle:{
        content:"week fee record"
    },
    xAxis: {
        text:['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
    },
    yAxis:{
        min:0
    },
    series:[
        {
            data:[100,4000,200,400,144,234,700]
        }],
    tip:{
        template:"总支出：模板:Y 元"
    }
});