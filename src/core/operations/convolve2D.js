const isFilter = require('../../utils/isFilter');
const { invalid_filter_shape, invalid_filter_size, invalid_2D_filter } = require('../../Errors');

function convolve2D(filter, ...channels) {
  if (!isFilter(filter, 2)) {
    throw invalid_2D_filter(filter);
  }

  const row = filter.length;
  const col = filter[0].length;

  if (row !== col) {
    throw invalid_filter_shape(row, col);
  }

  const width = this.width;
  const height = this.height;
  const filterMaxSize = Math.min(width, height);
  const filterSize = row;

  if (filterSize > filterMaxSize || filterSize % 2 !== 1) {
    throw invalid_filter_size(filterSize);
  }

  const padSize = (filterSize - 1) / 2;

  const cb = (pixel, i, j, k, channel) => {
    let sum = 0;
    for (let x = -padSize; x <= padSize; x++) {
      for (let y = -padSize; y <= padSize; y++) {
        const posX = i - x;
        const posY = j - y;
        if (posX < 0 || posX >= height || posY < 0 || posY >= width) {
          continue; // weight = 0
        }
        const weight = filter[x+padSize][y+padSize];
        const intensity = channel[posX][posY];
        sum += intensity * weight;
      }
    }
    return sum;
  }

  return this.map(cb, ...channels);
}

module.exports = convolve2D;
