import * as path from 'path'
import * as chalk from 'chalk'
import * as fs from 'fs-extra'
import * as bfj from 'bfj'
import * as checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import * as FileSizeReporter from 'react-dev-utils/FileSizeReporter'
import { checkBrowsers } from 'react-dev-utils/browsersHelper'
import * as formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'

import verifyPackageTree from './utils/verifyPackageTree'
import printHostingInstructions from './utils/printHostingInstructions'

const webpack = require('webpack')

// MAIN MODULE EXPORTS, WITH DEFAULT FLOW

export default async berun => {
  try {
    await taskBuildPreFlightArgs(berun)
    await taskBuildPreFlightChecks(berun)
    if (berun.sparkyContext.shouldCompareFileSizes) {
      await taskBuildPreFlightMeasure(berun)
    }
    await taskBuildPreFlightClean(berun)
    await taskBuildCopyPublicAssets(berun)
    await taskBuildCompile(berun)
    if (berun.sparkyContext.shouldCompareFileSizes) {
      await taskBuildPostFlightFileSizes(berun)
    }
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
  taskBuildPreFlightMeasure,
  taskBuildPreFlightClean,
  taskBuildCopyPublicAssets,
  taskBuildCompile,
  taskBuildPostFlightFileSizes,
  taskBuildPostFlightInstructions
}

async function taskBuildPreFlightArgs(berun) {
  // Process CLI arguments

  const argv = process.argv.slice(2)

  const writeStatsJson = argv.indexOf('--stats') !== -1

  berun.sparkyContext.shouldCompareFileSizes =
    berun.sparkyContext.shouldCompareFileSizes !== false

  berun.sparkyContext.writeStatsJson = writeStatsJson

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

async function taskBuildPreFlightMeasure(berun) {
  const { measureFileSizesBeforeBuild } = FileSizeReporter

  // First, read the current file sizes in build directory.
  // This lets us display how much they changed later.
  const previousFileSizes = await measureFileSizesBeforeBuild(
    berun.options.paths.appBuild
  )

  berun.sparkyContext.previousFileSizes = previousFileSizes
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
    // Start the webpack build
    const { stats, warnings } = await promisifyWebpackBuild(berun)

    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(warnings.join('\n\n'))
      console.log(
        `\nSearch for the ${chalk.underline(
          chalk.yellow('keywords')
        )} to learn more about each warning.`
      )
      console.log(
        `${'To ignore, add '}${chalk.cyan(
          '// eslint-disable-next-line'
        )} ` +
          ` to the line before.\n`
      )
    } else {
      console.log(chalk.green('Compiled successfully.\n'))
    }

    berun.sparkyContext.stats = stats
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'))
    console.log(err.stack)
    process.exit(1)
  }
}

async function taskBuildPostFlightFileSizes(berun) {
  const { stats, previousFileSizes, writeStatsJson } = berun.sparkyContext

  if (writeStatsJson) {
    await bfj.write(
      `${berun.options.paths.appBuild}/bundle-stats.json`,
      stats.toJson()
    )
  }

  const { printFileSizesAfterBuild } = FileSizeReporter

  // These sizes are pretty large. We'll warn for bundles exceeding them.
  const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024

  const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

  console.log('File sizes after gzip:\n')

  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    berun.options.paths.appBuild,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE
  )
}

async function taskBuildPostFlightInstructions(berun) {
  const appPackage = require(berun.options.paths.appPackageJson)
  const { publicUrl } = berun.options.paths
  const publicPath = berun.webpack.output.get('publicPath')
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
function promisifyWebpackBuild(berun) {
  console.log(
    berun.sparkyContext.buildMessage ||
      'Creating an optimized production build...'
  )

  const compiler = webpack(berun.webpack.toConfig())
  return new Promise<any>((resolve, reject) => {
    try {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err)
        }
        const messages = formatWebpackMessages(stats.toJson({}, true))
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1
          }
          return reject(new Error(messages.errors.join('\n\n')))
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' ||
            process.env.CI.toLowerCase() !== 'false') &&
          messages.warnings.length
        ) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          )
          return reject(new Error(messages.warnings.join('\n\n')))
        }

        const resolveArgs = {
          stats,
          warnings: messages.warnings
        }

        return resolve(resolveArgs)
      })
    } catch (ex) {
      console.error(ex)
      process.exit(200)
      reject(ex)
    }
  })
}
