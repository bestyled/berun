import { JestConfig as Jest } from '../src'

interface $IFluent {
  $fluent: { store: {}; shorthands: string[] }
  entries: () => {}
  set: (key: string, value: any) => this
  clear: () => this
  delete: (key: string) => this
  has: (key: string) => boolean
}

test('is Chainable', () => {
  const parent = { parent: true }
  const jest = new Jest(parent)

  expect(jest.end()).toBe(parent)
})

test('shorthand methods', () => {
  const jest = (new Jest() as any) as $IFluent
  const obj = {}

  jest.$fluent.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(jest[method]('alpha')).toBe(jest)
  })

  expect(jest.entries()).toEqual(obj)
})

test('sets methods', () => {
  const jest = new Jest()
  const instance = jest.collectCoverageFrom
    .add('src/**/*.{js,jsx,mjs}')
    .end()
    .setupFiles.add(
      '/Volumes/DATA/projects/berun/packages/runner-web-polyfills/src/polyfills.ts'
    )
    .end()
    .testMatch.add('**/__tests__/**/*.{js,jsx,mjs}')
    .add('**/?(*.)(spec|test).{js,jsx,mjs}')
    .end()

  expect(instance).toBe(jest)
})

test('transform with name', () => {
  const jest = new Jest()
  const instance = jest.transform('babelJest').end()
  expect(instance).toBe(jest)
  expect(jest.transforms.get('babelJest').name).toBe('babelJest')
})

test('toConfig empty', () => {
  const jest = new Jest()

  expect(jest.toConfig()).toEqual({})
})

test('toConfig with merge', () => {
  const jest = new Jest()

  const obj = {
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    setupFiles: [
      '/Volumes/DATA/projects/berun/packages/runner-web-polyfills/src/polyfills.ts'
    ],
    testMatch: [
      '(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
      '**/__tests__/**/*.{js,jsx,mjs}',
      '**/?(*.)(spec|test).{js,jsx,mjs}'
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost'
  }

  const instance = jest.merge(obj)

  expect(instance).toBe(jest)
  expect(jest.toConfig()).toEqual(obj)
})
