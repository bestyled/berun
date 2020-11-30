/**
 * Load configuration from app Package.json,
 * a BeStatic configurationf ile in process.env.BESTATIC_CONFIG,
 * or the default configuration in './config/bestatic_default_config' in this repo
 *
 * This configuration is provided to all BeStatic components via the <SiteData> component
 */
export async function createBeStaticContext(config: { getSiteData: Function }) {

  const BESTATIC_ENV = process.env.BESTATIC_ENV || process.env.NODE_ENV

  let bestatic = {
    appPath: process.env.APP_PATH,
    workspace: process.env.WORKSPACE,
    metaWorkspace: process.env.META_WORKSPACE,
    publicUrl: process.env.PUBLIC_URL,
    remoteOriginUrl: process.env.REMOTE_ORIGIN_URL,
    title: process.env.TITLE,
    version: process.env.VERSION,
    BESTATIC_ENV,
    isProduction: BESTATIC_ENV === 'production',
    topnav: []
  } as any

  bestatic = await config.getSiteData(bestatic)

  bestatic.copyright =
    bestatic.copyright ||
    process.env.COPYRIGHT ||
    `Copyright (c) ${bestatic.company || ''} ${new Date().getFullYear()}.`

  return bestatic
}
