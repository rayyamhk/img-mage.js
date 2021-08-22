const Complex = require('@rayyamhk/complex');
const Matrix = require('@rayyamhk/matrix');
const Image = require('../../Image');
const { invalid_channels } = require('../../Errors');

function fourier(...channels) {
  let w = this.width;
  let h = this.height;

  // pad the image to 2^k
  let wExp = 0;
  while (w > 1) {
    w /= 2;
    wExp += 1;
  }

  let hExp = 0;
  while (h > 1) {
    h /= 2;
    hExp += 1;
  }

  h = Math.pow(2, hExp);
  w = Math.pow(2, wExp);

  if (channels.length > 4) {
    throw invalid_channels(channels);
  }

  if (channels.length === 0) {
    let length = this.channels.length;
    if (length === 4 && this.ignoreAlpha) {
      length = 3;
    }
    channels = [...new Array(this.channels.length).keys()];
  }

  const fourierChannels = [];
  const spatialChannels = [];

  for (let i = 0; i < this.channels.length; i++) {
    if (channels.includes(i)) {
      const channel = this.channels[i];
      const padded = Matrix.generate(h, w, (i, j) => {
        if (i < this.height && j < this.width) {
          return channel._matrix[i][j];
        }
        return 0;
      });
  
      const tempF = new Array(w * h);
      const F = new Array(w * h);
  
      for (let x = 0; x < h; x++) {
        let row = new Array(w);
        for (let y = 0; y < w; y++) {
          row[y] = new Complex(padded._matrix[x][y] * Math.pow(-1, y));
        }
  
        row = fourier1D(row);
  
        for (let y = 0; y < w; y++) {
          tempF[x * w + y] = row[y];
        }
      }
  
      for (let y = 0; y < w; y++) {
        let col = new Array(h);
        for (let x = 0; x < h; x++) {
          col[x] = Complex.multiply(tempF[x * w + y], new Complex(Math.pow(-1, x)));
        }
  
        col = fourier1D(col);
  
        for (let x = 0; x < h; x++) {
          F[x * w + y] = col[x];
        }
      }
  
      const re = new Array(w * h);
      const im = new Array(w * h);
  
      for (let i = 0; i < w * h; i++) {
        re[i] = F[i].getReal();
        im[i] = F[i].getImaginary();
      }
  
      const paddedRe = Matrix.fromArray(re, h, w);
      const unpaddedRe = Matrix.submatrix(paddedRe, `0:${this.height - 1}`, `0:${this.width - 1}`);
      const paddedIm = Matrix.fromArray(im, h, w);
      const unpaddedIm = Matrix.submatrix(paddedIm, `0:${this.height - 1}`, `0:${this.width - 1}`);
      fourierChannels.push(unpaddedRe, unpaddedIm);
      spatialChannels.push(null);
    } else {
      fourierChannels.push(null, null);
      spatialChannels.push(this.channels[i]);
    }
  }

  return new Image()._fromFourierChannels(fourierChannels, spatialChannels, this.width, this.height, this);
}

function fourier1D(f) {
  const length = f.length; // assume 2^n

  if (length === 2) {
    const odd = Complex.multiply(f[1], W(0, 2));
    const f0 = Complex.add(f[0], odd);
    const f1 = Complex.subtract(f[0], odd);
    return [f0, f1];
  }

  const feven = new Array(length / 2);
  const fodd = new Array(length / 2);
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      feven[i / 2] = f[i];
    } else {
      fodd[(i - 1) / 2] = f[i];
    }
  }

  const Fevens = fourier1D(feven);
  const Fodds = fourier1D(fodd);

  const F = new Array(length);
  for (let i = 0; i < length / 2; i++) {
    const odd = Complex.multiply(Fodds[i], W(i, length));
    F[i] = Complex.add(Fevens[i], odd);
    F[i + length / 2] = Complex.subtract(Fevens[i], odd);
  }
  return F;
}

function W(u, k) {
  const theta = -2 * Math.PI * u / k;
  return new Complex(Math.cos(theta), Math.sin(theta));
}

module.exports = fourier;
