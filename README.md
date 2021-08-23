![Img-mage](https://i.imgur.com/oJ4217P.jpeg)

## Install
```
npm install --save img-mage
```

## Features
- Chained operations
- Support **frequency domain** processing
- Provide built-in complex number library [Complex.js](https://github.com/rayyamhk/Complex.js) for you to manipulate complex numbers in frequency domain
- Provide highly flexible *map* function for **pixel-wise** manipulation
- Support **channel-wise** operations to reduce execution time
- Support node.js and browser environments
- Currently only support **jpeg** format!! (Contribution is welcome)
![Demo](https://i.imgur.com/yoD92k3.png)

## Table of content
- [Image](#image)
- [map](#mapcb-channels)
- [fourier & inverse fourier](#fourierchannels)
- [fourierMap](#fouriermapcb-channels)
- [fourierSpectrum & fourierPhase](#fourierspectrum)
- [filter](#filtertype-options)
- [convolve1D & convolve2D](#convolve1dfilter-direction-channels)
- [detectCorners](#detectcornerssigma-threshold)
- [crop](#cropx-y-w-h)
- [rotate](#rotaterotation)
- [pad](#padx-y)
- [reflectX & reflectY](#reflectxchannels)
- [negative](#negativechannels)
- [logTransform](#logtransformchannels)
- [powerLawTransform](#powerlawtransformgamma-channels)
- [clip](#clipchannels)
- [rescale](#rescalechannels)
- [blur](#blursigma-channels)
- [sharpen](#sharpensigma-channels)
- [abs](#abschannels)
- [add](#addimage-channels)
- [subtract](#subtractimage-channels)
- [multiply](#multiplyimage-channels)
- [RGBtoYIQ & YIQtoRGB](#rgbtoyiq)

## How to use

### Example 1: Chained operations
```javascript
const { Image } = require('img-mage');

const { GAUSSIAN_1D, LAPLACIAN_90 } = Image.CONSTANT;
const Gaussian1D = Image.filter(GAUSSIAN_1D, 2);  // sigma=2
const Laplacian90 = Image.filter(LAPLACIAN_90);
const img = new Image().load('example.jpg');

img
.convolve1D(Gaussian1D, 'x')  // apply 1D Gaussian filter along x-direction
.convolve1D(Gaussian1D, 'y')  // apply 1D Gaussian filter along y-direction
.convolve2D(Laplacian90)  // apply Laplacian filter
.add(img)  // add back the original image
.clip()  // clip overflow pixels
.save('sharpen.jpg');
```

### Example 2: Harris corner detection algorithm
```javascript
const corners = img.detectCorners(2, 1000000);  // sigma=2, threshold=1000000
img
.plot(corners)
.save('corners.jpg');
```

### Example 3: Channel-wise Map
We introduce a robust method called `map`, which enables pixel-wise manipulation. This method is designed for channel-wise processing, i.e. you can specify the index of the channels that you want to process to reduce execution time.
```javascript
const height = img.getDimensions()[1];
/**
 * Channel is an 2D array,
 * The callback maps each pixel to a new pixel.
 */
const cb = (pixel, i, j, k, channel) => channel[height - 1 - i][j];

img.map(cb); // reflect the image along x-direction
img.map(cb, 0); // only reflect the red channel
img.map(cb, 0, 2); // only reflect the red and blue channels

// Equivalent operations
img.reflectX();
img.reflectX(0);
img.reflectX(0, 2);
```

### Example 4: Frequency domain manipulation
```javascript
const GLPF = Image.filter(Image.CONSTANT.GLPF);
img
.fourier() // fast fourier transform
.fourierMap(GLPF) // apply Gaussian low-pass filter
.inverseFourier()  // fast inverse fourier transform
.clip()  // clip overflow pixels
.save('blur.jpg');
```

### Example 5: Custom filters
It is extremely easy to implement a custom filter. If the filter is linear, you can implement it as an 2D array. If the filter is non-linear, e.g. Median filter, you can implement it as a map callback. If the filter is for frequency domain, implement it as a fourierMap callback [Example](#example-ideal-low-pass-filter).
```javascript
const derivativeFilter2D = [
  [1, 0, -1],
  [2, 0, -2],
  [1, 0, -1],
];
img.convolve2D(derivativeFilter);

const derivativeFilter1D = [1, 0, -1];
img.convolve1D(derivativeFilter1D, 'x');

// 3x3 max filter
const maxFilter = (pixel, i, j, k, channel) => {
  const h = channel.length;
  const w = channel[0].length;

  let max = Number.NEGATIVE_INFINITY;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const posX = i - x;
      const posY = j - y;
      if (posX < 0 || posX >= h || posY < 0 || posY >= w) {
        continue;
      }
      max = Math.max(max, channel[posX][posY]);
    }
  }
  return max;
}
img.map(maxFilter);

// 
```

## API

### Image
```javascript
const { Image } = require('img-mage');

const img = new Image().load('rgb.jpg');
const [width, height, depth] = img.getDimensions();
const bitDepth = img.getBitDepth();
const R = img.getChannel(0);
const [r, g, b] = img.getPixel(10, 10);
img.save('rgb2.jpg');
```

### map(cb, ...channels)
Map is a robust method, it provides you a flexible way to implement most of the spatial transformations. Map applies the callback to each pixel and produce a new pixel. You can specify the channels you want to apply the map function to reduce execution time. The callback takes current pixel, pixel coordinates (i, j, k), and current channel as input.

#### Example 1. Invert an image
```javascript
const maxIntensity = 2 ** img.getBitDepth() - 1;

const cb = (pixel) => maxIntensity - pixel;

img.map(cb); // invert whole image
img.map(cb, 0); // only invert the R channel
img.map(cb, 1, 2); // only invert the G and B channels
```

#### Example 2: Add an image
```javascript
const img2 = new Image().load('img2.jpg'); // assume same size

const cb = (pixel, i, j, k) => pixel + img2.getChannel(k)[i][j];

img.map(cb); // add img2 to img
img.map(cb, 0); // add R channel of img2 to R channel of img
img.map(cb, 1, 2); // add G and B channels of img2 to G and B channels of img
```

#### Example 3: Reflect an image
```javascript
const height = img.getDimensions()[1];
const cb = (pixel, i, j, k, channel) => channel[height - 1 - i][j];

img.map(cb); // reflect the image along x-direction
img.map(cb, 0); // only reflect the red channel
img.map(cb, 0, 2); // only reflect the red and blue channels
```

### fourier(...channels)
### inverseFourier()
Apply **fast fourier transform** to the channels of an image and convert it to frequency domain. Apply **fast inverse fourier transform** to **all** the fourier channels of an image and convert back to the spatial domain. Note that the fourier transformation is centered.
```javascript
img
.fourier()
.inverseFourier()
.clip() // Suggest to clip the pixels to ignore the floating point errors
```

### fourierMap(cb, ...channels)
Similar to map in spatial domain, fourierMap is the map in frequency domain. The only different is that the callback takes centerX and centerY as additional arguments, which are the center coordinate of the transformation. **Note that all pixels in frequency domain are complex number. We provide a library [Complex.js](https://github.com/rayyamhk/Complex.js) for you to manipulate complex numbers**

#### Example: Ideal Low-Pass Filter
```javascript
const { Complex } = require('img-mage');

const cb = (pixel, i, j, k, centerX, centerY, channel) => {
  const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
  if (distance <= 100) { // cut-off frequency
    return pixel;
  }
  return new Complex(0); // 0 in complex number
}
// apply ILPF to all channels
img
.fourier()
.fourierMap(cb)
.inverseFourier()
.clip()
.save('blur.jpg');
```

### fourierSpectrum()
### fourierPhase()
Get the fourier spectrum (or fourier phase) of an image.
![Fourier Spectrum](https://i.imgur.com/JKroqzB.png)
```javascript
img
.fourier()
.fourierSpectrum()
.rescale()
.logTransform()
.save('fourier-spectrum.jpg');
```

### filter(type, ...options)
We provide some common linear, non-linear, and frequency domain filters. Linear filters are in the form of 1D and 2D arrays, non-linear filters are in the form of map callback, frequency domain filters are in the form of fourierMap callback. List of the filters:

| Name  | Argument(s) | Type | Remark |
| ------------ | ------------ | ------------ | ------------ | 
| BOX_FILTER | size | Linear | |
| LAPLACIAN_45 | No | Linear | |
| LAPLACIAN_90 | No | Linear | |
| GAUSSIAN_1D | sigma | Linear| |
| GAUSSIAN_2D | sigma | Linear | |
|MAX_FILTER|size|Non-linear||
|MIN_FILTER|size|Non-linear||
|MEDIAN_FILTER|size|Non-linear||
|ILPF| Cut-off|Frequency domain| Ideal low-pass|
|GLPF| Cut-off|Frequency domain| Gaussian low-pass|
|BLPF| Cut-off, order|Frequency domain| Butterworth low-pass|
|IHPF| Cut-off |Frequency domain| Ideal high-pass|
|GHPF| Cut-off |Frequency domain| Gaussian high-pass filter|
|ILPF| Cut-off |Frequency domain| Ideal low-pass filter|
|BHPF| Cut-off, order |Frequency domain| Butterworth high-pass filter|
```javascript
const { BOX_FILTER, MEDIAN_FILTER, GHPF } = Image.CONSTANT;

const boxFilter = Image.filter(BOX_FILTER);
const medianFilter = Image.filter(MEDIAN_FILTER, 3); // size
const gaussianHighPass = Image.filter(GHPF, 100); // cut-off frequency

img.convolve2D(BOX_FILTER); // linear filter, thus an 2D array
img.map(MEDIAN_FILTER); // non-linear, use map
img.fourier().fourierMap(gaussianHighPass); // frequency domain, use fourierMap
```

### convolve1D(filter, direction, ...channels)
### convolve2D(filter, ...channels)
Apply 1D and 2D convolution to the channels of an image. For 1D convolution, you should specify the direction of the convolution. It allows you to utilize the advantages of separating 2D filters.
```javascript
const gaussian1D = Image.filter(Image.CONSTANT.GAUSSIAN_1D, 2);
const gaussian2D = Image.filter(Image.CONSTANT.GAUSSIAN_2D, 2);
const custom1D = [-1, 0, 1];
const custom2D = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1],
];

img
.convolve1D(gaussian1D, 'x') // x-direction
.convolve1D(gaussian1D, 'y'); // y-direction

img.convolve2D(gaussian2D); // equivalent but slower

img
.convolve1D(custom1D, 'x')
.convolve1D(custom1D, 'y'); // image derivative

img.convolve2D(custom2D);
```

### detectCorners(sigma, threshold)
Apply Harris corner detection algorithm to your image.
```javascript
const checkerboard = new Image().load('checkboard.jpg');

const corners = checkerboard.detectCorners(2, 1000000);
checkerboard.plot(corners);
```
![Checkerboard](https://i.imgur.com/0EVXq4J.jpeg "Checkerboard")
### crop(x, y, w, h)
Crop an image with width w and height h at (x, y)
```javascript
img.crop(0, 0, 200, 200);
img.crop(0, 0, 10000, 10000); // handle overflow for you
```

### rotate(rotation)
Rotate an image by specifying the rotation. 1 and -3 refer to clockwise 90 degrees, 2 and -2 refer to clockwise 180 degrees, 3 and -1 refer to clockwise 270 degrees.
```javascript
img.rotate(1); // clockwise 90 degrees
img.rotate(-3); // equivalent
```

### pad(x, y)
Add zero-padding to an image. The height and width of the resulting image are h + 2x and w + 2y respectively.
```javascript
img.pad(10); // 10px to 4 sides
img.pad(10, 20); // 10px to top and bottom, 20px to left and right
```

### reflectX(...channels)
### reflectY(...channels)
Reflect the channels of an image vertically (x-direction) and horizontally (y-direction).
```javascript
img.reflectX(); // reflect whole image
img.reflectX(0); // only reflect the R channel
img.reflectX(1, 2); // only reflect the G and B channels
```

### negative(...channels)
Invert the channels of an image.
```javascript
img.negative(); // invert whole image
img.negative(2); // only inver the B channel
img.negavie(0, 1); // Only inver the R and G channels
```

### logTransform(...channels)
Apply log transform to the channels of an image. It enlarges pixel intensity.
```javascript
img.logTransform(); // brighter
img.logTransform(0, 1); // more green
```

### powerLawTransform(gamma, ...channels)
Apply power law transform to the channels of an image. gamma > 1 compresses the intensity while gamma < 1 enlarge the intensity.
```javascript
img.powerLawTransform(0.5); // brighter
img.powerLawTransform(2); // darker
img.powerLawTransform(2, 0); // less red
```

### clip(...channels)
Clip the overflow and underflow pixels to max intensity and 0 respectively.
```javascript
img.clip(); // clip all channels
img.clip(0); // only clip the R channel
```

### rescale(...channels)
Rescale the pixels to the range [0, maxIntensity].
```javascript
img.rescale();
img.rescale(1); // only rescale the G channel
```

### blur(sigma, ...channels)
Blur the channels of an image using Gaussian filter. Sigma controls the standard deviation of the distribution, larger sigma produces blurrier image.
```javascript
img.blur(2); // blur the whole image
img.blur(2, 1, 2); // blur the G and B channels
```

### sharpen(sigma, ...channels)
Sharpen the channels of an image using Laplacian filter. Sigma controls the sharp level, smaller sharper.
```javascript
img.sharpen(0.5); // more sharp
img.sharpen(2); // less sharp
```

### abs(...channels)
Calculate the absolute value of each pixel in the channels of an image.

### add(Image, ...channels)
Apply pixel-wise addition to the channels of an image.
```javascript
const Laplacian2D = Image.filter(Image.CONSTANT.LAPLACIAN_90);

img
.convolve2D(Laplacian2D) // get the edges of an image
.add(img) // add back the original image to make it sharper
```

### subtract(Image, ...channels)
Apply pixel-wise subtraction to the channels of an image.
```javascript
const sharpen = new Image().load('sharpen.jpg'); // assume in same dimensions

img
.subtract(sharpen)
.abs() // get the absolute values
.rescale()
.logTransform() // make the difference more obvious
.save('difference.jpg');
```

### multiply(Image, ...channels)
Apply pixel-wise multiplication to the channels of an image.

### RGBtoYIQ()
### YIQtoRGB()
Convert RGB to YIQ and YIQ back to RGB.
```javascript
const YIQ = img.RGBtoYIQ();
YIQ.getChannel(0); // Y channel
YIQ.getChannel(1); // I channel
YIQ.getChannel(2); // Q channel
const RGB = YIQ.YIQtoRGB(); // back to RGB
```

## Future Plans (Contribution is welcome)
- Support more image format (Currently only support jpeg)
- Create a playground website to experience the library
- Add more algorithm, such as scaling
- Optimize implementations

## License
MIT
