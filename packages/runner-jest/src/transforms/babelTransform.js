/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the source directory of this package.
 */
import babelJest from 'babel-jest'

const berun = require('@berun/berun').current()

export default babelJest.createTransformer(berun.babel.toConfig())
