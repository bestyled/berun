import React from 'react'

import styled, { StyledComponent } from 'styled-components'

import {
  space,
  color,
  height,
  fontSize,
  SpaceProps,
  ColorProps,
  HeightProps,
  FontSizeProps
} from 'styled-system'

import { useSiteData } from '@bestatic/components'
import { withRouter } from 'react-router'

type CssProps = { css?: any }

const css = props => props.css

export const FooterRoot = styled.header`
  flex: none;
  display: flex;
  flex-direction: column;
  ${space} ${height} ${color} ${css}
` as StyledComponent<SpaceProps & HeightProps & ColorProps & CssProps, any>

FooterRoot.defaultProps = {
  height: 160,
  mx: 'auto',
  color: 'text'
}

export const FooterRow = styled.div`
padding-top: 4px;
margin-left: 50px;
display: flex;
flex-wrap: wrap;
align-items: flex-end;
z-index: 1;
  ${space}${color} ${css} 
` as StyledComponent<SpaceProps & HeightProps & ColorProps & CssProps, any>

FooterRow.defaultProps = {
  mx: [25, 50, 100]
}

export const FooterItem = styled.div`
display: inline-block;
padding-left: 14px;
margin-bottom: 0;
  ${space} ${color} ${css} ${fontSize}
` as StyledComponent<
  SpaceProps & FontSizeProps & HeightProps & ColorProps & CssProps,
  any
>

FooterItem.defaultProps = {
  fontSize: 1
}

export const Footer: React.SFC = (withRouter((props: any) => {
  const sitedata = useSiteData()
  const pathname = props.match.path

  const route = props.routes.flattened.find(
    link =>
      link.path === pathname || (link.match && link.match.path === pathname)
  )

  const editUrl = new URL(
    route ? route.id : '/',
    `${sitedata.remoteOriginUrl}/blob/master/`
  )

  return (
    <FooterRoot id="footer-root">
      <FooterRow>
        <FooterItem>{sitedata.copyright}</FooterItem>
        <FooterItem>
          {sitedata.footer || <a href={editUrl.href}> Edit this page.</a>}
        </FooterItem>
      </FooterRow>
    </FooterRoot>
  )
}) as any) as React.SFC

Footer.isFooter = true

Footer.defaultProps = {
  height: 125
}

Footer.isFooter = true
