/* eslint-disable prefer-destructuring */
/* eslint-disable no-continue */
import * as path from 'path'
import * as fs from 'fs-extra'
import * as precinct from 'precinct'
import * as ts from 'typescript'
import * as resolve from 'resolve'
import * as terser from 'terser'
import * as chalk from 'chalk'

const nameCache = {}
const cwd = process.cwd()
let rootdir = path.resolve(process.cwd(), '..')

if (fs.existsSync(path.join(rootdir, '.meta'))) {
  console.log(`Processing meta repository from ./${path.basename(cwd)}`)
} else {
  rootdir = path.resolve(process.cwd(), '..', '..')
  if (fs.existsSync(path.join(rootdir, '.meta'))) {
    console.log(
      `Processing meta repository from ./${path.relative(rootdir, cwd)}`
    )
  } else {
    console.log(`Processing non-meta repository ${path.basename(cwd)}`)
    rootdir = cwd
  }
}

const _getDependencies = function _getDependencies({
  filename,
  dependencyCache,
  basedir,
  sourcefiles,
  externals,
  packages,
  inlineSourceMap,
  minify,
  shallowOnly
}) {
  let dependencies
  let transpiledCode
  let transpiledMap
  let code
  try {
    code = fs.readFileSync(filename, 'utf8')
  } catch (ex) {
    console.error(
      `could not resolve ${chalk.redBright(
        path.relative(basedir, filename)
      )} from ${chalk.cyan(basedir)}`
    )
    process.exit(1)
  }
  const basename = path.basename(filename)

  try {
    if (/\.tsx?$/.test(filename) && !/\.d\.ts$/.test(filename)) {
      const tsresult = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2015,
          module: ts.ModuleKind.CommonJS,
          jsx: /\.tsx$/.test(filename) ? ts.JsxEmit.React : undefined,
          lib: ['esnext'],
          strict: true,
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          removeComments: true,
          inlineSourceMap,
          sourceMap: inlineSourceMap ? undefined : true,
          sourceRoot: `file:///${path.relative(
            rootdir,
            path.dirname(filename)
          )}`
        },
        fileName: filename,
        moduleName: basename
      })

      transpiledMap = inlineSourceMap ? undefined : tsresult.sourceMapText
      transpiledCode = tsresult.outputText.replace(
        /require\.resolve\(/g,
        'require('
      )
      dependencies = precinct(transpiledCode, {
        type: 'commonjs',
        includeCore: false
      } as any)

      try {
        dependencies = dependencies.concat(
          precinct.paperwork(filename, {
            includeCore: false
          })
        )
      } catch (ex) {
        console.error(ex)
      }
    } else if (/\.d\.ts$/.test(filename)) {
      try {
        dependencies = precinct.paperwork(filename, {
          includeCore: false
        })
        transpiledCode = code
      } catch (ex) {
        console.log(
          `error getting dependencies for typescript definition ${chalk.redBright(
            filename
          )}: ${chalk.gray(ex.message)}`
        )
        throw ex
      }
    } else {
      transpiledCode = code.replace(/require\.resolve\(/g, 'require(')
      dependencies = precinct(transpiledCode, {
        includeCore: false
      } as any)
    }
  } catch (e) {
    console.error(`${path.basename(filename)}: ${e.message}`)
    try {
      dependencies = precinct.paperwork(filename, {
        includeCore: false
      })
      transpiledCode = code
    } catch (ex) {
      console.log(
        `error getting dependencies for ${chalk.redBright(
          filename
        )}: ${chalk.gray(ex.message)}`
      )
      throw ex
    }
  }

  if (minify) {
    try {
      const terserresult = terser.minify(
        { [filename]: transpiledCode },
        {
          compress: true,
          mangle: true,
          toplevel: true,
          nameCache,
          sourceMap: {
            content: transpiledMap,
            url: inlineSourceMap
              ? 'inline'
              : `${basename.replace(/\.tsx?$/, '.js')}.map`
          }
        }
      )
      if (terserresult && terserresult.code) {
        transpiledCode = terserresult.code
        transpiledMap = inlineSourceMap ? null : terserresult.map
      }
    } catch (ex) {
      console.error(filename)
      console.log(`error minifying code with terser: ${chalk.gray(ex.message)}`)
      throw ex
    }
  }

  const resolvedDependencies = []
  const shallowDependencies = []

  for (let i = 0, l = dependencies.length; i < l; i++) {
    const dep = dependencies[i]

    let dependency = dep
      .split('?')[0]
      .replace(/^!/, '')
      .split('!')[0]

    if (externals.indexOf(dependency) > -1) {
      continue
    }

    if (dep[0] === '.') {
      dependency = path.resolve(path.dirname(filename), dep)
    } else if (
      shallowOnly &&
      /(^[^./]*$)|(^@[^./]*\/[^./]*$)/.test(dependency)
    ) {
      dependency += '/package.json'
    } else if (dep[0] === '!') {
      dependency = dep.split('!')[2]
    } else if (dep.startsWith('worker-loader?')) {
      continue
    }

    if (dependencyCache[dependency]) {
      continue
    }

    dependencyCache[dependency] = true

    let resolvedFilename = commonJSLookup({
      dependency,
      filename,
      basedir,
      packages
    })

    if (!resolvedFilename && dep[0] === '.') {
      resolvedFilename = commonJSLookup({
        dependency: `${dependency}/index`,
        filename,
        basedir,
        packages
      })
    }

    if (sourcefiles.indexOf(resolvedFilename) !== -1) {
      continue
    }

    if (!resolvedFilename) {
      console.error(`skipping an empty filepath resolution for partial: ${dep}`)
      continue
    }

    const exists = fs.existsSync(resolvedFilename)

    if (!exists) {
      console.error(
        `skipping non-empty but non-existent resolution: ${chalk.redBright(
          resolvedFilename
        )} for partial: ${chalk.cyan(dep)}`
      )
      continue
    }

    if (dep[0] === '.') {
      shallowDependencies.push(resolvedFilename)
    }

    resolvedDependencies.push(resolvedFilename)
    sourcefiles.push(resolvedFilename)
  }

  return [
    resolvedDependencies,
    shallowDependencies,
    transpiledCode,
    transpiledMap
  ]
}

function traverse(
  {
    filename,
    basedir,
    visited,
    dependencyCache,
    sourcefiles,
    builddir,
    externals,
    packages,
    inlineSourceMap,
    minify,
    shallowOnly
  },
  callback
) {
  if (visited[filename]) {
    return
  }

  visited[filename] = true

  const [dependencies, shallowDependencies, code, map] = _getDependencies({
    filename,
    dependencyCache,
    basedir,
    sourcefiles,
    externals,
    packages,
    inlineSourceMap,
    minify,
    shallowOnly
  })

  if (callback) {
    callback({
      builddir,
      srcfile: filename,
      code,
      map,
      basedir
    })
  }

  const childDependencies = shallowOnly ? shallowDependencies : dependencies

  for (let i = 0, l = childDependencies.length; i < l; i++) {
    const d = childDependencies[i]
    traverse(
      {
        filename: d,
        basedir,
        visited,
        dependencyCache,
        sourcefiles,
        externals,
        builddir,
        packages,
        inlineSourceMap,
        minify,
        shallowOnly
      },
      callback
    )
  }
}

function commonJSLookup({
  dependency,
  basedir,
  packages
}: {
  dependency: string
  filename: string
  basedir: string
  packages: { [key: string]: any }
}) {
  let resolvedFilename = ''

  function packageFilter(packageJson, pkgfile) {
    if (packages[packageJson.name]) {
      return packages[packageJson.name]
    }

    if (packageJson.name === 'functions') {
      return packageJson
    }

    pkgfile = fs.realpathSync(pkgfile)

    packageJson._main = packageJson.main

    if (!/[/\\]node_modules[/\\]/.test(pkgfile)) {
      packageJson._inWorkspace = true
      packageJson.main =
        packageJson['ts:main'] ||
        packageJson.main ||
        packageJson.module ||
        'index.js'
    } else {
      packageJson.main = packageJson.main || packageJson.module || 'index.js'
      packageJson['ts:main'] = undefined
    }

    packages[packageJson.name] = packageJson

    return packageJson
  }

  if (dependency.startsWith('firebase/')) {
    dependency = 'firebase'
  }

  try {
    resolvedFilename = resolve.sync(dependency, {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      basedir,
      packageFilter,
      moduleDirectory: [path.resolve(rootdir, 'node_modules'), basedir]
    })
  } catch (e) {
    if (dependency.endsWith('/package.json')) {
      try {
        resolvedFilename = resolve.sync(`@types/${dependency}`, {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          basedir,
          packageFilter,
          moduleDirectory: [path.resolve(rootdir, 'node_modules'), basedir]
        })
      } catch (e) {
        console.error(
          `could not resolve ${chalk.redBright(
            path.relative(basedir, dependency)
          )} from ${chalk.cyan(basedir)}`
        )
        process.exit(1)
      }
    } else if (!dependency.startsWith('@content')) {
      console.error(
        `could not resolve ${chalk.redBright(
          path.relative(basedir, dependency)
        )} from ${chalk.cyan(basedir)}`
      )
      process.exit(1)
    }
  }

  return resolvedFilename
}

interface WalkDependencieOptions {
  files?: string[]
  basedir: string
  builddir?: string
  externals: string[]
  inlineSourceMap?: boolean
  minify?: boolean
  shallowOnly?: boolean
}

export default function walkDependencies(
  options: WalkDependencieOptions,
  callback: Function
) {
  const visited = {}
  const dependencyCache = {}

  const packages = {}

  const sourcefiles = []
  const builtfiles = []

  let packageJSON
  try {
    packageJSON = require(path.join(options.basedir, 'package.json'))
  } catch (ex) {
    console.error(
      `${chalk.gray('warning:')} missing ${chalk.yellow(
        'package.json'
      )} in ${chalk.yellow(options.basedir)}`
    )
    return { files: builtfiles, packages, packageJSON: {}, rootdir }
  }

  const files = options.files || [
    makeRelative(packageJSON['ts:main'] || packageJSON.main || undefined)
  ]

  files.forEach(filename => {
    if (!filename) {
      return
    }

    if (filename[0] === '.') {
      filename = path.resolve(options.basedir, filename)
    }

    traverse(
      {
        sourcefiles,
        filename,
        basedir: options.basedir,
        visited,
        dependencyCache,
        builddir: options.builddir,
        externals: options.externals,
        packages,
        inlineSourceMap: !!options.inlineSourceMap,
        minify: !!options.minify,
        shallowOnly: !!options.shallowOnly
      },
      callback
    )
  })

  delete packages[packageJSON.name]

  return { files: builtfiles, packages, packageJSON, rootdir }
}

function makeRelative(file: string | undefined) {
  if (!file) {
    return file
  }
  return `./${file.replace(/^\.\//, '')}`
}
