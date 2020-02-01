/* eslint-disable @typescript-eslint/no-var-requires */
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end

//
// Node.js require pirate
//

import 'sucrase/register/ts-legacy-module-interop'
import Module from 'module'
import path from 'path'
import { create as berunBuilder } from '@berun/berun'

const originalRequire = Module.prototype.require
const proxyCache = {}

Module.prototype.require = function requireProxy(
  this: any,
  name: string,
  ...rest
) {
  if (name in proxyCache) {
    return originalRequire.apply(this, [proxyCache[name]])
  }

  // TEST IF FIRST PATH INTO NODE_MODULE
  if (/(^[^./]*$)|(^@[^./]*\/[^./]*$)/.test(name)) {
    let packagefile
    try {
      packagefile = require.resolve(`${name}/package.json`)
    } catch (ex) {
      // noop: base node module
    }

    if (packagefile && !packagefile.includes('/node_modules/')) {
      const packagejson = originalRequire.apply(this, [packagefile])
      const main = packagejson['ts:main'] || packagejson.main || 'index.js'
      const abspath = path.join(path.dirname(packagefile), main)
      proxyCache[name] = abspath
      return originalRequire.apply(this, [abspath])
    }
  }

  return originalRequire.apply(this, [name, ...rest])
} as any

const cmd = process.argv[2]

const ENV = {
  build: 'production',
  start: 'development',
  test: 'test',
  'build:static': 'production',
  deploy: 'production',
  'deploy:static': 'production',
  'build:algolia:static': 'production',
  'docs:build': 'production',
  'docs:start': 'development'
}

process.env.NODE_ENV = process.env.NODE_ENV || ENV[cmd] || 'development'
process.env.BABEL_ENV = process.env.NODE_ENV

// Certain task runners such as Fuse-Box require PROJECT_ROOT to be set
// when called from another task runner like @berun/scripts or Gulp
process.env.PROJECT_ROOT = process.cwd()

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const berun = berunBuilder(null, { cmd })

berun.register('sparkyContext', {})

berun.sparky.exec(cmd).then(() => {
  process.nextTick(process.exit)
})
