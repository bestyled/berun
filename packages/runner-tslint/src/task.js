'use strict'
const { Linter, Configuration } = require('tslint')
const chalk = require('chalk')

module.exports = berun => {
  const fix = process.argv.indexOf('--fix') > -1
  console.log(
    `${chalk.cyan('$')} ${chalk.blue('tslint')} ${
      fix ? '--fix' : '--no-fix'
    } ${chalk.cyan('via @berun')}`
  )

  const config = berun.tslint.toConfig()
  const program = Linter.createProgram(
    berun.options.paths.appTSConfig,
    berun.options.paths.appPath
  )

  const options = {
    fix,
    formatter: 'stylish'
  }

  const linter = new Linter(options, program)

  const files = Linter.getFileNames(program)
  files.forEach(file => {
    const fileContents = program.getSourceFile(file).getFullText()
    const configuration = Configuration.parseConfigFile(config)
    linter.lint(file, fileContents, configuration)
  })

  const results = linter.getResult()
  console.log(results.output)
}
