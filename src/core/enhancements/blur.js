const Image = require('../../index');

function blur(sigma, ...channels) {
  const GAUSSIAN_1D = Image.CONSTANT.GAUSSIAN_1D;
  const kernel = Image.kernel(GAUSSIAN_1D, sigma);
  return this.convolve1D(kernel, 'x', ...channels)
             .convolve1D(kernel, 'y', ...channels)
             .clip();
}

module.exports = blur;
