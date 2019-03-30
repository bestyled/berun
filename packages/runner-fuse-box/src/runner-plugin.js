'use strict'
const path = require('path')
const fs = require('fs')

const {
  EnvPlugin,
  CSSPlugin,
  SVGPlugin,
  JSONPlugin,
  QuantumPlugin,
  WebIndexPlugin
} = require('fuse-box')

const { BabelPlugin } = require('@berun/fuse-box-plugin-babel')

/**
 *  Creates environment variables that can be accessed at build or run time.
 */
module.exports.pluginEnv = (berun, options = {}) => {
  berun.fusebox
    .plugin('Env')
    .use(EnvPlugin, [{ NODE_ENV: process.env.NODE_ENV, FuseBox: true }])
}

/**
 *  Makes environment variables available to the JS code,
 * expanded to include package.json
 */
module.exports.pluginPackageInfo = (berun, options) => {
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
module.exports.pluginSVG = (berun, options = {}) => {
  berun.fusebox.plugin('SVG').use(SVGPlugin)
}

/**
 * CSSPlugin is used to handle .css syntax.
 * It should always be at the end of any CSS processing chain
 */
module.exports.pluginCSS = (berun, options = {}) => {
  berun.fusebox.plugin('CSS').use(CSSPlugin)
}

/**
 *  Allows importing .svg graphics files into javascript source for use in styles
 * and as image source.
 */
module.exports.pluginJSON = (berun, options = {}) => {
  berun.fusebox.plugin('JSON').use(JSONPlugin)
}

/**
 *  Generates a HTML file once a producer's job is completed
 */
module.exports.pluginWebIndex = (berun, options = {}) => {
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
    Object.assign(
      {
        templateString: templateString
          .replace(/%PUBLIC_URL%/g, '')
          .replace('</body>', ' $bundles\n</body>'),
        path: '/'
      },
      options
    )
  ])
}

/**
 *  An extension on top of FuseBox that creates highly optimized bundles
 */
module.exports.pluginBabel = (berun, options = {}) => {
  berun.fusebox.plugin('Babel').use(BabelPlugin, [
    {
      /* placeholder */
    }
  ])
}

/**
 *  An extension on top of FuseBox that creates highly optimized bundles
 */
module.exports.pluginQuantum = (berun, options = {}) => {
  berun.fusebox
    .plugin('Quantum')
    .use(QuantumPlugin, [
      Object.assign({ removeExportsInterop: false, uglify: true }, options)
    ])
}
