import styled, { StyledComponent } from 'styled-components'
import {
  width,
  space,
  color,
  borderRadius,
  WidthProps,
  SpaceProps,
  ColorProps,
  BorderRadiusProps
} from 'styled-system'

type CssProps = { css?: any }

const css = props => props.css

// Holy Grail Body Container
export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0,0,0,.5);
  ${space} ${width} ${color} ${css} ${borderRadius}
 ` as StyledComponent<
  SpaceProps & WidthProps & ColorProps & BorderRadiusProps & CssProps,
  any
>

Container.defaultProps = {
  mt: [-40, -40, -90],
  mx: [0, 50, 100],
  bg: 'white',
  borderRadius: [0, 2]
}
