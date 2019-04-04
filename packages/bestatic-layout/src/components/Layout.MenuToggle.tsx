/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeRun Contributors
 */

import React from 'react'

import styled, { StyledComponent, withTheme } from 'styled-components'

import {
  space,
  color,
  display,
  SpaceProps,
  ColorProps,
  DisplayProps,
  themeGet
} from 'styled-system'

import { Container } from './Layout.Container'

const MenuIcon = withTheme(styled(({ size = 24, className, ...props }: any) => (
  <svg
    x="0"
    y="0"
    className={className}
    width={size}
    height={size}
    viewBox="0, 0, 24, 24"
  >
    <g id="Layer_1">
      <path
        d="M3,18 L21,18 L21,16 L3,16 L3,18 z M3,13 L21,13 L21,11 L3,11 L3,13 z M3,6 L3,8 L21,8 L21,6 L3,6 z"
        fill={themeGet('colors.textOnPrimary', '#300')(props)}
      />
    </g>
  </svg>
))`
  display: block;
`)

type CssProps = { css?: any }
const css = props => props.css

const MenuButton = styled.label`
    font-size: inherit;
    font-family: inherit;
    border: 0;
    border-radius: 0;
    top: 0;
    left: 0;
    position: fixed;
    transition: transform 0.3s;

   ${space} ${color} ${css} ${display}
  ` as StyledComponent<
  SpaceProps & ColorProps & DisplayProps & CssProps & React.HTMLProps<{}>,
  any
>

MenuButton.defaultProps = {
  bg: 'transparent',
  p: 0,
  m: 0,
  title: 'Toggle Menu',
  children: <MenuIcon />,
  display: ['inline-block', 'inline-block', 'none']
}

const MenuHiddenToggle = styled.input`
  top: 0;
  left: 0;
  position: absolute;
  display: none;

  &:checked ~ label {
    transform: rotate(90deg);
  }

  & + div {
    max-width: 0;
    transition: max-width 0.3s;

    @media screen and (min-width: ${(props: any) =>
        themeGet('breakpoints', ['48em'])(props)[1]}) {
      max-width: 100% !important;
    }
  }

  &:checked + div {
    max-width: 100%;
    transition: max-width 1s;
  }
`

export const MenuToggle: React.FC<any> = ({ children, ...props }) => {
  return (
    <Container id="menu-toggle-container" {...props}>
      <MenuHiddenToggle type="checkbox" id="toggle-1" />
      {children}
      <MenuButton {...props} htmlFor="toggle-1" />
    </Container>
  )
}

MenuToggle['isMenuToggle'] = true
