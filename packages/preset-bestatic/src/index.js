module.exports = (berun, options = {}) => {
  berun
    .use('@berun/runner-mdx')
    .use('@berun/runner-mdx-frontmatter')
    .use(require('./preset'))
    .use('@berun/runner-static')
}

module.exports.presetBeStatic = module.exports
