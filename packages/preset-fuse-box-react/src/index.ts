import babel from '@berun/runner-babel'
import jestRunner from '@berun/runner-jest'

import fusebox, {
  fuseboxBundle,
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum,
  taskDev,
  taskProd
} from '@berun/runner-fuse-box'
import Berun from '@berun/berun'

export default (berun: Berun, _) => {
  const ISPRODUCTION = process.env.NODE_ENV === 'production'

  berun
    .use(fusebox)
    .when(!berun.options.paths.isTypeScript, b => b.use(babel))
    .use(jestRunner)
    .when(berun.options.paths.isTypeScript, b =>
      b.jest.transforms
        .delete('babel')
        .end()
        .transform('typescript')
        .test('^.+\\.(ts|tsx)$')
        .use('ts-jest')
        .end()
    )
    .use(pluginPackageInfo)
    .use(pluginSVG)
    .use(pluginCSS)
    .use(pluginJSON)
    .use(pluginWebIndex)
    .when(!berun.options.paths.isTypeScript, b => b.use(pluginBabel))
    .when(ISPRODUCTION, b => b.use(pluginQuantum))

  berun.use(fuseboxBundle)

  berun.sparky.task('start', taskDev)
  berun.sparky.task('build', taskProd)
}
