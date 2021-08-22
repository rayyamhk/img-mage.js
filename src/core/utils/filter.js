const Matrix = require('@rayyamhk/matrix');
const Complex = require('@rayyamhk/complex');
const constant = require('../constant');

function filter(type, ...options) {
  switch(type) {
    case constant.BOX_FILTER: {
      const size = options[0] || 3;
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
      return gaussianFilter1D(sigma);
    }
    case constant.GAUSSIAN_2D: {
      const sigma = options[0] || 0.5;
      return gaussianFilter2D(sigma);
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

  return Matrix.generate(size, size, (i, j) => {
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
  })._matrix;
}

function distance(x, y, cx, cy) {
  return Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
}
