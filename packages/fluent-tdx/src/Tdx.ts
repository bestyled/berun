/* eslint-disable import/prefer-default-export */
import { FluentMap } from '@berun/fluent'
import { Plugin } from './Plugin'

export class Tdx extends FluentMap<any> {
  remarkPlugins = new FluentMap(this)

  rehypePlugins = new FluentMap(this)

  constructor(parent: any = null, name = null) {
    super(parent, name)
    this.extendfluent()
  }

  remark(name: string, use?: string | Function, opts?: any): Plugin<this> {
    if (!this.remarkPlugins.has(name)) {
      this.remarkPlugins.set(name, new Plugin(this, name))
    }

    const plugin = this.remarkPlugins.get(name)

    if (use) {
      plugin.use(use, opts)
    } else {
      plugin.use(name)
    }

    return plugin
  }

  rehype(name: string, use?: string | Function, opts?: any): Plugin<this> {
    if (!this.rehypePlugins.has(name)) {
      this.rehypePlugins.set(name, new Plugin(this, name))
    }

    const plugin = this.rehypePlugins.get(name)

    if (use) {
      plugin.use(use, opts)
    } else {
      plugin.use(name)
    }

    return plugin
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat(['remarkPlugins', 'rehypePlugins'])) || {},
      this.clean({
        remarkPlugins: this.remarkPlugins.values().map((p) => p.toConfig()),
        rehypePlugins: this.rehypePlugins.values().map((p) => p.toConfig())
      })
    )
  }

  merge(obj: any, omit = []) {
    if (!obj) {
      return this
    }

    if (!omit.includes('remarkPlugins') && 'remarkPlugins' in obj) {
      Object.keys(obj.remarkPlugins).forEach((name) =>
        this.remark(name).merge(obj.remarkPlugins[name])
      )
    }

    if (!omit.includes('rehypePlugins') && 'rehypePlugins' in obj) {
      Object.keys(obj.rehypePlugins).forEach((name) =>
        this.rehype(name).merge(obj.rehypePlugins[name])
      )
    }

    return super.merge(obj, [...omit, 'remarkPlugins', 'rehypePlugins'])
  }
}
