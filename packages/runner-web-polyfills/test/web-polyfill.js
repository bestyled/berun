import { mainEntryPolyfills, src_polyfills } from '../src'

const { Webpack } = require('@berun/fluent-webpack')
const berun_js = require('@berun/berun')

test('Prepends src file name to webpack.entry.main. ', () => {
  const berun = berun_js(Webpack)

  berun.webpack
    .entry('main')
    .add('src/index.js')
    .end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.js']
    }
  })

  berun.use(mainEntryPolyfills)

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: [require.resolve('../src/polyfills.js'), 'src/index.js']
    }
  })
})

test('Prepends src file name with empty options object ', () => {
  const berun = berun_js(Webpack)

  berun.webpack
    .entry('main')
    .add('src/index.js')
    .end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.js']
    }
  })

  berun.use(mainEntryPolyfills, {})

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: [require.resolve('../src/polyfills.js'), 'src/index.js']
    }
  })
})

test('Prepends src file name with options ignored ', () => {
  const berun = berun_js(Webpack)

  berun.webpack
    .entry('main')
    .add('src/index.js')
    .end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.js']
    }
  })

  berun.use(mainEntryPolyfills, { ignore: 'me' })

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: [require.resolve('../src/polyfills.js'), 'src/index.js']
    }
  })
})

test('Gets src file', () => {
  const src = require('fs').readFileSync(src_polyfills, 'utf-8')
  expect(src).toMatch("require('whatwg-fetch')")
})

test('Compiles src file', () => {
  expect(() => require(src_polyfills)).not.toThrow()
})
