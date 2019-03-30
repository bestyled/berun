import { FluentMap } from '@berun/fluent'
import { Plugin } from './Plugin'

export class Tdx extends FluentMap<any> {
  mdPlugins = new FluentMap(this)
  hastPlugins = new FluentMap(this)

  constructor(parent: any = null, name = null) {
    super(parent, name)
    this.extendfluent()
  }

  plugin(name: string, use?: string | Function, opts?: any): Plugin<this> {
    if (!this.mdPlugins.has(name)) {
      this.mdPlugins.set(name, new Plugin(this, name))
    }

    const plugin = this.mdPlugins.get(name)

    if (use) plugin.use(use, opts)
    else plugin.use(name)

    return plugin
  }

  hast(name: string, use?: string | Function, opts?: any): Plugin<this> {
    if (!this.hastPlugins.has(name)) {
      this.hastPlugins.set(name, new Plugin(this, name))
    }

    const plugin = this.hastPlugins.get(name)

    if (use) plugin.use(use, opts)
    else plugin.use(name)

    return plugin
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat(['mdPlugins', 'hastPlugins'])) || {},
      this.clean({
        mdPlugins: this.mdPlugins.values().map(p => p.toConfig()),
        hastPlugins: this.hastPlugins.values().map(p => p.toConfig())
      })
    )
  }

  merge(obj: any, omit = []) {
    if (!obj) return this

    if (!omit.includes('mdPlugins') && 'mdPlugins' in obj) {
      Object.keys(obj.mdPlugins).forEach(name =>
        this.plugin(name).merge(obj.mdPlugins[name])
      )
    }

    if (!omit.includes('hastPlugins') && 'hastPlugins' in obj) {
      Object.keys(obj.bundle).forEach(name =>
        this.hast(name).merge(obj.hastPlugins[name])
      )
    }

    return super.merge(obj, [...omit, 'mdPlugins', 'hastPlugins'])
  }
}
