import config from '@bestatic/config' // dynamically loaded using bundler fron app or ./config directory
import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { App } from './App'
import { createBeStaticContext } from './config/createBeStaticContext'
import { getRoutes } from './config/getRoutes'

export default async function() {
  const bestatic = await createBeStaticContext(config)
  const routes = await getRoutes(bestatic, config)

  return {
    renderToString,
    renderToStaticMarkup,
    h: React.createElement,
    App,
    routes,
    sitedata: bestatic,
    config
  }
}
