import { TDXPlugin } from 'fuse-box-plugin-tdx'
import { BabelPlugin } from '@berun/fuse-box-plugin-babel'
import Berun from '@berun/berun'
import { TDXFrontMatterPlugin } from './loader/fuse-box-fm-loader'

export default (berun: Berun, _) => {
  if (!('fusebox' in berun)) {
    throw new Error('Missing fuse-box configuration')
  }

  if (!berun.fusebox.plugins.has('TDXset')) {
    throw new Error(
      '@berun/runner-tdx-frontmatter requires @berun/runner-tdx configuration to be loaded first'
    )
  }

  if (!('babel' in berun)) {
    throw new Error('Missing babel  configuration')
  }

  berun.fusebox
    .pluginset('TDXset')
    .clear()
    .plugin('FrontMatter')
    .use(TDXFrontMatterPlugin)
    .end()
    .plugin('TDX')
    .use(TDXPlugin)
    .end()
    .plugin('Babel')
    .use(BabelPlugin, [
      /* placeholder, see runner-tdx for population */
    ])
}
