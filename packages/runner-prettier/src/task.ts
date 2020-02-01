import path from 'path'
import chalk from 'chalk'

import 'prettier'

export default berun => {
  const argv = berun.prettier.toArgs()

  const cmd = path.join(
    path.dirname(require.resolve('prettier')),
    '../.bin/prettier'
  )
  console.log(`${chalk.cyan('$')} ${chalk.blue('prettier')} ${argv.join(' ')}`)

  berun.spawn(cmd, argv)
}
