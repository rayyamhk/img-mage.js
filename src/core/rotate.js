const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');
const { invalid_rotation } = require('../Errors');

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
    const R = Matrix.generate(col, row, (i, j) => this.R._matrix[row - 1 - j][i]);
    const G = Matrix.generate(col, row, (i, j) => this.G._matrix[row - 1 - j][i]);
    const B = Matrix.generate(col, row, (i, j) => this.B._matrix[row - 1 - j][i]);
    return new Image()._fromRGB(R, G, B, height, width);
  }

  // clockwise 180
  if (rotation === 2 || rotation === -2) {
    const R = Matrix.generate(row, col, (i, j) => this.R._matrix[row - 1 - i][col - 1 - j]);
    const G = Matrix.generate(row, col, (i, j) => this.G._matrix[row - 1 - i][col - 1 - j]);
    const B = Matrix.generate(row, col, (i, j) => this.B._matrix[row - 1 - i][col - 1 - j]);
    return new Image()._fromRGB(R, G, B, width, height);
  }

  // clockwise 270
  const R = Matrix.generate(col, row, (i, j) => this.R._matrix[j][col - 1- i]);
  const G = Matrix.generate(col, row, (i, j) => this.G._matrix[j][col - 1- i]);
  const B = Matrix.generate(col, row, (i, j) => this.B._matrix[j][col - 1- i]);
  return new Image()._fromRGB(R, G, B, height, width);
}

module.exports = rotate;
