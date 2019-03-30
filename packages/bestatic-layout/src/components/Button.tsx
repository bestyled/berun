import styled from 'styled-components'
import { Link } from './Link'

import {
  themeGet,
  space,
  SpaceProps,
  borderRadius,
  BorderRadiusProps
} from 'styled-system'

export const Button = styled<SpaceProps & BorderRadiusProps>(Link)`
  padding: 0.7em;
  margin: 0.3em;
  text-decoration: none;
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  border-radius: 5px;
  background-color: ${p =>
    p.outline ? 'transparent' : themeGet('colors.primaryLight')(p)};
  border: ${p =>
    p.outline ? `3px solid ${themeGet('colors.primaryLight')(p)}` : undefined};
  color: ${p => themeGet('colors.textOnPrimary')(p)};
  &:hover {
    box-shadow: inset 0 0 0 999px ${p => themeGet('colors.primaryDark')(p)};
    border: ${p =>
      p.outline ? `3px solid ${themeGet('colors.primaryDark')(p)}` : undefined};
  }
  ${space} ${borderRadius}
`

Button.defaultProps = {
  px: 1,
  py: 2,
  m: 1
}

export const ButtonGroup = styled.div`
  min-height: 57px;
  margin: 10px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  max-width: 90%;
`
