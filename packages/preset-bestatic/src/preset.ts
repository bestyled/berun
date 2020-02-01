import path from 'path'
import fs from 'fs'
import resolveCWD from 'resolve-cwd'
import Berun from '@berun/berun'

export default (berun: Berun, options = {}) => {
  const corePath = path.dirname(resolveCWD('@bestatic/core/dist/index.js'))

  if (!berun.options.cmd.endsWith(':static')) {
    return
  }

  if (process.env.NODE_ENV === 'production') {
    berun.options.paths.appIndexJs = path.join(corePath, 'entry_ssr.js')
  } else {
    berun.options.paths.appIndexJs = path.join(corePath, 'entry_browser.js')
  }

  const configLocal = path.join(
    berun.options.paths.appPath,
    'config',
    'bestatic.config.js'
  )

  const configPath = fs.existsSync(configLocal)
    ? configLocal
    : resolveCWD('@bestatic/core/src/config/bestatic.config.default.ts')

  const opt = { configPath, ...options }

  berun
    .when('webpack' in berun, berun => presetWebPack(berun, opt))
    .when('fusebox' in berun, berun => presetFuseBox(berun, opt))
}

const presetWebPack = (berun: Berun, opt) => {
  berun.webpack.resolve.alias.set('@bestatic/config$', opt.configPath)

  if (process.env.NODE_ENV === 'production') {
    berun.webpack
      .entry('main')
      .clear()
      .add(berun.options.paths.appIndexJs)
  } else {
    berun.webpack
      .entry('main')
      .clear()
      .add(require.resolve('react-dev-utils/webpackHotDevClient'))
      .add(berun.options.paths.appIndexJs)
  }
}

const presetFuseBox = (berun: Berun, opt) => {
  const appIndexJs = path.relative(
    berun.options.paths.workspace,
    berun.options.paths.appIndexJs
  )
  const optConfig = `~/${path.relative(
    berun.options.paths.workspace,
    opt.configPath
  )}`
  const docpath = path.relative(
    berun.options.paths.workspace,
    path.join(berun.options.paths.appPath, 'pages', '**', '*.*')
  )

  berun.fusebox.alias.set('@bestatic/config', optConfig).end()

  if (process.env.NODE_ENV === 'production') {
    berun.fusebox
      .homeDir(berun.options.paths.workspace)
      .debug(true)
      .bundles.clear()
      .end()
      .bundle('main')
      .instructions(`>${appIndexJs} + ${docpath}`)
      .end()
  } else {
    berun.fusebox
      .homeDir(berun.options.paths.workspace)
      .bundles.clear()
      .end()
      .bundle('main')
      .instructions(`>${appIndexJs} + ${docpath}`)
      .watch(null)
      .hmr(null)
      .end()
  }
}
