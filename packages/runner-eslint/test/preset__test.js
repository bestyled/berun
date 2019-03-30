import { presetESlint } from '@berun/runner-eslint'

const berun_js = require('@berun/berun')

test('Gets ESLint configuration', () => {
  const berun = berun_js(presetESlint)

  var expected_result = {
    formatter: expect.any(Function),
    eslintPath: require.resolve('eslint'),
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app')],
      settings: { react: { version: '999.999.999' } }
    },
    ignore: false,
    useEslintrc: false,
    rules: {
      noRedeclare: false
    }
  }

  expect(berun.eslint.toConfig()).toEqual(expected_result)
})
