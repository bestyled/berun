/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeRun Contributors
 */

import * as React from 'react'
import styled from 'styled-components'
import sortby from 'lodash.sortby'

import { space, fontSize, color, themeGet } from 'styled-system'

import { Link } from './Link'

const sort = (routes, order) =>
  sortby(routes, route => {
    const index = order.indexOf(route.meta.name)
    return index < 0 ? Infinity : index
  })

const css = props => props.css

export const NavLink = styled(Link)`
  display: block;
  width: 100%;
  text-decoration: none;
  ${props => ({
    '&.active': {
      color: themeGet('colors.primary', 'blue')(props)
    }
  })}
  ${space} ${fontSize} ${color} ${css}
`

NavLink.defaultProps = {
  px: 3,
  py: 1,
  fontSize: 1,
  color: 'inherit'
}

const SubNavLinks = ({ items, href, ...props }) =>
  items.map(route => (
    <NavLink
      key={route.key}
      {...props}
      href={route.path}
      exact={route.exact}
      children={route.meta.name}
      px={4}
    />
  ))

export const NavLinks: React.SFC<any> = ({
  routes = [],
  order = [],
  filter,
  staticContext,
  ...props
}) => {
  return (
    <>
      {sort(routes, order)
        .filter(filter)
        .filter(route => route.menu !== false)
        .map(route => (
          <React.Fragment key={route.key}>
            <NavLink
              key={route.key}
              {...props}
              href={route.path}
              exact={route.exact}
              children={route.meta.name}
            />
            {route.children && route.match && (
              <SubNavLinks
                key={`${route.key}-sub`}
                href={route.path}
                items={route.children}
              />
            )}
          </React.Fragment>
        ))}
    </>
  )
}

NavLinks.defaultProps = {
  order: ['index'],
  filter: () => true
}

export default NavLinks
