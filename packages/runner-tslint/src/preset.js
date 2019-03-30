'use strict'

module.exports.presetTSlint = (berun, options = {}) => {
  berun.tslint.merge({
    defaultSeverity: 'warning',
    extends: ['tslint:recommended', 'tslint-react', 'tslint-config-prettier'],
    linterOptions: {},
    jsRules: {
      curly: true,
      'no-console': false
    },
    rules: {
      curly: true,
      'no-console': false,
      'member-access': false
    },
    rulesDirectory: []
  })
}
