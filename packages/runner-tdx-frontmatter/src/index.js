'use strict'

module.exports = (berun, options = {}) => {
  if (!('webpack' in berun) && !('fusebox' in berun))
    throw new Error(
      'TDX FrontMatter files only supported by webpack or fuse-box runners currently'
    )

  berun
    .when('webpack' in berun, berun =>
      berun.use(require('./webpack-preset'), options)
    )
    .when('fusebox' in berun, berun =>
      berun.use(require('./fuse-box-preset'), options)
    )
}

module.exports.presetTdxFrontMatter = module.exports
