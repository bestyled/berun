'use strict'
const chalk = require('chalk')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const { checkBrowsers } = require('react-dev-utils/browsersHelper')
const verifyPackageTree = require('./utils/verifyPackageTree')

const { fuseCreate, fuseRun } = require('./utils/fuse')
const fs = require('fs-extra')

// MAIN MODULE EXPORTS, WITH DEFAULT FLOW

module.exports = async berun => {
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

module.exports = Object.assign(module.exports, {
  taskDevBuildPreFlightArgs,
  taskDevBuildPreFlightChecks,
  taskDevBuildGetPort,
  taskDevBuildCompile
})

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
  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
  const HOST = process.env.HOST || '0.0.0.0'

  const port = await choosePort(HOST, DEFAULT_PORT)

  if (port == null) {
    throw new Error('Could not find a suitable port')
  }

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'

  berun.sparkyContext.url = { protocol, HOST, port }
}

function taskDevBuildCompile(berun) {
  const { protocol, port } = berun.sparkyContext.url

  const appName = require(berun.options.paths.appPackageJson).name

  fs.emptyDirSync(berun.options.paths.appBuild)

  process.env.NODE_ENV =
    process.env.NODE_ENV || this.isProduction ? 'production' : 'development'

  const fuse = fuseCreate(berun, port)

  const host = process.env.HOST || 'localhost'

  if (berun.sparkyContext.isInteractive) {
    clearConsole()
  }

  return new Promise((resolve, reject) => {
    fuseRun(fuse)
      .then(function() {
        process.nextTick(() => {
          console.log(chalk.cyan(`Started the development server...`))
          console.log()
          openBrowser(protocol + '://' + host + ':' + port + '/')
        })
      })
      .catch(function(err) {
        console.log('Failed during development hosting')
        reject(err)
        process.exit(1)
      })
    ;['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        //  TODO: fuse devServer.close()
        resolve()
      })
    })
  })
}
