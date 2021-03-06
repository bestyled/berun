import * as React from 'react'
import { render, hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import config from '@bestatic/config' // dynamically loaded using bundler fron app or ./config directory
import { createBeStaticContext } from './config/createBeStaticContext'
import { getRoutes } from './config/getRoutes'
import { App } from './App'

async function init() {
  const bestatic = await createBeStaticContext(config)
  const routes = await getRoutes(bestatic, config)

  const div = document.getElementById('root')

  if (!div) {
    throw new Error("Missing <div id='root'> in HTML")
  }

  const mount = div.innerHTML ? hydrate : render

  const basename = process.env.PUBLIC_URL
  const props = process.env.BESTATIC_OPTIONS || {}

  mount(
    <BrowserRouter basename={basename}>
      <App routes={routes} sitedata={bestatic} {...props} />
    </BrowserRouter>,
    div
  )
}

if (typeof document !== 'undefined') {
  init()
}
