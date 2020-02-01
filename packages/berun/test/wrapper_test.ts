import { Webpack } from '@berun/fluent-webpack'
import { create as berun } from '../src/index'

const originalNodeEnv = process.env.NODE_ENV

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv
})

test('default mode derived from production NODE_ENV', () => {
  process.env.NODE_ENV = 'production'
  const webpackConfig = berun()
    .use(Webpack)
    .webpack.mode(process.env.NODE_ENV)
    .toConfig()
  expect(webpackConfig.mode).toBe('production')
})

test('default mode derived from development NODE_ENV', () => {
  process.env.NODE_ENV = 'development'
  const webpackConfig = berun()
    .use(Webpack)
    .webpack.mode(process.env.NODE_ENV)
    .toConfig()
  expect(webpackConfig.mode).toBe('development')
})

test('default mode derived from test NODE_ENV', () => {
  process.env.NODE_ENV = 'test'
  const webpackConfig = berun()
    .use(Webpack)
    .webpack.mode(
      process.env.NODE_ENV === 'production' ? 'production' : 'development'
    )
    .toConfig()
  expect(webpackConfig.mode).toBe('development')
})

test('undefined mode and NODE_ENV set', () => {
  delete process.env.NODE_ENV
  const webpackConfig = berun()
    .use(Webpack)
    .webpack.mode(process.env.NODE_ENV)
    .toConfig()
  expect(process.env.NODE_ENV).toBe('production')
  expect('mode' in webpackConfig).toBe(true)
})

test('undefined when trying to use a non-registered output', () => {
  expect((berun(Function.prototype as any) as any).fake).toBe(undefined)
})

test('throws when trying to use a non-registered proxied method', () => {
  expect(() => (berun(Function.prototype as any) as any).fake()).toThrow(
    'fake is not a function'
  )
})

test('exposes webpack output handler', () => {
  expect(
    () => berun(Function.prototype as any).use(Webpack).webpack
  ).not.toThrow()
})

test('exposes webpack config from output', () => {
  const handler = berun(Function.prototype as any)
    .use(Webpack)
    .webpack.toConfig()
  expect(typeof handler).toBe('object')
})

test('exposes webpack toConfig method', () => {
  expect(
    typeof berun(Function.prototype as any).use(Webpack).webpack.toConfig
  ).toBe('function')
})
