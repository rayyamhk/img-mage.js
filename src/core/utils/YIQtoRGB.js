const Matrix = require("@rayyamhk/matrix");
const Image = require('../../Image');
const { INVALID_RGB } = require('../../Errors');

function YIQtoRGB() {
  if (this.channels.length < 3) {
    throw INVALID_RGB;
  }

  const M = new Matrix([
    [1, 0.955688, 0.619858],
    [1, -0.271582, -0.646874],
    [1, -1.108177, 1.705065],
  ]);

  const w = this.width;
  const h = this.height;

  let R = [], G = [], B = [];

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const yiq = new Matrix([
        [this.channels[0][i][j]],
        [this.channels[1][i][j]],
        [this.channels[2][i][j]],
      ]);
      const rgb = Matrix.multiply(M, yiq)._matrix;
      R.push(rgb[0][0]);
      G.push(rgb[1][0]);
      B.push(rgb[2][0]);
    }
  }

  R = Matrix.fromArray(R, h, w)._matrix;
  G = Matrix.fromArray(G, h, w)._matrix;
  B = Matrix.fromArray(B, h, w)._matrix;

  const channels = [R, G, B];

  if (this.channels.length === 4) {
    channels.push(this.channels[3]);
  }

  return new Image()._fromChannels(channels, w, h, this);
}

module.exports = YIQtoRGB;
