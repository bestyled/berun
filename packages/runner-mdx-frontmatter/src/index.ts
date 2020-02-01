import Berun from '@berun/berun'

export default (berun: Berun, options = {}) => {
  if (!('webpack' in berun) && !('fusebox' in berun)) {
    throw new Error(
      'MDX FrontMatter files only supported by webpack or fuse-box runners currently'
    )
  }

  berun
    .when('webpack' in berun, berun =>
      berun.use(require('./webpack-preset').default, options)
    )
    .when('fusebox' in berun, berun =>
      berun.use(require('./fuse-box-preset').default, options)
    )
}
