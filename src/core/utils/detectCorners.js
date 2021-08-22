const Image = require('../../Image');
const { expect_positive } = require('../../Errors');

function detectCorners(sigma, threshold) {
  if (!sigma || typeof sigma !== 'number' || sigma <= 0) {
    throw expect_positive(sigma);
  }

  if (!threshold || typeof threshold !== 'number' || threshold <= 0) {
    throw expect_positive(threshold);
  }

  const YIQ = this.RGBtoYIQ();
  const channel = YIQ.channels[0]; // Y channel

  const cornersOut = [];
  const w = this.width;
  const h = this.height;

  const ResponseImage = cornerResponseImage(channel._matrix, sigma)
  for (let u = 1; u < h - 1; u++) {
    for (let v = 1; v < w - 1; v++) {
      if (isLocalMax(ResponseImage, u, v, w, h)) {
        const R = ResponseImage[u * w + v];
        if (R > threshold) {
          // y-axis
          let x0 = v - 1;
          let y0 = ResponseImage[u * w + x0];
          let x1 = v;
          let y1 = ResponseImage[u * w + x1];
          let x2 = v + 1;
          let y2 = ResponseImage[u * w + x2];
          const y_local_max = quadraticInterpolation(x0, y0, x1, y1, x2, y2) + 0.5;

          // x-axis
          x0 = u - 1;
          y0 = ResponseImage[x0 * w + v];
          x1 = u;
          y1 = ResponseImage[x1 * w + v];
          x2 = u + 1;
          y2 = ResponseImage[x2 * w + v];
          const x_local_max = quadraticInterpolation(x0, y0, x1, y1, x2, y2) + 0.5;

          cornersOut.push([x_local_max, y_local_max]);
        }
      }
    }
  }

  return cornersOut;
}

function cornerResponseImage(i, sigma) {
  const w = i[0].length;
  const h = i.length;
  const ResponseImage = new Array(h * w);

  const fx = new Array(h * w);
  const fy = new Array(h * w);
  for (let x = 0; x < h; x++) {
    for (let y = 0; y < w; y++) {
      fx[x * w + y] = 0;
      fy[x * w + y] = 0;

      if (x != 0 && x != h - 1) {
        const up = i[x-1][y];
        const down = i[x+1][y];
        fx[x * w + y] = down - up;
      }

      if (y != 0 && y != w - 1) {
        const left = i[x][y - 1];
        const right = i[x][y + 1];
        fy[x * w + y] = right - left;
      }
    }
  }

  const fxfx = new Array(h * w);
  const fyfy = new Array(h * w);
  const fxfy = new Array(h * w);
  for (let x = 0; x < h; x++) {
    for (let y = 0; y < w; y++) {
      fxfx[x * w + y] = 0;
      fyfy[x * w + y] = 0;
      fxfy[x * w + y] = 0;

      const dx = fx[x * w + y];
      const dy = fy[x * w + y];
      fxfx[x * w + y] = dx * dx;
      fxfy[x * w + y] = dx * dy;
      fyfy[x * w + y] = dy * dy;
    }
  }

  const filter = Image.filter(Image.CONSTANT.GAUSSIAN_1D, sigma).flatten();

  const smooth_fxfx = applyGaussianFilter(filter, fxfx, w, h);
  const smooth_fyfy = applyGaussianFilter(filter, fyfy, w, h);
  const smooth_fxfy = applyGaussianFilter(filter, fxfy, w, h);

  const KAPPA = 0.04;
  for (let x = 0; x < h; x++) {
    for (let y = 0; y < w; y++) {
      const A_1 = smooth_fxfx[x * w + y];
      const A_2 = smooth_fxfy[x * w + y];
      const A_3 = smooth_fxfy[x * w + y];
      const A_4 = smooth_fyfy[x * w + y];
      const det = A_1 * A_4 - A_2 * A_3;
      const trace = A_1 + A_4;
      ResponseImage[x * w + y] = det - KAPPA * trace * trace;
    }
  }

  return ResponseImage;
}

function applyGaussianFilter(filter, img, w, h) {
  const s = (filter.length - 1) / 2;
  const temp_w = w - 2 * s;
  const temp_image = new Array(temp_w * h);
  const filtered_image = new Array(w * h);

  for (let u = 0; u < h; u++) {
    for (let v = s; v < w - s; v++) {
      let f = 0.0;
      for (let y = -s; y <= s; y++) {
        f += filter[y + s] * img[u * w + v - y];
      }
      temp_image[u * temp_w + v - s] = f;
    }
  }

  for (let v = 0; v < w; v++) {
    for (let u = 0; u < h; u++) {
      if (u >= s && u < h - s && v >= s && v < w - s) {
        let f = 0.0;
        for (let x = -s; x <= s; x++) {
          f += filter[x + s] * temp_image[(u - x) * temp_w + v - s];
        }
        filtered_image[u * w + v] = f;
      } else {
        filtered_image[u * w + v] = img[u * w + v];
      }
    }
  }

  return filtered_image;
}

function quadraticInterpolation(x0, y0, x1, y1, x2, y2) {
  // y = b0 + b1(x - x0) + b2(x - x0)(x - x1)
  // const b0 = y0;
  const b1 = (y1 - y0) / (x1 - x0);
  const b2 = ((y2 - y1) / (x2 - x1) - (y1 - y0) / (x1 - x0)) / (x2 - x0);

  // y = ax^2 + bx + c
  const a = b2;
  const b = b1 - b2 * x0 - b2 * x1;
  // const c = b0 - b1 * x0 + b2 * x0 * x1;

  return -b / (2 * a);
}

function isLocalMax(responseImage, x, y, w, h) {
  // given that x and y are not boundary
  const c = responseImage[x * w + y]; // center pixel
  const tl = responseImage[(x- 1) * w + y - 1];
  const t = responseImage[(x- 1) * w + y];
  const tr = responseImage[(x - 1) * w + y + 1];
  const r = responseImage[x * w + y + 1];
  const br = responseImage[(x + 1) * w + y + 1];
  const b = responseImage[(x + 1) * w + y];
  const bl = responseImage[(x + 1) * w + y - 1];
  const l =  responseImage[x * w + y - 1];
  return c > tl && c > t && c > tr && c > r && c > br && c > b && c > bl && c > l; 
}

module.exports = detectCorners;
