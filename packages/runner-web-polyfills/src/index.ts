import Berun from '@berun/berun'

// FIX-DEPENDENCIES
require.resolve('./polyfills')

export default function mainEntryPolyfills(berun: Berun, _) {
  berun.webpack.entry('main').prepend(require.resolve('./polyfills'))
}

export const srcPolyfills = require.resolve('./polyfills')
