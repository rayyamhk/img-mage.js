const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').crop(200, 0, 123, 280).save('crop.jpg');
