const Image = require('../../Image');
const generate = require('../../utils/generate');

function reflectY() {
  const w = this.width;
  const h = this.height;

  const newChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];
    newChannels.push(generate(w, h, (i, j) => channel[i][width - 1 - j]));
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = reflectY;
