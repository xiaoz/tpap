function describe(desc, func) {
    console.group(desc);
    func.call();
    console.groupEnd();
}

function it(desc, func, needTime) {
    console.log("<strong>" + "ø™ º≤‚ ‘: " + desc + "</strong>");
    needTime ? console.time("test time") : '';
    func.call(this);
    needTime ? console.timeEnd("test time") : '';

}

function expect(desc, flag, id) {
    if (flag) {
        console.warn(" ≤‚ ‘≥…π¶£°    " + "<br>√Ë ˆ£∫" + desc);
    } else {
        console.error(" ≤‚ ‘ ß∞‹£°   " + desc);
    }
}

function getCajaExposed(frameGroup, cajaAFTB) {
    frameGroup.markFunction(describe);
    frameGroup.markFunction(it);
    frameGroup.markFunction(expect);

    var obj = {
        it: frameGroup.tame(it),
        describe: frameGroup.tame(describe),
        expect: frameGroup.tame(expect)

    };

    return obj;
}
