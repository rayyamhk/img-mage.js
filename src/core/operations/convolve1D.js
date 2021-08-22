const Matrix = require('@rayyamhk/matrix');
const { invalid_kernel_size, invalid_kernel, invalid_argument } = require('../../Errors');

function convolve1D(kernel, direction, ...channels) {
  try {
    kernel = new Matrix([kernel]);
  } catch (err) {
    throw invalid_kernel(kernel);
  }

  const [row, col] = kernel.size();

  if (row !== 1 && col !== 1) {
    invalid_kernel_size(row, col);
  }

  if (!direction || !['x', 'y'].includes(direction)) {
    throw invalid_argument('direction', 'x or y', direction);
  }

  kernel = kernel.flatten();

  const width = this.width;
  const height = this.height;
  const kernelMax = Math.min(width, height);
  const kernelSize = kernel.length;

  if (kernelSize > kernelMax || kernelSize % 2 !== 1) {
    throw invalid_kernel_size(kernelSize);
  }

  const padSize = (kernelSize - 1) / 2;

  const cb = (pixel, i, j, k, channel) => {
    let sum = 0;
    for (let n = -padSize; n <= padSize; n++) {
      const posX = direction === 'x' ? i - n : i;
      const posY = direction === 'y' ? j - n : j;
      if (posX < 0 || posX >= height || posY < 0 || posY >= width) {
        continue; // weight = 0
      }
      const weight = kernel[n+padSize];
      const intensity = channel[posX][posY];
      sum += intensity * weight;
    }
    return sum;
  }

  return this.map(cb, ...channels);
}

module.exports = convolve1D;
