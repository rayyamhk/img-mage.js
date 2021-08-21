const Matrix = require('@rayyamhk/matrix');

function reflectY() {
  const width = this.width;
  const height = this.height;
  const cb = (channel) => Matrix.generate(height, width, (i, j) => channel._matrix[i][width - 1 - j]);

  return this.map(cb);
}

module.exports = reflectY;
