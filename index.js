const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').reflectY().save('crop.jpg');
