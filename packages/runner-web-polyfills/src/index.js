module.exports = function mainEntryPolyfills(berun, options) {
  berun.webpack.entry('main').prepend(require.resolve('./polyfills'))
}

module.exports.mainEntryPolyfills = module.exports

module.exports.src_polyfills = require.resolve('./polyfills')
