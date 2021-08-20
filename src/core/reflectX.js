const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');

function reflectX() {
  const width = this.width;
  const height = this.height;

  const R = Matrix.generate(height, width, (i, j) => this.R._matrix[height - 1 - i][j]);
  const G = Matrix.generate(height, width, (i, j) => this.G._matrix[height - 1 - i][j]);
  const B = Matrix.generate(height, width, (i, j) => this.B._matrix[height - 1 - i][j]);
  return new Image()._fromRGB(R, G, B, width, height);
}

module.exports = reflectX;
