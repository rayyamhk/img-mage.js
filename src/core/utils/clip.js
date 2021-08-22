const Image = require('../../Image');
const generate = require('../../utils/generate');

function clip() {
  const maxIntensity = 2 ** this.bitDepth - 1;
  const w = this.width;
  const h = this.height;

  const clippedChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];

    clippedChannels.push(generate(w, h, (i, j) => {
      if (channel[i][j] < 0) {
        return 0;
      } else if (channel[i][j] > maxIntensity) {
        return maxIntensity;
      } else {
        return channel[i][j];
      }
    }));
  }

  return new Image()._fromChannels(clippedChannels, w, h, this);
}

module.exports = clip;
