import { FluentMap, FluentSet, FluentValue } from '@berun/fluent'

import { Bundle } from './Bundle'
import { Plugin } from './Plugin'
import { PluginSet } from './PluginSet'

type sourceMap = {
  vendor?: boolean
  inlineCSSPath?: string
  inline?: boolean
  project?: boolean
  sourceRoot?: string
}
type LogMap = {
  enabled?: boolean
  showBundledFiles?: boolean
  clearTerminalOnBundle?: boolean
}

export class FuseBox<PARENT> extends FluentMap<PARENT> {
  homeDir = FluentValue<this, string>()
  modulesFolder = FluentValue<this, string | string[]>()
  tsConfig = FluentValue<this, string>()
  package = FluentValue<this, string | { name: string; main: string }>()
  dynamicImportsEnabled = FluentValue<this, boolean>()
  cache = FluentValue<this, boolean>()
  target = FluentValue<this, string>()
  log = FluentValue<this, LogMap | boolean>()
  showBundledFiles = FluentValue<this, boolean>()
  clearTerminalOnBundle = FluentValue<this, boolean>()
  globals = FluentValue<this, { [packageName: string]: string }>()
  autoImport = FluentValue<this, any>()
  natives = FluentValue<this, any>()
  warnings = FluentValue<this, boolean>()
  shim = FluentValue<this, any>()
  writeBundles = FluentValue<this, boolean>()
  useTypescriptCompiler = FluentValue<this, boolean>()
  standalone = FluentValue<this, boolean>()
  sourceMaps = FluentValue<this, boolean | sourceMap>()
  inlineCSSPath = FluentValue<this, string>()
  inline = FluentValue<this, boolean>()
  project = FluentValue<this, boolean>()
  sourceRoot = FluentValue<this, string>()
  hash = FluentValue<this, string | boolean>()
  ignoreModules = FluentValue<this, string[]>()
  customAPIFile = FluentValue<this, string>()
  output = FluentValue<this, string>()
  emitHMRDependencies = FluentValue<this, boolean>()
  filterFile = FluentValue<this, (file: File) => boolean>()
  automaticAlias = FluentValue<this, boolean>()
  allowSyntheticDefaultImports = FluentValue<this, boolean>()
  debug = FluentValue<this, boolean>()
  files = FluentValue<this, any>()
  useJsNext = FluentValue<this, boolean | string[]>()
  stdin = FluentValue<this, boolean>()
  ensureTsConfig = FluentValue<this, boolean>()
  runAllMatchedPlugins = FluentValue<this, boolean>()
  showErrors = FluentValue<this, boolean>()
  showErrorsInBrowser = FluentValue<this, boolean>()
  polyfillNonStandardDefaultUsage = FluentValue<this, boolean | string[]>()
  transformers = FluentValue<this, any>()
  extensionOverrides = FluentValue<this, string[]>()
  serverBundle = FluentValue<this, boolean>()
  plugins = new FluentMap(this)
  bundles = new FluentMap(this)
  alias = new FluentMap(this)

  constructor(parent?: PARENT, name?: string) {
    super(parent)
    this.extendfluent()
  }

  plugin(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this, name))
    }

    return this.plugins.get(name)
  }

  pluginset(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new PluginSet(this, name))
    }

    return this.plugins.get(name)
  }

  bundle(name) {
    if (!this.bundles.has(name)) {
      this.bundles.set(name, new Bundle(this, name))
    }

    return this.bundles.get(name)
  }

  toConfig(omit: string[] = []) {
    return Object.assign(
      super.toConfig(omit.concat(['plugins', 'bundles'])) || {},
      this.clean({
        plugins: this.plugins.values().map(plugin => plugin.toConfig(omit))
      })
    )
  }

  toBundles(omit: string[] = []) {
    return this.clean(
      this.bundles.values().reduce((accum, bundle) => {
        accum[bundle.name] = bundle.toConfig()
        return accum
      }, {})
    )
  }

  merge(obj: any, omit = []) {
    if (!obj) return this

    if (!omit.includes('plugin') && 'plugin' in obj) {
      Object.keys(obj.plugin).forEach(name =>
        this.plugin(name).merge(obj.plugin[name])
      )
    }

    if (!omit.includes('bundle') && 'bundle' in obj) {
      Object.keys(obj.bundle).forEach(name =>
        this.bundle(name).merge(obj.bundle[name])
      )
    }

    return super.merge(obj, [...omit, 'plugin', 'bundle'])
  }
}
