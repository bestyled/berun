import * as path from 'path'
import * as fs from 'fs'
import { ensureDirSync, remove } from 'fs-extra'
import Berun from '@berun/berun'
import renderHTML from '../preset-common/preset-render-html'
import { pluginMiniHTML as PluginMiniHTML } from './fuse-box-plugin-mini-html'

export const presetDev = function presetTemp(berun: Berun, _) {
  berun.options.paths.appBuild += '-static'

  if (!fs.existsSync(berun.options.paths.appBuild)) {
    ensureDirSync(berun.options.paths.appBuild)
  }

  berun.fusebox.output(path.join(berun.options.paths.appBuild, '$name.js'))
}

export const presetTemp = function presetTemp(
  berun: Berun,
  opts: { tempdir?: string } = {}
) {
  berun.options.paths.appBuild += '-static'
  opts.tempdir = opts.tempdir || path.join(berun.options.paths.appBuild, 'TEMP')

  if (!fs.existsSync(berun.options.paths.appBuild)) {
    ensureDirSync(berun.options.paths.appBuild)
  }
  if (!fs.existsSync(opts.tempdir)) {
    ensureDirSync(opts.tempdir)
  }

  berun.fusebox.plugins.delete('Quantum')

  berun.fusebox
    .sourceMaps(false)
    .output(path.join(opts.tempdir, '$name.js'))
    .target('server@esnext')
    .hash(false)
    .cache(false)
    .serverBundle(false)

  berun.when('babel' in berun, b => b.babel.compact(false))
}

interface PresetStaticOptions {
  tempdir?: string
  basename?: string
  noJS?: boolean
  homepage?: string
  appBuild?: string
}

export const presetStatic = async function presetStatic(
  berun: Berun,
  opts: PresetStaticOptions = {}
) {
  opts.tempdir = opts.tempdir || path.join(berun.options.paths.appBuild, 'TEMP')

  berun.fusebox
    .output(path.join(berun.options.paths.appBuild, '$name.js'))
    .target('browser@es5')
    .serverBundle(false)

  berun.fusebox.plugins.delete('WebIndex')

  const firstEntryPoint = berun.fusebox.bundles.order().order[0]

  const bundleExport = require(path.resolve(
    opts.tempdir,
    `./${firstEntryPoint}.js`
  ))

  const entrySsr = bundleExport.FuseBox.import(bundleExport.FuseBox.mainFile)
    .default

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
  opts.basename = opts.basename || process.env.PUBLIC_URL
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
    berun.fusebox.plugin(`WebIndex${i++}`).use(PluginMiniHTML, [
      {
        target: `${page.path}/index.html`,
        context: page
      }
    ])
  })
}
