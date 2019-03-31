const { MDXPlugin } = require('fuse-box-plugin-mdx')
const { BabelPlugin } = require('@berun/fuse-box-plugin-babel')
const babel = require('@berun/runner-babel')

module.exports = (berun, options = {}) => {
  if (!('fusebox' in berun)) throw new Error('Missing fuse-box configuration')

  // Add babel even if not used by Typescript
  if (!('babel' in berun)) berun.use(babel)

  berun.fusebox
    .pluginset('MDXset')
    .plugin('MDX')
    .use(MDXPlugin)
    .end()
    .plugin('Babel')
    .use(BabelPlugin, [
      /* placeholder */
    ])

  const _toConfig = berun.fusebox.toConfig
  berun.fusebox.toConfig = (omit = []) => {
    const _ = _toConfig.call(berun.fusebox, omit)

    if (berun.fusebox.plugins.has('MDXset'))
      berun.fusebox
        .pluginset('MDXset')
        .plugin('MDX')
        .tap(() => berun.mdx.toConfig())
        .end()
        .plugin('Babel')
        .tap(() => ({
          extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.md', '.mdx'],
          limit2project: true,
          config: Object.assign(berun.babel.toConfig(), { ast: true })
        }))

    return _toConfig.call(berun.fusebox, omit)
  }
}
