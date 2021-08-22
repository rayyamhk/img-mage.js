const Matrix = require('@rayyamhk/matrix');
const { invalid_coordinate, invalid_pixel, INVALID_ARRAY } = require('../../Errors');

function plot(points, pixel, ...channels) {
  if (!points || !Array.isArray(points)) {
    throw INVALID_ARRAY;
  }

  if (!pixel) {
    pixel = getRandomPixel(this.channels.length, 2 ** this.bitDepth - 1);
  } else if (!Array.isArray(pixel) || pixel.length !== this.channels.length) {
    throw invalid_pixel(pixel);
  }

  for (let i = 0; i < points.length; i++) {
    if (!Array.isArray(points[i]) || points[i].length !== 2) {
      throw invalid_coordinate(point);
    }
  }

  const w = this.width;
  const h = this.height;

  const cb = (channel, i) => {
    const intensity = pixel[i];
    channel = Matrix.clone(channel);

    points.forEach((point) => {
      drawCross(channel, intensity, point, w, h);
    });

    return channel;
  }

  return this.map(cb, ...channels);
}

function getRandomPixel(channelsNum, maxIntensity) {
  const pixel = [];
  for (let i = 0; i < channelsNum; i++) {
    const intensity = Math.floor(Math.random() * (maxIntensity + 1));
    pixel.push(intensity);
  }
  return pixel;
}

function drawCross(channel, intensity, point, width, height) {
  let [x, y] = point;
  x = Math.round(x);
  y = Math.round(y);

  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (x - i >= 0 && x - i < height && y - j >= 0 && y - j < width) {
        channel._matrix[x - i][y - j] = intensity;
      }
    }
  }
}

module.exports = plot;
