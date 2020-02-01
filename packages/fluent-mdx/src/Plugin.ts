import { OrderableMap, FluentValue } from '@berun/fluent'

export class Plugin<PARENT> extends OrderableMap<PARENT> {
  options = FluentValue<this, {}>()

  constructor(parent: PARENT, name: string) {
    super(parent, name)
    this.extendfluent()
  }

  use(plugin: any, options = {}) {
    return this.set('plugin', plugin).set('options', options)
  }

  tap(f: (_: any) => any) {
    this.set('options', f(this.get('options') || {}))
    return this
  }

  merge(obj: any, omit = []) {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin)
    }

    if ('options' in obj) {
      this.set('options', obj.options)
    } else {
      this.set('options', {})
    }

    return super.merge(obj, [...omit, 'options', 'plugin'])
  }

  toConfig() {
    const options = this.get('options') || {}

    if (Object.keys(options).length === 0) {
      return this.get('plugin')
    }

    return [this.get('plugin'), options]
  }
}
