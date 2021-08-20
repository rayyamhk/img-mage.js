const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');
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

  const cb = (i, j, image) => {
    if (i >= sizeX && i < height - sizeX && j >= sizeY && j < width - sizeY) {
      return image[i - sizeX][j - sizeY];
    }
    return 0;
  }

  const R = Matrix.generate(height, width, (i, j) => cb(i, j, this.R._matrix));
  const G = Matrix.generate(height, width, (i, j) => cb(i, j, this.G._matrix));
  const B = Matrix.generate(height, width, (i, j) => cb(i, j, this.B._matrix));
  return new Image()._fromRGB(R, G, B, width, height);
}

module.exports = pad;
