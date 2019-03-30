const { TDXPlugin } = require('fuse-box-plugin-tdx')
const { BabelPlugin } = require('@berun/fuse-box-plugin-babel')
const babel = require('@berun/runner-babel')

module.exports = (berun, options = {}) => {
  if (!('fusebox' in berun)) throw new Error('Missing fuse-box configuration')

  // Add babel even if not used by Typescript
  if (!('babel' in berun)) berun.use(babel)

  berun.fusebox
    .pluginset('TDXset')
    .plugin('TDX')
    .use(TDXPlugin)
    .end()
    .plugin('Babel')
    .use(BabelPlugin, [
      /* placeholder */
    ])

  const _toConfig = berun.fusebox.toConfig
  berun.fusebox.toConfig = (omit = []) => {
    const _ = _toConfig.call(berun.fusebox, omit)

    if (berun.fusebox.plugins.has('TDXset'))
      berun.fusebox
        .pluginset('TDXset')
        .plugin('TDX')
        .tap(() => berun.tdx.toConfig())
        .end()
        .plugin('Babel')
        .tap(() => ({
          extensions: [
            '.js',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.md',
            '.mdx',
            '.tdx'
          ],
          limit2project: true,
          config: Object.assign(berun.babel.toConfig(), { ast: true })
        }))

    return _toConfig.call(berun.fusebox, omit)
  }
}
