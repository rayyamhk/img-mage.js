const fs = require('fs');
const Matrix = require('@rayyamhk/matrix');
const jpeg = require('jpeg-js');
const { INVALID_IMAGE } = require('../Errors')

function loadJPEG(path) {
  const buffer = fs.readFileSync(path);
  const {
    width,
    height,
    data,
  } = jpeg.decode(buffer, { useTArray: true });

  let R = [], G = [], B = [], A = [];
  for (let i = 0; i < data.length; i += 4) {
    R.push(data[i]);
    G.push(data[i + 1]);
    B.push(data[i + 2]);
    A.push(data[i + 3]);
  }

  R = Matrix.fromArray(R, height, width);
  G = Matrix.fromArray(G, height, width);
  B = Matrix.fromArray(B, height, width);
  A = Matrix.fromArray(A, height, width);

  return {
    bitDepth: 8,
    width,
    height,
    channels: [R, G, B, A],
  };
}

function saveJPEG(path, channels, width, height) {
  let [R, G, B, A] = channels;
  if (!R || !G || !B || !A) {
    throw INVALID_IMAGE;
  }

  R = R.flatten();
  G = G.flatten();
  B = B.flatten();
  A = A.flatten();

  const length = width * height * 4;
  const buffer = Buffer.alloc(length);
  let count = 0;
  for (let i = 0; i < length; i += 4) {
    buffer[i] = R[count];
    buffer[i + 1] = G[count];
    buffer[i + 2] = B[count];
    buffer[i + 3] = A[count];
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
