'use strict'
const path = require('path')

module.exports = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  berun.fusebox
    .homeDir(berun.options.paths.appSrc)
    .sourceMaps(ISPRODUCTION ? false : { project: true, vendor: false })
    .output(path.join(berun.options.paths.appBuild, '$name.js'))
    .target(ISPRODUCTION ? 'browser@es5' : 'browser@es2016')
    .hash(ISPRODUCTION)
    .cache(!ISPRODUCTION)
    .useTypescriptCompiler(berun.options.paths.isTypeScript)
    .debug(true)
    .ensureTsConfig(false)
    .allowSyntheticDefaultImports(true)
}
