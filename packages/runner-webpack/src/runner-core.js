'use strict'

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const path = require('path')

/**
 * Add core webpack configuration including
 * main entry sources, output paths,
 * resolution strategy, and miscellaneous variables such as
 * mode, bail, devtool module filename template, empty node proxies,
 * performance hints, and module strict export presence
 */
module.exports.presetCoreWebpack = (berun, options) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

  berun.webpack
    .entry('main')
    .when(!ISPRODUCTION, entry =>
      entry.add(require.resolve('react-dev-utils/webpackHotDevClient'))
    )
    .add(berun.options.paths.appIndexJs)
    .end()

  berun.webpack.output
    .when(
      ISPRODUCTION,
      o => o.path(berun.options.paths.appBuild),
      o => o.pathinfo(true)
    )
    .filename(
      ISPRODUCTION ? 'static/js/[name].[chunkhash:8].js' : 'static/js/[name].js'
    )
    .chunkFilename(
      ISPRODUCTION
        ? 'static/js/[name].[chunkhash:8].chunk.js'
        : 'static/js/[name].chunk.js'
    )
    .publicPath(berun.options.paths.publicPath)
    .devtoolModuleFilenameTemplate(
      ISPRODUCTION
        ? info =>
            path
              .relative(berun.options.paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    )

  berun.webpack
    .mode(ISPRODUCTION ? 'production' : 'development')
    .bail(ISPRODUCTION ? true : false)
    .devtool(
      ISPRODUCTION
        ? shouldUseSourceMap
          ? 'source-map'
          : false
        : 'cheap-module-source-map'
    )
    .node.set('dgram', 'empty')
    .set('fs', 'empty')
    .set('net', 'empty')
    .set('tls', 'empty')
    .set('child_process', 'empty')
    .end()
    .performance.hints(false)
    .end()
    .module.set('strictExportPresence', true)
    .end()
}
