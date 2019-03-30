/**
 * BeStatic Configuration
 * Place this file in your config /folder
 */

import { getLocalPages } from '@bestatic/core'
import { ServerStyleSheet } from 'styled-components'
import React from 'react'

export default {
  getSiteData: async bestatic => Object.assign({}, bestatic),
  getRoutes: async bestatic => {
    return await getLocalPages(bestatic)
  },
  renderToHtml: (renderToString, el) => {
    const sheet = new ServerStyleSheet()
    const body = renderToString(sheet.collectStyles(el))
    const css = sheet.getStyleTags()
    return { body, head: css }
  }
}
