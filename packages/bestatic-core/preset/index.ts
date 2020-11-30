// FIX-DEPENDENCIES
require.resolve('@berun/preset-react')
require.resolve('@berun/runner-tsmain')
require.resolve('@berun/preset-bestatic')
require.resolve('@berun/runner-eslint')
require.resolve('@berun/runner-prettier')

export default {
  use: [
    '@berun/preset-react',
    '@berun/runner-tsmain',
    '@berun/preset-bestatic',
    '@berun/runner-eslint',
    '@berun/runner-prettier',
  ],
}
