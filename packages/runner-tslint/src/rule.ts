import Berun from '@berun/berun'

// FIX-DEPENDENCIES
require.resolve('tslint-loader')

/**
 * Run the linter.
 * It's important to do this before Babel processes the TS.
 */
export const ruleTSlint = (berun: Berun, options) => {
  berun.webpack.module
    .rule('tslint')
    .test(/\.(ts|tsx)$/)
    .enforce('pre')
    .include.merge([options.paths.appSrc])
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('tslint')
    .loader(require.resolve('tslint-loader'))
    .options({
      // can specify a custom config file relative to current directory or with absolute path
      // 'tslint-custom.json'
      configFile: false,

      // tslint errors are displayed by default as warnings
      // set emitErrors to true to display them as errors
      emitErrors: false,

      // tslint does not interrupt the compilation by default
      // if you want any file with tslint errors to fail
      // set failOnHint to true
      failOnHint: true,

      // enables type checked rules like 'for-in-array'
      // uses tsconfig.json from current working directory
      typeCheck: false,

      // automatically fix linting errors
      fix: false
    })
    .end()

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = (...rest) => {
    berun.webpack.module
      .rule('tslint')
      .use('tslint')
      .tap(options =>
        Object.assign(options, { configuration: berun.tslint.toConfig() })
      )

    return _webpackOldToConfig.call(berun.webpack, ...rest)
  }
}
