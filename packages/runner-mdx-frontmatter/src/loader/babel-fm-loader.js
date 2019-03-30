const transform = require('./transform')

module.exports = async function(src) {
  const callback = this.async()
  try {
    const result = await transform(src)
    return callback(null, result)
  } catch (ex) {
    return callback(ex)
  }
}
