// Forked from fuse-box/fuse-box with only change being to allow
// use of context at file level for each transform, not class level
// this allows use of this plugin in a Fuse-Box plugin chain
// Copyright (c) 2016 fuse-box

import * as fs from 'fs'
import * as path from 'path'
import { File, WorkFlowContext, Plugin } from 'fuse-box'

let babelCore

/**
 * @export
 * @class FuseBoxBabelPlugin
 * @implements {Plugin}
 */
export class BabelPluginClass implements Plugin {
  /**
   * We can add tsx and ts here as well
   * Because Babel won't capture it just being a Plugin
   * Typescript files are handled before any external plugin is executed
   */
  public extensions: Array<string> = ['.jsx']

  public test = /\.(j|t)s(x)?$/

  public context: WorkFlowContext

  private limit2project = true

  private config?: any = {}

  private configPrinted = false

  private configLoaded = false

  constructor(opts: any = {}) {
    // if it is an object containing only a babel config
    if (
      opts.config === undefined &&
      opts.test === undefined &&
      opts.limit2project === undefined &&
      opts.extensions === undefined &&
      Object.keys(opts).length
    ) {
      this.config = opts
      return
    }

    if (opts.config) {
      this.config = opts.config
    }
    if (opts.extensions !== undefined) {
      this.extensions = opts.extensions

      if (opts.test === undefined) {
        this.test = string2RegExp(opts.extensions.join('|'))
      }
    }
    if (opts.test !== undefined) {
      this.test = opts.test
    }
    if (opts.limit2project !== undefined) {
      this.limit2project = opts.limit2project
    }
  }

  /**
   * @see this.init
   */
  private handleBabelRc(context: WorkFlowContext) {
    if (this.configLoaded) {
      return
    }

    let babelRcConfig
    const babelRcPath = path.join(context.appRoot, `.babelrc`)

    if (fs.existsSync(babelRcPath)) {
      babelRcConfig = fs.readFileSync(babelRcPath).toString()

      if (babelRcConfig) {
        try {
          babelRcConfig = {
            ...JSON.parse(babelRcConfig),
            ...this.config
          }
        } catch (ex) {
          console.error(`Error parsing .babelrc ${ex.message}`)
          process.exit(1)
        }
      }
    }

    if (babelRcConfig) {
      this.config = babelRcConfig
    }

    this.configLoaded = true
  }

  /**
   * @param {WorkFlowContext} context
   */
  public init(context: WorkFlowContext) {
    if (Array.isArray(this.extensions)) {
      this.extensions.forEach(ext => context.allowExtension(ext))
    }
    this.handleBabelRc(context)
  }

  /**
   * @param {File} file
   */
  public transform(file: File, ast: any) {
    file.wasTranspiled = true
    if (!babelCore) {
      // eslint-disable-next-line global-require
      babelCore = require('@babel/core')
    }
    if (this.configPrinted === false && file.context.doLog === true) {
      file.context.debug(
        'BabelPlugin',
        `\n\tConfiguration: ${JSON.stringify(this.config)}`
      )
      this.configPrinted = true
    }

    if (file.context.useCache) {
      if (file.loadFromCache()) {
        return
      }
    }

    // contents might not be loaded if using a custom file extension
    file.loadContents()

    // whether we should transform the contents
    // @TODO needs improvement for the regex matching of what to include
    //       with globs & regex
    if (
      this.limit2project === false ||
      file.collection.name === file.context.defaultPackageName
    ) {
      let result
      try {
        this.config.filename = file.absPath

        result = babelCore.transform(file.contents, this.config)
      } catch (e) {
        file.analysis.skip()
        console.error(e)
        return
      }

      // By default we would want to limit the babel
      // And use acorn instead (it's faster)
      if (result.ast) {
        file.analysis.loadAst(result.ast)
        let sourceMaps = result.map

        // escodegen does not realy like babel
        // so a custom function handles tranformation here if needed
        // This happens only when the code is required regeneration
        // for example with alises -> in any cases this will stay untouched
        file.context.setCodeGenerator(ast2 => {
          const result2 = babelCore.transformFromAst(ast2)
          sourceMaps = result2.map
          return result2.code
        })

        file.contents = result.code
        file.analysis.analyze()

        if (sourceMaps) {
          sourceMaps.file = file.info.fuseBoxPath
          sourceMaps.sources = [
            `${file.context.sourceMapsRoot}/${file.info.fuseBoxPath}`
          ]
          if (!file.context.inlineSourceMaps) {
            delete sourceMaps.sourcesContent
          }

          file.sourceMap = JSON.stringify(sourceMaps)
        }

        if (file.context.useCache) {
          file.context.emitJavascriptHotReload(file)
          file.context.cache.writeStaticCache(file, file.sourceMap)
        }
      }
    }
  }
}

export const BabelPlugin = (opts: any = {}) => {
  return new BabelPluginClass(opts)
}

function string2RegExp(obj: any) {
  let escapedRegEx = obj
    .replace(/\*/g, '@')

    .replace(/[.?*+[\]-]/g, '\\$&')
    .replace(/@@/g, '.*', 'i')
    .replace(/@/g, '\\w{1,}', 'i')

  if (escapedRegEx.indexOf('$') === -1) {
    escapedRegEx += '$'
  }
  return new RegExp(escapedRegEx)
}
