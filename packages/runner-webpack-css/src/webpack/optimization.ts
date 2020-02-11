import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as safePostCssParser from 'postcss-safe-parser'
import Berun from '@berun/berun'

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

/**
 *  Add Development and Production config to berun.webpack.optimization
 */
export const webpackoptimizationCSSAssets = (berun: Berun, options) => {
  if (options.ISPRODUCTION) {
    berun.webpack.optimization
      .minimizer('optimizeCSSAssets')
      .use(OptimizeCSSAssetsPlugin, [
        {
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true
                }
              : false
          }
        }
      ])
  }
}
