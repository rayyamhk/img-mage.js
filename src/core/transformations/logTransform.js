function logTransform(...channels) {
  const maxIntensity = 2 ** this.bitDepth - 1;
  const rescale = maxIntensity / Math.log(maxIntensity + 1);

  const cb = (pixel) => Math.log(pixel + 1) * rescale;

  return this.map(cb, ...channels);
}

module.exports = logTransform;
