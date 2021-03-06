/**
 * Portions copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as fs from 'fs'
import * as path from 'path'
import * as findPkg from 'find-pkg'
import * as globby from 'globby'

const findPkgs = (rootPath, globPatterns) => {
  if (!globPatterns) {
    return []
  }
  const globOpts = {
    cwd: rootPath,
    strict: true,
    absolute: true,
  }
  return globPatterns
    .reduce(
      (pkgs, pattern) =>
        pkgs.concat(globby.sync(path.join(pattern, 'package.json'), globOpts)),
      []
    )
    .map((f) => path.dirname(path.normalize(f)))
}

export const isMonoRoot = (appDir) => {
  const monoPkg = appDir && require(path.resolve(appDir, 'package.json'))
  const workspaces = monoPkg && monoPkg.workspaces

  return {
    isMonoRoot: workspaces && workspaces.length > 0,
    workspaces,
  }
}

export const findMonorepo = (appDir) => {
  const monoPkgPath = findPkg.sync(path.resolve(appDir, '..'))
  const monoPkg = monoPkgPath && require(monoPkgPath)
  const workspaces = monoPkg && monoPkg.workspaces
  const patterns = (workspaces && workspaces.packages) || workspaces
  const isYarnWs = Boolean(patterns)
  const allPkgs = patterns && findPkgs(path.dirname(monoPkgPath), patterns)
  const isIncluded = (dir) => allPkgs && allPkgs.indexOf(dir) !== -1
  const isAppIncluded = isIncluded(appDir)
  const pkgs = allPkgs
    ? allPkgs.filter((f) => fs.realpathSync(f) !== appDir)
    : []

  return {
    isAppIncluded,
    isYarnWs,
    pkgs,
    monoPkgPath,
  }
}
