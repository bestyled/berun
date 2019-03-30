'use strict'
const fusebox = require('./index')
const babel = require('@berun/runner-babel')
const fuseboxBundle = require('./runner-bundle')
const {
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum
} = require('./runner-plugin')
const { taskStatic, taskDev, taskProd } = require('./runner-plugin')

module.exports = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  berun
    .use(fusebox)
    .use(babel)
    .use(pluginPackageInfo)
    .use(pluginSVG)
    .use(pluginCSS)
    .use(pluginJSON)
    .use(pluginWebIndex)
    .use(pluginBabel)
    .when(ISPRODUCTION, b => b.use(pluginQuantum))

  berun.use(fuseboxBundle)

  berun.sparky.task('static', taskStatic)
  berun.sparky.task('start', ['static'], taskDev)
  berun.sparky.task('build', ['static'], taskProd)
}

module.exports.presetReact = module.exports
