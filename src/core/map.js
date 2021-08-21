const Image = require('../index');
const { invalid_channels, invalid_dimensions } = require('../Errors');

function map(cb, ...channels) {
  if (channels.length > 4) {
    throw invalid_channels(channels);
  }

  if (channels.length === 0) {
    channels = [...new Array(this.channels.length).keys()];
  }

  // used to check the size compatibility
  let width = null; height = null;

  // some channels are unchanged ==> image dimensions unchanged
  if (channels.length < this.channels.length) {
    width = this.width;
    height = this.height;
  }

  const newChannels = [];

  for (let k = 0; k < this.channels.length; k++) {
    if (channels.includes(k)) {
      const channel = this.channels[k];
      const newChannel = cb(channel);

      // dimensions checking
      const [row, col] = newChannel.size();
      if (!width || !height) {
        width = col;
        height = row;
      } else if (width !== col) {
        invalid_dimensions(col, width);
      } else if (height !== row) {
        invalid_dimensions(row, height);
      }

      newChannels.push(newChannel);
    } else {
      newChannels.push(this.channels[k]);
    }
  }

  return new Image()._fromChannels(newChannels, width, height, this);
}

module.exports = map;
