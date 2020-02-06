// Based on https://gist.github.com/loklaan/9fe7768576466c5a31c2e7af4cfdecd0
// See also https://github.com/facebook/jest/issues/2702

/*
|-------------------------------------------------------------------------------
| Custom 'module resolver' for Jest
|-------------------------------------------------------------------------------
|
| Forked from Jest, this is the default 'resolver' with the added benefit of
| remapping the "main" field to the value of the "module" or "jsnext:main" field,
| when present.
|
| It also excludes node_modules and returns the `realpath` of the resolved module,
| so files in the monorepo get resolved and transpiled while external dependencies
| remain unmolested.
*/

const fs = require('fs')
const path = require('path')
const resolve = require('resolve')
const browserResolve = require('browser-resolve')

const cache = {}

function defaultResolver(path, options) {
  const resv = options.browser ? browserResolve : resolve

  return resv.sync(path, {
    basedir: options.basedir,
    extensions: options.extensions,
    moduleDirectory: options.moduleDirectory,
    paths: options.paths,
    packageFilter: mapModuleFieldToMain
  })
}

module.exports = defaultResolver

/*
|-------------------------------------------------------------------------------
| Utils
*/

function mapModuleFieldToMain(pkg, pkgDir) {
  if (
    /[\\/]node_modules[\\/](?!(@berun|@bestatic|@besync|@bestyled))/.test(
      pkgDir
    )
  ) {
    return pkg
  }

  if (pkgDir in cache) {
    return cache[pkgDir]
  }

  const realPkgDir = fs.realpathSync(pkgDir)
  if (realPkgDir.includes('node_modules')) {
    cache[pkgDir] = pkg
    return pkg
  }

  const tryField = key => {
    if (pkg[key]) {
      const fullPath = path.resolve(realPkgDir, pkg[key])
      if (fs.existsSync(fullPath)) {
        return { ...pkg, main: fullPath }
      }
    }
    return null
  }

  const result =
    tryField('ts:main') || tryField('module') || tryField('jsnext:main') || pkg
  cache[pkgDir] = result
  return result
}
