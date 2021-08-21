const Matrix = require('@rayyamhk/matrix');
const Image = require('./src/index');

const kernel = new Matrix([
  [0, -1, 0],
  [-1, 5, -1],
  [0, -1, 0],
]);

const img = new Image();
img.fromSource('test.jpg')
   .RGBtoYIQ()
   .convolve(kernel, 0)
   .YIQtoRGB()
   .clip(0, 1, 2)
   .save('result.jpg');

// img.fromSource('test.jpg')
//    .negative()
//    .save('result.jpg');
