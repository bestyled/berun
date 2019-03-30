'use strict'

const { Mdx } = require('@berun/fluent-mdx')

module.exports = (berun, options = {}) => {
  if (!('webpack' in berun) && !('fusebox' in berun))
    throw new Error(
      'MD, MDX files only supported by webpack or fuse-box runners currently'
    )

  berun
    .use(Mdx)
    .mdx.plugin(require('remark-emoji'))
    .end()
    .plugin(require('remark-images'))
    .end()
    .plugin(require('remark-autolink-headings'))
    .end()
    .plugin(require('remark-slug'))
    .end()
    .plugin(require('remark-unwrap-images'))
    .end()
    .hast(require('@mapbox/rehype-prism'))
    .end()

  berun
    .when('webpack' in berun, berun =>
      berun.use(require('./webpack-preset'), options)
    )
    .when('fusebox' in berun, berun =>
      berun.use(require('./fuse-box-preset'), options)
    )
}

module.exports.presetMdx = module.exports
