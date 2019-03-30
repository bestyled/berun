export interface IRoute {
  /**
   * The path of the source component, relative to your App folder
   */

  key: string

  /**
   * The extension type
   */

  extname: string

  /**
   * The name of this component, either the basename or as provided in meta data
   */

  name: string

  /**
   * Flag if this is the index route;
   * used for onlyActiveOnIndex Link or IndexLink components
   */

  exact: boolean

  /**
   * The directory portion of the path of the URL to match for this route,
   * relative to your siteRoot + basePath
   */

  dirname: string

  /**
   * The path of the URL to match for this route, excluding search parameters and hash fragments,
   * relative to your siteRoot + basePath
   */

  path: string

  /**
   * An async function that returns or resolves an object of any necessary data for this route to render.
   */
  getData?: (resolveRoute: {}, bestatic: IBeStatic) => Promise<any>

  /**
   * The React Component used to render this route
   */
  Component: React.ComponentClass<any> | React.SFC<any>
}

export interface IConfig {
  getRoutes: (bestatic: IBeStatic) => Promise<IRoute[]>
  getSiteData: (bestatic: IBeStatic) => Promise<any>
}

export interface IBeStatic {
  appPath: string
  workspace: string
  publicUrl: string
  remoteOriginUrl: string
  title: string
  version: string
  BESTATIC_ENV: string
  isProduction: boolean
}

export { renderToString, renderToStaticMarkup } from 'react-dom/server'
