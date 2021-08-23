const Image = require('../../Image');
const isValidChannels = require('../../utils/isValidChannels');
const { invalid_point, invalid_array } = require('../../Errors');

function plot(points, ...channels) {
  if (!points || !Array.isArray(points)) {
    throw invalid_array(points);
  }

  for (let k = 0; k < points.length; k++) {
    if (!Array.isArray(points[k]) || points[k].length !== 2) {
      throw invalid_point(point);
    }
  }

  channels = isValidChannels(channels, this.channels.length);

  const pixel = getRandomPixel(this.channels.length, 2 ** this.bitDepth - 1);
  const w = this.width;
  const h = this.height;

  const newChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    let channel = this.channels[k];
    if (channels.includes(k)) {
      channel = clone(channel);
      points.forEach((p) => {
        drawCross(channel, pixel[k], p, w, h);
      });
    }
    newChannels.push(channel);
  }

  return new Image()._fromChannels(newChannels, w, h, this);
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

  for (let i = -4; i <= 4; i++) {
    for (let j = -4; j <= 4; j++) {
      if (x - i >= 0 && x - i < height && y - j >= 0 && y - j < width) {
        channel[x - i][y - j] = intensity;
      }
    }
  }
}

function clone(channel) {
  const cloned = [];
  channel.forEach((row) => {
    cloned.push([...row]);
  });
  return cloned;
}

module.exports = plot;
