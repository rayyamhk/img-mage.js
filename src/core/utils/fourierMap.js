const Image = require('../../Image');
const isValidChannels = require('../../utils/isValidChannels');

function fourierMap(cb, ...channels) {
  channels = isValidChannels(channels, this.channels.length);

  const w = this.width;
  const h = this.height;
  const centerX = this.fourierCenterX;
  const centerY = this.fourierCenterY;

  const newFourierChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    const fourierChannel = this.fourierChannels[k];

    if (fourierChannel === null) {
      newFourierChannels.push(null);
      continue;
    }

    if (channels.includes(k)) {
      const channel = [];
      for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
          row.push(cb(fourierChannel[i][j], i, j, k, centerX, centerY, fourierChannel));
        }
        channel.push(row);
      }
      newFourierChannels.push(channel);
    } else {
      newFourierChannels.push(fourierChannel);
    }
  }

  return new Image()._fromFourierChannels(newFourierChannels, centerX, centerY, this.channels, w, h, this);
}

module.exports = fourierMap;
