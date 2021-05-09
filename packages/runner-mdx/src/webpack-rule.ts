import Berun from '@berun/berun'

// FIX-DEPENDENCIES
require.resolve('babel-loader')
require.resolve('@mdx-js/loader')

/**
 * MDX Loader
 */
export const ruleMainDocs = (berun: Berun, _) => {
  const main = berun.webpack.module.rule('main')

  if (main.oneOfs.has('static')) {
    main.oneOf('static').exclude.add(/\.(?:md|mdx)$/)
  }

  main
    .oneOf('markdown')
    .test(/(\.(?:md|mdx))$/)
    .include.merge([berun.options.paths.appPath])
    .end()
    .exclude.add(/node_modules/)
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
import {mdx as mdxSource} from '@mdx-js/react'
import { useSiteData as useEnv } from '@bestatic/components'
`
    })
    .end()
}

export default ruleMainDocs
