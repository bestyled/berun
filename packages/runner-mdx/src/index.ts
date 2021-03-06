import { Mdx } from '@berun/fluent-mdx'
import Berun from '@berun/berun'

export default (berun: Berun, options = {}) => {
  if (!('webpack' in berun)) {
    throw new Error(
      'MD, MDX files only supported by webpack runners currently'
    )
  }

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
      berun.use(require('./webpack-preset').default, options)
    )
}
