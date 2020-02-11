import * as React from 'react'

import styled, {
  createGlobalStyle,
  ThemeProvider,
  StyledComponent
} from 'styled-components'

import {
  fontSize,
  fontFamily,
  lineHeight,
  color,
  LineHeightProps,
  FontSizeProps,
  FontFamilyProps,
  ColorProps,
  themeGet
} from 'styled-system'
import { Head } from '@bestatic/layout'
import { useSiteData } from '@bestatic/components'
import { MdScopeProvider } from './MdScopeProvider'

import elements from '../elements'

import { theme } from '../theme/default'

import { GlobalPrismStyle } from './PrismStyleProvider'

const GlobalStyle = createGlobalStyle`
a {
  text-decoration: none;
  color: ${props => themeGet('colors.primary', 'blue')(props)}
}

${props => ({
  body: {
    fontWeight: themeGet('fontWeights.normal', 400)(props),
    fontFamily: themeGet('fonts.body', 'system-ui,sans-serif')(props)
  }
})}
`

type RootProps = {
  css?: any
}

const HeadHelmet = props => {
  const weightsObj = themeGet('fontWeights', { normal: 400 })(props)

  const weights = Object.keys(weightsObj)
    .map(k => weightsObj[k])
    .join(',')

  const result = themeGet(
    'googleFonts',
    []
  )(props)
    .map(i =>
      React.createElement('link', {
        id: i,
        key: i,
        href: `https://fonts.googleapis.com/css?family=${i}:${weights}`,
        rel: 'stylesheet'
      })
    )
    .concat([React.createElement('title', { key: 'title' }, props.title)])

  return <Head>{result}</Head>
}

const Root = styled.div`
  ${fontSize}
  ${fontFamily}
  ${lineHeight}
  ${color}
  ${(props: RootProps) => props.css} 
` as StyledComponent<
  RootProps & FontSizeProps & FontFamilyProps & ColorProps & LineHeightProps,
  any
>

Root.defaultProps = {
  lineHeight: 1.5
}

export const StyleProvider: React.SFC<{
  components?: {}
  theme?: {}
  [key: string]: any
}> = ({ components = {}, theme = {}, title = 'Docs', ...props }) => {
  const siteData = useSiteData()

  return (
    <ThemeProvider theme={theme}>
      <MdScopeProvider
        components={{
          ...elements,
          ...components
        }}
      >
        <>
          <Root {...props} />
          <HeadHelmet title={siteData.title} theme={theme} />
          <GlobalStyle theme={theme} />
          <GlobalPrismStyle theme={theme} />
        </>
      </MdScopeProvider>
    </ThemeProvider>
  )
}

StyleProvider.defaultProps = {
  theme
}

export default StyleProvider
