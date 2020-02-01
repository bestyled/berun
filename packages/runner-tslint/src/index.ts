import { TSLint } from '@berun/fluent-tslint'
import Berun from '@berun/berun'
import presetTSlint from './preset'
import { ruleTSlint } from './rule'
import task from './task'

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(TSLint)
  berun.use(presetTSlint, options)
  if ('webpack' in berun) {
    berun.use(ruleTSlint, options)
  }

  berun.sparky.task('tslint', task)
  berun.sparky.append('lint', 'tslint')
}
