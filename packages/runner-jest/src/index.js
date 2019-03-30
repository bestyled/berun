'use strict'

const Jest = require('@berun/fluent-jest').Jest
const preset = require('./preset')
const task = require('./task')

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(Jest)
  berun.use(preset, options)
  berun.sparky.task('test', task)
}
