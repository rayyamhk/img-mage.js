const { invalid_channel_size, invalid_channel_index } = require('../Errors');

function isValidChannels(channels, channelsLength) {
  if (channels.length > 4) {
    throw invalid_channel_size(channels.length);
  }

  for (let k = 0; k < channels.length; k++) {
    if (![0, 1, 2, 3].includes(channels[k])) {
      throw invalid_channel_index(channels[k]);
    }
  }

  if (channels.length === 0) {
    if (channelsLength === 4 && this.ignoreAlpha) {
      channelsLength = 3;
    }
    channels = [...new Array(channelsLength).keys()];
  }

  return channels;
}

module.exports = isValidChannels;
