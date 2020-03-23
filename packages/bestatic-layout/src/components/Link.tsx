/* eslint-disable jsx-a11y/anchor-has-content */
/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeStatic Contributors
 */

import * as React from 'react'
import { NavLink } from 'react-router-dom'
import isAbsolute from 'is-absolute-url'

export const Link = ({ href, staticContext = null, ...props }) => {
  return isAbsolute(href) ? (
    <a {...props} href={href} />
  ) : (
    <NavLink {...props} to={href} />
  )
}
