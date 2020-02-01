import { WorkFlowContext, File, Plugin } from 'fuse-box'

import mdx from '@mdx-js/mdx'

export interface MDXPluginOptions {
  mdPlugins?: any[]
  hastPlugins?: any[]
}

export class FuseBoxMDXPlugin implements Plugin {
  public test = /\.(md|mdx)$/

  public options: MDXPluginOptions = {
    mdPlugins: [],
    hastPlugins: []
  }

  constructor(opts: MDXPluginOptions = {}) {
    this.options = Object.assign(this.options, opts)
  }

  public init(context: WorkFlowContext) {
    context.allowExtension('.md')
    context.allowExtension('.mdx')
  }

  public async transform(file: File) {
    const { context } = file

    if (context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    file.loadContents()

    const result = await mdx(file.contents, this.options)

    file.contents = `
  import React from 'react'
  import { MdxTag } from '@mdx-js/tag'
    ${result}
    `
  }
}

export const MDXPlugin = (options?: MDXPluginOptions) => {
  return new FuseBoxMDXPlugin(options)
}
