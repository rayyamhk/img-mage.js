const Matrix = require('@rayyamhk/matrix');

function rescale() {
  const h = this.height;
  const w = this.width;
  const maxIntensity = 2 ** this.bitDepth - 1;

  const cb = (channel) => {
    let max = Number.NEGATIVE_INFINITY;
    for (let x = 0; x < h; x++) {
      for (let y = 0; y < w; y++) {
        max = Math.max(max, channel._matrix[x][y]);
      }
    }
    if (max === 0) {
      return channel; // black image
    }

    return Matrix.generate(h, w, (i, j) => channel._matrix[i][j] * maxIntensity / max);
  }

  if (this.channels.length === 4) {
    return this.map(cb, 0, 1, 2);
  }

  return this.map(cb);
}

module.exports = rescale;
