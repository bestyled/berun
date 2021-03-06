# @berun/fluent-webpack

Use a chaining API to generate and simplify the modification of
Webpack version 4+ configurations.

\_Note: This is just a thin wrapper around `webpack-chain` to provide
a fluent-like interface for any front end development tool. It is part
of the broader `@berun/fluent` suite of configurations, but may be used
standalone.

## Introduction

Webpack's core configuration is based on creating and modifying a
potentially unwieldy JavaScript object. While this is OK for configurations
on individual projects, trying to share these objects across projects and
make subsequent modifications gets messy, as you need to have a deep
understanding of the underlying object structure to make those changes.

`@berun/fluent` attempts to improve this process by providing a chainable or
fluent API for creating and modifying webpack configurations. Key portions
of the API can be referenced by user-specified names, which helps to
standardize how to modify a configuration across projects.

This is easier explained through the examples following.

## Installation

`@berun/fluent-webpack` requires Node.js v8.3 and higher.

You may install this package using either Yarn or npm (choose one):

**Yarn**

```bash
yarn add --dev @berun/fluent-webpack
```

**npm**

```bash
npm install --save-dev @berun/fluent-webpack
```

## Getting Started

Once you have `@berun/fluent` installed, you can start creating a
Webpack configuration. For this guide, our example base configuration will
be `webpack.config.js` in the root of our project directory.

```js
// Require the [BeRun Fluent](https://github.com/bestyled/berun/master/packages/fluent)module. This module exports a single
// constructor function for creating a configuration API.
import { berun as berunCreate } from '@berun/berun'

// Instantiate the configuration with a new API
const berun = berunCreate()

// Make configuration changes using the chain API.
// Every API call tracks a change to the stored configuration.

berun
  // Interact with entry points
  .entry('index')
  .add('src/index.ts')
  .end()
  // Modify output settings
  .output.path('dist')
  .filename('[name].bundle.js')

// Create named rules which can be modified later
berun.module
  .rule('lint')
  .test(/\.js$/)
  .pre()
  .include.add('src')
  .end()
  // Even create named uses (loaders)
  .use('eslint')
  .loader('eslint-loader')
  .options({
    rules: {
      semi: 'off'
    }
  })

berun.module
  .rule('compile')
  .test(/\.js$/)
  .include.add('src')
  .add('test')
  .end()
  .use('babel')
  .loader('babel-loader')
  .options({
    presets: [['babel-preset-es2015', { modules: false }]]
  })

// Create named plugins too!
berun.plugin('clean').use(CleanPlugin, [['dist'], { root: '/dir' }])

// Export the completed configuration object to be consumed by webpack
export default berun.toConfig()
```

Having shared configurations is also simple. Just export the configuration
and call `.toConfig()` prior to passing to Webpack.

```js
// webpack.core.js
import { berun as berunCreate } from '@berun/berun'
const berun = berunCreate()

// Make configuration shared across targets
// ...

export default config

// webpack.dev.js
const config = require('./webpack.core')

// Dev-specific configuration
// ...
export default config.toConfig()

// webpack.prod.js
const config = require('./webpack.core')

// Production-specific configuration
// ...
export default config.toConfig()
```

## FluentMap

One of the core API interfaces in [BeRun Fluent](https://github.com/bestyled/berun/master/packages/fluent)is a `FluentMap`. A `FluentMap` operates
similar to a JavaScript Map, with some conveniences for chaining and generating configuration.
If a property is marked as being a `FluentMap`, it will have an API and methods as described below:

**Unless stated otherwise, these methods will return the `FluentMap`, allowing you to chain these methods.**

```js
// Remove all entries from a Map.
clear()
```

```js
// Remove a single entry from a Map given its key.
// key: *
delete key
```

```js
// Fetch the value from a Map located at the corresponding key.
// key: *
// returns: value
get(key)
```

```js
// Set a value on the Map stored at the `key` location.
// key: *
// value: *
set(key, value)
```

```js
// Returns `true` or `false` based on whether a Map as has a value set at a particular key.
// key: *
// returns: Boolean
has(key)
```

```js
// Returns an array of all the values stored in the Map.
// returns: Array
values()
```

```js
// Returns an object of all the entries in the backing Map
// where the key is the object property, and the value
// corresponding to the key. Will return `undefined` if the backing
// Map is empty.
// This will order properties by their name if the value is
// a FluentMap that used .before() or .after().
// returns: Object, undefined if empty
entries()
```

```js
// Provide an object which maps its properties and values
// into the backing Map as keys and values.
// You can also provide an array as the second argument
// for property names to omit from being merged.
// obj: Object
// omit: Optional Array
merge(obj, omit)
```

```js
// Execute a function against the current configuration context
// handler: Function -> FluentMap
// A function which is given a single argument of the FluentMap instance
batch(handler)
```

```js
// Conditionally execute a function to continue configuration
// condition: Boolean
// whenTruthy: Function -> FluentMap
// invoked when condition is truthy, given a single argument of the FluentMap instance
// whenFalsy: Optional Function -> FluentMap
// invoked when condition is falsy, given a single argument of the FluentMap instance
when(condition, whenTruthy, whenFalsy)
```

## FluentSet

Another of the core API interfaces in [BeRun Fluent](https://github.com/bestyled/berun/master/packages/fluent)is a `FluentSet`. A `FluentSet` operates
similar to a JavaScript Set, with some conveniences for chaining and generating configuration.
If a property is marked as being a `FluentSet`, it will have an API and methods as described below:

**Unless stated otherwise, these methods will return the `FluentSet`, allowing you to chain these methods.**

```js
// Add/append a value to the end of a Set.
// value: *
add(value)
```

```js
// Add a value to the beginning of a Set.
// value: *
prepend(value)
```

```js
// Remove all values from a Set.
clear()
```

```js
// Remove a specific value from a Set.
// value: *
delete value
```

```js
// Returns `true` or `false` based on whether or not the
// backing Set contains the specified value.
// value: *
// returns: Boolean
has(value)
```

```js
// Returns an array of values contained in the backing Set.
// returns: Array
values()
```

```js
// Concatenates the given array to the end of the backing Set.
// arr: Array
merge(arr)
```

```js
// Execute a function against the current configuration context
// handler: Function -> FluentSet
// A function which is given a single argument of the FluentSet instance
batch(handler)
```

```js
// Conditionally execute a function to continue configuration
// condition: Boolean
// whenTruthy: Function -> FluentSet
// invoked when condition is truthy, given a single argument of the FluentSet instance
// whenFalsy: Optional Function -> FluentSet
// invoked when condition is falsy, given a single argument of the FluentSet instance
when(condition, whenTruthy, whenFalsy)
```

## Shorthand methods

A number of shorthand methods exist for setting a value on a `FluentMap`
with the same key as the shorthand method name.
For example, `devServer.hot` is a shorthand method, so it can be used as:

```js
// A shorthand method for setting a value on a FluentMap
devServer.hot(true)

// This would be equivalent to:
devServer.set('hot', true)
```

A shorthand method is chainable, so calling it will return the original instance,
allowing you to continue to chain.

### Config

Create a new configuration object.

```js
const Config = require('@berun/berun')

const config = new Config()
```

Moving to deeper points in the API will change the context of what you
are modifying. You can move back to the higher context by either referencing
the top-level `config` again, or by calling `.end()` to move up one level.
If you are familiar with jQuery, `.end()` works similarly. All API calls
will return the API instance at the current context unless otherwise
specified. This is so you may chain API calls continuously if desired.

For details on the specific values that are valid for all shorthand and low-level methods,
please refer to their corresponding name in the
[Webpack docs hierarchy](https://webpack.js.org/configuration/).

```js
Config: FluentMap
```

#### Config shorthand methods

```js
config
  .amd(amd)
  .bail(bail)
  .cache(cache)
  .devtool(devtool)
  .context(context)
  .externals(externals)
  .loader(loader)
  .mode(mode)
  .parallelism(parallelism)
  .profile(profile)
  .recordsPath(recordsPath)
  .recordsInputPath(recordsInputPath)
  .recordsOutputPath(recordsOutputPath)
  .stats(stats)
  .target(target)
  .watch(watch)
  .watchOptions(watchOptions)
```

#### Config entryPoints

```js
// Backed at config.entryPoints : FluentMap
config.entry(name) : FluentSet

config
  .entry(name)
    .add(value)
    .add(value)

config
  .entry(name)
    .clear()

// Using low-level config.entryPoints:

config.entryPoints
  .get(name)
    .add(value)
    .add(value)

config.entryPoints
  .get(name)
    .clear()
```

#### Config output: shorthand methods

```js
config.output : FluentMap

config.output
  .auxiliaryComment(auxiliaryComment)
  .chunkFilename(chunkFilename)
  .chunkLoadTimeout(chunkLoadTimeout)
  .crossOriginLoading(crossOriginLoading)
  .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
  .devtoolLineToLine(devtoolLineToLine)
  .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
  .filename(filename)
  .hashFunction(hashFunction)
  .hashDigest(hashDigest)
  .hashDigestLength(hashDigestLength)
  .hashSalt(hashSalt)
  .hotUpdateChunkFilename(hotUpdateChunkFilename)
  .hotUpdateFunction(hotUpdateFunction)
  .hotUpdateMainFilename(hotUpdateMainFilename)
  .jsonpFunction(jsonpFunction)
  .library(library)
  .libraryExport(libraryExport)
  .libraryTarget(libraryTarget)
  .path(path)
  .pathinfo(pathinfo)
  .publicPath(publicPath)
  .sourceMapFilename(sourceMapFilename)
  .sourcePrefix(sourcePrefix)
  .strictModuleExceptionHandling(strictModuleExceptionHandling)
  .umdNamedDefine(umdNamedDefine)
```

#### Config resolve: shorthand methods

```js
config.resolve : FluentMap

config.resolve
  .cachePredicate(cachePredicate)
  .cacheWithContext(cacheWithContext)
  .enforceExtension(enforceExtension)
  .enforceModuleExtension(enforceModuleExtension)
  .unsafeCache(unsafeCache)
  .symlinks(symlinks)
```

#### Config resolve alias

```js
config.resolve.alias : FluentMap

config.resolve.alias
  .set(key, value)
  .set(key, value)
  .delete(key)
  .clear()
```

#### Config resolve modules

```js
config.resolve.modules : FluentSet

config.resolve.modules
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve aliasFields

```js
config.resolve.aliasFields : FluentSet

config.resolve.aliasFields
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve descriptionFields

```js
config.resolve.descriptionFields : FluentSet

config.resolve.descriptionFields
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve extensions

```js
config.resolve.extensions : FluentSet

config.resolve.extensions
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve mainFields

```js
config.resolve.mainFields : FluentSet

config.resolve.mainFields
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolve mainFiles

```js
config.resolve.mainFiles : FluentSet

config.resolve.mainFiles
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolveLoader

```js
config.resolveLoader : FluentMap
```

#### Config resolveLoader extensions

```js
config.resolveLoader.extensions : FluentSet

config.resolveLoader.extensions
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolveLoader modules

```js
config.resolveLoader.modules : FluentSet

config.resolveLoader.modules
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolveLoader moduleExtensions

```js
config.resolveLoader.moduleExtensions : FluentSet

config.resolveLoader.moduleExtensions
  .add(value)
  .prepend(value)
  .clear()
```

#### Config resolveLoader packageMains

```js
config.resolveLoader.packageMains : FluentSet

config.resolveLoader.packageMains
  .add(value)
  .prepend(value)
  .clear()
```

#### Config performance: shorthand methods

```js
config.performance : FluentMap

config.performance
  .hints(hints)
  .maxEntrypointSize(maxEntrypointSize)
  .maxAssetSize(maxAssetSize)
  .assetFilter(assetFilter)
```

#### Configuring optimizations: shorthand methods

```js
config.optimization : FluentMap

config.optimization
  .concatenateModules(concatenateModules)
  .flagIncludedChunks(flagIncludedChunks)
  .mergeDuplicateChunks(mergeDuplicateChunks)
  .minimize(minimize)
  .minimizer(minimizer)
  .namedChunks(namedChunks)
  .namedModules(namedModules)
  .nodeEnv(nodeEnv)
  .noEmitOnErrors(noEmitOnErrors)
  .occurrenceOrder(occurrenceOrder)
  .portableRecords(portableRecords)
  .providedExports(providedExports)
  .removeAvailableModules(removeAvailableModules)
  .removeEmptyChunks(removeEmptyChunks)
  .runtimeChunk(runtimeChunk)
  .sideEffects(sideEffects)
  .splitChunks(splitChunks)
  .usedExports(usedExports)
```

#### Config plugins

```js
// Backed at config.plugins
config.plugin(name) : FluentMap
```

#### Config plugins: adding

_NOTE: Do not use `new` to create the plugin, as this will be done for you._

```js
config.plugin(name).use(WebpackPlugin, args)

// Examples
config.plugin('hot').use(webpack.HotModuleReplacementPlugin)

config.plugin('env').use(webpack.EnvironmentPlugin, ['NODE_ENV'])
```

#### Config plugins: modify arguments

```js
config.plugin(name).tap(args => newArgs)

// Example
config.plugin('env').tap(args => [...args, 'SECRET_KEY'])
```

#### Config plugins: modify instantiation

```js
config.plugin(name).init((Plugin, args) => new Plugin(...args))
```

#### Config plugins: removing

```js
config.plugins.delete(name)
```

#### Config plugins: ordering before

Specify that the current `plugin` context should operate before another named `plugin`.
You cannot use both `.before()` and `.after()` on the same plugin.

```js
config.plugin(name).before(otherName)

// Example

config
  .plugin('html-template')
  .use(HtmlWebpackTemplate)
  .end()
  .plugin('script-ext')
  .use(ScriptExtWebpackPlugin)
  .before('html-template')
```

#### Config plugins: ordering after

Specify that the current `plugin` context should operate after another named `plugin`.
You cannot use both `.before()` and `.after()` on the same plugin.

```js
config.plugin(name).after(otherName)

// Example

config
  .plugin('html-template')
  .after('script-ext')
  .use(HtmlWebpackTemplate)
  .end()
  .plugin('script-ext')
  .use(ScriptExtWebpackPlugin)
```

#### Config resolve plugins

```js
// Backed at config.resolve.plugins
config.resolve.plugin(name) : FluentMap
```

#### Config resolve plugins: adding

_NOTE: Do not use `new` to create the plugin, as this will be done for you._

```js
config.resolve.plugin(name).use(WebpackPlugin, args)
```

#### Config resolve plugins: modify arguments

```js
config.resolve.plugin(name).tap(args => newArgs)
```

#### Config resolve plugins: modify instantiation

```js
config.resolve.plugin(name).init((Plugin, args) => new Plugin(...args))
```

#### Config resolve plugins: removing

```js
config.resolve.plugins.delete(name)
```

#### Config resolve plugins: ordering before

Specify that the current `plugin` context should operate before another named `plugin`.
You cannot use both `.before()` and `.after()` on the same resolve plugin.

```js
config.resolve.plugin(name).before(otherName)

// Example

config.resolve
  .plugin('beta')
  .use(BetaWebpackPlugin)
  .end()
  .plugin('alpha')
  .use(AlphaWebpackPlugin)
  .before('beta')
```

#### Config resolve plugins: ordering after

Specify that the current `plugin` context should operate after another named `plugin`.
You cannot use both `.before()` and `.after()` on the same resolve plugin.

```js
config.resolve.plugin(name).after(otherName)

// Example

config.resolve
  .plugin('beta')
  .after('alpha')
  .use(BetaWebpackTemplate)
  .end()
  .plugin('alpha')
  .use(AlphaWebpackPlugin)
```

#### Config node

```js
config.node : FluentMap

config.node
  .set('__dirname', 'mock')
  .set('__filename', 'mock');
```

#### Config devServer

```js
config.devServer : FluentMap
```

#### Config devServer allowedHosts

```js
config.devServer.allowedHosts : FluentSet

config.devServer.allowedHosts
  .add(value)
  .prepend(value)
  .clear()
```

#### Config devServer: shorthand methods

```js
config.devServer
  .bonjour(bonjour)
  .clientLogLevel(clientLogLevel)
  .color(color)
  .compress(compress)
  .contentBase(contentBase)
  .disableHostCheck(disableHostCheck)
  .filename(filename)
  .headers(headers)
  .historyApiFallback(historyApiFallback)
  .host(host)
  .hot(hot)
  .hotOnly(hotOnly)
  .https(https)
  .inline(inline)
  .info(info)
  .lazy(lazy)
  .noInfo(noInfo)
  .open(open)
  .openPage(openPage)
  .overlay(overlay)
  .pfx(pfx)
  .pfxPassphrase(pfsPassphrase)
  .port(port)
  .progress(progress)
  .proxy(proxy)
  .public(public)
  .publicPath(publicPath)
  .quiet(quiet)
  .setup(setup)
  .socket(socket)
  .staticOptions(staticOptions)
  .stats(stats)
  .stdin(stdin)
  .useLocalIp(useLocalIp)
  .watchContentBase(watchContentBase)
  .watchOptions(watchOptions)
```

#### Config module

```js
config.module : FluentMap
```

#### Config module: shorthand methods

```js
config.module : FluentMap

config.module
  .noParse(noParse)
```

#### Config module rules: shorthand methods

```js
config.module.rules : FluentMap

config.module
  .rule(name)
    .test(test)
    .pre()
    .post()
    .enforce(preOrPost)
```

#### Config module rules uses (loaders): creating

```js
config.module.rules{}.uses : FluentMap

config.module
  .rule(name)
    .use(name)
      .loader(loader)
      .options(options)

// Example

config.module
  .rule('compile')
    .use('babel')
      .loader('babel-loader')
      .options({ presets: ['babel-preset-es2015'] });
```

#### Config module rules uses (loaders): modifying options

```js
config.module
  .rule(name)
  .use(name)
  .tap(options => newOptions)

// Example

config.module
  .rule('compile')
  .use('babel')
  .tap(options =>
    merge(options, { plugins: ['babel-plugin-syntax-object-rest-spread'] })
  )
```

#### Config module rules oneOfs (conditional rules):

```js
config.module.rules{}.oneOfs : FluentMap<Rule>

config.module
  .rule(name)
    .oneOf(name)

// Example

config.module
  .rule('css')
    .oneOf('inline')
      .resourceQuery(/inline/)
      .use('url')
        .loader('url-loader')
        .end()
      .end()
    .oneOf('external')
      .resourceQuery(/external/)
      .use('file')
        .loader('file-loader')
```

---

### Merging Config

@berun/fluent supports merging in an object to the configuration instance which matches a layout
similar to how the [BeRun Fluent](https://github.com/bestyled/berun/master/packages/fluent)schema is laid out. Note that this is not a Webpack configuration
object, but you may transform a Webpack configuration object before providing it to @berun/fluent
to match its layout.

```js
config.merge({ devtool: 'source-map' })

config.get('devtool') // "source-map"
```

```js
config.merge({
  [key]: value,

  amd,
  bail,
  cache,
  context,
  devtool,
  externals,
  loader,
  mode,
  parallelism,
  profile,
  recordsPath,
  recordsInputPath,
  recordsOutputPath,
  stats,
  target,
  watch,
  watchOptions,

  entry: {
    [name]: [...values]
  },

  plugin: {
    [name]: {
      plugin: WebpackPlugin,
      args: [...args],
      before,
      after
    }
  },

  devServer: {
    [key]: value,

    clientLogLevel,
    compress,
    contentBase,
    filename,
    headers,
    historyApiFallback,
    host,
    hot,
    hotOnly,
    https,
    inline,
    lazy,
    noInfo,
    overlay,
    port,
    proxy,
    quiet,
    setup,
    stats,
    watchContentBase
  },

  node: {
    [key]: value
  },

  optimizations: {
    concatenateModules,
    flagIncludedChunks,
    mergeDuplicateChunks,
    minimize,
    minimizer,
    namedChunks,
    namedModules,
    nodeEnv,
    noEmitOnErrors,
    occurrenceOrder,
    portableRecords,
    providedExports,
    removeAvailableModules,
    removeEmptyChunks,
    runtimeChunk,
    sideEffects,
    splitChunks,
    usedExports
  },

  performance: {
    [key]: value,

    hints,
    maxEntrypointSize,
    maxAssetSize,
    assetFilter
  },

  resolve: {
    [key]: value,

    alias: {
      [key]: value
    },
    aliasFields: [...values],
    descriptionFields: [...values],
    extensions: [...values],
    mainFields: [...values],
    mainFiles: [...values],
    modules: [...values],

    plugin: {
      [name]: {
        plugin: WebpackPlugin,
        args: [...args],
        before,
        after
      }
    }
  },

  resolveLoader: {
    [key]: value,

    extensions: [...values],
    modules: [...values],
    moduleExtensions: [...values],
    packageMains: [...values]
  },

  module: {
    [key]: value,

    rule: {
      [name]: {
        [key]: value,

        enforce,
        issuer,
        parser,
        resource,
        resourceQuery,
        test,

        include: [...paths],
        exclude: [...paths],

        oneOf: {
          [name]: Rule
        },

        use: {
          [name]: {
            loader: LoaderString,
            options: LoaderOptions,
            before,
            after
          }
        }
      }
    }
  }
})
```

### Conditional configuration

When working with instances of `FluentMap` and `FluentSet`, you can perform conditional configuration using `when`.
You must specify an expression to `when()` which will be evaluated for truthiness or falsiness. If the expression is
truthy, the first function argument will be invoked with an instance of the current Fluent instance. You can optionally
provide a second function to be invoked when the condition is falsy, which is also given the current Fluent instance.

```js
// Example: Only add minify plugin during production
config.when(process.env.NODE_ENV === 'production', config => {
  config.plugin('minify').use(BabiliWebpackPlugin)
})
```

```js
// Example: Only add minify plugin during production,
// otherwise set devtool to source-map
config.when(
  process.env.NODE_ENV === 'production',
  config => config.plugin('minify').use(BabiliWebpackPlugin),
  config => config.devtool('source-map')
)
```

### Inspecting generated configuration

You can inspect the generated webpack config using `config.toString()`. This will generate a stringified version of the config with comment hints for named rules, uses and plugins:

```js
config
  .module
    .rule('compile')
      .test(/\.js$/)
      .use('babel')
        .loader('babel-loader');

config.toString();

/*
{
  module: {
    rules: [
      /* config.module.rule('compile') */
      {
        test: /\.js$/,
        use: [
          /* config.module.rule('compile').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
*/
```

By default the generated string cannot be used directly as real webpack config if it contains functions and plugins that need to be required. In order to generate usable config, you can customize how functions and plugins are stringified by setting a special `__expression` property on them:

```js
class MyPlugin {}
MyPlugin.__expression = `require('my-plugin')`

function myFunction() {}
myFunction.__expression = `require('my-function')`

config.plugin('example').use(MyPlugin, [{ fn: myFunction }])

config.toString()

/*
{
  plugins: [
    new (require('my-plugin'))({
      fn: require('my-function')
    })
  ]
}
*/
```

You can also call `toString` as a static method on `Config` in order to
modify the configuration object prior to stringifying.

```js
Config.toString({
  ...config.toConfig(),
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: { prefix: 'banner-prefix.txt' },
          },
        ],
      },
    ],
  },
})

/*
{
  plugins: [
    /* config.plugin('foo') */
    new TestPlugin()
  ],
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: {
              prefix: 'banner-prefix.txt'
            }
          }
        ]
      }
    ]
  }
}
*/
```
