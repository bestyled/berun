import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetBeStatic from '../src'

test('Gets Webpack core configuration', () => {
  const berun = berunJs(presetReact)
  berun.options.cmd = 'test:static'
  berun.use(presetBeStatic)

  expect(berun.webpack.entry('main').values()).toEqual([
    '/Volumes/DATA/projects/berun/node_modules/react-dev-utils/webpackHotDevClient.js',
    '/Volumes/DATA/projects/berun/packages/bestatic-core/src/entry_browser.jsx'
  ])
})

test('Gets Webpack production core configuration', () => {
  process.env.NODE_ENV = 'production'
  const berun = berunJs(presetReact)
  berun.options.cmd = 'test:static'
  berun.use(presetBeStatic)

  expect(berun.webpack.entry('main').values()).toEqual([
    '/Volumes/DATA/projects/berun/packages/bestatic-core/src/entry_ssr.jsx'
  ])
})
