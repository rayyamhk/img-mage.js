const isFilter = require('../../utils/isFilter');
const { invalid_filter_size, invalid_1D_filter, invalid_direction } = require('../../Errors');

function convolve1D(filter, direction, ...channels) {
  if (!isFilter(filter, 1)) {
    throw invalid_1D_filter(filter);
  }

  if (!direction || !['x', 'y'].includes(direction)) {
    throw invalid_direction(direction);
  }

  const width = this.width;
  const height = this.height;
  const filterMaxSize = Math.min(width, height);
  const filterSize = filter.length;

  if (filterSize > filterMaxSize || filterSize % 2 !== 1) {
    throw invalid_filter_size(filterSize);
  }

  const padSize = (filterSize - 1) / 2;

  const cb = (pixel, i, j, k, channel) => {
    let sum = 0;
    for (let n = -padSize; n <= padSize; n++) {
      const posX = direction === 'x' ? i - n : i;
      const posY = direction === 'y' ? j - n : j;
      if (posX < 0 || posX >= height || posY < 0 || posY >= width) {
        continue; // weight = 0
      }
      const weight = filter[n+padSize];
      const intensity = channel[posX][posY];
      sum += intensity * weight;
    }
    return sum;
  }

  return this.map(cb, ...channels);
}

module.exports = convolve1D;
