'use strict'

/**
 *  Babel Preset for React
 */
module.exports = (berun, options) => {
  berun.babel.merge({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: options.ISPRODUCTION ? true : false
  })
}
