const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

/**
 *  Add Development and Production config to berun.webpack.optimization
 */
module.exports.webpackoptimizationCSSAssets = (berun, options) => {
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
