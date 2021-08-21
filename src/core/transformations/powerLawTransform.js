const Matrix = require('@rayyamhk/matrix');
const { expect_positive } = require('../../Errors');

function powerLawTransform(gamma, ...channels) {
  if (!gamma || typeof gamma !== 'number' || gamma <= 0) {
    throw expect_positive(gamma);
  }

  const width = this.width;
  const height = this.height;
  const maxIntensity = 2 ** this.bitDepth - 1;
  const rescale = maxIntensity / Math.pow(maxIntensity, gamma);
  const cb = (channel) => Matrix.generate(height, width, (i, j) => Math.pow(channel._matrix[i][j], gamma) * rescale);

  if (this.channels.length === 4) {
    return this.map(cb, 0, 1, 2);
  }

  return this.map(cb, ...channels);
}

module.exports = powerLawTransform;
