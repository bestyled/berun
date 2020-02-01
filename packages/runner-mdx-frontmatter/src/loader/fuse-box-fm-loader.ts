import commonTransform from './transform'

class FuseBoxMDXFrontMatterPlugin {
  public test: RegExp

  constructor() {
    this.test = /\.(?:md|mdx)$/
  }

  init(context) {
    context.allowExtension('.md')
    context.allowExtension('.mdx')
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

export { FuseBoxMDXFrontMatterPlugin }

export const MDXFrontMatterPlugin = () => {
  return new FuseBoxMDXFrontMatterPlugin()
}
