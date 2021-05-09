import { MdxConfig } from '../src'

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

const StringifyPlugin = (options) => {
  return new StringifyPluginClass(options)
}

test('is Fluent', () => {
  const parent = { parent: true }
  const mdx = new MdxConfig(parent as any)

  expect(mdx.end()).toBe(parent)
})

test('plugins with name', () => {
  const mdx = new MdxConfig()

  const instance = mdx
    .remark('remark-images')
    .end()
    .remark('remark-autolink-headings')
    .end()
    .remark('remark-emoji', 'remark-emoji', { padSpaceAfter: true })
    .end()

  expect(instance).toBe(mdx)

  expect(mdx.remarkPlugins.get('remark-autolink-headings').name).toBe(
    'remark-autolink-headings'
  )
  expect(mdx.remarkPlugins.get('remark-images').name).toBe('remark-images')
  expect(mdx.remarkPlugins.get('remark-emoji').name).toBe('remark-emoji')
  expect(
    mdx.remarkPlugins.get('remark-emoji').get('options').padSpaceAfter
  ).toBe(true)
})

test('toConfig empty', () => {
  const mdx = new MdxConfig()

  expect(mdx.toConfig()).toEqual({})
})

test('toConfig with fluent', () => {
  const mdx = new MdxConfig()

  const instance = mdx
    .remark('remark-images')
    .end()
    .remark('remark-autolink-headings')
    .end()
    .remark('remark-emoji')
    .tap(() => ({ padSpaceAfter: true }))
    .end()
    .rehype('hast-plugin')
    .end()

  const result = {
    remarkPlugins: [
      'remark-images',
      'remark-autolink-headings',
      ['remark-emoji', { padSpaceAfter: true }]
    ],
    rehypePlugins: ['hast-plugin']
  }

  expect(instance).toBe(mdx)
  expect(mdx.toConfig()).toEqual(result)
})

test('toConfig with merge', () => {
  const mdx = new MdxConfig()

  const config1 = {
    remarkPlugins: {
      images: { plugin: 'remark-images' },
      autolinkHeadings: { plugin: 'remark-autolink-headings' }
    }
  }

  const config2 = {
    remarkPlugins: {
      images: { plugin: 'remark-images', options: { replaced: true } },
      emoji: { plugin: 'remark-emoji', options: { padSpaceAfter: true } }
    }
  }

  const instance = mdx.merge(config1).merge(config2)

  const result = {
    remarkPlugins: [
      ['remark-images', { replaced: true }],
      'remark-autolink-headings',
      ['remark-emoji', { padSpaceAfter: true }]
    ]
  }

  expect(instance).toBe(mdx)
  expect(mdx.toConfig()).toEqual(result)
})

test('plugin with function', () => {
  const mdx = new MdxConfig()

  const plugin = mdx
    .remark('stringify', StringifyPlugin)
    .end()
    .rehype('stringify', StringifyPlugin, { spacer: true })

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
