function abs(...channels) {
  const cb = (pixel) => Math.abs(pixel);

  return this.map(cb, ...channels);
}

module.exports = abs;
