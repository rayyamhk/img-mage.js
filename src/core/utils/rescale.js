const Image = require('../../Image');
const generate = require('../../utils/generate');
const isValidChannels = require('../../utils/isValidChannels');

function rescale(...channels) {
  channels = isValidChannels(channels, this.channels.length);

  const h = this.height;
  const w = this.width;
  const maxIntensity = 2 ** this.bitDepth - 1;

  const newChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    if (channels.includes(k)) {
      const channel = this.channels[k];

      let max = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          max = Math.max(max, channel[i][j]);
        }
      }

      if (max === 0) {
        newChannels.push(channel);
        continue;
      }

      const rescale = maxIntensity / max;
      newChannels.push(generate(w, h, (i, j) => channel[i][j] * rescale));
    }
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = rescale;
