/* eslint-disable no-case-declarations */
import resolveCWD from 'resolve-cwd'
import renderAlgolia from './preset-render-algolia'

const renderPage = async (
  h,
  renderToString,
  renderToStaticMarkup,
  App,
  routes,
  sitedata,
  renderToHtml,
  path,
  opts
) => {
  let body
  let css
  const headTags = []
  const bodyTags = []
  const observers = []
  const datacache = {}

  const el = h(App, {
    routes,
    sitedata,
    headTags,
    bodyTags,
    observers,
    datacache,
    staticrouter: {
      basename: opts.basename,
      location: path,
      context: {}
    }
  })

  if (renderToHtml) {
    let html

    html = renderToHtml(renderToString, el)

    if (observers.length > 0) {
      // Render twice if getData was observed, to ensure we don't render "Is Loading"
      await Promise.all(observers)
      html = renderToHtml(renderToString, el)
    }

    body = html.body
    css = html.head
  } else {
    switch (opts.cssLibrary) {
      case 'styled-components':
        const { ServerStyleSheet } = require(resolveCWD('styled-components'))
        const sheet = new ServerStyleSheet()
        body = renderToString(sheet.collectStyles(el))
        css = sheet.getStyleTags()
        break
      case 'emotion':
        const { renderStylesToString } = require(resolveCWD('emotion-server'))
        body = renderStylesToString(renderToString(el))
        break
      default:
      case 'raw':
        body = renderToString(el)
        break
    }
  }
  const head = renderToStaticMarkup(headTags)
  body += renderToStaticMarkup(bodyTags)

  return { body, css, head }
}

const renderHTML = async (
  h,
  renderToString,
  renderToStaticMarkup,
  App,
  routes,
  sitedata,
  renderToHtml,
  opts
) => {
  const pages = (await Promise.all(
    routes.flattened.map(async route => {
      const { body, css, head } = await renderPage(
        h,
        renderToString,
        renderToStaticMarkup,
        App,
        routes,
        sitedata,
        renderToHtml,
        route.path,
        opts
      )
      return { body, head, css, ...opts, ...route }
    })
  )) as { body: any; head: any; css: any; path: string; [key: string]: any }[]

  if (sitedata.algolia) {
    renderAlgolia(pages, routes, sitedata, opts)
  }

  return pages
}

export default renderHTML
