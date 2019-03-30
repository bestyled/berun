import presetReact from '@berun/preset-react'
import { presetMdx } from '../src'
const berun_js = require('@berun/berun')

test('Gets Webpack optimization configuration', () => {
  const berun = berun_js(presetReact)
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
  const berun = berun_js(presetReact)
  berun.use(presetMdx)

  expect(berun.webpack.optimization.entries()).toEqual({
    splitChunks: {
      chunks: 'all',
      name: false
    },
    runtimeChunk: true
  })
})
