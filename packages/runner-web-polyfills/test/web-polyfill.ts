import { Webpack } from '@berun/fluent-webpack'
import { create as berunJs } from '@berun/berun'
import mainEntryPolyfills, { srcPolyfills } from '../src'

test('Prepends src file name to webpack.entry.main. ', () => {
  const berun = berunJs(Webpack)

  berun.webpack
    .entry('main')
    .add('src/index.ts')
    .end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.ts']
    }
  })

  berun.use(mainEntryPolyfills)

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: [require.resolve('../src/polyfills.ts'), 'src/index.ts']
    }
  })
})

test('Prepends src file name with empty options object ', () => {
  const berun = berunJs(Webpack)

  berun.webpack
    .entry('main')
    .add('src/index.ts')
    .end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.ts']
    }
  })

  berun.use(mainEntryPolyfills, {})

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: [require.resolve('../src/polyfills.ts'), 'src/index.ts']
    }
  })
})

test('Prepends src file name with options ignored ', () => {
  const berun = berunJs(Webpack)

  berun.webpack
    .entry('main')
    .add('src/index.ts')
    .end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.ts']
    }
  })

  berun.use(mainEntryPolyfills, { ignore: 'me' })

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: [require.resolve('../src/polyfills.ts'), 'src/index.ts']
    }
  })
})

test('Gets src file', () => {
  const src = require('fs').readFileSync(srcPolyfills, 'utf-8')
  expect(src).toMatch("require('whatwg-fetch')")
})

test('Compiles src file', () => {
  expect(() => require(srcPolyfills)).not.toThrow()

  /* must use whatwg-fetch 2.0.4 not 3.0.0 to avoid self not defined error */
})
