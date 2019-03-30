import presetReact from '@berun/preset-react'
import { presetMdx } from '../src'
const berun_js = require('@berun/berun')

test('Gets Babel core configuration', () => {
  const berun = berun_js(presetReact)
  berun.use(presetMdx)

  expect(berun.babel.toConfig()).toEqual({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: false
  })
})
