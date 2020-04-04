import * as chalk from 'chalk'
import * as fs from 'fs'
import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import * as InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import * as WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import * as ModuleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin'
import { DefinePlugin, HotModuleReplacementPlugin, IgnorePlugin } from 'webpack'
import * as ManifestPlugin from 'webpack-manifest-plugin'
import * as ProgressBarPlugin from 'progress-bar-webpack-plugin'
import * as forkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

// PROD ONLY
import * as WorkboxWebpackPlugin from 'workbox-webpack-plugin'

import * as deepmerge from 'deepmerge'
import Berun from '@berun/berun'

const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 *  Generates an `index.html` file with the <script> injected.
 */
export const pluginHtml = (
  berun: Berun,
  options: { html?: any; title?: string; templateContext?: any } = {}
) => {
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  const htmlPluginArgs = (deepmerge as any)(
    {
      inject: true,
      template: fs.existsSync(berun.options.paths.appHtml)
        ? berun.options.paths.appHtml
        : null
    },
    (ISPRODUCTION &&
      ({
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
      } as any)) ||
      {},
    options.html || {}
  ) as any

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
export const pluginInterpolateHtml = (berun: Berun, _) => {
  berun.webpack
    .plugin('interpolate-html')
    .use(InterpolateHtmlPlugin, [HtmlWebpackPlugin, berun.options.env.raw])
}

export const pluginProgressBar = (
  berun: Berun,
  opt: { name?: string; color?: string } = {}
) => {
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
    customSummary: () => {
      /** noop */
    }
  }

  berun.webpack.plugin('progress-bar').use(ProgressBarPlugin, [options])
}

/**
 * This gives some necessary context to module not found errors, such as
 * the requesting resource.
 */
export const pluginModuleNotFound = (berun: Berun, _) => {
  berun.webpack
    .plugin('modulenotfound')
    .use(ModuleNotFoundPlugin, [berun.options.paths.appPath])
}

/**
 *  <akes some environment variables available to the JS code, for example:
 * if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
 */
export const pluginEnv = (berun: Berun, options) => {
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
export const pluginPackageInfo = (berun: Berun, options) => {
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
export const pluginHot = (berun: Berun, _) => {
  berun.webpack.plugin('hot').use(HotModuleReplacementPlugin)
}

/**
 * Watcher doesn't work well if you mistype casing in a path so we use
 * a plugin that prints an error when you attempt to do this.
 */
export const pluginCaseSensitivePaths = (berun: Berun, _) => {
  berun.webpack.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin)
}

/**
 * If you require a missing module and then `npm install` it, you still have
 * to restart the development server for Webpack to discover it. This plugin
 * makes the discovery automatic so you don't have to restart.
 */
export const pluginWatchMissingNodeModules = (berun: Berun, _) => {
  berun.webpack
    .plugin('watch-missing-node-modules')
    .use(WatchMissingNodeModulesPlugin, [berun.options.paths.appNodeModules])
}

/**
 * Moment.js is an extremely popular library that bundles large locale files
 * by default due to how Webpack interprets its code. This is a practical
 * solution that requires the user to opt into importing specific locales.
 */
export const pluginMoment = (berun: Berun, _) => {
  berun.webpack.plugin('moment').use(IgnorePlugin, [/^\.\/locale$/, /moment$/])
}

/**
 * Generate a manifest file which contains a mapping of all asset filenames
 * to their corresponding output file so that tools can pick it up without
 * having to parse `index.html`.
 */
export const pluginManifest = (berun: Berun, _) => {
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
export const pluginWorkbox = (berun: Berun, _) => {
  berun.webpack.plugin('workbox').use(WorkboxWebpackPlugin.GenerateSW, [
    {
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: `${berun.options.paths.publicUrl}/index.html`,
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
export const pluginForkTsChecker = (berun: Berun, _) => {
  berun.webpack
    .plugin('fork-ts-checker')
    .use(forkTsCheckerWebpackPlugin as any, [
      {
        async: false,
        tsconfig: berun.options.paths.appTSConfig,
        eslint: false
      }
    ])
}
