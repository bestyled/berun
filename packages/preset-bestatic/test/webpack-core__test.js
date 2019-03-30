import presetReact from '@berun/preset-react'
import { presetBeStatic } from '../src'
const berun_js = require('@berun/berun')

test('Gets Webpack core configuration', () => {
  const berun = berun_js(presetReact)
  berun.options.cmd = 'test:static'
  berun.use(presetBeStatic)

  expect(berun.webpack.entry('main').values()).toEqual([
    '/Volumes/DATA/projects/berun/node_modules/react-dev-utils/webpackHotDevClient.js',
    '/Volumes/DATA/projects/berun/packages/bestatic-core/dist/entry_browser.js'
  ])
})

test('Gets Webpack production core configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berun_js(presetReact)
  berun.options.cmd = 'test:static'
  berun.use(presetBeStatic)

  expect(berun.webpack.entry('main').values()).toEqual([
    '/Volumes/DATA/projects/berun/packages/bestatic-core/dist/entry_ssr.js'
  ])
})
