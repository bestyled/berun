'use strict'

/**
 * MDX Loader
 */
module.exports.ruleMainDocs = (berun, options) => {
  const main = berun.webpack.module.rule('main')

  if (main.oneOfs.has('static'))
    main.oneOf('static').exclude.add(/\.(?:md|mdx)$/)

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
      /* placeholder */
    })
    .end()
}
