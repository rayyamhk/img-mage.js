const Image = require('../../Image');
const isValidChannels = require('../../utils/isValidChannels');

function map(cb, ...channels) {
  channels = isValidChannels(channels, this.channels.length);

  const w = this.width;
  const h = this.height;
  const newChannels = [];

  for (let k = 0; k < this.channels.length; k++) {
    if (channels.includes(k)) {
      const channel = this.channels[k];

      const newChannel = [];
      for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
          row.push(cb(channel[i][j], i, j, k, channel));
        }
        newChannel.push(row);
      }
      newChannels.push(newChannel);

    } else {
      newChannels.push(this.channels[k]);
    }
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = map;
