const Matrix = require('@rayyamhk/matrix');

function logTransform(...channels) {
  const w = this.width;
  const h = this.height;
  const maxIntensity = 2 ** this.bitDepth - 1;
  const rescale = maxIntensity / Math.log(maxIntensity + 1);
  const cb = (channel) => Matrix.generate(h, w, (i, j) => Math.log(channel._matrix[i][j] + 1) * rescale);

  if (this.channels.length === 4) {
    return this.map(cb, 0, 1, 2);
  }

  return this.map(cb, ...channels);
}

module.exports = logTransform;
