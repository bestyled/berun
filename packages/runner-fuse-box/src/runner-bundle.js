'use strict'
const { src_polyfills } = require('@berun/runner-web-polyfills')
const path = require('path')

module.exports = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

  const appIndexJs = path.relative(
    berun.options.paths.appSrc,
    berun.options.paths.appIndexJs
  )

  if (ISPRODUCTION)
    berun.fusebox
      //  .bundle('polyfills')
      //  .instructions(`> ${src_polyfills}`)
      //  .end()
      .bundle('vendor')
      .instructions(`~ ${appIndexJs}`)
      .end()
      .bundle('app')
      .instructions(`!> [${appIndexJs}]`)
      .end()
  else
    berun.fusebox
      .bundle('app')
      .instructions(`>${appIndexJs}`)
      .watch(null)
      .hmr(null)
      .end()

  // if (!ISPRODUCTION) berun.fusebox.bundle('app').watch().hmr()
}
