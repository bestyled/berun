/**
 * Copyright (c) 2018 Brent Jackson under MIT license from mdx-go
 * Portions copyright (c) 2018 BeStatic Contributors
 */

import React from 'react'

import styled, { StyledComponent } from 'styled-components'

import {
  space,
  fontFamily,
  fontSize,
  color,
  borderColor,
  SpaceProps,
  FontFamilyProps,
  FontSizeProps,
  ColorProps,
  BorderColorProps
} from 'styled-system'

const {
  LiveProvider,
  LivePreview,
  LiveEditor,
  LiveError
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('react-live')

const themed = key => props => props.theme[key]
const transformCode = src => `<React.Fragment>${src}</React.Fragment>`

const Root = styled.div`
  border: 1px solid;
  border-radius: 2px;
  ${space} ${borderColor} ${themed('LiveCode')}
` as StyledComponent<SpaceProps & BorderColorProps, any>

Root.defaultProps = {
  mt: 4,
  mb: 4,
  borderColor: 'lightgray'
}

const Preview = styled(LivePreview)(
  [] as any,
  space,
  themed('LivePreview')
) as StyledComponent<SpaceProps, any>

Preview.defaultProps = {
  p: 3
}

const Editor = styled(LiveEditor)`
  margin: 0;
  outline: none;
  ${fontSize}
  ${fontFamily}
  ${space}
  ${color}
  ${themed('LiveEditor')}
` as StyledComponent<
  FontSizeProps & FontFamilyProps & SpaceProps & ColorProps,
  any
>

Editor.defaultProps = {
  fontSize: 1,
  fontFamily: 'mono',
  p: 3,
  bg: 'lightgray'
}

const Err = styled(LiveError)`
 ${space} ${fontSize}
 ${fontFamily} ${color} ${themed('LiveError')}
 ` as StyledComponent<
  SpaceProps & FontSizeProps & FontFamilyProps & ColorProps,
  any
>

Err.defaultProps = {
  fontSize: 1,
  fontFamily: 'mono',
  p: 3,
  bg: 'red'
}

export const LiveCode = ({ code, ...props }) => (
  <LiveProvider
    code={code}
    transformCode={transformCode}
    mountStylesheet={false}
  >
    <Root>
      <Preview />
      <Editor />
      <Err />
    </Root>
  </LiveProvider>
)

export default LiveCode
