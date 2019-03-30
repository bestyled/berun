'use strict'

const eslintFormatter = require('react-dev-utils/eslintFormatter')

module.exports.presetESlint = (berun, options = {}) => {
  berun.eslint.merge({
    formatter: eslintFormatter,
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
  })
}
