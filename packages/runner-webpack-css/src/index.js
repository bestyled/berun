'use strict'

const { presetReactCss } = require('./preset')

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)
  berun.use(presetReactCss, options)
}

module.exports.presetReactCss = module.exports
