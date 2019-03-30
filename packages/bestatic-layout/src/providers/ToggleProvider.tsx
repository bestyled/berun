import React, { useContext, useMemo, useState } from 'react'

type ToggleContextType = {
  open?: boolean
  update?: Function
  toggleMenu?: () => any
  openMenu?: () => any
  closeMenu?: () => any
}

export const ToggleContext = React.createContext<ToggleContextType>({
  open: true
})

export function useToggle() {
  return useContext(ToggleContext)
}

export function ToggleProvider(props) {
  const [open, setOpen] = useState(true)
  function openMenu() {
    setOpen(true)
  }
  function closeMenu() {
    setOpen(false)
  }
  function toggleMenu() {
    setOpen(open => !open)
  }

  const providerValue = useMemo(
    () => ({ open, openMenu, closeMenu, toggleMenu }),
    [open]
  )

  return (
    <ToggleContext.Provider value={providerValue}>
      {props.children}
    </ToggleContext.Provider>
  )
}
