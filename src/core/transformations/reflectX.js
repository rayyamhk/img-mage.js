const Image = require('../../Image');
const generate = require('../../utils/generate');

function reflectX() {
  const h = this.height;
  const w = this.width;

  const newChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];
    newChannels.push(generate(w, h, (i, j) => channel[h - 1 - i][j]));
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = reflectX;
