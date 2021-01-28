import { Webpack } from '@berun/fluent-webpack'
import { create as berunJs } from '@berun/berun'
import mainEntryEnvKey from '../src'

test('Sets Webpack', () => {
  const berun = berunJs(Webpack)

  berun.webpack.entry('main').add('src/index.ts').end()

  expect(berun.webpack.toConfig()).toEqual({
    entry: {
      main: ['src/index.ts']
    }
  })

  process.env.ENVKEY =
    'wYv78UmHsfEu6jSqMZrU-3w1kwyF35nRYwsAJ-env-staging.envkey.com'

  berun.use(mainEntryEnvKey)

  expect(process.env.TEST).toBe('it')
  expect(process.env.TEST_2).toBe('works!')

  expect(berun.options.env.raw.TEST).toBe('it')
  expect(berun.options.env.raw.TEST_2).toBe('works!')
})
