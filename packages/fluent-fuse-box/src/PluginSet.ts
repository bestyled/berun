import { FluentMap } from '@berun/fluent'
import { Plugin } from './Plugin'

export class PluginSet<PARENT> extends FluentMap<PARENT> {
  plugin(name) {
    if (!this.has(name)) {
      this.set(name, new Plugin(this, name))
    }

    return this.get(name)
  }

  toConfig() {
    return this.values().map(i => i.toConfig())
  }
}
