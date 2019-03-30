import { presetPrettier } from '../src'

const berun_js = require('@berun/berun')

test('Gets Prettier configuration', () => {
  const berun = berun_js(presetPrettier)

  var expected_result = [
    '--ignore-path',
    '.gitignore',
    '--write',
    '--no-config',
    '--no-semi',
    '--single-quote',
    '{,!(node_modules|dist|build)/**/}*.{js,jsx,ts,tsx,css,less,scss,sass,graphql,json,md}'
  ]

  expect(berun.prettier.toArgs()).toEqual(expected_result)
})

test('Runs prettier', () => {
  const berun = berun_js(presetPrettier)

  let result = berun.sparky.exec('lint')

  expect(result).resolves.toBe(undefined)
})
