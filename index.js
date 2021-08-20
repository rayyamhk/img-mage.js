const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').powerLawTransform(0.01).save('crop.jpg');
