import Berun from '@berun/berun'
import presetWebpackTsMain from './preset_webpack'

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  if ('webpack' in berun) {
    berun.use(presetWebpackTsMain, options)
  }
}
