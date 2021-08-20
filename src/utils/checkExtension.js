function checkExtension(path, ...exts) {
  if (typeof path !== 'string') {
    return false;
  }

  let fileExt = path.split('.');

  if (fileExt.length < 2) {
    return false;
  }

  fileExt = fileExt[fileExt.length - 1];

  for (let ext of exts) {
    if (ext === fileExt) {
      return true;
    }
  }
  return false;
};

module.exports = checkExtension;
