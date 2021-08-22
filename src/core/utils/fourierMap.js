const Image = require('../../Image');
const isValidChannels = require('../../utils/isValidChannels');

function map(cb, ...channels) {
  channels = isValidChannels(channels, this.channels.length);

  const newChannels = [];

  for (let k = 0; k < this.channels.length; k++) {
    if (channels.includes(k)) {
      const re = this.fourierChannels[2 * k];
      const im = this.fourierChannels[2 * k + 1];

      if (re === null || im === null) {
        continue;
      }

      const newChannel = cb(channel, k);

      newChannels.push(newChannel);
    } else {
      newChannels.push(this.channels[k]);
    }
  }

  return new Image()._fromChannels(newChannels, width, height, this);
}

module.exports = map;
