const getImageLoader = require('./utils/getImageLoader');
const getImageSaver = require('./utils/getImageSaver');
const constant = require('./core/constant');

class Image {
  constructor() {
    this.channels = [];
    this.fourierChannels = [];
    this.width = 0;
    this.height = 0;
    this.bitDepth = 0;
    this.saver = null;
  }

  size() {
    return [this.width, this.height];
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
    this.fourierChannels = [];
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
    this.fourierChannels = [];
    this.width = width;
    this.height = height;
    return this;
  }

  _fromFourierChannels(fourierChannels, spatialChannels, width, height, image) {
    this.bitDepth = image.bitDepth;
    this.ignoreAlpha = image.ignoreAlpha;

    this.channels = spatialChannels;
    this.fourierChannels = fourierChannels;
    this.width = width;
    this.height = height;
    return this;
  }
}

module.exports = Image;

// utils
Image.prototype.clip = require('./core/utils/clip');
Image.prototype.detectCorners = require('./core/utils/detectCorners');
Image.prototype.fourierPhase = require('./core/utils/fourierPhase');
Image.prototype.fourierSpectrum = require('./core/utils/fourierSpectrum');
Image.prototype.map = require('./core/utils/map');
Image.prototype.plot = require('./core/utils/plot');
Image.prototype.rescale = require('./core/utils/rescale');
Image.prototype.RGBtoYIQ = require('./core/utils/RGBtoYIQ');
Image.prototype.YIQtoRGB = require('./core/utils/YIQtoRGB');

Image.kernel = require('./core/utils/kernel');

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
// Image.prototype.sharpen = require('./core/enhancements/sharpen');

// restoration
// Image.prototype.denoising = require('./core/denoising');

// operations
Image.prototype.add = require('./core/operations/add');
Image.prototype.convolve1D = require('./core/operations/convolve1D');
Image.prototype.convolve2D = require('./core/operations/convolve2D');
Image.prototype.fourier = require('./core/operations/fourier');
Image.prototype.inverseFourier = require('./core/operations/inverseFourier');

// constants
Image.CONSTANT = constant;





// Image.property.addNoise = require('./core/addNoise);