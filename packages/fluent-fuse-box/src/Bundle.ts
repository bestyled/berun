import { OrderableMap, FluentMap, FluentValue } from '@berun/fluent'
import { Plugin } from './Plugin'

export class Bundle<PARENT> extends OrderableMap<PARENT> {
  watch = FluentValue<this, string>()
  globals = FluentValue<this, any>()
  tsConfig = FluentValue<this, string>()
  shim = FluentValue<this, any>()
  hmr = FluentValue<
    this,
    {
      port?: number
      socketURI?: string
      reload?: boolean
    }
  >()
  alias = new FluentMap(this)
  // split =   new FluentMap(this)
  cache = FluentValue<this, boolean>()
  splitConfig = FluentValue<
    this,
    {
      browser?: string
      server?: string
      dest?: string
    }
  >()
  log = FluentValue<this, boolean>()
  extensionOverrides = FluentValue<this, string[]>()
  plugins = new FluentMap(this)
  natives = FluentValue<this, any>()
  instructions = FluentValue<this, string>()
  target = FluentValue<this, string>()
  sourceMaps = FluentValue<this, any>()
  test = FluentValue<this, string>()
  testOptions = FluentValue<this, any>()
  completed = FluentValue<this, (process: any) => void>()

  constructor(parent?: PARENT, name?: string) {
    super(parent, name)
    this.extendfluent()
  }

  exec(): Promise<any> {
    throw new Error('not implemented')
  }

  plugin(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this, name))
    }

    return this.plugins.get(name)
  }

  merge(obj: any, omit = []) {
    if (!obj) return this

    if (!omit.includes('plugin') && 'plugin' in obj) {
      Object.keys(obj.plugin).forEach(name =>
        this.plugin(name).merge(obj.plugin[name])
      )
    }

    return super.merge(obj, [...omit, 'plugin'])
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat(['plugins'])) || {},
      this.clean({
        plugins: this.plugins.values().map(plugin => plugin.toConfig())
      })
    )
  }
}
