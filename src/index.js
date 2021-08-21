const getImageLoader = require('./utils/getImageLoader');
const constant = require('./core/constant');

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

// utils
Image.prototype.clip = require('./core/utils/clip');
// Image.prototype.detectCorners = require('./core/detectCorners');
// Image.prototype.detectEdges = require('./core/detectEdges');
Image.kernel = require('./core/utils/kernel');
Image.prototype.map = require('./core/utils/map');
Image.prototype.RGBtoYIQ = require('./core/utils/RGBtoYIQ');
Image.prototype.YIQtoRGB = require('./core/utils/YIQtoRGB');

// transformations
Image.prototype.crop = require('./core/transformations/crop');
Image.prototype.negative = require('./core/transformations/negative');
Image.prototype.pad = require('./core/transformations/pad');
Image.prototype.powerLawTransform = require('./core/transformations/powerLawTransform');
Image.prototype.reflectX = require('./core/transformations/reflectX');
Image.prototype.reflectY = require('./core/transformations/reflectY');
Image.prototype.rotate = require('./core/transformations/rotate');
// Image.prototype.scale = require('./core/transformations/scale');

// enhancement
Image.prototype.blur = require('./core/enhancements/blur');
// Image.prototype.sharpen = require('./core/enhancements/sharpen');

// restoration
// Image.prototype.denoising = require('./core/denoising');

// operations
Image.property.add = require('./core/operations/add');
Image.prototype.convolve1D = require('./core/operations/convolve1D');
Image.prototype.convolve2D = require('./core/operations/convolve2D');
// Image.prototype.fourier = require('./core/fourier');
// Image.prototype.inverseFourier = require('./core/inverseFourier');

// constants
Image.CONSTANT = constant;





// Image.property.addNoise = require('./core/addNoise);