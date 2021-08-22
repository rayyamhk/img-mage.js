const Matrix = require("@rayyamhk/matrix");
const Image = require('../../Image');
const { INVALID_RGB } = require('../../Errors');

function RGBtoYIQ() {
  if (this.channels.length < 3) {
    throw INVALID_RGB;
  }

  const M = new Matrix([
    [0.299, 0.587, 0.114],
    [0.596, -0.275, -0.321],
    [0.212, -0.523, 0.311],
  ]);

  const w = this.width;
  const h = this.height;

  let Y = [], I = [], Q = [];

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const rgb = new Matrix([
        [this.channels[0][i][j]],
        [this.channels[1][i][j]],
        [this.channels[2][i][j]],
      ]);
      const yiq = Matrix.multiply(M, rgb)._matrix;
      Y.push(yiq[0][0]);
      I.push(yiq[1][0]);
      Q.push(yiq[2][0]);
    }
  }

  Y = Matrix.fromArray(Y, h, w)._matrix;
  I = Matrix.fromArray(I, h, w)._matrix;
  Q = Matrix.fromArray(Q, h, w)._matrix;

  const channels = [Y, I, Q];

  if (this.channels.length === 4) {
    channels.push(this.channels[3]);
  }

  return new Image()._fromChannels(channels, w, h, this);
}

module.exports = RGBtoYIQ;
