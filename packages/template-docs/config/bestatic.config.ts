/**
 * BeStatic Configuration
 * Place this file in ~/config/betstatic.config.js
 */

import { getLocalPages, getBlogPages } from '@bestatic/core'
import { ServerStyleSheet } from 'styled-components'
import axios from 'axios'
import { BlogLayout, Post } from '@bestatic/layout'

export default {
  getSiteData: async bestatic => ({
    ...bestatic,
    title: 'BeRun Docs',
    blog: 'BeRun Blog',
    logo: '/logo.svg',
    topnav: [{ href: '/blog', label: 'blog' }],
    algolia: { indexName: 'docsearch' }
  }),
  getRoutes: async bestatic => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    const { data: users } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    )
    posts.forEach(post => {
      post.user = users.find(user => user.id === post.userId)
    })

    const localPages = await getLocalPages(bestatic)
    const blogPages = await getBlogPages({
      Layout: BlogLayout,
      Component: Post,
      items: posts
    })

    return [...localPages, ...blogPages]
  },
  renderToHtml: (renderToString, el) => {
    const sheet = new ServerStyleSheet()
    const body = renderToString(sheet.collectStyles(el))
    const css = sheet.getStyleTags()
    return { body, head: css }
  }
}
