import { OrderableMap } from './OrderableMap'

export class Plugin<PARENT> extends OrderableMap<PARENT> {
  constructor(parent: PARENT, name: string) {
    super(parent, name)
    this.extend(['init'])

    this.set('init', (Plugin: any, args = []) => new Plugin(...args))
  }

  use(plugin: any, args = []) {
    return this.set('plugin', plugin).set('args', args)
  }

  tap(f: (_: any) => any) {
    this.set('args', f(this.get('args') || []))
    return this
  }

  merge(obj: any, omit = []) {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin)
    }

    if ('args' in obj) {
      this.set('args', obj.args)
    }

    return super.merge(obj, [...omit, 'args', 'plugin'])
  }

  toConfig() {
    const init = this.get('init')
    const plugin = this.get('plugin')
    const constructorName = plugin.__expression
      ? `(${plugin.__expression})`
      : plugin.name

    const config = init(this.get('plugin'), this.get('args'))

    try {
      Object.defineProperties(config, {
        __pluginName: { value: this.name },
        __pluginArgs: { value: this.get('args'), writable: true },
        __pluginConstructorName: { value: constructorName }
      })
    } catch (ex) {
      throw new Error(`Error redefining props for Plugin.ts ${this.name}`)
    }

    return config
  }
}
