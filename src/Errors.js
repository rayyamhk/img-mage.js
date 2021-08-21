module.exports = {
  invalid_image_path: (path) => new Error(`${path} is not a valid image.`),
  unknown_image: (path) => new Error(`${path} is an unknown image type.`),
  invalid_png: (path) => new TypeError(`${path} is not a valid PNG.`),
  invalid_byte: (byte) => new RangeError(`${byte} is not a valid byte, unsigned byte is expected.`),
  invalid_rotation: (rotation) => new RangeError(`${rotation} is not a valid rotation. -3, -2, -1, 1, 2, 3 are expected.`),
  invalid_index: (index) => new RangeError(`${index} is not a valid position, expected a non-negative integer less than image dimension.`),
  invalid_channels: (channels) => new Error(`${channels} is not a valid channel, expected at most 4 channels, ranging from 0 - 3. If no channel is specified, applies to all.`),
  invalid_dimensions: (received, expected) => new RangeError(`Expect dimension ${expected} but ${received} is receievd.`),
  expect_nonnegative: (number) => new RangeError(`${number} is not a non-negative integer.`),
  expect_positive: (number) => new RangeError(`${number} is not a positive number.`),

  INVALID_IMAGE: new Error('Unable to save empty image'),
}