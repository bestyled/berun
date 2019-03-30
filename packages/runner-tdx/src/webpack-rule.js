'use strict'

/**
 * TDX Loader
 */
module.exports.ruleMainDocs = (berun, options) => {
  const main = berun.webpack.module.rule('main')

  if (main.oneOfs.has('static'))
    main.oneOf('static').exclude.add(/\.(?:md|mdx|tdx)$/)

  main
    .oneOf('markdown')
    .test(/(\.(?:md|mdx|tdx))$/)
    .include.merge([berun.options.paths.appPath])
    .end()
    .exclude.add(/node_modules[/\\]/)
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
}
