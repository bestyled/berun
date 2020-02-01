import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetMdx from '../src'

test('Gets Webpack optimization configuration', () => {
  const berun = berunJs(presetReact)
  berun.use(presetMdx)

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
  const berun = berunJs(presetReact)
  berun.use(presetMdx)

  expect(berun.webpack.optimization.entries()).toEqual({
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: true,
    minimize: true
  })
})
