require('../scss/main.scss');

var document = window.document;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const SEGMENTS = 6;
const DEGREE = 10;

var img = new Image();
img.onload = function () {
    var cv = simRender(img);
    var w = cv.width,
        h = cv.height;
    console.log(w, h);
    /*
    var w = img.naturalWidth,
        h = img.naturalHeight;
    var s = w / SEGMENTS;
    var cv = document.createElement('canvas');
    var cx = cv.getContext('2d');
    cv.width = w;
    cv.height = h;
    document.body.appendChild(cv);
    cx.rotate(DEGREE * Math.PI / 180);
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = s * i;
        console.log(s, p);
        cx.drawImage(img, p, 0, s, h, p, 0, s, h);
    }
    cx.setTransform(1, 0, 0, 1, 0, 0);
    */
};
img.src = 'https://cdn.allwallpaper.in/wallpapers/480x272/646/landscapes-valley-fantasy-art-artwork-480x272-wallpaper.jpg';

function simRender(img) {
    var cx = context();
    var w = img.naturalWidth,
        h = img.naturalHeight;
    var deg = DEGREE * -1,
        rad = deg * Math.PI / 180,
        sin = Math.abs(Math.sin(rad)),
        cos = Math.abs(Math.cos(rad));
    var nh = h * cos + w * sin;
    var nw = w * cos + h * sin;
    cx.canvas.width = nw;
    cx.canvas.height = nh;
    document.body.appendChild(cx.canvas);
    cx.save();
    cx.translate(cx.canvas.width / 2, cx.canvas.height / 2);
    cx.rotate(deg * Math.PI / 180);
    cx.drawImage(img, -w / 2, -h / 2);
    cx.restore();
    return cx.canvas;
}

function context() {
    return document.createElement('canvas').getContext('2d');
}