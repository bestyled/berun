const common_transform = require('./transform')

class FuseBoxMDXFrontMatterPlugin {
  constructor() {
    this.test = /\.(?:md|mdx)$/
  }
  init(context) {
    context.allowExtension('.md')
    context.allowExtension('.mdx')
  }
  async transform(file) {
    const context = file.context

    if (context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    file.loadContents()

    const result = await common_transform(file.contents)

    file.contents = result
  }
}

exports.FuseBoxMDXFrontMatterPlugin = FuseBoxMDXFrontMatterPlugin

exports.MDXFrontMatterPlugin = () => {
  return new FuseBoxMDXFrontMatterPlugin()
}
