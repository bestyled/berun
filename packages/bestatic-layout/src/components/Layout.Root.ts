import styled, { StyledComponent } from 'styled-components'
import {
  width,
  space,
  color,
  WidthProps,
  SpaceProps,
  ColorProps
} from 'styled-system'

type CssProps = { css?: any }

const css = props => props.css

// Holy Grail Root Container
export const Root = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  ${space} ${width} ${color} ${css}
 ` as StyledComponent<SpaceProps & WidthProps & ColorProps & CssProps, any>

Root.defaultProps = {
  width: 1
}
