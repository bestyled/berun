import { FluentMap, FluentSet, FluentValue } from '@berun/fluent'

export class ESLint<PARENT> extends FluentMap<PARENT> {
  plugins = new FluentSet(this)
  rules = new FluentMap(this)

  fix = FluentValue<this, any>()
  cache = FluentValue<this, any>()
  formatter = FluentValue<this, any>()
  eslintPath = FluentValue<this, any>()
  emitError = FluentValue<this, any>()
  emitWarning = FluentValue<this, any>()
  quiet = FluentValue<this, any>()
  failOnWarning = FluentValue<this, any>()
  failOnError = FluentValue<this, any>()
  outputReport = FluentValue<this, any>()

  root = FluentValue<this, any>()
  env = FluentValue<this, any>()
  ignore = FluentValue<this, any>()

  allowInlineConfig = FluentValue<this, any>()
  baseConfig = FluentValue<this, any>()
  cacheFile = FluentValue<this, any>()
  cacheLocation = FluentValue<this, any>()
  configFile = FluentValue<this, any>()
  cwd = FluentValue<this, any>()
  envs = FluentValue<this, any>()
  extensions = FluentValue<this, any>()

  globals = FluentValue<this, any>()
  ignorePath = FluentValue<this, any>()
  ignorePattern = FluentValue<this, any>()
  parser = FluentValue<this, any>()
  parserOptions = FluentValue<this, any>()
  reportUnusedDisableDirectives = FluentValue<this, any>()
  rulePaths = FluentValue<this, any>()
  useEslintrc = FluentValue<this, any>()
  globInputPaths = FluentValue<this, any>()

  constructor(parent?: PARENT, name?: string) {
    super(parent, name)
    this.extendfluent()
  }
}
