const Matrix = require('@rayyamhk/matrix');
const { invalid_kernel_size, invalid_kernel } = require('../Errors');

function convolve(kernel, ...channels) {
  if (!(kernel instanceof Matrix)) {
    throw invalid_kernel(kernel);
  }

  const [row, col] = kernel.size();

  if (row !== col) {
    throw invalid_kernel_size(row, col);
  }

  const width = this.width;
  const height = this.height;
  const kernelMax = Math.min(width, height);
  const kernelSize = row;

  if (kernelSize > kernelMax || kernelSize % 2 !== 1) {
    throw invalid_kernel_size(kernelSize);
  }

  const padSize = (kernelSize - 1) / 2;

  const cb = (channel) => Matrix.generate(height, width, (i, j) => {
    let sum = 0;
    for (let x = -padSize; x <= padSize; x++) {
      for (let y = -padSize; y <= padSize; y++) {
        const posX = i - x;
        const posY = j - y;
        if (posX < 0 || posX >= height || posY < 0 || posY >= width) {
          continue; // weight = 0
        }
        const weight = kernel._matrix[x+padSize][y+padSize];
        const intensity = channel._matrix[posX][posY];
        sum += intensity * weight;
      }
    }
    return sum;
  });

  return this.map(cb, ...channels);
}

module.exports = convolve;
