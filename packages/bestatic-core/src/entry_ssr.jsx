import config from '@bestatic/config' // dynamically loaded using bundler fron app or ./config directory
import * as React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { App } from './App'
import { createContext } from './config/createContext'
import { getRoutes } from './config/getRoutes'

export default async function() {
  const bestatic = createContext()
  const routes = await getRoutes(bestatic, config)
  const sitedata = await config.getSiteData(bestatic)

  return {
    renderToString,
    renderToStaticMarkup,
    h: React.createElement,
    App,
    routes,
    sitedata,
    config
  }
}
