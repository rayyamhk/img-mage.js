const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').pad(0,0).save('result.jpg');
