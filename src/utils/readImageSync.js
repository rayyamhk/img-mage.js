const fs = require('fs');

const checkExtension = require('./checkExtension');
const { invalid_image_path } = require('../Errors');

function readImageSync(path, ...exts) {
  if (!checkExtension(path, ...exts)) {
    throw invalid_image_path(path);
  }

  return fs.readFileSync(path);
};

module.exports = readImageSync;
