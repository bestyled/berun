import * as path from 'path'
import * as fs from 'fs-extra'
import * as glob from 'glob'
import walkDependencies from './lib-walkdependencies'

export interface PackageOptions {
  basedir: string
  externals: string[]
  shallowOnly: boolean
}

export default function processPackage(options: PackageOptions) {
  const { packageJSON, packages } = walkDependencies(options, null)

  const { packages: packagesLib } = walkDependencies(
    {
      ...options,
      files: glob
        .sync('{lib,scripts}/**.{ts,js,tsx,jsx}', { cwd: options.basedir })
        .map(filename => path.join(options.basedir, filename))
    },
    null
  )

  const { packages: packagesDev } = walkDependencies(
    {
      ...options,
      files: glob
        .sync('{test,config}/**.{ts,js,tsx,jsx}', { cwd: options.basedir })
        .map(filename => path.join(options.basedir, filename))
    },
    null
  )

  const existingDependencies = packageJSON.dependencies || {}
  const existingPeerDependencies = packageJSON.peerDependencies || {}
  const existingDevDependencies = packageJSON.devDependencies || {}

  const dependencies = {}
  const peerDependencies = {}
  const devDependencies = {}

  const myname = packageJSON.name

  Object.keys(packages)
    .filter(key => key !== myname)
    .sort()
    .forEach(key => {
      const pkg = packages[key]
      if (pkg._inWorkspace) {
        dependencies[key] = `^${pkg.version}`
      } else if (
        key in existingPeerDependencies ||
        (['react', 'react-dom'].indexOf(key) > -1 &&
          !(key in existingDependencies))
      ) {
        const prefix =
          (existingPeerDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] ||
          ''
        peerDependencies[key] = prefix + pkg.version
      } else {
        const prefix =
          (existingDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] || ''

        dependencies[key] = prefix + pkg.version
      }
    })

  Object.keys(packagesLib)
    .filter(key => key !== myname)
    .sort()
    .forEach(key => {
      const pkg = packagesLib[key]
      if (pkg._inWorkspace) {
        dependencies[key] = `^${pkg.version}`
      } else if (
        key in existingPeerDependencies ||
        (['react', 'react-dom'].indexOf(key) > -1 &&
          !(key in existingDependencies))
      ) {
        const prefix =
          (existingPeerDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] ||
          ''
        peerDependencies[key] = prefix + pkg.version
      } else {
        const prefix =
          (existingDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] || ''

        dependencies[key] = prefix + pkg.version
      }
    })

  Object.keys(packagesDev)
    .filter(key => key !== myname)
    .filter(key => !(key in packages))
    .sort()
    .forEach(key => {
      const pkg = packagesDev[key]

      if (key in existingDependencies) {
        const prefix =
          (existingDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] || ''
        dependencies[key] = prefix + pkg.version
      } else if (pkg._inWorkspace) {
        devDependencies[key] = `^${pkg.version}`
      } else if (
        key in existingPeerDependencies ||
        (['react', 'react-dom'].indexOf(key) > -1 &&
          !(key in existingDependencies))
      ) {
        const prefix =
          (existingPeerDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] ||
          ''
        peerDependencies[key] = prefix + pkg.version
      } else {
        const prefix =
          (existingDevDependencies[key] || '^0').match(/^([^0-9*]*).*/)[1] || ''

        devDependencies[key] = prefix + pkg.version
      }
    })

  Object.keys(existingDevDependencies).forEach(key => {
    try {
      const devpackageJsonFile = require.resolve(`${key}/package.json`)
      const devJsonVersion = require(devpackageJsonFile).version.replace(
        /^v/,
        ''
      )
      if (/[/\\]node_modules[/\\]/.test(devpackageJsonFile)) {
        const prefix =
          (existingDevDependencies[key] || '^0').match(/^([^0-9]*).*/)[1] || ''
        devDependencies[key] = prefix + devJsonVersion
      } else {
        devDependencies[key] = `^${devJsonVersion}`
      }
    } catch (ex) {
      console.log(`Could not find devDependency ${key}`)
    }
  })

  delete packageJSON.devDependencies
  delete packageJSON.dependencies
  delete packageJSON.peerDependencies
  delete packageJSON.gitHead

  const sortedPackageJSON = Object.keys(packageJSON)
    .sort()
    .reduce((accum, key) => {
      accum[key] = packageJSON[key]
      return accum
    }, {})

  const newPackageJSON = {
    name: packageJSON.name,
    version: packageJSON.version || '',
    description: packageJSON.description || undefined,
    main: packageJSON.main || undefined,
    'ts:main': packageJSON['ts:main'] || undefined,
    module: packageJSON.module || undefined,
    types: packageJSON.types || undefined,
    ...sortedPackageJSON,
    dependencies,
    devDependencies,
    peerDependencies
  }

  fs.writeFileSync(
    path.join(options.basedir, 'package.json'),
    JSON.stringify(newPackageJSON, null, 2)
  )
}
