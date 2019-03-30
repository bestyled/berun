import { PrettierConfig as Prettier } from '../src'

test('is Chainable', () => {
  const parent = { parent: true }
  const prettier = new Prettier(parent)

  expect(prettier.end()).toBe(parent)
})

test('shorthand methods', () => {
  const prettier = new Prettier() as any
  const obj = {}

  prettier.$fluent.shorthands.forEach(method => {
    obj[method] = 'alpha'
    expect(prettier[method]('alpha')).toBe(prettier)
  })

  expect(prettier.entries()).toEqual(obj)
})

test('sets methods', () => {
  const prettier = new Prettier()
  const instance = prettier.overrides.add({ files: ['*.test.js'] }).end()

  expect(instance).toBe(prettier)
})

test('toArgs empty', () => {
  const prettier = new Prettier()

  expect(prettier.toArgs()).toEqual([])
})

test('toConfig with fluent', () => {
  const prettier = new Prettier()

  const instance = prettier
    .semi(false)
    .bracketSpacing(true)
    .rangeStart(0)
    .insertPragma(true)
    .requirePragma(false)
    .arrowParens('always')

  const expected_result = {
    semi: false,
    bracketSpacing: true,
    rangeStart: 0,
    insertPragma: true,
    requirePragma: false,
    arrowParens: 'always'
  }

  expect(prettier.toConfig()).toEqual(expected_result)
})

test('toArgs with fluent', () => {
  const prettier = new Prettier()

  prettier
    .semi(false)
    .bracketSpacing(true)
    .rangeStart(0)
    .insertPragma(true)
    .requirePragma(false)
    .arrowParens('always')

  const expected_result = [
    '--no-semi',
    '--range-start',
    0,
    '--insert-pragma',
    '--arrow-parens',
    'always'
  ]

  expect(prettier.toArgs()).toEqual(expected_result)
})

test('toArgs with merge', () => {
  const prettier = new Prettier()

  const config1 = {
    semi: false,
    bracketSpacing: true,
    insertPragma: false
  }

  const config2 = {
    rangeStart: 0,
    insertPragma: true,
    requirePragma: false,
    arrowParens: 'always'
  }

  prettier.merge(config1).merge(config2)

  const expected_result = [
    '--no-semi',
    '--insert-pragma',
    '--range-start',
    0,
    '--arrow-parens',
    'always'
  ]

  expect(prettier.toArgs()).toEqual(expected_result)
})

test('toArgs with files, fluent', () => {
  const prettier = new Prettier()

  prettier.files
    .add(
      '{,!(node_modules|dist|build)/**/}*.{js,jsx,ts,tsx,css,less,scss,sass,graphql,json,md}'
    )
    .end()
    .ignorePath('.gitignore')
    .write(true)
    .noConfig(true)
    .semi(false)
    .singleQuote(true)

  const expected_result = [
    '--ignore-path',
    '.gitignore',
    '--write',
    '--no-config',
    '--no-semi',
    '--single-quote',
    '{,!(node_modules|dist|build)/**/}*.{js,jsx,ts,tsx,css,less,scss,sass,graphql,json,md}'
  ]

  expect(prettier.toArgs()).toEqual(expected_result)
})
