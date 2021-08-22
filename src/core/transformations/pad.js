const Image = require('../../Image');
const generate = require('../../utils/generate');
const { expect_nonnegative } = require('../../Errors');

function pad(sizeX, sizeY) {
  if ((!sizeX && sizeX !== 0) || typeof sizeX !== 'number' || !Number.isInteger(sizeX) || sizeX < 0) {
    throw expect_nonnegative(sizeX);
  }

  if (sizeY && (typeof sizeY !== 'number' || !Number.isInteger(sizeY) || sizeY < 0)) {
    throw expect_nonnegative(sizeY);
  }

  if (!sizeY) {
    sizeY = sizeX;
  }

  const w = this.width + 2 * sizeY;
  const h = this.height + 2 * sizeX;

  const newChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];
    newChannels.push(generate(w, h, (i, j) => {
      if (i >= sizeX && i < height - sizeX && j >= sizeY && j < width - sizeY) {
        return channel[i - sizeX][j - sizeY];
      }
      return 0;
    }));
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = pad;
