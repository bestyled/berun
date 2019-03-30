import React from 'react'
import { render, hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createContext } from './config/createContext'
import { getRoutes } from './config/getRoutes'
import { App } from './App'
import config from '@bestatic/config' // dynamically loaded using bundler fron app or ./config directory

async function init() {
  const bestatic = createContext()

  const routes = await getRoutes(bestatic, config)
  const sitedata = await config.getSiteData(bestatic)

  const div = document.getElementById('root')

  if (!div) throw new Error("Missing <div id='root'> in HTML")

  const mount = div.innerHTML ? hydrate : render

  const basename = process.env.PUBLIC_URL
  const props = process.env.BESTATIC_OPTIONS || {}

  mount(
    <BrowserRouter basename={basename}>
      <App routes={routes} sitedata={sitedata} {...props} />
    </BrowserRouter>,
    div
  )
}

if (typeof document !== 'undefined') {
  init()
}
