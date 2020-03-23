import * as React from 'react'
import { createContext, useContext } from 'react'

const SiteDataContext = createContext<any>({})

const { Provider, Consumer } = SiteDataContext

export const WithSiteData = Consumer

export const useSiteData = () => useContext(SiteDataContext)

export const SiteDataProvider = ({ children, ...sitedata }) => {
  return <Provider value={sitedata}>{children}</Provider>
}
