function clip(...channels) {
  const maxIntensity = 2 ** this.bitDepth - 1;
  const w = this.width;
  const h = this.height;

  const cb = (pixel) => {
    if (pixel < 0) {
      return 0;
    }
    if (pixel > maxIntensity) {
      return maxIntensity;
    }
    return pixel;
  }

  return this.map(cb, ...channels);
}

module.exports = clip;
