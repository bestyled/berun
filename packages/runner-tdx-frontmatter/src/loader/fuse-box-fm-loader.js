const common_transform = require('./transform')

class FuseBoxTDXFrontMatterPlugin {
  constructor() {
    this.test = /\.(?:md|mdx|tdx)$/
  }
  init(context) {
    context.allowExtension('.md')
    context.allowExtension('.mdx')
    context.allowExtension('.tdx')
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

exports.FuseBoxTDXFrontMatterPlugin = FuseBoxTDXFrontMatterPlugin

exports.TDXFrontMatterPlugin = () => {
  return new FuseBoxTDXFrontMatterPlugin()
}
