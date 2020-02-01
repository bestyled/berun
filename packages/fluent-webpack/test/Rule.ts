import { Rule } from '../src'

test('is Chainable', () => {
  const parent = { parent: true }
  const rule = new Rule(parent)

  expect(rule.end()).toBe(parent)
})

test('shorthand methods', () => {
  const rule = new Rule()
  const obj = {}

  rule.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(rule[method]('alpha')).toBe(rule)
  })

  expect(rule.entries()).toEqual(obj)
})

test('use', () => {
  const rule = new Rule()
  const instance = rule.use('babel').end()

  expect(instance).toBe(rule)
  expect(rule.uses.has('babel')).toBe(true)
})

test('oneOf', () => {
  const rule = new Rule()
  const instance = rule.oneOf('babel').end()

  expect(instance).toBe(rule)
  expect(rule.oneOfs.has('babel')).toBe(true)
})

test('pre', () => {
  const rule = new Rule()
  const instance = rule.pre()

  expect(instance).toBe(rule)
  expect(rule.get('enforce')).toEqual('pre')
})

test('post', () => {
  const rule = new Rule()
  const instance = rule.post()

  expect(instance).toBe(rule)
  expect(rule.get('enforce')).toEqual('post')
})

test('sets methods', () => {
  const rule = new Rule()
  const instance = rule.include
    .add('alpha')
    .add('beta')
    .end()
    .exclude.add('alpha')
    .add('beta')
    .end()

  expect(instance).toBe(rule)
  expect(rule.include.values()).toEqual(['alpha', 'beta'])
  expect(rule.exclude.values()).toEqual(['alpha', 'beta'])
})

test('toConfig empty', () => {
  const rule = new Rule()

  expect(rule.toConfig()).toEqual({})
})

test('toConfig with name', () => {
  const parent = new Rule(null, 'alpha')
  const child = parent.oneOf('beta')
  const grandChild = child.oneOf('gamma')

  expect(parent.toConfig().__ruleNames).toEqual(['alpha'])
  expect(child.toConfig().__ruleNames).toEqual(['alpha', 'beta'])
  expect(grandChild.toConfig().__ruleNames).toEqual(['alpha', 'beta', 'gamma'])
})

test('toConfig with values', () => {
  const rule = new Rule()

  rule.include
    .add('alpha')
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
    .end()
    .oneOf('inline')
    .resourceQuery(/inline/)
    .use('url')
    .loader('url-loader')

  expect(rule.toConfig()).toEqual({
    test: /\.js$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha']
        }
      }
    ]
  })
})

test('merge empty', () => {
  const rule = new Rule()
  const obj = {
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: {
      inline: {
        resourceQuery: /inline/,
        use: {
          url: {
            loader: 'url-loader'
          }
        }
      }
    },
    use: {
      babel: {
        loader: 'babel-loader',
        options: {
          presets: ['alpha']
        }
      }
    }
  }
  const instance = rule.merge(obj)

  expect(instance).toBe(rule)
  expect(rule.toConfig()).toEqual({
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha']
        }
      }
    ]
  })
})

test('merge with values', () => {
  const rule = new Rule()

  rule
    .test(/\.js$/)
    .post()
    .include.add('gamma')
    .add('delta')
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] })

  rule.merge({
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: {
      inline: {
        resourceQuery: /inline/,
        use: {
          url: {
            loader: 'url-loader'
          }
        }
      }
    },
    use: {
      babel: {
        options: {
          presets: ['beta']
        }
      }
    }
  })

  expect(rule.toConfig()).toEqual({
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['gamma', 'delta', 'alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    oneOf: [
      {
        resourceQuery: /inline/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha', 'beta']
        }
      }
    ]
  })
})

test('merge with omit', () => {
  const rule = new Rule()

  rule
    .test(/\.js$/)
    .post()
    .include.add('gamma')
    .add('delta')
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({ presets: ['alpha'] })

  rule.merge(
    {
      test: /\.jsx$/,
      enforce: 'pre',
      include: ['alpha', 'beta'],
      exclude: ['alpha', 'beta'],
      oneOf: {
        inline: {
          resourceQuery: /inline/,
          use: {
            url: {
              loader: 'url-loader'
            }
          }
        }
      },
      use: {
        babel: {
          options: {
            presets: ['beta']
          }
        }
      }
    },
    ['use', 'oneOf']
  )

  expect(rule.toConfig()).toEqual({
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['gamma', 'delta', 'alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['alpha']
        }
      }
    ]
  })
})

test('toConfigRule', () => {
  const rule = new Rule(null, 'alpha')
  const use = rule
    .use('beta')
    .loader('babel-loader')
    .options({ presets: ['alpha'] })

  const config = use.toConfig()

  expect(config).toEqual({
    loader: 'babel-loader',
    options: { presets: ['alpha'] }
  })

  expect(config.__ruleNames).toEqual(['alpha'])
  expect(config.__useName).toBe('beta')
})
