// FIX-DEPENDENCIES
require.resolve('@babel/preset-typescript')
require.resolve('@babel/preset-env')
require.resolve('@babel/plugin-proposal-decorators')
require.resolve('@babel/plugin-proposal-class-properties')

module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10'
        }
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
}
