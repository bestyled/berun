import chalk from 'chalk'
import clearConsole from 'react-dev-utils/clearConsole'
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles'
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils'
import openBrowser from 'react-dev-utils/openBrowser'
import { checkBrowsers } from 'react-dev-utils/browsersHelper'
import fs from 'fs-extra'
import Berun from '@berun/berun'
import verifyPackageTree from './utils/verifyPackageTree'
import { fuseCreate, fuseRun } from './utils/fuse'

// MAIN MODULE EXPORTS, WITH DEFAULT FLOW

export default async berun => {
  try {
    await taskDevBuildPreFlightArgs(berun)
    await taskDevBuildPreFlightChecks(berun)
    await taskDevBuildGetPort(berun)
    await taskDevBuildCompile(berun)
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
  taskDevBuildPreFlightArgs,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile
}

async function taskDevBuildPreFlightArgs(berun) {
  // Process CLI arguments

  const argv = process.argv.slice(2)

  berun.sparkyContext.debug = argv.indexOf('--debug') !== -1

  berun.sparkyContext.isInteractive = process.stdout.isTTY
}

async function taskDevBuildPreFlightChecks(berun) {
  if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
    verifyPackageTree()
    // Warn and crash if required files are missing
    if (
      !checkRequiredFiles([
        //  berun.options.paths.appHtml,
        berun.options.paths.appIndexJs
      ])
    ) {
      process.exit(1)
    }
  }

  if (process.env.HOST) {
    console.log(
      chalk.cyan(
        `Attempting to bind to HOST environment variable: ${chalk.yellow(
          chalk.bold(process.env.HOST)
        )}`
      )
    )
    console.log(
      `If this was unintentional, check that you haven't mistakenly set it in your shell.`
    )
    console.log(
      `Learn more here: ${chalk.yellow('http://bit.ly/CRA-advanced-config')}`
    )
    console.log()
  }

  // We require that you explictly set browsers and do not fall back to
  // browserslist defaults.

  await checkBrowsers(berun.options.paths.appPath)
}

async function taskDevBuildGetPort(berun) {
  // Tools like Cloud9 rely on this.
  const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  const HOST = process.env.HOST || '0.0.0.0'

  const port = await choosePort(HOST, DEFAULT_PORT)

  if (port === null) {
    throw new Error('Could not find a suitable port')
  }

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'

  berun.sparkyContext.url = { protocol, HOST, port }
}

async function taskDevBuildCompile(berun: Berun) {
  const { protocol, port } = berun.sparkyContext.url

  fs.emptyDirSync(berun.options.paths.appBuild)

  const fuse = fuseCreate(berun, port)

  const host = process.env.HOST || 'localhost'

  if (berun.sparkyContext.isInteractive) {
    clearConsole()
  }

  try {
    await fuseRun(fuse)
    console.log(chalk.cyan(`Started the development server...`))
    console.log()
    openBrowser(`${protocol}://${host}:${port}/`)
  } catch (err) {
    console.log('Failed during development hosting')
    process.exit(1)
    throw err
  }

  return new Promise((resolve, _) => {
    ;['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig as any, () => {
        //  TODO: fuse devServer.close()
        resolve()
      })
    })
  })
}
