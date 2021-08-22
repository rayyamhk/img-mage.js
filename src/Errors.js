module.exports = {
  invalid_image_path: (path) => new Error(`${path} is not a valid image.`),
  unknown_image: (path) => new Error(`${path} is an unknown image type.`),
  invalid_rotation: (rotation) => new RangeError(`${rotation} is not a valid rotation. -3, -2, -1, 1, 2, 3 are expected.`),
  overflow: (index, max) => new RangeError(`${index} overflow, expected not larger than ${max}.`),
  invalid_channels: (channels) => new Error(`${channels} is not a valid channel, expected at most 4 channels, ranging from 0 - 3. If no channel is specified, applies to all.`),
  expect_nonnegative: (number) => new RangeError(`${number} is not a non-negative integer.`),
  expect_positive: (number) => new RangeError(`${number} is not a positive number.`),
  invalid_kernel_size: (row, col) => new RangeError(`${row + col ? ' and ' + col : ''} is not a valid kenerl size, expected a positive odd number dimension smaller than the shorter side of the image.`),
  invalid_kernel: (arg) => new TypeError(`Expect instance of Matrix but received ${arg}.`),
  invalid_argument: (argName, expected, received) => new TypeError(`Invalid argument ${argName}. Expected ${expected} but ${received} is received.`),
  size_incompatible: (rw, rh, ew, eh) => new RangeError(`Received incompatible size, received ${rw} ${rh} but ${ew} ${eh} are expected.`),
  invalid_coordinate: (point) => new TypeError(`Expect an array with size 2, but received ${point}.`),
  invalid_pixel: (pixel) => new TypeError(`Expect an array with the same size as the image channel, but received ${pixel}.`),

  INVALID_ARRAY: new TypeError('Expect an array.'),
  INVALID_IMAGE: new TypeError('Received Invalid Image'),
  INVALID_RGB: new TypeError('Expect RGB image.'),
}
