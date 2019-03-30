const { TDXPlugin } = require('fuse-box-plugin-tdx')
const { TDXFrontMatterPlugin } = require('./loader/fuse-box-fm-loader')
const { BabelPlugin } = require('@berun/fuse-box-plugin-babel')
const babel = require('@berun/runner-babel')

module.exports = (berun, options = {}) => {
  if (!('fusebox' in berun)) throw new Error('Missing fuse-box configuration')

  if (!berun.fusebox.plugins.has('TDXset'))
    throw new Error(
      '@berun/runner-tdx-frontmatter requires @berun/runner-tdx configuration to be loaded first'
    )

  if (!('babel' in berun)) throw new Error('Missing babel  configuration')

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
