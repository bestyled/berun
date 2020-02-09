import Berun from '@berun/berun'

// FIX-DEPENDENCIES
require.resolve('eslint-loader')

/**
 *   run the linter.
 * It's important to do this before Babel processes the JS.
 */
export const ruleESlint = (berun: Berun, options) => {
  berun.webpack.module
    .rule('eslint')
    .test(/\.(js|jsx|mjs|ts|tsx)$/)
    .enforce('pre')
    .include.merge([options.paths.appSrc])
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('eslint')
    .loader(require.resolve('eslint-loader'))
    .end()

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = (...rest) => {
    berun.webpack.module
      .rule('eslint')
      .use('eslint')
      .options(berun.eslint.toConfig())

    return _webpackOldToConfig.call(berun.webpack, ...rest)
  }
}
