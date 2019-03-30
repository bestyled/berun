'use strict'

const Prettier = require('@berun/fluent-prettier').Prettier
const preset = require('./preset')
const task = require('./task')

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(Prettier)
  berun.use(preset, options)
  berun.sparky.task('prettier', task)
  berun.sparky.append('lint', 'prettier')
}

module.exports.presetPrettier = module.exports
