import Berun from '@berun/berun'
import presetReactCss from './preset'

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)
  berun.use(presetReactCss, options)
}
