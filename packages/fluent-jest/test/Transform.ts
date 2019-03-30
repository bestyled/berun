import { Transform } from '../src'

test('test regex', () => {
  const transform1 = new Transform()
  const ins = transform1.test(/^.+\.(js|jsx|mjs|ts|tsx)$/)

  expect(ins).toBe(transform1)
  expect(
    transform1
      .get('test')
      .toString()
      .replace(/^\/|\/$/g, '')
  ).toEqual('^.+\\.(js|jsx|mjs|ts|tsx)$')
})

test('is Chainable', () => {
  const parent = { parent: true }

  const transform = new Transform(parent)

  expect(transform.end()).toBe(parent)
})

test('use', () => {
  const transform = new Transform()

  const instance = transform.use(
    '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/babelTransform.js'
  )

  expect(instance).toBe(transform)

  expect(transform.get('plugin')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/babelTransform.js'
  )
})

test('toConfig empty', () => {
  const transform = new Transform()

  expect(transform.toConfig()).toEqual({})
})

test('toConfig with values', () => {
  const transform = new Transform()

  const instance = transform
    .test(/^.+\.(js|jsx|mjs|ts|tsx)$/)
    .use(
      '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/babelTransform.js'
    )

  expect(instance).toBe(transform)

  expect(
    transform
      .get('test')
      .toString()
      .replace(/^\/|\/$/g, '')
  ).toEqual('^.+\\.(js|jsx|mjs|ts|tsx)$')

  expect(transform.get('plugin')).toEqual(
    '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/babelTransform.js'
  )

  expect(transform.toConfig()).toEqual({
    test: /^.+\.(js|jsx|mjs|ts|tsx)$/,
    plugin:
      '/Volumes/DATA/projects/berun/packages/runner-jest/src/transforms/babelTransform.js'
  })
})
