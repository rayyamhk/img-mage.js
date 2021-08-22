const Image = require('../../Image');
const { INVALID_IMAGE, size_incompatible } = require('../../Errors');

function multiply(image, ...channels) {
  if (!(image instanceof Image)) {
    throw INVALID_IMAGE;
  }

  const [width, height] = image.size();

  if (width !== this.width || height !== this.height) {
    throw size_incompatible(width, height, this.width, this.height);
  }

  const cb = (pixel, i, j, k) => pixel * image.channels[k][i][j];

  return this.map(cb, ...channels);
}

module.exports = multiply;
