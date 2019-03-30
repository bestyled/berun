'use strict'

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  if ('webpack' in berun) berun.use(require('./preset_webpack'), options)
}

module.exports.presetTSMain = module.exports
