'use strict'

const FuseBox = require('@berun/fluent-fuse-box').FuseBox

const { taskDev, taskProd, taskPublic } = require('./tasks')

const {
  taskDevBuildPreFlightArgs,
  taskBuildPreFlightChecks,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile
} = taskDev

const {
  taskBuildPreFlightArgs,
  taskBuildPreFlightClean,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightInstructions
} = taskProd

const fuseboxBundle = require('./runner-bundle')
const presetCore = require('./runner-core')
const {
  pluginEnv,
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum
} = require('./runner-plugin')

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(FuseBox)
  berun.use(presetCore, options)

  const _fuseBoxOldConfig = berun.fusebox.toConfig
  berun.fusebox.toConfig = (omit = []) => {
    if (berun.fusebox.plugins.has('Babel'))
      berun.fusebox.plugin('Babel').tap(() => ({
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
        limit2project: true,
        config: Object.assign(berun.babel.toConfig(), { ast: true })
      }))
    return _fuseBoxOldConfig.call(berun.fusebox, omit)
  }
}

module.exports = Object.assign(module.exports, {
  taskDev,
  taskProd,
  taskPublic,
  taskDevBuildPreFlightArgs,
  taskBuildPreFlightChecks,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile,
  taskBuildPreFlightArgs,
  taskBuildPreFlightClean,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightInstructions,
  pluginEnv,
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum,
  fuseboxBundle,
  pluginEnv,
  pluginCSS,
  pluginSVG,
  pluginJSON,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum
})
