const Complex = require('@rayyamhk/complex');
const Image = require('../../Image');
const isValidChannels = require('../../utils/isValidChannels');
const generate = require('../../utils/generate');

function fourier(...channels) {
  channels = isValidChannels(channels, this.channels.length);

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

  const fourierChannels = [];
  const spatialChannels = [];

  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];

    if (channels.includes(k)) {
      const padded = generate(w, h, (i, j) => {
        if (i < this.height && j < this.width) {
          return channel[i][j];
        }
        return 0;
      });
  
      const tempF = new Array(w * h);
      const F = new Array(w * h);
  
      for (let x = 0; x < h; x++) {
        let row = new Array(w);
        for (let y = 0; y < w; y++) {
          row[y] = new Complex(padded[x][y] * Math.pow(-1, y));
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

      const fourierChannel = generate(this.width, this.height, (i, j) => F[i * w + j]);
      fourierChannels.push(fourierChannel);
      spatialChannels.push(null);
    } else {
      fourierChannels.push(null);
      spatialChannels.push(channel);
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
