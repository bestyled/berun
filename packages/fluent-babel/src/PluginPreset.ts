import { OrderableMap, FluentValue } from '@berun/fluent'

export class PluginPreset<PARENT> extends OrderableMap<PARENT> {
  options = FluentValue<this, {}>()

  constructor(parent: PARENT, name: string, options = {}) {
    super(parent, name)
    this.extendfluent()
    this.options(options)
  }

  merge(obj, omit = []) {
    if (!obj) {
      return this
    }

    if (Array.isArray(obj)) {
      this.set('options', obj[1])
    } else {
      this.set('options', {})
    }

    return super.merge(obj, [...omit, 'options', 'name'])
  }

  toConfig() {
    const options = this.get('options')

    if (Object.keys(options).length === 0) {
      return this.name
    }

    return [this.name, options]
  }
}
