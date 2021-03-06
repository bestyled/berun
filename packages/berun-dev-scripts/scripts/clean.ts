import * as path from 'path'
import * as spawn from 'cross-spawn'
import * as chalk from 'chalk'

process.on('unhandledRejection', err => {
  throw err
})

const argv = process.argv.slice(3)

argv.push('dist')

const cmd = path.join(path.dirname(require.resolve('rimraf')), '../.bin/rimraf')
console.log(`${chalk.cyan('$')} ${chalk.blue('rimraf')} ${argv.join(' ')}`)

const result = spawn.sync(cmd, argv, { stdio: 'inherit', cwd: process.cwd() })
if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      'The clean failed because the process exited too early. ' +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.'
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      'The clean failed because the process exited too early. ' +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.'
    )
  }
  process.exit(1)
}
process.exit(result.status)
