import { TSLintConfig } from '../src'

test('is Chainable', () => {
  const parent = { parent: true }
  const tslint = new TSLintConfig(parent)

  expect(tslint.end()).toBe(parent)
})

test('shorthand methods', () => {
  const tslint = new TSLintConfig() as any
  const obj = {}

  tslint.$fluent.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(tslint[method]('alpha')).toBe(tslint)
  })

  expect(tslint.entries()).toEqual(obj)
})

test('sets methods', () => {
  const tslint = new TSLintConfig()
  const instance = tslint.rulesDirectory
    .add('path/to/custom/rules/directory/')
    .add('another/path/')
    .end()

  expect(instance).toBe(tslint)
})

test('toConfig empty', () => {
  const tslint = new TSLintConfig()

  expect(tslint.toConfig()).toEqual({})
})

test('toConfig with fluent', () => {
  const tslint = new TSLintConfig()

  const instance = tslint.extends
    .add('tslint:recommended')
    .end()
    .rulesDirectory.add('path/to/custom/rules/directory/')
    .add('another/path/')
    .end()
    .rules.set('max-line-length', { options: [120] })
    .set('new-parens', true)
    .end()

  const result = {
    extends: ['tslint:recommended'],
    rulesDirectory: ['path/to/custom/rules/directory/', 'another/path/'],
    rules: {
      'max-line-length': {
        options: [120]
      },
      'new-parens': true
    }
  }

  expect(instance).toBe(tslint)
  expect(tslint.toConfig()).toEqual(result)
})

test('toConfig with merge', () => {
  const tslint = new TSLintConfig()

  const config1 = {
    rulesDirectory: ['path/to/custom/rules/directory/'],
    rules: {
      'max-line-length': true
    }
  }

  const config2 = {
    extends: ['tslint:recommended'],
    rulesDirectory: ['another/path/'],
    rules: {
      'max-line-length': {
        options: [120]
      },
      'new-parens': true
    }
  }

  const instance = tslint.merge(config1).merge(config2)

  const result = {
    extends: ['tslint:recommended'],
    rulesDirectory: ['path/to/custom/rules/directory/', 'another/path/'],
    rules: {
      'max-line-length': {
        options: [120]
      },
      'new-parens': true
    }
  }

  expect(instance).toBe(tslint)
  expect(tslint.toConfig()).toEqual(result)
})
