import { Plugin as PluginSuper } from '@berun/fluent'

export class Plugin<PARENT> extends PluginSuper<PARENT> {
  constructor(parent: PARENT, name: string) {
    super(parent, name)
    this.set('init', (Plugin: any, args = []) => Plugin(...[].concat(args)))
  }
}
