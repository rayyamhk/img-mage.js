const Image = require('../../Image');

function sharpen(sigma, ...channels) {
  const Gaussian1D = Image.filter(Image.CONSTANT.GAUSSIAN_1D, sigma);
  const Laplacian90 = Image.filter(Image.CONSTANT.LAPLACIAN_90);
  return this.convolve1D(Gaussian1D, 'x', ...channels)
             .convolve1D(Gaussian1D, 'y', ...channels)
             .convolve2D(Laplacian90)
             .add(this)
             .clip();
}

module.exports = sharpen;
