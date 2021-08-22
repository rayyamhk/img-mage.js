const { invalid_channels } = require('../Errors');

function isValidChannels(channels, channelsLength) {
  if (channels.length > 4) {
    throw invalid_channels(channels);
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
