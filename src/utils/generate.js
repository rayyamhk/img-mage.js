function generate(w, h, cb) {
  const channel = [];
  for (let i = 0; i < h; i++) {
    const row = [];
    for (let j = 0; j < w; j++) {
      row.push(cb(i, j));
    }
    channel.push(row);
  }
  return channel;
}

module.exports = generate;
