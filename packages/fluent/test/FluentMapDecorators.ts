import { FluentMap, FluentSet, FluentValue } from '../src'

class Transform<PARENT> extends FluentMap<PARENT> {
  test(test: RegExp | string) {
    return this.set('test', test instanceof RegExp ? test : new RegExp(test))
  }

  use(plugin = '') {
    return this.set('plugin', plugin)
  }

  merge(obj, omit = []) {
    if (!omit.includes('test') && 'test' in obj) {
      this.test(obj.test)
    }

    if (!omit.includes('plugin') && 'plugin' in obj) {
      this.use(obj.plugin)
    }

    return super.merge(obj, [...omit, 'test', 'plugin'])
  }
}

class Jest<PARENT> extends FluentMap<PARENT> {
  collectCoverageFrom = new FluentSet(this)

  setupFiles = new FluentSet(this)

  testMatch = new FluentSet(this)

  roots = new FluentSet(this)

  transformIgnorePatterns = new FluentSet(this)

  moduleFileExtensions = new FluentSet(this)

  moduleNameMapper = new FluentMap(this)

  transforms = new FluentMap(this)

  testEnvironment = FluentValue<this, any>()

  testURL = FluentValue<this, string>()

  rootDir = FluentValue<this, string>()

  constructor(parent?: PARENT, name?: string) {
    super(parent, name)
    this.extendfluent()
  }

  transform(name: string): Transform<this> {
    if (!this.transforms.has(name)) {
      this.transforms.set(name, new Transform(this, name))
    }

    return this.transforms.get(name)
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat('transforms')),
      this.clean({
        transform: this.transforms
          .values()
          .map(t => t.toConfig())
          .reduce((acc, t) => {
            acc[t.test.toString().replace(/^\/|\/$/g, '')] = t.plugin
            return acc
          }, {})
      })
    )
  }

  merge(obj, omit = []) {
    if (!omit.includes('transform') && 'transform' in obj) {
      Object.keys(obj.transform).forEach(name =>
        this.transform(name).merge(obj.transform[name])
      )
    }

    return super.merge(obj, [...omit, 'transform', 'transforms'])
  }
}

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
