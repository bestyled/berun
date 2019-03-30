/**
 * BeStatic Configuration
 * Place this file in ~/config/betstatic.config.js
 */

import React from 'react'
import { getLocalPages, getBlogPages } from '@bestatic/core'
import { ServerStyleSheet } from 'styled-components'
import { BlogLayout, Post, BeStyledLogo } from '@bestatic/layout'

export default {
  getSiteData: async bestatic =>
    Object.assign({}, bestatic, {
      title: 'BeRun Platform',
      blog: 'BeRun Blog',
      logo: '/logo.svg'
    }),
  getRoutes: async bestatic => {
    const localPages = await getLocalPages(bestatic)

    return [...localPages]
  },
  renderToHtml: (renderToString, el) => {
    const sheet = new ServerStyleSheet()
    const body = renderToString(sheet.collectStyles(el))
    const css = sheet.getStyleTags()
    return { body, head: css }
  }
}
