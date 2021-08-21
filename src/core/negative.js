const Matrix = require('@rayyamhk/matrix');

function negative() {
  const height = this.height;
  const width = this.width;
  const maxIntensity = 2 ** this.bitDepth - 1;
  const cb = (channel) => Matrix.generate(height, width, (i, j) => maxIntensity - channel._matrix[i][j]);

  if (this.channels.length === 4) {
    return this.map(cb, 0, 1, 2);
  }
  
  return this.map(cb);
}

module.exports = negative;
