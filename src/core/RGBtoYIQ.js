const Matrix = require("@rayyamhk/matrix");
const Image = require('../index');
const { invalid_channels_number } = require('../Errors');

function RGBtoYIQ() {
  if (this.channels.length < 3) {
    throw invalid_channels_number(this.channels.length);
  }

  const M = new Matrix([
    [0.299, 0.587, 0.114],
    [0.596, -0.275, -0.321],
    [0.212, -0.523, 0.311],
  ]);

  const width = this.width;
  const height = this.height;

  let Y = [], I = [], Q = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const rgb = new Matrix([
        [this.channels[0]._matrix[i][j]],
        [this.channels[1]._matrix[i][j]],
        [this.channels[2]._matrix[i][j]],
      ]);
      const yiq = Matrix.multiply(M, rgb);
      Y.push(yiq._matrix[0][0]);
      I.push(yiq._matrix[1][0]);
      Q.push(yiq._matrix[2][0]);
    }
  }

  Y = Matrix.fromArray(Y, height, width);
  I = Matrix.fromArray(I, height, width);
  Q = Matrix.fromArray(Q, height, width);

  const channels = [Y, I, Q];

  if (this.channels.length === 4) {
    channels.push(this.channels[3]);
  }

  return new Image()._fromChannels(channels, width, height, this);
}

module.exports = RGBtoYIQ;
