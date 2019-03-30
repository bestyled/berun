module.exports = (berun, options = {}) => {
  berun
    .use('@berun/runner-tdx')
    .use('@berun/runner-tdx-frontmatter')
    .use(require('./preset'))
    .use('@berun/runner-static')
}

module.exports.presetBeStatic = module.exports
