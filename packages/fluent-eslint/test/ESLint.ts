import { ESLintConfig as ESLint } from '../src'

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
  const eslint = new ESLint(parent)

  expect(eslint.end()).toBe(parent)
})

test('shorthand methods', () => {
  const eslint = (new ESLint() as any) as $IFluent
  const obj = {}

  eslint.$fluent.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(eslint[method]('alpha')).toBe(eslint)
  })

  expect(eslint.entries()).toEqual(obj)
})

test('sets methods', () => {
  const eslint = new ESLint()
  const instance = eslint.plugins
    .add('import')
    .add('flowtype')
    .end()

  expect(instance).toBe(eslint)
})

test('toConfig empty', () => {
  const eslint = new ESLint()

  expect(eslint.toConfig()).toEqual({})
})

test('toConfig with fluent', () => {
  const eslint = new ESLint()

  const instance = eslint
    .root(true)
    .parser('babel-eslint')
    .plugins.add('import')
    .add('flowtype')
    .add('jsx-a11y')
    .add('react')
    .end()
    .env({
      browser: true,
      commonjs: true,
      es6: true,
      jest: true,
      node: true
    })
    .parserOptions({
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        generators: true,
        experimentalObjectRestSpread: true
      }
    })
    .rules.set('array-callback-return', 'warn')
    .set('default-case', ['warn', { commentPattern: '^no default$' }])
    .end()

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

  expect(instance).toBe(eslint)
  expect(eslint.toConfig()).toEqual(result)
})

test('toConfig with merge', () => {
  const eslint = new ESLint()

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

  const instance = eslint.merge(config1).merge(config2)

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

  expect(instance).toBe(eslint)
  expect(eslint.toConfig()).toEqual(result)
})
