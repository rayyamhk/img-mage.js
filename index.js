const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').pad(10, 100).save('crop.jpg');
