import * as path from 'path'
import Berun from '@berun/berun'
import webpack from '@berun/runner-webpack'

// FIX DEPENDENCIES
require.resolve('@berun/runner-envkey')
require.resolve('@berun/preset-react')
require.resolve('@berun/runner-prettier')

export default (berun: Berun) => {
  berun.use('@berun/runner-envkey')
  berun.use('@berun/preset-react')
  berun.use('@berun/runner-prettier')
  berun.use(webpack.pluginEnv)

  berun.use((berun: Berun) => {
    berun.webpack.output.futureEmitAssets(true)
    berun.babel
      .plugin(require.resolve('@babel/plugin-proposal-decorators'))
      .options({ legacy: true })
      .end()

    berun.webpack.devServer.writeToDisk(true)
    berun.webpack.output.path(path.resolve(process.cwd(), 'build'))
    console.log(path.resolve(process.cwd(), 'build'))
  })
}
