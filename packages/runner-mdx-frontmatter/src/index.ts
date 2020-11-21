import Berun from '@berun/berun'

export default (berun: Berun, options = {}) => {
  if (!('webpack' in berun)) {
    throw new Error(
      'MDX FrontMatter files only supported by webpack runners currently'
    )
  }

  berun
    .when('webpack' in berun, berun =>
      berun.use(require('./webpack-preset').default, options)
    )
}
