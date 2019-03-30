'use strict'
const path = require('path')
const fs = require('fs')

const PROPKEY_TSMAIN = 'ts:main'

module.exports = (berun, options = {}) => {
  if (berun.webpack.resolve.mainFields.values().length == 0)
    berun.webpack.resolve.mainFields
      .when(
        !berun.webpack.has('target') ||
          berun.webpack.get('target') == 'web' ||
          berun.webpack.get('target') == 'webworker',
        mainFields => mainFields.add('browser')
      )
      .add('module')
      .add('main')

  berun.webpack.resolve.mainFields.prepend(PROPKEY_TSMAIN)

  if (options.node_modules) {
    var main = berun.webpack.module.rule('main')

    if (main.oneOfs.has('compile')) {
      let excludes = main.oneOf('compile').exclude.values()

      main
        .oneOf('compile')
        .exclude.clear()
        .add({
          and: [
            excludes,
            filepath => {
              return /node_modules/.test(filepath) && !hasPkgTsMain(filepath)
            }
          ]
        })
    }
  }
}

function hasPkgTsMain(filepath) {
  const pkgRoot = findRoot(filepath)
  const packageJsonPath = path.resolve(pkgRoot, 'package.json')
  const packageJsonText = fs.readFileSync(packageJsonPath, {
    encoding: 'utf-8'
  })
  const packageJson = JSON.parse(packageJsonText)
  return {}.hasOwnProperty.call(packageJson, PROPKEY_TSMAIN)
}

function defaultCheck(dir) {
  return fs.existsSync(path.join(dir, 'package.json'))
}

function findRoot(start, check) {
  start = start || module.parent.filename
  check = check || defaultCheck

  if (typeof start === 'string') {
    if (start[start.length - 1] !== path.sep) {
      start += path.sep
    }
    start = start.split(path.sep)
  }
  if (!start.length) {
    throw new Error('package.json not found in path')
  }
  start.pop()
  var dir = start.join(path.sep)
  try {
    if (check(dir)) {
      return dir
    }
  } catch (e) {}
  return findRoot(start, check)
}
