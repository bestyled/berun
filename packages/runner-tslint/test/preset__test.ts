import { create as berunJs } from '@berun/berun'
import presetTSlint from '../src'

test('Gets TSLint configuration', () => {
  const berun = berunJs(presetTSlint)

  const expectedResult = {
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

  expect(berun.tslint.toConfig()).toEqual(expectedResult)
})
