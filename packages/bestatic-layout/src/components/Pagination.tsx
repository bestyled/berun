/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeRun Contributors
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import styled, { StyledComponent } from 'styled-components'
import sortby from 'lodash.sortby'
import {
  space,
  fontSize,
  color,
  SpaceProps,
  FontSizeProps,
  ColorProps
} from 'styled-system'
import { Link } from './Link'

const sort = (routes, order) =>
  sortby(routes, route => {
    const index = order.indexOf(route.meta.name)
    return index < 0 ? Infinity : index
  })

const Flex = styled.div`
  flex: 0 0 12em;
  display: flex;
  ${space}
` as StyledComponent<SpaceProps, any>

const Spacer = styled.div`
  margin: auto;
`

const NavLink = styled(Link)`
  display: block;
  font-weight: bold;
  text-decoration: none;
  ${space} ${fontSize} ${color} ${props => props.css} 
` as StyledComponent<
  { href: any; css?: any } & SpaceProps & FontSizeProps & ColorProps,
  any
>

NavLink.defaultProps = {
  py: 1,
  fontSize: 2,
  color: 'primary'
}

export const Pagination = withRouter(
  ({
    routes = [],
    order = [],
    filter,
    history,
    location,
    match,
    ...props
  }: any) => {
    const { pathname } = location

    const links = sort(routes.flattened, order).filter(filter)
    //  .filter((route) => !route.children || route.menu !== false)

    const index = links.findIndex(link => link.path === pathname)
    // const current = links[index]
    const previous = links[index - 1]
    const next = links[index + 1]

    return (
      <Flex py={4}>
        {previous && (
          <NavLink {...props} href={previous.path}>
            &lsaquo; {previous.previousPage || previous.name || 'previous'}
          </NavLink>
        )}
        <Spacer />
        {next && (
          <NavLink {...props} href={next.path}>
            {next.nextPage || next.name || 'next'} &rsaquo;
          </NavLink>
        )}
      </Flex>
    )
  }
)

Pagination.defaultProps = {
  order: ['index'],
  filter: () => true
}

export default Pagination
