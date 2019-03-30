import { BabelConfig } from '../src'

interface $IFluent {
  $fluent: { store: {}; shorthands: string[] }
  entries: () => {}
  set: (key: string, value: any) => this
  clear: () => this
  delete: (key: string) => this
  has: (key: string) => boolean
}

test('is Fluent', () => {
  const parent = { parent: true }
  const babel = new BabelConfig(parent as any)

  expect(babel.end()).toBe(parent)
})

test('shorthand methods', () => {
  const babel = (new BabelConfig() as any) as $IFluent
  const obj = {}

  babel.$fluent.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(babel[method]('alpha')).toBe(babel)
  })

  expect(babel.entries()).toEqual(obj)
})

test('transform with name', () => {
  const babel = new BabelConfig()

  const instance = babel
    .plugin('arrow-functions')
    .end()
    .plugin('literals')
    .end()
    .plugin('@babel/plugin-transform-react-jsx')
    .options({ pragma: 'React.createElement' })
    .end()

  expect(instance).toBe(babel)

  expect(babel.plugins.get('literals').name).toBe('literals')
  expect(babel.plugins.get('arrow-functions').name).toBe('arrow-functions')
  expect(babel.plugins.get('@babel/plugin-transform-react-jsx').name).toBe(
    '@babel/plugin-transform-react-jsx'
  )
  expect(
    babel.plugins.get('@babel/plugin-transform-react-jsx').get('options').pragma
  ).toBe('React.createElement')
})

test('toConfig empty', () => {
  const babel = new BabelConfig()

  expect(babel.toConfig()).toEqual({})
})

test('toConfig with fluent', () => {
  const babel = new BabelConfig()

  const instance = babel
    .babelrc(false)
    .env('development')
    .plugin('literals')
    .end()
    .root('src')
    .end()
    .plugin('arrow-functions')
    .end()
    .plugin('literals')
    .end()
    .plugin('@babel/plugin-transform-react-jsx')
    .options({ pragma: 'React.createElement' })
    .end()

  const result = {
    babelrc: false,
    env: {
      development: {
        root: 'src',
        plugins: ['literals']
      }
    },
    plugins: [
      'arrow-functions',
      'literals',
      ['@babel/plugin-transform-react-jsx', { pragma: 'React.createElement' }]
    ]
  }

  expect(instance).toBe(babel)
  expect(babel.toConfig()).toEqual(result)
})

test('toConfig with merge', () => {
  const babel = new BabelConfig()

  const config1 = {
    babelrc: false,
    plugins: ['arrow-functions', 'literals']
  }

  const config2 = {
    plugins: [
      ['arrow-functions', { replaced: true }],
      ['@babel/plugin-transform-react-jsx', { pragma: 'React.createElement' }]
    ]
  }

  const instance = babel.merge(config1).merge(config2)

  const result = {
    babelrc: false,
    plugins: [
      ['arrow-functions', { replaced: true }],
      'literals',
      ['@babel/plugin-transform-react-jsx', { pragma: 'React.createElement' }]
    ]
  }

  expect(instance).toBe(babel)
  expect(babel.toConfig()).toEqual(result)
})
