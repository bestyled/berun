import commonTransform from './transform'

class FuseBoxTDXFrontMatterPlugin {
  public test: RegExp

  constructor() {
    this.test = /\.(?:md|mdx|tdx)$/
  }

  init(context) {
    context.allowExtension('.md')
    context.allowExtension('.mdx')
    context.allowExtension('.tdx')
  }

  async transform(file) {
    const { context } = file

    if (context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    file.loadContents()

    const result = await commonTransform(file.contents)

    file.contents = result
  }
}

export { FuseBoxTDXFrontMatterPlugin }

export const TDXFrontMatterPlugin = () => {
  return new FuseBoxTDXFrontMatterPlugin()
}
