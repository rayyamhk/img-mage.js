const Matrix = require('@rayyamhk/matrix');

function negative(...channels) {
  const height = this.height;
  const width = this.width;
  const maxIntensity = 2 ** this.bitDepth - 1;
  const cb = (channel) => Matrix.generate(height, width, (i, j) => maxIntensity - channel._matrix[i][j]);
  
  return this.map(cb, ...channels);
}

module.exports = negative;
