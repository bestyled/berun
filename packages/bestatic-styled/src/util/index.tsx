import React from 'react'

import styled from 'styled-components'

import {
  space,
  fontSize,
  color,
  fontFamily,
  fontWeight,
  border
} from 'styled-system'

export const themed = key => props => props.theme[key]

const BlockLink = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
`

const heading = Tag => ({ id, children, ...props }) => (
  <Tag id={id} {...props}>
    <BlockLink href={'#' + id}>{children}</BlockLink>
  </Tag>
)

export const createHeading = (tag, defaultProps = {}) => {
  const Heading = styled(heading(tag))`
    ${space}
    ${fontSize}
    ${color}
    ${fontFamily}
    ${fontWeight}
    ${themed(tag)}
  `
  Heading.defaultProps = Object.assign(
    {
      fontFamily: 'header',
      fontWeight: 'header'
    },
    defaultProps
  )
  return Heading
}

export const createComponent = (tag, styles, defaultProps = {}) => {
  const Component = styled(tag)(
    [] as any,
    styles,
    space,
    fontSize,
    fontFamily,
    color,
    border,
    themed(tag)
  )
  Component.defaultProps = defaultProps
  return Component
}
