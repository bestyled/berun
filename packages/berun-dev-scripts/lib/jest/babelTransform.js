'use strict';
const babelConfig = require('../../config/babel.config');

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(babelConfig);
