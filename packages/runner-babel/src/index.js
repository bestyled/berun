'use strict'

const Babel = require('@berun/fluent-babel').Babel

const presetBabel = require('./preset')

module.exports = (berun, opts = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  const options = Object.assign(berun.options, opts, { ISPRODUCTION })

  berun.use(Babel).use(presetBabel, options)
}

module.exports.presetBabel = module.exports
