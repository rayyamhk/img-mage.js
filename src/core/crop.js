const Matrix = require('@rayyamhk/matrix');
const Image = require('../index');
const {
  invalid_index,
  expect_nonnegative,
  OVERFLOW_WIDTH,
  OVERFLOW_HEIGHT
} = require('../Errors');

function crop(x, y, w, h) {
  const width = this.width;
  const height = this.height;

  if (typeof x !== 'number' || !Number.isInteger(x) || x < 0 || x > height) {
    throw invalid_index(x);
  }

  if (typeof y !== 'number' || !Number.isInteger(y) || y < 0 || y > width) {
    throw invalid_index(y);
  }

  if (typeof w !== 'number' || !Number.isInteger(w) || w < 0) {
    throw expect_nonnegative(w);
  }

  if (y + w > width) {
    throw OVERFLOW_WIDTH;
  }
  
  if (typeof h !== 'number' || !Number.isInteger(h) || h < 0) {
    throw expect_nonnegative(h);
  }

  if (x + h > height) {
    throw OVERFLOW_HEIGHT;
  }

  const R = Matrix.submatrix(this.R, `${x}:${x+h-1}`, `${y}:${y+w-1}`);
  const G = Matrix.submatrix(this.G, `${x}:${x+h-1}`, `${y}:${y+w-1}`);
  const B = Matrix.submatrix(this.B, `${x}:${x+h-1}`, `${y}:${y+w-1}`);

  return new Image()._fromRGB(R, G, B, w, h);
}

module.exports = crop;
