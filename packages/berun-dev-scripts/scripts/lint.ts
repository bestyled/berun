import * as path from 'path'
import * as spawn from 'cross-spawn'
import * as chalk from 'chalk'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

const argv = process.argv.slice(3)

argv.push(
  '-c',
  path.resolve(__dirname, '../config/.eslintrc.js'),
  '--fix',
  '{src,test,lib,config}/**/*.{js,ts,jsx,tsx}',
  '--ignore-pattern',
  '*.d.ts'
)

const cmd = path.join(
  path.dirname(require.resolve('eslint')),
  '../bin/eslint.js'
)
console.log(`${chalk.cyan('$')} ${chalk.blue('eslint')} ${argv.join(' ')}`)

const result = spawn.sync(cmd, argv, { stdio: 'inherit', cwd: process.cwd() })
if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The lint failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The lint failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    )
  }
  process.exit(1)
}
process.exit(result.status)
