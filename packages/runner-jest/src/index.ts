import { Jest } from '@berun/fluent-jest'
import Berun from '@berun/berun'
import preset from './preset'
import task from './task'

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(Jest)
  berun.use(preset, options)
  berun.sparky.task('test', task)
}
