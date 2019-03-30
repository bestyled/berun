import { createComponent } from '../util'

export const table = createComponent(
  'table',
  {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderColor: 'lightgray',
    '& th': {
      textAlign: 'left',
      verticalAlign: 'bottom'
    },
    '& td': {
      verticalAlign: 'top'
    },
    '& td, & th': {
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '0px',
      paddingRight: '16px',
      borderColor: 'inherit',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid'
    }
  },
  {
    mt: 4,
    mb: 4
  }
)
