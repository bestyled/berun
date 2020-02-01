import babel from '@berun/runner-babel'
import Berun from '@berun/berun'
import fusebox from './index'
import fuseboxBundle from './runner-bundle'

import {
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum
} from './runner-plugin'

import { taskStatic, taskDev, taskProd } from './tasks'

export default (berun: Berun, _) => {
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  berun
    .use(fusebox)
    .use(babel)
    .use(pluginPackageInfo)
    .use(pluginSVG)
    .use(pluginCSS)
    .use(pluginJSON)
    .use(pluginWebIndex)
    .use(pluginBabel)
    .when(ISPRODUCTION, b => b.use(pluginQuantum))

  berun.use(fuseboxBundle)

  berun.sparky.task('static', taskStatic)
  berun.sparky.task('start', ['static'], taskDev)
  berun.sparky.task('build', ['static'], taskProd)
}
