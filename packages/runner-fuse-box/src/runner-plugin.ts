import path from 'path'
import fs from 'fs'
import {
  EnvPlugin,
  CSSPlugin,
  SVGPlugin,
  JSONPlugin,
  QuantumPlugin,
  WebIndexPlugin
} from 'fuse-box'
import { BabelPlugin } from '@berun/fuse-box-plugin-babel'
import Berun from '@berun/berun'

/**
 *  Creates environment variables that can be accessed at build or run time.
 */
export const pluginEnv = (berun: Berun, _) => {
  berun.fusebox
    .plugin('Env')
    .use(EnvPlugin, [{ NODE_ENV: process.env.NODE_ENV, FuseBox: true }])
}

/**
 *  Makes environment variables available to the JS code,
 * expanded to include package.json
 */
export const pluginPackageInfo = (berun: Berun, options) => {
  const packageJson = require(berun.options.paths.appPackageJson)

  const PACKAGE = {
    APP_PATH: berun.options.paths.appPath,
    WORKSPACE: berun.options.paths.workspace,
    PUBLIC_URL: berun.options.paths.publicUrl,
    REMOTE_ORIGIN_URL: berun.options.paths.remoteOriginUrl,
    TITLE: packageJson.name || 'BeRun App',
    VERSION: packageJson.version,
    DIRECTORIES: packageJson.directories || {}
  }

  const processEnv = Object.assign(
    PACKAGE,
    berun.options.env.raw,
    options || {},
    { FuseBox: true }
  )

  berun.fusebox.plugin('Env').use(EnvPlugin, [processEnv])
}

/**
 *  Allows importing .svg graphics files into javascript source for use in styles
 * and as image source.
 */
export const pluginSVG = (berun: Berun, _) => {
  berun.fusebox.plugin('SVG').use(SVGPlugin)
}

/**
 * CSSPlugin is used to handle .css syntax.
 * It should always be at the end of any CSS processing chain
 */
export const pluginCSS = (berun: Berun, _) => {
  berun.fusebox.plugin('CSS').use(CSSPlugin)
}

/**
 *  Allows importing .svg graphics files into javascript source for use in styles
 * and as image source.
 */
export const pluginJSON = (berun: Berun, _) => {
  berun.fusebox.plugin('JSON').use(JSONPlugin)
}

/**
 *  Generates a HTML file once a producer's job is completed
 */
export const pluginWebIndex = (
  berun: Berun,
  options: { title?: string } = {}
) => {
  const templateString = fs.existsSync(path.join(berun.options.paths.appHtml))
    ? fs.readFileSync(path.join(berun.options.paths.appHtml), 'utf8')
    : `<!DOCTYPE html>
    <html>
      <head>
        <meta charset='utf-8'>
        <title>${options.title || 'BeRun App'}</title>
        <style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>
      </head>
      <body>
      <div id="root"></div>
      </body>
    </html>`

  berun.fusebox.plugin('WebIndex').use(WebIndexPlugin, [
    {
      templateString: templateString
        .replace(/%PUBLIC_URL%/g, '')
        .replace('</body>', ' $bundles\n</body>'),
      path: '/',
      ...options
    }
  ])
}

/**
 *  An extension on top of FuseBox that creates highly optimized bundles
 */
export const pluginBabel = (berun: Berun, _) => {
  berun.fusebox.plugin('Babel').use(BabelPlugin, [
    {
      /* placeholder */
    }
  ])
}

/**
 *  An extension on top of FuseBox that creates highly optimized bundles
 */
export const pluginQuantum = (berun: Berun, options = {}) => {
  berun.fusebox.plugin('Quantum').use(QuantumPlugin, [
    {
      removeExportsInterop: false,
      uglify: { es6: true },
      treeshake: true,
      ...options
    }
  ])
}
