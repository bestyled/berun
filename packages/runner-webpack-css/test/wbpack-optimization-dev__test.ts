import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetReactCss from '../src'

test('Gets Webpack optimization configuration', () => {
  const berun = berunJs(presetReact).use(presetReactCss)

  expect(berun.webpack.optimization.entries()).toEqual({
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: true
  })

  expect(
    berun.webpack.optimization.minimizers.values().map(plugin => {
      const c = plugin.toConfig()
      return {
        name: c.__pluginName,
        args: c.__pluginArgs,
        constructor: c.__pluginConstructorName
      }
    })
  ).toEqual([])
})

test('Gets Webpack production optimization configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact).use(presetReactCss)

  expect(berun.webpack.optimization.entries()).toEqual({
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: true,
    minimize: true
  })

  expect(
    berun.webpack.optimization.minimizers.values().map(plugin => {
      const c = plugin.toConfig()
      return {
        name: c.__pluginName,
        args: c.__pluginArgs,
        constructor: c.__pluginConstructorName
      }
    })
  ).toEqual([
    {
      name: 'terser',
      constructor: 'TerserPlugin',
      args: [
        {
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              // eslint-disable-next-line @typescript-eslint/camelcase
              ascii_only: true
            }
          },
          parallel: true,
          cache: true,
          sourceMap: false
        }
      ]
    },
    {
      name: 'optimizeCSSAssets',
      constructor: 'OptimizeCssAssetsWebpackPlugin',
      args: [
        {
          cssProcessorOptions: {
            parser: expect.any(Function),
            map: {
              inline: false,
              annotation: true
            }
          }
        }
      ]
    }
  ])
})
