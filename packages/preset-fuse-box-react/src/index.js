'use strict'
const fusebox = require('@berun/runner-fuse-box')
const babel = require('@berun/runner-babel')
const jestRunner = require('@berun/runner-jest')
const {
  fuseboxBundle,
  pluginPackageInfo,
  pluginSVG,
  pluginJSON,
  pluginCSS,
  pluginWebIndex,
  pluginBabel,
  pluginQuantum,
  taskStatic,
  taskDev,
  taskProd
} = require('@berun/runner-fuse-box')

module.exports = (berun, options = {}) => {
  const ISPRODUCTION = process.env.NODE_ENV == 'production'

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

module.exports.presetReact = module.exports
