import * as React from 'react'
import { createContext } from 'react'

const RoutesContext = createContext<any>({})

const { Provider, Consumer } = RoutesContext

export const WithRoutes = Consumer

export const RoutesProvider = ({ children, routes = [] }) => {
  return <Provider value={routes}>{children}</Provider>
}
