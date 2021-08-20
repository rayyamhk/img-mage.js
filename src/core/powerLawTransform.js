const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');
const { expect_positive } = require('../Errors');

function powerLawTransform(gamma) {
  if (!gamma || typeof gamma !== 'number' || gamma <= 0) {
    throw expect_positive(gamma);
  }
  
  const width = this.width;
  const height = this.height;
  const maxIntensity = 2 ** this.bitDepth - 1;
  const rescale = maxIntensity / Math.pow(maxIntensity, gamma);

  const R = Matrix.generate(height, width, (i, j) => Math.pow(this.R._matrix[i][j], gamma) * rescale);
  const G = Matrix.generate(height, width, (i, j) => Math.pow(this.G._matrix[i][j], gamma) * rescale);
  const B = Matrix.generate(height, width, (i, j) => Math.pow(this.B._matrix[i][j], gamma) * rescale);
  return new Image()._fromRGB(R, G, B, width, height);
}

module.exports = powerLawTransform;
