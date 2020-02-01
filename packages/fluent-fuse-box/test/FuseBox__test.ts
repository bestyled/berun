import * as path from 'path'
import { FuseBoxConfig } from '../src'

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

test('is Chainable', () => {
  const parent = { parent: true }
  const tslint = new FuseBoxConfig(parent)

  expect(tslint.end()).toBe(parent)
})

test('shorthand methods', () => {
  const tslint = new FuseBoxConfig() as any
  const obj = {}

  tslint.$fluent.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(tslint[method]('alpha')).toBe(tslint)
  })

  expect(tslint.entries()).toEqual(obj)
})

test('toConfig empty', () => {
  const tslint = new FuseBoxConfig()

  expect(tslint.toConfig()).toEqual({})
})

test('plugin', () => {
  const fusebox = new FuseBoxConfig()

  const plugin = fusebox.plugin('Env').use(StringifyPlugin, ['development'])

  expect(plugin.get('plugin')).toBe(StringifyPlugin)
  expect(plugin.get('args')).toEqual(['development'])
  const initialized = plugin.toConfig()
  expect(initialized instanceof StringifyPluginClass).toBe(true)

  expect(initialized.apply()).toBe(JSON.stringify(['development']))
})

test('pluginset', () => {
  const fusebox = new FuseBoxConfig()

  const pluginset = fusebox
    .pluginset('Env')
    .plugin('Env1')
    .use(StringifyPlugin, ['development'])
    .end()

  expect(pluginset.plugin('Env1').get('plugin')).toBe(StringifyPlugin)
  expect(pluginset.plugin('Env1').get('args')).toEqual(['development'])
  const initialized = pluginset.toConfig()
  expect(Array.isArray(initialized)).toBe(true)
  expect(initialized[0] instanceof StringifyPluginClass).toBe(true)

  expect(initialized[0].apply()).toBe(JSON.stringify(['development']))

  const fuse = fusebox.toConfig() as any
  expect(Array.isArray(fuse.plugins)).toBe(true)
  expect(Array.isArray(fuse.plugins[0])).toBe(true)
  expect(fuse.plugins[0][0] instanceof StringifyPluginClass).toBe(true)

  expect(fuse.plugins[0][0].apply()).toBe(JSON.stringify(['development']))
})

test('toConfig with alias', () => {
  const fusebox = new FuseBoxConfig()

  const instance = fusebox.alias
    .set('@bestatic/config$', '~/config/bestatic.config.js')
    .end()

  expect(instance).toBe(fusebox)

  const initialized = fusebox.toConfig() as any
  expect(Object.keys(initialized)).toContain('alias')
  expect('@bestatic/config$' in initialized.alias).toBe(true)
  expect(initialized.alias['@bestatic/config$']).toBe(
    '~/config/bestatic.config.js'
  )
})

test('toConfig with plugin', () => {
  const fusebox = new FuseBoxConfig()

  const instance = fusebox
    .plugin('Env')
    .use(StringifyPlugin, ['development'])
    .end()

  expect(instance).toBe(fusebox)

  expect(instance.plugin('Env').get('plugin')).toBe(StringifyPlugin)
  expect(instance.plugin('Env').get('args')).toEqual(['development'])

  const initialized = fusebox.toConfig() as any
  expect(Object.keys(initialized)).toContain('plugins')
  expect(initialized.plugins[0] instanceof StringifyPluginClass).toBe(true)
  expect(initialized.plugins[0].apply()).toBe(JSON.stringify(['development']))
})

test('toConfig from fluent', () => {
  const fusebox = new FuseBoxConfig()

  const instance = fusebox
    .homeDir('/Volumes/data/mypath')
    .sourceMaps({ project: true, vendor: false })
    .hash(true)
    .cache(true)
    .output(path.join('targetDir', '$name.js'))
    .target('browser@es2015')
    .plugin('Env')
    .use(StringifyPlugin, ['development'])
    .end()
    .plugin('SVG')
    .use(StringifyPlugin)
    .end()
    .plugin('CSS')
    .use(StringifyPlugin)
    .end()
    .plugin('JSON')
    .use(StringifyPlugin)
    .end()
    .plugin('WebIndex')
    .use(StringifyPlugin, [
      {
        template: '/Volumes/data/src/index.html',
        path: '/'
      }
    ])
    .end()
    .plugin('Babel')
    .use(StringifyPlugin)
    .end()
    .plugin('Quantum')
    .use(StringifyPlugin, [{ removeExportsInterop: false, uglify: true }])
    .end()

  const expectedResult = {
    homeDir: '/Volumes/data/mypath',
    sourceMaps: { project: true, vendor: false },
    hash: true,
    cache: true,
    output: path.join('targetDir', '$name.js'),
    target: 'browser@es2015',
    plugins: [
      ['Env', 'StringifyPlugin', ['development']],
      ['SVG', 'StringifyPlugin', []],
      ['CSS', 'StringifyPlugin', []],
      ['JSON', 'StringifyPlugin', []],
      [
        'WebIndex',
        'StringifyPlugin',
        [
          {
            template: path.join('/Volumes/data/src', 'index.html'),
            path: '/'
          }
        ]
      ],
      ['Babel', 'StringifyPlugin', []],
      [
        'Quantum',
        'StringifyPlugin',
        [{ removeExportsInterop: false, uglify: true }]
      ]
    ]
  }

  expect(instance).toBe(fusebox)

  const actualResult = fusebox.toConfig() as any
  actualResult.plugins = actualResult.plugins.map(p => [
    p.__pluginName,
    p.__pluginConstructorName,
    p.__pluginArgs
  ])
  expect(actualResult).toEqual(expectedResult)
})

test('toConfig from merge', () => {
  const fusebox = new FuseBoxConfig()

  const config1 = {
    homeDir: '/Volumes/data/mypath',
    sourceMaps: { project: true, vendor: false },
    hash: false,
    plugin: {
      Env: { plugin: StringifyPlugin, args: ['development'] }
    }
  }

  const config2 = {
    hash: true,
    cache: true,
    output: path.join('targetDir', '$name.js'),
    target: 'browser@es2015',
    plugin: {
      SVG: { plugin: StringifyPlugin },
      CSS: { plugin: StringifyPlugin },
      JSON: { plugin: StringifyPlugin, args: [] },
      WebIndex: {
        plugin: StringifyPlugin,
        args: [
          {
            template: path.join('/Volumes/data/src', 'index.html'),
            path: '/'
          }
        ]
      },
      Babel: { plugin: StringifyPlugin },
      Quantum: {
        plugin: StringifyPlugin,
        args: [{ removeExportsInterop: false, uglify: true }]
      }
    }
  }

  const instance = fusebox.merge(config1).merge(config2)

  const expectedResult = {
    homeDir: '/Volumes/data/mypath',
    sourceMaps: { project: true, vendor: false },
    hash: true,
    cache: true,
    output: path.join('targetDir', '$name.js'),
    target: 'browser@es2015',
    plugins: [
      ['Env', 'StringifyPlugin', ['development']],
      ['SVG', 'StringifyPlugin', []],
      ['CSS', 'StringifyPlugin', []],
      ['JSON', 'StringifyPlugin', []],
      [
        'WebIndex',
        'StringifyPlugin',
        [
          {
            template: path.join('/Volumes/data/src', 'index.html'),
            path: '/'
          }
        ]
      ],
      ['Babel', 'StringifyPlugin', []],
      [
        'Quantum',
        'StringifyPlugin',
        [{ removeExportsInterop: false, uglify: true }]
      ]
    ]
  }

  expect(instance).toBe(fusebox)

  const actualResult = fusebox.toConfig() as any
  actualResult.plugins = actualResult.plugins.map(p => [
    p.__pluginName,
    p.__pluginConstructorName,
    p.__pluginArgs || []
  ])
  expect(actualResult).toEqual(expectedResult)
})

test('toBundles from fluent', () => {
  const fusebox = new FuseBoxConfig()

  const instance = fusebox
    .bundle('app')
    .instructions('> index.ts')
    .end()

  const expectedResult = {
    app: { instructions: '> index.ts' }
  }

  expect(instance).toBe(fusebox)
  expect(fusebox.toBundles()).toEqual(expectedResult)
})

test('toBundles with plugin', () => {
  const fusebox = new FuseBoxConfig()

  const instance = fusebox
    .bundle('app')
    .instructions('> index.ts')
    .plugin('Env')
    .use(StringifyPlugin, ['development'])
    .end()
    .end()

  const expectedResult = {
    app: {
      instructions: '> index.ts',
      plugins: [['Env', 'StringifyPlugin', ['development']]]
    }
  }

  expect(instance).toBe(fusebox)

  const actualResult = fusebox.toBundles() as any

  actualResult.app.plugins = actualResult.app.plugins.map(p => [
    p.__pluginName,
    p.__pluginConstructorName,
    p.__pluginArgs || []
  ])

  expect(actualResult).toEqual(expectedResult)

  expect(
    instance
      .bundle('app')
      .plugin('Env')
      .get('plugin')
  ).toBe(StringifyPlugin)
  expect(
    instance
      .bundle('app')
      .plugin('Env')
      .get('args')
  ).toEqual(['development'])

  const initialized = fusebox.toBundles() as any
  expect(Object.keys(initialized.app)).toContain('plugins')
  expect(initialized.app.plugins[0] instanceof StringifyPluginClass).toBe(true)
  expect(initialized.app.plugins[0].apply()).toBe(
    JSON.stringify(['development'])
  )
})
