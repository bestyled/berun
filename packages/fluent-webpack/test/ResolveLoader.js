import { ResolveLoader } from '..'

test('is Chainable', () => {
  const parent = { parent: true }
  const resolveLoader = new ResolveLoader(parent)

  expect(resolveLoader.end()).toBe(parent)
})

test('sets methods', () => {
  const resolveLoader = new ResolveLoader()
  const instance = resolveLoader.modules.add('src').end()

  expect(instance).toBe(resolveLoader)
  expect(resolveLoader.toConfig()).toEqual({ modules: ['src'] })
})

test('toConfig empty', () => {
  const resolveLoader = new ResolveLoader()

  expect(resolveLoader.toConfig()).toEqual({})
})

test('toConfig with values', () => {
  const resolveLoader = new ResolveLoader()

  resolveLoader.modules
    .add('src')
    .end()
    .set('moduleExtensions', ['-loader'])

  expect(resolveLoader.toConfig()).toEqual({
    modules: ['src'],
    moduleExtensions: ['-loader']
  })
})

test('merge empty', () => {
  const resolveLoader = new ResolveLoader()
  const obj = {
    modules: ['src'],
    moduleExtensions: ['-loader']
  }
  const instance = resolveLoader.merge(obj)

  expect(instance).toBe(resolveLoader)
  expect(resolveLoader.toConfig()).toEqual(obj)
})

test('merge with values', () => {
  const resolveLoader = new ResolveLoader()

  resolveLoader.modules
    .add('src')
    .end()
    .moduleExtensions.add('-loader')

  resolveLoader.merge({
    modules: ['dist'],
    moduleExtensions: ['-fake']
  })

  expect(resolveLoader.toConfig()).toEqual({
    modules: ['src', 'dist'],
    moduleExtensions: ['-loader', '-fake']
  })
})

test('merge with omit', () => {
  const resolveLoader = new ResolveLoader()

  resolveLoader.modules
    .add('src')
    .end()
    .moduleExtensions.add('-loader')

  resolveLoader.merge(
    {
      modules: ['dist'],
      moduleExtensions: ['-fake']
    },
    ['moduleExtensions']
  )

  expect(resolveLoader.toConfig()).toEqual({
    modules: ['src', 'dist'],
    moduleExtensions: ['-loader']
  })
})
