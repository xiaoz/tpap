var Calendar = KISSY.Calendar;
var c =new Calendar('.J_Calendar', {
    maxDate: new Date(),
    popup: true,
    show: true
});
c.on('select', function (e) {
    console.log(this.on);
    console.log(e.date);
})