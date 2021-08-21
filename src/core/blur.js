const Image = require('../index');
const { GAUSSIAN_1D } = require('./constant');

function blur(sigma, ...channels) {
  const kernel = Image.kernel(GAUSSIAN_1D, sigma);
  return this.convolve1D(kernel, 'x', ...channels)
             .convolve1D(kernel, 'y', ...channels)
             .clip();
}

module.exports = blur;
