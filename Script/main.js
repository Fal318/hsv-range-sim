window.onload = function () {
    main();
}

function main() {
    var button = document.getElementsByClassName("submit")[0];
    var hsvElement = [
        document.getElementsByClassName("lower_hsv"),
        document.getElementsByClassName("upper_hsv")
    ];
    let inputElement = document.getElementById("input_file")
    let canvasElement = document.getElementById('canvas_input')

    inputElement.addEventListener('change', (e) => {
        canvasElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
    button.onclick = function () {
        //var hsvArr = hsvElement.map((e) => { return [Number(e.h.value) * 2, Number(e.s.value) / 255, Number(e.v.value) / 255] })
        let hsvArr = hsvElement.map((e) => { return [Number(e.h.value), Number(e.s.value), Number(e.v.value)] })

        //console.log(hsvArr)
        //var rgbArr = hsvArr.map((hsv) => { return hsv2rgb(...hsv) })
        //console.log(rgbArr)
        mask(cv.imread(canvasElement), hsvArr)
    }
}

function hsv2rgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5), f(3), f(1)].map((v) => { return Math.round(v * 255) });
}

function mask(img, range) {
    let dst = new cv.Mat();
    let mask = new cv.Mat();
    cv.cvtColor(img, mask, cv.COLOR_RGB2HSV)
    cv.inRange(mask, cv.matFromArray(3, 1, cv.CV_64FC1, range[0]), cv.matFromArray(3, 1, cv.CV_64FC1, range[1]), mask)
    cv.bitwise_and(img, img, dst, mask = mask)
    cv.imshow('canvas_output', dst);
    dst.delete();
}