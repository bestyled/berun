import presetReact from '@berun/preset-react'
import { create as berunJs } from '@berun/berun'
import presetMdx from '../src'

test('Gets Babel core configuration', () => {
  const berun = berunJs(presetReact)
  berun.use(presetMdx)

  expect(berun.babel.toConfig()).toEqual({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: false,
    sourceType: 'unambiguous'
  })
})
