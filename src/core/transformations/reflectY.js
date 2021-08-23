function reflectY(...channels) {
  const w = this.width;

  const cb = (pixel, i, j, k, channel) => channel[i][w - 1 - j]

  return this.map(cb, ...channels);
}

module.exports = reflectY;
