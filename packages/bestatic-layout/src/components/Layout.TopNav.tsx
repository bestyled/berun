import * as React from 'react'
import styled, { StyledComponent } from 'styled-components'

import {
  space,
  color,
  height,
  fontSize,
  fontWeight,
  SpaceProps,
  ColorProps,
  HeightProps,
  FontSizeProps,
  FontWeightProps
} from 'styled-system'
import { Link } from './Link'
import { SignalSvgStr } from '../img/signal'

type CssProps = { css?: any }

const css = props => props.css

export const TopNavRoot = styled.header`
  flex: none;
  display: flex;
  flex-direction: column;
  order: -1;
  
  background-image: ${p =>
    `url("data:image/svg+xml;utf8,${SignalSvgStr(p.theme)}");`}
 
   align-items: ${(props: any) => (props.center ? 'center' : undefined)};
  ${space} ${height} ${color} ${css}
` as StyledComponent<SpaceProps & HeightProps & ColorProps & CssProps, any>

// background: linear-gradient(135deg, ${(p) => themeGet('colors.primaryLight', '#f6e6b4')(p)} 0%, ${(p) => themeGet('colors.secondary', '#ed9017')(p)} 100%);

TopNavRoot.defaultProps = {
  height: [80, 80, 160],
  bg: 'primary',
  color: 'textOnPrimary'
}

export const TopNavRow = styled.div`
padding: 0px;
margin-left: 50px;
display: flex;
flex-wrap: wrap;
align-items: flex-end;
z-index: 1;
  ${space} ${color} ${css} ${height}
` as StyledComponent<SpaceProps & HeightProps & ColorProps & CssProps, any>

TopNavRow.defaultProps = {
  height: [32, 35, 64],
  mx: [32, 50, 100]
}

export const TopNavItem = styled(Link)`
  display: inline-block;
  bottom: 0;
  padding-left: 7px;
  line-height: normal;
  ${space} ${color} ${css} ${fontSize} ${fontWeight}
` as StyledComponent<
  SpaceProps &
    FontSizeProps &
    FontWeightProps &
    HeightProps &
    ColorProps &
    CssProps,
  any
>

TopNavItem.defaultProps = {
  color: 'inherit',
  fontSize: 1,
  fontWeight: 'normal'
}

export const TopNavLogo = styled.div`
display: flex;
align-items: flex-end;
flex-direction: column;
bottom: 0;
font-weight: 100;
padding-left: 5px;
line-height: normal;

  ${space}${color} ${css} ${fontSize}
` as StyledComponent<
  SpaceProps & FontSizeProps & HeightProps & ColorProps & CssProps,
  any
>

TopNavLogo.defaultProps = {
  fontSize: 2
}

export const LogoItem = styled.img`
  ${space}
` as StyledComponent<SpaceProps, any>

TopNavItem.defaultProps = {
  color: 'inherit',
  fontSize: 1
}

TopNavItem.isTopNavItem = true

export const TopNav = props => {
  const Logo = props.logo
  const children = React.Children.toArray(props.children) || []
  const logoText = children.filter(
    (child: any) =>
      !(typeof child === 'object') ||
      !(child.type.isTopNavItem || child.type.isSearchBox)
  )
  const topnavitems = children.filter(
    (child: any) => typeof child === 'object' && child.type.isTopNavItem
  )
  const [searchbox] = children.filter(
    (child: any) => typeof child === 'object' && child.type.isSearchBox
  )

  return (
    <TopNavRoot center={props.center}>
      <TopNavRow>
        <TopNavLogo>
          <LogoItem src={Logo} width={16} mr={1} />
          {logoText}
        </TopNavLogo>
        {topnavitems}
      </TopNavRow>
      {searchbox}
    </TopNavRoot>
  )
}

TopNav.isTopNav = true
