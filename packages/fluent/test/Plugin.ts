import { Plugin } from '../src'

class StringifyPlugin {
  public values: any[]

  constructor(...args) {
    this.values = args
  }

  apply() {
    return JSON.stringify(this.values)
  }
}

test('is Chainable', () => {
  const parent = { parent: true }
  const plugin = new Plugin(parent)

  expect(plugin.end()).toBe(parent)
})

test('use', () => {
  const plugin = new Plugin()
  const instance = plugin.use(StringifyPlugin, ['alpha', 'beta'])

  expect(instance).toBe(plugin)
  expect(plugin.get('plugin')).toBe(StringifyPlugin)
  expect(plugin.get('args')).toEqual(['alpha', 'beta'])
})

test('tap', () => {
  const plugin = new Plugin()

  plugin.use(StringifyPlugin, ['alpha', 'beta'])

  const instance = plugin.tap(() => ['gamma', 'delta'])

  expect(instance).toBe(plugin)
  expect(plugin.get('args')).toEqual(['gamma', 'delta'])
})

test('init', () => {
  const plugin = new Plugin()

  plugin.use(StringifyPlugin)

  const instance = plugin.init((PLUGIN, args) => {
    expect(args).toEqual([])
    return new PLUGIN('gamma', 'delta')
  })

  const initialized = plugin.get('init')(
    plugin.get('plugin'),
    plugin.get('args')
  )

  expect(instance).toBe(plugin)
  expect(initialized instanceof StringifyPlugin).toBe(true)
  expect(initialized.values).toEqual(['gamma', 'delta'])
})

test('toConfig', () => {
  const plugin = new Plugin(null, 'gamma')

  plugin.use(StringifyPlugin, ['delta'])

  const initialized = plugin.toConfig()

  expect(initialized instanceof StringifyPlugin).toBe(true)
  expect(initialized.values).toEqual(['delta'])
  expect(initialized.__pluginName).toBe('gamma')
  expect(initialized.__pluginArgs).toEqual(['delta'])
  expect(initialized.__pluginConstructorName).toBe('StringifyPlugin')
})

test('toConfig with custom expression', () => {
  const plugin = new Plugin(null, 'gamma')

  class TestPlugin {
    public static __expression: any
  }
  TestPlugin.__expression = `require('my-plugin')`

  plugin.use(TestPlugin)

  const initialized = plugin.toConfig()

  expect(initialized.__pluginConstructorName).toBe(`(require('my-plugin'))`)
})
