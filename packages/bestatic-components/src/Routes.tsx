import * as React from 'react'

const RoutesContext = React.createContext<any>({})

const { Provider, Consumer } = RoutesContext

export const WithRoutes = Consumer

export class RoutesProvider extends React.Component<any, any> {
  static defaultProps = {
    routes: []
  }

  render() {
    const { children, routes } = this.props
    return <Provider value={routes}>{children}</Provider>
  }
}
