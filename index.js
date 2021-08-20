const Image = require('./src/index');

const img = new Image();
img.fromSource('test.jpg').rotate(1).save('result1.jpg');
img.fromSource('test.jpg').rotate(2).save('result2.jpg');
img.fromSource('test.jpg').rotate(3).save('result3.jpg');
img.fromSource('test.jpg').rotate(-1).save('result-1.jpg');
img.fromSource('test.jpg').rotate(-2).save('result-2.jpg');
img.fromSource('test.jpg').rotate(-3).save('result-3.jpg');
