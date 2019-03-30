import { validate } from 'webpack'
import { Config } from '..'
import util from 'util'

class StringifyPlugin {
  constructor(...args) {
    this.values = args
  }

  apply() {
    return JSON.stringify(this.values)
  }
}

test('is ChainedMap', () => {
  const config = new Config()

  config.set('a', 'alpha')

  expect(config.store.get('a')).toBe('alpha')
})

test('shorthand methods', () => {
  const config = new Config()
  const obj = {}

  config.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(config[method]('alpha')).toBe(config)
  })

  expect(config.entries()).toEqual(obj)
})

test('node', () => {
  const config = new Config()
  const instance = config.node
    .set('__dirname', 'mock')
    .set('__filename', 'mock')
    .end()

  expect(instance).toBe(config)
  expect(config.node.entries()).toEqual({
    __dirname: 'mock',
    __filename: 'mock'
  })
})

test('entry', () => {
  const config = new Config()

  config
    .entry('index')
    .add('babel-polyfill')
    .add('src/index.js')

  expect(config.entryPoints.has('index')).toBe(true)
  expect(config.entryPoints.get('index').values()).toEqual([
    'babel-polyfill',
    'src/index.js'
  ])
})

test('plugin empty', () => {
  const config = new Config()
  const instance = config
    .plugin('stringify')
    .use(StringifyPlugin)
    .end()

  expect(instance).toBe(config)
  expect(config.plugins.has('stringify')).toBe(true)
  expect(config.plugins.get('stringify').get('args')).toEqual([])
})

test('plugin with args', () => {
  const config = new Config()

  config.plugin('stringify').use(StringifyPlugin, ['alpha', 'beta'])

  expect(config.plugins.has('stringify')).toBe(true)
  expect(config.plugins.get('stringify').get('args')).toEqual(['alpha', 'beta'])
})

test('toConfig empty', () => {
  const config = new Config()

  expect(config.toConfig()).toEqual({})
})

test('toConfig with values', () => {
  const config = new Config()

  config.output
    .path('build')
    .end()
    .mode('development')
    .node.set('__dirname', 'mock')
    .end()
    .optimization.nodeEnv('PRODUCTION')
    .end()
    .target('node')
    .plugin('stringify')
    .use(StringifyPlugin)
    .end()
    .module.defaultRule('inline')
    .use('banner')
    .loader('banner-loader')
    .options({ prefix: 'banner-prefix.txt' })
    .end()
    .end()
    .rule('compile')
    .include.add('alpha')
    .add('beta')
    .end()
    .exclude.add('alpha')
    .add('beta')
    .end()
    .post()
    .pre()
    .test(/\.js$/)
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] })

  expect(config.toConfig()).toEqual({
    mode: 'development',
    node: {
      __dirname: 'mock'
    },
    optimization: {
      nodeEnv: 'PRODUCTION'
    },
    output: {
      path: 'build'
    },
    target: 'node',
    plugins: [new StringifyPlugin()],
    module: {
      defaultRules: [
        {
          use: [
            {
              loader: 'banner-loader',
              options: { prefix: 'banner-prefix.txt' }
            }
          ]
        }
      ],
      rules: [
        {
          include: ['alpha', 'beta'],
          exclude: ['alpha', 'beta'],
          enforce: 'pre',
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: { presets: ['alpha'] }
            }
          ]
        }
      ]
    }
  })
})

test('validate empty', () => {
  const config = new Config()

  const errors = validate(config.toConfig())

  expect(errors.length).toBe(0)
})

test('validate with entry', () => {
  const config = new Config()

  config.entry('index').add('src/index.js')

  const errors = validate(config.toConfig())

  expect(errors.length).toBe(0)
})

test('validate with values', () => {
  const config = new Config()

  config
    .entry('index')
    .add('babel-polyfill')
    .add('src/index.js')
    .end()
    .output.path('/build')
    .end()
    .mode('development')
    .optimization.nodeEnv('PRODUCTION')
    .end()
    .node.set('__dirname', 'mock')
    .end()
    .target('node')
    .plugin('stringify')
    .use(StringifyPlugin)
    .end()
    .module.rule('compile')
    .include.add('alpha')
    .add('beta')
    .end()
    .exclude.add('alpha')
    .add('beta')
    .end()
    .sideEffects(false)
    .post()
    .pre()
    .test(/\.js$/)
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] })
})

test('toString', () => {
  const config = new Config()

  config.module
    .rule('alpha')
    .oneOf('beta')
    .use('babel')
    .loader('babel-loader')

  class FooPlugin {}
  FooPlugin.__expression = `require('foo-plugin')`

  config
    .plugin('gamma')
    .use(FooPlugin)
    .end()
    .plugin('delta')
    .use(class BarPlugin {}, ['bar'])
    .end()
    .plugin('epsilon')
    .use(class BazPlugin {}, [{ n: 1 }, [2, 3]])

  expect(config.toString().trim()).toBe(
    `
{
  module: {
    rules: [
      /* config.module.rule('alpha') */
      {
        oneOf: [
          /* config.module.rule('alpha').oneOf('beta') */
          {
            use: [
              /* config.module.rule('alpha').oneOf('beta').use('babel') */
              {
                loader: 'babel-loader'
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    /* config.plugin('gamma') */
    new (require('foo-plugin'))(),
    /* config.plugin('delta') */
    new BarPlugin(
      'bar'
    ),
    /* config.plugin('epsilon') */
    new BazPlugin(
      {
        n: 1
      },
      [
        2,
        3
      ]
    )
  ]
}
`.trim()
  )
})

test('toString for functions with custom expression', () => {
  const fn = function foo() {}
  fn.__expression = `require('foo')`

  const config = new Config()

  config.module.rule('alpha').include.add(fn)

  expect(config.toString().trim()).toBe(
    `
{
  module: {
    rules: [
      /* config.module.rule('alpha') */
      {
        include: [
          require('foo')
        ]
      }
    ]
  }
}
`.trim()
  )
})

test('toString with custom prefix', () => {
  const config = new Config()

  config.plugin('foo').use(class TestPlugin {})

  expect(config.toString({ configPrefix: 'berun.webpack' }).trim()).toBe(
    `
{
  plugins: [
    /* berun.webpack.plugin('foo') */
    new TestPlugin()
  ]
}
`.trim()
  )
})

test('static Config.toString', () => {
  const config = new Config()

  config.plugin('foo').use(class TestPlugin {})

  expect(
    Config.toString(
      Object.assign(config.toConfig(), {
        module: {
          defaultRules: [
            {
              use: [
                {
                  loader: 'banner-loader',
                  options: { prefix: 'banner-prefix.txt' }
                }
              ]
            }
          ]
        }
      })
    ).trim()
  ).toMatch(
    `
{
  plugins: [
    /* config.plugin('foo') */
    new TestPlugin()
  ],
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: {
              prefix: 'banner-prefix.txt'
            }
          }
        ]
      }
    ]
  }
}
`.trim()
  )
})
