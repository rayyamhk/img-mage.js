const Matrix = require('@rayyamhk/matrix');
const {
  invalid_index,
  expect_nonnegative,
} = require('../../Errors');

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
  
  if (typeof h !== 'number' || !Number.isInteger(h) || h < 0) {
    throw expect_nonnegative(h);
  }

  const y_end = Math.min(y + w - 1, width - 1);
  const x_end = Math.min(x + h - 1, height - 1);

  const cb = (channel) => Matrix.submatrix(channel, `${x}:${x_end}`, `${y}:${y_end}`);

  return this.map(cb);
}

module.exports = crop;
