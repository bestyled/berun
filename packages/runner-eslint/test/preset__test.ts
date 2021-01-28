import presetESlint from '@berun/runner-eslint'

import { create as berunJs } from '@berun/berun'

test('Gets ESLint configuration', () => {
  const berun = berunJs(presetESlint)

  const expectedResult = {
    formatter: expect.any(Function),
    eslintPath: require.resolve('eslint'),
    baseConfig: {
      extends: [require.resolve("@sync-labs/eslint-config/profile/node")],
      settings: { react: { version: '999.999.999' } }
    },
    ignore: false,
    useEslintrc: false,
    rules: {
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@rushstack/no-new-null': 'off',
      'require-atomic-updates': 'off',
      'no-void': 'off'
      },
      env: {
          es6: true
      }
  }

  expect(berun.eslint.toConfig()).toEqual(expectedResult)
})
