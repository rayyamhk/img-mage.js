const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');

function negative() {
  const width = this.width;
  const height = this.height;
  const maxIntensity = 2 ** this.bitDepth - 1;

  const R = Matrix.generate(height, width, (i, j) => maxIntensity - this.R._matrix[i][j]);
  const G = Matrix.generate(height, width, (i, j) => maxIntensity - this.G._matrix[i][j]);
  const B = Matrix.generate(height, width, (i, j) => maxIntensity - this.B._matrix[i][j]);
  return new Image()._fromRGB(R, G, B, width, height);
}

module.exports = negative;
