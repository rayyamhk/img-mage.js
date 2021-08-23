const Matrix = require('@rayyamhk/matrix');

function isFilter(filter, dim) {
  if (dim === 1) {
    try {
      new Matrix([filter]);
      return true;
    } catch (e) {
      return false;
    }
  }

  try {
    new Matrix(filter);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = isFilter;
