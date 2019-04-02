import React from 'react'
import styled, { StyledComponent } from 'styled-components'
import {
  space,
  color,
  maxWidth,
  SpaceProps,
  ColorProps,
  MaxWidthProps
} from 'styled-system'

type CssProps = { css?: any }
const css = props => props.css

const MainRoot = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
`

const MainContainer = styled.div`

    min-width: 0;

  ${space} ${color} ${maxWidth}  ${css}
  ` as StyledComponent<SpaceProps & ColorProps & MaxWidthProps & CssProps, any>

MainContainer.defaultProps = {
  maxWidth: '768px',
  mx: 0,
  px: 4,
  py: 4,
  color: '#333'
}

export const Main = props => (
  <MainRoot id="main-root">
    <MainContainer id="main-container" {...props} />
  </MainRoot>
)
