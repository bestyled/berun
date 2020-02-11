/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeStatic Contributors
 */

import * as React from 'react'
import LiveCode from './PreCodeLiveCode'

// Changes .jsx fenced code blocks to LiveCode
export const withLiveCode = Component => ({
  children,
  className = '',
  ...props
}) => {
  const isLive = className === 'language-.jsx'
  if (!isLive) {
    return (
      <Component {...props} className={className}>
        {children}
      </Component>
    )
  }

  const code = React.Children.toArray(children).join('\n')

  return <LiveCode code={code} />
}

export const code = withLiveCode('pre')

export const scope = {
  pre: props => props.children,
  code
}
