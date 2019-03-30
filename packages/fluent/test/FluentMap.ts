import { FluentMap, FluentSet, FluentValue, fluent } from '../src'
import { $FluentAdmin } from '../src/FluentMap'

interface $IFluent {
  $fluent: $FluentAdmin
  set: (key: string, value: any) => this
  clear: () => this
  delete: (key: string) => this
  has: (key: string) => boolean
}

class FluentDecoratedTestClass extends FluentMap<any> {
  @fluent
  item3 = new FluentMap(this)

  @fluent
  item1: (value: string) => this

  @fluent
  item2: (value: boolean) => this

  constructor(parent: any, name?: string) {
    super(parent, name)
    this.extendfluent()
  }
}

export class FluentValuePropertiedClass<PARENT> extends FluentMap<PARENT> {
  extends = new FluentSet(this)
  rulesDirectory = new FluentSet(this)
  rules = new FluentMap(this)
  jsRules = new FluentMap(this)
  defaultSeverity = FluentValue<this, string>() // prumary format
  linterOptions = FluentValue(this, {}) // alternative format

  constructor(parent, name?: string) {
    super(parent, name)
    this.extendfluent()
  }
}

test('@fluent decorated fields', () => {
  const parent = { parent: true }
  const test = new FluentDecoratedTestClass(parent as any)

  const instance = test.item1('test').item2(true)

  const result = {
    item1: 'test',
    item2: true
  }

  expect(instance).toBe(test)
  expect(test.toConfig()).toEqual(result)
})

test('FluentValue with toConfig on property fields', () => {
  const parent = { parent: true }
  const test = new FluentValuePropertiedClass(parent as any)
  const instance = test.defaultSeverity('test').linterOptions({ test: true })

  const result = {
    defaultSeverity: 'test',
    linterOptions: { test: true }
  }

  expect(instance).toBe(test)
  expect(test.toConfig()).toEqual(result)
})

test('FluentValue with Merge on property fields', () => {
  const parent = { parent: true }
  const test = new FluentValuePropertiedClass(parent as any)

  const config1 = {
    root: false,

    parser: 'babel-eslint',

    plugins: ['import', 'flowtype'],

    env: {
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
      node: true
    },

    rules: {
      'array-callback-return': 'warn'
    }
  }

  const config2 = {
    root: true,

    plugins: ['jsx-a11y', 'react'],

    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        generators: true,
        experimentalObjectRestSpread: true
      }
    },

    rules: {
      'default-case': ['warn', { commentPattern: '^no default$' }]
    }
  }

  const instance = test.merge(config1).merge(config2)

  const result = {
    root: true,

    parser: 'babel-eslint',

    plugins: ['import', 'flowtype', 'jsx-a11y', 'react'],

    env: {
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
      node: true
    },

    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        generators: true,
        experimentalObjectRestSpread: true
      }
    },

    rules: {
      'array-callback-return': 'warn',
      'default-case': ['warn', { commentPattern: '^no default$' }]
    }
  }

  expect(instance).toBe(test)
  expect(test.toConfig()).toEqual(result)
})

test('is Chainable', () => {
  const parent = { parent: true }
  const map = new FluentMap(parent)

  expect(map.end()).toBe(parent)
})

test('creates a backing Map', () => {
  const map = (new FluentMap() as any) as $IFluent

  expect(map.$fluent.store instanceof Map).toBe(true)
})

test('set', () => {
  const map = (new FluentMap() as any) as $IFluent

  expect(map.set('a', 'alpha')).toBe(map)
  expect(map.$fluent.store.get('a')).toBe('alpha')
})

test('get', () => {
  const map = new FluentMap()

  expect(map.set('a', 'alpha')).toBe(map)
  expect(map.get('a')).toBe('alpha')
})

test('clear', () => {
  const map = (new FluentMap() as any) as $IFluent

  map.set('a', 'alpha')
  map.set('b', 'beta')
  map.set('c', 'gamma')

  expect(map.$fluent.store.size).toBe(3)
  expect(map.clear()).toBe(map)
  expect(map.$fluent.store.size).toBe(0)
})

test('delete', () => {
  const map = (new FluentMap() as any) as $IFluent

  map.set('a', 'alpha')
  map.set('b', 'beta')
  map.set('c', 'gamma')

  expect(map.delete('b')).toBe(map)
  expect(map.$fluent.store.size).toBe(2)
  expect(map.$fluent.store.has('b')).toBe(false)
})

test('has', () => {
  const map = (new FluentMap() as any) as $IFluent

  map.set('a', 'alpha')
  map.set('b', 'beta')
  map.set('c', 'gamma')

  expect(map.has('b')).toBe(true)
  expect(map.has('d')).toBe(false)
  expect(map.has('b')).toBe(map.$fluent.store.has('b'))
})

test('values', () => {
  const map = new FluentMap()

  map.set('a', 'alpha')
  map.set('b', 'beta')
  map.set('c', 'gamma')

  expect(map.values()).toEqual(['alpha', 'beta', 'gamma'])
})

test('entries with values', () => {
  const map = new FluentMap()

  map.set('a', 'alpha')
  map.set('b', 'beta')
  map.set('c', 'gamma')

  expect(map.entries()).toEqual({ a: 'alpha', b: 'beta', c: 'gamma' })
})

test('entries with no values', () => {
  const map = new FluentMap()

  expect(map.entries()).toBe(undefined)
})

test('merge with no values', () => {
  const map = new FluentMap()
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' }

  expect(map.merge(obj)).toBe(map)
  expect(map.entries()).toEqual(obj)
})

test('merge with existing values', () => {
  const map = new FluentMap()
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' }

  map.set('d', 'delta')

  expect(map.merge(obj)).toBe(map)
  expect(map.entries()).toEqual({
    a: 'alpha',
    b: 'beta',
    c: 'gamma',
    d: 'delta'
  })
})

test('merge with overriding values', () => {
  const map = new FluentMap()
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' }

  map.set('b', 'delta')

  expect(map.merge(obj)).toBe(map)
  expect(map.entries()).toEqual({ a: 'alpha', b: 'beta', c: 'gamma' })
})

test('merge with omitting keys', () => {
  const map = new FluentMap()
  const obj = { a: 'alpha', b: 'beta', c: 'gamma' }

  map.merge(obj, ['b'])

  expect(map.entries()).toEqual({ a: 'alpha', c: 'gamma' })
})

test('when true', () => {
  const map = new FluentMap()
  const right = instance => {
    expect(instance).toBe(map)
    instance.set('alpha', 'a')
  }
  const left = instance => {
    instance.set('beta', 'b')
  }

  expect(map.when(true, right, left)).toBe(map)
  expect(map.has('alpha')).toBe(true)
  expect(map.has('beta')).toBe(false)
})

test('when false', () => {
  const map = new FluentMap()
  const right = instance => {
    instance.set('alpha', 'a')
  }
  const left = instance => {
    expect(instance).toBe(map)
    instance.set('beta', 'b')
  }

  expect(map.when(false, right, left)).toBe(map)
  expect(map.has('alpha')).toBe(false)
  expect(map.has('beta')).toBe(true)
})
