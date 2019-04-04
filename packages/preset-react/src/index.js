'use strict'

const babel = require('@berun/runner-babel')
const webpack = require('@berun/runner-webpack')
const jestRunner = require('@berun/runner-jest')
const polyfills = require('@berun/runner-web-polyfills')

module.exports = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'
  console.log(
    berun.options.paths.isTypeScript
      ? 'TypeScript Project'
      : 'JavaScript Project'
  )

  berun
    .use(babel)
    .use(webpack)
    .use(jestRunner)
    .use(polyfills)
    .when(ISPRODUCTION, b => b.use(webpack.terser))
    .use(webpack.ruleParser)
    .use(webpack.ruleMjs)
    .use(webpack.ruleMainImage)
    .use(webpack.ruleMainCompile)
    // .use(webpack.ruleMainExternal)
    .use(webpack.ruleMainStatic)
    .use(webpack.ruleMainSvg)
    .use(webpack.pluginHtml, { title: options.title })
    .use(webpack.pluginInterpolateHtml)
    .use(webpack.pluginPackageInfo)
    .use(webpack.pluginProgressBar)
    .use(webpack.pluginModuleNotFound)
    //  .when(ISPRODUCTION, b => b.use(webpack.pluginWorkbox))
    .when(!ISPRODUCTION, b => b.use(webpack.pluginHot))
    .when(!ISPRODUCTION, b => b.use(webpack.pluginCaseSensitivePaths))
    .when(!ISPRODUCTION, b => b.use(webpack.pluginWatchMissingNodeModules))
    .use(webpack.pluginMoment)
    .use(webpack.pluginManifest)
    .when(ISPRODUCTION && berun.options.paths.isTypeScript, b =>
      b.use(webpack.pluginForkTsChecker)
    )

  berun.sparky.task('start', webpack.taskDev)
  berun.sparky.task('build', webpack.taskProd)
}

module.exports.presetReact = module.exports
