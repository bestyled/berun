import Berun from '@berun/berun'
import {
  ruleMainPostCss,
  ruleMainCssModule,
  ruleMainSass,
  ruleMainSassModule
} from './webpack/rule'
import { pluginMiniCss } from './webpack/plugin'
import { webpackoptimizationCSSAssets } from './webpack/optimization'

export default (berun: Berun, opts = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  const options = { ...berun.options, ...opts, ISPRODUCTION }

  if ('webpack' in berun) {
    ruleMainPostCss(berun, options)
    ruleMainCssModule(berun, options)
    ruleMainSass(berun, options)
    ruleMainSassModule(berun, options)

    if (ISPRODUCTION) {
      pluginMiniCss(berun, options)
    }

    webpackoptimizationCSSAssets(berun, options)
  } else {
    throw new Error(
      'unsupported module packager;  only webpack supported by @berun/runner-webpack-css currently'
    )
  }
}
