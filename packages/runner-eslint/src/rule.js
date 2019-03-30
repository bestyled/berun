/**
 *   run the linter.
 * It's important to do this before Babel processes the JS.
 */
module.exports.ruleESlint = (berun, options) => {
  berun.webpack.module
    .rule('eslint')
    .test(/\.(js|jsx|mjs|ts|tsx)$/)
    .enforce('pre')
    .include.merge([options.paths.appSrc])
    .end()
    .exclude.add(/[/\\]node_modules[/\\]/)
    .end()
    .use('eslint')
    .loader(require.resolve('eslint-loader'))
    .end()

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = () => {
    berun.webpack.module
      .rule('eslint')
      .use('eslint')
      .options(berun.eslint.toConfig())

    return _webpackOldToConfig.call(berun.webpack, ...arguments)
  }
}
