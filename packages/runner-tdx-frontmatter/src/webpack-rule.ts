import Berun from '@berun/berun'

import 'babel-loader'
import '@tinia/tdx-loader'
import './loader/babel-fm-loader'

/**
 * TDX Loader
 */
export const ruleMainDocs = (berun: Berun, _) => {
  const main = berun.webpack.module.rule('main')

  if (!main.oneOfs.has('markdown')) {
    throw new Error('Missing webpack tdx configuration')
  }

  main
    .oneOf('markdown')
    .clear()
    .test(/(\.(?:md|mdx|tdx))$/)
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
    .use('tdx')
    .loader(require.resolve('@tinia/tdx-loader'))
    .options({
      /* placeholder */
    })
    .end()
    .use('frontmatter')
    .loader(require.resolve('./loader/babel-fm-loader'))
    .end()
}
