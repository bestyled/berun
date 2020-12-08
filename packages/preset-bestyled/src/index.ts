import * as path from 'path'
import { DefinePlugin } from 'webpack'
import Berun from '@berun/berun'

// FIX DEPENDENCIES

require.resolve('@berun/preset-react')
require.resolve('@berun/runner-prettier')

export default (berun: Berun) => {

  const { default: CONFIG }= require(path.resolve(process.cwd(), './config/env.config'))
  
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  berun.use('@berun/preset-react')
  berun.use('@berun/runner-prettier')
  
  berun.use((berun: Berun) => {
    berun.webpack.output.futureEmitAssets(true)

    berun.webpack.plugin('env').use(DefinePlugin as any, [
      {
        'process.env': JSON.stringify(CONFIG[process.env.NODE_ENV])
      }
    ])

    berun.babel
      .plugin(require.resolve('@babel/plugin-proposal-decorators'))
      .options({ legacy: true })
      .end()

    berun.webpack.devServer.writeToDisk(true)
    berun.webpack.output.path(path.resolve(process.cwd(), 'build'))
    console.log(path.resolve(process.cwd(), 'build'))
  })
}
