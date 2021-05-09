import { create as berunJs } from '@berun/berun'
import presetReactBabel from '../src'

test('Gets Babel core configuration', () => {
  const berun = berunJs(presetReactBabel)

  expect(berun.babel.toConfig()).toEqual({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: false,
    sourceType: 'unambiguous'
  })
})
