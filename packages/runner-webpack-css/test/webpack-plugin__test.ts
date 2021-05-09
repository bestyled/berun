import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetReactCss from '../src'

test('Gets Webpack plugin configuration', () => {
  const berun = berunJs(presetReact).use(presetReactCss)

  expect(
    berun.webpack.plugins.values().map((plugin) => {
      const c = plugin.toConfig()
      return {
        name: c.__pluginName,
        args: c.__pluginArgs,
        constructor: c.__pluginConstructorName
      }
    })
  ).toEqual([
    {
      constructor: 'HtmlWebpackPlugin',
      args: [
        {
          inject: true,
          templateContent: expect.stringContaining('<!DOCTYPE html>')
        }
      ],
      name: 'html'
    },
    {
      name: 'interpolate-html',
      constructor: 'InterpolateHtmlPlugin',
      args: [
        expect.any(Function),
        {
          NODE_ENV: 'test',
          PUBLIC_URL: ''
        }
      ]
    },
    {
      name: 'env',
      constructor: 'DefinePlugin',
      args: [
        {
          'process.env': {
            NODE_ENV: '"test"',
            APP_PATH:
              '"/Volumes/DATA/projects/berun/packages/runner-webpack-css"',
            META_WORKSPACE: '"/Volumes/DATA/projects/berun"',
            DIRECTORIES: '{}',
            PUBLIC_URL: '""',
            REMOTE_ORIGIN_URL: '"git@github.com:bestyled/berun.git"',
            TITLE: '"@berun/runner-webpack-css"',
            VERSION: expect.any(String),
            WORKSPACE: '"/Volumes/DATA/projects/berun"'
          }
        }
      ]
    },
    {
      name: 'progress-bar',
      constructor: 'ProgressBarPlugin',
      args: expect.any(Array)
    },
    {
      name: 'modulenotfound',
      constructor: 'ModuleNotFoundPlugin',
      args: ['/Volumes/DATA/projects/berun/packages/runner-webpack-css']
    },
    {
      name: 'hot',
      constructor: 'HotModuleReplacementPlugin',
      args: []
    },
    {
      name: 'case-sensitive-paths',
      constructor: 'CaseSensitivePathsPlugin',
      args: []
    },
    {
      name: 'watch-missing-node-modules',
      constructor: 'WatchMissingNodeModulesPlugin',
      args: [
        '/Volumes/DATA/projects/berun/packages/runner-webpack-css/node_modules'
      ]
    },
    {
      name: 'moment',
      constructor: 'IgnorePlugin',
      args: [/^\.\/locale$/, /moment$/]
    },
    {
      name: 'manifest',
      constructor: 'ManifestPlugin',
      args: [
        {
          fileName: 'asset-manifest.json',
          publicPath: '/'
        }
      ]
    }
  ])
})

test('Gets Webpack production plugin configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact).use(presetReactCss)

  expect(
    berun.webpack.plugins.values().map((plugin) => {
      const c = plugin.toConfig()
      return {
        name: c.__pluginName,
        args: c.__pluginArgs,
        constructor: c.__pluginConstructorName
      }
    })
  ).toEqual([
    {
      constructor: 'HtmlWebpackPlugin',
      args: [
        {
          inject: true,
          templateContent: expect.stringContaining('<!DOCTYPE html>'),
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
        }
      ],
      name: 'html'
    },
    {
      name: 'interpolate-html',
      constructor: 'InterpolateHtmlPlugin',
      args: [
        expect.any(Function),
        {
          NODE_ENV: 'production',
          PUBLIC_URL: ''
        }
      ]
    },
    {
      name: 'env',
      constructor: 'DefinePlugin',
      args: [
        {
          'process.env': {
            NODE_ENV: '"production"',
            APP_PATH:
              '"/Volumes/DATA/projects/berun/packages/runner-webpack-css"',
            META_WORKSPACE: '"/Volumes/DATA/projects/berun"',
            DIRECTORIES: '{}',
            PUBLIC_URL: '""',
            REMOTE_ORIGIN_URL: '"git@github.com:bestyled/berun.git"',
            TITLE: '"@berun/runner-webpack-css"',
            VERSION: expect.any(String),
            WORKSPACE: '"/Volumes/DATA/projects/berun"'
          }
        }
      ]
    },
    {
      name: 'progress-bar',
      constructor: 'ProgressBarPlugin',
      args: expect.any(Array)
    },
    {
      name: 'modulenotfound',
      constructor: 'ModuleNotFoundPlugin',
      args: ['/Volumes/DATA/projects/berun/packages/runner-webpack-css']
    },
    /*  {
      name: 'workbox',
      constructor: 'GenerateSW',
      args: [
        {
          clientsClaim: true,
          exclude: [/\.map$/, /asset-manifest\.json$/],
          importWorkboxFrom: 'cdn',
          navigateFallback: '/index.html',
          navigateFallbackBlacklist: [
            new RegExp('^/_'),
            new RegExp('/[^/]+\\.[^/]+$')
          ]
        }
      ]
    }, */
    {
      name: 'moment',
      constructor: 'IgnorePlugin',
      args: [/^\.\/locale$/, /moment$/]
    },
    {
      name: 'manifest',
      constructor: 'ManifestPlugin',
      args: [
        {
          fileName: 'asset-manifest.json',
          publicPath: '/'
        }
      ]
    },
    {
      name: 'mini-css',
      constructor: 'MiniCssExtractPlugin',
      args: [
        {
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
        }
      ]
    }
  ])
})
