import Berun from '@berun/berun'
import { ruleMainDocs } from './webpack-rule'

export default (berun: Berun, _) => {
  if (!('webpack' in berun)) {
    throw new Error('Missing webpack configuration')
  }

  berun.use(ruleMainDocs)

  const _webpackOldToConfig = berun.webpack.toConfig
  berun.webpack.toConfig = (...rest) => {
    _webpackOldToConfig.call(berun.webpack, ...rest)

    const main = berun.webpack.module.rule('main')

    if (main.oneOfs.has('markdown')) {
      main
        .oneOf('markdown')
        .use('babel')
        .options(berun.babel.toConfig())
        .end()
        .use('tdx')
        .options(berun.tdx.toConfig())
    }

    return _webpackOldToConfig.call(berun.webpack, ...rest)
  }
}
