const getImageLoader = require('./utils/getImageLoader');
const getImageSaver = require('./utils/getImageSaver');
const { expect_nonnegative, overflow } = require('./Errors');

class Image {
  constructor() {
    this.channels = [];
    this.width = 0;
    this.height = 0;
    this.bitDepth = 0;
    this.fourierChannels = [];
    this.fourierCenterX = null;
    this.fourierCenterY = null;
  }

  getDimensions() {
    return [this.width, this.height, this.channels.length];
  }

  getBitDepth() {
    return this.bitDepth;
  }

  getPixel(i, j) {
    if ((!i && i !== 0) || typeof i !== 'number' || !Number.isInteger(i) || i < 0) {
      throw expect_nonnegative(i);
    }
    if (i >= this.height) {
      throw overflow(i, this.height);
    }
    if ((!j && j !== 0) || typeof j !== 'number' || !Number.isInteger(j) || j < 0) {
      throw expect_nonnegative(j);
    }
    if (j >= this.width) {
      throw overflow(j, this.width);
    }
    const pixel = [];
    for (let k = 0; k < this.channels.length; k++) {
      pixel.push(this.channels[k][i][j]);
    }
    return pixel;
  }

  load(path, option) {
    const loader = getImageLoader(path);

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
    const saver = getImageSaver(path);
    saver(path, this.channels, this.width, this.height);
  }

  _fromChannels(channels, width, height, image) {
    this.bitDepth = image.bitDepth;
    this.ignoreAlpha = image.ignoreAlpha;

    this.channels = channels;
    this.width = width;
    this.height = height;
    this.fourierChannels = [];
    this.fourierCenterX = null;
    this.fourierCenterY = null;
    return this;
  }

  _fromFourierChannels(fourierChannels, centerX, centerY, spatialChannels, width, height, image) {
    this.bitDepth = image.bitDepth;
    this.ignoreAlpha = image.ignoreAlpha;

    this.channels = spatialChannels;
    this.fourierChannels = fourierChannels;
    this.fourierCenterX = centerX;
    this.fourierCenterY = centerY;
    this.width = width;
    this.height = height;
    return this;
  }
}

module.exports = Image;

// utils
Image.prototype.clip = require('./core/utils/clip');
Image.prototype.detectCorners = require('./core/utils/detectCorners');
Image.prototype.fourierMap = require('./core/utils/fourierMap');
Image.prototype.fourierPhase = require('./core/utils/fourierPhase');
Image.prototype.fourierSpectrum = require('./core/utils/fourierSpectrum');
Image.prototype.map = require('./core/utils/map');
Image.prototype.plot = require('./core/utils/plot');
Image.prototype.rescale = require('./core/utils/rescale');
Image.prototype.RGBtoYIQ = require('./core/utils/RGBtoYIQ');
Image.prototype.YIQtoRGB = require('./core/utils/YIQtoRGB');

// transformations
Image.prototype.crop = require('./core/transformations/crop');
Image.prototype.logTransform = require('./core/transformations/logTransform');
Image.prototype.negative = require('./core/transformations/negative');
Image.prototype.pad = require('./core/transformations/pad');
Image.prototype.powerLawTransform = require('./core/transformations/powerLawTransform');
Image.prototype.reflectX = require('./core/transformations/reflectX');
Image.prototype.reflectY = require('./core/transformations/reflectY');
Image.prototype.rotate = require('./core/transformations/rotate');
// Image.prototype.scale = require('./core/transformations/scale');

// enhancement
Image.prototype.blur = require('./core/enhancements/blur');
Image.prototype.sharpen = require('./core/enhancements/sharpen');

// operations
Image.prototype.abs = require('./core/operations/abs');
Image.prototype.add = require('./core/operations/add');
Image.prototype.convolve1D = require('./core/operations/convolve1D');
Image.prototype.convolve2D = require('./core/operations/convolve2D');
Image.prototype.fourier = require('./core/operations/fourier');
Image.prototype.inverseFourier = require('./core/operations/inverseFourier');
Image.prototype.multiply = require('./core/operations/multiply');
Image.prototype.subtract = require('./core/operations/subtract');

// static
Image.CONSTANT = require('./core/constant');
Image.generate = require('./utils/generate');
Image.filter = require('./core/utils/filter');
