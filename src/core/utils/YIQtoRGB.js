const Matrix = require("@rayyamhk/matrix");
const Image = require('../../Image');
const { invalid_channels_number } = require('../../Errors');

function YIQtoRGB() {
  if (this.channels.length < 3) {
    throw invalid_channels_number(this.channels.length);
  }

  const M = new Matrix([
    [1, 0.955688, 0.619858],
    [1, -0.271582, -0.646874],
    [1, -1.108177, 1.705065],
  ]);

  const width = this.width;
  const height = this.height;

  let R = [], G = [], B = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const yiq = new Matrix([
        [this.channels[0]._matrix[i][j]],
        [this.channels[1]._matrix[i][j]],
        [this.channels[2]._matrix[i][j]],
      ]);
      const rgb = Matrix.multiply(M, yiq);
      R.push(rgb._matrix[0][0]);
      G.push(rgb._matrix[1][0]);
      B.push(rgb._matrix[2][0]);
    }
  }

  R = Matrix.fromArray(R, height, width);
  G = Matrix.fromArray(G, height, width);
  B = Matrix.fromArray(B, height, width);

  const channels = [R, G, B];

  if (this.channels.length === 4) {
    channels.push(this.channels[3]);
  }

  return new Image()._fromChannels(channels, width, height, this);
}

module.exports = YIQtoRGB;
