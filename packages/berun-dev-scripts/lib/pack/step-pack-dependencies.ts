import * as path from 'path'
import * as fs from 'fs-extra'
import walkDependencies from './lib-walkdependencies'

function writeFileSync({ builtfiles, builddir, srcfile, code, map, basedir }) {
  const filename = path
    .relative(basedir, srcfile)
    .replace(/^(?:..\/)+node_modules/, 'node_modules')
    .replace(/\.tsx?$/, '.js')

  const outfilename = path.resolve(builddir, filename)

  builtfiles.push(filename)
  console.log(filename)

  fs.ensureDirSync(path.dirname(outfilename))

  fs.writeFileSync(outfilename, code, 'utf8')
  if (map) {
    fs.writeFileSync(`${outfilename}.map`, map, 'utf8')
  }
}

export default function processPackage(options) {
  fs.emptyDirSync(options.builddir)

  const { files, packages, packageJSON, rootdir } = walkDependencies(
    options,
    writeFileSync
  )

  Object.keys(packages).forEach((key) => {
    const json = { ...packages[key] }
    json.main = json.main.replace(/\.tsx?$/, '.js')
    delete json['ts:main']
    delete json.module
    const filename = path.join('node_modules', json.name, 'package.json')
    fs.writeFileSync(
      path.join(options.builddir, filename),
      JSON.stringify(json, null, 2)
    )

    if (!files.includes(filename)) {
      files.push(filename)
      console.log(filename)
    }
  })

  return { ...options, files, packages, packageJSON, rootdir }
}
