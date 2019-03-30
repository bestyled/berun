import React from 'react'
import styled, { StyledComponent } from 'styled-components'
import {
  width,
  space,
  color,
  style,
  WidthProps,
  SpaceProps,
  ColorProps
} from 'styled-system'

type CssProps = { css?: any }

const css = props => props.css

const transform = style({
  prop: 'transform',
  cssProperty: 'transform'
})

/**
 * Accent Bar (Right Side Promotion Column)
 */
export const AccentBar = styled.div`
    flex: 0 0 12em;
    ${space} ${width} ${color}
    ${transform}
    ${css}` as StyledComponent<
  React.HTMLProps<any> &
    SpaceProps &
    WidthProps &
    ColorProps & { transform?: any } & CssProps,
  any
>

AccentBar.defaultProps = {
  transform: [false, 'none !important']
}
