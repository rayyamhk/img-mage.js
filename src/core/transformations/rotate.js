const Image = require('../../Image');
const generate = require('../../utils/generate');
const { invalid_rotation } = require('../../Errors');

function rotate(rotation) {
  if (![-3, -2, -1, 1, 2, 3].includes(rotation)) {
    throw invalid_rotation(rotation);
  }

  const w = this.width;
  const h = this.height;
  const newChannels = [];

  // clockwise 90
  if (rotation === -3 || rotation === 1) {
    for (let k = 0; k < this.channels.length; k++) {
      const channel = this.channels[k];
      newChannels.push(generate(h, w, (i, j) => channel[h - 1 - j][i]));
    }
    return new Image()._fromChannels(newChannels, h, w, this);
  }

  // clockwise 180
  if (rotation === 2 || rotation === -2) {
    for (let k = 0; k < this.channels.length; k++) {
      const channel = this.channels[k];
      newChannels.push(generate(w, h, (i, j) => channel[h - 1 - i][w - 1 - j]));
    }
    return new Image()._fromChannels(newChannels, w, h, this);
  }

  // clockwise 270
  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];
    newChannels.push(generate(h, w, (i, j) => channel[j][w - 1- i]));
  }
  return new Image()._fromChannels(newChannels, h, w, this);
}

module.exports = rotate;
