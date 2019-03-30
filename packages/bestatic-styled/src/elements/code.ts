import { createComponent } from '../util'
import { withLiveCode } from '../components/PreCode'

export const inlineCode = createComponent('code', {}, { fontFamily: 'mono' })

export const pre = createComponent(
  'pre',
  {
    overflow: 'auto',
    borderRadius: '2px'
  },
  {
    fontFamily: 'mono',
    fontSize: 1,
    p: 3,
    mt: 4,
    mb: 4,
    bg: 'lightgray'
  }
)

export const code = withLiveCode(pre)
