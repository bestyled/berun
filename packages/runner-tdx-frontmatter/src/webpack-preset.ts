import Berun from '@berun/berun'
import { ruleMainDocs } from './webpack-rule'

export default (berun: Berun, _) => {
  if (!('webpack' in berun)) {
    throw new Error('Missing webpack configuration')
  }

  berun.use(ruleMainDocs)
}
