const Matrix = require('@rayyamhk/matrix');

function reflectX() {
  const height = this.height;
  const width = this.width;
  const cb = (channel) => Matrix.generate(height, width, (i, j) => channel._matrix[height - 1 - i][j]);

  return this.map(cb);
}

module.exports = reflectX;
