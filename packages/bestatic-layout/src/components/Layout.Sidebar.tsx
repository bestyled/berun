import React from 'react'
import styled, { StyledComponent } from 'styled-components'

import {
  width,
  space,
  color,
  display,
  style,
  WidthProps,
  SpaceProps,
  ColorProps,
  DisplayProps,
  themeGet
} from 'styled-system'

type CssProps = { css?: any }

const css = props => props.css

const transform = style({
  prop: 'transform',
  cssProperty: 'transform'
})

const SidebarColumn = styled.div`
    flex: 0 0 12em;
    order: -1;
    border-right: 1px solid rgba(0,0,0,.07);

    max-width: 100%


    @media screen and (min-width: ${(props: any) =>
      themeGet('breakpoints', ['48em'])(props)[1]}) {
      max-width: 100%;
    }

    transition-duration: 200ms;
    transition-delay: 1ms;
    transition: max-width 0.2s;
    transition-timing-function: ease;
    overflow: hidden;
    
    ${display} ${space} ${width} ${color}
    ${transform}
    ${css}` as StyledComponent<
  React.HTMLProps<any> &
    SpaceProps &
    WidthProps &
    ColorProps &
    DisplayProps & { transform?: any } & CssProps,
  any
>

SidebarColumn.defaultProps = {
  py: 3,
  display: ['block', 'block'],
  transform: [false, 'none !important']
}

export const Sidebar: React.FC<any> = ({ width, style, ...props }) => {
  return (
    <SidebarColumn
      {...props}
      width={width}
      style={{
        ...style
      }}
    />
  )
}

Sidebar.defaultProps = {
  color: '#333'
}
