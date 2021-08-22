const Matrix = require('@rayyamhk/matrix');
const { invalid_kernel_size, invalid_kernel } = require('../../Errors');

function convolve2D(kernel, ...channels) {
  try {
    kernel = new Matrix(kernel);
  } catch (error) {
    throw invalid_kernel(kernel);
  }

  const [row, col] = kernel.size();

  if (row !== col) {
    throw invalid_kernel_size(row, col);
  }

  kernel = kernel._matrix;

  const width = this.width;
  const height = this.height;
  const kernelMax = Math.min(width, height);
  const kernelSize = row;

  if (kernelSize > kernelMax || kernelSize % 2 !== 1) {
    throw invalid_kernel_size(kernelSize);
  }

  const padSize = (kernelSize - 1) / 2;

  const cb = (pixel, i, j, k, channel) => {
    let sum = 0;
    for (let x = -padSize; x <= padSize; x++) {
      for (let y = -padSize; y <= padSize; y++) {
        const posX = i - x;
        const posY = j - y;
        if (posX < 0 || posX >= height || posY < 0 || posY >= width) {
          continue; // weight = 0
        }
        const weight = kernel[x+padSize][y+padSize];
        const intensity = channel[posX][posY];
        sum += intensity * weight;
      }
    }
    return sum;
  }

  return this.map(cb, ...channels);
}

module.exports = convolve2D;
