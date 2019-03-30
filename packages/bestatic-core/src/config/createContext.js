/**
 * Load configuration from app Package.json,
 * a BeStatic configurationf ile in process.env.BESTATIC_CONFIG,
 * or the default configuration in './config/bestatic_default_config' in this repo
 *
 * This configuration is provided to all BeStatic components via the <SiteData> component
 */
export function createContext() {
  const BESTATIC_ENV = process.env.BESTATIC_ENV || process.env.NODE_ENV

  return {
    appPath: process.env.APP_PATH,
    workspace: process.env.WORKSPACE,
    publicUrl: process.env.PUBLIC_URL,
    remoteOriginUrl: process.env.REMOTE_ORIGIN_URL,
    title: process.env.TITLE,
    version: process.env.VERSION,
    copyright:
      process.env.COPYRIGHT || `Copyright (c) ${new Date().getFullYear()}.`,
    BESTATIC_ENV: BESTATIC_ENV,
    isProduction: BESTATIC_ENV == 'production'
  }
}
