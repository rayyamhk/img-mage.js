const getImageLoader = require('./utils/getImageLoader');

class Image {
  constructor() {
    this.channels = [];
    this.width = 0;
    this.height = 0;
    this.bitDepth = 0;
    this.saver = null;
  }

  fromSource(path) {
    const [loader, saver] = getImageLoader(path);
    this.saver = saver;

    const {
      bitDepth,
      width,
      height,
      channels,
    } = loader(path);

    this.width = width;
    this.height = height;
    this.bitDepth = bitDepth;
    this.channels = channels;

    return this;
  }

  save(path) {
    this.saver(path, this.channels, this.width, this.height);
  }

  _fromChannels(channels, width, height, image) {
    this.bitDepth = image.bitDepth;
    this.saver = image.saver;

    this.channels = channels;
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
Image.prototype.negative = require('./core/negative');
// Image.prototype.blur = require('./core/blur');
// Image.prototype.sharpen = require('./core/sharpen');
// Image.prototype.denoising = require('./core/denoising');
Image.prototype.powerLawTransform = require('./core/powerLawTransform');

Image.prototype.pad = require('./core/pad');
// Image.prototype.convolve = require('./core/convolve');
// Image.prototype.correlate = require('./core/correlate');
Image.prototype.map = require('./core/map');

// Image.prototype.detectEdges = require('./core/detectEdges');
// Image.prototype.detectCorners = require('./core/detectCorners');
// Image.prototype.fourier = require('./core/fourier');
// Image.prototype.inverseFourier = require('./core/inverseFourier');

// Image.property.addNoise = require('./core/addNoise);
// Image.property.add = require()