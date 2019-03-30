import { Optimization } from '..'

class StringifyPlugin {
  constructor(...args) {
    this.values = args
  }

  apply() {
    return JSON.stringify(this.values)
  }
}

test('is Chainable', () => {
  const parent = { parent: true }
  const optimization = new Optimization(parent)

  expect(optimization.end()).toBe(parent)
})

test('shorthand methods', () => {
  const optimization = new Optimization()
  const obj = {}

  optimization.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(optimization[method]('alpha')).toBe(optimization)
  })

  expect(optimization.entries()).toEqual(obj)
})

test('minimizer plugin empty', () => {
  const optimization = new Optimization()
  const instance = optimization
    .minimizer('stringify')
    .use(StringifyPlugin)
    .end()

  expect(instance).toBe(optimization)
  expect(optimization.minimizers.has('stringify')).toBe(true)
  expect(optimization.minimizers.get('stringify').get('args')).toEqual([])
})

test('minimizer plugin with args', () => {
  const optimization = new Optimization()

  optimization.minimizer('stringify').use(StringifyPlugin, ['alpha', 'beta'])

  expect(optimization.minimizers.has('stringify')).toBe(true)
  expect(optimization.minimizers.get('stringify').get('args')).toEqual([
    'alpha',
    'beta'
  ])
})

test('optimization merge', () => {
  const optimization = new Optimization()
  const obj = {
    minimizer: {
      stringify: {
        plugin: StringifyPlugin,
        args: ['alpha', 'beta']
      }
    }
  }

  expect(optimization.merge(obj)).toBe(optimization)
  expect(optimization.minimizers.has('stringify')).toBe(true)
  expect(optimization.minimizers.get('stringify').get('args')).toEqual([
    'alpha',
    'beta'
  ])
})
