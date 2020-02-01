import presetESlint from '@berun/runner-eslint'

import { create as berunJs } from '@berun/berun'

test('Gets ESLint configuration', () => {
  const berun = berunJs(presetESlint)

  const expectedResult = {
    formatter: expect.any(Function),
    eslintPath: require.resolve('eslint'),
    baseConfig: {
      extends: [require.resolve('eslint-config-berun')],
      settings: { react: { version: '999.999.999' } }
    },
    ignore: false,
    useEslintrc: false,
    rules: {
      noRedeclare: false
    }
  }

  expect(berun.eslint.toConfig()).toEqual(expectedResult)
})
