import Berun from '@berun/berun'
import {
  taskStaticDev,
  taskStaticPass1,
  taskStaticPass2
} from './tasks/task-static'
import { taskAlgoliaDeploy } from './tasks/task-algolia'

function getPreset(berun) {
  if ('webpack' in berun) {
    return require('./preset-webpack')
  }
  throw new Error(
    'Static preset only supports webpack currently;  cannot find either of these in berun use chain'
  )
}

const task = async (berun) => {
  const { presetTemp, presetStatic } = getPreset(berun)

  berun.sparkyContext.opts = {}
  await berun.useAsync(presetTemp, berun.sparkyContext.opts)
  await taskStaticPass1(berun)
  await berun.useAsync(presetStatic, berun.sparkyContext.opts)
  await taskStaticPass2(berun)
}

const taskDev = (berun) => {
  const { presetDev } = getPreset(berun)
  berun.sparkyContext.opts = {}
  berun.use(presetDev, berun.sparkyContext.opts)

  return taskStaticDev(berun)
}

export default (berun: Berun, _) => {
  berun.sparky.task('build:static', task)
  berun.sparky.task('start:static', taskDev)
  berun.sparky.task('build:algolia:static', ['build:static'], taskAlgoliaDeploy)
}
