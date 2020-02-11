import { Resolve } from '../src'

class StringifyPlugin {
  public values: any

  constructor(...args) {
    this.values = args
  }

  apply() {
    return JSON.stringify(this.values)
  }
}

test('is Chainable', () => {
  const parent = { parent: true }
  const resolve = new Resolve(parent)

  expect(resolve.end()).toBe(parent)
})

test('shorthand methods', () => {
  const resolve = new Resolve()
  const obj = {}

  resolve.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(resolve[method]('alpha')).toBe(resolve)
  })

  expect(resolve.entries()).toEqual(obj)
})

test('sets methods', () => {
  const resolve = new Resolve()
  const instance = resolve.modules
    .add('src')
    .end()
    .extensions.add('.js')
    .end()

  expect(instance).toBe(resolve)
})

test('toConfig empty', () => {
  const resolve = new Resolve()

  expect(resolve.toConfig()).toEqual({})
})

test('toConfig with values', () => {
  const resolve = new Resolve()

  resolve.modules
    .add('src')
    .end()
    .extensions.add('.js')
    .end()
    .alias.set('React', 'src/react')

  expect(resolve.toConfig()).toEqual({
    modules: ['src'],
    extensions: ['.js'],
    alias: { React: 'src/react' }
  })
})

test('merge empty', () => {
  const resolve = new Resolve()
  const obj = {
    modules: ['src'],
    extensions: ['.js'],
    alias: { React: 'src/react' }
  }
  const instance = resolve.merge(obj)

  expect(instance).toBe(resolve)
  expect(resolve.toConfig()).toEqual(obj)
})

test('merge with values', () => {
  const resolve = new Resolve()

  resolve.modules
    .add('src')
    .end()
    .extensions.add('.js')
    .end()
    .alias.set('React', 'src/react')

  resolve.merge({
    modules: ['dist'],
    extensions: ['.jsx'],
    alias: { ReactDOM: 'src/react-dom' }
  })

  expect(resolve.toConfig()).toEqual({
    modules: ['src', 'dist'],
    extensions: ['.js', '.jsx'],
    alias: { React: 'src/react', ReactDOM: 'src/react-dom' }
  })
})

test('merge with omit', () => {
  const resolve = new Resolve()

  resolve.modules
    .add('src')
    .end()
    .extensions.add('.js')
    .end()
    .alias.set('React', 'src/react')

  resolve.merge(
    {
      modules: ['dist'],
      extensions: ['.jsx'],
      alias: { ReactDOM: 'src/react-dom' }
    },
    ['alias']
  )

  expect(resolve.toConfig()).toEqual({
    modules: ['src', 'dist'],
    extensions: ['.js', '.jsx'],
    alias: { React: 'src/react' }
  })
})

test('plugin with name', () => {
  const resolve = new Resolve()

  resolve.plugin('alpha')

  expect(resolve.plugins.get('alpha').name).toBe('alpha')
})

test('plugin empty', () => {
  const resolve = new Resolve()
  const instance = resolve
    .plugin('stringify')
    .use(StringifyPlugin)
    .end()

  expect(instance).toBe(resolve)
  expect(resolve.plugins.has('stringify')).toBe(true)
  expect(resolve.plugins.get('stringify').get('args')).toEqual([])
})

test('plugin with args', () => {
  const resolve = new Resolve()

  resolve.plugin('stringify').use(StringifyPlugin, ['alpha', 'beta'])

  expect(resolve.plugins.has('stringify')).toBe(true)
  expect(resolve.plugins.get('stringify').get('args')).toEqual([
    'alpha',
    'beta'
  ])
})
