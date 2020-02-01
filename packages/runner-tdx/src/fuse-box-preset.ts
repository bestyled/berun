import { TDXPlugin } from 'fuse-box-plugin-tdx'
import { BabelPlugin } from '@berun/fuse-box-plugin-babel'
import babel from '@berun/runner-babel'
import Berun from '@berun/berun'

export default (berun: Berun, _) => {
  if (!('fusebox' in berun)) {
    throw new Error('Missing fuse-box configuration')
  }

  // Add babel even if not used by Typescript
  if (!('babel' in berun)) {
    berun.use(babel)
  }

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
    _toConfig.call(berun.fusebox, omit)

    if (berun.fusebox.plugins.has('TDXset')) {
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
    }

    return _toConfig.call(berun.fusebox, omit)
  }
}
