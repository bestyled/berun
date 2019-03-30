'use strict'

const path = require('path')
const fs = require('fs-extra')

function getRunner(berun) {
  if ('webpack' in berun) return require('@berun/runner-webpack')
  else if ('fusebox' in berun) return require('@berun/runner-fuse-box')
  else
    throw new Error(
      'Static preset only supports webpack and fusebox currently;  cannot find either of these in berun use chain'
    )
}

/*
 * Sparky Task to run first of two-pass web-pack build
 * to create static react website
 */
module.exports.taskStaticPass1 = async berun => {
  const {
    taskBuildPreFlightClean,
    taskBuildCopyPublicAssets,
    taskBuildCompile
  } = getRunner(berun)

  await taskStaticPreFlightArgs(berun)
  await taskBuildPreFlightClean(berun)
  await taskBuildCopyPublicAssets(berun)
  berun.sparkyContext.buildMessage =
    'Creating first pass of production static build...'
  await taskBuildCompile(berun)
}

/*
 * Sparky Task to run second of two-pass web-pack build
 * to create static react website
 */
module.exports.taskStaticPass2 = async berun => {
  const {
    taskBuildCopyPublicAssets,
    taskBuildCompile,
    taskBuildPostFlightInstructions
  } = getRunner(berun)

  await taskBuildCopyPublicAssets(berun)
  berun.sparkyContext.buildMessage =
    'Creating second pass of production static build...'
  await taskBuildCompile(berun)
  if (berun.sparkyContext.noJS) await taskStaticRemoveJS(berun)
  await taskBuildPostFlightInstructions(berun)
}

async function taskStaticPreFlightArgs(berun) {
  const argv = process.argv.slice(2)

  berun.sparkyContext.noJS = argv.indexOf('--js') === -1

  berun.sparkyContext.shouldCompareFileSizes = false
  berun.sparkyContext.writeStatsJson = false
  berun.sparkyContext.isSPA = false
}

const taskStaticRemoveJS = async berun => {
  const bundle = path.join(berun.options.paths.appBuild, './main.js')
  await fs.remove(bundle)
}

const taskDev = berun => getRunner(berun).taskDev(berun)

module.exports.taskStaticPreFlightArgs = taskStaticPreFlightArgs
module.exports.taskStaticRemoveJS = taskStaticRemoveJS
module.exports.taskStaticDev = taskDev
