const Matrix = require('@rayyamhk/matrix');
const Image = require('../../index');
const { invalid_fourier_channels } = require('../../Errors');

function fourierSpectrum() {
  if (!this.fourierChannels || !Array.isArray(this.fourierChannels) || this.fourierChannels.length % 2 !== 0) {
    throw invalid_fourier_channels(this.fourierChannels);
  }

  const w = this.width;
  const h = this.height;
  const spatialChannels = [];

  for (let i = 0; i < this.channels.length; i++) {
    let re = this.fourierChannels[2 * i];
    let im = this.fourierChannels[2 * i + 1];

    if (re === null || im === null) {
      spatialChannels.push(Matrix.zero(h, w));
      continue;
    }

    re = re._matrix;
    im = im._matrix;

    spatialChannels.push(Matrix.generate(h, w, (i, j) => Math.sqrt(re[i][j] ** 2 + im[i][j] ** 2)));
  }

  return new Image()._fromChannels(spatialChannels, w, h, this);
}

module.exports = fourierSpectrum;
