import * as path from 'path'
import * as fs from 'fs-extra'

import packDependencies from '../lib/pack/step-pack-dependencies'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

async function run() {
  const cwd = process.cwd()
  const builddir = path.join(cwd, 'dist')
  const distdir = path.join(cwd, 'dist')

  try {
    await fs.emptyDirSync(distdir)

    /** Identify and transpile dependencies */
    const context = packDependencies({
      basedir: path.join(process.cwd(), 'src'),
      files: ['src/index.ts'],
      externals: ['firebase-functions', 'url'],
      minify: false,
      inlineSourceMap: true,
      shallowOnly: false,
      builddir,
      distdir
    })

    console.log(`${context.files.length} files written`)
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
