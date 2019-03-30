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

import { useToggle } from '../providers/ToggleProvider'

type CssProps = { css?: any }
const css = props => props.css

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

const MenuButton = styled('button')`
    appearance: none;
    font-size: inherit;
    font-family: inherit;
    border: 0;
    border-radius: 0;
    top: 0;
    left: 0;
    position: absolute;
   ${space} ${color} ${css} ${display}
  ` as StyledComponent<
  SpaceProps & ColorProps & DisplayProps & CssProps & React.HTMLProps<{}>,
  any
>

MenuButton.defaultProps = {
  bg: 'transparent',
  p: 0,
  m: 0,
  display: ['inline-block', 'inline-block', 'none']
}

export const MenuToggle: React.FC<any> = ({ children, ...props }) => {
  const { open, toggleMenu } = useToggle()

  return typeof children === 'function' ? (
    children({ open, toggleMenu })
  ) : (
    <MenuButton {...props} onClick={toggleMenu}>
      {children}
    </MenuButton>
  )
}

MenuToggle.defaultProps = {
  title: 'Toggle Menu',
  children: <MenuIcon />
}

MenuToggle['isMenuToggle'] = true
