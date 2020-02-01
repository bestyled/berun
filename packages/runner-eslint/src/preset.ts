import eslintFormatter from 'react-dev-utils/eslintFormatter'
import Berun from '@berun/berun'
// import to assure included in dependencies
import 'eslint-config-berun'
import 'eslint'

export default (berun: Berun, _) => {
  berun.eslint.merge({
    formatter: eslintFormatter,
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
  })
}
