import { TdxConfig } from '../src'

interface $IFluent {
  $fluent: { store: {}; shorthands: string[] }
  entries: () => {}
  set: (key: string, value: any) => this
  clear: () => this
  delete: (key: string) => this
  has: (key: string) => boolean
}

class StringifyPluginClass {
  values: any

  constructor(...args) {
    this.values = args
  }

  apply() {
    return JSON.stringify(this.values)
  }
}

const StringifyPlugin = options => {
  return new StringifyPluginClass(options)
}

test('is Fluent', () => {
  const parent = { parent: true }
  const tdx = new TdxConfig(parent as any)

  expect(tdx.end()).toBe(parent)
})

test('plugins with name', () => {
  const tdx = new TdxConfig()

  const instance = tdx
    .plugin('remark-images')
    .end()
    .plugin('remark-autolink-headings')
    .end()
    .plugin('remark-emoji', 'remark-emoji', { padSpaceAfter: true })
    .end()

  expect(instance).toBe(tdx)

  expect(tdx.mdPlugins.get('remark-autolink-headings').name).toBe(
    'remark-autolink-headings'
  )
  expect(tdx.mdPlugins.get('remark-images').name).toBe('remark-images')
  expect(tdx.mdPlugins.get('remark-emoji').name).toBe('remark-emoji')
  expect(tdx.mdPlugins.get('remark-emoji').get('options').padSpaceAfter).toBe(
    true
  )
})

test('toConfig empty', () => {
  const tdx = new TdxConfig()

  expect(tdx.toConfig()).toEqual({})
})

test('toConfig with fluent', () => {
  const tdx = new TdxConfig()

  const instance = tdx
    .plugin('remark-images')
    .end()
    .plugin('remark-autolink-headings')
    .end()
    .plugin('remark-emoji')
    .tap(() => ({ padSpaceAfter: true }))
    .end()
    .hast('hast-plugin')
    .end()

  const result = {
    mdPlugins: [
      'remark-images',
      'remark-autolink-headings',
      ['remark-emoji', { padSpaceAfter: true }]
    ],
    hastPlugins: ['hast-plugin']
  }

  expect(instance).toBe(tdx)
  expect(tdx.toConfig()).toEqual(result)
})

test('toConfig with merge', () => {
  const tdx = new TdxConfig()

  const config1 = {
    mdPlugins: {
      images: { plugin: 'remark-images' },
      autolinkHeadings: { plugin: 'remark-autolink-headings' }
    }
  }

  const config2 = {
    mdPlugins: {
      images: { plugin: 'remark-images', options: { replaced: true } },
      emoji: { plugin: 'remark-emoji', options: { padSpaceAfter: true } }
    }
  }

  const instance = tdx.merge(config1).merge(config2)

  const result = {
    mdPlugins: [
      ['remark-images', { replaced: true }],
      'remark-autolink-headings',
      ['remark-emoji', { padSpaceAfter: true }]
    ]
  }

  expect(instance).toBe(tdx)
  expect(tdx.toConfig()).toEqual(result)
})

test('plugin with function', () => {
  const tdx = new TdxConfig()

  const plugin = tdx
    .plugin('stringify', StringifyPlugin)
    .end()
    .hast('stringify', StringifyPlugin, { spacer: true })

  expect(plugin.get('plugin')).toBe(StringifyPlugin)
  expect(plugin.get('options')).toEqual({ spacer: true })
  const initialized = plugin.toConfig()

  expect(initialized[0](initialized[1]) instanceof StringifyPluginClass).toBe(
    true
  )

  expect(initialized[0](initialized[1]).apply()).toBe(
    JSON.stringify([{ spacer: true }])
  )
})
