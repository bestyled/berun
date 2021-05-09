import * as eslintFormatter from 'react-dev-utils/eslintFormatter'
import Berun from '@berun/berun'

// FIX-DEPENDENCIES
require.resolve('@sync-labs/eslint-config/profile/node')
require.resolve('eslint')

export default (berun: Berun, _) => {
  berun.eslint.merge({
    formatter: eslintFormatter,
    eslintPath: require.resolve('eslint'),
    baseConfig: {
      extends: [
        '@sync-labs/eslint-config/profile/node',
        '@sync-labs/eslint-config/mixins/react'
      ],
      settings: { react: { version: '999.999.999' } }
    },
    ignore: false,
    useEslintrc: false,
    rules: {
      noRedeclare: false
    }
  })
}
