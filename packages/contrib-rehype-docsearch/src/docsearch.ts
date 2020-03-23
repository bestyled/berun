// Custom DocSearch Rehype Compiler
import hastToDocsearch from './hast-to-docsearch'

const unified = require('unified')
const parseHTML = require('rehype-parse')

const DEFAULT_OPTIONS = {
  hastPlugins: [],
  compilers: []
}

function createCompiler(options) {
  const { hastPlugins } = options
  const { compilers } = options

  const fn = unified().use(parseHTML, options)

  hastPlugins.forEach(plugin => {
    // handle [plugin, pluginOptions] syntax
    if (Array.isArray(plugin) && plugin.length > 1) {
      fn.use(plugin[0], plugin[1])
    } else {
      fn.use(plugin, options)
    }
  })

  fn.use(hastToDocsearch, options)

  compilers.forEach(compilerPlugin => {
    fn.use(compilerPlugin, options)
  })

  return fn
}

export const docsearchSync = function docsearchSync(
  src,
  options: {
    filepath?: string
    path?: string
    hastPlugins?: any[]
    compilers?: any[]
  } = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const compiler = createCompiler(opts)

  const fileOpts: { filepath?: string; path?: string; contents?: string } = {
    contents: src
  }
  if (opts.filepath) {
    fileOpts.path = opts.filepath
  }

  try {
    const { contents } = compiler.processSync(fileOpts)
    return contents
  } catch (ex) {
    console.log(ex)
    return undefined
  }
}

export default async function docsearchAsync(
  src,
  options: {
    filepath?: string
    path?: string
    hastPlugins?: any[]
    compilers?: any[]
  } = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const compiler = createCompiler(opts)

  const fileOpts: { filepath?: string; path?: string; contents?: string } = {
    contents: src
  }
  if (opts.filepath) {
    fileOpts.path = opts.filepath
  }

  try {
    const { contents } = await compiler.process(fileOpts)
    return contents
  } catch (ex) {
    console.log(ex)
    return undefined
  }
}
