require('../scss/main.scss');

import Slices from './slices';

var document = window.document;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const angle = -60;

var slices = new Slices({
    text: 'Demo',
    angle: angle,
    segments: 20,
    fontWeight: 'bold'
}).get();
for (var i = 0; i < slices.length; ++i) {
    var slice = slices[i];
    slice.ox = (canvas.width - slice.width) / 2;
    slice.oy = (canvas.height - slice.height) / 2;
    var ys = [
        -slice.height,
        canvas.height
    ];
    slice.cy = ys[Math.floor(Math.random() * ys.length)];
    slice.cx = (slice.cy - slice.oy) / Math.tan(angle * Math.PI / 180);
    slice.cx += slice.ox;
    slice.w = Math.floor(Math.random() * 50);
}

requestAnimationFrame(render);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var len = slices.length;
    for (var i = 0; i < len; ++i) {
        var slice = slices[i];
        if (slice.w <= 0) {
            slice.cx += (slice.ox - slice.cx) * 0.03;
            slice.cy += (slice.oy - slice.cy) * 0.03;
        } else {
            slice.w--;
        }
        ctx.drawImage(slice.canvas, slice.cx, slice.cy);
    }
    requestAnimationFrame(render);
}