import { Mdx } from '@berun/fluent-mdx'
import Berun from '@berun/berun'

export default (berun: Berun, options = {}) => {
  if (!('webpack' in berun)) {
    throw new Error('MD, MDX files only supported by webpack runners currently')
  }

  berun
    .use(Mdx)
    .mdx.remark(require('./mdx-squash-single-para-wrapper'))
    .end()
    .remark(require('remark-emoji'))
    .end()
    .remark(require('remark-images'))
    .end()
    .remark(require('remark-autolink-headings'))
    .end()
    .remark(require('remark-slug'))
    .end()
    .remark(require('remark-unwrap-images'))
    .end()
    .rehype(require('@mapbox/rehype-prism'))
    .end()

  berun.when('webpack' in berun, (berun) =>
    berun.use(require('./webpack-preset').default, options)
  )
}
