'use strict'

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const path = require('path')

// Hack to use a class instead of an object
// Prevents webpack-chain 'Cannot redefine property: __pluginArgs' error
// Just use this class instead of PnpWebpackPlugin
class PnpWebpackPluginClass {
  apply(compiler) {
    return PnpWebpackPlugin.apply(compiler)
  }
}

/**
 * Add resolve webpack configuration including
 * module scope and pnp plugins
 */
module.exports.presetResolveWebpack = (berun, options) => {
  berun.webpack.resolve.modules
    .add('node_modules')
    .merge(process.env.NODE_PATH.split(path.delimiter).filter(Boolean))
    .end()
    .extensions.merge([
      '.ts',
      '.tsx',
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx'
    ])
    .end()
    .alias.set(
      '@babel/runtime',
      path.dirname(require.resolve('@babel/runtime/package.json'))
    )
    .end()
    .alias.set('react-native', 'react-native-web')
    .end()
    .plugin('ModuleScope')
    .use(ModuleScopePlugin, [
      berun.options.paths.appSrc,
      [berun.options.paths.appPackageJson]
    ])
    .end()
    .plugin('pnp1')
    // Adds support for installing with Plug'n'Play, leading to faster installs and adding
    // guards against forgotten dependencies and such.
    .use(PnpWebpackPluginClass)
    .end()

  berun.webpack.resolveLoader
    .plugin('pnp-resolve')
    // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
    // from the current package.
    .use(PnpWebpackPlugin.moduleLoader(module))
}
