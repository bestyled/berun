import path from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import { checkBrowsers } from 'react-dev-utils/browsersHelper'
import verifyPackageTree from './utils/verifyPackageTree'
import printHostingInstructions from './utils/printHostingInstructions'
import { fuseCreate, fuseRun } from './utils/fuse'

// MAIN MODULE EXPORTS, WITH DEFAULT FLOW

export default async berun => {
  try {
    await taskBuildPreFlightArgs(berun)
    await taskBuildPreFlightChecks(berun)
    await taskBuildPreFlightClean(berun)
    await taskBuildCopyPublicAssets(berun)
    await taskBuildCompile(berun)
    await taskBuildPostFlightInstructions(berun)
  } catch (err) {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  }
}

// EXPORT INDIVIDUAL FUNCTIONS FOR MORE FINE-GRAINED CUSTOM TASKS
// SEE @berun/runner-webpack-static for an example of where these are used

export {
  taskBuildPreFlightArgs,
  taskBuildPreFlightChecks,
  taskBuildPreFlightClean,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightInstructions
}

async function taskBuildPreFlightArgs(berun) {
  // Process CLI arguments

  berun.sparkyContext.isSPA = berun.sparkyContext.isSPA !== false
}

async function taskBuildPreFlightChecks(berun) {
  if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
    verifyPackageTree()
    // Warn and crash if required files are missing
    if (
      !checkRequiredFiles([
        // berun.options.paths.appHtml,
        berun.options.paths.appIndexJs
      ])
    ) {
      process.exit(1)
    }
  }

  // We require that you explictly set browsers and do not fall back to
  // browserslist defaults.
  await checkBrowsers(berun.options.paths.appPath)
}

async function taskBuildPreFlightClean(berun) {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  await fs.emptyDir(berun.options.paths.appBuild)
}

async function taskBuildCopyPublicAssets(berun) {
  if (await fs.pathExists(berun.options.paths.appPublic)) {
    await fs.copy(berun.options.paths.appPublic, berun.options.paths.appBuild, {
      dereference: true,
      filter: file => file !== berun.options.paths.appHtml
    })
  }
}

async function taskBuildCompile(berun) {
  try {
    // Start the fuse-box build
    await fuseBoxBuild(berun)

    console.log(chalk.green('Compiled successfully.\n'))
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'))
    console.log(err)
    console.log(err.stack)
    process.exit(1)
  }
}

async function taskBuildPostFlightInstructions(berun) {
  console.log()

  const appPackage = require(berun.options.paths.appPackageJson)
  const { publicUrl } = berun.options.paths
  const { publicPath } = berun.options.paths
  const buildFolder = path.relative(process.cwd(), berun.options.paths.appBuild)

  printHostingInstructions(
    appPackage,
    publicUrl,
    publicPath,
    buildFolder,
    berun.options.paths.useYarn,
    berun.sparkyContext.isSPA
  )
}

// PRIVATE FUNCTIONS

// Create the production build and print the deployment instructions.
function fuseBoxBuild(berun) {
  console.log(
    berun.sparkyContext.buildMessage ||
      'Creating an optimized production build...'
  )

  const fuse = fuseCreate(berun)
  return fuseRun(fuse)
}
