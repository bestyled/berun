import { Plugin } from './Plugin'

import { FluentMap } from '@berun/fluent'

export class PluginSet<PARENT> extends FluentMap<PARENT> {
  constructor(parent: PARENT, name: string) {
    super(parent, name)
  }

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
