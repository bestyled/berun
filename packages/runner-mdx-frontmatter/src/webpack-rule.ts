import Berun from '@berun/berun'

// FIX-DEPENDENCIES
require.resolve('babel-loader')
require.resolve('@mdx-js/loader')
require.resolve('./loader/babel-fm-loader')

/**
 * MDX Loader
 */
export const ruleMainDocs = (berun: Berun, _) => {
  const main = berun.webpack.module.rule('main')

  if (!main.oneOfs.has('markdown')) {
    throw new Error('Missing webpack mdx configuration')
  }

  main
    .oneOf('markdown')
    .clear()
    .test(/(\.(?:md|mdx))$/)
    .include.clear()
    .merge([berun.options.paths.appPath])
    .end()
    .exclude.clear()
    .add(/node_modules/)
    .end()
    .use('babel')
    .loader(require.resolve('babel-loader'))
    .options({
      /* placeholder */
    })
    .end()
    .use('mdx')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      renderer: `
import * as React from 'react'
import { mdx } from '@mdx-js/react'
import { useSiteData as useEnv } from '@bestatic/components'
`
    })
    .end()
    .use('frontmatter')
    .loader(require.resolve('./loader/babel-fm-loader'))
    .end()
}

export default ruleMainDocs
