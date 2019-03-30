/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the source directory of this package.
 */
'use strict'

const berun = require('@berun/berun').current()

const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer(berun.babel.toConfig())
