const { ruleMainDocs } = require('./webpack-rule')

module.exports = (berun, options = {}) => {
  if (!('webpack' in berun)) throw new Error('Missing webpack configuration')

  berun.use(ruleMainDocs)
}
