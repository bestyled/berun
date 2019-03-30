const { WebIndexPlugin } = require('fuse-box')

module.exports.pluginMiniHTML = (options = {}) => {
  const { links = '', body = '', css = '', head = '', noJS } = options.context
  const { target = 'index.html' } = options

  const templateString = `<!DOCTYPE html>
<html>
    <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>
    ${head}${css}${links}
    </head>
<body>
<div id=root>${body}</div>
${noJS ? '' : '$bundles'}
</body>
</html>`

  return WebIndexPlugin({
    templateString: templateString,
    target,
    path: '/'
  })
}
