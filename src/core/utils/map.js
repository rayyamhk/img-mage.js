const Image = require('../../Image');
const generate = require('../../utils/generate');
const isValidChannels = require('../../utils/isValidChannels');

function map(cb, ...channels) {
  channels = isValidChannels(channels, this.channels.length);

  const w = this.width;
  const h = this.height;
  const newChannels = [];

  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];
    if (channels.includes(k)) {
      newChannels.push(
        generate(w, h, (i, j) => cb(channel[i][j], i, j, k, channel))
      );

    } else {
      newChannels.push(channel);
    }
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = map;
