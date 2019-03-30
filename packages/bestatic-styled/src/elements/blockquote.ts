import { createComponent } from '../util'
import { themeGet } from 'styled-system'

export const blockquote = createComponent(
  'blockquote',
  props => ({
    borderLeft: '5px solid',
    borderLeftColor: themeGet('colors.primary')(props)
  }),
  {
    mt: 4,
    mb: 4,
    mx: 0,
    px: 3,
    py: 3,
    fontSize: 2,
    bg: 'primaryLight',
    color: 'textOnPrimaryLight',
    ['data-sal']: 'fade',
    ['data-sal-delay']: '150'
  }
)
