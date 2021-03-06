import * as jest from 'jest'

const jestConfig = require('../config/jest.config.js')

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

process.on('unhandledRejection', err => {
  throw err
})

const argv = process.argv.slice(2)

argv.push('--runInBand', '--config', JSON.stringify(jestConfig))

jest.run(argv)
