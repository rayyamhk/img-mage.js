const { expect_positive } = require('../../Errors');

function powerLawTransform(gamma, ...channels) {
  if (!gamma || typeof gamma !== 'number' || gamma <= 0) {
    throw expect_positive(gamma);
  }

  const maxIntensity = 2 ** this.bitDepth - 1;
  const rescale = maxIntensity / Math.pow(maxIntensity, gamma);
  const cb = (pixel) => Math.pow(pixel, gamma) * rescale;

  return this.map(cb, ...channels);
}

module.exports = powerLawTransform;
