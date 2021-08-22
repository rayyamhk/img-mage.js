const Image = require('../../Image');
const generate = require('../../utils/generate');
const { expect_nonnegative, overflow } = require('../../Errors');

function crop(x, y, w, h) {
  const width = this.width;
  const height = this.height;

  if (typeof x !== 'number' || !Number.isInteger(x) || x < 0) {
    throw expect_nonnegative(x);
  }

  if (x > height) {
    overflow(x, height);
  }

  if (typeof y !== 'number' || !Number.isInteger(y) || y < 0) {
    throw expect_nonnegative(y);
  }
  
  if (y > width) {
    overflow(y, width);
  }

  if (typeof w !== 'number' || !Number.isInteger(w) || w < 0) {
    throw expect_nonnegative(w);
  }
  
  if (typeof h !== 'number' || !Number.isInteger(h) || h < 0) {
    throw expect_nonnegative(h);
  }

  w = Math.min(w, width - y);
  h = Math.min(h, height - x);

  const newChannels = [];
  for (let k = 0; k < this.channels.length; k++) {
    const channel = this.channels[k];
    newChannels.push(generate(w, h, (i, j) => channel[x+i][y+j]))
  }

  return new Image()._fromChannels(newChannels, w, h, this);
}

module.exports = crop;
