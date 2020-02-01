/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeRun Contributors
 */

import React from 'react'
import StyleProvider from '@bestatic/styled'
import { WithSiteData } from '@bestatic/components'
import Layout from '../components/Layout'
import ScrollTop from '../components/ScrollTop'
import Pagination from '../components/Pagination'
import { Cards } from '../components/Cards'

export const BlogLayout = props => {
  return (
    <WithSiteData>
      {sitedata => (
        <StyleProvider title={sitedata.title}>
          <Layout>
            <Layout.TopNav center logo={sitedata.logo}>
              {sitedata.topnav.map(items => {
                ;<Layout.TopNavItem key={items.label} href={items.href}>
                  {items.label}
                </Layout.TopNavItem>
              })}
              <Layout.SearchBox />
              <Layout.ScrollAnimation />
            </Layout.TopNav>
            <Cards>
              {props.children}
              <Pagination
                filter={route => route.blog}
                px={[0, 100, 160, 270]}
                {...props}
              />
            </Cards>
            <Layout.Footer {...props} />
          </Layout>
          <ScrollTop />
        </StyleProvider>
      )}
    </WithSiteData>
  )
}

export default BlogLayout
