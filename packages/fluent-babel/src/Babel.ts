import { FluentMap, FluentValue, fluent } from '@berun/fluent'
import { PluginPreset } from './PluginPreset'

export class Babel extends FluentMap<Babel> {
  babelrc = FluentValue<this, boolean>()
  root = FluentValue<this, string>()
  ast = FluentValue<this, any>()
  auxiliaryCommentAfter = FluentValue<this, any>()
  auxiliaryCommentBefore = FluentValue<this, any>()
  babelrcRoots = FluentValue<this, any>()
  code = FluentValue<this, any>()
  comments = FluentValue<this, any>()
  compact = FluentValue<this, any>()
  configFile = FluentValue<this, any>()
  cwd = FluentValue<this, any>()
  envName = FluentValue<this, any>()
  extends = FluentValue<this, any>()
  filename = FluentValue<this, any>()
  filenameRelative = FluentValue<this, any>()
  getModuleId = FluentValue<this, any>()
  highlightCode = FluentValue<this, any>()
  ignore = FluentValue<this, any>()
  inputSourceMap = FluentValue<this, any>()
  minified = FluentValue<this, any>()
  moduleId = FluentValue<this, any>()
  moduleIds = FluentValue<this, any>()
  moduleRoot = FluentValue<this, any>()
  only = FluentValue<this, any>()
  retainLines = FluentValue<this, any>()
  shouldPrintComment = FluentValue<this, any>()
  sourceFileName = FluentValue<this, any>()
  sourceMaps = FluentValue<this, any>()
  sourceRoot = FluentValue<this, any>()
  sourceType = FluentValue<this, any>()
  wrapPluginVisitorMethod = FluentValue<this, any>()

  plugins = new FluentMap(this)
  presets = new FluentMap(this)
  environments = new FluentMap(this)

  constructor(parent: Babel = null, name = null) {
    super(parent, name)
    this.extendfluent()
  }

  env(name: string): Babel {
    if (!this.environments.has(name)) {
      this.environments.set(name, new Babel(this, name))
    }

    return this.environments.get(name)
  }

  plugin(name: string, opts?: any): PluginPreset<this> {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new PluginPreset(this, name, opts))
    }

    return this.plugins.get(name)
  }

  preset(name: string, opts?: any): PluginPreset<this> {
    if (!this.presets.has(name)) {
      this.presets.set(name, new PluginPreset(this, name, opts))
    }

    return this.presets.get(name)
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat(['plugins', 'presets', 'environments'])) || {},
      this.clean({
        env: this.environments.values().reduce((accum, p) => {
          accum[p.name] = p.toConfig()
          return accum
        }, {}),
        plugins: this.plugins.values().map(p => p.toConfig()),
        presets: this.presets.values().map(p => p.toConfig())
      })
    )
  }

  merge(obj: any, omit = []) {
    if (!obj) return this

    if (!omit.includes('plugins') && 'plugins' in obj) {
      obj.plugins.forEach(p => {
        const name = Array.isArray(p) ? p[0] : p
        this.plugin(name).merge(p)
      })
    }

    if (!omit.includes('presets') && 'presets' in obj) {
      obj.presets.forEach(p => {
        const name = Array.isArray(p) ? p[0] : p
        this.preset(name).merge(p)
      })
    }

    if (!omit.includes('env') && 'env' in obj) {
      Object.keys(obj.environments).forEach(name =>
        this.env(name).merge(obj.env[name])
      )
    }

    return super.merge(obj, [...omit, 'plugins', 'presets', 'env'])
  }
}
