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
    var totalWidth = w + (SEGMENTS - 1) * GAP;
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = s * i;
        var cx = context();
        cx.canvas.width = s;
        cx.canvas.height = h;
        cx.drawImage(cv, p, 0, s, h, 0, 0, s, h);
        cx.canvas.dstX = (i * cx.canvas.width + GAP * i) - totalWidth / 2;
        cx.canvas.dstY = -cx.canvas.height / 2;
        cx.canvas.currX = cx.canvas.dstX;
        var ys = [
            canvas.height / 2,
            -(canvas.height/2 + cx.canvas.height)
        ];
        cx.canvas.currY = ys[Math.floor(Math.random() * ys.length)];
        cx.canvas.wait = Math.floor(Math.random() * 50);
        pieces.push(cx.canvas);
    }
    requestAnimationFrame(render);
};
img.src = 'http://localhost:8080/art.jpg';

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(DEGREE * Math.PI / 180);
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = pieces[i];
        if(p.wait <= 0) {
            p.currX += (p.dstX - p.currX) * 0.04;
            p.currY += (p.dstY - p.currY) * 0.04;
        } else {
            p.wait--;
        }
        ctx.drawImage(p, p.currX, p.currY);
        // ctx.strokeRect(p.currX, p.currY, p.width, p.height);
    }
    ctx.restore();
    requestAnimationFrame(render);
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