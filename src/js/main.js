require('../scss/main.scss');

var document = window.document;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SEGMENTS = 8;
const DEGREE = 10;
const GAP = 2;
var pieces = [];

var img = new Image();
img.crossOrigin = "anonymous";
img.onload = function () {
    var cv = simRender(img);
    var w = cv.width,
        h = cv.height;
    var s = w / SEGMENTS;
    pieces = [];
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = s * i;
        var cx = context();
        cx.canvas.width = s;
        cx.canvas.height = h;
        cx.drawImage(cv, p, 0, s, h, 0, 0, s, h);
        pieces.push(cx.canvas);
    }
    render(w);
};
img.src = 'http://localhost:8080/art.jpg';

function render(width) {
    var totalWidth = width + (SEGMENTS - 1) * GAP;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    //ctx.rotate(DEGREE * Math.PI / 180);
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = pieces[i];
        p.dstX = (i * p.width + GAP * i) - totalWidth / 2;
        p.dstY = -p.height / 2;
        ctx.drawImage(p, p.dstX, p.dstY);
        ctx.strokeRect(p.dstX, p.dstY, p.width, p.height);
    }
    console.log(pieces);
    ctx.restore();
}

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