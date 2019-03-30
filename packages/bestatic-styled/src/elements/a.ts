import styled from 'styled-components'
import { color } from 'styled-system'
import Link from '../components/Link'
import { themed } from '../util'

export const a = styled(Link)`
  text-decoration: none;
  ${color} ${themed('a')}
`

a.defaultProps = {
  color: 'primary'
}

/* ({ href = "#", ...props }) =>
      isAbsolute(href) ? <a {...props} href={href} /> : <Link {...props} to={href} /> */
