import * as webpack from './webpack'
import { ServerOptions } from './https'

interface Fluent<Parent> {
  end(): Parent
  toConfig(): any
}
interface TypedFluentMap<Parent, Value> extends Fluent<Parent> {
  clear(): this
  delete(key: string): this
  has(key: string): boolean
  get(key: string): Value
  set(key: string, value: Value): this
  merge(obj: { [key: string]: Value }): this
  entries(): { [key: string]: Value }
  values(): Value[]
  when(
    condition: boolean,
    trueBrancher: (obj: this) => void,
    falseBrancher?: (obj: this) => void
  ): this
}
type FluentMap<Parent> = TypedFluentMap<Parent, any>
interface TypedFluentSet<Parent, Value> extends Fluent<Parent> {
  add(value: Value): this
  prepend(value: Value): this
  clear(): this
  delete(key: string): this
  has(key: string): boolean
  merge(arr: Value[]): this
  values(): Value[]
  when(
    condition: boolean,
    trueBrancher: (obj: this) => void,
    falseBrancher?: (obj: this) => void
  ): this
}
// export type FluentSet<Parent> = TypedFluentSet<Parent, any>
export interface Config extends FluentMap<void> {
  devServer: DevServer
  entryPoints: TypedFluentMap<Config, EntryPoint>
  module: Module
  node: FluentMap<this>
  output: Output
  optimization: Optimization
  performance: Performance
  plugins: Plugins<this>
  resolve: Resolve
  resolveLoader: ResolveLoader
  amd(value: { [moduleName: string]: boolean }): this
  bail(value: boolean): this
  cache(value: boolean | any): this
  devtool(value: DevTool): this
  context(value: string): this
  externals(value: webpack.ExternalsElement | webpack.ExternalsElement[]): this
  loader(value: any): this
  profile(value: boolean): this
  recordsPath(value: string): this
  recordsInputPath(value: string): this
  recordsOutputPath(value: string): this
  stats(value: webpack.Options.Stats): this
  target(value: string): this
  watch(value: boolean): this
  watchOptions(value: webpack.Options.WatchOptions): this
  entry(name: string): EntryPoint
  plugin(name: string): Plugin<this>
  toConfig(): webpack.Configuration
}
type Plugins<Parent> = TypedFluentMap<Parent, Plugin<Parent>>
interface Plugin<Parent> extends FluentMap<Parent> {
  init(value: (plugin: PluginClass, args: any[]) => webpack.Plugin): this
  use(plugin: PluginClass, args?: any[]): this
  tap(f: (args: any[]) => any[]): this
}
interface Module extends FluentMap<Config> {
  rules: TypedFluentMap<this, Rule>
  rule(name: string): Rule
  noParse(noParse: RegExp | RegExp[] | ((contentPath: string) => boolean)): this
}
interface Output extends FluentMap<Config> {
  chunkFilename(value: string): this
  crossOriginLoading(value: boolean | string): this
  filename(value: string): this
  library(value: string): this
  libraryTarget(value: string): this
  devtoolFallbackModuleFilenameTemplate(value: any): this
  devtoolLineToLine(value: any): this
  devtoolModuleFilenameTemplate(value: any): this
  hashFunction(value: string): this
  hashDigest(value: string): this
  hashDigestLength(value: number): this
  hashSalt(value: any): this
  hotUpdateChunkFilename(value: string): this
  hotUpdateFunction(value: any): this
  hotUpdateMainFilename(value: string): this
  jsonpFunction(value: string): this
  path(value: string): this
  pathinfo(value: boolean): this
  publicPath(value: string): this
  sourceMapFilename(value: string): this
  sourcePrefix(value: string): this
  strictModuleExceptionHandling(value: boolean): this
  umdNamedDefine(value: boolean): this
}
export interface DevServer extends FluentMap<Config> {
  clientLogLevel(value: 'none' | 'error' | 'warning' | 'info'): this
  compress(value: boolean): this
  contentBase(value: boolean | string | string[]): this
  filename(value: string): this
  headers(value: { [header: string]: string }): this
  historyApiFallback(value: boolean | any): this
  host(value: string): this
  hot(value: boolean): this
  hotOnly(value: boolean): this
  https(value: boolean | ServerOptions): this
  inline(value: boolean): this
  lazy(value: boolean): this
  noInfo(value: boolean): this
  overlay(value: boolean | { warnings?: boolean; errors?: boolean }): this
  port(value: number): this
  progress(value: boolean): this
  proxy(value: any): this
  public(value: string): this
  publicPath(publicPath: string): this
  quiet(value: boolean): this
  setup(value: (expressApp: any) => void): this
  staticOptions(value: any): this
  stats(value: webpack.Options.Stats): this
  watchContentBase(value: boolean): this
  watchOptions(value: any): this
}
interface Performance extends FluentMap<Config> {
  hints(value: boolean | 'error' | 'warning'): this
  maxEntrypointSize(value: number): this
  maxAssetSize(value: number): this
  assetFilter(value: (assetFilename: string) => boolean): this
}
type EntryPoint = TypedFluentSet<Config, string>
interface Resolve extends TypedFluentMap<Config, any> {
  alias: TypedFluentMap<this, string>
  aliasFields: TypedFluentSet<this, string>
  descriptionFiles: TypedFluentSet<this, string>
  extensions: TypedFluentSet<this, string>
  mainFields: TypedFluentSet<this, string>
  mainFiles: TypedFluentSet<this, string>
  modules: TypedFluentSet<this, string>
  plugins: TypedFluentMap<this, Plugin<this>>
  enforceExtension(value: boolean): this
  enforceModuleExtension(value: boolean): this
  unsafeCache(value: boolean | RegExp | RegExp[]): this
  symlinks(value: boolean): this
  cachePredicate(
    value: (data: { path: string; request: string }) => boolean
  ): this
  plugin(name: string): Plugin<this>
}
interface ResolveLoader extends FluentMap<Config> {
  extensions: TypedFluentSet<this, string>
  modules: TypedFluentSet<this, string>
  moduleExtensions: TypedFluentSet<this, string>
  packageMains: TypedFluentSet<this, string>
}
interface Rule extends FluentMap<Module> {
  uses: TypedFluentMap<this, Use<any>>
  include: TypedFluentSet<this, webpack.Condition>
  exclude: TypedFluentSet<this, webpack.Condition>
  parser(value: { [optName: string]: any }): this
  test(value: webpack.Condition | webpack.Condition[]): this
  enforce(value: 'pre' | 'post'): this
  use(name: string): Use<any>
  pre(): this
  post(): this
}
interface Optimization extends FluentMap<Config> {
  concatenateModules(value: boolean): this
  flagIncludedChunks(value: boolean): this
  mergeDuplicateChunks(value: boolean): this
  minimize(value: boolean): this
  minimizer(value: webpack.Plugin[]): this
  namedChunks(value: boolean): this
  namedModules(value: boolean): this
  nodeEnv(value: boolean | string): this
  noEmitOnErrors(value: boolean): this
  occurrenceOrder(value: boolean): this
  portableRecords(value: boolean): this
  providedExports(value: boolean): this
  removeAvailableModules(value: boolean): this
  removeEmptyChunks(value: boolean): this
  runtimeChunk(value: boolean | 'single' | 'multiple' | RuntimeChunk): this
  sideEffects(value: boolean): this
  splitChunks(value: SplitChunksOptions): this
  usedExports(value: boolean): this
}
interface RuntimeChunk {
  name: string | RuntimeChunkFunction
}
type RuntimeChunkFunction = (entryPoint: EntryPoint) => string
interface SplitChunksOptions {
  [name: string]: any
}
interface LoaderOptions {
  [name: string]: any
}
interface Use<Rule> extends FluentMap<Rule> {
  loader(value: string): this
  options(value: LoaderOptions): this
  tap(f: (options: LoaderOptions) => LoaderOptions): this
}
type DevTool =
  | 'eval'
  | 'inline-source-map'
  | 'cheap-eval-source-map'
  | 'cheap-source-map'
  | 'cheap-module-eval-source-map'
  | 'cheap-module-source-map'
  | 'eval-source-map'
  | 'source-map'
  | 'nosources-source-map'
  | 'hidden-source-map'
  | 'nosources-source-map'
  | '@eval'
  | '@inline-source-map'
  | '@cheap-eval-source-map'
  | '@cheap-source-map'
  | '@cheap-module-eval-source-map'
  | '@cheap-module-source-map'
  | '@eval-source-map'
  | '@source-map'
  | '@nosources-source-map'
  | '@hidden-source-map'
  | '@nosources-source-map'
  | '#eval'
  | '#inline-source-map'
  | '#cheap-eval-source-map'
  | '#cheap-source-map'
  | '#cheap-module-eval-source-map'
  | '#cheap-module-source-map'
  | '#eval-source-map'
  | '#source-map'
  | '#nosources-source-map'
  | '#hidden-source-map'
  | '#nosources-source-map'
  | '#@eval'
  | '#@inline-source-map'
  | '#@cheap-eval-source-map'
  | '#@cheap-source-map'
  | '#@cheap-module-eval-source-map'
  | '#@cheap-module-source-map'
  | '#@eval-source-map'
  | '#@source-map'
  | '#@nosources-source-map'
  | '#@hidden-source-map'
  | '#@nosources-source-map'
  | boolean
interface PluginClass {
  new (...opts: any[]): webpack.Plugin
}
