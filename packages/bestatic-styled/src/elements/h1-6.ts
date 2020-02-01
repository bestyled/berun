import { createHeading } from '../util'

export const h1 = createHeading('h1', {
  mt: 3,
  mb: 2,
  fontSize: [5, null, 6],
  'data-sal': 'slide-up',
  'data-sal-delay': '100'
})
export const h2 = createHeading('h2', { mt: 3, mb: 2, fontSize: [4, null, 5] })
export const h3 = createHeading('h3', { mt: 3, mb: 2, fontSize: [3] })
export const h4 = createHeading('h4', { mt: 3, mb: 2, fontSize: [2] })
export const h5 = createHeading('h5', { mt: 3, mb: 2, fontSize: [1] })
export const h6 = createHeading('h6', { mt: 3, mb: 2, fontSize: [0] })
