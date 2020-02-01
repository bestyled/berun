import { ESLint } from '@berun/fluent-eslint'
import Berun from '@berun/berun'
import presetESlint from './preset'
import { ruleESlint } from './rule'

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(ESLint)
  berun.use(presetESlint, options)
  if ('webpack' in berun) {
    berun.use(ruleESlint, options)
  }
}
