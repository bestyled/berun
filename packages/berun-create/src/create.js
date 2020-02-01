/* eslint-disable */
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * Portions Copyright (c) 2018-present, BeRun contributors
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// berun-create is installed globally on people's computers. This means
// that it is extremely difficult to have them upgrade the version and
// because there's only one global version installed, it is very prone to
// breaking changes.
//
// The only job of berun-create is to init the repository and then
// forward all the commands to the local version of berun-create.
//
// If you need to add a new command, please add it to the scripts/ folder.
//
// The only reason to modify this file is to add more warnings and
// troubleshooting information for the `berun-create` command.
//
// Do not make breaking changes! We absolutely don't want to have to
// tell people to update their global version of berun-create.
//
// Also be careful with new language features.
// This file must work on Node 6+.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const validateProjectName = require('validate-npm-package-name')
const chalk = require('chalk')
const commander = require('commander')
const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
const spawn = require('cross-spawn')
const semver = require('semver')
const dns = require('dns')
const tmp = require('tmp')
const { unpack } = require('tar-pack')
const url = require('url')
const hyperquest = require('hyperquest')
const envinfo = require('envinfo')
const os = require('os')
const { findMonorepo } = require('react-dev-utils/workspaceUtils')
const packageJson = require('./package.json')

const DEFAULT_TEMPLATE =
  process.env.REACT_SCRIPTS_TEMPLATE || '@berun/template-react'

// These files should be allowed to remain on a failed install,
// but then silently removed during the next create.
const errorLogFilePatterns = [
  'npm-debug.log',
  'yarn-error.log',
  'yarn-debug.log'
]

let projectName

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name
  })
  .option('--verbose', 'print additional logs')
  .option('--info', 'print environment debug info')
  .option(
    '--scripts-version <alternative-package>',
    'use a non-standard version of @berun/scripts'
  )
  .option(
    '--template <npm-or-git-path-to-template>',
    'use a non-standard version of template'
  )
  .option('--use-npm')
  .allowUnknownOption()
  .on('--help', () => {
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`)
    console.log()
    console.log(
      `    A custom ${chalk.cyan('--scripts-version')} can be one of:`
    )
    console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`)
    console.log(`      - a specific npm tag: ${chalk.green('@next')}`)
    console.log(
      `      - a custom fork published on npm: ${chalk.green(
        'my-berun-scripts'
      )}`
    )
    console.log(
      `      - a local path relative to the current working directory: ${chalk.green(
        'file:../my-berun-scripts'
      )}`
    )
    console.log(
      `      - a .tgz archive: ${chalk.green(
        'https://mysite.com/my-berun-scripts-0.8.2.tgz'
      )}`
    )
    console.log(
      `      - a .tar.gz archive: ${chalk.green(
        'https://mysite.com/my-berun-scripts-0.8.2.tar.gz'
      )}`
    )
    console.log(
      `    It is not needed unless you specifically want to use a fork.`
    )
    console.log()
    console.log(
      `    If you have any problems, do not hesitate to file an issue:`
    )
    console.log(
      `      ${chalk.cyan('https://github.com/bestyled/berun/issues/new')}`
    )
    console.log()
  })
  .parse(process.argv)

if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'))
  return envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmPackages: ['react', 'react-dom', '@berun/scripts'],
        npmGlobalPackages: ['@berun/create']
      },
      {
        clipboard: true,
        duplicates: true,
        showNotFound: true
      }
    )
    .then(console.log)
    .then(() => console.log(chalk.green('Copied To Clipboard!\n')))
}

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:')
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  )
  console.log()
  console.log('For example:')
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`)
  console.log()
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  )
  process.exit(1)
}

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`))
    })
  }
}

createApp(
  projectName,
  program.verbose,
  program.scriptsVersion,
  program.useNpm,
  program.template
)

function createApp(name, verbose, version, useNpm, template) {
  const root = path.resolve(name)
  const appName = path.basename(root)

  checkAppName(appName)
  fs.ensureDirSync(name)
  if (!isSafeToCreateProjectIn(root, name)) {
    process.exit(1)
  }

  console.log(`Creating a new React app in ${chalk.green(root)}.`)
  console.log()

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true
  }
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  )

  const useYarn = useNpm ? false : shouldUseYarn(root)
  const originalDirectory = process.cwd()
  process.chdir(root)
  if (!useYarn && !checkThatNpmCanReadCwd()) {
    process.exit(1)
  }

  prerun(
    root,
    appName,
    version,
    verbose,
    originalDirectory,
    template || DEFAULT_TEMPLATE,
    useYarn
  )
}

function isYarnAvailable() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function shouldUseYarn(appDir) {
  const mono = findMonorepo(appDir)
  return (mono.isYarnWs && mono.isAppIncluded) || isYarnAvailable()
}

function install(root, useYarn, dependencies, verbose, isOnline, dev) {
  return new Promise((resolve, reject) => {
    let command
    let args
    if (useYarn) {
      command = 'yarnpkg'
      args = ['add', '--exact']
      if (!isOnline) {
        args.push('--offline')
      }
      if (dev) {
        args.push('--dev')
      }
      ;[].push.apply(args, dependencies)

      // Explicitly set cwd() to work around issues like
      // https://github.com/facebook/create-react-app/issues/3326.
      // Unfortunately we can only do this for Yarn because npm support for
      // equivalent --prefix flag doesn't help with this issue.
      // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
      args.push('--cwd')
      args.push(root)

      if (!isOnline) {
        console.log(chalk.yellow('You appear to be offline.'))
        console.log(chalk.yellow('Falling back to the local Yarn cache.'))
        console.log()
      }
    } else {
      command = 'npm'
      args = [
        'install',
        dev ? '--save-dev' : '--save',
        '--save-exact',
        '--loglevel',
        'error'
      ].concat(dependencies)
    }

    if (verbose) {
      args.push('--verbose')
    }

    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        })
        return
      }
      resolve()
    })
  })
}
function abort(root, appName, reason) {
  console.log()
  console.log('Aborting installation.')
  if (reason.command) {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`)
  } else {
    console.log(chalk.red('Unexpected error. Please report it as a bug:'))
    console.log(reason)
  }
  console.log()

  // On 'exit' we will delete these files from target directory.
  const knownGeneratedFiles = ['package.json', 'node_modules', 'yarn.lock']
  const currentFiles = fs.readdirSync(path.join(root))
  currentFiles.forEach(file => {
    knownGeneratedFiles.forEach(fileToMatch => {
      // This remove all of knownGeneratedFiles.
      if (file === fileToMatch) {
        console.log(`Deleting generated file... ${chalk.cyan(file)}`)
        fs.removeSync(path.join(root, file))
      }
    })
  })
  const remainingFiles = fs.readdirSync(path.join(root))
  if (!remainingFiles.length) {
    // Delete target folder if empty
    console.log(
      `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
        path.resolve(root, '..')
      )}`
    )
    process.chdir(path.resolve(root, '..'))
    fs.removeSync(path.join(root))
  }
  console.log('Done.')
  process.exit(1)
}

// ADDED FOR BERUN CREATE TO INSTALL CUSTOM TEMPLATES FROM NPM
function prerun(
  root,
  appName,
  version,
  verbose,
  originalDirectory,
  template,
  useYarn
) {
  if (template) {
    console.log(`Getting template ${chalk.cyan(template)}...`)

    install(root, useYarn, [template], verbose, checkIfOnline(useYarn), true)
      .then(() => {
        const packagePath = path.resolve(process.cwd(), 'package.json')

        const templatePackage = Object.keys(
          require(packagePath).devDependencies
        )[0]

        /* // rewrite without devDependencies
      delete packageJson['devDependencies'];
      fs.writeFileSync(
        path.join(packagePath),
        JSON.stringify(packageJson, null, 2)
      ); */

        // do not cache as we will be adding to package.json
        delete require.cache[require.resolve(packagePath)]

        const pathToTemplate = path.relative(
          originalDirectory,
          path.resolve(process.cwd(), 'node_modules', templatePackage)
        )

        console.log(`Installed template ${chalk.cyan(templatePackage)}.`)
        console.log()

        run(
          root,
          appName,
          version,
          verbose,
          originalDirectory,
          pathToTemplate,
          useYarn
        )
      })
      .catch(reason => abort(root, appName, reason))
  } else {
    run(root, appName, version, verbose, originalDirectory, null, useYarn)
  }
}

function run(
  root,
  appName,
  version,
  verbose,
  originalDirectory,
  template,
  useYarn
) {
  const packageToInstall = getInstallPackage(version, originalDirectory)
  const allDependencies = ['react', 'react-dom']

  console.log('Installing packages. This might take a couple of minutes.')
  getPackageName(packageToInstall)
    .then(packageName =>
      checkIfOnline(useYarn).then(isOnline => ({
        isOnline,
        packageName
      }))
    )
    .then(info => {
      const { isOnline } = info
      console.log(
        `Installing ${chalk.cyan('react')}, ${chalk.cyan('react-dom')}`
      )
      console.log()

      return install(
        root,
        useYarn,
        allDependencies,
        verbose,
        isOnline,
        false
      ).then(() => info)
    })
    .then(info => {
      const { isOnline } = info
      const { packageName } = info
      console.log(`Installing ${chalk.cyan(packageName)}...`)
      console.log()

      return install(
        root,
        useYarn,
        [packageToInstall],
        verbose,
        isOnline,
        true
      ).then(() => packageName)
    })
    .then(packageName => {
      checkNodeVersion(packageName)
      setCaretRangeForRuntimeDeps(packageName)

      const scriptsPath = path.resolve(
        process.cwd(),
        'node_modules',
        packageName,
        'scripts',
        'init.js'
      )
      const init = require(scriptsPath)
      init(root, appName, verbose, originalDirectory, template)
    })
    .catch(reason => {
      abort(root, appName, reason)
    })
}

function getInstallPackage(version, originalDirectory) {
  let packageToInstall = '@berun/scripts'
  const validSemver = semver.valid(version)
  if (validSemver) {
    packageToInstall += `@${validSemver}`
  } else if (version) {
    if (version[0] === '@' && version.indexOf('/') === -1) {
      packageToInstall += version
    } else if (version.match(/^file:/)) {
      packageToInstall = `file:${path.resolve(
        originalDirectory,
        version.match(/^file:(.*)?$/)[1]
      )}`
    } else {
      // for tar.gz or alternative paths
      packageToInstall = version
    }
  }
  return packageToInstall
}

function getTemporaryDirectory() {
  return new Promise((resolve, reject) => {
    // Unsafe cleanup lets us recursively delete the directory if it contains
    // contents; by default it only allows removal if it's empty
    tmp.dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          tmpdir,
          cleanup: () => {
            try {
              callback()
            } catch (ignored) {
              // Callback might throw and fail, since it's a temp directory the
              // OS will clean it up eventually...
            }
          }
        })
      }
    })
  })
}

function extractStream(stream, dest) {
  return new Promise((resolve, reject) => {
    stream.pipe(
      unpack(dest, err => {
        if (err) {
          reject(err)
        } else {
          resolve(dest)
        }
      })
    )
  })
}

// Extract package name from tarball url or path.
function getPackageName(installPackage) {
  if (installPackage.match(/^.+\.(tgz|tar\.gz)$/)) {
    return getTemporaryDirectory()
      .then(obj => {
        let stream
        if (/^http/.test(installPackage)) {
          stream = hyperquest(installPackage)
        } else {
          stream = fs.createReadStream(installPackage)
        }
        return extractStream(stream, obj.tmpdir).then(() => obj)
      })
      .then(obj => {
        const packageName = require(path.join(obj.tmpdir, 'package.json')).name
        obj.cleanup()
        return packageName
      })
      .catch(err => {
        // The package name could be with or without semver version, e.g. @berun/scripts-0.2.0-alpha.1.tgz
        // However, this function returns package name only without semver version.
        console.log(
          `Could not extract the package name from the archive: ${err.message}`
        )
        const assumedProjectName = installPackage.match(
          /^.+\/(.+?)(?:-\d+.+)?\.(tgz|tar\.gz)$/
        )[1]
        console.log(
          `Based on the filename, assuming it is "${chalk.cyan(
            assumedProjectName
          )}"`
        )
        return Promise.resolve(assumedProjectName)
      })
  }
  if (installPackage.indexOf('git+') === 0) {
    // Pull package name out of git urls e.g:
    // git+https://github.com/mycompany/my-berun-scripts.git
    // git+ssh://github.com/mycompany/my-berun-scripts.git#v1.2.3
    return Promise.resolve(installPackage.match(/([^/]+)\.git(#.*)?$/)[1])
  }
  if (installPackage.match(/.+@/)) {
    // Do not match @scope/ when stripping off @version or @tag
    return Promise.resolve(
      installPackage.charAt(0) + installPackage.substr(1).split('@')[0]
    )
  }
  if (installPackage.match(/^file:/)) {
    const installPackagePath = installPackage.match(/^file:(.*)?$/)[1]
    const installPackageJson = require(path.join(
      installPackagePath,
      'package.json'
    ))
    return Promise.resolve(installPackageJson.name)
  }
  return Promise.resolve(installPackage)
}

function checkNpmVersion() {
  let hasMinNpm = false
  let npmVersion = null
  try {
    npmVersion = execSync('npm --version')
      .toString()
      .trim()
    hasMinNpm = semver.gte(npmVersion, '3.0.0')
  } catch (err) {
    // ignore
  }
  return {
    hasMinNpm,
    npmVersion
  }
}

function checkNodeVersion(packageName) {
  const packageJsonPath = path.resolve(
    process.cwd(),
    'node_modules',
    packageName,
    'package.json'
  )
  const packageJson = require(packageJsonPath)
  if (!packageJson.engines || !packageJson.engines.node) {
    return
  }

  if (!semver.satisfies(process.version, packageJson.engines.node)) {
    console.error(
      chalk.red(
        'You are running Node %s.\n' +
          'berun-create requires Node %s or higher. \n' +
          'Please update your version of Node.'
      ),
      process.version,
      packageJson.engines.node
    )
    process.exit(1)
  }
}

function checkAppName(appName) {
  const validationResult = validateProjectName(appName)
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${appName}"`
      )} because of npm naming restrictions:`
    )
    printValidationResults(validationResult.errors)
    printValidationResults(validationResult.warnings)
    process.exit(1)
  }

  // TODO: there should be a single place that holds the dependencies
  const dependencies = ['react', 'react-dom', '@berun/scripts'].sort()
  if (dependencies.indexOf(appName) >= 0) {
    console.error(
      chalk.red(
        `We cannot create a project called ${chalk.green(
          appName
        )} because a dependency with the same name exists.\n` +
          `Due to the way npm works, the following names are not allowed:\n\n`
      ) +
        chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
        chalk.red('\n\nPlease choose a different project name.')
    )
    process.exit(1)
  }
}

function makeCaretRange(dependencies, name) {
  const version = dependencies[name]

  if (typeof version === 'undefined') {
    console.error(chalk.red(`Missing ${name} dependency in package.json`))
    process.exit(1)
  }

  let patchedVersion = `^${version}`

  if (!semver.validRange(patchedVersion)) {
    console.error(
      `Unable to patch ${name} dependency version because version ${chalk.red(
        version
      )} will become invalid ${chalk.red(patchedVersion)}`
    )
    patchedVersion = version
  }

  dependencies[name] = patchedVersion
}

function setCaretRangeForRuntimeDeps(packageName) {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = require(packagePath)

  if (typeof packageJson.dependencies === 'undefined') {
    console.error(chalk.red('Missing dependencies in package.json'))
    process.exit(1)
  }

  const packageVersion = packageJson.devDependencies[packageName]
  if (typeof packageVersion === 'undefined') {
    console.error(chalk.red(`Unable to find ${packageName} in package.json`))
    process.exit(1)
  }

  makeCaretRange(packageJson.dependencies, 'react')
  makeCaretRange(packageJson.dependencies, 'react-dom')

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + os.EOL)
}

// If project only contains files generated by GH, it’s safe.
// Also, if project contains remnant error logs from a previous
// installation, lets remove them now.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root, name) {
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    'web.iml',
    '.hg',
    '.hgignore',
    '.hgcheck',
    '.npmignore',
    'mkdocs.yml',
    'docs',
    '.travis.yml',
    '.gitlab-ci.yml',
    '.gitattributes'
  ]
  console.log()

  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validFiles.includes(file))
    // Don't treat log files from previous installation as conflicts
    .filter(
      file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0)
    )

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    )
    console.log()
    for (const file of conflicts) {
      console.log(`  ${file}`)
    }
    console.log()
    console.log(
      'Either try using a new directory name, or remove the files listed above.'
    )

    return false
  }

  // Remove any remnant files from a previous installation
  const currentFiles = fs.readdirSync(path.join(root))
  currentFiles.forEach(file => {
    errorLogFilePatterns.forEach(errorLogFilePattern => {
      // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(root, file))
      }
    })
  })
  return true
}

function getProxy() {
  if (process.env.https_proxy) {
    return process.env.https_proxy
  }
  try {
    // Trying to read https-proxy from .npmrc
    const httpsProxy = execSync('npm config get https-proxy')
      .toString()
      .trim()
    return httpsProxy !== 'null' ? httpsProxy : undefined
  } catch (e) {}
}
function checkThatNpmCanReadCwd() {
  const cwd = process.cwd()
  let childOutput = null
  try {
    // Note: intentionally using spawn over exec since
    // the problem doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    childOutput = spawn.sync('npm', ['config', 'list']).output.join('')
  } catch (err) {
    // Something went wrong spawning node.
    // Not great, but it means we can't do this check.
    // We might fail later on, but let's continue.
    return true
  }
  if (typeof childOutput !== 'string') {
    return true
  }
  const lines = childOutput.split('\n')
  // `npm config list` output includes the following line:
  // "; cwd = C:\path\to\current\dir" (unquoted)
  // I couldn't find an easier way to get it.
  const prefix = '; cwd = '
  const line = lines.find(line => line.indexOf(prefix) === 0)
  if (typeof line !== 'string') {
    // Fail gracefully. They could remove it.
    return true
  }
  const npmCWD = line.substring(prefix.length)
  if (npmCWD === cwd) {
    return true
  }
  console.error(
    chalk.red(
      `Could not start an npm process in the right directory.\n\n` +
        `The current directory is: ${chalk.bold(cwd)}\n` +
        `However, a newly started npm process runs in: ${chalk.bold(
          npmCWD
        )}\n\n` +
        `This is probably caused by a misconfigured system terminal shell.`
    )
  )
  if (process.platform === 'win32') {
    console.error(
      `${chalk.red(
        `On Windows, this can usually be fixed by running:\n\n`
      )}  ${chalk.cyan(
        'reg'
      )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
        `  ${chalk.cyan(
          'reg'
        )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n${chalk.red(
          `Try to run the above two lines in the terminal.\n`
        )}${chalk.red(
          `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
        )}`
    )
  }
  return false
}

function checkIfOnline(useYarn) {
  if (!useYarn) {
    // Don't ping the Yarn registry.
    // We'll just assume the best case.
    return Promise.resolve(true)
  }

  return new Promise(resolve => {
    dns.lookup('registry.yarnpkg.com', err => {
      let proxy
      if (err != null && (proxy = getProxy())) {
        // If a proxy is defined, we likely can't resolve external hostnames.
        // Try to resolve the proxy name as an indication of a connection.
        dns.lookup(url.parse(proxy).hostname, proxyErr => {
          resolve(proxyErr == null)
        })
      } else {
        resolve(err == null)
      }
    })
  })
}
