const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/**
 * `MiniCSSExtractPlugin` extracts styles into CSS
 * files. If you use code splitting, async bundles will have their own separate CSS chunk file.
 * By default we support CSS Modules with the extension .module.css
 */
module.exports.pluginMiniCss = (berun, options) => {
  berun.webpack.plugin('mini-css').use(MiniCssExtractPlugin, [
    {
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }
  ])
}
