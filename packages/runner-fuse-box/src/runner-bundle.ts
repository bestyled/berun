import * as path from 'path'
import Berun from '@berun/berun'

export default (berun: Berun, _) => {
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  const appIndexJs = path.relative(
    berun.options.paths.appSrc,
    berun.options.paths.appIndexJs
  )

  if (ISPRODUCTION) {
    berun.fusebox
      .bundle('vendor')
      .instructions(`~ ${appIndexJs}`)
      .end()
      .bundle('app')
      .instructions(`!> [${appIndexJs}]`)
      .end()
  } else {
    berun.fusebox
      .bundle('app')
      .instructions(`>${appIndexJs}`)
      .watch(null)
      .hmr(null)
      .end()
  }

  // if (!ISPRODUCTION) berun.fusebox.bundle('app').watch().hmr()
}
