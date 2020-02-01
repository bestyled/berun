import * as path from 'path'
import * as spawn from 'cross-spawn'
import * as chalk from 'chalk'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

process.on('unhandledRejection', err => {
  throw err
})

const argv = process.argv.slice(3)

const cwd = process.cwd()

argv.push('-p', path.resolve(cwd, 'tsconfig.json'))

argv.push('--pretty')

const cmd = path.resolve(
  path.dirname(require.resolve('typescript')),
  '../../.bin/tsc'
)
console.log(`${chalk.cyan('$')} ${chalk.blue('tsc')} ${argv.join(' ')}`)

const result = spawn.sync(cmd, argv, {
  stdio: ['ignore', 'pipe', 'inherit'],
  cwd
})

if (result.stdout) {
  console.log(result.stdout.toString())
}

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The build failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The build failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    )
  }
  process.exit(1)
}
process.exit(result.status)
