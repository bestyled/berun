import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Berun from '@berun/berun'

/**
 * `MiniCSSExtractPlugin` extracts styles into CSS
 * files. If you use code splitting, async bundles will have their own separate CSS chunk file.
 * By default we support CSS Modules with the extension .module.css
 */
export const pluginMiniCss = (berun: Berun, _) => {
  berun.webpack.plugin('mini-css').use(MiniCssExtractPlugin, [
    {
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
    }
  ])
}
