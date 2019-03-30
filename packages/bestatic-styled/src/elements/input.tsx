import React from 'react'
import styled from 'styled-components'

// todo: for checklists
export const Checkbox = styled.input``
Checkbox.defaultProps = {
  type: 'checkbox'
}

export const input = props => {
  if (props.type === 'checkbox') {
    return <Checkbox {...props} />
  }
  return <input {...props} />
}
