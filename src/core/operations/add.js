const Matrix = require('@rayyamhk/matrix');
const Image = require('../../index');
const { INVALID_IMAGE, size_incompatible } = require('../../Errors');

function add(image, ...channels) {
  if (!(image instanceof Image)) {
    throw INVALID_IMAGE;
  }

  const [width, height] = image.size();

  if (width !== this.width || height !== this.height) {
    throw size_incompatible(width, height, this.width, this.height);
  }

  const cb = (channel, k) => Matrix.add(channel, image.channels[k]);

  return this.map(cb, ...channels);
}

module.exports = add;
