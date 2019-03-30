'use strict'

const ESLint = require('@berun/fluent-eslint').ESLint
const { presetESlint } = require('./preset')
const { ruleESlint } = require('./rule')

module.exports = (berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(ESLint)
  berun.use(presetESlint, options)
  if ('webpack' in berun) berun.use(ruleESlint, options)
}

module.exports.presetESlint = module.exports
