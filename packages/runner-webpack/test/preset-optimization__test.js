import { presetReact } from '../src/preset-react'
const berun_js = require('@berun/berun')

test('Gets Webpack optimization configuration', () => {
  const berun = berun_js(presetReact)

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
  const berun = berun_js(presetReact)

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
              ascii_only: true
            }
          },
          parallel: true,
          cache: true,
          sourceMap: true
        }
      ]
    }
  ])
})
