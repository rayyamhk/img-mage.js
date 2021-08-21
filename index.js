const Matrix = require('@rayyamhk/matrix');
const Image = require('./src/index');
const { GAUSSIAN_1D, GAUSSIAN_2D, LAPLACIAN_45, LAPLACIAN_90 } = require('./src/core/constant');

const Gaussian1D = Image.kernel(GAUSSIAN_1D, 10);
const Gaussian2D = Image.kernel(GAUSSIAN_2D, 4);
const Laplacian45 = Image.kernel(LAPLACIAN_45);
const Laplacian90 = Image.kernel(LAPLACIAN_90);

const img = new Image();

console.time('2 * 1D');
img.fromSource('test.jpg')
   .blur(10)
   .save('result2.jpg');
console.timeEnd('2 * 1D');

// console.time('1 * 2D');
// img.fromSource('test.jpg')
//    .convolve2D(Gaussian2D)
//    .clip()
//    .save('result2.jpg');
// console.timeEnd('1 * 2D');
