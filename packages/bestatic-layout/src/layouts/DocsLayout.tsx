/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeRun Contributors
 */

import * as React from 'react'
import StyleProvider from '@bestatic/styled'
import { Layout, NavLinks, Pagination, ScrollTop } from '@bestatic/layout'
import { WithSiteData } from '@bestatic/components'

export const DocsLayout = props => (
  <WithSiteData>
    {sitedata => (
      <StyleProvider title={sitedata.title} theme={sitedata.theme}>
        <Layout>
          <Layout.TopNav logo={sitedata.logo}>
            <Layout.TopNavItem
              px={0}
              fontWeight="thin"
              fontSize={1}
              href={sitedata.publicUrl}
            >
              {sitedata.title}
            </Layout.TopNavItem>
            {sitedata.topnav.map(items => {
              ;<Layout.TopNavItem key={items.label} href={items.href}>
                {items.label}
              </Layout.TopNavItem>
            })}
            <Layout.SearchBox />
            <Layout.ScrollAnimation />
          </Layout.TopNav>
          <Layout.MenuToggle m={2}>
            <Layout.Sidebar py={3}>
              <NavLinks {...props} />
            </Layout.Sidebar>
            <Layout.Main>
              {props.children}
              <Pagination {...props} />
            </Layout.Main>
          </Layout.MenuToggle>
          <Layout.Footer {...props} />
        </Layout>
        <ScrollTop />
      </StyleProvider>
    )}
  </WithSiteData>
)

export default DocsLayout
