const Matrix = require('@rayyamhk/matrix');
const Complex = require('@rayyamhk/complex');
const Image = require('../../Image');

function fourierPhase() {
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

    spatialChannels.push(Matrix.generate(h, w, (i, j) => new Complex(re[i][j], im[i][j]).getArgument()));
  }

  return new Image()._fromChannels(spatialChannels, w, h, this);
}

module.exports = fourierPhase;
