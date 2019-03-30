'use strict'

const TSLint = require('@berun/fluent-tslint').TSLint
const { presetTSlint } = require('./preset')
const { ruleTSlint } = require('./rule')
const task = require('./task')

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(TSLint)
  berun.use(presetTSlint, options)
  if ('webpack' in berun) berun.use(ruleTSlint, options)

  berun.sparky.task('tslint', task)
  berun.sparky.append('lint', 'tslint')
}

module.exports.presetTSlint = module.exports
