const Image = require('../../Image');
const generate = require('../../utils/generate');

function fourierPhase() {
  const w = this.width;
  const h = this.height;
  const spatialChannels = [];

  for (let i = 0; i < this.channels.length; i++) {
    const fourierChannel = this.fourierChannels[i];

    if (fourierChannel === null) {
      const zeros = new Array(h).fill(new Array(w).fill(0));
      spatialChannels.push(zeros);
      continue;
    }

    spatialChannels.push(generate(w, h, (i, j) => fourierChannel[i][j].getArgument()));
  }

  return new Image()._fromChannels(spatialChannels, w, h, this);
}

module.exports = fourierPhase;
