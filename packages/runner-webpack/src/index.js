'use strict'

const Webpack = require('@berun/fluent-webpack').Webpack
const WebpackDevServer = require('@berun/fluent-webpack').WebpackDevServer

const { presetCoreWebpack } = require('./runner-core')
const { presetResolveWebpack } = require('./runner-resolve')
const { presetDevServer } = require('./runner-devserver')

const taskDev = require('./tasks/task-dev')

const {
  taskDevBuildPreFlightArgs,
  taskBuildPreFlightChecks,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile
} = taskDev

const taskProd = require('./tasks/task-prod')

const {
  taskBuildPreFlightArgs,
  taskBuildPreFlightMeasure,
  taskBuildPreFlightClean,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightFileSizes,
  taskBuildPostFlightInstructions
} = taskProd

const {
  ruleParser,
  ruleMjs,
  ruleMainImage,
  ruleMainCompile,
  ruleMainExternal,
  ruleMainStatic,
  ruleMainSvg
} = require('./runner-rule')

const {
  pluginHtml,
  pluginInterpolateHtml,
  pluginProgressBar,
  pluginModuleNotFound,
  pluginEnv,
  pluginPackageInfo,
  pluginHot,
  pluginCaseSensitivePaths,
  pluginWatchMissingNodeModules,
  pluginMoment,
  pluginManifest,
  pluginWorkbox,
  pluginForkTsChecker
} = require('./runner-plugin')

const { optimization, terser } = require('./runner-optimization')

module.exports = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  berun
    .use(Webpack)
    .when(!ISPRODUCTION, b => b.use(WebpackDevServer))
    .when(!ISPRODUCTION, b => b.use(presetDevServer))
    .use(presetCoreWebpack)
    .use(presetResolveWebpack)
    .use(optimization)

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = () => {
    berun.babel.set('cacheDirectory', ISPRODUCTION ? false : true)

    var main = berun.webpack.module.rule('main')

    if (main.oneOfs.has('compile')) {
      main
        .oneOf('compile')
        .use('babel')
        .options(berun.babel.toConfig())
    }

    if (berun.webpack.module.rules.has('lint'))
      berun.webpack.module
        .rule('lint')
        .use('eslint')
        .options(berun.eslint.toConfig())

    return _webpackOldToConfig.call(berun.webpack, ...arguments)
  }
}

module.exports = Object.assign(module.exports, {
  taskDev,
  taskProd,
  taskDevBuildPreFlightArgs,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile,
  taskBuildPreFlightArgs,
  taskBuildPreFlightChecks,
  taskBuildPreFlightMeasure,
  taskBuildPreFlightClean,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightFileSizes,
  taskBuildPostFlightInstructions,
  ruleMjs,
  ruleParser,
  ruleMainImage,
  ruleMainCompile,
  ruleMainExternal,
  ruleMainStatic,
  ruleMainSvg,
  pluginHtml,
  pluginInterpolateHtml,
  pluginProgressBar,
  pluginModuleNotFound,
  pluginEnv,
  pluginPackageInfo,
  pluginHot,
  pluginCaseSensitivePaths,
  pluginWatchMissingNodeModules,
  pluginMoment,
  pluginManifest,
  pluginWorkbox,
  pluginForkTsChecker,
  terser
})
