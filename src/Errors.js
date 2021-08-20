module.exports = {
  invalid_image_path: (path) => new Error(`${path} is not a valid image.`),
  invalid_png: (path) => new TypeError(`${path} is not a valid PNG.`),
  invalid_byte: (byte) => new RangeError(`${byte} is not a valid byte, unsigned byte is expected.`),
  invalid_rotation: (rotation) => new RangeError(`${rotation} is not a valid rotation. -3, -2, -1, 1, 2, 3 are expected`),

  INVALID_IMAGE: new Error('Unable to save empty image'),
}