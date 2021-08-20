const fs = require('fs');
const Matrix = require('@rayyamhk/matrix');
const jpeg = require('jpeg-js');
const readImageSync = require('./utils/readImageSync');
const { INVALID_IMAGE } = require('./Errors')

class Image {
  constructor() {
    this.R = null;
    this.G = null;
    this.B = null;
    this.width = 0;
    this.height = 0;
  }

  fromSource(path) {
    const buffer = readImageSync(path, 'jpg', 'jpeg');
    const {
      width,
      height,
      data,
    } = jpeg.decode(buffer, { useTArray: true, formatAsRGBA: false });

    const R = [], G = [], B = [];
    for (let i = 0; i < data.length; i += 3) {
      R.push(data[i]);
      G.push(data[i + 1]);
      B.push(data[i + 2]);
    }

    this.width = width;
    this.height = height;
    this.R = Matrix.fromArray(R, height, width);
    this.G = Matrix.fromArray(G, height, width);
    this.B = Matrix.fromArray(B, height, width);
    return this;
  }

  save(path) {
    if (!this.R || !this.G || !this.B) {
      throw INVALID_IMAGE;
    }

    const R = this.R.flatten();
    const G = this.G.flatten();
    const B = this.B.flatten();

    const length = this.width * this.height * 4;
    const buffer = Buffer.alloc(length);
    let count = 0;
    for (let i = 0; i < length; i += 4) {
      buffer[i] = R[count];
      buffer[i + 1] = G[count];
      buffer[i + 2] = B[count];
      buffer[i + 3] = 0xFF;
      count += 1;
    }

    const encoded = jpeg.encode({
      data: buffer,
      width: this.width,
      height: this.height,
    }, 100);
    
    fs.writeFileSync(path, encoded.data);
  }

  _fromRGB(R, G, B, width, height) {
    this.R = R;
    this.G = G;
    this.B = B;
    this.width = width;
    this.height = height;
    return this;
  }
}

module.exports = Image;

Image.prototype.rotate = require('./core/rotate');
Image.prototype.crop = require('./core/crop');

Image.prototype.reflectX = require('./core/reflectX');
Image.prototype.reflectY = require('./core/reflectY');
// Image.prototype.scale = require('./core/scale');
// Image.prototype.negative = require('./core/negative');
// Image.prototype.blur = require('./core/blur');
// Image.prototype.sharpen = require('./core/sharpen');
// Image.prototype.denoising = require('./core/denoising');
// Image.prototype.logTransform = require('./core/logTransform');
// Image.prototype.powerTransform = require('./core/powerTransform');

// Image.prototype.pad = require('./core/pad');
// Image.prototype.convolve = require('./core/convolve');
// Image.prototype.correlate = require('./core/correlate');
// Image.prototype.pixelwise = require('./core/pixelwise');

// Image.prototype.detectEdges = require('./core/detectEdges');
// Image.prototype.detectCorners = require('./core/detectCorners');
// Image.prototype.fourier = require('./core/fourier');
// Image.prototype.inverseFourier = require('./core/inverseFourier');
