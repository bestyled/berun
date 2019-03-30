'use strict'

const {
  ruleMainPostCss,
  ruleMainCssModule,
  ruleMainSass,
  ruleMainSassModule
} = require('@berun/runner-webpack-css/src/webpack/rule')

const {
  pluginMiniCss
} = require('@berun/runner-webpack-css/src/webpack/plugin')

const {
  webpackoptimizationCSSAssets
} = require('@berun/runner-webpack-css/src/webpack/optimization')

module.exports.presetReactCss = (berun, opts = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  const options = Object.assign({}, berun.options, opts, { ISPRODUCTION })

  if ('webpack' in berun) {
    ruleMainPostCss(berun, options)
    ruleMainCssModule(berun, options)
    ruleMainSass(berun, options)
    ruleMainSassModule(berun, options)

    if (ISPRODUCTION) pluginMiniCss(berun, options)

    webpackoptimizationCSSAssets(berun, options)
  } else
    throw 'unsupported module packager;  only webpack supported by @berun/runner-webpack-css currently'
}
