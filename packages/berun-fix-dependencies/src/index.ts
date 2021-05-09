import * as path from 'path'
import * as glob from 'glob'

import fixDependencies from './pack/step-fix-dependencies'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', (err) => {
  throw err
})

async function run() {
  const cwd = process.cwd()

  // eslint-disable-next-line
  const packageJSON = require(path.join(cwd, 'package.json'))

  const { workspaces } = packageJSON

  if (!workspaces) {
    console.warn('Not a valid mono repository;  missing workspaces')
    process.exit(0)
  }

  const arrays = [].concat(...workspaces.map((pattern) => glob.sync(pattern)))

  arrays.forEach((dir) => {
    console.log(dir)
    try {
      /** Identify and transpile dependencies */
      fixDependencies({
        basedir: path.join(cwd, dir),
        externals: [
          'native_module',
          'vscode',
          'path',
          'child_process',
          'fs',
          'os',
          'module',
          'path',
          'crypto',
          'net',
          'dgram',
          'https',
          'stream'
        ],
        shallowOnly: true
      })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  })

  process.exit()
}

void run()
