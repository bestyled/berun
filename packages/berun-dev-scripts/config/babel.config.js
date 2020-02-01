// REQUIRES FOR DEPENDENCY REFERENCES
require('@babel/preset-typescript')
require('@babel/preset-env')
require('@babel/plugin-proposal-decorators')
require('@babel/plugin-proposal-class-properties')

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
