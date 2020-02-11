import * as React from 'react'

const SiteDataContext = React.createContext<any>({})

const { Provider, Consumer } = SiteDataContext

export const WithSiteData = Consumer

export const useSiteData = () => React.useContext(SiteDataContext)

export class SiteDataProvider extends React.Component<any, any> {
  render() {
    const { children, ...sitedata } = this.props
    return <Provider value={sitedata}>{children}</Provider>
  }
}
