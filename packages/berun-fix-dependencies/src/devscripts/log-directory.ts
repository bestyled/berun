import * as path from 'path'
import * as findPkg from 'find-pkg'
import * as chalk from 'chalk'

export default function (msg: string, dirname: string) {
  const monoPkgPath = path.dirname(
    findPkg.sync(path.resolve(dirname, '..')) || dirname
  )

  console.log(
    `${chalk.dim('[@berun/dev-scripts]')} ${msg} ${chalk.cyan(
      path.relative(monoPkgPath, dirname)
    )}`
  )
}