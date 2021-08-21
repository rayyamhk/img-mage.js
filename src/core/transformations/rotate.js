const Matrix = require('@rayyamhk/matrix');
const { invalid_rotation } = require('../../Errors');

function rotate(rotation) {
  if (![-3, -2, -1, 1, 2, 3].includes(rotation)) {
    throw invalid_rotation(rotation);
  }

  const width = this.width;
  const height = this.height;

  const col = width;
  const row = height;

  // clockwise 90
  if (rotation === -3 || rotation === 1) {
    const cb = (channel) => Matrix.generate(col, row, (i, j) => channel._matrix[row - 1 - j][i]);
    return this.map(cb);
  }

  // clockwise 180
  if (rotation === 2 || rotation === -2) {
    const cb = (channel) => Matrix.generate(row, col, (i, j) => channel._matrix[row - 1 - i][col - 1 - j]);
    return this.map(cb);
  }

  // clockwise 270
  const cb = (channel) => Matrix.generate(col, row, (i, j) => channel._matrix[j][col - 1- i]);
  return this.map(cb);
}

module.exports = rotate;
