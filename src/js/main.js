require('../scss/main.scss');

var document = window.document;
var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SEGMENTS = 10;
const DEGREE = -45;
const GAP = 0;
var pieces = [];

sliceImage('art.jpg');
// sliceText('Demo Text');

function sliceImage(src) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
        initRender(img);
        requestAnimationFrame(render);
    };
    img.src = src;
}

function sliceText(text) {
    var cx = context();
    var font = `bold 160px arial`;
    var span = document.createElement('span');
    span.textContent = text;
    span.style.font = font;
    document.body.appendChild(span);
    var w = span.offsetWidth,
        h = span.offsetHeight;
    document.body.removeChild(span);
    cx.canvas.width = w;
    cx.canvas.height = h;
    cx.font = font;
    cx.textBaseline = 'middle';
    cx.textAlign = 'center';
    cx.fillText(text, w / 2, h / 2);
    initRender(cx.canvas);
    requestAnimationFrame(render);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var len = pieces.length;
    for (var i = 0; i < len; ++i) {
        var p = pieces[i];
        if (p.wait <= 0) {
            p.currX += (p.dstX - p.currX) * 0.04;
            p.currY += (p.dstY - p.currY) * 0.04;
        } else {
            p.wait--;
        }
        ctx.drawImage(p, p.currX, p.currY);
    }
    requestAnimationFrame(render);
}

function initRender(image) {
    var w, h, rad, sin, cos, nw, nh, sh, i;

    // Dimension of image
    w = image.width;
    h = image.height;

    // Convert degree to radian
    rad = DEGREE * Math.PI / 180;

    // Sine and cosine of radian
    sin = Math.abs(Math.sin(rad));
    cos = Math.abs(Math.cos(rad));

    // Dimension of rotated image
    nw = w * cos + h * sin;
    nh = h * cos + w * sin;

    // Height of per piece
    sh = nh / SEGMENTS;

    pieces = [];
    for (i = 0; i < SEGMENTS; ++i) {
        var ctx = context();
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(DEGREE * Math.PI / 180);
        ctx.rect(-nw / 2, sh * i - nh / 2, nw, sh);
        ctx.restore();
        ctx.clip();
        ctx.drawImage(image, 0, 0);
        ctx.canvas.dstX = (canvas.width - w) / 2;
        ctx.canvas.dstY = (canvas.height - h) / 2;
        var ys = [
            -h,
            canvas.height
        ];
        ctx.canvas.currY = ys[Math.floor(Math.random() * ys.length)];
        if (ctx.canvas.currY < 0) {
            var dg = 90 - Math.atan2(ctx.canvas.dstY - ctx.canvas.currY, 1) * 180 / Math.PI;
            var d = 1 / dg * DEGREE;
            ctx.canvas.currX = ctx.canvas.dstX - d;
        } else {
            var dg = 90 + Math.atan2(ctx.canvas.dstY - ctx.canvas.currY, 1) * 180 / Math.PI;
            var d = 1 / dg * DEGREE;
            ctx.canvas.currX = ctx.canvas.dstX + d;
        }
        ctx.canvas.wait = Math.floor(Math.random() * 50);
        pieces.push(ctx.canvas);
    }
}

function context() {
    return document.createElement('canvas').getContext('2d');
}
