const Matrix = require("@rayyamhk/matrix");

function clip() {
  const maxIntensity = 2 ** this.bitDepth - 1;
  const width = this.width;
  const height = this.height;

  const cb = (channel) => Matrix.generate(height, width, (i, j) => {
    if (channel._matrix[i][j] < 0) {
      return 0;
    }
    if (channel._matrix[i][j] > maxIntensity) {
      return maxIntensity;
    }
    return channel._matrix[i][j];
  });

  return this.map(cb);
}

module.exports = clip;
