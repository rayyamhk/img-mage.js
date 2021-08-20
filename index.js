const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').negative().save('crop.jpg');
