const Image = require('../../Image');

function blur(sigma, ...channels) {
  const GAUSSIAN_1D = Image.CONSTANT.GAUSSIAN_1D;
  const filter = Image.filter(GAUSSIAN_1D, sigma);
  return this.convolve1D(filter, 'x', ...channels)
             .convolve1D(filter, 'y', ...channels)
             .clip();
}

module.exports = blur;
