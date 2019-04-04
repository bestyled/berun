const unified =require('unified')
const parseHTML = require('rehype-parse')

// Custom DocSearch Rehype Compiler
const hastToDocsearch =require('./hast-to-docsearch')

const DEFAULT_OPTIONS = {
  hastPlugins: [],
  compilers: []
}

function createCompiler(options) {
  const hastPlugins = options.hastPlugins
  const compilers = options.compilers

  const fn = unified()
    .use(parseHTML, options)

  hastPlugins.forEach(plugin => {
    // handle [plugin, pluginOptions] syntax
    if (Array.isArray(plugin) && plugin.length > 1) {
      fn.use(plugin[0], plugin[1])
    } else {
      fn.use(plugin, options)
    }
  })

  fn.use(hastToDocsearch, options)

  for (const compilerPlugin of compilers) {
    fn.use(compilerPlugin, options)
  }

  return fn

}

module.exports.docsearchSync = function docsearchSync(
  src,
  options = {}
) {
  const opts = Object.assign({}, DEFAULT_OPTIONS, options)
  const compiler = createCompiler(opts)

  const fileOpts = { contents: src }
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

module.exports.default = async function docsearchAsync(
  src,
  options = {}
) {
  const opts = Object.assign({}, DEFAULT_OPTIONS, options)
  const compiler = createCompiler(opts)

  const fileOpts = { contents: src }
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