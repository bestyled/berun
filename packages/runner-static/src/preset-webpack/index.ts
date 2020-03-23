import * as path from 'path'
import * as fs from 'fs'
import { ensureDirSync, remove } from 'fs-extra'
import * as nodeExternals from 'webpack-node-externals'
import Berun from '@berun/berun'
import renderHTML from '../preset-common/preset-render-html'
import PluginMiniHTML from './webpack-plugin-mini-html'

export const presetDev = (berun: Berun, _) => {
  berun.options.paths.appBuild += '-static'
}

export const presetTemp = async (
  berun: Berun,
  opts: { tempdir?: string } = {}
) => {
  berun.options.paths.appBuild += '-static'
  opts.tempdir = opts.tempdir || path.join(berun.options.paths.appBuild, 'TEMP')

  if (!fs.existsSync(berun.options.paths.appBuild)) {
    ensureDirSync(berun.options.paths.appBuild)
  }
  if (!fs.existsSync(opts.tempdir)) {
    ensureDirSync(opts.tempdir)
  }

  berun.webpack.output
    .path(opts.tempdir)
    .filename('[name].js')
    .libraryTarget('umd')
    .end()
    .target('node')
    .externals(nodeExternals({ whitelist: [/^@bestatic/, /^@babel\/runtime/] }))
    .optimization.delete('splitChunks')
    .delete('runtimeChunk')
    .end()

  berun.webpack.devtool(false)
  berun.webpack.optimization.set('minimize', false)
  berun.webpack.optimization.minimizers.delete('terser')
  berun.babel.compact(false)
}

export const presetStatic = async (
  berun: Berun,
  opts: {
    tempdir?: string
    basename?: string
    noJS?: boolean
    homepage?: string
    appBuild?: string
  } = {}
) => {
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
  const entrySsr = require(path.resolve(
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
  } = await entrySsr()

  await remove(opts.tempdir)
  opts.basename = opts.basename || ''
  // opts.basename = opts.basename || process.env.PUBLIC_URL
  opts.noJS = berun.sparkyContext.noJS
  opts.homepage = berun.options.paths.homepage
  opts.appBuild = berun.options.paths.appBuild

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
        filename: `${page.path}/index.html`,
        context: page
      }
    ])
  })
}
