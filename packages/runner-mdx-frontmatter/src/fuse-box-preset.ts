import { MDXPlugin } from 'fuse-box-plugin-mdx'
import { BabelPlugin } from '@berun/fuse-box-plugin-babel'
import Berun from '@berun/berun'
import { MDXFrontMatterPlugin } from './loader/fuse-box-fm-loader'

export default (berun: Berun, _) => {
  if (!('fusebox' in berun)) {
    throw new Error('Missing fuse-box configuration')
  }

  if (!berun.fusebox.plugins.has('MDXset')) {
    throw new Error(
      '@berun/runner-mdx-frontmatter requires @berun/runner-mdx configuration to be loaded first'
    )
  }

  if (!('babel' in berun)) {
    throw new Error('Missing babel  configuration')
  }

  berun.fusebox
    .pluginset('MDXset')
    .clear()
    .plugin('FrontMatter')
    .use(MDXFrontMatterPlugin)
    .end()
    .plugin('MDX')
    .use(MDXPlugin)
    .end()
    .plugin('Babel')
    .use(BabelPlugin, [
      /* placeholder, see runner-mdx for population */
    ])
}
