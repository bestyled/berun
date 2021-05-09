import * as React from 'react'
import styled, { StyledComponent, keyframes } from 'styled-components'
import StyleProvider from '@bestatic/styled'
import { ScrollTop, Link } from '@bestatic/layout'
import { WithSiteData } from '@bestatic/components'

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

interface CssProps {
  css?: any
}

const css = (props) => props.css

const HeroFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 0.7em;
  ${space} ${height} ${color} ${css} ${fontSize} ${fontWeight}
` as StyledComponent<
  SpaceProps &
    HeightProps &
    ColorProps &
    FontSizeProps &
    FontWeightProps &
    CssProps,
  any
>

HeroFooter.defaultProps = {
  color: 'textOnColor',
  fontWeight: 'normal',
  m: 2
}

const slideIn = keyframes`
  0% {
    transform: translateY(-48px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
`

// hero.jpg by segmentio under MIT License
const HeroRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url(/hero.jpg);
  background-size: cover;
  align-items: center;
  justify-content: center;

  & h1 a::before {
    background: ${(p: any) => `url("${p.logo}") no-repeat center;`};
    background-size: 96px 96px;
    display: block;
    height: 128px;
    content: '';
    animation: ${slideIn} 0.5s ease-out;
  }

  & h1 {
    text-align: center;
    font-weight: 100;
  }

  & p {
    text-align: center;
  }

  ${space} ${height} ${color} ${css} ${fontSize}
` as StyledComponent<
  SpaceProps & HeightProps & ColorProps & FontSizeProps & CssProps,
  any
>

HeroRoot.defaultProps = {
  color: 'textOnColor'
}

const Hero = styled.div`
  flex: 1 0;
  ${space} ${height} ${color} ${css} ${fontSize}
` as StyledComponent<
  SpaceProps & HeightProps & ColorProps & FontSizeProps & CssProps,
  any
>

Hero.defaultProps = {
  color: 'textOnColor'
}

export const HeroLayout = (props) => {
  return (
    <WithSiteData>
      {(sitedata) => (
        <StyleProvider title={sitedata.title} theme={sitedata.theme}>
          <HeroRoot logo={sitedata.herologo || sitedata.logo}>
            {props.children}
          </HeroRoot>
          <HeroFooter>
            {sitedata.footer ? (
              <Link href={sitedata.footer.href}>{sitedata.footer.label}</Link>
            ) : (
              <Link href="https://github.com/berun/berun">BeStatic Docs</Link>
            )}
          </HeroFooter>
          <ScrollTop />
        </StyleProvider>
      )}
    </WithSiteData>
  )
}

export default HeroLayout
