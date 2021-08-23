const { saveJPEG } = require('./JPEG');
const { invalid_image_path, unknown_image } = require('../Errors');

const savers = {
  jpg: saveJPEG,
  jpeg: saveJPEG,
};

function getImageSaver(path) {
  if (typeof path !== 'string') {
    throw invalid_image_path(path);
  }

  let fileExt = path.split('.');

  if (fileExt.length < 2) {
    throw invalid_image_path(path);
  }

  fileExt = fileExt[fileExt.length - 1];

  for (let key in savers) {
    if (fileExt === key) {
      return savers[key];
    }
  }

  throw unknown_image(path);
}

module.exports = getImageSaver;
