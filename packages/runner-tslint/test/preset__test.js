import { presetTSlint } from '../src'

const berun_js = require('@berun/berun')

test('Gets TSLint configuration', () => {
  const berun = berun_js(presetTSlint)

  var expected_result = {
    defaultSeverity: 'warning',
    extends: ['tslint:recommended', 'tslint-react', 'tslint-config-prettier'],
    jsRules: {
      curly: true,
      'no-console': false
    },
    rules: {
      curly: true,
      'no-console': false,
      'member-access': false
    }
  }

  expect(berun.tslint.toConfig()).toEqual(expected_result)
})
