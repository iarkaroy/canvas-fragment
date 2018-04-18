require('../scss/main.scss');

var document = window.document;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SEGMENTS = 40;
const DEGREE = 30;
const GAP = 1;
var pieces = [];

//sliceImage('http://localhost:8080/art.jpg');
sliceText('Demo Text');

function sliceImage(src) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
        var cv = initRender(img);
        initPieces(cv);
        requestAnimationFrame(render);
    };
    img.src = src;
}

function sliceText(text) {
    var cx = context();
    var font = `bold 80px arial`;
    var span = document.createElement('span');
    span.textContent = text;
    span.style.font = font;
    document.body.appendChild(span);
    var w = span.offsetWidth,
        h = span.offsetHeight;
    cx.canvas.width = w;
    cx.canvas.height = h;
    cx.font = font;
    cx.textBaseline = 'middle';
    cx.textAlign = 'center';
    cx.fillText(text, w / 2, h / 2);
    var cv = initRender(cx.canvas);
    initPieces(cv);
    requestAnimationFrame(render);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(DEGREE * Math.PI / 180);
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = pieces[i];
        if (p.wait <= 0) {
            p.currX += (p.dstX - p.currX) * 0.04;
            p.currY += (p.dstY - p.currY) * 0.04;
        } else {
            p.wait--;
        }
        ctx.drawImage(p, p.currX, p.currY);
        //ctx.strokeRect(p.currX, p.currY, p.width, p.height);
    }
    ctx.restore();
    requestAnimationFrame(render);
}

function initPieces(cvs) {
    var w = cvs.width,
        h = cvs.height;
    var s = w / SEGMENTS;
    pieces = [];
    var totalWidth = w + (SEGMENTS - 1) * GAP;
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = s * i;
        var cx = context();
        cx.canvas.width = s;
        cx.canvas.height = h;
        cx.drawImage(cvs, p, 0, s, h, 0, 0, s, h);
        cx.canvas.dstX = (i * cx.canvas.width + GAP * i) - totalWidth / 2;
        cx.canvas.dstY = -cx.canvas.height / 2;
        cx.canvas.currX = cx.canvas.dstX;
        var ys = [
            canvas.height / 2,
            -(canvas.height / 2 + cx.canvas.height)
        ];
        cx.canvas.currY = ys[Math.floor(Math.random() * ys.length)];
        cx.canvas.wait = Math.floor(Math.random() * 50);
        pieces.push(cx.canvas);
    }
}

function initRender(img) {
    var cx = context();
    var w = img.width,
        h = img.height;
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