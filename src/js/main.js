require('../scss/main.scss');

var document = window.document;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

const SEGMENTS = 6;

var img = new Image();
img.onload = function () {
    var w = img.naturalWidth,
        h = img.naturalHeight;
    var s = w / SEGMENTS;
    var cv = document.createElement('canvas');
    var cx = cv.getContext('2d');
    cv.width = w;
    cv.height = h;
    document.body.appendChild(cv);
    // ctx.rotate(10 * Math.PI / 180);
    for (var i = 0; i < SEGMENTS; ++i) {
        var p = s * i;
        console.log(s, p);
        cx.drawImage(img, p, 0, s, h, p, 0, s, h);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
};
img.src = 'https://cdn.allwallpaper.in/wallpapers/640x480/646/landscapes-valley-fantasy-art-artwork-640x480-wallpaper.jpg';