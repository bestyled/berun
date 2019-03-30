'use strict'

const chalk = require('chalk')
const fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')

const {
  DefinePlugin,
  HotModuleReplacementPlugin,
  IgnorePlugin
} = require('webpack')

const ManifestPlugin = require('webpack-manifest-plugin')
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

// PROD ONLY
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

const deepmerge = require('deepmerge')

/**
 *  Generates an `index.html` file with the <script> injected.
 */
module.exports.pluginHtml = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  let htmlPluginArgs = deepmerge(
    {
      inject: true,
      template: fs.existsSync(berun.options.paths.appHtml)
        ? berun.options.paths.appHtml
        : null
    },
    (ISPRODUCTION && {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }) ||
      {},
    options.html || {}
  )

  if (!htmlPluginArgs.template) {
    delete htmlPluginArgs.template
    htmlPluginArgs.templateContent = `<!DOCTYPE html>
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
  }

  berun.webpack
    .plugin('html')
    .use(HtmlWebpackPlugin, [htmlPluginArgs])
    .end()
}

/**
 *  Makes some environment variables available in index.html.
 * The public URL is available as %PUBLIC_URL% in index.html, e.g.:
 * <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
 * In development, this will be an empty string.} berun
 */
module.exports.pluginInterpolateHtml = (berun, options) => {
  berun.webpack
    .plugin('interpolate-html')
    .use(InterpolateHtmlPlugin, [HtmlWebpackPlugin, berun.options.env.raw])
}

module.exports.pluginProgressBar = (berun, opt = {}) => {
  const { name = 'berun', color = 'green' } = opt

  const options = {
    width: '24',
    complete: '█',
    incomplete: chalk.gray('░'),
    format: [
      chalk[color](`[${name}] :bar`),
      chalk[color](':percent'),
      chalk.gray(':elapseds :msg')
    ].join(' '),
    summary: false,
    customSummary: () => {}
  }

  berun.webpack.plugin('progress-bar').use(ProgressBarPlugin, [options])
}

/**
 * This gives some necessary context to module not found errors, such as
 * the requesting resource.
 */
module.exports.pluginModuleNotFound = (berun, options) => {
  berun.webpack
    .plugin('modulenotfound')
    .use(ModuleNotFoundPlugin, [berun.options.paths.appPath])
}

/**
 *  <akes some environment variables available to the JS code, for example:
 * if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
 */
module.exports.pluginEnv = (berun, options) => {
  const processEnv = Object.assign(
    berun.options.env.stringified['process.env'],
    options || {}
  )

  berun.webpack.plugin('env').use(DefinePlugin, [{ 'process.env': processEnv }])
}

/**
 *  <akes some environment variables available to the JS code, for example:
 * if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
 */
module.exports.pluginPackageInfo = (berun, options) => {
  const packageJson = require(berun.options.paths.appPackageJson)

  const PACKAGE = {
    APP_PATH: JSON.stringify(berun.options.paths.appPath),
    WORKSPACE: JSON.stringify(berun.options.paths.workspace),
    PUBLIC_URL: JSON.stringify(berun.options.paths.publicUrl),
    REMOTE_ORIGIN_URL: JSON.stringify(berun.options.paths.remoteOriginUrl),
    TITLE: JSON.stringify(packageJson.name || 'BeRun App'),
    VERSION: JSON.stringify(packageJson.version),
    DIRECTORIES: JSON.stringify(packageJson.directories || {})
  }

  const processEnv = Object.assign(
    PACKAGE,
    berun.options.env.stringified['process.env'],
    options || {}
  )

  berun.webpack.plugin('env').use(DefinePlugin, [
    {
      'process.env': processEnv
    }
  ])
}

/**
 * This is necessary to emit hot updates (currently CSS only)
 */
module.exports.pluginHot = (berun, options) => {
  berun.webpack.plugin('hot').use(HotModuleReplacementPlugin)
}

/**
 * Watcher doesn't work well if you mistype casing in a path so we use
 * a plugin that prints an error when you attempt to do this.
 */
module.exports.pluginCaseSensitivePaths = (berun, options) => {
  berun.webpack.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin)
}

/**
 * If you require a missing module and then `npm install` it, you still have
 * to restart the development server for Webpack to discover it. This plugin
 * makes the discovery automatic so you don't have to restart.
 */
module.exports.pluginWatchMissingNodeModules = (berun, options) => {
  berun.webpack
    .plugin('watch-missing-node-modules')
    .use(WatchMissingNodeModulesPlugin, [berun.options.paths.appNodeModules])
}

/**
 * Moment.js is an extremely popular library that bundles large locale files
 * by default due to how Webpack interprets its code. This is a practical
 * solution that requires the user to opt into importing specific locales.
 */
module.exports.pluginMoment = (berun, options) => {
  berun.webpack.plugin('moment').use(IgnorePlugin, [/^\.\/locale$/, /moment$/])
}

/**
 * Generate a manifest file which contains a mapping of all asset filenames
 * to their corresponding output file so that tools can pick it up without
 * having to parse `index.html`.
 */
module.exports.pluginManifest = (berun, options) => {
  berun.webpack.plugin('manifest').use(ManifestPlugin, [
    {
      fileName: 'asset-manifest.json',
      publicPath: berun.options.paths.publicPath
    }
  ])
}

/**
 * Generate a service worker script that will precache, and keep up to date,
 * the HTML & assets that are part of the Webpack build.
 */
module.exports.pluginWorkbox = (berun, options) => {
  berun.webpack.plugin('workbox').use(WorkboxWebpackPlugin.GenerateSW, [
    {
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: berun.options.paths.publicUrl + '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp('/[^/]+\\.[^/]+$')
      ]
    }
  ])
}

/**
 * Typescript type checking
 */
module.exports.pluginForkTsChecker = (berun, options) => {
  berun.webpack
    .plugin('fork-ts-checker')
    .use(require('fork-ts-checker-webpack-plugin'), [
      {
        async: false,
        tsconfig: berun.options.paths.appTSConfig,
        tslint: false,
        watch: berun.options.paths.appSrc
      }
    ])
}
