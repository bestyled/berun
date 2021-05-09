export default {
  use: [
    require.resolve('@berun/preset-react'),
    require.resolve('@berun/runner-tsmain'),
    require.resolve('@berun/preset-bestatic'),
    require.resolve('@berun/runner-eslint'),
    require.resolve('@berun/runner-prettier')
  ]
}
