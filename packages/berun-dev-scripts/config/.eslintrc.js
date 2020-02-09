// FIX-DEPENDENCIES
require.resolve('eslint-config-berun')

module.exports = {
  extends: [
    'berun'
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    '@typescript-eslint/no-var-requires': 0
  }
}
