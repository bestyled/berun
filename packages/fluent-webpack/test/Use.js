import { Use } from '..'

test('is Chainable', () => {
  const parent = { parent: true }
  const use = new Use(parent)

  expect(use.end()).toBe(parent)
})

test('shorthand methods', () => {
  const use = new Use()
  const obj = {}

  use.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(use[method]('alpha')).toBe(use)
  })

  expect(use.entries()).toEqual(obj)
})

test('tap', () => {
  const use = new Use()

  use.loader('babel-loader').options({ presets: ['alpha'] })

  use.tap(options => {
    expect(options).toEqual({ presets: ['alpha'] })
    return { presets: ['beta'] }
  })

  expect(use.store.get('options')).toEqual({ presets: ['beta'] })
})
