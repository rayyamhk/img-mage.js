const fs = require('fs');
const Matrix = require('@rayyamhk/matrix');
const jpeg = require('jpeg-js');
const { INVALID_RGB } = require('../Errors')

function loadJPEG(path) {
  const buffer = fs.readFileSync(path);
  const {
    width,
    height,
    data,
  } = jpeg.decode(buffer, { useTArray: true, formatAsRGBA: false });

  let R = [], G = [], B = [];
  for (let i = 0; i < data.length; i += 3) {
    R.push(data[i]);
    G.push(data[i + 1]);
    B.push(data[i + 2]);
  }

  R = Matrix.fromArray(R, height, width)._matrix;
  G = Matrix.fromArray(G, height, width)._matrix;
  B = Matrix.fromArray(B, height, width)._matrix;

  return {
    bitDepth: 8,
    width,
    height,
    channels: [R, G, B],
  };
}

function saveJPEG(path, channels, width, height) {
  let [R, G, B] = channels;
  if (!R || !G || !B) {
    throw INVALID_RGB;
  }

  R = new Matrix(R).flatten();
  G = new Matrix(G).flatten();
  B = new Matrix(B).flatten();

  const length = width * height * 4;
  const buffer = Buffer.alloc(length);
  let count = 0;
  for (let i = 0; i < length; i += 4) {
    buffer[i] = R[count];
    buffer[i + 1] = G[count];
    buffer[i + 2] = B[count];
    buffer[i + 3] = 1;
    count += 1;
  }

  const encoded = jpeg.encode({
    data: buffer,
    width: width,
    height: height,
  }, 100);

  fs.writeFileSync(path, encoded.data);
}

module.exports = {
  loadJPEG,
  saveJPEG,
};
