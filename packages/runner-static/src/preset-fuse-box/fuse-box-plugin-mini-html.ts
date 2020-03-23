import { WebIndexPlugin } from 'fuse-box'

export const pluginMiniHTML = (
  options: {
    target?: string
    context?: {
      links?: string
      body?: string
      css?: string
      head?: string
      noJS?: boolean
    }
  } = { context: {} }
) => {
  const { links = '', body = '', css = '', head = '', noJS } = options.context
  const { target = 'index.html' } = options

  const templateString = `<!DOCTYPE html>
<html>
    <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <link rel="shortcut icon" href="/favicon.ico">
    <style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>
    ${head}${css}${links}
    </head>
<body>
<div id=root>${body}</div>
${noJS ? '' : '$bundles'}
</body>
</html>`

  return WebIndexPlugin({
    templateString,
    target,
    path: '/'
  })
}
