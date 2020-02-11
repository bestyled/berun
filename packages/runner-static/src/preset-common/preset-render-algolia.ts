import docsearch from 'rehype-docsearch'
import * as fs from 'fs'
import * as path from 'path'

const renderAlgolia = async (pages, routes, sitedata, opts) => {
  const result = await Promise.all(
    pages.map(async page => {
      const html = `<!DOCTYPE html>
      <html><head></head>
      <body><div id="root">${page.body}</div></body>
      </html>`

      const searches = await docsearch(html, {
        url: new URL(page.path, opts.homepage).href
      })
      return searches
    })
  )

  fs.writeFileSync(
    path.join(opts.appBuild, 'algolia.json'),
    JSON.stringify(Array.prototype.concat.apply([], result), null, 2)
  )
}

export default renderAlgolia
