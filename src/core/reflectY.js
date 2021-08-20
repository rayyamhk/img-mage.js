const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');

function reflectX() {
  const width = this.width;
  const height = this.height;

  const R = Matrix.generate(height, width, (i, j) => this.R._matrix[i][width - 1 - j]);
  const G = Matrix.generate(height, width, (i, j) => this.G._matrix[i][width - 1 - j]);
  const B = Matrix.generate(height, width, (i, j) => this.B._matrix[i][width - 1 - j]);
  return new Image()._fromRGB(R, G, B, width, height);
}

module.exports = reflectX;
