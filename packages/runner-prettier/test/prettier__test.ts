import { create as berunJs } from '@berun/berun'
import presetPrettier from '../src'

test('Gets Prettier configuration', () => {
  const berun = berunJs(presetPrettier)

  const expectedResult = [
    '--ignore-path',
    '.gitignore',
    '--write',
    '--no-config',
    '--no-semi',
    '--single-quote',
    '{,!(node_modules|dist|build)/**/}*.{js,jsx,ts,tsx,css,less,scss,sass,graphql,json,md}',
  ]

  expect(berun.prettier.toArgs()).toEqual(expectedResult)
})

test('Runs prettier', () => {
  const berun = berunJs(presetPrettier)

  const result = berun.sparky.exec('lint')

  expect(result).resolves.toBe(undefined)
})
