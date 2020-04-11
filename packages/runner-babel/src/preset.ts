import Berun from '@berun/berun'

/**
 *  Babel Preset for React
 */
export default (berun: Berun, options) => {
  berun.babel.merge({
    babelrc: false,
    presets: ['@berun/babel-preset-react-app'],
    highlightCode: true,
    compact: !!options.ISPRODUCTION,
    sourceType: 'unambiguous'
  })
}
