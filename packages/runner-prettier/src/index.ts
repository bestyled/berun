import { Prettier } from '@berun/fluent-prettier'
import Berun from '@berun/berun'
import preset from './preset'
import task from './task'

export default (berun: Berun, opts = {}) => {
  const options = Object.assign(berun.options, opts)

  berun.use(Prettier)
  berun.use(preset, options)
  berun.sparky.task('prettier', task)
  berun.sparky.append('lint', 'prettier')
}
