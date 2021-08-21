const getImageLoader = require('./utils/getImageLoader');

class Image {
  constructor() {
    this.channels = [];
    this.width = 0;
    this.height = 0;
    this.bitDepth = 0;
    this.saver = null;
  }

  fromSource(path, option) {
    const [loader, saver] = getImageLoader(path);
    this.saver = saver;

    const {
      bitDepth,
      width,
      height,
      channels,
    } = loader(path);

    const {
      ignoreAlpha = true,
    } = option || {};

    this.width = width;
    this.height = height;
    this.bitDepth = bitDepth;
    this.channels = channels;
    this.ignoreAlpha = ignoreAlpha;

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

Image.prototype.RGBtoYIQ = require('./core/RGBtoYIQ');
Image.prototype.YIQtoRGB = require('./core/YIQtoRGB');
Image.prototype.clip = require('./core/clip');

Image.prototype.rotate = require('./core/rotate');
Image.prototype.crop = require('./core/crop');

Image.prototype.reflectX = require('./core/reflectX');
Image.prototype.reflectY = require('./core/reflectY');
// Image.prototype.scale = require('./core/scale');
Image.prototype.negative = require('./core/negative');
Image.prototype.blur = require('./core/blur');
// Image.prototype.sharpen = require('./core/sharpen');
// Image.prototype.denoising = require('./core/denoising');
Image.prototype.powerLawTransform = require('./core/powerLawTransform');

Image.prototype.pad = require('./core/pad');
Image.prototype.convolve2D = require('./core/convolve2D');
Image.prototype.convolve1D = require('./core/convolve1D');
Image.prototype.map = require('./core/map');

Image.kernel = require('./core/kernel');

// Image.prototype.detectEdges = require('./core/detectEdges');
// Image.prototype.detectCorners = require('./core/detectCorners');
// Image.prototype.fourier = require('./core/fourier');
// Image.prototype.inverseFourier = require('./core/inverseFourier');

// Image.property.addNoise = require('./core/addNoise);
// Image.property.add = require()