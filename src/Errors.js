module.exports = {
  invalid_image_path: (path) => new Error(`${path} is not a valid image.`),
  invalid_png: (path) => new TypeError(`${path} is not a valid PNG.`),
  invalid_byte: (byte) => new RangeError(`${byte} is not a valid byte, unsigned byte is expected.`),
  invalid_rotation: (rotation) => new RangeError(`${rotation} is not a valid rotation. -3, -2, -1, 1, 2, 3 are expected.`),
  invalid_index: (index) => new RangeError(`${index} is not a valid position, expected a non-negative integer less than image dimension.`),
  expect_nonnegative: (number) => new RangeError(`${number} is not a non-negative integer.`),
  expect_positive: (number) => new RangeError(`${number} is not a positive number`),

  OVERFLOW_WIDTH: new RangeError('Width overflow'),
  OVERFLOW_HEIGHT: new RangeError('Height overflow'),
  INVALID_IMAGE: new Error('Unable to save empty image'),
}