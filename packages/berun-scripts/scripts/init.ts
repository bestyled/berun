// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
import * as fs from 'fs-extra'
import * as path from 'path'
import * as chalk from 'chalk'
import { execSync } from 'child_process'
import * as spawn from 'cross-spawn'
import { defaultBrowsers } from 'react-dev-utils/browsersHelper'
import * as os from 'os'

process.on('unhandledRejection', err => {
  throw err
})

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function tryGitInit(appPath) {
  let didInit = false
  try {
    execSync('git --version', { stdio: 'ignore' })
    if (isInGitRepository() || isInMercurialRepository()) {
      return false
    }

    execSync('git init', { stdio: 'ignore' })
    didInit = true

    execSync('git add -A', { stdio: 'ignore' })
    execSync('git commit -m "Initial commit from Create React App"', {
      stdio: 'ignore'
    })
    return true
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, '.git'))
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false
  }
}

export default function init(
  appPath,
  appName,
  verbose,
  originalDirectory,
  template
) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name
  const ownPath = path.join(appPath, 'node_modules', ownPackageName)
  const appPackage = require(path.join(appPath, 'package.json'))
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'))

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {}
  appPackage.devDependencies = {
    [ownPackageName]: appPackage.devDependencies[ownPackageName]
  }

  // Setup the script rules
  appPackage.scripts = {
    start: 'berun-scripts start',
    build: 'berun-scripts build',
    test: 'berun-scripts test --env=jsdom',
    eject: 'berun-scripts eject'
  }

  appPackage.browserslist = defaultBrowsers

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  )

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'))
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    )
  }

  // Copy the files for the user
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, 'template')
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath, {
      filter: src => {
        return src.indexOf('package.json') === -1
      }
    })

    const templatePackagePath = path.resolve(templatePath, 'package.json')
    const { devDependencies } = require(templatePackagePath)
    delete devDependencies[ownPackageName]

    if (devDependencies) {
      Object.assign(appPackage.devDependencies, devDependencies)
    }

    const { resolutions } = require(templatePackagePath)

    if (resolutions) {
      appPackage.resolutions = Object.assign(
        appPackage.resolutions || {},
        resolutions
      )
    }

    const { scripts } = require(templatePackagePath)

    if (scripts) {
      appPackage.scripts = Object.assign(appPackage.scripts || {}, scripts)
    }

    fs.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(appPackage, null, 2) + os.EOL
    )
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    )
    return
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore')
    )
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'))
      fs.appendFileSync(path.join(appPath, '.gitignore'), data)
      fs.unlinkSync(path.join(appPath, 'gitignore'))
    } else {
      throw err
    }
  }

  let command
  let args

  if (useYarn) {
    command = 'yarnpkg'
    args = ['add']
  } else {
    command = 'npm'
    args = ['install', '--save', verbose && '--verbose'].filter(e => e)
  }
  args.push('react', 'react-dom')

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  )
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`
      })
    )
    fs.unlinkSync(templateDependenciesPath)
  }

  // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with @berun/react-scripts
  // or template is presetend (via --internal-testing-template)
  if (!isReactInstalled(appPackage) || template) {
    console.log(`Installing remaining dependencies using ${command}...`)
    console.log()

    const proc = spawn.sync(command, args, { stdio: 'inherit' })
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`)
      return
    }
  }

  if (tryGitInit(appPath)) {
    console.log()
    console.log('Initialized a git repository.')
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm'

  console.log()
  console.log(`Success! Created ${appName} at ${appPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} start`))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`))
  console.log('    Bundles the app into static files for production.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} test`))
  console.log('    Starts the test runner.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`))
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  )
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  )
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`)
  if (readmeExists) {
    console.log()
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    )
  }
  console.log()
  console.log('Happy hacking!')
}

function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {}

  return (
    typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined'
  )
}