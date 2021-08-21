const Matrix = require('@rayyamhk/matrix');
const { expect_nonnegative } = require('../Errors');

function pad(sizeX, sizeY) {
  if ((!sizeX && sizeX !== 0) || typeof sizeX !== 'number' || !Number.isInteger(sizeX) || sizeX < 0) {
    throw expect_nonnegative(sizeX);
  }

  if (sizeY && (typeof sizeY !== 'number' || !Number.isInteger(sizeY) || sizeY < 0)) {
    throw expect_nonnegative(sizeY);
  }

  if (!sizeY) {
    sizeY = sizeX;
  }

  const width = this.width + 2 * sizeY;
  const height = this.height + 2 * sizeX;

  const cb = (channel) => Matrix.generate(height, width, (i, j) => {
    if (i >= sizeX && i < height - sizeX && j >= sizeY && j < width - sizeY) {
      return channel._matrix[i - sizeX][j - sizeY];
    }
    return 0;
  });

  return this.map(cb);
}

module.exports = pad;
