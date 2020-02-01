import { join } from 'path'
import { Webpack } from '@berun/fluent-webpack'
import BeRun from '../src/berun'

test('initializes with no arguments', () => {
  expect(() => new BeRun()).not.toThrow()
})

test('initializes with options', () => {
  expect(() => new BeRun({ testing: true })).not.toThrow()
})

test('initialization stores options', () => {
  const options = { alpha: 'a', beta: 'b', gamma: 'c' }
  const api = new BeRun(options)

  expect(api.options.alpha).toBe(options.alpha)
  expect(api.options.beta).toBe(options.beta)
  expect(api.options.gamma).toBe(options.gamma)
})

test('options.root', () => {
  const api = new BeRun()

  expect(api.options.root).toBe(process.cwd())
  api.options.root = './alpha'
  expect(api.options.root).toBe(join(process.cwd(), 'alpha'))
  api.options.root = '/alpha'
  expect(api.options.root).toBe('/alpha')
})

test('creates an instance of @berun/berun', () => {
  expect(typeof new BeRun().use(Webpack).webpack.toConfig).toBe('function')
})

test('middleware receives API instance', () => {
  const api = new BeRun()

  api.use(n => expect(n).toBe(api))
})

test('middleware receives no default options', () => {
  const api = new BeRun()

  api.use((api, options) => {
    expect(options).toBe(undefined)
  })
})

test('middleware receives options parameter', () => {
  const api = new BeRun()
  const defaults = { alpha: 'a', beta: 'b', gamma: 'c' }

  api.use((api, options) => {
    expect(options).toEqual(defaults)
  }, defaults)
})

test('import middleware for use', async () => {
  const api = new BeRun({ root: __dirname }).use(Webpack)

  api.use(['fixtures/middleware'])
  expect(api.webpack.toConfig()).not.toEqual({})
})

test('creates a webpack config', () => {
  const api = new BeRun().use(Webpack)

  api.use(api => {
    api.webpack.module.rule('compile').test(api.regexFromExtensions(['js']))
  })

  expect(api.webpack.toConfig()).not.toEqual({})
})

test('regexFromExtensions', () => {
  const api = new BeRun()

  expect(String(api.regexFromExtensions(['js']))).toBe('/\\.js$/')
  expect(String(api.regexFromExtensions(['js', 'css']))).toBe('/\\.(js|css)$/')
  expect(String(api.regexFromExtensions(['worker.js', 'worker.jsx']))).toBe(
    '/\\.(worker\\.js|worker\\.jsx)$/'
  )
})
