const { loadJPEG } = require('./JPEG');
const { invalid_image_path, unknown_image } = require('../Errors');

const loaders = {
  jpg: loadJPEG,
  jpeg: loadJPEG,
};

function getImageLoader(path) {
  if (typeof path !== 'string') {
    throw invalid_image_path(path);
  }

  let fileExt = path.split('.');

  if (fileExt.length < 2) {
    throw invalid_image_path(path);
  }

  fileExt = fileExt[fileExt.length - 1];

  for (let key in loaders) {
    if (fileExt === key) {
      return loaders[key];
    }
  }

  throw unknown_image(path);
}

module.exports = getImageLoader;
