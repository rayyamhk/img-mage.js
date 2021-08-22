function negative(...channels) {
  const maxIntensity = 2 ** this.bitDepth - 1;
  const cb = (pixel) => maxIntensity - pixel;

  return this.map(cb, ...channels);
}

module.exports = negative;
