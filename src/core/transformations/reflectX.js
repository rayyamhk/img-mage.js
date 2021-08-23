function reflectX(...channels) {
  const h = this.height;

  const cb = (pixel, i, j, k, channel) => channel[h - 1 - i][j];

  return this.map(cb, ...channels);
}

module.exports = reflectX;
