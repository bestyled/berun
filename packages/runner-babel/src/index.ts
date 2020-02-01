import { Babel } from '@berun/fluent-babel'
import Berun from '@berun/berun'
import presetBabel from './preset'

export default (berun: Berun, opts = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  const options = Object.assign(berun.options, opts, { ISPRODUCTION })

  berun.use(Babel).use(presetBabel, options)
}
