#!/usr/bin/env node

//
// Node.js require pirate
//
const { transform } = require('sucrase')
const Module = require('module')
const path = require('path')
const { addHook } = require('pirates')

const MY_PACKAGE_DIR = `/${path.basename(path.resolve(__dirname, '..'))}/`

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
    const suffix = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${mapBase64}`
    return `${transformedCode}\n${suffix}`
  },
  {
    exts: ['.ts'],
    matcher: filename => {
      return filename.indexOf(MY_PACKAGE_DIR) !== -1
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

    if (packagefile && !packagefile.includes('/node_modules/')) {
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
// ignoring them. Promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  console.error(err)
  throw err
})

//
// MAIN ENTRY POINT
//

const logDirectory = require('../lib/devscripts/log-directory.ts').default

const args = process.argv
const scriptIndex = args.findIndex(
  x =>
    x === 'build' ||
    x === 'fix' ||
    x === 'pack' ||
    x === 'lint' ||
    x === 'format' ||
    x === 'test' ||
    x === 'clean'
)

const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(scriptIndex + 1) : args.slice(1)
process.argv = nodeArgs

switch (script) {
  case 'build':
  case 'clean':
  case 'lint':
  case 'fix':
  case 'pack':
  case 'format':
  case 'test':
    logDirectory(`running ${script} script in`, process.cwd())
    process.argv = args
    require(`../scripts/${script}`)
    break
  default:
    console.log(`Unknown script "${script}".`)
    console.log('Perhaps you need to update @berun/dev-scripts?')
    console.log(
      'See: https://github.com/bestyled/berun/blob/master/packages/dev-scripts'
    )
    break
}
