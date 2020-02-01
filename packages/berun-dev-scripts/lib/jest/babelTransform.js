const babelJest = require('babel-jest')
const babelConfig = require('../../config/babel.config')

module.exports = babelJest.createTransformer(babelConfig)
