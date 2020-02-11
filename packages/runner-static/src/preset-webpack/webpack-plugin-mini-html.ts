import * as path from 'path'
import { RawSource } from 'webpack-sources'

class HTMLMiniPlugin {
  private options

  constructor(
    options: {
      filename?: string
      template?: any
      context?: any
    } = {}
  ) {
    this.options = options
    this.plugin = this.plugin.bind(this)
  }

  plugin(compilation, callback) {
    const { publicPath } = compilation.options.output
    const {
      filename = 'index.html',
      template = defaultTemplate,
      context
    } = this.options

    const files = getFiles(compilation.entrypoints)
    const links = generateCSSReferences(files.css, publicPath)
    const scripts = generateJSReferences(files.js, publicPath)
    const ctx = {
      ...files,
      publicPath,
      links,
      scripts,
      ...context
    }

    compilation.assets[filename] = new RawSource(template(ctx))

    callback()
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('MiniHtmlPlugin', this.plugin)
  }
}

const getFiles = entrypoints => {
  const files: any = {}

  entrypoints.forEach(entry => {
    entry.getFiles().forEach(file => {
      const extension = path.extname(file).replace(/\./, '')

      if (!files[extension]) {
        files[extension] = []
      }

      files[extension].push(file)
    })
  })

  return files
}

const defaultTemplate = ({
  links,
  scripts,
  body = '',
  head = '',
  css = '',
  noJS
}) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <link rel="shortcut icon" href="favicon.ico">
    <style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>
    ${head}${css}${links}
  </head>
  <body>
    <div id=root>${body}</div>
    ${noJS ? '' : scripts}
  </body>
</html>`

const generateCSSReferences = (files = [], publicPath = '') =>
  files
    .map(file => `<link href='${publicPath}${file}' rel='stylesheet'>`)
    .join('')

const generateJSReferences = (files = [], publicPath = '') =>
  files.map(file => `<script src='${publicPath}${file}'></script>`).join('')

export default HTMLMiniPlugin
export const template = defaultTemplate
