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
  '--write',
  '--config',
  path.resolve(__dirname, '../config/.prettierrc'),
  '{,!(node_modules|dist|build)/**/}*.{js,jsx,ts,tsx,css,less,scss,sass,graphql,json,md}'
)

const cmd = path.join(
  path.dirname(require.resolve('prettier')),
  '../.bin/prettier'
)
console.log(`${chalk.cyan('$')} ${chalk.blue('prettier')} ${argv.join(' ')}`)

const result = spawn.sync(cmd, argv, {
  stdio: ['ignore', 'pipe', 'pipe'],
  cwd: process.cwd()
})

if (result.stdout) {
  console.log(`${result.stdout.toString()}`)
}

if (result.stderr) {
  console.error(result.stderr.toString())
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
