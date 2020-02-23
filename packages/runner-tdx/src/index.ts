import { Tdx } from '@berun/fluent-tdx'
import Berun from '@berun/berun'

export default (berun: Berun, options = {}) => {
  if (!('webpack' in berun) && !('fusebox' in berun)) {
    throw new Error(
      'MD, MDX, TDX files only supported by webpack or fuse-box runners currently'
    )
  }

  berun
    .use(Tdx)
    .tdx.plugin(require('remark-emoji'))
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
      berun.use(require('./webpack-preset').default, options)
    )
    .when('fusebox' in berun, berun =>
      berun.use(require('./fuse-box-preset').default, options)
    )
}