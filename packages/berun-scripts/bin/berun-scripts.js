#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//
// Node.js require pirate
//
const { transform } = require('sucrase')
const Module = require('module')
const path = require('path')
const { addHook } = require('pirates')

const MY_PACKAGE_SCOPE1 = '@berun'
const MY_PACKAGE_SCOPE2 = '@bestatic'

// Transpile all local modules of this package
addHook(
  (code, filePath) => {
    const { code: transformedCode, sourceMap } = transform(code, {
      sourceMapOptions: { compiledFilename: filePath },
      transforms: ['typescript', 'imports'],
      enableLegacyTypeScriptModuleInterop: true,
      filePath
    })
    const mapBase64 = Buffer.from(JSON.stringify(sourceMap)).toString('base64')
    const suffix = `${'/'}${'/'}# sourceMappingURL=data:application/json;charset=utf-8;base64,${mapBase64}`
    return `${transformedCode}\n${suffix}`
  },
  {
    exts: ['.ts'],
    matcher: filename => {
      return filename.indexOf(MY_PACKAGE_SCOPE1) !== -1 ||  filename.indexOf(MY_PACKAGE_SCOPE2) !== -1
    },
    ignoreNodeModules: false
  }
)

// Pirate all other TS files
require('sucrase/register/ts-legacy-module-interop')

const proxyCache = {}

const originalRequire = Module.prototype.require

Module.prototype.require = function proxyRequire(name) {
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

    if (
      packagefile &&
      (packagefile.includes(MY_PACKAGE_SCOPE1) || packagefile.includes(MY_PACKAGE_SCOPE2) ||
        !packagefile.includes('/node_modules/'))
    ) {
      const packagejson = originalRequire.apply(this, [packagefile])
      const main = packagejson['ts:main'] || packagejson.main || 'index.js'
      const abspath = path.join(path.dirname(packagefile), main)
      proxyCache[name] = abspath
      return originalRequire.apply(this, [abspath])
    }
  }

  // eslint-disable-next-line prefer-rest-params
  return originalRequire.apply(this, arguments)
}

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

//
// MAIN ENTRY POINT
//

const args = process.argv.slice(2)

const cmd = args[0]
let script

switch (cmd) {
  case 'eject':
  case 'init':
    script = cmd
    break
  default:
    script = 'cmd'
}

process.argv = args
require(`../scripts/${script}`)
