var Calendar = KISSY.Calendar;
var c = Calendar('.J_Calendar', {
    maxDate: new Date(),
    popup: true,
    show: true
});
c.on('select', function (e) {
    console.log(new Date(e.date).getDate());
})