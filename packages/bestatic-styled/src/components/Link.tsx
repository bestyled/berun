/* eslint-disable jsx-a11y/anchor-has-content */
/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018-2020 BeStatic Contributors
 */

import React from 'react'
import { NavLink } from 'react-router-dom'
import isAbsolute from 'is-absolute-url'

export default ({ href, staticContext = null, ...props }) =>
  isAbsolute(href) ? (
    <a {...props} href={href} />
  ) : (
    <NavLink {...props} to={href} />
  )
