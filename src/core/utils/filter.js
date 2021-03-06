const Complex = require('@rayyamhk/complex');
const constant = require('../constant');
const generate = require('../../utils/generate');
const { invalid_filter_size, expect_positive } = require('../../Errors');

function filter(type, ...options) {
  switch(type) {
    case constant.BOX_FILTER: {
      const size = options[0] || 3;
      if (typeof size !== 'number' || size % 2 !== 1) {
        throw invalid_filter_size(size);
      }
      return boxFilter(size);
    }
    case constant.LAPLACIAN_45: {
      return [
        [0, -1, 0],
        [-1, 4, -1],
        [0, -1, 0],
      ];
    }
    case constant.LAPLACIAN_90: {
      return [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1],
      ];
    }
    case constant.GAUSSIAN_1D: {
      const sigma = options[0] || 0.5;
      if (typeof sigma !== 'number' || sigma <= 0) {
        throw expect_positive(sigma);
      }
      return gaussianFilter1D(sigma);
    }
    case constant.GAUSSIAN_2D: {
      const sigma = options[0] || 0.5;
      if (typeof sigma !== 'number' || sigma <= 0) {
        throw expect_positive(sigma);
      }
      return gaussianFilter2D(sigma);
    }
    case constant.MAX_FILTER: {
      const size = options[0] || 3;
      if (typeof size !== 'number' || size % 2 !== 1) {
        throw invalid_filter_size(size);
      }
      const padSize = (size - 1) / 2;
      return (pixel, i, j, k, channel) => {
        const h = channel.length;
        const w = channel[0].length;

        let max = Number.NEGATIVE_INFINITY;
        for (let x = -padSize; x <= padSize; x++) {
          for (let y = -padSize; y <= padSize; y++) {
            const posX = i - x;
            const posY = j - y;
            if (posX < 0 || posX >= h || posY < 0 || posY >= w) {
              continue;
            }
            max = Math.max(channel[posX][posY], max);
          }
        }
        return max;
      }
    }
    case constant.MIN_FILTER: {
      const size = options[0] || 3;
      if (typeof size !== 'number' || size % 2 !== 1) {
        throw invalid_filter_size(size);
      }
      const padSize = (size - 1) / 2;
      return (pixel, i, j, k, channel) => {
        const h = channel.length;
        const w = channel[0].length;

        let min = Number.POSITIVE_INFINITY;
        for (let x = -padSize; x <= padSize; x++) {
          for (let y = -padSize; y <= padSize; y++) {
            const posX = i - x;
            const posY = j - y;
            if (posX < 0 || posX >= h || posY < 0 || posY >= w) {
              continue;
            }
            min = Math.min(channel[posX][posY], min);
          }
        }
        return min;
      }
    }
    case constant.MEDIAN_FILTER: {
      const size = options[0] || 3;
      if (typeof size !== 'number' || size % 2 !== 1) {
        throw invalid_filter_size(size);
      }
      const padSize = (size - 1) / 2;
      return (pixel, i, j, k, channel) => {
        const h = channel.length;
        const w = channel[0].length;

        const pixels = [];
        for (let x = -padSize; x <= padSize; x++) {
          for (let y = -padSize; y <= padSize; y++) {
            const posX = i - x;
            const posY = j - y;
            if (posX < 0 || posX >= h || posY < 0 || posY >= w) {
              continue;
            }
            pixels.push(channel[posX][posY]);
          }
        }
        pixels.sort((a, b) => a - b);
        const len = pixels.length;
        if (len % 2 === 1) {
          return pixels[(len - 1) / 2];
        }
        return 0.5 * pixels[len / 2] + 0.5 * pixels[len / 2 - 1];
      }
    }
    case constant.ILPF: {
      const cutoff = options[0] || 10;
      return (pixel, i, j, k, centerX, centerY) => {
        if (distance(i, j, centerX, centerY) <= cutoff) {
          return pixel;
        }
        return new Complex(0);
      }
    }
    case constant.GLPF: {
      const cutoff = options[0] || 10;
      return (pixel, i, j, k, centerX, centerY) => {
        const dist = distance(i, j, centerX, centerY);
        const scale = Math.exp(-0.5 * (dist ** 2) / (cutoff ** 2));
        return Complex.multiply(pixel, new Complex(scale));
      }
    }
    case constant.BLPF: {
      const cutoff = options[0] || 10;
      const order = options[1] || 2;
      return (pixel, i, j, k, centerX, centerY) => {
        const dist = distance(i, j, centerX, centerY);
        const scale = 1 / (1 + (dist / cutoff) ** (2 * order));
        return Complex.multiply(pixel, new Complex(scale));
      }
    }
    case constant.IHPF: {
      const cutoff = options[0] || 10;
      return (pixel, i, j, k, centerX, centerY) => {
        if (distance(i, j, centerX, centerY) <= cutoff) {
          return new Complex(0);
        }
        return pixel;
      }
    }
    case constant.GHPF: {
      const cutoff = options[0] || 10;
      return (pixel, i, j, k, centerX, centerY) => {
        const dist = distance(i, j, centerX, centerY);
        const scale = Math.exp(-0.5 * (dist ** 2) / (cutoff ** 2));
        return Complex.multiply(pixel, new Complex(1 - scale));
      }
    }
    case constant.BHPF: {
      const cutoff = options[0] || 10;
      const order = options[1] || 2;
      return (pixel, i, j, k, centerX, centerY) => {
        const dist = distance(i, j, centerX, centerY);
        const scale = 1 / (1 + (dist / cutoff) ** (2 * order));
        return Complex.multiply(pixel, new Complex(1 - scale));
      }
    }
  }   
}

module.exports = filter;

function boxFilter(size) {
  const weights = 1 / (size ** 2);
  return new Array(size).fill(new Array(size).fill(weights));
}

function gaussianFilter1D(sigma) {
  const temp = Math.pow(Math.log(1/1000)*-2*sigma*sigma, 0.5);
  const x = Math.floor(temp);

  const filter = new Array(2 * x + 1);
  const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
  let sum = 0;

  for (let i = 0; i <= x; i++) {
    filter[x + i] = coefficient * Math.exp(-0.5 * Math.pow(i / sigma, 2));
    sum += filter[x + i];

    if (i !== 0) {
      filter[x - i] = filter[x + i];
      sum += filter[x + i];
    }
  }

  for (let i = 0; i < 2 * x + 1; i++) {
    filter[i] /= sum;
  }

  return filter;
};

function gaussianFilter2D(sigma) {
  const temp = Math.sqrt(Math.log(1000) * 2 * sigma * sigma);
  const x = Math.floor(temp);

  const size = 2 * x + 1;
  const filter = new Array(size);
  const coefficient = 1 / (2 * Math.PI * sigma * sigma);

  let sum = 0;
  for (let i = 0; i <= x; i++) {
    filter[x + i] = coefficient * Math.exp(-1 * Math.pow(i / sigma, 2));

    if (i !== 0) {
      filter[x - i] = filter[x + i];
    }

    const idx = 2 * i + 1;
    const inner = Math.max(idx - 2, 0);
    sum += (idx ** 2 - inner ** 2) * filter[x + i];
  }

  for (let i = 0; i < 2 * x + 1; i++) {
    filter[i] /= sum;
  }

  return generate(size, size, (i, j) => {
    if (i === j || i + j === size - 1) {
      return filter[i];
    };
    if (j > i) {
      if (i + j < size) {
        return filter[i];
      };
      return filter[j];
    }
    if (i + j < size) {
      return filter[j];
    };
    return filter[i];
  });
}

function distance(x, y, cx, cy) {
  return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
}
