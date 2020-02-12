import { Webpack, WebpackDevServer } from '@berun/fluent-webpack'

import Berun from '@berun/berun'
import presetCoreWebpack from './runner-core'
import presetResolveWebpack from './runner-resolve'
import presetDevServer from './runner-devserver'

import taskDev, {
  taskDevBuildPreFlightArgs,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile
} from './tasks/task-dev'

import taskProd, {
  taskBuildPreFlightArgs,
  taskBuildPreFlightMeasure,
  taskBuildPreFlightClean,
  taskBuildPreFlightChecks,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightFileSizes,
  taskBuildPostFlightInstructions
} from './tasks/task-prod'

import {
  ruleParser,
  ruleMjs,
  ruleMainImage,
  ruleMainCompile,
  ruleMainStatic,
  ruleMainSvg
} from './runner-rule'

import {
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
} from './runner-plugin'

import { optimization, terser } from './runner-optimization'

type BerunFunc = (berun: Berun) => void

interface BerunWebpack {
  (): BerunFunc
  taskDev: BerunFunc
  taskProd: BerunFunc
  taskDevBuildPreFlightArgs: BerunFunc
  taskDevBuildPreFlightChecks: BerunFunc
  taskDevBuildGetPort: BerunFunc
  taskDevBuildCompile: BerunFunc
  taskBuildPreFlightArgs: BerunFunc
  taskBuildPreFlightChecks: BerunFunc
  taskBuildPreFlightMeasure: BerunFunc
  taskBuildPreFlightClean: BerunFunc
  taskBuildCopyPublicAssets: BerunFunc
  taskBuildCompile: BerunFunc
  taskBuildPostFlightFileSizes: BerunFunc
  taskBuildPostFlightInstructions: BerunFunc
  ruleMjs: BerunFunc
  ruleParser: BerunFunc
  ruleMainImage: BerunFunc
  ruleMainCompile: BerunFunc
  ruleMainStatic: BerunFunc
  ruleMainSvg: BerunFunc
  pluginHtml: BerunFunc
  pluginInterpolateHtml: BerunFunc
  pluginProgressBar: BerunFunc
  pluginModuleNotFound: BerunFunc
  pluginEnv: BerunFunc
  pluginPackageInfo: BerunFunc
  pluginHot: BerunFunc
  pluginCaseSensitivePaths: BerunFunc
  pluginWatchMissingNodeModules: BerunFunc
  pluginMoment: BerunFunc
  pluginManifest: BerunFunc
  pluginWorkbox: BerunFunc
  pluginForkTsChecker: BerunFunc
  terser: BerunFunc
}

const webpack: BerunWebpack = Object.assign(
  ((berun: Berun) => {
    const ISPRODUCTION = process.env.NODE_ENV === 'production'

    berun
      .use(Webpack)
      .when(!ISPRODUCTION, b => b.use(WebpackDevServer))
      .when(!ISPRODUCTION, b => b.use(presetDevServer))
      .use(presetCoreWebpack)
      .use(presetResolveWebpack)
      .use(optimization)

    const _webpackOldToConfig = berun.webpack.toConfig
    berun.webpack.toConfig = (...rest) => {
      berun.babel.set('cacheDirectory', true)
      berun.babel.set('cacheCompression', ISPRODUCTION)
      berun.babel.set('compact', ISPRODUCTION)

      const main = berun.webpack.module.rule('main')

      if (main.oneOfs.has('compile')) {
        main
          .oneOf('compile')
          .use('babel')
          .options(berun.babel.toConfig())
      }

      if (berun.webpack.module.rules.has('lint')) {
        berun.webpack.module
          .rule('lint')
          .use('eslint')
          .options(berun.eslint.toConfig())
      }

      return _webpackOldToConfig.call(berun.webpack, ...rest)
    }
  }) as any,
  {
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
  }
)

export default webpack
