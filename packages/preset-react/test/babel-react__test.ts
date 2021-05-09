import { create as berunJs } from '@berun/berun'
import preset from '../src'

test('Gets Babel core configuration', () => {
  const berun = berunJs(preset)

  expect(berun.babel.toConfig()).toEqual({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: false,
    sourceType: 'unambiguous'
  })
})
