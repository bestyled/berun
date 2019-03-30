const path = require('path')
const fs = require('fs')
const { ensureDirSync, remove } = require('fs-extra')
const nodeExternals = require('webpack-node-externals')

const renderHTML = require('../preset-common/preset-render-html')
const PluginMiniHTML = require('./webpack-plugin-mini-html')

module.exports.presetDev = function presetTemp(berun, opts = {}) {
  berun.options.paths.appBuild += '-static'
}

module.exports.presetTemp = async function presetTemp(berun, opts = {}) {
  berun.options.paths.appBuild += '-static'
  opts.tempdir = opts.tempdir || path.join(berun.options.paths.appBuild, 'TEMP')

  if (!fs.existsSync(berun.options.paths.appBuild))
    ensureDirSync(berun.options.paths.appBuild)
  if (!fs.existsSync(opts.tempdir)) ensureDirSync(opts.tempdir)

  berun.webpack.output
    .path(opts.tempdir)
    .filename('[name].js')
    .libraryTarget('umd')
    .end()
    .target('node')
    .externals(nodeExternals())
    .optimization.delete('splitChunks')
    .delete('runtimeChunk')
    .end()

  berun.webpack.devtool(false)
  berun.webpack.optimization.set('minimize', false)
  berun.webpack.optimization.minimizers.delete('terser')
  berun.babel.compact(false)
}

module.exports.presetStatic = async function presetStatic(berun, opts = {}) {
  opts.tempdir = opts.tempdir || path.join(berun.options.paths.appBuild, 'TEMP')

  berun.webpack.output
    .path(berun.options.paths.appBuild)
    .filename('[name].js')
    .libraryTarget('var')
    .end()
    .target('web')
    .delete('externals')

  berun.webpack.plugins.delete('html')
  berun.webpack.plugins.delete('interpolate-html')
  berun.webpack.plugins.delete('sw-precache-webpack')
  berun.webpack.plugins.delete('manifest')

  const firstEntryPoint = berun.webpack.entryPoints.order().order[0]
  const entry_ssr = require(path.resolve(
    opts.tempdir,
    `./${firstEntryPoint}.js`
  )).default

  const {
    h,
    renderToString,
    renderToStaticMarkup,
    App,
    routes,
    sitedata,
    config
  } = await entry_ssr()

  // await remove(opts.tempdir)
  opts.basename = opts.basename || process.env.PUBLIC_URL
  opts.noJS = berun.sparkyContext.noJS

  const pages = await renderHTML(
    h,
    renderToString,
    renderToStaticMarkup,
    App,
    routes,
    sitedata,
    config.renderToHtml,
    opts
  )

  let i = 0

  pages.forEach(page => {
    berun.webpack.plugin(`html${i++}`).use(PluginMiniHTML, [
      {
        filename: page.path + '/index.html',
        context: page
      }
    ])
  })
}
