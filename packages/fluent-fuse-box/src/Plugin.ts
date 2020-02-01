import { Plugin as PluginSuper } from '@berun/fluent'

export class Plugin<PARENT> extends PluginSuper<PARENT> {
  constructor(parent: PARENT, name: string) {
    super(parent, name)
    this.set('init', (_Plugin: any, args = []) => _Plugin(...[].concat(args)))
  }
}
