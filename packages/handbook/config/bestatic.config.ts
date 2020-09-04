/**
 * BeStatic Configuration
 * Place this file in ~/config/betstatic.config.js
 */

import { getLocalPages } from '@bestatic/core'
import { ServerStyleSheet } from 'styled-components'
import { theme as themeKarla } from './theme'

export default {
  getSiteData: async bestatic =>
    Object.assign({}, bestatic, {
      theme: themeKarla,
      title: 'Talent Handbook',
      copyright: `Copyright (c) Synchronous Health ${(new Date()).getFullYear()}.`,
      company: 'Synchronous Health',
      companylegalname: 'Synchronous Health, Inc.',
      companymission: 'Achieving the best of what it means to be human thus creating a kinder world.',
      logo: '/logo.svg',  /* relative to `/public` folder */
      herologo: '/herologo.svg',  
      topnav: [{ href: '/handbook', label: 'handbook'}],
      algolia: { 
        appId: process.env.BERUN_ALGOLIA_APPID, 
        apiKey: process.env.BERUN_ALGOLIA_APIKEY, 
        indexName: process.env.BERUN_ALGOLIA_INDEX
      }

      /*     
       ** in addition to the following provided by the static runner **
      appPath: path to the application,
      workspace: path to the workspace,
      publicUrl: public url of site from package json,
      remoteOriginUrl: remote origin url from package json,
      title: title from package json,
      version: version from package json,
      copyright: generic copyright notice`,
      isProduction: true or false 
      */
     
    }),
    getRoutes: async (bestatic) => {
      return await getLocalPages(bestatic)
    },
    renderToHtml: (renderToString, el ) => {
      const sheet = new ServerStyleSheet()
      const body = renderToString(sheet.collectStyles(el))
      const css = sheet.getStyleTags()
      return {body, head: css}
    }
}