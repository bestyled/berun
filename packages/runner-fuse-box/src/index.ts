import { FuseBox } from '@berun/fluent-fuse-box'
import Berun from '@berun/berun'
import { taskDev, taskProd, taskStatic } from './tasks'

import fuseboxBundle from './runner-bundle'
import presetCore from './runner-core'

import {
  pluginEnv,
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum
} from './runner-plugin'

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

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(FuseBox)
  berun.use(presetCore, options)

  const _fuseBoxOldConfig = berun.fusebox.toConfig
  berun.fusebox.toConfig = (omit = []) => {
    if (berun.fusebox.plugins.has('Babel')) {
      berun.fusebox.plugin('Babel').tap(() => ({
        extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
        limit2project: true,
        config: Object.assign(berun.babel.toConfig(), { ast: true })
      }))
    }
    return _fuseBoxOldConfig.call(berun.fusebox, omit)
  }
}

export {
  taskDev,
  taskProd,
  taskStatic,
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
  fuseboxBundle
}
